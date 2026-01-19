# Mega Menu Spacing & Width Configuration Plan

## Overview
This document outlines two improvements to the mega menu dropdown system:
1. Add configurable spacing between menu item and dropdown
2. Add dropdown width options (navigation width vs. header width)

## Issue 1: Dropdown Spacing

### Current Behavior
- Dropdown appears immediately below menu item with minimal gap
- Defined in `style.scss:85` as `top: calc(100% + 0.5rem)`
- This 0.5rem (~8px) spacing is too small and creates visual crowding

### Proposed Solution
Add a configurable `dropdownSpacing` attribute that controls the vertical gap between the menu item and the dropdown panel.

#### Implementation Details

**1. Add attribute to block.json**
```json
"dropdownSpacing": {
  "type": "number",
  "default": 16
}
```
- Value in pixels
- Default: 16px (double the current 8px)
- Range: 0-48px (reasonable min/max)

**2. Update style.scss**
```scss
.wp-block-elayne-mega-menu--layout-dropdown {
  .wp-block-elayne-mega-menu__panel {
    top: calc(100% + var(--mm-dropdown-spacing, 16px));
  }
}
```

**3. Update edit.js**
- Add `RangeControl` to Layout panel
- Label: "Dropdown Spacing"
- Min: 0, Max: 48, Step: 2
- Help text: "Vertical space between menu item and dropdown (in pixels)"
- Only visible when `layoutMode === 'dropdown'`
- Apply CSS variable to wrapper div:
  ```jsx
  style={{
    '--mm-dropdown-spacing': `${dropdownSpacing}px`
  }}
  ```

**4. Update render.php**
- Add CSS variable to wrapper element:
  ```php
  'style' => sprintf('--mm-dropdown-spacing: %dpx', $dropdown_spacing)
  ```

### Benefits
- Prevents visual crowding
- Improves hover experience (larger gap = easier to move mouse without closing)
- Gives users control over spacing to match their design

---

## Issue 2: Dropdown Width Configuration

### Current Behavior
- Dropdown uses `min-width: min(600px, calc(100vw - 40px))`
- Width is approximately the navigation bar width (constrained content area)
- Cannot match full header width (`.alignwide` constraint to `--wp--style--global--wide-size`)

### User Need
The user wants dropdown to optionally span the **full header width** (from logo to social icons), not just the navigation bar width.

#### Challenge: Understanding Width Constraints
The dropdown width is currently limited by:
1. **Navigation container width** - The immediate parent container
2. **Header layout constraints** - `.alignwide` applies `max-width: var(--wp--style--global--wide-size)`
3. **Viewport constraints** - `calc(100vw - 40px)` prevents overflow

To span "logo to social icons" width, the dropdown needs to break out of the navigation container and align to the header's `.alignwide` container.

### Proposed Solution
Add a `dropdownWidth` attribute with three options:
1. **Auto** (default) - Current behavior (min-width: 600px, constrained to viewport)
2. **Navigation Width** - Match the navigation bar container width
3. **Header Width** - Match the header's `.alignwide` container (typically wider)

#### Implementation Details

**1. Add attribute to block.json**
```json
"dropdownWidth": {
  "type": "string",
  "default": "auto",
  "enum": ["auto", "navigation", "header"]
}
```

**2. Update style.scss**
Add three width modes:

```scss
.wp-block-elayne-mega-menu--layout-dropdown {
  .wp-block-elayne-mega-menu__panel {
    // Mode 1: Auto (default - current behavior)
    &.mm-width-auto {
      width: auto;
      min-width: min(600px, calc(100vw - 40px));
      max-width: calc(100vw - 40px);
    }

    // Mode 2: Navigation Width
    &.mm-width-navigation {
      // Get the width of the parent navigation container
      // This is the navigation bar width
      width: 100%;
      max-width: 100vw;
      left: 0;
      right: auto;
    }

    // Mode 3: Header Width (alignwide container)
    &.mm-width-header {
      // Break out of navigation and align to nearest .alignwide ancestor
      // Requires calculating offset from navigation to header container

      // Strategy: Use CSS container queries or JavaScript positioning
      // For CSS-only approach:
      width: var(--wp--style--global--wide-size, 1280px);
      max-width: calc(100vw - 40px);

      // Position relative to navigation item but sized to header
      left: 50%;
      transform: translateX(-50%);
    }
  }
}
```

**3. Update edit.js**
- Add `SelectControl` to Layout panel
- Label: "Dropdown Width"
- Options:
  - `{ label: 'Auto (600px minimum)', value: 'auto' }`
  - `{ label: 'Navigation Width', value: 'navigation' }`
  - `{ label: 'Header Width (alignwide)', value: 'header' }`
- Help text: "Controls the maximum width of the dropdown panel"
- Only visible when `layoutMode === 'dropdown'`
- Apply class to panel element: `mm-width-${dropdownWidth}`

**4. Update render.php**
- Add class to panel element:
  ```php
  $panel_classes[] = 'mm-width-' . $attributes['dropdownWidth'];
  ```

#### Technical Challenge: Header Width Detection

The "Header Width" option is complex because:

1. **No direct parent relationship** - The mega menu is inside navigation, which is inside header
2. **Variable header structure** - Headers can have different layouts (`.alignwide`, `.alignfull`, custom)
3. **Dynamic positioning** - Need to calculate offset from menu item to header container edge

**Proposed JavaScript Enhancement (Optional):**

Add JavaScript to `view.js` to dynamically calculate header width:

```javascript
// When dropdown opens, calculate header width and position
actions.openMenu() {
  const menuItem = context.menuRef;
  const header = menuItem.closest('.wp-block-group.alignwide, header.alignwide');

  if (header && context.dropdownWidth === 'header') {
    const panel = menuItem.querySelector('.wp-block-elayne-mega-menu__panel');
    const headerRect = header.getBoundingClientRect();
    const menuRect = menuItem.getBoundingClientRect();

    // Calculate offset from menu item to header left edge
    const leftOffset = menuRect.left - headerRect.left;

    panel.style.width = `${headerRect.width}px`;
    panel.style.left = `-${leftOffset}px`;
  }
}
```

This approach:
- Finds the nearest `.alignwide` header container
- Calculates the width of the header
- Positions the dropdown to align with header edges
- Only runs when `dropdownWidth === 'header'`

### Alternative: CSS-Only Approach

If JavaScript is undesirable, use CSS custom properties set on the header:

**In theme (required for Header Width mode):**
```css
.wp-block-group.alignwide,
header.alignwide {
  --header-width: var(--wp--style--global--wide-size);
}
```

**In mega-menu style.scss:**
```scss
&.mm-width-header {
  width: var(--header-width, var(--wp--style--global--wide-size, 1280px));
  max-width: calc(100vw - 40px);
  left: 50%;
  transform: translateX(-50%);
}
```

**Trade-off:**
- ✅ No JavaScript required
- ✅ Uses standard CSS variables
- ❌ Requires theme cooperation (Elayne theme would need to define `--header-width`)
- ❌ Centering may not align perfectly with header edges

### Benefits
- **Auto mode** - Current behavior, works everywhere
- **Navigation mode** - Simple, matches nav container width
- **Header mode** - Achieves user's goal of "logo to social icons" width
- Progressive enhancement - Basic modes work without JavaScript

---

## Implementation Phases

### Phase 1: Dropdown Spacing (Quick Win)
1. Add `dropdownSpacing` attribute to block.json
2. Update style.scss with CSS variable
3. Add RangeControl to edit.js Layout panel
4. Update render.php to output CSS variable
5. Test on demo site
6. Update CHANGELOG.md

**Estimated complexity:** Low (30 minutes)

### Phase 2: Dropdown Width - Auto & Navigation Modes
1. Add `dropdownWidth` attribute to block.json
2. Add SelectControl to edit.js Layout panel
3. Implement `mm-width-auto` and `mm-width-navigation` CSS classes
4. Update render.php to add classes
5. Test both modes on demo site

**Estimated complexity:** Medium (1 hour)

### Phase 3: Dropdown Width - Header Mode (Advanced)
1. Implement JavaScript positioning in view.js
2. Add header width calculation logic
3. Test with various header layouts (alignwide, alignfull, custom)
4. Add fallback behavior for when header isn't found
5. Document theme requirements in README.md

**Estimated complexity:** High (2-3 hours)

### Phase 4: Documentation & Polish
1. Update mega-menu README.md with new options
2. Add screenshots showing spacing and width differences
3. Update CHANGELOG.md with detailed feature list
4. Test on mobile (ensure responsive behavior)
5. Test with all layout modes (dropdown, overlay)

**Estimated complexity:** Medium (1 hour)

---

## Testing Checklist

### Dropdown Spacing
- [ ] Default 16px spacing renders correctly
- [ ] Spacing adjusts in editor preview
- [ ] Spacing persists on frontend
- [ ] Min/max values (0-48px) work as expected
- [ ] Spacing doesn't affect overlay mode
- [ ] Mobile responsive behavior maintains spacing

### Dropdown Width - Auto Mode
- [ ] Current behavior unchanged (600px min-width)
- [ ] Respects viewport constraints (no overflow)
- [ ] Works with all dropdown alignments (left, right, center)

### Dropdown Width - Navigation Mode
- [ ] Dropdown spans full navigation container width
- [ ] Aligns properly with navigation edges
- [ ] Responsive on mobile (doesn't break layout)
- [ ] Works with all dropdown alignments

### Dropdown Width - Header Mode
- [ ] JavaScript calculates header width correctly
- [ ] Dropdown aligns to header left/right edges
- [ ] Fallback to navigation mode if header not found
- [ ] Repositions on window resize
- [ ] Works with various header structures
- [ ] Mobile responsive (falls back to full-width)

---

## Documentation Requirements

### README.md Updates

Add new section under "Layout Options":

```markdown
#### Dropdown Spacing

Control the vertical gap between the menu item and the dropdown panel:

- **Range:** 0-48px
- **Default:** 16px
- **Recommendation:** 12-24px for optimal hover experience

#### Dropdown Width

Control the maximum width of the dropdown panel:

- **Auto (Default):** Minimum 600px width, adapts to content
- **Navigation Width:** Matches the navigation bar container width
- **Header Width:** Matches the header container width (typically wider)

**Note:** Header Width mode requires the header to have a `.alignwide` class or
`--header-width` CSS variable defined. Works best with the Elayne theme.
```

### CHANGELOG.md Entry

```markdown
## [2.4.2] - 2026-01-XX

### Added
- Mega menu dropdown spacing control (0-48px range, 16px default)
- Mega menu dropdown width modes: Auto, Navigation Width, Header Width
- Mega menu Header Width mode with automatic header container detection

### Changed
- Mega menu default dropdown spacing increased from 8px to 16px for better visual separation
- Mega menu dropdown now supports three width modes for flexible layout control

### Fixed
- Mega menu dropdown spacing now configurable to prevent visual crowding
```

---

## Edge Cases & Considerations

### Spacing Edge Cases
1. **Very large spacing (>40px)** - May feel disconnected from menu item
2. **Zero spacing** - Dropdown may feel too cramped
3. **Mobile behavior** - Should spacing adjust on mobile? (Suggest: use same value)

### Width Edge Cases
1. **Narrow viewports** - Header Width mode may exceed viewport (apply max-width: 100vw)
2. **Multiple navigation bars** - Which one to use for Navigation Width? (Use immediate parent)
3. **No header container** - Header Width mode should gracefully fall back to Auto mode
4. **Nested alignwide containers** - Use closest ancestor, not furthest
5. **RTL layouts** - Ensure left/right positioning flips correctly

### Browser Compatibility
- CSS custom properties: IE11 not supported (acceptable for modern WordPress)
- Container queries: Limited support (avoid for now)
- JavaScript positioning: All modern browsers supported

---

## Questions for Clarification

1. **Header Width Implementation Preference:**
   - Should we use JavaScript positioning (more accurate) or CSS-only (simpler)?
   - Is theme cooperation acceptable (defining `--header-width` variable)?

2. **Default Spacing:**
   - Is 16px (double current) the right default spacing?
   - Or should we keep 8px as default and let users increase?

3. **Width Mode Naming:**
   - Are "Auto / Navigation Width / Header Width" clear enough?
   - Alternative: "Compact / Full Navigation / Full Header"?

4. **Mobile Behavior:**
   - Should all width modes become full-width on mobile?
   - Or maintain proportional relationships?

5. **Compatibility:**
   - Should Header Width mode work with non-Elayne themes?
   - If yes, we need robust header detection logic

---

## Success Metrics

### User Goals Achieved
- ✅ Dropdown has comfortable spacing from menu item (prevents crowding)
- ✅ Dropdown can match navigation bar width (for compact menus)
- ✅ Dropdown can match header width "from logo to social icons" (user's request)
- ✅ User has full control over spacing and width

### Code Quality
- ✅ Backward compatible (existing menus use default spacing)
- ✅ CSS-first approach (minimal JavaScript)
- ✅ Responsive behavior maintained
- ✅ Accessible (no impact on keyboard navigation)
- ✅ Performant (no layout thrashing)

### Documentation
- ✅ Clear README.md instructions for each mode
- ✅ Screenshots showing visual differences
- ✅ Theme integration notes for Header Width mode
- ✅ CHANGELOG.md entries for all changes

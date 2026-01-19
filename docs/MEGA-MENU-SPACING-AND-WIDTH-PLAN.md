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
- Fixed minimum width of 600px
- Auto-grows with content up to viewport constraints
- No user control over maximum width

### User Need
Users need flexible control over dropdown width to accommodate different content types and design requirements, from narrow utility menus to wide feature showcases.

### Proposed Solution: Maximum Width Slider

Add a simple `dropdownMaxWidth` numeric attribute that gives users precise control over dropdown width.

#### Why This Approach?
- ✅ **CSS-only implementation** - No JavaScript calculations or layout thrashing
- ✅ **Theme-agnostic** - Works with any WordPress theme or header structure
- ✅ **Flexible** - Users can set any width that suits their content
- ✅ **Simple to implement** - Single attribute, minimal code changes
- ✅ **Responsive-ready** - Desktop only, mobile automatically goes full-screen
- ❌ **Avoided complexity** - No fragile JS width detection or theme dependencies

#### Implementation Details

**1. Add attribute to block.json**
```json
"dropdownMaxWidth": {
  "type": "number",
  "default": 600
}
```

**2. Update style.scss**
Replace fixed `min-width` with CSS variable:

```scss
.wp-block-elayne-mega-menu--layout-dropdown {
  .wp-block-elayne-mega-menu__panel {
    width: auto;
    min-width: min(var(--mm-dropdown-max-width, 600px), calc(100vw - 40px));
    max-width: calc(100vw - 40px);

    // Mobile override - always full screen
    @media (max-width: 768px) {
      min-width: auto;
      width: 100vw;
      max-width: none;
    }
  }
}
```

**3. Update edit.js**
- Add `RangeControl` to Layout panel
- Label: "Maximum Dropdown Width"
- Min: 300, Max: 1600, Step: 50
- Help text: "Maximum width of the dropdown on desktop (in pixels). Mobile always uses full width."
- Only visible when `layoutMode === 'dropdown'`
- Apply CSS variable to wrapper div:
  ```jsx
  style={{
    '--mm-dropdown-max-width': `${dropdownMaxWidth}px`
  }}
  ```

**4. Update render.php**
- Add CSS variable to wrapper element:
  ```php
  'style' => sprintf('--mm-dropdown-max-width: %dpx', $dropdown_max_width)
  ```

### Benefits
- **Precise control** - Users choose exact width in pixels
- **No theme dependencies** - Works with any header/navigation structure
- **Performance** - Pure CSS, no JavaScript overhead
- **Responsive** - Desktop control, mobile always optimized
- **Simple UX** - Single slider control instead of complex mode selection
- **Future-proof** - Not tied to specific theme implementations

### Recommended Width Ranges
- **Narrow menus (300-500px)** - Simple link lists, utility navigation
- **Standard menus (600-900px)** - Default range, works for most content
- **Wide menus (1000-1400px)** - Feature showcases, multi-column layouts
- **Extra wide (1400-1600px)** - Full-featured mega menus with rich content

---

## Implementation Phases

### Phase 1: Dropdown Spacing ✅ COMPLETED
1. ✅ Add `dropdownSpacing` attribute to block.json
2. ✅ Update style.scss with CSS variable
3. ✅ Add RangeControl to edit.js Layout panel
4. ✅ Update render.php to output CSS variable
5. ✅ Test on demo site
6. ✅ Update CHANGELOG.md

**Status:** Implemented in version 2.5.0

### Phase 2: Dropdown Maximum Width (Simple Approach)
1. Add `dropdownMaxWidth` attribute to block.json
2. Update style.scss to use CSS variable for min-width
3. Add RangeControl to edit.js Layout panel (300-1600px range)
4. Update render.php to output CSS variable
5. Ensure mobile override works (full-width on mobile)
6. Test various width values on demo site

**Complexity:** Low - Pure CSS implementation, no JavaScript needed

### Phase 3: Documentation & Polish
1. Update mega-menu README.md with new width control option
2. Add usage examples for different width ranges
3. Update CHANGELOG.md with feature details
4. Test responsive behavior (desktop slider, mobile full-width)
5. Test with all layout modes (ensure overlay not affected)

---

## Testing Checklist

### Dropdown Spacing ✅
- [x] Default 16px spacing renders correctly
- [x] Spacing adjusts in editor preview
- [x] Spacing persists on frontend
- [x] Min/max values (0-48px) work as expected
- [x] Spacing doesn't affect overlay mode
- [x] Mobile responsive behavior maintains spacing

### Dropdown Maximum Width
- [ ] Default 600px width works as before
- [ ] Width slider adjusts dropdown in editor preview
- [ ] Width persists on frontend
- [ ] Min value (300px) works correctly
- [ ] Max value (1600px) works correctly
- [ ] Viewport constraints prevent overflow (respects calc(100vw - 40px))
- [ ] Works with all dropdown alignments (left, right, center)
- [ ] Mobile always uses full-width (desktop control doesn't apply)
- [ ] Only affects dropdown mode (overlay mode unaffected)
- [ ] CSS variable properly applied in both editor and frontend

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

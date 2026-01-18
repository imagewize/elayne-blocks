# Phase 2E: Advanced Styling Controls

**Status:** 🚧 In Progress
**Started:** 2026-01-17
**Goal:** Add comprehensive styling controls to the mega menu block editor

---

## Overview

Phase 2E adds a professional styling control panel to the mega menu block, giving users fine-grained control over dimensions, colors, typography, and visual effects. This phase addresses the immediate need for better content containment and provides long-term flexibility.

---

## Problem Statement

**Current Issues:**
1. ❌ No width/padding controls → content overflows viewport
2. ❌ No spacing controls → template part content not properly contained
3. ❌ Limited panel container styling → can't customize mega menu container appearance
4. ❌ No visual effects → limited design flexibility for panel container

**User Impact:**
- Template part content extends beyond viewport (scrollbar issue)
- Cannot customize mega menu panel container to match site design
- No control over spacing/padding for different content types
- Limited ability to style the panel wrapper (shadows, borders, etc.)

**WordPress-Native Approach:**
- ✅ Content styling handled by theme (colors, typography, links)
- ✅ Block supports provide typography controls
- 🎯 Phase 2E focuses on **panel container** styling only
- 🎯 Respects WordPress theme integration and global styles

---

## Implementation Plan

### 1. New Block Attributes

Add to `blocks/mega-menu/src/block.json`:

**Note:** Typography and content colors are handled by WordPress block supports and theme styles. These attributes only control the **panel container** appearance.

```json
{
  "attributes": {
    // Panel Dimensions (CRITICAL - fixes overflow issue)
    "panelWidth": {
      "type": "string",
      "default": "content"
    },
    "panelMaxWidth": {
      "type": "number",
      "default": 800
    },
    "panelMinHeight": {
      "type": "number",
      "default": 0
    },
    "panelPadding": {
      "type": "object",
      "default": {
        "top": "20px",
        "right": "20px",
        "bottom": "20px",
        "left": "20px"
      }
    },

    // Panel Container Colors (not content colors)
    "panelBackgroundColor": {
      "type": "string",
      "default": ""
    },

    // Panel Visual Effects
    "panelBoxShadow": {
      "type": "string",
      "default": "default"
    },
    "panelBorderRadius": {
      "type": "number",
      "default": 4
    },
    "panelBorderWidth": {
      "type": "number",
      "default": 0
    },
    "panelBorderColor": {
      "type": "string",
      "default": ""
    },
    "panelBackdropBlur": {
      "type": "boolean",
      "default": false
    }
  }
}
```

**Removed attributes (handled elsewhere):**
- ❌ `panelTextColor` - Use theme styles or block supports
- ❌ `panelLinkColor` - Use theme styles
- ❌ `panelLinkHoverColor` - Use theme styles
- ❌ `panelFontSize` - Use block supports (typography.fontSize)
- ❌ `panelFontWeight` - Use block supports (typography.fontWeight)
- ❌ `panelLineHeight` - Use block supports (typography.lineHeight)
- ❌ `panelLetterSpacing` - Use block supports (typography.letterSpacing)

---

### 2. StylePanel Component

Create `blocks/mega-menu/src/components/StylePanel.jsx`:

**Features:**
- Focused on **panel container styling only** (not content)
- Organized into collapsible sections (Dimensions, Effects)
- Conditional controls (show relevant options based on layout mode)
- WordPress Components API (RangeControl, ColorPalette, ButtonGroup, BoxControl)
- Preset system for common configurations

**Sections:**

#### A. Dimensions Section
- Width preset selector (Content/Wide/Full/Custom)
- Max width range control (300-2000px) - **Fixes overflow issue**
- Min height range control (0-800px)
- Padding box control (top/right/bottom/left with linked toggle)

#### B. Panel Colors Section (Container only)
- Panel background color picker
- Help text: "Content colors controlled by theme and template part"

#### C. Effects Section
- Box shadow preset selector (None/Small/Medium/Large/Custom)
- Border radius range (0-50px)
- Border width range (0-10px)
- Border color picker
- Backdrop blur toggle (overlay/sidebar only)

**Removed sections:**
- ❌ Typography Panel - Use WordPress block supports in sidebar instead
- ❌ Content Colors Panel - Handled by theme styles

---

### 3. Editor Integration

Update `blocks/mega-menu/src/edit.js`:

**Approach: Separate PanelBody sections for better organization**

```jsx
import StylePanel from './components/StylePanel';

// Add to InspectorControls (after existing panels)
<PanelBody title="Panel Dimensions" initialOpen={false}>
  <StylePanel
    section="dimensions"
    attributes={attributes}
    setAttributes={setAttributes}
    layoutMode={layoutMode}
  />
</PanelBody>

<PanelBody title="Panel Effects" initialOpen={false}>
  <StylePanel
    section="effects"
    attributes={attributes}
    setAttributes={setAttributes}
    layoutMode={layoutMode}
  />
</PanelBody>
```

**Note:** Panel background color can be added to existing "Advanced Styling" panel to consolidate color controls.

---

### 4. Frontend Rendering

Update `blocks/mega-menu/src/render.php`:

**Add inline styles to panel wrapper (container only):**

```php
// Build panel styles array
$panel_styles = [];

// Dimensions (CRITICAL - fixes overflow)
if ( ! empty( $panel_max_width ) ) {
    $panel_styles[] = 'max-width: ' . absint( $panel_max_width ) . 'px';
}
if ( ! empty( $panel_min_height ) ) {
    $panel_styles[] = 'min-height: ' . absint( $panel_min_height ) . 'px';
}
if ( ! empty( $panel_padding ) && is_array( $panel_padding ) ) {
    $panel_styles[] = sprintf(
        'padding: %s %s %s %s',
        esc_attr( $panel_padding['top'] ?? '20px' ),
        esc_attr( $panel_padding['right'] ?? '20px' ),
        esc_attr( $panel_padding['bottom'] ?? '20px' ),
        esc_attr( $panel_padding['left'] ?? '20px' )
    );
}

// Panel container background (not content)
if ( ! empty( $panel_background_color ) ) {
    $panel_styles[] = 'background-color: ' . esc_attr( $panel_background_color );
}

// Effects
if ( ! empty( $panel_border_radius ) ) {
    $panel_styles[] = 'border-radius: ' . absint( $panel_border_radius ) . 'px';
}
if ( ! empty( $panel_border_width ) && $panel_border_width > 0 ) {
    $border_color = ! empty( $panel_border_color ) ? esc_attr( $panel_border_color ) : '#ddd';
    $panel_styles[] = 'border: ' . absint( $panel_border_width ) . 'px solid ' . $border_color;
}

// Apply styles
$panel_style_attr = ! empty( $panel_styles ) ? ' style="' . esc_attr( implode( '; ', $panel_styles ) ) . '"' : '';
```

**Removed (not needed):**
- ❌ Text color, link colors - Content inherits from theme
- ❌ Typography styles - Handled by block supports
- ❌ Content-specific colors - Template parts use theme styles

---

### 5. CSS Enhancements

Update `blocks/mega-menu/src/style.scss`:

**Add utility classes for panel container styling presets:**

```scss
// Width presets (panel container)
.mm-panel-width-content {
    max-width: var(--wp--style--global--content-size, 800px);
}

.mm-panel-width-wide {
    max-width: var(--wp--style--global--wide-size, 1200px);
}

.mm-panel-width-full {
    max-width: 100%;
    width: 100%;
}

.mm-panel-width-custom {
    // Custom width applied via inline styles
}

// Box shadow presets (panel container)
.mm-shadow-none {
    box-shadow: none;
}

.mm-shadow-small {
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
}

.mm-shadow-medium {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.mm-shadow-large {
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

.mm-shadow-custom {
    // Custom shadow applied via inline styles
}

// Backdrop blur support (overlay/sidebar only)
.mm-backdrop-blur-enabled {
    .wp-block-elayne-mega-menu__panel {
        backdrop-filter: blur(10px);
    }
}
```

**Removed (not needed):**
- ❌ Link color CSS variables - Content uses theme styles
- ❌ Typography utilities - Handled by block supports
- ❌ Text color utilities - Template parts inherit from theme

---

## Component Structure

### StylePanel.jsx Organization

```jsx
export default function StylePanel({ attributes, setAttributes, layoutMode }) {
    const {
        panelWidth,
        panelMaxWidth,
        // ... other attributes
    } = attributes;

    return (
        <>
            {/* Dimensions Section */}
            <BaseControl label="Panel Width">
                <ButtonGroup>
                    <Button
                        variant={panelWidth === 'content' ? 'primary' : 'secondary'}
                        onClick={() => setAttributes({ panelWidth: 'content' })}
                    >
                        Content
                    </Button>
                    <Button
                        variant={panelWidth === 'wide' ? 'primary' : 'secondary'}
                        onClick={() => setAttributes({ panelWidth: 'wide' })}
                    >
                        Wide
                    </Button>
                    <Button
                        variant={panelWidth === 'full' ? 'primary' : 'secondary'}
                        onClick={() => setAttributes({ panelWidth: 'full' })}
                    >
                        Full
                    </Button>
                    <Button
                        variant={panelWidth === 'custom' ? 'primary' : 'secondary'}
                        onClick={() => setAttributes({ panelWidth: 'custom' })}
                    >
                        Custom
                    </Button>
                </ButtonGroup>
            </BaseControl>

            {panelWidth === 'custom' && (
                <RangeControl
                    label="Max Width (px)"
                    value={panelMaxWidth}
                    onChange={(value) => setAttributes({ panelMaxWidth: value })}
                    min={300}
                    max={2000}
                    step={10}
                />
            )}

            <RangeControl
                label="Min Height (px)"
                value={panelMinHeight}
                onChange={(value) => setAttributes({ panelMinHeight: value })}
                min={0}
                max={800}
                step={10}
            />

            <BoxControl
                label="Padding"
                values={panelPadding}
                onChange={(value) => setAttributes({ panelPadding: value })}
            />

            {/* Colors Section */}
            <ColorPalette
                label="Background Color"
                value={panelBackgroundColor}
                onChange={(value) => setAttributes({ panelBackgroundColor: value })}
            />

            {/* ... more controls */}
        </>
    );
}
```

---

## Default Values Strategy

**Smart defaults to fix overflow issue:**

```javascript
// In block.json
"panelMaxWidth": {
    "type": "number",
    "default": 800  // Safe default that won't overflow on most screens
}

"panelPadding": {
    "type": "object",
    "default": {
        "top": "20px",
        "right": "20px",
        "bottom": "20px",
        "left": "20px"
    }
}
```

**Layout-specific defaults (applied in edit.js):**

```javascript
// Dropdown mode
if (layoutMode === 'dropdown') {
    defaultMaxWidth = 800;
    defaultPadding = { top: '20px', right: '20px', bottom: '20px', left: '20px' };
}

// Overlay mode
if (layoutMode === 'overlay') {
    defaultMaxWidth = 1200;
    defaultPadding = { top: '40px', right: '40px', bottom: '40px', left: '40px' };
}

// Sidebar mode
if (layoutMode === 'sidebar') {
    defaultMaxWidth = 400;
    defaultPadding = { top: '30px', right: '30px', bottom: '30px', left: '30px' };
}

// Grid mode
if (layoutMode === 'grid') {
    defaultMaxWidth = 1600;
    defaultPadding = { top: '40px', right: '40px', bottom: '40px', left: '40px' };
}
```

---

## Files to Modify

1. ✅ `blocks/mega-menu/src/block.json` - Add ~10 panel container attributes (simplified from 15+)
2. ⏳ `blocks/mega-menu/src/components/StylePanel.jsx` - Create new component (~200 lines, simplified)
3. ⏳ `blocks/mega-menu/src/edit.js` - Integrate StylePanel component
4. ⏳ `blocks/mega-menu/src/render.php` - Apply inline styles to panel container
5. ⏳ `blocks/mega-menu/src/style.scss` - Add utility classes for panel presets
6. ⏳ `docs/HYBRID-REWRITE.md` - Update Phase 2E status

---

## Success Criteria

After Phase 2E implementation:

- ✅ Users can control panel container width (Content/Wide/Full/Custom presets)
- ✅ Users can set max-width to prevent viewport overflow **← PRIMARY GOAL**
- ✅ Users can adjust padding for proper content spacing
- ✅ Users can customize panel background color (container only)
- ✅ Users can add visual effects to panel (shadows, borders, backdrop blur)
- ✅ Controls are conditional (show relevant options per layout mode)
- ✅ Immediate fix for scrollbar overflow issue
- ✅ WordPress-native approach (respects theme styles for content)
- ✅ Typography controlled via block supports (not custom attributes)
- ✅ Content colors inherit from theme and template parts

---

## Implementation Steps

### Step 1: Add Attributes (block.json)
- Add all 15+ attributes with sensible defaults
- Group logically (dimensions, colors, typography, effects)

### Step 2: Create StylePanel Component
- Build organized component with collapsible sections
- Implement preset selectors with visual feedback
- Add conditional logic for layout-specific controls

### Step 3: Integrate into Editor (edit.js)
- Add StylePanel to InspectorControls
- Position after Layout/Icon/Animation panels
- Ensure proper attribute handling

### Step 4: Apply Styles (render.php)
- Build inline styles array from attributes
- Apply CSS classes for presets
- Escape all output properly

### Step 5: Add CSS Utilities (style.scss)
- Create preset classes
- Add CSS variables for dynamic values
- Ensure responsive behavior

### Step 6: Test & Validate
- Test all controls in editor
- Verify frontend rendering
- Check responsive behavior
- Validate accessibility

---

## Estimated Effort

**Total:** ~3-4 hours

- Attributes setup: 30 minutes
- StylePanel component: 1.5 hours
- Editor integration: 30 minutes
- Render.php updates: 45 minutes
- CSS utilities: 45 minutes
- Testing: 30 minutes

---

## Next Phase

After Phase 2E completion:
- **Phase 2F:** Mobile-First Enhancements (swipe gestures, hamburger integration)
- **Phase 3:** Polish & Documentation
- **Phase 4:** WordPress.org Submission

---

**Document Version:** 1.0
**Last Updated:** 2026-01-17
**Status:** 🚧 In Progress - Ready to implement

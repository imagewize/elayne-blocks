# Phase 2C: Layout Mode Components & Styling System

**Status:** Ready to Begin 🎯
**Started:** Not yet started
**Target Completion:** TBD
**Dependencies:** Phase 2B Complete ✅ (Icon Picker & Animation Controls)

---

## Overview

Phase 2C focuses on implementing the **core architectural foundation** of the mega menu rewrite: the 4 distinct layout modes and their supporting styling system. This phase transforms the basic dropdown into a flexible, multi-mode navigation system.

**What we're building:**
- 4 distinct layout engines (Dropdown, Overlay, Sidebar, Grid)
- Unified styling system that supports all layout modes
- Layout mode picker component for the editor
- Frontend rendering logic for each layout type
- Responsive behavior for each layout mode

---

## Goals

1. ✅ Implement 4 layout modes with distinct behaviors
2. ✅ Create LayoutPicker component for editor UI
3. ✅ Build CSS styling system for all layouts
4. ✅ Implement layout-specific Interactivity API logic
5. ✅ Add responsive behavior for each layout
6. ✅ Ensure smooth transitions between layout modes in editor
7. ✅ Maintain accessibility standards across all layouts

---

## Phase 2C Architecture

### Layout Modes Overview

| Layout Mode | Use Case | Activation | Position | Mobile Behavior |
|------------|----------|------------|----------|-----------------|
| **Dropdown** | Classic mega menu | Click/Hover | Below trigger | Converts to full-screen |
| **Overlay** | E-commerce, large content | Click | Full viewport | Full-screen takeover |
| **Sidebar** | App-like navigation | Click | Left/Right edge | Native mobile drawer |
| **Grid** | Content-heavy sites | Hover | Full-width below nav | Stacks vertically |

---

## Implementation Plan

### Step 1: Add Layout Mode Attributes ⭐ CRITICAL

**File:** `blocks/mega-menu/src/block.json`

**Add new attributes:**
```json
{
  "attributes": {
    "layoutMode": {
      "type": "string",
      "default": "dropdown",
      "enum": ["dropdown", "overlay", "sidebar", "grid"]
    },
    "sidebarDirection": {
      "type": "string",
      "default": "left",
      "enum": ["left", "right"]
    },
    "gridColumns": {
      "type": "number",
      "default": 3
    },
    "dropdownAlignment": {
      "type": "string",
      "default": "auto",
      "enum": ["auto", "left", "right", "center"]
    },
    "overlayBackdropColor": {
      "type": "string",
      "default": "rgba(0, 0, 0, 0.5)"
    },
    "enableHoverActivation": {
      "type": "boolean",
      "default": false
    }
  }
}
```

**Estimated time:** 15 minutes

---

### Step 2: Create LayoutPicker Component ⭐ HIGH PRIORITY

**File:** `blocks/mega-menu/src/components/LayoutPicker.jsx` (new)

**Component structure:**
```jsx
import { Button, ButtonGroup, Tooltip } from '@wordpress/components';
import { Icon } from '@wordpress/icons';
import { arrowDown, coverImage, menu, grid } from '@wordpress/icons';

export default function LayoutPicker({ value, onChange }) {
  const layouts = [
    {
      value: 'dropdown',
      label: 'Dropdown',
      icon: arrowDown,
      description: 'Classic dropdown below trigger'
    },
    {
      value: 'overlay',
      label: 'Overlay',
      icon: coverImage,
      description: 'Full-screen overlay'
    },
    {
      value: 'sidebar',
      label: 'Sidebar',
      icon: menu,
      description: 'Drawer from left/right'
    },
    {
      value: 'grid',
      label: 'Mega Grid',
      icon: grid,
      description: 'Full-width grid layout'
    }
  ];

  return (
    <div className="layout-picker">
      <label className="components-base-control__label">
        Layout Mode
      </label>
      <ButtonGroup className="layout-picker__buttons">
        {layouts.map((layout) => (
          <Tooltip key={layout.value} text={layout.description}>
            <Button
              isPressed={value === layout.value}
              onClick={() => onChange(layout.value)}
              className="layout-picker__button"
            >
              <Icon icon={layout.icon} />
              <span>{layout.label}</span>
            </Button>
          </Tooltip>
        ))}
      </ButtonGroup>
    </div>
  );
}
```

**Features:**
- Visual button group with icons
- Active state highlighting
- Tooltips with descriptions
- Clean, modern design

**Estimated time:** 45 minutes

---

### Step 3: Update Editor Component (edit.js) ⭐ HIGH PRIORITY

**File:** `blocks/mega-menu/src/edit.js`

**Add LayoutPicker to InspectorControls:**
```jsx
import LayoutPicker from './components/LayoutPicker';

// In the InspectorControls section (first panel)
<PanelBody title="Layout" initialOpen={true}>
  <LayoutPicker
    value={layoutMode}
    onChange={(mode) => setAttributes({ layoutMode: mode })}
  />

  {/* Conditional controls based on layout mode */}
  {layoutMode === 'sidebar' && (
    <SelectControl
      label="Sidebar Direction"
      value={sidebarDirection}
      options={[
        { label: 'Left', value: 'left' },
        { label: 'Right', value: 'right' }
      ]}
      onChange={(val) => setAttributes({ sidebarDirection: val })}
    />
  )}

  {layoutMode === 'grid' && (
    <RangeControl
      label="Grid Columns"
      value={gridColumns}
      onChange={(val) => setAttributes({ gridColumns: val })}
      min={2}
      max={6}
      step={1}
    />
  )}

  {layoutMode === 'dropdown' && (
    <SelectControl
      label="Dropdown Alignment"
      value={dropdownAlignment}
      options={[
        { label: 'Auto (Smart Positioning)', value: 'auto' },
        { label: 'Left', value: 'left' },
        { label: 'Right', value: 'right' },
        { label: 'Center', value: 'center' }
      ]}
      onChange={(val) => setAttributes({ dropdownAlignment: val })}
    />
  )}

  {layoutMode === 'overlay' && (
    <ColorPicker
      label="Backdrop Color"
      color={overlayBackdropColor}
      onChange={(color) => setAttributes({ overlayBackdropColor: color })}
    />
  )}

  {(layoutMode === 'dropdown' || layoutMode === 'grid') && (
    <ToggleControl
      label="Activate on Hover"
      help="Open menu on hover instead of click"
      checked={enableHoverActivation}
      onChange={(val) => setAttributes({ enableHoverActivation: val })}
    />
  )}
</PanelBody>
```

**Estimated time:** 30 minutes

---

### Step 4: Build CSS Styling System ⭐ CRITICAL

**File:** `blocks/mega-menu/src/style.scss`

**Structure:**
```scss
// Base mega menu styles (existing)
.wp-block-elayne-mega-menu {
  position: relative;

  // Trigger button (existing + enhancements)
  &__trigger {
    // existing styles...
  }

  // Panel container - base styles
  &__panel {
    position: absolute;
    z-index: 1000;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.3s ease, visibility 0.3s ease;

    &.is-open {
      opacity: 1;
      visibility: visible;
    }
  }

  // Layout Mode: Dropdown
  &--layout-dropdown {
    .wp-block-elayne-mega-menu__panel {
      position: absolute;
      top: 100%;
      min-width: 300px;
      max-width: 800px;
      background: #fff;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
      border-radius: 4px;
      padding: 20px;

      // Alignment variants
      &.align-left { left: 0; }
      &.align-right { right: 0; }
      &.align-center { left: 50%; transform: translateX(-50%); }

      // Auto-positioning handled by JavaScript
      &.align-auto {
        left: 0;

        &.flip-horizontal {
          left: auto;
          right: 0;
        }
      }
    }
  }

  // Layout Mode: Overlay
  &--layout-overlay {
    .wp-block-elayne-mega-menu__panel {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: #fff;
      overflow-y: auto;
      padding: 60px 40px 40px;

      // Close button
      &::before {
        content: '×';
        position: absolute;
        top: 20px;
        right: 20px;
        font-size: 40px;
        line-height: 1;
        cursor: pointer;
        color: #333;
        transition: color 0.2s ease;

        &:hover {
          color: #000;
        }
      }
    }

    // Backdrop
    &__backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.5);
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.3s ease, visibility 0.3s ease;
      z-index: 999;

      &.is-visible {
        opacity: 1;
        visibility: visible;
      }
    }
  }

  // Layout Mode: Sidebar
  &--layout-sidebar {
    .wp-block-elayne-mega-menu__panel {
      position: fixed;
      top: 0;
      width: 400px;
      max-width: 85vw;
      height: 100vh;
      background: #fff;
      box-shadow: 0 0 30px rgba(0, 0, 0, 0.2);
      overflow-y: auto;
      padding: 60px 30px 30px;
      transition: transform 0.3s ease;

      &.direction-left {
        left: 0;
        transform: translateX(-100%);

        &.is-open {
          transform: translateX(0);
        }
      }

      &.direction-right {
        right: 0;
        transform: translateX(100%);

        &.is-open {
          transform: translateX(0);
        }
      }

      // Close button
      &::before {
        content: '×';
        position: absolute;
        top: 20px;
        right: 20px;
        font-size: 40px;
        line-height: 1;
        cursor: pointer;
        color: #333;
      }
    }

    // Backdrop (shared with overlay)
    &__backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.5);
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.3s ease, visibility 0.3s ease;
      z-index: 999;

      &.is-visible {
        opacity: 1;
        visibility: visible;
      }
    }
  }

  // Layout Mode: Grid
  &--layout-grid {
    .wp-block-elayne-mega-menu__panel {
      position: absolute;
      top: 100%;
      left: 0;
      width: 100%;
      background: #fff;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
      padding: 40px;

      // Grid container for content
      &__content {
        display: grid;
        grid-template-columns: repeat(var(--grid-columns, 3), 1fr);
        gap: 30px;
        max-width: 1200px;
        margin: 0 auto;
      }
    }
  }

  // Responsive adjustments
  @media (max-width: 768px) {
    // Dropdown becomes full-screen on mobile
    &--layout-dropdown {
      .wp-block-elayne-mega-menu__panel {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        max-width: none;
        border-radius: 0;
        padding: 60px 20px 20px;
      }
    }

    // Grid stacks vertically
    &--layout-grid {
      .wp-block-elayne-mega-menu__panel__content {
        grid-template-columns: 1fr;
      }
    }
  }
}

// Body scroll lock (when overlay/sidebar open)
body.mega-menu-overlay-open,
body.mega-menu-sidebar-open {
  overflow: hidden;
}
```

**Estimated time:** 2-3 hours

---

### Step 5: Update Frontend Markup (save.js) ⭐ HIGH PRIORITY

**File:** `blocks/mega-menu/src/save.jsx`

**Update to include layout mode classes and data attributes:**
```jsx
import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import classnames from 'classnames';

export default function Save({ attributes }) {
  const {
    layoutMode,
    sidebarDirection,
    gridColumns,
    dropdownAlignment,
    overlayBackdropColor,
    enableHoverActivation,
    label,
    iconName,
    customSVG,
    // ... other attributes
  } = attributes;

  const blockProps = useBlockProps.save({
    className: classnames(
      `wp-block-elayne-mega-menu--layout-${layoutMode}`,
      {
        'has-hover-activation': enableHoverActivation &&
          (layoutMode === 'dropdown' || layoutMode === 'grid'),
      }
    ),
    'data-wp-interactive': 'elayne/mega-menu',
    'data-wp-context': JSON.stringify({
      isOpen: false,
      layoutMode,
      sidebarDirection,
      dropdownAlignment,
      gridColumns,
      enableHoverActivation,
    }),
  });

  return (
    <div {...blockProps}>
      {/* Trigger button */}
      <button
        className="wp-block-elayne-mega-menu__trigger"
        data-wp-on--click="actions.toggleMenu"
        data-wp-on--mouseenter={
          enableHoverActivation ? "actions.openMenu" : undefined
        }
        aria-expanded="false"
        data-wp-bind--aria-expanded="context.isOpen"
      >
        {iconName && !customSVG && (
          <span className={`dashicon dashicons-${iconName}`} />
        )}
        {customSVG && (
          <span
            className="custom-icon"
            dangerouslySetInnerHTML={{ __html: customSVG }}
          />
        )}
        <span className="wp-block-elayne-mega-menu__label">{label}</span>
      </button>

      {/* Panel container */}
      <div
        className={classnames(
          'wp-block-elayne-mega-menu__panel',
          `align-${dropdownAlignment}`,
          layoutMode === 'sidebar' && `direction-${sidebarDirection}`,
          { 'is-open': false } // Controlled by Interactivity API
        )}
        data-wp-class--is-open="context.isOpen"
        style={
          layoutMode === 'grid'
            ? { '--grid-columns': gridColumns }
            : undefined
        }
      >
        {layoutMode === 'grid' ? (
          <div className="wp-block-elayne-mega-menu__panel__content">
            <InnerBlocks.Content />
          </div>
        ) : (
          <InnerBlocks.Content />
        )}
      </div>

      {/* Backdrop for overlay and sidebar modes */}
      {(layoutMode === 'overlay' || layoutMode === 'sidebar') && (
        <div
          className="wp-block-elayne-mega-menu__backdrop"
          data-wp-class--is-visible="context.isOpen"
          data-wp-on--click="actions.closeMenu"
          style={
            layoutMode === 'overlay'
              ? { background: overlayBackdropColor }
              : undefined
          }
        />
      )}
    </div>
  );
}
```

**Estimated time:** 1 hour

---

### Step 6: Implement Layout-Specific Interactivity Logic ⭐ CRITICAL

**File:** `blocks/mega-menu/src/view.js`

**Expand Interactivity API with layout-specific logic:**
```javascript
import { store, getContext, getElement } from '@wordpress/interactivity';

// Utility: Calculate dropdown position
function calculateDropdownPosition(trigger, panel, alignment) {
  if (alignment !== 'auto') return {};

  const triggerRect = trigger.getBoundingClientRect();
  const panelWidth = panel.offsetWidth;
  const viewportWidth = window.innerWidth;

  // Check if panel would overflow right edge
  const wouldOverflowRight = triggerRect.left + panelWidth > viewportWidth;

  return {
    flipHorizontal: wouldOverflowRight,
  };
}

store('elayne/mega-menu', {
  state: {
    get isMobile() {
      return window.innerWidth < 768;
    },
  },

  actions: {
    toggleMenu: () => {
      const context = getContext();
      context.isOpen ? actions.closeMenu() : actions.openMenu();
    },

    openMenu: () => {
      const context = getContext();
      const { ref } = getElement();
      const { layoutMode, dropdownAlignment, sidebarDirection } = context;

      // Layout-specific open logic
      switch (layoutMode) {
        case 'dropdown':
          // Calculate positioning for dropdown
          if (dropdownAlignment === 'auto') {
            const trigger = ref.querySelector('.wp-block-elayne-mega-menu__trigger');
            const panel = ref.querySelector('.wp-block-elayne-mega-menu__panel');
            const { flipHorizontal } = calculateDropdownPosition(
              trigger,
              panel,
              dropdownAlignment
            );

            if (flipHorizontal) {
              panel.classList.add('flip-horizontal');
            }
          }
          break;

        case 'overlay':
          // Lock body scroll
          document.body.classList.add('mega-menu-overlay-open');
          break;

        case 'sidebar':
          // Lock body scroll
          document.body.classList.add('mega-menu-sidebar-open');
          // Initialize swipe handler for mobile
          if (state.isMobile) {
            actions.initSwipeHandler();
          }
          break;

        case 'grid':
          // No special logic needed
          break;
      }

      context.isOpen = true;

      // Focus management
      actions.setFocusTrap();
    },

    closeMenu: () => {
      const context = getContext();
      const { ref } = getElement();
      const { layoutMode } = context;

      // Layout-specific close logic
      switch (layoutMode) {
        case 'dropdown':
          const panel = ref.querySelector('.wp-block-elayne-mega-menu__panel');
          panel?.classList.remove('flip-horizontal');
          break;

        case 'overlay':
          document.body.classList.remove('mega-menu-overlay-open');
          break;

        case 'sidebar':
          document.body.classList.remove('mega-menu-sidebar-open');
          break;
      }

      context.isOpen = false;

      // Return focus to trigger
      actions.returnFocus();
    },

    setFocusTrap: () => {
      const context = getContext();
      const { ref } = getElement();
      const panel = ref.querySelector('.wp-block-elayne-mega-menu__panel');

      if (!panel) return;

      const focusableElements = panel.querySelectorAll(
        'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
      );

      context.firstFocusable = focusableElements[0];
      context.lastFocusable = focusableElements[focusableElements.length - 1];

      // Focus first element
      setTimeout(() => {
        context.firstFocusable?.focus();
      }, 100);
    },

    returnFocus: () => {
      const { ref } = getElement();
      const trigger = ref.querySelector('.wp-block-elayne-mega-menu__trigger');
      trigger?.focus();
    },

    initSwipeHandler: () => {
      const context = getContext();
      const { ref } = getElement();
      const panel = ref.querySelector('.wp-block-elayne-mega-menu__panel');

      if (!panel) return;

      let touchStartX = 0;
      let touchEndX = 0;

      const handleSwipe = () => {
        const swipeDistance = touchEndX - touchStartX;
        const threshold = 50; // 50px swipe to close

        if (Math.abs(swipeDistance) > threshold) {
          const { sidebarDirection } = context;

          // Close if swiping in the correct direction
          if (
            (sidebarDirection === 'left' && swipeDistance < 0) ||
            (sidebarDirection === 'right' && swipeDistance > 0)
          ) {
            actions.closeMenu();
          }
        }
      };

      panel.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
      });

      panel.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].clientX;
        handleSwipe();
      });
    },
  },

  callbacks: {
    onInit: () => {
      const { ref } = getElement();

      // Handle outside clicks (all layouts)
      document.addEventListener('click', (e) => {
        const context = getContext();
        if (!context.isOpen) return;

        const isClickInside = ref.contains(e.target);
        if (!isClickInside) {
          actions.closeMenu();
        }
      });

      // Handle ESC key (all layouts)
      document.addEventListener('keydown', (e) => {
        const context = getContext();
        if (e.key === 'Escape' && context.isOpen) {
          actions.closeMenu();
        }
      });

      // Handle Tab focus trap
      ref.addEventListener('keydown', (e) => {
        const context = getContext();
        if (!context.isOpen || e.key !== 'Tab') return;

        const { firstFocusable, lastFocusable } = context;

        if (e.shiftKey && document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable?.focus();
        } else if (!e.shiftKey && document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable?.focus();
        }
      });
    },
  },
});
```

**Estimated time:** 2-3 hours

---

### Step 7: Add LayoutPicker Styles ⭐ MEDIUM PRIORITY

**File:** `blocks/mega-menu/src/editor.scss`

**Add styles for the LayoutPicker component:**
```scss
.layout-picker {
  margin-bottom: 16px;

  &__buttons {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
    margin-top: 8px;
  }

  &__button {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: 12px 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    background: #fff;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      border-color: #999;
      background: #f8f8f8;
    }

    &.is-pressed {
      border-color: #007cba;
      background: #e7f5fe;
      color: #007cba;
    }

    svg {
      width: 24px;
      height: 24px;
    }

    span {
      font-size: 12px;
      font-weight: 500;
    }
  }
}
```

**Estimated time:** 20 minutes

---

## Testing Checklist

### Editor Testing
- [ ] LayoutPicker appears in Layout panel
- [ ] All 4 layout modes can be selected
- [ ] Conditional controls show/hide correctly:
  - [ ] Sidebar Direction (sidebar mode only)
  - [ ] Grid Columns (grid mode only)
  - [ ] Dropdown Alignment (dropdown mode only)
  - [ ] Backdrop Color (overlay mode only)
  - [ ] Hover Activation (dropdown/grid modes only)
- [ ] Block preview updates when layout mode changes
- [ ] Attributes save correctly

### Frontend Testing

#### Dropdown Mode
- [ ] Panel appears below trigger
- [ ] Auto-alignment prevents viewport overflow
- [ ] Manual alignment (left/right/center) works
- [ ] Hover activation works (if enabled)
- [ ] Click outside closes menu
- [ ] ESC key closes menu
- [ ] Converts to full-screen on mobile (<768px)

#### Overlay Mode
- [ ] Panel covers full viewport
- [ ] Backdrop appears with correct color
- [ ] Click backdrop closes menu
- [ ] Close button (×) works
- [ ] Body scroll locked when open
- [ ] ESC key closes menu
- [ ] Focus trapped inside panel

#### Sidebar Mode
- [ ] Panel slides from left/right (based on setting)
- [ ] Backdrop appears
- [ ] Click backdrop closes menu
- [ ] Close button (×) works
- [ ] Body scroll locked when open
- [ ] Swipe to close works on mobile
- [ ] Focus trapped inside panel
- [ ] Width responsive (max 85vw on mobile)

#### Grid Mode
- [ ] Panel full-width below trigger
- [ ] Grid columns setting respected (2-6 columns)
- [ ] Content displays in grid layout
- [ ] Hover activation works (if enabled)
- [ ] Stacks to single column on mobile

### Accessibility Testing
- [ ] All layouts keyboard navigable (Tab/Shift+Tab)
- [ ] Focus trap works in overlay/sidebar
- [ ] ESC key closes menu in all modes
- [ ] Focus returns to trigger on close
- [ ] ARIA attributes update correctly
- [ ] Screen reader announces open/close states

### Cross-Browser Testing
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (desktop)
- [ ] Safari (iOS mobile)
- [ ] Chrome (Android mobile)

### Performance Testing
- [ ] No layout shift when opening menus
- [ ] Smooth animations (60fps)
- [ ] No JavaScript errors in console
- [ ] Works with jQuery disabled

---

## Success Criteria

Phase 2C is complete when:

1. ✅ All 4 layout modes implemented and functional
2. ✅ LayoutPicker component working in editor
3. ✅ All layout-specific controls show/hide correctly
4. ✅ CSS styling system supports all layouts
5. ✅ Frontend Interactivity API logic complete
6. ✅ Responsive behavior working on mobile
7. ✅ All accessibility requirements met
8. ✅ All tests passing (editor, frontend, browser, accessibility)
9. ✅ Build completes without errors
10. ✅ Documentation updated in HYBRID-REWRITE.md

---

## Files Modified Summary

**New files:**
- `blocks/mega-menu/src/components/LayoutPicker.jsx` (~120 lines)

**Modified files:**
- `blocks/mega-menu/src/block.json` (+30 lines - new attributes)
- `blocks/mega-menu/src/edit.js` (+80 lines - LayoutPicker integration)
- `blocks/mega-menu/src/save.jsx` (+60 lines - layout markup)
- `blocks/mega-menu/src/view.js` (+150 lines - layout logic)
- `blocks/mega-menu/src/style.scss` (+300 lines - layout styles)
- `blocks/mega-menu/src/editor.scss` (+40 lines - LayoutPicker styles)

**Total estimated additions:** ~780 lines of code

---

## Estimated Time

| Task | Time Estimate |
|------|--------------|
| Attributes (Step 1) | 15 minutes |
| LayoutPicker Component (Step 2) | 45 minutes |
| Editor Integration (Step 3) | 30 minutes |
| CSS Styling System (Step 4) | 2-3 hours |
| Frontend Markup (Step 5) | 1 hour |
| Interactivity Logic (Step 6) | 2-3 hours |
| LayoutPicker Styles (Step 7) | 20 minutes |
| Testing & Debugging | 2-3 hours |
| **Total** | **8-11 hours** |

---

## Dependencies & Prerequisites

**Required before starting:**
- ✅ Phase 2B complete (IconPicker, AnimationControls)
- ✅ WordPress Interactivity API knowledge
- ✅ CSS Grid/Flexbox proficiency
- ✅ Understanding of focus management

**External dependencies:**
- WordPress 6.7+
- @wordpress/interactivity package
- Modern browser with CSS Grid support

---

## Next Phase

After Phase 2C completion:
- **Phase 2D:** Content Block Ecosystem (Column, Section, Item blocks)
- **Phase 2E:** Advanced Styling Controls
- **Phase 2F:** Mobile-First Enhancements

---

## Notes & Considerations

### Design Decisions

1. **Default Layout:** Dropdown mode for familiarity
2. **Mobile Strategy:** Dropdown converts to full-screen, others maintain behavior
3. **Hover vs Click:** User-configurable for dropdown/grid modes
4. **Positioning:** Auto-alignment with collision detection for dropdown
5. **Focus Management:** Strict focus trap for overlay/sidebar, optional for dropdown/grid

### Performance Considerations

1. **CSS-based animations** - No JavaScript animation libraries
2. **Conditional rendering** - Only render backdrop when needed
3. **Event delegation** - Single outside-click listener
4. **Mobile-first CSS** - Base styles for mobile, enhance for desktop

### Accessibility Priorities

1. **Focus trap** - Critical for overlay/sidebar modes
2. **Keyboard navigation** - All layouts fully keyboard accessible
3. **ARIA attributes** - Dynamic aria-expanded, aria-controls
4. **Screen reader** - Clear announcements for state changes

---

**Document Version:** 1.0
**Created:** 2026-01-16
**Status:** Ready to Begin 🎯

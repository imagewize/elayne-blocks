# Mega Menu Positioning Test Report

**Date:** 2026-01-18
**Test Site:** http://demo.imagewize.test
**Tested By:** Automated Playwright Tests

## Executive Summary

The mega menu smart positioning logic (flip-horizontal and nudge-left) is **not working** due to a critical bug in the `data-wp-interactive` attribute format. The Interactivity API is not being initialized, preventing the JavaScript positioning logic from executing.

## Issue Identified

### Root Cause

**File:** `/Users/jasperfrumau/code/elayne-blocks/blocks/mega-menu/src/render.php`
**Line:** 119

The `data-wp-interactive` attribute is using an incorrect JSON format:

```php
data-wp-interactive='{"namespace": "elayne/mega-menu"}'
```

This should be:

```php
data-wp-interactive="elayne/mega-menu"
```

### Impact

Because the Interactivity API is not initializing:
1. The `calculateDropdownPosition()` function in `view.js` never executes
2. Menu panels overflow the viewport without correction
3. Neither `flip-horizontal` class nor negative `left` positioning is applied

## Test Results

### Test 1: Multi-Viewport Edge Case Testing

Tests were run across 5 different viewport widths to identify when overflow occurs:

| Viewport | Test Name         | Panel Width | Overflow Amount | Fix Applied |
|----------|-------------------|-------------|-----------------|-------------|
| 1920px   | Desktop Wide      | 644px       | None            | None (OK)   |
| 1440px   | Desktop Standard  | 644px       | **170px**       | ❌ None     |
| 1280px   | Desktop Small     | 644px       | **250px**       | ❌ None     |
| 1024px   | Tablet Landscape  | 635px       | **361px**       | ❌ None     |
| 768px    | Tablet Portrait   | 100px       | None            | None (OK)   |

**Result:** At 1440px, 1280px, and 1024px viewports, the menu overflows significantly but no positioning corrections are applied.

### Test 2: Context Inspection

**Inspection Results:**
- `data-wp-interactive` attribute: **Malformed** (JSON object instead of string)
- Interactivity API initialization: **Failed**
- Context data (`data-wp-context`): Present but not processed
- JavaScript store initialization: **Not executing**

**Panel State Analysis (1440px viewport):**
```
Panel Width: 644.28px
Panel X Position: 965.88px
Panel Right Edge: 1610.16px (overflows by 170px)
Viewport Width: 1440px
Left Style: 0px (should be -190px for nudge correction)
Flip Horizontal Class: Not applied (should be applied for 170px overflow)
```

### Test 3: Visual Verification

Screenshots captured at different states:

1. **Initial State:** `/screenshots/01-initial-state.png`
   - Shows navigation with mega menu toggle

2. **Menu Opened (1920px):** `/screenshots/02-menu-opened.png`
   - Menu fits within viewport (no issue)

3. **Menu Opened (1440px):** `/screenshots/desktop-standard-02-opened.png`
   - Menu overflows right edge by 170px (visible cutoff)

4. **Menu Opened (1280px):** `/screenshots/desktop-small-02-opened.png`
   - Menu overflows right edge by 250px (severe cutoff)

## Expected Behavior

Based on the code in `/blocks/mega-menu/src/view.js` (lines 17-47), the positioning logic should:

### For Overflow > 100px (Flip Method)
- Apply `flip-horizontal` class to panel
- Align menu to right edge instead of left
- Example: 170px overflow at 1440px should trigger flip

### For Overflow 0-100px (Nudge Method)
- Apply negative `left` style: `-{overflow + 20}px`
- Shift menu left to fit within viewport
- Example: 50px overflow should apply `left: -70px`

### For No Overflow
- No modifications needed
- Panel uses default left-aligned positioning

## Current Behavior

**All viewports:** No positioning corrections applied, regardless of overflow amount.

## Code Analysis

### Smart Positioning Function (view.js)

```javascript
function calculateDropdownPosition( panel, alignment ) {
    if ( alignment !== 'auto' ) {
        return {};
    }

    const panelRect = panel.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const overflowRight = panelRect.right - viewportWidth;

    // If overflow is significant (>100px), flip to right alignment
    if ( overflowRight > 100 ) {
        return {
            flipHorizontal: true,
            nudgeLeft: 0,
        };
    }

    // If minor overflow, nudge left slightly with 20px buffer
    if ( overflowRight > 0 ) {
        return {
            flipHorizontal: false,
            nudgeLeft: overflowRight + 20,
        };
    }

    // No overflow, keep default position
    return {
        flipHorizontal: false,
        nudgeLeft: 0,
    };
}
```

This function is never being called because the Interactivity API isn't initialized.

## Fix Required

### Change in render.php (Line 119)

**Before:**
```php
data-wp-interactive='{"namespace": "elayne/mega-menu"}'
```

**After:**
```php
data-wp-interactive="elayne/mega-menu"
```

This will properly initialize the Interactivity API store and allow the positioning logic to execute.

## Testing Recommendations

After applying the fix:

1. **Re-run multi-viewport tests** to verify positioning corrections apply
2. **Test at 1440px** to confirm flip-horizontal is applied (170px overflow)
3. **Test at edge cases** where overflow is exactly 100px to verify threshold logic
4. **Test alignment settings** (left, right, center, auto) to ensure auto-only triggers smart positioning
5. **Test other layout modes** (overlay, sidebar, grid) to ensure no regression

## Screenshots

All test screenshots are available in:
- `/Users/jasperfrumau/code/elayne-blocks/screenshots/`

Key screenshots:
- `desktop-standard-02-opened.png` - Shows 170px overflow issue
- `desktop-small-02-opened.png` - Shows 250px overflow issue
- `context-inspection.png` - Shows detailed state during overflow

## Additional Notes

- The `dropdownAlignment` attribute is correctly set to `"auto"` in the context
- The positioning logic itself is well-implemented
- The issue is purely in the Interactivity API initialization
- Once fixed, the smart positioning should work as designed

## Test Scripts

Three Playwright test scripts were created for this analysis:

1. **test-mega-menu-positioning.js** - Basic positioning test
2. **test-mega-menu-edge-cases.js** - Multi-viewport testing
3. **inspect-menu-context.js** - Deep context inspection

All scripts are available in the project root directory.

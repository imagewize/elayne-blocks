# Mega Menu Auto-Positioning Investigation & Action Plan

**Date:** 2026-01-18
**Issue:** Mega menu dropdown extends beyond viewport on smaller screens
**Status:** ❌ NOT RESOLVED after multiple attempts

---

## Problem Statement

The mega menu dropdown panel overflows the right edge of the viewport on screen sizes below 1920px. The auto-positioning logic intended to fix this is not working despite multiple implementation attempts.

**User's Screenshot:** Shows menu extending beyond viewport edge at ~1100px viewport width

---

## What We've Tried (Chronologically)

### Attempt 1: Initial Smart Positioning (Commit: 8392073)
**Approach:** Implemented `calculateDropdownPosition()` with flip-horizontal and nudge-left logic
**Result:** ❌ Failed - positioning calculated in `requestAnimationFrame` after panel was already visible

### Attempt 2: Hybrid Nudge/Flip System (Commit: 9068c8d)
**Approach:**
- Overflow > 100px: Flip to right alignment
- Overflow 0-100px: Nudge left with 20px buffer
- No overflow: Default position

**Result:** ❌ Failed - timing issue persisted

### Attempt 3: Interactivity API Fix (Commit: 843b022)
**Approach:** Fixed malformed `data-wp-interactive` attribute (was JSON object, should be string)
**Result:** ✅ Fixed initialization, but positioning still didn't work

### Attempt 4: Pre-calculation with Temporary Visibility (Commit: 90bfdec - TODAY)
**Approach:**
- Set panel to `visibility: hidden; opacity: 0` BEFORE opening
- Add `is-open` class temporarily for measurement
- Calculate position with panel rendered but invisible
- Apply positioning
- Remove temporary styles
- THEN set `context.isOpen = true` to make visible

**Code changes:**
```javascript
// BEFORE setting isOpen
panel.style.visibility = 'hidden';
panel.style.opacity = '0';
panel.classList.add('is-open');

// Calculate and apply positioning
const { flipHorizontal, nudgeLeft } = calculateDropdownPosition(panel, dropdownAlignment);

// Apply styles...

// Clean up
panel.style.visibility = '';
panel.style.opacity = '';
panel.classList.remove('is-open');

// NOW set isOpen
context.isOpen = true;
```

**Result:** ❌ FAILED - User still sees overflow after:
- Composer update
- WP cache flush
- Browser cache clear
- Block removal and re-add

---

## Test Results

### Our Automated Tests (1920px viewport)
✅ **PASS** - Menu fits within viewport with 71px clearance

### User's Real-World Test (~1100px viewport based on screenshot)
❌ **FAIL** - Menu extends beyond right edge

**CRITICAL FINDING:** Our tests only ran at 1920px width. The old test report shows failures at:
- 1440px: 170px overflow
- 1280px: 250px overflow
- 1024px: 361px overflow

---

## Root Cause Analysis

### Theory 1: Code Not Deploying ❌
**Evidence against:**
- Commit 90bfdec shows build files updated
- Composer shows upgrade from fccdd36 → 90bfdec
- WP cache flushed
- Block re-added

### Theory 2: CSS Specificity Conflict ⚠️
**Possible:** Inline styles from JS might be overridden by CSS `!important` rules

### Theory 3: Interactivity API Timing Issue ⚠️
**Possible:** Even with pre-calculation, the Interactivity API's reactive system might be interfering

### Theory 4: Our Fix Only Works at 1920px ✅ LIKELY
**Evidence:**
- All our tests were at 1920px
- User's viewport appears much smaller (based on screenshot)
- We haven't tested at actual problem viewports

---

## Diagnostic Steps Needed

### Step 1: Test at User's Actual Viewport Size

Create test at ~1100px width to reproduce the issue:

```javascript
const context = await browser.newContext({
    viewport: { width: 1100, height: 800 },
});
```

### Step 2: Check if JS is Actually Running

Add console.log to view.js to verify code execution:

```javascript
console.log('Mega Menu: openMenu called', { layoutMode, dropdownAlignment });
console.log('Panel positioning:', { flipHorizontal, nudgeLeft, overflow });
```

### Step 3: Inspect Live DOM

Check browser dev tools on live site:
- Does panel have `flip-horizontal` class?
- What is the inline `style.left` value?
- Is `data-wp-interactive` present and correct?

---

## Alternative Solutions

Given the difficulty of making auto-positioning work, here are practical alternatives:

### Option A: Simple Right-Align for Right-Side Menus ⭐ RECOMMENDED
**Pros:**
- Simple, reliable CSS-only solution
- No JavaScript required
- Works immediately
- User mentioned willingness to try this

**Implementation:**
```php
// In render.php, add alignment control
$alignment = $attributes['menuAlignment'] ?? 'left';

// Apply CSS class
&.align-right .wp-block-elayne-mega-menu__panel {
    left: auto;
    right: 0;
}
```

**User Control:** Add inspector control to choose left/right/center alignment

### Option B: Max-Width + Auto Margins
**Pros:**
- Prevents overflow by constraining panel width
- Centers panel under toggle
- Works on all screen sizes

**Implementation:**
```css
.wp-block-elayne-mega-menu__panel {
    max-width: min(600px, 90vw);
    left: 50%;
    transform: translateX(-50%);
}
```

### Option C: Viewport-Aware Max Width
**Pros:**
- Panel never exceeds viewport
- Simple CSS only
- No positioning logic needed

**Implementation:**
```css
.wp-block-elayne-mega-menu__panel {
    max-width: calc(100vw - 40px); /* 20px margin each side */
}
```

### Option D: Give Up on Auto, Provide Manual Controls ⭐ PRACTICAL
**Pros:**
- User has full control
- Predictable behavior
- Simpler codebase

**Implementation:**
- Add "Dropdown Alignment" setting in inspector
- Options: Auto (current buggy behavior), Left, Right, Center
- Default to "Left" or "Right" based on menu position in nav

### Option E: Fix the Auto-Positioning (One More Try)
**What we haven't tried:**
- Using `MutationObserver` to detect when panel becomes visible
- Setting position via CSS custom properties instead of inline styles
- Using `position: fixed` instead of `absolute` for positioning
- Calculating based on toggle position relative to viewport, not panel

---

## Recommended Action Plan

### Immediate Fix (30 minutes):

1. **Add manual alignment control** (Option D)
   - Add `dropdownAlign` attribute with options: left, right, center
   - Apply via CSS classes (no JavaScript)
   - Set sensible default based on toggle position

### Short-term (If user wants auto-positioning):

2. **Debug at actual viewport sizes**
   - Test at 1100px, 1280px, 1440px
   - Add console logging to view.js
   - Inspect actual DOM on live site
   - Screenshot at each step

3. **Try position: fixed approach**
   - Calculate toggle position relative to viewport
   - Use fixed positioning for panel
   - Position based on toggle coords

### Long-term:

4. **Consider removing auto-positioning entirely**
   - Too complex for the value it provides
   - Manual controls are more predictable
   - Reduces JavaScript bundle size
   - Easier to maintain

---

## Files Modified in This Investigation

1. `blocks/mega-menu/src/view.js` - Multiple positioning attempts
2. `blocks/mega-menu/src/render.php` - Fixed data-wp-interactive
3. `tests/test-mega-menu-positioning.js` - Basic positioning test
4. `tests/test-mega-menu-edge-cases.js` - Multi-viewport test
5. `tests/inspect-menu-context.js` - Deep inspection
6. `tests/test-css-investigation.js` - CSS rule analysis
7. `tests/test-visual-issue.js` - Visual verification
8. `tests/test-zoomed-screenshot.js` - Close-up screenshots
9. `tests/test-check-js-loaded.js` - Verify JS deployment
10. `tests/test-live-diagnostic.js` - Complete diagnostic

---

## Decision Point

**User:** You've indicated frustration and suggested dropping auto-positioning in favor of manual left/right alignment. This is actually the **most pragmatic solution**.

**Recommendation:** Implement Option A or D above - give users a simple alignment control and remove the auto-positioning complexity.

**Estimated time:**
- Option A (Right-align setting): 30 minutes
- Option D (Full manual control): 1 hour
- Continue debugging auto: Unknown, possibly many hours with no guarantee

**Your call:** Which direction would you like to go?

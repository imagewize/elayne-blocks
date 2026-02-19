# Admin Panel Testing Guide

This document provides testing instructions for the block management admin panel feature.

## Testing Checklist

### Basic Functionality

- [ ] **Settings page appears under Settings menu**
  - Navigate to WordPress Admin → Settings
  - Verify "Elayne Blocks" menu item appears
  - Click to access the settings page

- [ ] **Checkboxes save correctly to database**
  - Change some checkbox values
  - Click "Save Changes"
  - Verify success message appears
  - Reload the page
  - Confirm changed values are still saved

- [ ] **All 6 blocks appear in settings**
  - [ ] Carousel Block
  - [ ] Slide Block
  - [ ] Mega Menu Block
  - [ ] FAQ Tabs Block
  - [ ] FAQ Tab Answer Block
  - [ ] Search Overlay Trigger Block

### Block Registration

- [ ] **Disabled blocks don't appear in block inserter**
  - Disable "Mega Menu Block" in settings
  - Save changes
  - Create/edit a post or page
  - Open block inserter
  - Verify "Mega Menu" block is NOT available
  - Re-enable the block and verify it reappears

- [ ] **Disabled blocks don't register on frontend**
  - Disable a block in settings
  - Visit frontend
  - Use browser dev tools to check that block scripts/styles are not loaded

### Asset Loading

- [ ] **Carousel assets don't load when carousel is disabled**
  - Disable "Carousel Block" in settings
  - Create a page without carousel
  - Visit the page
  - Check browser Network tab
  - Verify Slick Carousel CSS/JS files are NOT loaded

- [ ] **Carousel assets load when carousel is enabled and used**
  - Enable "Carousel Block" in settings
  - Add a carousel to a page
  - Visit the page
  - Verify Slick Carousel assets load

### Parent-Child Dependencies

- [ ] **Slide block auto-disables when Carousel is disabled**
  - Check "Slide Block" checkbox
  - Uncheck "Carousel Block" checkbox
  - Save changes
  - Verify "Slide Block" is automatically unchecked

- [ ] **FAQ Tab Answer auto-disables when FAQ Tabs is disabled**
  - Check "FAQ Tab Answer Block" checkbox
  - Uncheck "FAQ Tabs Block" checkbox
  - Save changes
  - Verify "FAQ Tab Answer Block" is automatically unchecked

- [ ] **Dependency warnings display correctly**
  - Verify "Slide Block" shows: "Requires Carousel Block to be enabled"
  - Verify "FAQ Tab Answer Block" shows: "Requires FAQ Tabs Block to be enabled"

- [ ] **JavaScript dependency handling works**
  - Load settings page
  - Uncheck "Carousel Block"
  - Verify "Slide Block" becomes disabled (grayed out)
  - Re-check "Carousel Block"
  - Verify "Slide Block" becomes enabled again

### Security

- [ ] **Only administrators can access settings page**
  - Log in as non-administrator user
  - Try to access Settings → Elayne Blocks
  - Verify access is denied

- [ ] **Settings page uses proper WordPress security**
  - Inspect form HTML
  - Verify nonce field is present
  - Verify WordPress settings_fields() is used

### Bulk Actions

- [ ] **"Enable All" bulk action works**
  - Disable some blocks
  - Click "Enable All" button
  - Verify all checkboxes become checked
  - Save changes and verify

- [ ] **"Disable All" bulk action works**
  - Enable all blocks
  - Click "Disable All" button
  - Verify all checkboxes become unchecked
  - Save changes and verify

### Backward Compatibility

- [ ] **Existing sites with no saved settings see all blocks enabled**
  - Delete the `elayne_blocks_enabled` option from database:
    ```sql
    DELETE FROM wp_options WHERE option_name = 'elayne_blocks_enabled';
    ```
  - Visit a page with existing blocks
  - Verify all blocks still work
  - Visit Settings → Elayne Blocks
  - Verify all checkboxes are checked by default

### UI/UX

- [ ] **Settings page displays properly**
  - Verify page title shows "Elayne Blocks Settings"
  - Verify section description is clear
  - Verify all labels are readable
  - Verify descriptions provide helpful context

- [ ] **Success/error messages work**
  - Save settings
  - Verify success message appears
  - Verify message styling matches WordPress admin

- [ ] **Form submission works**
  - Change settings
  - Click "Save Changes"
  - Verify page reloads with updated values
  - Verify no JavaScript errors in console

## Manual Testing Steps

### Test 1: Basic Enable/Disable Flow

1. Go to Settings → Elayne Blocks
2. Disable "Mega Menu Block"
3. Click "Save Changes"
4. Create a new post
5. Try to add a Mega Menu block
6. **Expected:** Block should not be available in inserter
7. Return to settings and re-enable "Mega Menu Block"
8. Refresh the post editor
9. **Expected:** Mega Menu block is now available

### Test 2: Parent-Child Dependency

1. Go to Settings → Elayne Blocks
2. Ensure both "Carousel Block" and "Slide Block" are enabled
3. Click "Carousel Block" to uncheck it
4. **Expected:** JavaScript alert confirms disabling
5. Accept the alert
6. **Expected:** "Slide Block" automatically becomes unchecked and disabled
7. Click "Save Changes"
8. Reload the page
9. **Expected:** Both blocks remain unchecked
10. Re-enable "Carousel Block"
11. **Expected:** "Slide Block" becomes enabled (but not checked)

### Test 3: Asset Loading

1. Enable "Carousel Block" in settings
2. Create a page with a carousel
3. Publish the page
4. Visit the page on frontend
5. Open browser DevTools → Network tab
6. Reload the page
7. **Expected:** See `slick.css`, `slick-theme.css`, and `slick.min.js` loaded
8. Return to settings and disable "Carousel Block"
9. Visit a different page without carousel
10. Check Network tab
11. **Expected:** Slick assets are NOT loaded

### Test 4: Bulk Actions

1. Go to Settings → Elayne Blocks
2. Click "Disable All"
3. **Expected:** All checkboxes become unchecked
4. Click "Enable All"
5. **Expected:** All checkboxes become checked
6. Disable only "Carousel Block"
7. Click "Save Changes"
8. **Expected:** All blocks except Carousel and Slide are enabled

## Browser Console Tests

Run these JavaScript snippets in the browser console on the settings page:

```javascript
// Test 1: Verify all checkboxes are present
console.log('Checkboxes:', $('.elayne-block-checkbox').length);
// Expected: 6

// Test 2: Check dependency data attributes
console.log('Slide parent:', $('#elayne_blocks_slide').data('parent'));
// Expected: "carousel"

console.log('FAQ Tab Answer parent:', $('#elayne_blocks_faq-tab-answer').data('parent'));
// Expected: "faq-tabs"

// Test 3: Test Enable All function
$('#elayne-enable-all').click();
console.log('All checked:', $('.elayne-block-checkbox:checked').length);
// Expected: 6

// Test 4: Test Disable All function
$('#elayne-disable-all').click();
console.log('All unchecked:', $('.elayne-block-checkbox:not(:checked)').length);
// Expected: 6
```

## Database Verification

Check the WordPress options table to verify settings are saved correctly:

```sql
-- View current settings
SELECT * FROM wp_options WHERE option_name = 'elayne_blocks_enabled';

-- The option_value should be a serialized array like:
-- a:6:{s:8:"carousel";b:1;s:5:"slide";b:1;s:9:"mega-menu";b:1;s:8:"faq-tabs";b:1;s:16:"faq-tab-answer";b:1;s:22:"search-overlay-trigger";b:1;}
```

## Known Issues / Edge Cases

1. **Existing content with disabled blocks**: If a user disables a block that's already in use on published pages, the block will still render on those pages but won't be editable.

2. **Theme cache**: Some themes with aggressive caching may need cache clearing after changing block settings.

3. **Page builders**: Third-party page builders that modify block registration may conflict with this feature.

## Regression Testing

After making changes to the admin panel, verify:

- [ ] All existing blocks still work when enabled
- [ ] Block editor loads without errors
- [ ] Frontend pages with blocks display correctly
- [ ] No PHP warnings or notices in debug log
- [ ] No JavaScript errors in browser console

## Performance Testing

- [ ] Settings page loads quickly (< 1 second)
- [ ] Saving settings completes in reasonable time
- [ ] No noticeable impact on frontend page load times
- [ ] Database queries are optimized (use Query Monitor plugin)

## Accessibility Testing

- [ ] Settings page is keyboard navigable
- [ ] Screen readers can read all labels and descriptions
- [ ] Checkboxes have proper labels
- [ ] Focus indicators are visible
- [ ] Color contrast meets WCAG standards

## Cross-Browser Testing

Test the admin settings page in:

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

## Mobile/Responsive Testing

- [ ] Settings page is readable on tablet (768px)
- [ ] Settings page is readable on mobile (375px)
- [ ] Buttons are tappable on touch devices
- [ ] No horizontal scrolling on small screens

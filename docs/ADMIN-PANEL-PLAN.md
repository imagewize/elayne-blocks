# Admin Panel for Block Management

## Overview

Add a WordPress admin panel to allow users to selectively enable/disable individual blocks in the Elayne Blocks plugin.

**Available Blocks:**
1. **Carousel** (elayne/carousel) - Parent block for slides
2. **Slide** (elayne/slide) - Child block, requires Carousel
3. **Mega Menu** (elayne/mega-menu) - Standalone navigation block
4. **FAQ Tabs** (elayne/faq-tabs) - Parent block for FAQ answers
5. **FAQ Tab Answer** (elayne/faq-tab-answer) - Child block, requires FAQ Tabs
6. **Search Overlay Trigger** (elayne/search-overlay-trigger) - Standalone search block

## Current Architecture

The plugin uses **dynamic block discovery** (`elayne-blocks.php:31-55`):
- Scans `/blocks` directory on `init` action
- Auto-registers all blocks with `build/block.json` files
- No manual control over which blocks are registered

## Goals

1. **Settings page** in WordPress admin under Settings → Elayne Blocks
2. **Checkbox controls** to enable/disable each block individually
3. **Persistent storage** of user preferences in WordPress options
4. **Modified registration logic** to respect user settings
5. **Performance consideration** - only load assets for enabled blocks
6. **Default behavior** - all blocks enabled by default (backward compatible)

## Implementation Plan

### Phase 1: Admin Interface

**File: `includes/admin/settings-page.php`** (new)
- Register settings page under Settings menu
- Create settings form with checkboxes for each block:
  - ☐ Carousel Block
  - ☐ Mega Menu Block
  - ☐ FAQ Tabs Block
  - ☐ Search Overlay Trigger Block
  - ☐ Slide Block (auto-disabled if Carousel is disabled)
  - ☐ FAQ Tab Answer Block (auto-disabled if FAQ Tabs is disabled)
- Use WordPress Settings API for form handling
- Add "Save Changes" button

**Key functions:**
```php
elayne_blocks_add_settings_page()     // Hook into admin_menu
elayne_blocks_register_settings()     // Register settings with Settings API
elayne_blocks_settings_page_html()    // Render settings page HTML
elayne_blocks_settings_section_cb()   // Section callback
elayne_blocks_settings_field_cb()     // Field callback for each block
```

**Option name:** `elayne_blocks_enabled`
**Data structure:**
```php
array(
    'carousel' => true,
    'slide' => true,
    'mega-menu' => true,
    'faq-tabs' => true,
    'faq-tab-answer' => true,
    'search-overlay-trigger' => true,
)
```

### Phase 2: Conditional Block Registration

**Modify: `elayne-blocks.php`**

**Current registration loop:**
```php
foreach ( $blocks as $block ) {
    register_block_type( $block );
}
```

**Updated registration logic:**
```php
$enabled_blocks = get_option( 'elayne_blocks_enabled', array(
    'carousel' => true,
    'slide' => true,
    'mega-menu' => true,
    'faq-tabs' => true,
    'faq-tab-answer' => true,
    'search-overlay-trigger' => true,
) );

foreach ( $blocks as $block ) {
    $block_name = basename( dirname( $block ) );

    // Skip if block is disabled
    if ( isset( $enabled_blocks[ $block_name ] ) && ! $enabled_blocks[ $block_name ] ) {
        continue;
    }

    register_block_type( $block );
}
```

### Phase 3: Conditional Asset Loading

**Modify: `elayne-blocks.php` (lines 60-90)**

Current Slick Carousel conditional loading checks `has_block()`. This should also respect admin settings:

```php
function elayne_blocks_enqueue_carousel_assets() {
    $enabled_blocks = get_option( 'elayne_blocks_enabled', array( 'carousel' => true ) );

    // Don't load if carousel is disabled
    if ( ! $enabled_blocks['carousel'] ) {
        return;
    }

    if ( has_block( 'elayne/carousel' ) ) {
        // Enqueue Slick assets
    }
}
```

### Phase 4: Parent-Child Block Handling

**Two parent-child relationships exist:**

1. **Carousel → Slide**: Slide block can only exist inside Carousel
2. **FAQ Tabs → FAQ Tab Answer**: FAQ Tab Answer can only exist inside FAQ Tabs

**Implementation Strategy (Option 2 - Better UX):**

```php
// Validate dependencies on save
function elayne_blocks_validate_dependencies( $enabled_blocks ) {
    // If Carousel is disabled, auto-disable Slide
    if ( empty( $enabled_blocks['carousel'] ) ) {
        $enabled_blocks['slide'] = false;
    }

    // If FAQ Tabs is disabled, auto-disable FAQ Tab Answer
    if ( empty( $enabled_blocks['faq-tabs'] ) ) {
        $enabled_blocks['faq-tab-answer'] = false;
    }

    return $enabled_blocks;
}
```

**Admin UI Enhancements:**
- Show dependency notice: "Note: Slide block requires Carousel block to be enabled"
- Show dependency notice: "Note: FAQ Tab Answer requires FAQ Tabs block to be enabled"
- Disable child checkboxes when parent is unchecked (JavaScript)
- Display warning if user tries to enable child without parent

### Phase 5: Settings Page Enhancements

**Additional features:**

1. **Block descriptions** - Help text explaining each block's purpose
   ```
   ☐ Carousel Block
      Create responsive image/content carousels with Slick Carousel

   ☐ Slide Block
      Individual slides for Carousel block (requires Carousel)

   ☐ Mega Menu Block
      Add expandable mega menus to navigation

   ☐ FAQ Tabs Block
      Interactive FAQ with vertical tabs and content panels

   ☐ FAQ Tab Answer Block
      Individual FAQ answers (requires FAQ Tabs)

   ☐ Search Overlay Trigger Block
      Full-screen search overlay with custom styling
   ```

2. **Bulk actions**
   - "Enable All" button
   - "Disable All" button

3. **Usage indicator**
   - Show which blocks are currently in use across the site
   - Query database for post content containing each block
   - Display count: "Used in 5 posts/pages"

4. **Dependency warnings**
   - Show Carousel → Slide relationship
   - Show FAQ Tabs → FAQ Tab Answer relationship
   - Visual indicators (indentation or icons) for child blocks

## File Structure

```
elayne-blocks/
├── includes/
│   └── admin/
│       ├── settings-page.php    # Admin settings page
│       └── settings-fields.php  # Field rendering helpers (optional)
├── elayne-blocks.php            # Modified registration logic
└── assets/
    └── admin/
        ├── admin-settings.css   # Settings page styles
        └── admin-settings.js    # Settings page interactivity
```

## Security Considerations

1. **Capability checks** - Only administrators can access settings
   ```php
   if ( ! current_user_can( 'manage_options' ) ) {
       return;
   }
   ```

2. **Nonce verification** - Protect settings form
   ```php
   check_admin_referer( 'elayne_blocks_settings' );
   ```

3. **Data sanitization** - Sanitize checkbox inputs
   ```php
   sanitize_text_field( $_POST['block_name'] )
   ```

4. **Settings API** - Use WordPress Settings API (handles security automatically)

## Backward Compatibility

1. **Default all enabled** - Existing users see no change in behavior
2. **Option fallback** - If option doesn't exist, assume all blocks enabled
3. **No database migration needed** - New installations get default enabled state

## Testing Checklist

- [ ] Settings page appears under Settings menu
- [ ] Checkboxes save correctly to database
- [ ] Disabled blocks don't appear in block inserter
- [ ] Disabled blocks don't register on frontend
- [ ] Carousel assets don't load when carousel is disabled
- [ ] Slide block auto-disables when Carousel is disabled
- [ ] FAQ Tab Answer auto-disables when FAQ Tabs is disabled
- [ ] All 6 blocks appear in settings (Carousel, Slide, Mega Menu, FAQ Tabs, FAQ Tab Answer, Search Overlay Trigger)
- [ ] Only administrators can access settings page
- [ ] Settings page displays dependency warnings
- [ ] "Enable All" / "Disable All" bulk actions work
- [ ] Existing sites with no saved settings see all blocks enabled

## Future Enhancements

1. **Per-block settings** - Expand to include block-specific configuration
2. **Import/Export settings** - Allow settings backup/restore
3. **Multisite support** - Network-wide or per-site settings
4. **Block usage analytics** - Track which blocks are most used
5. **Disable unused features** - Disable specific carousel features (thumbnails, center mode, etc.)

## Development Notes

- Follow WordPress Coding Standards for PHP
- Use WordPress Settings API (no custom database tables)
- Leverage existing WordPress UI components (buttons, notices, forms)
- Add admin styles that match WordPress admin theme
- Consider accessibility (ARIA labels, keyboard navigation)
- Add inline documentation for all functions

## Estimated Implementation Time

- **Phase 1 (Admin Interface):** 2-3 hours
- **Phase 2 (Conditional Registration):** 1 hour
- **Phase 3 (Conditional Assets):** 1 hour
- **Phase 4 (Dependency Handling):** 1-2 hours
- **Phase 5 (Enhancements):** 2-3 hours
- **Testing & Polish:** 1-2 hours

**Total:** 8-12 hours

## Open Questions

1. Should we add a "Reset to Defaults" button?
2. Should disabled blocks be hidden from existing content (or show placeholder)?
3. Should we add telemetry to track which blocks are most commonly disabled?
4. Should settings be network-wide on multisite installations?
5. Should we add capability for non-admin roles to manage blocks?

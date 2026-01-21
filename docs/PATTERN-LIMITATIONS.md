# Pattern Limitations for Mega Menu Template Parts

## Overview

This document explains limitations in WordPress core that affect how patterns work with mega menu template parts, and provides workarounds for users and developers.

## The Limitation

**User-created patterns cannot be filtered by template part area.**

When users create patterns in the WordPress Site Editor (Appearance → Editor → Patterns → My Patterns) and assign them to the "Menus" category, these patterns will **NOT** appear in the pattern inserter when creating or editing template parts with the "Menus" area.

### Why This Happens

WordPress has two distinct pattern systems:

1. **Programmatically registered patterns** - Registered via `register_block_pattern()` in PHP code
   - Can have `blockTypes` metadata (e.g., `core/template-part/menu`)
   - Appear in template part inserters when filtered by area
   - **This is what the plugin's patterns use**

2. **User-created patterns** - Created in Site Editor and stored as `wp_block` post type
   - **Cannot have `blockTypes` metadata** (not exposed in UI)
   - Stored in database with only: title, description, categories, sync status
   - Do NOT appear in template part inserters filtered by area

### Technical Details

- The `blockTypes` parameter is only available when calling `register_block_pattern()` in PHP
- User-created patterns stored as `wp_block` posts have no equivalent database field for `blockTypes`
- Re-registering user patterns programmatically doesn't work because WordPress pulls pattern data from the database, not the registry
- This is a WordPress core limitation as of version 6.7

## What Works

✅ **Plugin-provided patterns** (stored in `patterns/mega-menu-*.php`)
- These patterns appear in the template part inserter when creating "Menus" template parts
- Users can insert these patterns when building template parts
- Fully customizable after insertion

✅ **Theme-based patterns** (in theme's `/patterns/*.php` directory)
- Themes can provide additional mega menu patterns
- Must include proper file headers with `Block Types: core/template-part/menu`
- Appear alongside plugin patterns

## Workarounds

### For Users

**Option 1: Use Plugin Patterns** (Recommended)
1. Create a new template part with area "Menus"
2. Insert one of the plugin's mega menu patterns
3. Customize the content as needed
4. Save the template part

**Option 2: Manual Pattern Creation**
1. Create a new template part with area "Menus"
2. Build your mega menu content from scratch using blocks
3. Save the template part
4. (Optional) Save sections as reusable blocks for other template parts

**Option 3: Copy Pattern Content**
1. Create your pattern in the Pattern editor
2. Copy the pattern content (Ctrl/Cmd + C)
3. Create a new template part with area "Menus"
4. Paste the content into the template part
5. Save the template part

### For Developers (Theme Authors)

If you're building a theme that uses Elayne Blocks, you can provide additional mega menu patterns:

**Create pattern file:** `your-theme/patterns/mega-menu-custom.php`

```php
<?php
/**
 * Title: Custom Mega Menu
 * Slug: your-theme/mega-menu-custom
 * Description: Custom mega menu pattern for your theme
 * Categories: menus
 * Block Types: core/template-part/menu
 */
?>

<!-- wp:group {"layout":{"type":"constrained"}} -->
<div class="wp-block-group">
    <!-- Your pattern content here -->
</div>
<!-- /wp:group -->
```

**Key requirements:**
- File must be in theme's `/patterns/` directory
- Must include `Block Types: core/template-part/menu` in file header
- Must be categorized as `menus`
- WordPress will automatically register it

## What Doesn't Work

❌ **Attempting to re-register user patterns programmatically**
```php
// This approach does NOT work:
$user_patterns = get_posts(['post_type' => 'wp_block']);
foreach ($user_patterns as $pattern) {
    register_block_pattern('custom/' . $pattern->ID, [
        'content' => $pattern->post_content,
        'blockTypes' => ['core/template-part/menu'], // Has no effect
    ]);
}
```

Why it doesn't work:
- The pattern inserter pulls data from the `wp_block` database entries
- The `blockTypes` from programmatically registered patterns is ignored
- WordPress doesn't merge database patterns with registry patterns

❌ **Adding custom meta to wp_block posts**
```php
// This approach does NOT work:
update_post_meta($pattern_id, 'wp_pattern_block_types', ['core/template-part/menu']);
```

Why it doesn't work:
- WordPress doesn't read a `wp_pattern_block_types` meta field
- Only `wp_pattern_sync_status` is supported as pattern metadata
- Core would need to be modified to support this

## Feature Requests

This limitation has been discussed in the WordPress community. If this affects your workflow, consider:

1. Opening a Gutenberg GitHub issue requesting `blockTypes` support for user-created patterns
2. Contributing to WordPress core to add UI for pattern metadata
3. Voting on existing feature requests for enhanced pattern capabilities

## Summary

**For most users:** Use the plugin's provided mega menu patterns and customize them after insertion into template parts. This is the most reliable workflow given WordPress core limitations.

**For theme developers:** Provide additional patterns via theme files to give users more starting options.

**For advanced users:** Understand that user-created patterns are currently limited to the general pattern inserter and cannot be filtered by template part area.

## Related Documentation

- [WordPress Patterns Documentation](https://developer.wordpress.org/block-editor/reference-guides/block-api/block-patterns/)
- [Registering Patterns - Theme Handbook](https://developer.wordpress.org/themes/patterns/registering-patterns/)
- [Block Type Patterns - Theme Handbook](https://developer.wordpress.org/themes/patterns/block-type-patterns/)
- [Introduction to Block Patterns - Full Site Editing](https://fullsiteediting.com/lessons/introduction-to-block-patterns/)

## Changelog

- **2026-01-21**: Initial documentation created
- Clarified WordPress 6.7 limitations with user-created patterns
- Provided workarounds for users and developers
- Explained why programmatic re-registration doesn't work

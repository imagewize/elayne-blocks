# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Elayne Blocks is a WordPress plugin providing custom Gutenberg blocks for the Elayne theme. The plugin contains three blocks: Mega Menu, Carousel, and Slide.

**Requirements:**
- WordPress 6.7+
- PHP 7.3+

## Build Commands

Each block has isolated dependencies and must be built separately:

```bash
# Build all blocks
cd blocks/carousel && npm install && npm run build
cd blocks/mega-menu && npm install && npm run build
cd blocks/slide && npm install && npm run build

# Development mode (watch for changes)
cd blocks/[block-name] && npm start

# Linting
npm run lint:js    # JavaScript linting
npm run lint:css   # CSS linting
npm run format     # Format code
```

**Important:** The mega-menu block uses `--experimental-modules` flag for its build/start commands.

## Architecture

### Block Discovery & Registration

The plugin uses **dynamic block discovery** (elayne-blocks.php:31-55). At runtime:
1. Scans `/blocks` directory during `init` action
2. Looks for `build/block.json` in each subdirectory
3. Auto-registers all discovered blocks via `register_block_type()`

This means blocks are auto-discovered - no manual registration needed when adding new blocks.

### Block Structure

Each block follows this structure:

```
blocks/[block-name]/
├── src/
│   ├── block.json       # Block metadata (single source of truth)
│   ├── index.js         # Registration entry point
│   ├── edit.js          # React editor component
│   ├── save.jsx/.js     # Frontend output markup
│   ├── view.js          # Frontend interactivity (optional)
│   ├── render.php       # Server-side rendering (optional)
│   ├── editor.scss      # Editor-only styles
│   └── style.scss       # Frontend + editor styles
├── build/               # wp-scripts output (committed for Packagist)
├── package.json
└── node_modules/
```

### Parent-Child Block Relationships

**Carousel → Slide Hierarchy:**
- Carousel (elayne/carousel) only allows Slide (elayne/slide) children
- Slide can only exist inside Carousel (enforced via `parent` constraint in block.json)
- Slide uses InnerBlocks to accept any block content

**Carousel Advanced Features:**
- **Toolbar Controls:** Quick-access buttons for Center Mode, Thumbnail Navigation, and Variable Width
- **Thumbnail Navigation:** Synced secondary carousel with image thumbnails (supports 4 positions: below/above/left/right)
- **Center Mode:** Active slide centered with partial view of adjacent slides (peek effect)
- **Variable Width:** Slides can have different widths based on content
- **Lazy Loading:** On-demand or progressive image loading for performance
- **Adaptive Height:** Auto-adjusts carousel height to match active slide
- **Organized Sidebar:** Settings grouped into Layout, Behavior, Navigation, Responsive, Colors, and Advanced panels

**Mega Menu:**
- Can only be placed inside `core/navigation` or `elayne/nav-builder` blocks
- **Template Part-Based Content System:**
  - Uses WordPress Template Parts for mega menu content (no InnerBlocks)
  - Template parts stored in `/parts` directory and registered via `get_block_templates` filter
  - Content edited naturally in Site Editor via template part selection
  - Includes 6 ready-to-use template parts (simple-list, three-column, icon-grid, featured-content, image-links, footer-style)
  - **Requires theme integration:** The Elayne theme must register the 'menu' template part area via `default_wp_template_part_areas` filter for sidebar navigation to appear
- **Layout Modes:**
  - **Dropdown:** Traditional dropdown menu beneath navigation item
  - **Overlay:** Full-screen overlay covering the entire page
- Uses WordPress Interactivity API for frontend state management
- Renders via PHP template (render.php) for dynamic content

### Conditional Asset Loading

Slick Carousel assets are loaded conditionally (elayne-blocks.php:60-90):
```php
if ( has_block( 'elayne/carousel' ) ) {
  // Only enqueue when carousel block is present on page
}
```

## WordPress Interactivity API (Mega Menu)

The mega-menu block uses the Interactivity API for frontend reactivity. Implementation is based on [Human Made's HM Mega Menu Block](https://github.com/humanmade/hm-mega-menu-block).

**Content System (Theme-Based Template Parts):**
- **Theme-scoped template parts** - Users create template parts in the Site Editor (Appearance → Editor → Patterns → Template Parts)
- Template parts are stored in the database under the active theme's namespace
- The plugin provides **patterns** (not file-based template parts) that users can insert into new template parts
- Users select template parts by slug in the mega menu block settings
- Content is fully editable in the Site Editor's standard template part workflow
- **No plugin-provided template part files** - all content lives in the database

**Required Theme Integration:**
The active theme MUST register the 'menu' template part area via the `default_wp_template_part_areas` filter. The Elayne theme includes this by default. Other themes need to add:

```php
add_filter( 'default_wp_template_part_areas', function( $areas ) {
    $areas[] = array(
        'area'        => 'menu',
        'label'       => __( 'Menus', 'your-theme' ),
        'description' => __( 'Template parts for navigation and mega menu content', 'your-theme' ),
        'icon'        => 'menu',
        'area_tag'    => 'nav',
    );
    return $areas;
} );
```

**Workflow:**
1. User creates a new template part in Site Editor with area "Menus"
2. User inserts a mega menu pattern (from `patterns/mega-menu-*.php`) or builds custom content
3. User saves the template part (e.g., slug: `mega-menu-shop`)
4. User adds Mega Menu block to navigation and selects the template part slug
5. Template part is rendered via `block_template_part( $menuSlug )` with theme scope

**Layout Modes:**
- **Dropdown:** Traditional dropdown positioned beneath navigation item
- **Overlay:** Full-screen overlay covering entire viewport

**Interactivity Structure:**
- `src/view.js` - Defines state, actions, and callbacks via `store()`
- `src/render.php` - Server-side template with data attributes:
  - `data-wp-interactive` - Namespace
  - `data-wp-context` - State management
  - `data-wp-on--click` - Event handlers
  - `data-wp-bind--*` - Attribute bindings

**Features:**
- Click/keyboard navigation
- Outside-click dismissal
- Focus management
- Seamless template part integration

## Block Registration Pattern

All blocks follow this pattern in `src/index.js`:

```javascript
import { registerBlockType } from '@wordpress/blocks';
import metadata from './block.json';
import Edit from './edit';
import Save from './save';

registerBlockType(metadata.name, {
  ...metadata,
  edit: Edit,
  save: Save,
});
```

Metadata from block.json is the single source of truth, with Edit/Save implementations added at registration time.

## Adding a New Block

1. Create `/blocks/newblock/` directory
2. Add standard file structure (see Block Structure above)
3. Create `src/block.json` with block metadata
4. Implement `src/index.js`, `src/edit.js`, `src/save.jsx`
5. Add `package.json` with build scripts (copy from existing blocks)
6. Run `npm install && npm run build`
7. Plugin auto-discovers block on next page load

## Theme Integration Requirements

### Mega Menu Template Parts

**CRITICAL:** The mega menu block requires the active theme to register the 'menu' template part area. The Elayne theme includes this by default. Other themes must add it via `functions.php`:

```php
add_filter( 'default_wp_template_part_areas', function( $areas ) {
    $areas[] = array(
        'area'        => 'menu',
        'area_tag'    => 'div',
        'label'       => __( 'Menu', 'your-theme' ),
        'description' => __( 'Template part area for mega menus', 'your-theme' ),
        'icon'        => 'navigation',
    );
    return $areas;
});
```

**Without theme registration:**
- Template parts won't appear in the Site Editor's Patterns → Template Parts section
- Users cannot create or edit mega menu template parts
- The mega menu block will have no template parts to select

**The Elayne theme implementation:** See `~/code/imagewize.com/demo/web/app/themes/elayne` - includes menu and sidebar template part areas.

## Key Files

- `elayne-blocks.php` - Main plugin file with block discovery logic
- `patterns/` - Mega menu block patterns (used to create template parts)
- `blocks/*/src/block.json` - Block metadata and configuration
- `blocks/*/src/edit.js` - Block editor interface
- `blocks/*/src/save.jsx` - Block frontend output
- `blocks/carousel/slick/` - Third-party Slick Carousel library (vendored)
- `blocks/mega-menu/README.md` - Mega menu usage and integration guide

## Pattern Development Guidelines

### Separator Blocks in Patterns

**Important:** When adding separator blocks to patterns, use the WordPress 6.7+ compatible format to avoid block validation errors:

✅ **Correct format:**
```html
<!-- wp:separator {"className":"is-style-wide"} -->
<hr class="wp-block-separator has-alpha-channel-opacity is-style-wide"/>
<!-- /wp:separator -->
```

❌ **Avoid (causes validation errors):**
```html
<!-- wp:separator {"className":"is-style-wide","style":{"color":{"background":"var:preset|color|contrast-2"}}} -->
<hr class="wp-block-separator has-background is-style-wide" style="background-color:var(--wp--preset--color--contrast-2);opacity:0.2"/>
<!-- /wp:separator -->
```

The older format with inline `opacity` styles and custom background colors is incompatible with WordPress 6.7+ and will cause block validation errors. Use the simplified format which inherits theme colors automatically.

## Development Notes

- Each block has isolated `node_modules` (allows independent versioning)
- Block names use namespace/blockname format (elayne/carousel, elayne/mega-menu)
- Attributes in block.json define all user-customizable data
- InnerBlocks pattern used for nested content (carousel/slide relationship)
- wp-scripts handles Webpack, Babel, and all build tooling
- **Important:** `build/` directories are committed to Git for Packagist distribution so users get working blocks without needing to run build commands

## Git Commit Guidelines

**IMPORTANT:** Never mention AI tools (Claude, ChatGPT, etc.) in commit messages. Commit messages should be professional and focus on the changes made, not the tools used to make them.

**Keep commit messages concise:**
- Use short, descriptive titles (50 characters or less when possible)
- Add details in the body only when necessary
- Avoid overly verbose explanations

**Good commit messages:**
- "Fix carousel block initialization on frontend"
- "Add ABSPATH security check to mega-menu render.php"
- "Update text domain consistency across all blocks"
- "Add carousel block patterns"
- "Update carousel CSS for new features"

**Bad commit messages:**
- "Fix authentication bug (with help from Claude)" ❌
- "Claude helped me refactor the carousel code" ❌
- "Co-Authored-By: Claude Sonnet 4.5" ❌
- Overly long messages with unnecessary details ❌

## Version Management

When updating the plugin version, you must update **three files** in sync:

1. **[CHANGELOG.md](CHANGELOG.md)** - Add new version section with changes
2. **[readme.txt](readme.txt)** - Update `Stable tag` header and add changelog entry
3. **[elayne-blocks.php](elayne-blocks.php)** - Update `Version` in plugin header and `ELAYNE_BLOCKS_VERSION` constant

**Example workflow for version 2.2.3:**

```markdown
# CHANGELOG.md
## [2.2.3] - 2026-01-16
### Fixed
- Description of fix
```

```
# readme.txt (line 7)
Stable tag: 2.2.3

# readme.txt (changelog section)
= 2.2.3 =
* Description of fix
```

```php
// elayne-blocks.php (line 6)
* Version: 2.2.3

// elayne-blocks.php (line 26)
define( 'ELAYNE_BLOCKS_VERSION', '2.2.3' );
```

**All three files must be updated together** to maintain version consistency across the plugin.

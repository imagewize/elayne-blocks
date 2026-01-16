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

**Structure:**
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
- Template part integration

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

## Key Files

- `elayne-blocks.php` - Main plugin file with block discovery logic
- `blocks/*/src/block.json` - Block metadata and configuration
- `blocks/*/src/edit.js` - Block editor interface
- `blocks/*/src/save.jsx` - Block frontend output
- `blocks/carousel/slick/` - Third-party Slick Carousel library (vendored)

## Development Notes

- Each block has isolated `node_modules` (allows independent versioning)
- Block names use namespace/blockname format (elayne/carousel, elayne/mega-menu)
- Attributes in block.json define all user-customizable data
- InnerBlocks pattern used for nested content (carousel/slide relationship)
- wp-scripts handles Webpack, Babel, and all build tooling
- **Important:** `build/` directories are committed to Git for Packagist distribution so users get working blocks without needing to run build commands

## Git Commit Guidelines

**IMPORTANT:** Never mention AI tools (Claude, ChatGPT, etc.) in commit messages. Commit messages should be professional and focus on the changes made, not the tools used to make them.

**Good commit messages:**
- "Fix carousel block initialization on frontend"
- "Add ABSPATH security check to mega-menu render.php"
- "Update text domain consistency across all blocks"

**Bad commit messages:**
- "Fix authentication bug (with help from Claude)" ❌
- "Claude helped me refactor the carousel code" ❌
- "Co-Authored-By: Claude Sonnet 4.5" ❌

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

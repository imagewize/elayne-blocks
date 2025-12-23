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

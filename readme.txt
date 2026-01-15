=== Elayne Blocks ===
Contributors: Rhand
Tags: blocks, gutenberg, carousel, mega-menu, slider
Requires at least: 6.7
Tested up to: 6.9
Requires PHP: 7.3
Stable tag: 2.2.3
License: GPL v3 or later
License URI: https://www.gnu.org/licenses/gpl-3.0.html

Custom Gutenberg blocks for the Elayne WordPress theme including Mega Menu, Carousel, and Slide blocks.

== Description ==

Elayne Blocks is a companion plugin for the Elayne WordPress theme that provides three powerful custom Gutenberg blocks to enhance your website:

= Blocks Included =

**Mega Menu Block**
* Create dropdown mega menus with rich content
* Can only be placed inside core/navigation or elayne/nav-builder blocks
* Uses WordPress Interactivity API for frontend state management
* Features click/keyboard navigation, outside-click dismissal, and focus management
* Supports template part integration for complex menu layouts
* Server-side rendering for dynamic content

**Carousel Block**
* Build beautiful, responsive image and content carousels
* Powered by Slick Carousel library (1.8.1)
* Parent block that only accepts Slide blocks as children
* Assets loaded conditionally only when carousel is present on page
* Fully customizable carousel settings

**Slide Block**
* Individual slides for use within Carousel blocks
* Uses InnerBlocks to accept any block content
* Can only exist inside Carousel parent (enforced via parent constraint)
* Flexible content options - images, text, buttons, or any WordPress blocks

= Key Features =

* **Seamless Integration** - Designed specifically for the Elayne theme
* **Performance Optimized** - Conditional asset loading (Slick Carousel only loads when needed)
* **WordPress Interactivity API** - Modern reactive frontend for mega menu
* **Parent-Child Relationships** - Carousel → Slide hierarchy enforced for better UX
* **Dynamic Block Discovery** - Automatically discovers and registers all blocks at runtime
* **Translation Ready** - Full internationalization support with text domain

= Technical Highlights =

* Follows WordPress block development best practices
* Each block has isolated dependencies for independent versioning
* Block metadata in block.json is single source of truth
* Build tooling via @wordpress/scripts (Webpack, Babel, etc.)
* Server-side rendering support (mega-menu)
* SVG and WebP upload support

= Requirements =

* WordPress 6.7 or higher
* PHP 7.3 or higher
* Elayne theme (recommended for best integration)

= Block Structure =

Each block follows standard WordPress block structure:
* `src/block.json` - Block metadata and configuration
* `src/index.js` - Registration entry point
* `src/edit.js` - React editor component
* `src/save.jsx` - Frontend output markup
* `src/view.js` - Frontend interactivity (optional)
* `src/render.php` - Server-side rendering (optional)
* `src/editor.scss` - Editor-only styles
* `src/style.scss` - Frontend + editor styles

== Installation ==

1. Upload the plugin files to the `/wp-content/plugins/elayne-blocks` directory, or install the plugin through the WordPress plugins screen directly.
2. Activate the plugin through the 'Plugins' screen in WordPress.
3. Blocks will be automatically available in the Gutenberg editor.
4. For Mega Menu: Place inside a Navigation block to use the mega menu functionality.
5. For Carousel: Add a Carousel block, then add Slide blocks inside it.

== Frequently Asked Questions ==

= Does this plugin work with any theme? =

While the plugin can technically work with any theme, it is designed and optimized for use with the Elayne WordPress theme for best integration and styling.

= How do I build the blocks from source? =

Each block has isolated dependencies and must be built separately:

```
cd blocks/carousel && npm install && npm run build
cd blocks/mega-menu && npm install && npm run build
cd blocks/slide && npm install && npm run build
```

For development mode with watch: `cd blocks/[block-name] && npm start`

= Are the build files included? =

Yes, the `build/` directories are committed to the repository for Packagist distribution, so users get working blocks without needing to run build commands.

= Can I customize the carousel settings? =

Yes, the carousel block uses Slick Carousel which is highly customizable. You can extend the block to add additional Slick settings through the block attributes.

= Does the Mega Menu work with keyboard navigation? =

Yes, the mega menu block includes full keyboard navigation support, outside-click dismissal, and proper focus management for accessibility.

= What is the WordPress Interactivity API? =

It's WordPress's official frontend reactivity system. The mega menu block uses it for modern, reactive user interactions without heavy JavaScript frameworks.

== Screenshots ==

1. Carousel block with multiple slides in the editor
2. Mega menu block configuration panel
3. Slide block with InnerBlocks content
4. Frontend carousel display
5. Mega menu dropdown with rich content

== Changelog ==

= 2.2.3 =
* Documentation: Added proper attribution for Carousel Block plugin by Virgiliu Diaconu in Credits section
* Documentation: Acknowledged original work from https://wordpress.org/plugins/carousel-block/ that the carousel block is based on

= 2.2.2 =
* Fixed WordPress.org plugin repository compliance issues
* Fixed text domain consistency: all blocks now use elayne-blocks text domain
* Added ABSPATH security check to mega-menu render.php
* Updated load_plugin_textdomain() hook from plugins_loaded to init
* Added proper function prefixes to prevent naming conflicts
* Added @package tag to main plugin file header
* Fixed PHP opening tag formatting in mega-menu render.php
* Created /languages/ folder for translation files
* Removed deprecated load_plugin_textdomain() call (WordPress 4.6+ auto-loads translations)
* Fixed global function prefix: moiraine_mega_menu_block_init renamed to elayne_blocks_mega_menu_block_init
* Updated .distignore file to exclude AGENTS.md from WordPress.org distribution
* Updated carousel block ALLOWED_BLOCKS constant from imagewize/slide to elayne/slide
* Improved Plugin Check workflow to build distribution directory before checking (respects .distignore)
* Documentation: Added Git Commit Guidelines and Version Management section to CLAUDE.md

= 2.2.1 =
* Added WordPress.org plugin repository infrastructure
* Added readme.txt file following WordPress.org standards
* Added .distignore for distribution builds
* Added GitHub Actions for automated releases and plugin checks
* Plugin now ready for WordPress.org submission

= 2.2.0 =
* Initial public release
* Three blocks: Mega Menu, Carousel, and Slide
* WordPress Interactivity API integration for mega menu
* Conditional asset loading for Slick Carousel
* Dynamic block discovery system
* Full translation support

== Upgrade Notice ==

= 2.2.2 =
Important WordPress.org compliance fixes including consistent text domains and security improvements. Recommended update for all users.

= 2.2.1 =
Adds WordPress.org distribution infrastructure. No functional changes to blocks.

= 2.2.0 =
Initial public release with three custom blocks optimized for the Elayne theme.

== Third-Party Libraries ==

= Slick Carousel =
* Version: 1.8.1
* License: MIT License
* Source: https://kenwheeler.github.io/slick/
* Used in: Carousel block
* Files: blocks/carousel/slick/
* Purpose: Powers the carousel/slider functionality

The MIT License is GPL-compatible.

== Credits ==

= Plugin Icon =
The plugin icon is based on IconPark Block One from Blade UI Kit.
* Source: https://blade-ui-kit.com/blade-icons/iconpark-blockone-o
* License: MIT License

= Mega Menu Implementation =
The mega menu block implementation is inspired by and based on the HM Mega Menu Block by Human Made.
* Source: https://github.com/humanmade/hm-mega-menu-block
* License: GPL v2 or later
* Modifications: Adapted for Elayne theme integration and WordPress Interactivity API

= Carousel Block Implementation =
The carousel block is based on the original work from the Carousel Block Plugin by Virgiliu Diaconu, enhanced with additional features and improvements.
* Source: https://wordpress.org/plugins/carousel-block/
* License: GPL v2 or later
* Modifications: Enhanced with Slick Carousel integration and additional customization options

== Developer Information ==

= Block Registration =

The plugin uses dynamic block discovery. At runtime:
1. Scans `/blocks` directory during `init` action
2. Looks for `build/block.json` in each subdirectory
3. Auto-registers all discovered blocks via `register_block_type()`

This means blocks are auto-discovered - no manual registration needed when adding new blocks.

= GitHub Repository =

* Repository: https://github.com/imagewize/elayne-blocks
* Issues: https://github.com/imagewize/elayne-blocks/issues
* Documentation: See CLAUDE.md in repository for detailed development guide

== Copyright ==

Elayne Blocks WordPress Plugin, Copyright 2025 Jasper Frumau
Elayne Blocks is distributed under the terms of the GNU GPL v3 or later.

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.

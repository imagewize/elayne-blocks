# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.4.0] - 2026-01-18

### Added
- Mega menu block now supports multiple layout modes: dropdown, overlay, sidebar, and grid
- Mega menu template part integration using WordPress template parts for content management
- Six pre-built mega menu patterns (simple list, three column, icon grid, featured content, image links, multi-column)
- Mega menu animation controls with fade, slide, scale, and slide-fade effects
- Mega menu icon support with Dashicons picker and custom SVG options
- Mega menu hover activation option for dropdown and grid modes
- Mega menu styling controls including box shadow, border radius, border width/color, and backdrop blur
- Mega menu responsive controls with customizable mobile breakpoint and mobile mode toggle
- Mega menu dropdown alignment options (left, right, center)
- Mega menu README documentation for usage and theme integration

### Changed
- Mega menu block enhanced with additional layout modes, patterns, and improved editor controls
- Mega menu editor interface reorganized with improved layout picker and animation controls
- Mega menu now requires theme integration with 'menu' template part area registration
- Mega menu positioning system improved with better dropdown, overlay, sidebar, and grid calculations
- Mega menu mobile behavior enhanced with responsive breakpoint support

### Fixed
- Mega menu mobile positioning now correctly handles viewport constraints
- Mega menu template part selection properly scoped to theme namespace
- Mega menu Interactivity API initialization improved for reliable state management

### Documentation
- Added comprehensive mega menu README with usage guide and theme integration requirements
- Updated CLAUDE.md with detailed mega menu architecture and template part workflow
- Added multiple planning documents for mega menu enhancement phases

## [2.3.1] - 2026-01-16

### Documentation
- Added CONTRIBUTING.md with build, linting, and testing guidance
- Simplified README by removing build instructions and duplicate changelog content

## [2.3.0] - 2026-01-16

### Added
- Advanced carousel features: thumbnail navigation, center mode with peek, variable width slides, lazy loading, and expanded adaptive height controls
- Carousel arrow customization with multiple SVG styles, background shapes, sizes, and custom SVG support
- Five carousel block patterns (Hero, Testimonial, Product Gallery, Portfolio, Team Members)
- Unique block icons for Carousel and Slide
- Slick font assets for carousel UI compatibility

### Changed
- Carousel styling for thumbnails, dots, RTL layouts, and responsive behavior
- Carousel editor controls reorganized with toolbar toggles and grouped panels

### Fixed
- Active dot visibility now remains filled when not hovered
- Thumbnail navigation edge cases (enable checks, arrows off)

### Documentation
- Added Hybrid Enhancement Strategy documentation
- Updated carousel enhancement progress and feature details
- Updated README with carousel feature highlights (thumbnails, arrow customization, patterns)

## [2.2.3] - 2026-01-16

### Documentation
- Added proper attribution for Carousel Block plugin by Virgiliu Diaconu to Credits section in README.md and readme.txt
- Acknowledged original work from https://wordpress.org/plugins/carousel-block/ that the carousel block is based on

## [2.2.2] - 2026-01-15

### Fixed
- WordPress.org plugin repository compliance
  - Fixed text domain consistency: all blocks now use `elayne-blocks` instead of mixed `imagewize`, `elayne`, etc.
  - Added ABSPATH security check to mega-menu render.php
  - Updated `load_plugin_textdomain()` hook from `plugins_loaded` to `init` (best practice)
  - Added proper function prefixes: `elayne_blocks_allow_additional_mime_types` and `elayne_blocks_fix_media_display`
  - Added `@package ELayneBlocks` tag to main plugin file header
  - Fixed PHP opening tag formatting in mega-menu render.php
  - Created `/languages/` folder for translation files
  - Removed deprecated `load_plugin_textdomain()` call (WordPress 4.6+ auto-loads translations for WordPress.org plugins)
  - Fixed global function prefix: `moiraine_mega_menu_block_init` → `elayne_blocks_mega_menu_block_init`
- Updated carousel block ALLOWED_BLOCKS constant from `imagewize/slide` to `elayne/slide`

### Changed
- All text strings now use consistent `elayne-blocks` text domain for proper translation support
- Function names now properly prefixed to avoid conflicts
- `.distignore` file updated to exclude `AGENTS.md` from WordPress.org distribution
- Plugin Check workflow now builds distribution directory before checking to respect `.distignore` exclusions

### Documentation
- Added Git Commit Guidelines to CLAUDE.md (never mention AI tools in commits)
- Added Version Management section to CLAUDE.md (synchronize CHANGELOG.md, readme.txt, and elayne-blocks.php)

## [2.2.1] - 2026-01-15

### Added
- WordPress.org plugin repository infrastructure
  - `readme.txt` file following WordPress.org plugin readme standards
  - `.distignore` file for excluding development files from distribution
  - GitHub Actions workflow for automated plugin release zip creation
  - GitHub Actions workflow for WordPress plugin quality checks
  - Comprehensive plugin documentation including FAQ, installation, and third-party library credits

### Changed
- Plugin now ready for WordPress.org submission and distribution
- Automated release process via GitHub releases

## [2.2.0] - 2026-01-07

### Added
- Search Overlay Trigger block (`elayne/search-overlay-trigger`)
  - Clickable search icon that opens full-screen search overlay
  - Customizable overlay background color (with alpha transparency support)
  - Customizable search bar border color
  - Customizable close button color
  - Smooth fade-in/scale animations for overlay appearance
  - Auto-focus on search input when opened
  - Close via X button, backdrop click, or Escape key
  - Body scroll lock when overlay is active
  - Responsive design with mobile-optimized layout
  - Backdrop blur effect for visual depth
  - Vanilla JavaScript (no dependencies)
  - Accessibility features (ARIA labels, keyboard support)

## [2.1.11] - 2025-12-31

### Added
- Repository logo with golden gradient (matching Elayne's lily sigil theme from Wheel of Time)
- Logo displayed in README header

### Changed
- Updated README with centered logo at top
- Added icon credit to Blade UI Kit in README credits section

## [2.1.10] - 2025-12-24

### Fixed
- Carousel block frontend initialization now uses correct CSS class selector `.wp-block-elayne-carousel` (was incorrectly using `.wp-block-imagewize-carousel`)
- Carousel slides now properly initialize and function on frontend (sliding, arrows, dots navigation)

## [2.1.9] - 2025-12-24

### Changed
- FAQ Tabs block now uses different arrow icons for desktop vs mobile layouts
- Desktop tabs use right-pointing arrow (indicates content appears to the right)
- Mobile accordion uses down chevron when closed and up chevron when open (standard accordion pattern)

### Fixed
- Improved visual communication of FAQ Tabs block interaction patterns
- Arrow directions now match UI conventions (tabs vs accordions)

## [2.1.8] - 2025-12-24

### Fixed
- FAQ Tabs block arrow direction now matches content layout on desktop (points right instead of down)
- Desktop tabs maintain right-pointing arrow when active, indicating content direction
- Mobile accordion arrows still rotate down when expanded for proper accordion UX

## [2.1.7] - 2025-12-24

### Added
- FAQ Tabs block now includes default demo content for answers
- FAQ Tab Answer block template includes two paragraphs of professional placeholder text
- Three default FAQ questions now pre-populate with comprehensive demo content about services, project timelines, and unique approach

### Changed
- FAQ Tab Answer InnerBlocks template updated from placeholder-only to content-populated paragraphs

## [2.1.6] - 2025-12-24

### Changed
- FAQ Tabs block now defaults to wide alignment

### Fixed
- Corrected default alignment implementation to explicitly set align attribute via useEffect hook in Edit component, working around WordPress Gutenberg limitation where default attribute values don't get serialized to block markup (previous implementations in 2.1.4 and 2.1.5 relied on block.json defaults which don't force attribute serialization)

## [2.1.5] - 2025-12-24

### Changed
- FAQ Tabs block alignment default (reverted - incorrect implementation using supports.default)

## [2.1.4] - 2025-12-24

### Changed
- FAQ Tabs block alignment default (reverted - incorrect implementation)

## [2.1.3] - 2025-12-24

### Changed
- FAQ Tabs block now uses mobile accordion layout on viewports ≤ 781px
- Answers now appear directly below their questions on mobile (instead of in separate column)
- Mobile accordion allows independent expand/collapse for each FAQ item
- Desktop maintains two-column tab layout with answers on the right
- Added smooth slide-down animation for mobile accordion expansion
- Viewport resize automatically switches between desktop tabs and mobile accordion

### Fixed
- Mobile UX improved: users no longer need to scroll past all questions to see answers

## [2.1.2] - 2025-12-23

### Added
- Contributor guidelines in `AGENTS.md`

### Changed
- FAQ Tabs editor questions are now inline-editable with RichText
- FAQ Tabs layout spacing and mobile overflow handling improved

## [2.1.1] - 2025-12-23

### Changed
- **BREAKING:** Restructured FAQ Tabs block to use parent-child InnerBlocks pattern
  - FAQ Tabs block (`elayne/faq-tabs`) now uses InnerBlocks instead of attribute-based storage
  - Content is now stored in child blocks rather than block attributes
  - Users will need to recreate existing FAQ Tabs blocks with the new structure

### Added
- FAQ Tab Answer block (`elayne/faq-tab-answer`)
  - Child block for individual FAQ answers with InnerBlocks support
  - Accepts any block content (paragraphs, images, buttons, etc.) for rich FAQ answers
  - Editable question text and answer title
  - Parent constraint (only works inside FAQ Tabs block)
  - Full formatting control over answer content

### Fixed
- FAQ Tabs frontend JavaScript rewritten to work with block-based content structure
- Tab navigation now dynamically generated from child blocks on page load

## [2.1.0] - 2025-12-23

### Added
- FAQ Tabs block (`elayne/faq-tabs`)
  - Interactive FAQ section with vertical tab navigation
  - Dynamic content display with smooth transitions
  - Configurable questions, titles, and descriptions
  - Customizable call-to-action button
  - Responsive design with mobile-optimized layout
  - Frontend interactivity powered by vanilla JavaScript
  - Supports WordPress color and spacing controls

## [2.0.0] - 2025-12-23

### Changed
- **BREAKING:** Renamed project from "Moiraine Blocks" to "Elayne Blocks"
- **BREAKING:** Updated all block namespaces from `moiraine/` and `imagewize/` to `elayne/`
  - `moiraine/mega-menu` → `elayne/mega-menu`
  - `imagewize/carousel` → `elayne/carousel`
  - `imagewize/slide` → `elayne/slide`
- **BREAKING:** Updated text domain from `moiraine-blocks` to `elayne-blocks`
- **BREAKING:** Updated PHP namespace from `MoiraineBlocks` to `ELayneBlocks`
- Updated composer package name from `imagewize/moiraine-blocks` to `imagewize/elayne-blocks`
- Updated all CSS class names to use `elayne` instead of `moiraine` or `imagewize`
- Updated plugin file name from `moiraine-blocks.php` to `elayne-blocks.php`
- Updated GitHub repository URLs to point to `elayne-blocks`
- Updated all references to "Moiraine theme" to "Elayne theme"

### Migration Guide
This is a major breaking release. Sites using the previous version will need to:
1. Deactivate and delete the old `moiraine-blocks` plugin
2. Install and activate `elayne-blocks`
3. Update any theme template parts that reference the old block names
4. Update custom CSS that uses the old class names

## [1.2.0] - 2025-11-16

### Added
- Adaptive Height option in carousel block to automatically adjust carousel height to match current slide height
- ToggleControl for Adaptive Height in carousel block editor settings with helpful description

### Changed
- Updated carousel block to include adaptiveHeight attribute in Slick carousel configuration

## [1.1.0] - 2025-11-14

### Added
- Carousel block frontend view script for Slick initialization
- Slick Carousel library files (CSS and JS) vendored in carousel block directory
- ViewScript support in carousel block.json for proper frontend asset loading

### Changed
- Improved carousel block asset loading with dedicated view.js file
- Excluded PR creation script from repository

### Fixed
- Carousel block now properly initializes Slick on the frontend with custom arrow colors and dot positioning

## [1.0.1] - 2025-11-14

### Added
- GPL-3.0 LICENSE.md file with full license text

### Changed
- Updated carousel block namespace from `moiraine/carousel` to `imagewize/carousel` for consistency
- Updated package namespace to `imagewize/moiraine-blocks` in composer.json
- Updated composer package type and metadata for better Packagist compatibility

## [1.0.0] - 2025-11-14

### Added
- Initial release of Moiraine Blocks plugin
- Mega Menu block (`moiraine/mega-menu`)
  - WordPress Interactivity API integration
  - Template part support for dynamic menu content
  - Keyboard navigation support (Escape key to close)
  - Outside-click dismissal
  - Focus management
  - Customizable styling options
- Carousel block (`imagewize/carousel`)
  - Slick Carousel integration
  - Responsive breakpoint configuration
  - Customizable slides to show/scroll
  - Arrow and dot navigation options
  - Custom arrow color support
  - Touch/swipe support
- Slide block (`imagewize/slide`)
  - InnerBlocks support for flexible content
  - Parent constraint (only works inside Carousel block)
  - Unique slide ID generation
- Conditional asset loading (Slick Carousel only loads when carousel block is used)
- SVG and WebP upload support in media library
- Translation support with text domain `moiraine-blocks`
- Composer support for installation via Packagist

### Changed
- Migrated blocks from Moiraine theme to standalone plugin (WordPress.org theme review compliance)

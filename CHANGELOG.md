# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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

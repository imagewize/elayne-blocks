<p align="center">
  <img src="assets/icon.svg" alt="Elayne Blocks Logo" width="128" height="128">
</p>
<div align="center">
<h1>Elayne Blocks</h1>

Custom WordPress blocks that work with any theme.
</div>

## Description

Elayne Blocks is a WordPress plugin that provides custom Gutenberg blocks. While originally developed as a companion plugin for the Elayne theme, **these blocks work with any WordPress theme** - FSE (Full Site Editing) themes, block themes, or classic themes.

This plugin was created to align with WordPress.org Theme Review requirements, which prohibit custom block registration in themes. The blocks are theme-agnostic and can be used in any WordPress site.

## Included Blocks

- **Mega Menu Block** (`elayne/mega-menu`) - Advanced navigation menu with mega menu functionality (works best with FSE/block themes)
- **Carousel Block** (`elayne/carousel`) - Responsive image/content carousel with Slick Carousel integration
- **Slide Block** (`elayne/slide`) - Individual carousel slides with InnerBlocks support
- **FAQ Tabs Block** (`elayne/faq-tabs`) - Interactive FAQ with vertical tab navigation and dynamic content display

## Requirements

- WordPress 6.7 or higher
- PHP 7.3 or higher
- Works with any WordPress theme (FSE, block, or classic)

## Installation

1. Upload the `elayne-blocks` folder to the `/wp-content/plugins/` directory
2. Activate the plugin through the 'Plugins' menu in WordPress
3. The blocks will be available in the block editor

## Development

Each block is built using the `@wordpress/scripts` package and follows WordPress block development best practices.

### Building Blocks

Navigate to each block directory and run:

```bash
cd blocks/mega-menu
npm install
npm run build
```

Repeat for `carousel`, `slide`, and `faq-tabs` blocks.

## Block Details

### Mega Menu Block

Advanced navigation block with template part integration for creating dynamic mega menus.

**Features:**
- WordPress Interactivity API integration
- Template part support
- Responsive design
- Keyboard navigation support

### Carousel Block

Create responsive image/content carousels using Slick Carousel.

**Features:**
- Slick Carousel integration
- Customizable settings
- Responsive breakpoints
- Touch/swipe support

### Slide Block

Companion block for the Carousel block.

**Features:**
- InnerBlocks support for flexible content
- Works seamlessly with Carousel parent block

### FAQ Tabs Block

Interactive FAQ block with vertical tab navigation and dynamic content display.

**Features:**
- Vertical tab navigation with questions
- Dynamic content area showing answers
- Customizable button with configurable text and URL
- WordPress Interactivity API integration
- Editable questions, titles, and descriptions via block inspector
- Responsive design with flexible layout

## Changelog

### 1.0.0 - 2025-11-14

**Initial Release**
- Migrated blocks from Elayne theme to standalone plugin
- Mega Menu block with Interactivity API
- Carousel block with Slick integration
- Slide block for carousel content

## License

GPL v3 or later - https://www.gnu.org/licenses/gpl-3.0.html

## Credits

- Based on blocks originally developed for the Elayne theme
- Icon: [IconPark Block One](https://blade-ui-kit.com/blade-icons/iconpark-blockone-o) from [Blade UI Kit](https://blade-ui-kit.com/blade-icons)
- Mega Menu block implementation based on [Human Made's HM Mega Menu Block](https://github.com/humanmade/hm-mega-menu-block)
- Built with `@wordpress/scripts`
- Uses [Slick Carousel](https://kenwheeler.github.io/slick/) library for carousel functionality

## Support

For issues and feature requests, please visit:
https://github.com/imagewize/elayne-blocks

## Author

Jasper Frumau - https://github.com/imagewize

# Moiraine Blocks

Custom WordPress blocks for the Moiraine theme.

## Description

Moiraine Blocks is a companion plugin for the Moiraine WordPress theme that provides custom block functionality. This plugin was created to align with WordPress.org Theme Review requirements, which prohibit custom block registration in themes.

## Included Blocks

- **Mega Menu Block** (`moiraine/mega-menu`) - Advanced navigation menu with mega menu functionality
- **Carousel Block** (`moiraine/carousel`) - Responsive image/content carousel with Slick Carousel integration
- **Slide Block** (`moiraine/slide`) - Individual carousel slides with InnerBlocks support

## Requirements

- WordPress 6.7 or higher
- PHP 7.3 or higher
- Moiraine theme (recommended but not required)

## Installation

1. Upload the `moiraine-blocks` folder to the `/wp-content/plugins/` directory
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

Repeat for `carousel` and `slide` blocks.

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

## Changelog

### 1.0.0 - 2025-11-14

**Initial Release**
- Migrated blocks from Moiraine theme to standalone plugin
- Mega Menu block with Interactivity API
- Carousel block with Slick integration
- Slide block for carousel content

## License

GPL v3 or later - https://www.gnu.org/licenses/gpl-3.0.html

## Credits

- Based on blocks originally developed for the Moiraine theme
- Built with `@wordpress/scripts`
- Uses Slick Carousel library

## Support

For issues and feature requests, please visit:
https://github.com/imagewize/moiraine-blocks

## Author

Jasper Frumau - https://github.com/imagewize

# WordPress.org Plugin Review Issues

This document identifies issues that need to be addressed before submitting to the WordPress.org plugin repository.

## Critical Issues (Must Fix)

### 1. Text Domain Consistency
- **Issue**: The plugin uses `elayne-blocks` as the text domain in the header
- **Problem**: Previous versions had `moiraine_mega_menu_block_init` function name suggesting a different text domain
- **Fix**: ✅ **COMPLETED** - All blocks now consistently use `"textdomain": "elayne-blocks"` in their block.json files
- **Files Updated**:
  - `blocks/carousel/src/block.json`
  - `blocks/mega-menu/src/block.json`
  - `blocks/slide/src/block.json`

### 2. License File Location
- **Issue**: License file is named `LICENSE.md` (uppercase) in the root directory
- **Requirement**: WordPress.org expects `license.txt` or `license.md` (lowercase)
- **Note**: This is a low-priority issue. Previous plugin submissions with `LICENSE.md` have been accepted without issues.
- **Fix**: (Optional) Rename `LICENSE.md` to `license.md` for strict compliance

### 3. Security Check Placement
- **Issue**: The security check `if ( ! defined( 'WPINC' ) ) { die; }` is placed after the namespace declaration
- **Requirement**: Security check should be the very first thing after the opening PHP tag
- **Fix**: Move the security check before the namespace declaration in `elayne-blocks.php`

### 4. Translation Files
- **Issue**: The plugin declares `Domain Path: /languages` but the directory is empty
- **Requirement**: Either include translation files or remove the Domain Path header
- **Fix**: ✅ **COMPLETED** - Created language file infrastructure and added Dutch translation
  - Added `docs/CREATE_LANGUAGE_FILES.md` with comprehensive translation guide
  - Created `extract-translations.sh` script to generate `.pot` files
  - Added complete Dutch (nl_NL) translation
  - Languages directory now contains translation files
- **Note**: The Domain Path header is correct and ready for additional translations.
- **Files Created**:
  - `docs/CREATE_LANGUAGE_FILES.md` - Complete translation guide
  - `extract-translations.sh` - Script to extract translatable strings
  - `languages/elayne-blocks.pot` - Translation template (221 strings)
  - `languages/elayne-blocks-nl_NL.po` - Dutch translation (100% complete)

### 5. Plugin Header Format
- **Issue**: The `@package` tag is inside the main docblock comment
- **Requirement**: The `@package` tag should come after the closing `*/` of the main comment block
- **Fix**: Move `@package ELayneBlocks` to after the main comment block

### 6. Version Constant Placement
- **Issue**: The `ELAYNE_BLOCKS_VERSION` constant is defined after some code
- **Requirement**: Constants should be defined at the top of the file, before any code that might use them
- **Fix**: Move the version constant definition to the top, right after the security check

## Important Issues (Should Fix)

### 7. PHP Version Requirement
- **Issue**: Plugin required PHP 7.3, which is quite old
- **Recommendation**: WordPress 6.9+ requires PHP 7.4+
- **Fix**: ✅ **COMPLETED** - Updated minimum PHP requirement to 7.4 and WordPress version to 6.9
- **Files Updated**:
  - `elayne-blocks.php` - Changed `Requires PHP: 7.3` to `7.4` and `Requires at least: 6.7` to `6.9`
  - `readme.txt` - Updated PHP requirement from 7.3 to 7.4 and WordPress version from 6.7 to 6.9

### 8. Missing .org Assets
- **Issue**: No `trunk/` directory structure for WordPress.org submission
- **Requirement**: WordPress.org expects a specific directory structure for submission
- **Fix**: WordPress.org handles SVN setup automatically when you upload. No need to create `trunk/` locally. Just create screenshot and banner images for the `assets/` directory in your plugin zip.

### 9. Missing Screenshots
- **Issue**: readme.txt mentions 5 screenshots but no screenshot files exist
- **Requirement**: WordPress.org expects screenshots in `assets/screenshot-1.png`, etc.
- **Fix**: Create and include screenshot images showing the blocks in action

### 10. Missing Banner Images
- **Issue**: No banner images for WordPress.org plugin directory
- **Recommendation**: Include 128x128px plugin icon and 772x250px banner
- **Fix**: Create banner images and place them in `assets/` directory

### 11. Third-Party Library Licenses
- **Issue**: Slick Carousel is included but its license file may not be in the distribution
- **Requirement**: All third-party licenses should be properly documented and included
- **Fix**: Ensure Slick Carousel license is included in the distribution

## Documentation Issues (Should Fix)

### 12. readme.txt Formatting
- **Issue**: Some lines in readme.txt exceed 80 characters
- **Requirement**: WordPress.org has an 80-character line limit for readme.txt
- **Fix**: Wrap long lines in readme.txt to comply with the 80-character limit

### 13. Changelog Format
- **Issue**: Changelog entries could be more consistent
- **Recommendation**: Follow WordPress.org changelog format guidelines
- **Fix**: Review and standardize changelog format

### 14. Screenshot Descriptions
- **Issue**: Screenshots are mentioned but not described in detail
- **Recommendation**: Add descriptive captions for each screenshot
- **Fix**: Add detailed descriptions of what each screenshot shows

## Code Quality Issues (Should Fix)

### 15. Mega Menu Security
- **Issue**: JavaScript-based positioning could have security implications
- **Recommendation**: Ensure all user input is properly sanitized and escaped
- **Fix**: Review mega menu JavaScript for potential security issues

### 16. Block Registration
- **Issue**: Dynamic block discovery might not be the most maintainable approach
- **Recommendation**: Consider explicit block registration for better control
- **Fix**: Evaluate whether dynamic discovery is the best approach long-term

## Testing Recommendations

Before submission, the plugin should be tested for:

1. **WordPress Coding Standards**: Run PHPCS with WordPress rules
2. **Cross-browser compatibility**: Test in Chrome, Firefox, Safari, Edge
3. **Mobile responsiveness**: Test on various mobile devices
4. **Accessibility**: Test with screen readers and keyboard navigation
5. **Plugin conflicts**: Test with popular plugins (page builders, SEO, caching)
6. **Theme compatibility**: Test with various themes (FSE, block, classic)
7. **Multisite compatibility**: Test in WordPress multisite installations

## WordPress.org Submission Checklist

- [x] **COMPLETED** Text domain consistency - All blocks now use `"textdomain": "elayne-blocks"`
- [x] **COMPLETED** PHP requirement - Updated from 7.3 to 7.4
- [x] **COMPLETED** Language file infrastructure - Created translation guide and extraction script
- [ ] (Optional) Rename `LICENSE.md` to `license.md` for strict compliance
- [ ] Move security check to top of `elayne-blocks.php`
- [ ] Create screenshot images (screenshot-1.png, etc.)
- [ ] Create banner images (banner-772x250.png, banner-1544x500.png)
- [ ] Ensure all third-party licenses are included
- [ ] Fix readme.txt line length issues
- [ ] Test thoroughly with various configurations
- [ ] Run PHPCS to ensure coding standards compliance

# Mega Menu Block

A flexible mega menu block for WordPress with multiple layout modes and template part integration.

## Features

- **Multiple Layout Modes**: Dropdown, Overlay, Sidebar, Grid
- **Template Part Integration**: Use WordPress template parts for mega menu content
- **Animations**: Optional entrance animations (fade, slide, scale)
- **Hover Activation**: Optional hover-to-open for dropdown and grid modes
- **Responsive**: Mobile-friendly with customizable breakpoint
- **Interactivity API**: Uses WordPress Interactivity API for frontend state

## Theme Integration Requirements

**IMPORTANT**: This block requires the active theme to register a 'menu' template part area. Without theme integration, template parts won't appear in the Site Editor sidebar.

### Adding Theme Support

Add this to your theme's `functions.php`:

```php
/**
 * Register menu template part area for mega menu support
 */
add_filter( 'default_wp_template_part_areas', function( $areas ) {
    $areas[] = array(
        'area'        => 'menu',
        'label'       => __( 'Menus', 'your-theme-textdomain' ),
        'description' => __( 'Template parts for navigation and mega menu content', 'your-theme-textdomain' ),
        'icon'        => 'menu',
        'area_tag'    => 'nav',
    );
    return $areas;
} );
```

The **Elayne theme** includes this by default.

## Usage

### 1. Create Template Parts

1. Go to **Appearance → Editor**
2. Navigate to **Patterns → Template Parts**
3. Create a new template part with **Area: Menus**
4. Design your mega menu content using blocks
5. Save the template part

**Quick Start**: The plugin includes several pre-built patterns you can use to create template parts:
- Mega Menu - Simple List
- Mega Menu - Three Column
- Mega Menu - Icon Grid
- Mega Menu - Featured Content
- Mega Menu - Image Links
- Mega Menu - Footer Style

### 2. Add Mega Menu to Navigation

1. Edit your navigation template or header
2. Inside a Navigation block, add the **Mega Menu** block
3. Configure the block settings:
   - **Label**: Button text (e.g., "Shop", "Services")
   - **Menu Slug**: Select the template part slug
   - **Layout Mode**: Choose dropdown, overlay, sidebar, or grid
   - **Width**: Full width or content width
   - **Alignment**: For dropdown mode positioning

### 3. Customize

Use the block settings panel to configure:

**Content**
- Label text and color
- Template part selection
- Optional description for accessibility
- Optional icon (Dashicons)

**Layout**
- Layout mode (dropdown/overlay/sidebar/grid)
- Width and alignment
- Grid columns (grid mode only)
- Sidebar direction (sidebar mode only)

**Behavior**
- Animations (fade, slide, scale)
- Animation speed
- Hover activation (dropdown/grid modes)
- Mobile breakpoint

**Colors**
- Overlay backdrop color and blur
- Label text color

## Layout Modes

### Dropdown
Traditional dropdown menu beneath the navigation item. Best for:
- Site-wide navigation
- Product categories
- Service menus

### Overlay
Full-screen overlay covering the entire viewport. Best for:
- Immersive mega menus
- Large navigation structures
- Mobile-first designs

### Sidebar
Side panel sliding from left or right. Best for:
- Secondary navigation
- Filters and options
- Mobile navigation

### Grid
Grid-based layout with customizable columns. Best for:
- Large product catalogs
- Multi-section navigation
- Dashboard-style menus

## Template Part Scoping

Template parts are **theme-scoped**, meaning they're stored in the database under the active theme's namespace. This allows:

- Users to create and edit template parts in the Site Editor
- Template parts to persist across plugin updates
- Theme-specific mega menu designs
- Full integration with WordPress template editing workflow

The block references template parts by slug (e.g., `mega-menu-shop`) and WordPress resolves them to the active theme's template parts.

## Development

Built with:
- WordPress Block Editor (Gutenberg)
- WordPress Interactivity API
- React for editor interface
- PHP server-side rendering

## Credits

Implementation based on [HM Mega Menu Block](https://github.com/humanmade/hm-mega-menu-block) by Human Made.

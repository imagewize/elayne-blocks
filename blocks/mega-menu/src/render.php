<?php
/**
 * Mega Menu Block Server-side Render
 *
 * @package Elayne
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

$elayne_blocks_label              = esc_html( $attributes['label'] ?? '' );
$elayne_blocks_label_color        = esc_attr( $attributes['labelColor'] ?? '' );
$elayne_blocks_description        = esc_html( $attributes['description'] ?? '' );
$elayne_blocks_menu_slug          = esc_attr( $attributes['menuSlug'] ?? '' );
$elayne_blocks_layout_mode        = esc_attr( $attributes['layoutMode'] ?? 'dropdown' );
$elayne_blocks_enable_animations  = $attributes['enableAnimations'] ?? false;
$elayne_blocks_animation_type     = esc_attr( $attributes['animationType'] ?? 'fade' );
$elayne_blocks_animation_speed    = absint( $attributes['animationSpeed'] ?? 300 );
$elayne_blocks_enable_icon        = $attributes['enableIcon'] ?? false;
$elayne_blocks_icon_name          = esc_attr( $attributes['iconName'] ?? '' );
$elayne_blocks_icon_position      = esc_attr( $attributes['iconPosition'] ?? 'left' );
// Handle migration: old blocks may have 'auto', convert to 'left'
$elayne_blocks_dropdown_alignment = esc_attr( $attributes['dropdownAlignment'] ?? 'left' );
if ( 'auto' === $elayne_blocks_dropdown_alignment ) {
	$elayne_blocks_dropdown_alignment = 'left';
}
$elayne_blocks_dropdown_spacing = absint( $attributes['dropdownSpacing'] ?? 16 );
$elayne_blocks_overlay_backdrop   = esc_attr( $attributes['overlayBackdropColor'] ?? 'rgba(0, 0, 0, 0.5)' );
$elayne_blocks_enable_hover       = $attributes['enableHoverActivation'] ?? false;
$elayne_blocks_backdrop_blur      = $attributes['backdropBlur'] ?? true;

// Panel styling attributes.
$elayne_blocks_panel_box_shadow    = esc_attr( $attributes['panelBoxShadow'] ?? 'default' );
$elayne_blocks_panel_border_radius = absint( $attributes['panelBorderRadius'] ?? 4 );
$elayne_blocks_panel_border_width  = absint( $attributes['panelBorderWidth'] ?? 0 );
$elayne_blocks_panel_border_color  = esc_attr( $attributes['panelBorderColor'] ?? '' );
$elayne_blocks_panel_backdrop_blur = $attributes['panelBackdropBlur'] ?? false;

// Build wrapper classes with layout mode.
$elayne_blocks_wrapper_classes   = array( 'wp-block-navigation-item' );
$elayne_blocks_wrapper_classes[] = 'wp-block-elayne-mega-menu--layout-' . $elayne_blocks_layout_mode;
$elayne_blocks_wrapper_classes[] = 'mm-layout-' . $elayne_blocks_layout_mode;

if ( $elayne_blocks_enable_animations ) {
	$elayne_blocks_wrapper_classes[] = 'mm-animations-enabled';
	$elayne_blocks_wrapper_classes[] = 'mm-animation-' . $elayne_blocks_animation_type;
}

if ( $elayne_blocks_enable_hover && 'dropdown' === $elayne_blocks_layout_mode ) {
	$elayne_blocks_wrapper_classes[] = 'has-hover-activation';
}

$elayne_blocks_wrapper_attributes = get_block_wrapper_attributes(
	array(
		'class' => implode( ' ', $elayne_blocks_wrapper_classes ),
		'style' => '--mm-dropdown-spacing: ' . $elayne_blocks_dropdown_spacing . 'px',
	)
);

// Build context data for Interactivity API.
$elayne_blocks_context = array(
	'isOpen'                => false,
	'menuOpenedBy'          => array(),
	'layoutMode'            => $elayne_blocks_layout_mode,
	'dropdownAlignment'     => $elayne_blocks_dropdown_alignment,
	'enableHoverActivation' => $elayne_blocks_enable_hover,
	'animationSpeed'        => $elayne_blocks_animation_speed,
	'mobileBreakpoint'      => absint( $attributes['mobileBreakpoint'] ?? 768 ),
	'isMobile'              => false,
);

$elayne_blocks_close_icon  = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false"><path d="M13 11.8l6.1-6.3-1-1-6.1 6.2-6.1-6.2-1 1 6.1 6.3-6.5 6.7 1 1 6.5-6.6 6.5 6.6 1-1z"></path></svg>';
$elayne_blocks_toggle_icon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12" width="12" height="12" aria-hidden="true" focusable="false" fill="none"><path d="M1.50002 4L6.00002 8L10.5 4" stroke-width="1.5" stroke="currentColor"></path></svg>';

// Build icon HTML.
$elayne_blocks_icon_html = '';
if ( $elayne_blocks_enable_icon && ! empty( $elayne_blocks_icon_name ) ) {
	$elayne_blocks_icon_class = 'dashicons dashicons-' . $elayne_blocks_icon_name;
	$elayne_blocks_icon_html  = '<span class="' . $elayne_blocks_icon_class . ' mm-menu-icon" aria-hidden="true"></span>';
}

$elayne_blocks_label_html     = '<span class="wp-block-navigation-item__label mm-label-text">' . $elayne_blocks_label . '</span>';
$elayne_blocks_button_content = '';

// Position icon based on setting.
switch ( $elayne_blocks_icon_position ) {
	case 'right':
		$elayne_blocks_button_content = $elayne_blocks_label_html . $elayne_blocks_icon_html;
		break;
	case 'top':
		$elayne_blocks_button_content = '<span class="mm-icon-above">' . $elayne_blocks_icon_html . $elayne_blocks_label_html . '</span>';
		break;
	default: // left.
		$elayne_blocks_button_content = $elayne_blocks_icon_html . $elayne_blocks_label_html;
		break;
}

$elayne_blocks_button_style = '';
if ( $elayne_blocks_label_color ) {
	$elayne_blocks_button_style = 'style="color:' . $elayne_blocks_label_color . '"';
}
?>

<li <?php echo $elayne_blocks_wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?> data-wp-interactive="elayne/mega-menu" data-wp-context='<?php echo esc_attr( wp_json_encode( $elayne_blocks_context ) ); ?>' data-wp-on-document--keydown="actions.handleMenuKeydown" data-wp-on-document--click="actions.handleOutsideClick" data-wp-watch="callbacks.initMenu">

	<?php if ( 'overlay' === $elayne_blocks_layout_mode ) : ?>
		<div class="wp-block-elayne-mega-menu__backdrop mm-overlay-backdrop <?php echo $elayne_blocks_backdrop_blur ? 'mm-backdrop-blur' : ''; ?>" data-wp-class--is-visible="context.isOpen" data-wp-on--click="actions.closeMenu" 
		<?php
		if ( 'overlay' === $elayne_blocks_layout_mode ) :
			?>
			style="background: <?php echo esc_attr( $elayne_blocks_overlay_backdrop ); ?>"<?php endif; ?>></div>
	<?php endif; ?>

	<button class="wp-block-navigation-item__content wp-block-elayne-mega-menu__toggle wp-block-elayne-mega-menu__trigger mm-icon-position-<?php echo esc_attr( $elayne_blocks_icon_position ); ?>" data-wp-on--click="actions.toggleMenu" 
	<?php
	if ( $elayne_blocks_enable_hover ) :
		?>
		data-wp-on--mouseenter="actions.openMenu"<?php endif; ?> data-wp-bind--aria-expanded="context.isOpen" <?php echo $elayne_blocks_button_style; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
	<?php
	if ( $elayne_blocks_description ) :
		?>
		aria-describedby="menu-description-<?php echo esc_attr( $elayne_blocks_menu_slug ); ?>"
		<?php
	endif;
	?>
	>
		<?php echo $elayne_blocks_button_content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
		<span class="wp-block-elayne-mega-menu__toggle-icon"><?php echo $elayne_blocks_toggle_icon; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?></span>
	</button>

	<?php if ( $elayne_blocks_description ) : ?>
		<span id="menu-description-<?php echo esc_attr( $elayne_blocks_menu_slug ); ?>" class="screen-reader-text"><?php echo esc_html( $elayne_blocks_description ); ?></span>
	<?php endif; ?>

	<?php
	// Build panel classes with layout-specific classes.
	$elayne_blocks_panel_classes  = 'wp-block-elayne-mega-menu__panel';
	$elayne_blocks_panel_classes .= ' align-' . $elayne_blocks_dropdown_alignment;

	// Add box shadow class.
	$elayne_blocks_panel_classes .= ' mm-shadow-' . $elayne_blocks_panel_box_shadow;

	// Add backdrop blur class if enabled.
	if ( $elayne_blocks_panel_backdrop_blur ) {
		$elayne_blocks_panel_classes .= ' mm-backdrop-blur-enabled';
	}

	// Build panel inline styles.
	$elayne_blocks_panel_styles = array();

	// Border radius.
	if ( $elayne_blocks_panel_border_radius > 0 ) {
		$elayne_blocks_panel_styles[] = 'border-radius: ' . $elayne_blocks_panel_border_radius . 'px';
	}

	// Border.
	if ( $elayne_blocks_panel_border_width > 0 ) {
		$elayne_blocks_border_color   = ! empty( $elayne_blocks_panel_border_color ) ? $elayne_blocks_panel_border_color : '#ddd';
		$elayne_blocks_panel_styles[] = 'border: ' . $elayne_blocks_panel_border_width . 'px solid ' . $elayne_blocks_border_color;
	}

	// Build style attribute.
	$elayne_blocks_panel_style = ! empty( $elayne_blocks_panel_styles )
		? 'style="' . esc_attr( implode( '; ', $elayne_blocks_panel_styles ) ) . '"'
		: '';
	?>
	<div class="<?php echo esc_attr( $elayne_blocks_panel_classes ); ?>" data-wp-class--is-open="context.isOpen" <?php echo $elayne_blocks_panel_style; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
		<?php
		// Render template part if menuSlug is set.
		if ( ! empty( $elayne_blocks_menu_slug ) ) {
			if ( function_exists( 'block_template_part' ) ) {
				echo block_template_part( $elayne_blocks_menu_slug ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			} else {
				// Fallback for older WordPress versions.
				$elayne_blocks_template_part = get_block_template( 'elayne//' . $elayne_blocks_menu_slug, 'wp_template_part' );
				if ( $elayne_blocks_template_part && $elayne_blocks_template_part->content ) {
					echo do_blocks( $elayne_blocks_template_part->content ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
				}
			}
		}
		?>

		<button aria-label="<?php echo esc_attr( __( 'Close menu', 'elayne-blocks' ) ); ?>" class="menu-container__close-button" data-wp-on--click="actions.closeMenu" type="button">
			<?php echo $elayne_blocks_close_icon; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
		</button>
	</div>

</li>
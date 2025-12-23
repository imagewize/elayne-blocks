<?php
/**
 * Mega Menu Block Server-side Render
 *
 * @package Elayne
 */

$label        = esc_html( $attributes['label'] ?? '' );
$label_color  = esc_attr( $attributes['labelColor'] ?? '' );
$description  = esc_html( $attributes['description'] ?? '' );
$menu_slug    = esc_attr( $attributes['menuSlug'] ?? '' );
$justify_menu = esc_attr( $attributes['justifyMenu'] ?? 'left' );
$menu_width   = esc_attr( $attributes['width'] ?? 'content' );

$menu_classes  = 'elayne-mega-menu wp-block-elayne-mega-menu__menu-container';
$menu_classes .= ' menu-width-' . $menu_width;
$menu_classes .= $justify_menu ? ' menu-justified-' . $justify_menu : '';

$wrapper_attributes = get_block_wrapper_attributes(
	array(
		'class' => 'wp-block-navigation-item',
	)
);

$close_icon  = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false"><path d="M13 11.8l6.1-6.3-1-1-6.1 6.2-6.1-6.2-1 1 6.1 6.3-6.5 6.7 1 1 6.5-6.6 6.5 6.6 1-1z"></path></svg>';
$toggle_icon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12" width="12" height="12" aria-hidden="true" focusable="false" fill="none"><path d="M1.50002 4L6.00002 8L10.5 4" stroke-width="1.5" stroke="currentColor"></path></svg>';

$button_style = '';
if ( $label_color ) {
	$button_style = 'style="color:' . $label_color . '"';
}
?>

<li <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?> data-wp-interactive='{"namespace": "elayne/mega-menu"}' data-wp-context='{"menuOpenedBy": {}}' data-wp-on-document--keydown="actions.handleMenuKeydown" data-wp-on-document--click="actions.handleOutsideClick" data-wp-watch="callbacks.initMenu">

	<button class="wp-block-navigation-item__content wp-block-elayne-mega-menu__toggle" data-wp-on--click="actions.toggleMenuOnClick" data-wp-bind--aria-expanded="state.isMenuOpen" <?php echo $button_style; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?> <?php
	if ( $description ) :
		?>
		aria-describedby="menu-description-<?php echo esc_attr( $menu_slug ); ?>"<?php endif; ?>>
		<span class="wp-block-navigation-item__label"><?php echo esc_html( $label ); ?></span>
		<span class="wp-block-elayne-mega-menu__toggle-icon"><?php echo $toggle_icon; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?></span>
	</button>

	<?php if ( $description ) : ?>
		<span id="menu-description-<?php echo esc_attr( $menu_slug ); ?>" class="screen-reader-text"><?php echo esc_html( $description ); ?></span>
	<?php endif; ?>

	<?php if ( $menu_slug ) : ?>
	<div class="<?php echo esc_attr( $menu_classes ); ?>">
		<?php
		// Render the template part if menu slug is provided.
		if ( function_exists( 'block_template_part' ) ) {
			echo block_template_part( $menu_slug ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		} else {
			// Fallback for older WordPress versions.
			$template_part = get_block_template( 'elayne//' . $menu_slug, 'wp_template_part' );
			if ( $template_part && $template_part->content ) {
				echo do_blocks( $template_part->content ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			}
		}
		?>

		<button aria-label="<?php echo esc_attr( __( 'Close menu', 'elayne' ) ); ?>" class="menu-container__close-button" data-wp-on--click="actions.closeMenuOnClick" type="button">
			<?php echo $close_icon; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
		</button>
	</div>
	<?php endif; ?>

</li>
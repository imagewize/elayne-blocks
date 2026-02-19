<?php
/**
 * Admin Settings Page for Elayne Blocks
 *
 * Provides an admin interface to selectively enable/disable individual blocks.
 *
 * @package ELayneBlocks
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Register the settings page in WordPress admin.
 */
function elayne_blocks_add_settings_page() {
	add_options_page(
		__( 'Elayne Blocks Settings', 'elayne-blocks' ),
		__( 'Elayne Blocks', 'elayne-blocks' ),
		'manage_options',
		'elayne-blocks',
		'elayne_blocks_settings_page_html'
	);
}
add_action( 'admin_menu', 'elayne_blocks_add_settings_page' );

/**
 * Register settings with WordPress Settings API.
 */
function elayne_blocks_register_settings() {
	register_setting(
		'elayne_blocks_settings',
		'elayne_blocks_enabled',
		array(
			'type'              => 'array',
			'sanitize_callback' => 'elayne_blocks_sanitize_settings',
			'default'           => elayne_blocks_get_default_settings(),
		)
	);

	add_settings_section(
		'elayne_blocks_main_section',
		__( 'Block Management', 'elayne-blocks' ),
		'elayne_blocks_settings_section_cb',
		'elayne-blocks'
	);

	// Get all available blocks.
	$blocks = elayne_blocks_get_available_blocks();

	foreach ( $blocks as $block_slug => $block_data ) {
		add_settings_field(
			'elayne_blocks_' . $block_slug,
			$block_data['label'],
			'elayne_blocks_settings_field_cb',
			'elayne-blocks',
			'elayne_blocks_main_section',
			array(
				'slug'        => $block_slug,
				'label'       => $block_data['label'],
				'description' => $block_data['description'],
				'parent'      => $block_data['parent'] ?? null,
			)
		);
	}
}
add_action( 'admin_init', 'elayne_blocks_register_settings' );

/**
 * Get default settings (all blocks enabled).
 *
 * @return array Default settings with all blocks enabled.
 */
function elayne_blocks_get_default_settings() {
	return array(
		'carousel'               => true,
		'slide'                  => true,
		'mega-menu'              => true,
		'faq-tabs'               => true,
		'faq-tab-answer'         => true,
		'search-overlay-trigger' => true,
	);
}

/**
 * Get available blocks with metadata.
 *
 * @return array Block configuration data.
 */
function elayne_blocks_get_available_blocks() {
	return array(
		'carousel'               => array(
			'label'       => __( 'Carousel Block', 'elayne-blocks' ),
			'description' => __( 'Create responsive image/content carousels with Slick Carousel', 'elayne-blocks' ),
		),
		'slide'                  => array(
			'label'       => __( 'Slide Block', 'elayne-blocks' ),
			'description' => __( 'Individual slides for Carousel block', 'elayne-blocks' ),
			'parent'      => 'carousel',
		),
		'mega-menu'              => array(
			'label'       => __( 'Mega Menu Block', 'elayne-blocks' ),
			'description' => __( 'Add expandable mega menus to navigation', 'elayne-blocks' ),
		),
		'faq-tabs'               => array(
			'label'       => __( 'FAQ Tabs Block', 'elayne-blocks' ),
			'description' => __( 'Interactive FAQ with vertical tabs and content panels', 'elayne-blocks' ),
		),
		'faq-tab-answer'         => array(
			'label'       => __( 'FAQ Tab Answer Block', 'elayne-blocks' ),
			'description' => __( 'Individual FAQ answers', 'elayne-blocks' ),
			'parent'      => 'faq-tabs',
		),
		'search-overlay-trigger' => array(
			'label'       => __( 'Search Overlay Trigger Block', 'elayne-blocks' ),
			'description' => __( 'Full-screen search overlay with custom styling', 'elayne-blocks' ),
		),
	);
}

/**
 * Sanitize and validate settings before saving.
 *
 * @param array $input Raw input from settings form.
 * @return array Sanitized and validated settings.
 */
function elayne_blocks_sanitize_settings( $input ) {
	$sanitized = array();
	$defaults  = elayne_blocks_get_default_settings();

	// Sanitize each block setting.
	foreach ( $defaults as $block_slug => $default_value ) {
		$sanitized[ $block_slug ] = isset( $input[ $block_slug ] ) && '1' === $input[ $block_slug ];
	}

	// Validate dependencies.
	$sanitized = elayne_blocks_validate_dependencies( $sanitized );

	return $sanitized;
}

/**
 * Validate parent-child block dependencies.
 *
 * @param array $settings Block settings.
 * @return array Validated settings with dependencies enforced.
 */
function elayne_blocks_validate_dependencies( $settings ) {
	// If Carousel is disabled, auto-disable Slide.
	if ( empty( $settings['carousel'] ) ) {
		$settings['slide'] = false;
	}

	// If FAQ Tabs is disabled, auto-disable FAQ Tab Answer.
	if ( empty( $settings['faq-tabs'] ) ) {
		$settings['faq-tab-answer'] = false;
	}

	return $settings;
}

/**
 * Settings section callback.
 */
function elayne_blocks_settings_section_cb() {
	echo '<p>' . esc_html__( 'Enable or disable individual blocks. Disabled blocks will not appear in the block inserter.', 'elayne-blocks' ) . '</p>';
}

/**
 * Settings field callback for each block checkbox.
 *
 * @param array $args Field arguments.
 */
function elayne_blocks_settings_field_cb( $args ) {
	$enabled_blocks = get_option( 'elayne_blocks_enabled', elayne_blocks_get_default_settings() );
	$slug           = $args['slug'];
	$checked        = ! empty( $enabled_blocks[ $slug ] );
	$parent         = $args['parent'] ?? null;

	echo '<label>';
	echo '<input type="checkbox" ';
	echo 'name="elayne_blocks_enabled[' . esc_attr( $slug ) . ']" ';
	echo 'value="1" ';
	echo 'id="elayne_blocks_' . esc_attr( $slug ) . '" ';
	echo 'class="elayne-block-checkbox" ';
	if ( $parent ) {
		echo 'data-parent="' . esc_attr( $parent ) . '" ';
	}
	checked( $checked, true );
	echo '/>';
	echo '</label>';

	if ( ! empty( $args['description'] ) ) {
		echo '<p class="description">' . esc_html( $args['description'] );
		if ( $parent ) {
			echo '<br><strong>' . esc_html__( 'Note:', 'elayne-blocks' ) . '</strong> ';
			/* translators: %s: parent block name */
			printf(
				/* translators: %s: parent block name */
				esc_html__( 'Requires %s to be enabled', 'elayne-blocks' ),
				esc_html( elayne_blocks_get_available_blocks()[ $parent ]['label'] )
			);
		}
		echo '</p>';
	}
}

/**
 * Render the settings page HTML.
 */
function elayne_blocks_settings_page_html() {
	// Check user capabilities.
	if ( ! current_user_can( 'manage_options' ) ) {
		return;
	}

	// Add error/success messages.
	// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- WordPress Settings API handles nonce verification.
	if ( isset( $_GET['settings-updated'] ) ) {
		add_settings_error(
			'elayne_blocks_messages',
			'elayne_blocks_message',
			__( 'Settings saved successfully.', 'elayne-blocks' ),
			'success'
		);
	}

	settings_errors( 'elayne_blocks_messages' );
	?>
	<div class="wrap">
		<h1><?php echo esc_html( get_admin_page_title() ); ?></h1>

		<form action="options.php" method="post">
			<?php
			settings_fields( 'elayne_blocks_settings' );
			do_settings_sections( 'elayne-blocks' );
			?>

			<div class="elayne-blocks-bulk-actions">
				<button type="button" class="button" id="elayne-enable-all">
					<?php esc_html_e( 'Enable All', 'elayne-blocks' ); ?>
				</button>
				<button type="button" class="button" id="elayne-disable-all">
					<?php esc_html_e( 'Disable All', 'elayne-blocks' ); ?>
				</button>
			</div>

			<?php submit_button( __( 'Save Changes', 'elayne-blocks' ) ); ?>
		</form>
	</div>
	<?php
}

/**
 * Enqueue admin assets for settings page.
 *
 * @param string $hook The current admin page hook.
 */
function elayne_blocks_enqueue_admin_assets( $hook ) {
	// Only load on our settings page.
	if ( 'settings_page_elayne-blocks' !== $hook ) {
		return;
	}

	wp_enqueue_style(
		'elayne-blocks-admin',
		plugins_url( 'assets/admin/admin-settings.css', __DIR__ . '/../..' ),
		array(),
		ELAYNE_BLOCKS_VERSION
	);

	wp_enqueue_script(
		'elayne-blocks-admin',
		plugins_url( 'assets/admin/admin-settings.js', __DIR__ . '/../..' ),
		array( 'jquery' ),
		ELAYNE_BLOCKS_VERSION,
		true
	);
}
add_action( 'admin_enqueue_scripts', 'elayne_blocks_enqueue_admin_assets' );

<?php
/**
 * Plugin Name: Elayne Blocks
 * Plugin URI: https://github.com/imagewize/elayne-blocks
 * Description: Custom blocks for the Elayne WordPress theme including Mega Menu, Carousel, and Slide blocks
 * Version: 2.2.2
 * Requires at least: 6.7
 * Requires PHP: 7.3
 * Author: Jasper Frumau
 * Author URI: https://github.com/imagewize
 * License: GPL v3 or later
 * License URI: https://www.gnu.org/licenses/gpl-3.0.html
 * Text Domain: elayne-blocks
 * Domain Path: /languages
 *
 * @package ELayneBlocks
 */

namespace ELayneBlocks;

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

define( 'ELAYNE_BLOCKS_VERSION', '2.2.2' );
define( 'ELAYNE_BLOCKS_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( 'ELAYNE_BLOCKS_PLUGIN_URL', plugin_dir_url( __FILE__ ) );

/**
 * Register custom blocks
 */
add_action(
	'init',
	function () {
		$blocks_dir = ELAYNE_BLOCKS_PLUGIN_DIR . 'blocks';

		if ( ! is_dir( $blocks_dir ) ) {
			return;
		}

		$block_folders = scandir( $blocks_dir );

		foreach ( $block_folders as $folder ) {
			if ( '.' === $folder || '..' === $folder ) {
				continue;
			}

			$block_json_path = $blocks_dir . '/' . $folder . '/build/block.json';

			if ( file_exists( $block_json_path ) ) {
				register_block_type( $block_json_path );
			}
		}
	},
	10
);

/**
 * Enqueue carousel assets conditionally
 */
add_action(
	'wp_enqueue_scripts',
	function () {
		// Only load carousel assets if carousel block is being used.
		if ( has_block( 'elayne/carousel' ) ) {
			// Enqueue Slick Carousel CSS.
			wp_enqueue_style(
				'slick-carousel',
				ELAYNE_BLOCKS_PLUGIN_URL . 'blocks/carousel/slick/slick.css',
				array(),
				'1.8.1'
			);

			wp_enqueue_style(
				'slick-carousel-theme',
				ELAYNE_BLOCKS_PLUGIN_URL . 'blocks/carousel/slick/slick-theme.css',
				array( 'slick-carousel' ),
				'1.8.1'
			);

			// Enqueue Slick Carousel JS.
			wp_enqueue_script(
				'slick-carousel',
				ELAYNE_BLOCKS_PLUGIN_URL . 'blocks/carousel/slick/slick.min.js',
				array( 'jquery' ),
				'1.8.1',
				true
			);
		}
	}
);


/**
 * Allow SVG and WebP uploads to the media library.
 *
 * @param array $mimes Allowed MIME types.
 * @return array Modified MIME types array.
 */
function elayne_blocks_allow_additional_mime_types( $mimes ) {
	$mimes['svg']  = 'image/svg+xml';
	$mimes['webp'] = 'image/webp';
	return $mimes;
}
add_filter( 'upload_mimes', __NAMESPACE__ . '\\elayne_blocks_allow_additional_mime_types' );

/**
 * Fix SVG and WebP display in media library.
 */
function elayne_blocks_fix_media_display() {
	echo '<style>
		.media-icon img[src$=".svg"], img[src$=".svg"].attachment-post-thumbnail {
			width: 100% !important;
			height: auto !important;
		}
		.media-icon img[src$=".webp"], img[src$=".webp"].attachment-post-thumbnail {
			width: 100% !important;
			height: auto !important;
		}
	</style>';
}
add_action( 'admin_head', __NAMESPACE__ . '\\elayne_blocks_fix_media_display' );

<?php
/**
 * Plugin Name: Elayne Blocks
 * Plugin URI: https://github.com/imagewize/elayne-blocks
 * Description: Custom blocks for the Elayne WordPress theme including Mega Menu, Carousel, and Slide blocks
 * Version: 2.3.1
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

define( 'ELAYNE_BLOCKS_VERSION', '2.3.1' );
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

			// Localize script to provide plugin URL for arrow SVGs.
			wp_localize_script(
				'slick-carousel',
				'elayneBlocksData',
				array(
					'pluginUrl' => ELAYNE_BLOCKS_PLUGIN_URL,
				)
			);
		}
	}
);


/**
 * Register block patterns
 */
add_action(
	'init',
	function () {
		// Register pattern category for Elayne Blocks
		if ( function_exists( 'register_block_pattern_category' ) ) {
			register_block_pattern_category(
				'elayne-blocks',
				array(
					'label'       => __( 'Elayne Blocks', 'elayne-blocks' ),
					'description' => __( 'Pre-configured patterns for Elayne Blocks carousel and other blocks.', 'elayne-blocks' ),
				)
			);
		}

		// Pattern 1: Hero Carousel
		if ( function_exists( 'register_block_pattern' ) ) {
			register_block_pattern(
				'elayne-blocks/hero-carousel',
				array(
					'title'       => __( 'Hero Carousel', 'elayne-blocks' ),
					'description' => __( 'Full-width hero carousel with autoplay and fade transition.', 'elayne-blocks' ),
					'categories'  => array( 'elayne-blocks' ),
					'content'     => '<!-- wp:elayne/carousel {"slidesToShow":1,"slidesToScroll":1,"infinite":true,"autoplay":true,"autoplaySpeed":5000,"speed":1000,"arrows":true,"dots":true} -->
<div class="wp-block-elayne-carousel slick-slider cb-single-slide" data-slick="{&quot;slidesToShow&quot;:1,&quot;slidesToScroll&quot;:1,&quot;arrows&quot;:true,&quot;dots&quot;:true,&quot;infinite&quot;:true,&quot;autoplay&quot;:true,&quot;autoplaySpeed&quot;:5000,&quot;speed&quot;:1000,&quot;rtl&quot;:false,&quot;adaptiveHeight&quot;:false,&quot;centerMode&quot;:false,&quot;centerPadding&quot;:&quot;50px&quot;,&quot;variableWidth&quot;:false,&quot;responsive&quot;:[{&quot;breakpoint&quot;:769,&quot;settings&quot;:{&quot;slidesToShow&quot;:1,&quot;slidesToScroll&quot;:1,&quot;centerMode&quot;:false,&quot;variableWidth&quot;:false}}]}"><!-- wp:elayne/slide -->
<div class="wp-block-elayne-slide"><!-- wp:cover {"url":"https://images.unsplash.com/photo-1557683316-973673baf926","dimRatio":50,"minHeight":500,"minHeightUnit":"px","contentPosition":"center center"} -->
<div class="wp-block-cover" style="min-height:500px"><span aria-hidden="true" class="wp-block-cover__background has-background-dim"></span><img class="wp-block-cover__image-background" alt="" src="https://images.unsplash.com/photo-1557683316-973673baf926" data-object-fit="cover"/><div class="wp-block-cover__inner-container"><!-- wp:heading {"textAlign":"center","level":1} -->
<h1 class="wp-block-heading has-text-align-center">Welcome to Our Site</h1>
<!-- /wp:heading -->

<!-- wp:paragraph {"align":"center"} -->
<p class="has-text-align-center">Discover amazing content</p>
<!-- /wp:paragraph --></div></div>
<!-- /wp:cover --></div>
<!-- /wp:elayne/slide -->

<!-- wp:elayne/slide -->
<div class="wp-block-elayne-slide"><!-- wp:cover {"url":"https://images.unsplash.com/photo-1558618666-fcd25c85cd64","dimRatio":50,"minHeight":500,"minHeightUnit":"px","contentPosition":"center center"} -->
<div class="wp-block-cover" style="min-height:500px"><span aria-hidden="true" class="wp-block-cover__background has-background-dim"></span><img class="wp-block-cover__image-background" alt="" src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64" data-object-fit="cover"/><div class="wp-block-cover__inner-container"><!-- wp:heading {"textAlign":"center","level":1} -->
<h1 class="wp-block-heading has-text-align-center">Premium Services</h1>
<!-- /wp:heading -->

<!-- wp:paragraph {"align":"center"} -->
<p class="has-text-align-center">Quality you can trust</p>
<!-- /wp:paragraph --></div></div>
<!-- /wp:cover --></div>
<!-- /wp:elayne/slide -->

<!-- wp:elayne/slide -->
<div class="wp-block-elayne-slide"><!-- wp:cover {"url":"https://images.unsplash.com/photo-1519389950473-47ba0277781c","dimRatio":50,"minHeight":500,"minHeightUnit":"px","contentPosition":"center center"} -->
<div class="wp-block-cover" style="min-height:500px"><span aria-hidden="true" class="wp-block-cover__background has-background-dim"></span><img class="wp-block-cover__image-background" alt="" src="https://images.unsplash.com/photo-1519389950473-47ba0277781c" data-object-fit="cover"/><div class="wp-block-cover__inner-container"><!-- wp:heading {"textAlign":"center","level":1} -->
<h1 class="wp-block-heading has-text-align-center">Get Started Today</h1>
<!-- /wp:heading -->

<!-- wp:paragraph {"align":"center"} -->
<p class="has-text-align-center">Join thousands of satisfied customers</p>
<!-- /wp:paragraph --></div></div>
<!-- /wp:cover --></div>
<!-- /wp:elayne/slide --></div>
<!-- /wp:elayne/carousel -->',
				)
			);

			// Pattern 2: Testimonial Carousel
			register_block_pattern(
				'elayne-blocks/testimonial-carousel',
				array(
					'title'       => __( 'Testimonial Carousel', 'elayne-blocks' ),
					'description' => __( 'Center mode carousel with 3 slides visible, perfect for testimonials.', 'elayne-blocks' ),
					'categories'  => array( 'elayne-blocks' ),
					'content'     => '<!-- wp:elayne/carousel {"slidesToShow":1,"slidesToScroll":1,"infinite":true,"centerMode":true,"centerPadding":"100px","arrows":true,"dots":true} -->
<div class="wp-block-elayne-carousel slick-slider cb-single-slide cb-center-mode" data-slick="{&quot;slidesToShow&quot;:1,&quot;slidesToScroll&quot;:1,&quot;arrows&quot;:true,&quot;dots&quot;:true,&quot;infinite&quot;:true,&quot;autoplay&quot;:false,&quot;autoplaySpeed&quot;:3000,&quot;speed&quot;:500,&quot;rtl&quot;:false,&quot;adaptiveHeight&quot;:false,&quot;centerMode&quot;:true,&quot;centerPadding&quot;:&quot;100px&quot;,&quot;variableWidth&quot;:false,&quot;responsive&quot;:[{&quot;breakpoint&quot;:769,&quot;settings&quot;:{&quot;slidesToShow&quot;:1,&quot;slidesToScroll&quot;:1,&quot;centerMode&quot;:false,&quot;variableWidth&quot;:false}}]}"><!-- wp:elayne/slide -->
<div class="wp-block-elayne-slide"><!-- wp:group {"style":{"spacing":{"padding":{"top":"var:preset|spacing|50","bottom":"var:preset|spacing|50","left":"var:preset|spacing|50","right":"var:preset|spacing|50"}},"border":{"radius":"8px"}},"backgroundColor":"base"} -->
<div class="wp-block-group has-base-background-color has-background" style="border-radius:8px;padding-top:var(--wp--preset--spacing--50);padding-right:var(--wp--preset--spacing--50);padding-bottom:var(--wp--preset--spacing--50);padding-left:var(--wp--preset--spacing--50)"><!-- wp:paragraph {"align":"center"} -->
<p class="has-text-align-center">"This product changed my life! Highly recommended to everyone."</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"textAlign":"center","level":4} -->
<h4 class="wp-block-heading has-text-align-center">Sarah Johnson</h4>
<!-- /wp:heading --></div>
<!-- /wp:group --></div>
<!-- /wp:elayne/slide -->

<!-- wp:elayne/slide -->
<div class="wp-block-elayne-slide"><!-- wp:group {"style":{"spacing":{"padding":{"top":"var:preset|spacing|50","bottom":"var:preset|spacing|50","left":"var:preset|spacing|50","right":"var:preset|spacing|50"}},"border":{"radius":"8px"}},"backgroundColor":"base"} -->
<div class="wp-block-group has-base-background-color has-background" style="border-radius:8px;padding-top:var(--wp--preset--spacing--50);padding-right:var(--wp--preset--spacing--50);padding-bottom:var(--wp--preset--spacing--50);padding-left:var(--wp--preset--spacing--50)"><!-- wp:paragraph {"align":"center"} -->
<p class="has-text-align-center">"Excellent service and support. Will definitely use again!"</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"textAlign":"center","level":4} -->
<h4 class="wp-block-heading has-text-align-center">Michael Chen</h4>
<!-- /wp:heading --></div>
<!-- /wp:group --></div>
<!-- /wp:elayne/slide -->

<!-- wp:elayne/slide -->
<div class="wp-block-elayne-slide"><!-- wp:group {"style":{"spacing":{"padding":{"top":"var:preset|spacing|50","bottom":"var:preset|spacing|50","left":"var:preset|spacing|50","right":"var:preset|spacing|50"}},"border":{"radius":"8px"}},"backgroundColor":"base"} -->
<div class="wp-block-group has-base-background-color has-background" style="border-radius:8px;padding-top:var(--wp--preset--spacing--50);padding-right:var(--wp--preset--spacing--50);padding-bottom:var(--wp--preset--spacing--50);padding-left:var(--wp--preset--spacing--50)"><!-- wp:paragraph {"align":"center"} -->
<p class="has-text-align-center">"Best decision I made for my business this year."</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"textAlign":"center","level":4} -->
<h4 class="wp-block-heading has-text-align-center">Emma Davis</h4>
<!-- /wp:heading --></div>
<!-- /wp:group --></div>
<!-- /wp:elayne/slide --></div>
<!-- /wp:elayne/carousel -->',
				)
			);

			// Pattern 3: Product Gallery with Thumbnails
			register_block_pattern(
				'elayne-blocks/product-gallery',
				array(
					'title'       => __( 'Product Gallery with Thumbnails', 'elayne-blocks' ),
					'description' => __( 'Image carousel with thumbnail navigation below, perfect for product galleries.', 'elayne-blocks' ),
					'categories'  => array( 'elayne-blocks' ),
					'content'     => '<!-- wp:elayne/carousel {"slidesToShow":1,"slidesToScroll":1,"infinite":true,"enableThumbnails":true,"thumbnailsToShow":4,"thumbnailPosition":"below","arrows":true,"dots":false} -->
<div class="wp-block-elayne-carousel slick-slider cb-single-slide cb-thumbnails" data-slick="{&quot;slidesToShow&quot;:1,&quot;slidesToScroll&quot;:1,&quot;arrows&quot;:true,&quot;dots&quot;:false,&quot;infinite&quot;:true,&quot;autoplay&quot;:false,&quot;autoplaySpeed&quot;:3000,&quot;speed&quot;:500,&quot;rtl&quot;:false,&quot;adaptiveHeight&quot;:false,&quot;centerMode&quot;:false,&quot;centerPadding&quot;:&quot;50px&quot;,&quot;variableWidth&quot;:false,&quot;responsive&quot;:[{&quot;breakpoint&quot;:769,&quot;settings&quot;:{&quot;slidesToShow&quot;:1,&quot;slidesToScroll&quot;:1,&quot;centerMode&quot;:false,&quot;variableWidth&quot;:false}}]}" data-thumbnails="true" data-thumbnails-to-show="4" data-thumbnail-position="below"><!-- wp:elayne/slide -->
<div class="wp-block-elayne-slide"><!-- wp:image {"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30" alt="Product view 1"/></figure>
<!-- /wp:image --></div>
<!-- /wp:elayne/slide -->

<!-- wp:elayne/slide -->
<div class="wp-block-elayne-slide"><!-- wp:image {"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="https://images.unsplash.com/photo-1572635196237-14b3f281503f" alt="Product view 2"/></figure>
<!-- /wp:image --></div>
<!-- /wp:elayne/slide -->

<!-- wp:elayne/slide -->
<div class="wp-block-elayne-slide"><!-- wp:image {"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e" alt="Product view 3"/></figure>
<!-- /wp:image --></div>
<!-- /wp:elayne/slide -->

<!-- wp:elayne/slide -->
<div class="wp-block-elayne-slide"><!-- wp:image {"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="https://images.unsplash.com/photo-1560343090-f0409e92791a" alt="Product view 4"/></figure>
<!-- /wp:image --></div>
<!-- /wp:elayne/slide --></div>
<!-- /wp:elayne/carousel -->',
				)
			);

			// Pattern 4: Portfolio Showcase
			register_block_pattern(
				'elayne-blocks/portfolio-showcase',
				array(
					'title'       => __( 'Portfolio Showcase', 'elayne-blocks' ),
					'description' => __( 'Variable width carousel for displaying portfolio items with different sizes.', 'elayne-blocks' ),
					'categories'  => array( 'elayne-blocks' ),
					'content'     => '<!-- wp:elayne/carousel {"slidesToShow":3,"slidesToScroll":1,"infinite":true,"variableWidth":true,"arrows":true,"dots":true} -->
<div class="wp-block-elayne-carousel slick-slider cb-variable-width" data-slick="{&quot;slidesToShow&quot;:3,&quot;slidesToScroll&quot;:1,&quot;arrows&quot;:true,&quot;dots&quot;:true,&quot;infinite&quot;:true,&quot;autoplay&quot;:false,&quot;autoplaySpeed&quot;:3000,&quot;speed&quot;:500,&quot;rtl&quot;:false,&quot;adaptiveHeight&quot;:false,&quot;centerMode&quot;:false,&quot;centerPadding&quot;:&quot;50px&quot;,&quot;variableWidth&quot;:true,&quot;responsive&quot;:[{&quot;breakpoint&quot;:769,&quot;settings&quot;:{&quot;slidesToShow&quot;:1,&quot;slidesToScroll&quot;:1,&quot;centerMode&quot;:false,&quot;variableWidth&quot;:false}}]}"><!-- wp:elayne/slide -->
<div class="wp-block-elayne-slide" style="width:300px"><!-- wp:image {"width":"300px","sizeSlug":"large"} -->
<figure class="wp-block-image size-large is-resized"><img src="https://images.unsplash.com/photo-1498050108023-c5249f4df085" alt="Project 1" style="width:300px"/></figure>
<!-- /wp:image -->

<!-- wp:heading {"level":3} -->
<h3 class="wp-block-heading">Web Design</h3>
<!-- /wp:heading --></div>
<!-- /wp:elayne/slide -->

<!-- wp:elayne/slide -->
<div class="wp-block-elayne-slide" style="width:400px"><!-- wp:image {"width":"400px","sizeSlug":"large"} -->
<figure class="wp-block-image size-large is-resized"><img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f" alt="Project 2" style="width:400px"/></figure>
<!-- /wp:image -->

<!-- wp:heading {"level":3} -->
<h3 class="wp-block-heading">App Development</h3>
<!-- /wp:heading --></div>
<!-- /wp:elayne/slide -->

<!-- wp:elayne/slide -->
<div class="wp-block-elayne-slide" style="width:350px"><!-- wp:image {"width":"350px","sizeSlug":"large"} -->
<figure class="wp-block-image size-large is-resized"><img src="https://images.unsplash.com/photo-1551650975-87deedd944c3" alt="Project 3" style="width:350px"/></figure>
<!-- /wp:image -->

<!-- wp:heading {"level":3} -->
<h3 class="wp-block-heading">Branding</h3>
<!-- /wp:heading --></div>
<!-- /wp:elayne/slide --></div>
<!-- /wp:elayne/carousel -->',
				)
			);

			// Pattern 5: Team Members
			register_block_pattern(
				'elayne-blocks/team-members',
				array(
					'title'       => __( 'Team Members Carousel', 'elayne-blocks' ),
					'description' => __( 'Multi-slide carousel with adaptive height for team member profiles.', 'elayne-blocks' ),
					'categories'  => array( 'elayne-blocks' ),
					'content'     => '<!-- wp:elayne/carousel {"slidesToShow":3,"slidesToScroll":1,"infinite":true,"adaptiveHeight":true,"arrows":true,"dots":true,"responsiveSlides":1} -->
<div class="wp-block-elayne-carousel slick-slider" data-slick="{&quot;slidesToShow&quot;:3,&quot;slidesToScroll&quot;:1,&quot;arrows&quot;:true,&quot;dots&quot;:true,&quot;infinite&quot;:true,&quot;autoplay&quot;:false,&quot;autoplaySpeed&quot;:3000,&quot;speed&quot;:500,&quot;rtl&quot;:false,&quot;adaptiveHeight&quot;:true,&quot;centerMode&quot;:false,&quot;centerPadding&quot;:&quot;50px&quot;,&quot;variableWidth&quot;:false,&quot;responsive&quot;:[{&quot;breakpoint&quot;:769,&quot;settings&quot;:{&quot;slidesToShow&quot;:1,&quot;slidesToScroll&quot;:1,&quot;centerMode&quot;:false,&quot;variableWidth&quot;:false}}]}"><!-- wp:elayne/slide -->
<div class="wp-block-elayne-slide"><!-- wp:group {"style":{"spacing":{"padding":{"top":"var:preset|spacing|40","bottom":"var:preset|spacing|40","left":"var:preset|spacing|40","right":"var:preset|spacing|40"}}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group" style="padding-top:var(--wp--preset--spacing--40);padding-right:var(--wp--preset--spacing--40);padding-bottom:var(--wp--preset--spacing--40);padding-left:var(--wp--preset--spacing--40)"><!-- wp:image {"align":"center","width":"150px","height":"150px","sizeSlug":"large","className":"is-style-rounded"} -->
<figure class="wp-block-image aligncenter size-large is-resized is-style-rounded"><img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330" alt="Team member 1" style="width:150px;height:150px"/></figure>
<!-- /wp:image -->

<!-- wp:heading {"textAlign":"center","level":3} -->
<h3 class="wp-block-heading has-text-align-center">Jane Smith</h3>
<!-- /wp:heading -->

<!-- wp:paragraph {"align":"center"} -->
<p class="has-text-align-center"><strong>CEO &amp; Founder</strong></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"align":"center"} -->
<p class="has-text-align-center">Leading our team with vision and passion for excellence.</p>
<!-- /wp:paragraph --></div>
<!-- /wp:group --></div>
<!-- /wp:elayne/slide -->

<!-- wp:elayne/slide -->
<div class="wp-block-elayne-slide"><!-- wp:group {"style":{"spacing":{"padding":{"top":"var:preset|spacing|40","bottom":"var:preset|spacing|40","left":"var:preset|spacing|40","right":"var:preset|spacing|40"}}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group" style="padding-top:var(--wp--preset--spacing--40);padding-right:var(--wp--preset--spacing--40);padding-bottom:var(--wp--preset--spacing--40);padding-left:var(--wp--preset--spacing--40)"><!-- wp:image {"align":"center","width":"150px","height":"150px","sizeSlug":"large","className":"is-style-rounded"} -->
<figure class="wp-block-image aligncenter size-large is-resized is-style-rounded"><img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d" alt="Team member 2" style="width:150px;height:150px"/></figure>
<!-- /wp:image -->

<!-- wp:heading {"textAlign":"center","level":3} -->
<h3 class="wp-block-heading has-text-align-center">John Doe</h3>
<!-- /wp:heading -->

<!-- wp:paragraph {"align":"center"} -->
<p class="has-text-align-center"><strong>Creative Director</strong></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"align":"center"} -->
<p class="has-text-align-center">Crafting beautiful designs that inspire and engage.</p>
<!-- /wp:paragraph --></div>
<!-- /wp:group --></div>
<!-- /wp:elayne/slide -->

<!-- wp:elayne/slide -->
<div class="wp-block-elayne-slide"><!-- wp:group {"style":{"spacing":{"padding":{"top":"var:preset|spacing|40","bottom":"var:preset|spacing|40","left":"var:preset|spacing|40","right":"var:preset|spacing|40"}}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group" style="padding-top:var(--wp--preset--spacing--40);padding-right:var(--wp--preset--spacing--40);padding-bottom:var(--wp--preset--spacing--40);padding-left:var(--wp--preset--spacing--40)"><!-- wp:image {"align":"center","width":"150px","height":"150px","sizeSlug":"large","className":"is-style-rounded"} -->
<figure class="wp-block-image aligncenter size-large is-resized is-style-rounded"><img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2" alt="Team member 3" style="width:150px;height:150px"/></figure>
<!-- /wp:image -->

<!-- wp:heading {"textAlign":"center","level":3} -->
<h3 class="wp-block-heading has-text-align-center">Sarah Wilson</h3>
<!-- /wp:heading -->

<!-- wp:paragraph {"align":"center"} -->
<p class="has-text-align-center"><strong>Head of Marketing</strong></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"align":"center"} -->
<p class="has-text-align-center">Connecting with audiences and building meaningful relationships.</p>
<!-- /wp:paragraph --></div>
<!-- /wp:group --></div>
<!-- /wp:elayne/slide --></div>
<!-- /wp:elayne/carousel -->',
				)
			);
			// Pattern 6: Mega Menu - Three Column Layout
			register_block_pattern(
				'elayne-blocks/mega-menu-three-column',
				array(
					'title'       => __( 'Mega Menu - Three Column Layout', 'elayne-blocks' ),
					'description' => __( 'Three column mega menu with sections and items, perfect for organized navigation.', 'elayne-blocks' ),
					'categories'  => array( 'elayne-blocks' ),
					'content'     => '<!-- wp:elayne/mega-menu-column {"width":"1/3"} -->
<div class="wp-block-elayne-mega-menu-column width-1-3 align-top"><!-- wp:elayne/mega-menu-section {"heading":"Products","iconName":"cart"} -->
<div class="wp-block-elayne-mega-menu-section"><div class="wp-block-elayne-mega-menu-section__header"><span class="dashicons dashicons-cart"></span><h3 class="wp-block-elayne-mega-menu-section__heading">Products</h3></div><div class="wp-block-elayne-mega-menu-section__content"><!-- wp:elayne/mega-menu-item {"label":"All Products","linkUrl":"/products"} -->
<div class="wp-block-elayne-mega-menu-item"><a class="wp-block-elayne-mega-menu-item__link" href="/products" target="_self"><div class="wp-block-elayne-mega-menu-item__content"><div class="wp-block-elayne-mega-menu-item__header"><span class="wp-block-elayne-mega-menu-item__label">All Products</span></div></div></a></div>
<!-- /wp:elayne/mega-menu-item -->

<!-- wp:elayne/mega-menu-item {"label":"New Arrivals","linkUrl":"/new","badgeText":"New","badgeStyle":"info"} -->
<div class="wp-block-elayne-mega-menu-item"><a class="wp-block-elayne-mega-menu-item__link" href="/new" target="_self"><div class="wp-block-elayne-mega-menu-item__content"><div class="wp-block-elayne-mega-menu-item__header"><span class="wp-block-elayne-mega-menu-item__label">New Arrivals</span><span class="wp-block-elayne-mega-menu-item__badge badge-info">New</span></div></div></a></div>
<!-- /wp:elayne/mega-menu-item -->

<!-- wp:elayne/mega-menu-item {"label":"Best Sellers","linkUrl":"/bestsellers","iconName":"star-filled"} -->
<div class="wp-block-elayne-mega-menu-item"><a class="wp-block-elayne-mega-menu-item__link" href="/bestsellers" target="_self"><span class="dashicons dashicons-star-filled"></span><div class="wp-block-elayne-mega-menu-item__content"><div class="wp-block-elayne-mega-menu-item__header"><span class="wp-block-elayne-mega-menu-item__label">Best Sellers</span></div></div></a></div>
<!-- /wp:elayne/mega-menu-item --></div></div>
<!-- /wp:elayne/mega-menu-section --></div>
<!-- /wp:elayne/mega-menu-column -->

<!-- wp:elayne/mega-menu-column {"width":"1/3"} -->
<div class="wp-block-elayne-mega-menu-column width-1-3 align-top"><!-- wp:elayne/mega-menu-section {"heading":"Categories","iconName":"category"} -->
<div class="wp-block-elayne-mega-menu-section"><div class="wp-block-elayne-mega-menu-section__header"><span class="dashicons dashicons-category"></span><h3 class="wp-block-elayne-mega-menu-section__heading">Categories</h3></div><div class="wp-block-elayne-mega-menu-section__content"><!-- wp:elayne/mega-menu-item {"label":"Electronics","linkUrl":"/electronics"} -->
<div class="wp-block-elayne-mega-menu-item"><a class="wp-block-elayne-mega-menu-item__link" href="/electronics" target="_self"><div class="wp-block-elayne-mega-menu-item__content"><div class="wp-block-elayne-mega-menu-item__header"><span class="wp-block-elayne-mega-menu-item__label">Electronics</span></div></div></a></div>
<!-- /wp:elayne/mega-menu-item -->

<!-- wp:elayne/mega-menu-item {"label":"Clothing","linkUrl":"/clothing"} -->
<div class="wp-block-elayne-mega-menu-item"><a class="wp-block-elayne-mega-menu-item__link" href="/clothing" target="_self"><div class="wp-block-elayne-mega-menu-item__content"><div class="wp-block-elayne-mega-menu-item__header"><span class="wp-block-elayne-mega-menu-item__label">Clothing</span></div></div></a></div>
<!-- /wp:elayne/mega-menu-item -->

<!-- wp:elayne/mega-menu-item {"label":"Home & Garden","linkUrl":"/home"} -->
<div class="wp-block-elayne-mega-menu-item"><a class="wp-block-elayne-mega-menu-item__link" href="/home" target="_self"><div class="wp-block-elayne-mega-menu-item__content"><div class="wp-block-elayne-mega-menu-item__header"><span class="wp-block-elayne-mega-menu-item__label">Home &amp; Garden</span></div></div></a></div>
<!-- /wp:elayne/mega-menu-item --></div></div>
<!-- /wp:elayne/mega-menu-section --></div>
<!-- /wp:elayne/mega-menu-column -->

<!-- wp:elayne/mega-menu-column {"width":"1/3"} -->
<div class="wp-block-elayne-mega-menu-column width-1-3 align-top"><!-- wp:elayne/mega-menu-section {"heading":"Support","iconName":"sos"} -->
<div class="wp-block-elayne-mega-menu-section"><div class="wp-block-elayne-mega-menu-section__header"><span class="dashicons dashicons-sos"></span><h3 class="wp-block-elayne-mega-menu-section__heading">Support</h3></div><div class="wp-block-elayne-mega-menu-section__content"><!-- wp:elayne/mega-menu-item {"label":"Help Center","linkUrl":"/help"} -->
<div class="wp-block-elayne-mega-menu-item"><a class="wp-block-elayne-mega-menu-item__link" href="/help" target="_self"><div class="wp-block-elayne-mega-menu-item__content"><div class="wp-block-elayne-mega-menu-item__header"><span class="wp-block-elayne-mega-menu-item__label">Help Center</span></div></div></a></div>
<!-- /wp:elayne/mega-menu-item -->

<!-- wp:elayne/mega-menu-item {"label":"Contact Us","linkUrl":"/contact"} -->
<div class="wp-block-elayne-mega-menu-item"><a class="wp-block-elayne-mega-menu-item__link" href="/contact" target="_self"><div class="wp-block-elayne-mega-menu-item__content"><div class="wp-block-elayne-mega-menu-item__header"><span class="wp-block-elayne-mega-menu-item__label">Contact Us</span></div></div></a></div>
<!-- /wp:elayne/mega-menu-item -->

<!-- wp:elayne/mega-menu-item {"label":"FAQ","linkUrl":"/faq"} -->
<div class="wp-block-elayne-mega-menu-item"><a class="wp-block-elayne-mega-menu-item__link" href="/faq" target="_self"><div class="wp-block-elayne-mega-menu-item__content"><div class="wp-block-elayne-mega-menu-item__header"><span class="wp-block-elayne-mega-menu-item__label">FAQ</span></div></div></a></div>
<!-- /wp:elayne/mega-menu-item --></div></div>
<!-- /wp:elayne/mega-menu-section --></div>
<!-- /wp:elayne/mega-menu-column -->',
				)
			);

			// Pattern 7: Mega Menu - Featured Product Layout
			register_block_pattern(
				'elayne-blocks/mega-menu-featured',
				array(
					'title'       => __( 'Mega Menu - Featured Product', 'elayne-blocks' ),
					'description' => __( 'Two column layout with product links and featured content area.', 'elayne-blocks' ),
					'categories'  => array( 'elayne-blocks' ),
					'content'     => '<!-- wp:elayne/mega-menu-column {"width":"2/3"} -->
<div class="wp-block-elayne-mega-menu-column width-2-3 align-top"><!-- wp:elayne/mega-menu-section {"heading":"Shop by Category"} -->
<div class="wp-block-elayne-mega-menu-section"><div class="wp-block-elayne-mega-menu-section__header"><h3 class="wp-block-elayne-mega-menu-section__heading">Shop by Category</h3></div><div class="wp-block-elayne-mega-menu-section__content"><!-- wp:elayne/mega-menu-item {"label":"Women\'s Fashion","iconName":"admin-users","linkUrl":"/womens"} -->
<div class="wp-block-elayne-mega-menu-item"><a class="wp-block-elayne-mega-menu-item__link" href="/womens" target="_self"><span class="dashicons dashicons-admin-users"></span><div class="wp-block-elayne-mega-menu-item__content"><div class="wp-block-elayne-mega-menu-item__header"><span class="wp-block-elayne-mega-menu-item__label">Women\'s Fashion</span></div></div></a></div>
<!-- /wp:elayne/mega-menu-item -->

<!-- wp:elayne/mega-menu-item {"label":"Men\'s Fashion","iconName":"admin-users","linkUrl":"/mens"} -->
<div class="wp-block-elayne-mega-menu-item"><a class="wp-block-elayne-mega-menu-item__link" href="/mens" target="_self"><span class="dashicons dashicons-admin-users"></span><div class="wp-block-elayne-mega-menu-item__content"><div class="wp-block-elayne-mega-menu-item__header"><span class="wp-block-elayne-mega-menu-item__label">Men\'s Fashion</span></div></div></a></div>
<!-- /wp:elayne/mega-menu-item -->

<!-- wp:elayne/mega-menu-item {"label":"Accessories","iconName":"star-filled","linkUrl":"/accessories","badgeText":"Sale","badgeStyle":"danger"} -->
<div class="wp-block-elayne-mega-menu-item"><a class="wp-block-elayne-mega-menu-item__link" href="/accessories" target="_self"><span class="dashicons dashicons-star-filled"></span><div class="wp-block-elayne-mega-menu-item__content"><div class="wp-block-elayne-mega-menu-item__header"><span class="wp-block-elayne-mega-menu-item__label">Accessories</span><span class="wp-block-elayne-mega-menu-item__badge badge-danger">Sale</span></div></div></a></div>
<!-- /wp:elayne/mega-menu-item --></div></div>
<!-- /wp:elayne/mega-menu-section --></div>
<!-- /wp:elayne/mega-menu-column -->

<!-- wp:elayne/mega-menu-column {"width":"1/3","backgroundColor":"#f5f5f5"} -->
<div class="wp-block-elayne-mega-menu-column width-1-3 align-top" style="background-color:#f5f5f5;color:"><!-- wp:heading {"level":4} -->
<h4 class="wp-block-heading">Featured This Week</h4>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>Check out our latest collection with exclusive items.</p>
<!-- /wp:paragraph -->

<!-- wp:buttons -->
<div class="wp-block-buttons"><!-- wp:button -->
<div class="wp-block-button"><a class="wp-block-button__link wp-element-button" href="/featured">Shop Now</a></div>
<!-- /wp:button --></div>
<!-- /wp:buttons --></div>
<!-- /wp:elayne/mega-menu-column -->',
				)
			);
		}
	},
	15
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

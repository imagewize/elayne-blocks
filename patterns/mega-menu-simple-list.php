<?php
/**
 * Title: Mega Menu - Simple List
 * Slug: elayne-blocks/mega-menu-simple-list
 * Categories: elayne-blocks
 * Block Types: core/template-part
 * Description: Clean two column list of links
 */
?>
<!-- wp:columns {"style":{"spacing":{"blockGap":{"left":"var:preset|spacing|large"},"padding":{"top":"var:preset|spacing|medium","bottom":"var:preset|spacing|medium","left":"var:preset|spacing|medium","right":"var:preset|spacing|medium"}}}} -->
<div class="wp-block-columns" style="padding-top:var(--wp--preset--spacing--medium);padding-right:var(--wp--preset--spacing--medium);padding-bottom:var(--wp--preset--spacing--medium);padding-left:var(--wp--preset--spacing--medium)"><!-- wp:column -->
<div class="wp-block-column"><!-- wp:group {"style":{"spacing":{"blockGap":"var:preset|spacing|small"}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group"><!-- wp:heading {"level":3,"fontSize":"medium"} -->
<h3 class="wp-block-heading has-medium-font-size">Company</h3>
<!-- /wp:heading -->

<!-- wp:separator {"className":"is-style-wide"} -->
<hr class="wp-block-separator has-alpha-channel-opacity is-style-wide"/>
<!-- /wp:separator -->

<!-- wp:list {"style":{"spacing":{"padding":{"left":"0"},"blockGap":"var:preset|spacing|x-small","margin":{"top":"var:preset|spacing|small"}},"elements":{"link":{"color":{"text":"var:preset|color|contrast"}}}},"className":"is-style-list-plain-no-indent"} -->
<ul style="margin-top:var(--wp--preset--spacing--small);padding-left:0" class="is-style-list-plain-no-indent has-link-color"><!-- wp:list-item -->
<li><a href="#">About Us</a></li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li><a href="#">Our Team</a></li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li><a href="#">Careers</a></li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li><a href="#">Press</a></li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li><a href="#">Blog</a></li>
<!-- /wp:list-item --></ul>
<!-- /wp:list --></div>
<!-- /wp:group --></div>
<!-- /wp:column -->

<!-- wp:column -->
<div class="wp-block-column"><!-- wp:group {"style":{"spacing":{"blockGap":"var:preset|spacing|small"}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group"><!-- wp:heading {"level":3,"fontSize":"medium"} -->
<h3 class="wp-block-heading has-medium-font-size">Support</h3>
<!-- /wp:heading -->

<!-- wp:separator {"className":"is-style-wide"} -->
<hr class="wp-block-separator has-alpha-channel-opacity is-style-wide"/>
<!-- /wp:separator -->

<!-- wp:list {"style":{"spacing":{"padding":{"left":"0"},"blockGap":"var:preset|spacing|x-small","margin":{"top":"var:preset|spacing|small"}},"elements":{"link":{"color":{"text":"var:preset|color|contrast"}}}},"className":"is-style-list-plain-no-indent"} -->
<ul style="margin-top:var(--wp--preset--spacing--small);padding-left:0" class="is-style-list-plain-no-indent has-link-color"><!-- wp:list-item -->
<li><a href="#">Contact</a></li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li><a href="#">Support</a></li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li><a href="#">FAQ</a></li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li><a href="#">Privacy Policy</a></li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li><a href="#">Terms of Service</a></li>
<!-- /wp:list-item --></ul>
<!-- /wp:list --></div>
<!-- /wp:group --></div>
<!-- /wp:column --></div>
<!-- /wp:columns -->

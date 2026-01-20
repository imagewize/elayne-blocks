<?php
/**
 * Title: Mega Menu - Featured Content
 * Slug: elayne-blocks/mega-menu-featured-content
 * Categories: elayne-blocks
 * Block Types: core/template-part
 * Description: Two column layout with featured image and links
 */
?>
<!-- wp:group {"align":"wide","style":{"spacing":{"padding":{"top":"var:preset|spacing|medium","bottom":"var:preset|spacing|medium","left":"var:preset|spacing|medium","right":"var:preset|spacing|medium"}}},"layout":{"type":"grid","columnCount":null,"minimumColumnWidth":"18rem"}} -->
<div class="wp-block-group alignwide" style="padding-top:var(--wp--preset--spacing--medium);padding-right:var(--wp--preset--spacing--medium);padding-bottom:var(--wp--preset--spacing--medium);padding-left:var(--wp--preset--spacing--medium)"><!-- wp:group {"style":{"spacing":{"blockGap":"var:preset|spacing|small"}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group"><!-- wp:heading {"level":3,"fontSize":"medium"} -->
<h3 class="wp-block-heading has-medium-font-size">Shop by Category</h3>
<!-- /wp:heading -->

<!-- wp:separator {"className":"is-style-wide","style":{"color":{"background":"var:preset|color|contrast-2"}}} -->
<hr class="wp-block-separator has-background is-style-wide" style="background-color:var(--wp--preset--color--contrast-2);opacity:0.2"/>
<!-- /wp:separator -->

<!-- wp:list {"style":{"spacing":{"padding":{"left":"0"},"blockGap":"var:preset|spacing|x-small","margin":{"top":"var:preset|spacing|small"}},"elements":{"link":{"color":{"text":"var:preset|color|contrast"}}}},"className":"is-style-list-plain-no-indent"} -->
<ul style="margin-top:var(--wp--preset--spacing--small);padding-left:0" class="is-style-list-plain-no-indent has-link-color"><!-- wp:list-item -->
<li><a href="#">Women's Fashion</a></li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li><a href="#">Men's Fashion</a></li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li><a href="#">Accessories</a></li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li><a href="#">New Arrivals</a></li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li><a href="#">Sale</a></li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li><a href="#">Collections</a></li>
<!-- /wp:list-item --></ul>
<!-- /wp:list --></div>
<!-- /wp:group -->

<!-- wp:group {"style":{"spacing":{"blockGap":"var:preset|spacing|small","padding":{"top":"var:preset|spacing|small","bottom":"var:preset|spacing|small","left":"var:preset|spacing|small","right":"var:preset|spacing|small"}},"border":{"radius":"12px","width":"1px"}},"borderColor":"contrast-2","layout":{"type":"constrained"}} -->
<div class="wp-block-group has-border-color has-contrast-2-border-color" style="border-width:1px;border-radius:12px;padding-top:var(--wp--preset--spacing--small);padding-right:var(--wp--preset--spacing--small);padding-bottom:var(--wp--preset--spacing--small);padding-left:var(--wp--preset--spacing--small)"><!-- wp:heading {"level":4,"fontSize":"medium"} -->
<h4 class="wp-block-heading has-medium-font-size">Featured This Week</h4>
<!-- /wp:heading -->

<!-- wp:image {"sizeSlug":"medium","style":{"border":{"radius":"8px"}}} -->
<figure class="wp-block-image size-medium has-custom-border"><img src="https://placehold.co/300x200" alt="Featured product" style="border-radius:8px"/></figure>
<!-- /wp:image -->

<!-- wp:buttons -->
<div class="wp-block-buttons"><!-- wp:button {"width":100} -->
<div class="wp-block-button has-custom-width wp-block-button__width-100"><a class="wp-block-button__link wp-element-button">Shop Now</a></div>
<!-- /wp:button --></div>
<!-- /wp:buttons --></div>
<!-- /wp:group --></div>
<!-- /wp:group -->

/**
 * Carousel Block - Frontend Initialization
 * Initializes Slick Carousel with advanced features including thumbnail navigation
 */
(function($) {
    $(document).ready(function() {
        $('.wp-block-elayne-carousel').each(function() {
            const $slider = $(this);
            const hasThumbnails = $slider.data('thumbnails') === true
                || $slider.data('thumbnails') === 'true';

            // Apply CSS variables for arrow and dot colors
            $slider.css({
                '--arrow-color': $slider.data('arrow-color'),
                '--arrow-background': $slider.data('arrow-background'),
                '--arrow-hover-color': $slider.data('arrow-hover-color'),
                '--arrow-hover-background': $slider.data('arrow-hover-background'),
                '--dots-bottom': $slider.data('dots-bottom')
            });

            // Apply arrow size if specified
            const arrowSize = $slider.data('arrow-size');
            if (arrowSize) {
                $slider.find('.slick-prev, .slick-next').css({
                    width: arrowSize + 'px',
                    height: arrowSize + 'px'
                });
            }

            // Get Slick settings
            const slickSettings = JSON.parse($slider.attr('data-slick'));

            // Handle thumbnail navigation
            if (hasThumbnails) {
                const thumbnailsToShow = parseInt($slider.data('thumbnails-to-show')) || 4;
                const thumbnailPosition = $slider.data('thumbnail-position') || 'below';

                // Create thumbnail container
                const $thumbnailWrapper = $('<div class="carousel-thumbnails-wrapper"></div>');
                const $thumbnailSlider = $('<div class="carousel-thumbnails"></div>');

                // Clone slides for thumbnails (use first image from each slide)
                $slider.find('.wp-block-elayne-slide').each(function(index) {
                    const $slide = $(this);
                    const $img = $slide.find('img').first();
                    const $thumbnail = $('<div class="carousel-thumbnail"></div>');

                    if ($img.length) {
                        // Clone the image for thumbnail
                        const $thumbImg = $img.clone();
                        $thumbnail.append($thumbImg);
                    } else {
                        // Fallback: use slide number
                        $thumbnail.html('<span>' + (index + 1) + '</span>');
                    }

                    $thumbnailSlider.append($thumbnail);
                });

                $thumbnailWrapper.append($thumbnailSlider);

                // Insert thumbnails based on position
                if (thumbnailPosition === 'above') {
                    $slider.before($thumbnailWrapper);
                } else if (thumbnailPosition === 'left') {
                    const $container = $('<div class="carousel-with-thumbnails carousel-thumbnails-left"></div>');
                    $slider.wrap($container);
                    $slider.before($thumbnailWrapper);
                } else if (thumbnailPosition === 'right') {
                    const $container = $('<div class="carousel-with-thumbnails carousel-thumbnails-right"></div>');
                    $slider.wrap($container);
                    $slider.after($thumbnailWrapper);
                } else {
                    // Default: below
                    $slider.after($thumbnailWrapper);
                }

                // Initialize main carousel
                $slider.slick(slickSettings);

                // Initialize thumbnail carousel
                const isVertical = thumbnailPosition === 'left' || thumbnailPosition === 'right';
                $thumbnailSlider.slick({
                    slidesToShow: isVertical ? Math.min(thumbnailsToShow, 5) : thumbnailsToShow,
                    slidesToScroll: 1,
                    asNavFor: $slider,
                    dots: false,
                    arrows: true,
                    centerMode: false,
                    focusOnSelect: true,
                    vertical: isVertical,
                    verticalSwiping: isVertical,
                    infinite: slickSettings.infinite || false
                });

                // Sync both carousels
                $slider.on('afterChange', function(event, slick, currentSlide) {
                    $thumbnailSlider.slick('slickGoTo', currentSlide);
                });
            } else {
                // Initialize carousel without thumbnails
                $slider.slick(slickSettings);
            }

            // Load SVG arrows for all arrow styles
            const customArrowSvg = $slider.data('custom-arrow-svg');
            const arrowStyle = $slider.data('arrow-style');

            // Wait for Slick to create arrow buttons
            setTimeout(function() {
                const $prevArrow = $slider.find('.slick-prev');
                const $nextArrow = $slider.find('.slick-next');

                if ($prevArrow.length && $nextArrow.length) {
                    // SVG arrow files mapping
                    const arrowSvgs = {
                        'chevron': elayneBlocksData.pluginUrl + 'blocks/carousel/src/arrows/chevron.svg',
                        'caret': elayneBlocksData.pluginUrl + 'blocks/carousel/src/arrows/caret.svg',
                        'arrow': elayneBlocksData.pluginUrl + 'blocks/carousel/src/arrows/arrow.svg'
                    };

                    if (arrowStyle === 'custom' && customArrowSvg) {
                        // Use custom SVG code
                        $prevArrow.html(customArrowSvg);
                        $nextArrow.html(customArrowSvg);
                        $prevArrow.find('svg').css('color', 'currentColor');
                        $nextArrow.find('svg').css('color', 'currentColor');
                    } else if (arrowSvgs[arrowStyle]) {
                        // Load SVG file for built-in arrow styles
                        $.get(arrowSvgs[arrowStyle], function(svgData) {
                            const $svg = $(svgData).find('svg');
                            $svg.attr('class', 'carousel-arrow-svg');

                            // Clone for both arrows
                            $prevArrow.html($svg.clone());
                            $nextArrow.html($svg.clone());

                            // Flip the next arrow horizontally while preserving centering
                            $nextArrow.find('svg').css('transform', 'translate(-50%, -50%) scaleX(-1)');
                        });
                    }
                }
            }, 100);

            // Apply arrow size after Slick initialization
            if (arrowSize) {
                setTimeout(function() {
                    $slider.find('.slick-prev, .slick-next').css({
                        width: arrowSize + 'px',
                        height: arrowSize + 'px'
                    });
                }, 100);
            }
        });
    });
})(jQuery);

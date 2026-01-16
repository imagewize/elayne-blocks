import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import classnames from 'classnames';

export default function save({ attributes }) {
    const {
        slidesToShow,
        slidesToScroll,
        arrows,
        dots,
        infinite,
        autoplay,
        autoplaySpeed,
        speed,
        rtl,
        responsiveWidth,
        responsiveSlides,
        responsiveSlidesToScroll,
        slidePadding,
        arrowColor,
        arrowBackground,
        arrowHoverColor,
        arrowHoverBackground,
        dotsBottomSpacing,
        adaptiveHeight,
        enableThumbnails,
        thumbnailsToShow,
        thumbnailPosition,
        centerMode,
        centerPadding,
        variableWidth,
        lazyLoad
    } = attributes;

    const slickSettings = {
        slidesToShow: centerMode ? 1 : parseInt(slidesToShow),
        slidesToScroll: parseInt(slidesToScroll),
        arrows,
        dots,
        infinite,
        autoplay,
        autoplaySpeed: parseInt(autoplaySpeed),
        speed: parseInt(speed),
        rtl,
        adaptiveHeight,
        centerMode,
        centerPadding: centerMode ? centerPadding : '50px',
        variableWidth,
        lazyLoad: lazyLoad !== 'off' ? lazyLoad : undefined,
        responsive: [{
            breakpoint: parseInt(responsiveWidth) + 1,
            settings: {
                slidesToShow: parseInt(responsiveSlides),
                slidesToScroll: parseInt(responsiveSlidesToScroll),
                centerMode: false,
                variableWidth: false
            }
        }]
    };

    const getColorValue = (color) => {
        if (color?.slug) {
            return `var(--wp--preset--color--${color.slug})`;
        }
        return color?.color || color;
    };

    const blockProps = useBlockProps.save({
        className: classnames(
            'slick-slider',
            { 'cb-single-slide': slidesToShow === 1 || centerMode },
            { 'cb-padding': slidePadding },
            { 'cb-center-mode': centerMode },
            { 'cb-variable-width': variableWidth },
            { 'cb-thumbnails': enableThumbnails }
        ),
        'data-slick': JSON.stringify(slickSettings),
        'data-dots-bottom': dotsBottomSpacing,
        'data-arrow-color': getColorValue(arrowColor),
        'data-arrow-background': getColorValue(arrowBackground),
        'data-arrow-hover-color': getColorValue(arrowHoverColor),
        'data-arrow-hover-background': getColorValue(arrowHoverBackground),
        'data-thumbnails': enableThumbnails ? 'true' : undefined,
        'data-thumbnails-to-show': enableThumbnails ? thumbnailsToShow : undefined,
        'data-thumbnail-position': enableThumbnails ? thumbnailPosition : undefined,
        dir: rtl ? 'rtl' : undefined
    });

    return (
        <div {...blockProps}>
            <InnerBlocks.Content />
        </div>
    );
}
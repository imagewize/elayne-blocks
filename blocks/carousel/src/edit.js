import {
    useBlockProps,
    InnerBlocks,
    InspectorControls,
    withColors,
    __experimentalColorGradientSettingsDropdown as ColorGradientSettingsDropdown,
    __experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients
} from '@wordpress/block-editor';
import { PanelBody, RangeControl, ToggleControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import classnames from 'classnames';
import { compose } from '@wordpress/compose';
import { withSelect } from '@wordpress/data';

const ALLOWED_BLOCKS = ['elayne/slide'];

/**
 * Edit component for the Carousel Block
 *
 * Note: This component uses experimental WordPress features:
 * - __experimentalColorGradientSettingsDropdown
 * - __experimentalUseMultipleOriginColorsAndGradients
 * These features might change or be removed in future WordPress versions.
 */
const Edit = compose(
    withColors('arrowColor', 'arrowBackground', 'arrowHoverColor', 'arrowHoverBackground'),
    withSelect((select) => {
        const settings = select('core/block-editor').getSettings();
        return {
            colors: settings.colors || [],
        };
    })
)(function({
    attributes,
    setAttributes,
    clientId,
    arrowColor,
    setArrowColor,
    arrowBackground,
    setArrowBackground,
    arrowHoverColor,
    setArrowHoverColor,
    arrowHoverBackground,
    setArrowHoverBackground
}) {
    const {
        slidesToShow,
        slidesToScroll,
        speed,
        arrows,
        dots,
        infinite,
        autoplay,
        autoplaySpeed,
        rtl,
        responsiveWidth,
        responsiveSlides,
        responsiveSlidesToScroll,
        slides,
        slidePadding,
        adaptiveHeight,
        arrowColor: arrowColorAttr,
        arrowBackground: arrowBackgroundAttr,
        arrowHoverColor: arrowHoverColorAttr,
        arrowHoverBackground: arrowHoverBackgroundAttr,
    } = attributes;

    const slideCount = useSelect(
        (select) => select('core/block-editor').getBlock(clientId).innerBlocks.length
    );

    const blockProps = useBlockProps({
        className: classnames(
            `cb-shows-${slidesToShow}-slides`,
            `cb-responsive-${responsiveSlides}-slides`,
            { 'cb-padding': slidePadding },
            slideCount + 1 > slidesToShow ? 'cb-show-scrollbar' : 'cb-hide-scrollbar'
        ),
    });

    const placeholder = (
        <div className="cb-carousel-placeholder">
            {__('Click plus (+) to add slides', 'elayne-blocks')}
        </div>
    );

    const colorGradientSettings = useMultipleOriginColorsAndGradients();

    const onArrowColorChange = (color) => {
        setArrowColor(color);
        setAttributes({ arrowColor: color });
    };

    const onArrowBackgroundChange = (color) => {
        setArrowBackground(color);
        setAttributes({ arrowBackground: color });
    };

    const onArrowHoverColorChange = (color) => {
        setArrowHoverColor(color);
        setAttributes({ arrowHoverColor: color });
    };

    const onArrowHoverBackgroundChange = (color) => {
        setArrowHoverBackground(color);
        setAttributes({ arrowHoverBackground: color });
    };

    return (
        <Fragment>
            <InspectorControls group="color">
                {arrows && (
                    <>
                        <ColorGradientSettingsDropdown
                            panelId={clientId}
                            settings={[
                                {
                                    label: __('Arrow Color', 'elayne-blocks'),
                                    colorValue: arrowColor?.color || arrowColorAttr,
                                    onColorChange: onArrowColorChange
                                },
                                {
                                    label: __('Arrow Background', 'elayne-blocks'),
                                    colorValue: arrowBackground?.color || arrowBackgroundAttr,
                                    onColorChange: onArrowBackgroundChange
                                },
                                {
                                    label: __('Arrow Hover Color', 'elayne-blocks'),
                                    colorValue: arrowHoverColor?.color || arrowHoverColorAttr,
                                    onColorChange: onArrowHoverColorChange
                                },
                                {
                                    label: __('Arrow Hover Background', 'elayne-blocks'),
                                    colorValue: arrowHoverBackground?.color || arrowHoverBackgroundAttr,
                                    onColorChange: onArrowHoverBackgroundChange
                                }
                            ]}
                            {...colorGradientSettings}
                        />
                    </>
                )}
            </InspectorControls>
            <InspectorControls>
                <PanelBody title={__('Carousel Settings', 'elayne-blocks')} initialOpen={true}>
                    <RangeControl
                        label={__('Slides to Show', 'elayne-blocks')}
                        value={slidesToShow}
                        onChange={(value) => setAttributes({ slidesToShow: value })}
                        min={1}
                        max={10}
                    />
                    <RangeControl
                        label={__('Slides to Scroll', 'elayne-blocks')}
                        value={slidesToScroll}
                        onChange={(value) => setAttributes({ slidesToScroll: value })}
                        min={1}
                        max={10}
                    />
                    <RangeControl
                        label={__('Animation Speed (ms)', 'elayne-blocks')}
                        value={speed}
                        onChange={(value) => setAttributes({ speed: value })}
                        min={100}
                        max={3000}
                        step={100}
                    />
                    <ToggleControl
                        label={__('Show Arrows', 'elayne-blocks')}
                        checked={arrows}
                        onChange={(value) => setAttributes({ arrows: value })}
                    />
                    <ToggleControl
                        label={__('Show Dots', 'elayne-blocks')}
                        checked={dots}
                        onChange={(value) => setAttributes({ dots: value })}
                    />
                    {dots && (
                        <RangeControl
                            label={__('Dots Bottom Spacing', 'elayne-blocks')}
                            value={parseInt(attributes.dotsBottomSpacing)}
                            onChange={(value) => setAttributes({ dotsBottomSpacing: `${value}px` })}
                            min={-100}
                            max={100}
                            step={1}
                        />
                    )}
                    <ToggleControl
                        label={__('Infinite Loop', 'elayne-blocks')}
                        checked={infinite}
                        onChange={(value) => setAttributes({ infinite: value })}
                    />
                    <ToggleControl
                        label={__('Autoplay', 'elayne-blocks')}
                        checked={autoplay}
                        onChange={(value) => setAttributes({ autoplay: value })}
                    />
                    {autoplay && (
                        <RangeControl
                            label={__('Autoplay Speed (ms)', 'elayne-blocks')}
                            value={autoplaySpeed}
                            onChange={(value) => setAttributes({ autoplaySpeed: value })}
                            min={1000}
                            max={10000}
                            step={500}
                        />
                    )}
                    <ToggleControl
                        label={__('RTL Mode', 'elayne-blocks')}
                        checked={rtl}
                        onChange={(value) => setAttributes({ rtl: value })}
                    />
                    <RangeControl
                        label={__('Total Slides', 'elayne-blocks')}
                        value={slides}
                        onChange={(value) => setAttributes({ slides: value })}
                        min={1}
                        max={20}
                    />
                    <ToggleControl
                        label={__('Enable Slide Padding', 'elayne-blocks')}
                        checked={slidePadding}
                        onChange={(value) => setAttributes({ slidePadding: value })}
                    />
                    <ToggleControl
                        label={__('Adaptive Height', 'elayne-blocks')}
                        help={__('Adjust carousel height to match the current slide height', 'elayne-blocks')}
                        checked={adaptiveHeight}
                        onChange={(value) => setAttributes({ adaptiveHeight: value })}
                    />
                </PanelBody>
                <PanelBody title={__('Responsive Settings', 'elayne-blocks')} initialOpen={false}>
                    <RangeControl
                        label={__('Breakpoint Width (px)', 'elayne-blocks')}
                        value={responsiveWidth}
                        onChange={(value) => setAttributes({ responsiveWidth: value })}
                        min={320}
                        max={1200}
                        step={1}
                    />
                    <RangeControl
                        label={__('Slides to Show (Mobile)', 'elayne-blocks')}
                        value={responsiveSlides}
                        onChange={(value) => setAttributes({ responsiveSlides: value })}
                        min={1}
                        max={5}
                    />
                    <RangeControl
                        label={__('Slides to Scroll (Mobile)', 'elayne-blocks')}
                        value={responsiveSlidesToScroll}
                        onChange={(value) => setAttributes({ responsiveSlidesToScroll: value })}
                        min={1}
                        max={5}
                    />
                </PanelBody>
            </InspectorControls>
            <div {...blockProps}>
                <InnerBlocks
                    orientation="horizontal"
                    allowedBlocks={ALLOWED_BLOCKS}
                    templateLock={false}
                    renderAppender={InnerBlocks.ButtonBlockAppender}
                    placeholder={placeholder}
                />
            </div>
        </Fragment>
    );
});

export default Edit;

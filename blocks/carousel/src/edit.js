import {
    useBlockProps,
    InnerBlocks,
    InspectorControls,
    BlockControls,
    withColors,
    __experimentalColorGradientSettingsDropdown as ColorGradientSettingsDropdown,
    __experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients
} from '@wordpress/block-editor';
import { PanelBody, RangeControl, ToggleControl, SelectControl, ToolbarGroup, ToolbarButton, TextareaControl } from '@wordpress/components';
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
        enableThumbnails,
        thumbnailsToShow,
        thumbnailPosition,
        thumbnailSpacing,
        centerMode,
        centerPadding,
        variableWidth,
        lazyLoad,
        arrowColor: arrowColorAttr,
        arrowBackground: arrowBackgroundAttr,
        arrowHoverColor: arrowHoverColorAttr,
        arrowHoverBackground: arrowHoverBackgroundAttr,
        arrowStyle,
        arrowBackgroundStyle,
        arrowSize,
        customArrowSvg,
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
            <BlockControls>
                <ToolbarGroup>
                    <ToolbarButton
                        icon="image-flip-horizontal"
                        label={__('Center Mode', 'elayne-blocks')}
                        isPressed={centerMode}
                        onClick={() => setAttributes({ centerMode: !centerMode })}
                    />
                    <ToolbarButton
                        icon="images-alt2"
                        label={__('Thumbnail Navigation', 'elayne-blocks')}
                        isPressed={enableThumbnails}
                        onClick={() => setAttributes({ enableThumbnails: !enableThumbnails })}
                    />
                    <ToolbarButton
                        icon="slides"
                        label={__('Variable Width', 'elayne-blocks')}
                        isPressed={variableWidth}
                        onClick={() => setAttributes({ variableWidth: !variableWidth })}
                    />
                </ToolbarGroup>
            </BlockControls>
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
                <PanelBody title={__('Layout', 'elayne-blocks')} initialOpen={true}>
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
                    {centerMode && (
                        <RangeControl
                            label={__('Center Padding', 'elayne-blocks')}
                            help={__('Amount of adjacent slides visible', 'elayne-blocks')}
                            value={parseInt(centerPadding)}
                            onChange={(value) => setAttributes({ centerPadding: `${value}px` })}
                            min={0}
                            max={200}
                            step={10}
                        />
                    )}
                    {enableThumbnails && (
                        <>
                            <RangeControl
                                label={__('Thumbnails to Show', 'elayne-blocks')}
                                value={thumbnailsToShow}
                                onChange={(value) => setAttributes({ thumbnailsToShow: value })}
                                min={2}
                                max={10}
                            />
                            <SelectControl
                                label={__('Thumbnail Position', 'elayne-blocks')}
                                value={thumbnailPosition}
                                options={[
                                    { label: __('Below', 'elayne-blocks'), value: 'below' },
                                    { label: __('Above', 'elayne-blocks'), value: 'above' },
                                    { label: __('Left', 'elayne-blocks'), value: 'left' },
                                    { label: __('Right', 'elayne-blocks'), value: 'right' }
                                ]}
                                onChange={(value) => setAttributes({ thumbnailPosition: value })}
                            />
                            <RangeControl
                                label={__('Thumbnail Spacing', 'elayne-blocks')}
                                value={parseInt(thumbnailSpacing)}
                                onChange={(value) => setAttributes({ thumbnailSpacing: `${value}px` })}
                                min={0}
                                max={100}
                                step={5}
                            />
                        </>
                    )}
                </PanelBody>
                <PanelBody title={__('Behavior', 'elayne-blocks')} initialOpen={false}>
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
                        label={__('Infinite Loop', 'elayne-blocks')}
                        checked={infinite}
                        onChange={(value) => setAttributes({ infinite: value })}
                    />
                    <RangeControl
                        label={__('Animation Speed (ms)', 'elayne-blocks')}
                        value={speed}
                        onChange={(value) => setAttributes({ speed: value })}
                        min={100}
                        max={3000}
                        step={100}
                    />
                    <SelectControl
                        label={__('Lazy Loading', 'elayne-blocks')}
                        help={__('Improves performance for image-heavy carousels', 'elayne-blocks')}
                        value={lazyLoad}
                        options={[
                            { label: __('Disabled', 'elayne-blocks'), value: 'off' },
                            { label: __('On Demand', 'elayne-blocks'), value: 'ondemand' },
                            { label: __('Progressive', 'elayne-blocks'), value: 'progressive' }
                        ]}
                        onChange={(value) => setAttributes({ lazyLoad: value })}
                    />
                    <ToggleControl
                        label={__('Adaptive Height', 'elayne-blocks')}
                        help={__('Auto-adjust height to match active slide', 'elayne-blocks')}
                        checked={adaptiveHeight}
                        onChange={(value) => setAttributes({ adaptiveHeight: value })}
                    />
                </PanelBody>
                <PanelBody title={__('Navigation', 'elayne-blocks')} initialOpen={false}>
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
                </PanelBody>
                {arrows && (
                    <PanelBody title={__('Arrow Style', 'elayne-blocks')} initialOpen={false}>
                        <SelectControl
                            label={__('Arrow Icon', 'elayne-blocks')}
                            value={arrowStyle}
                            options={[
                                { label: __('Arrow (Default)', 'elayne-blocks'), value: 'arrow' },
                                { label: __('Chevron', 'elayne-blocks'), value: 'chevron' },
                                { label: __('Caret (Triangle)', 'elayne-blocks'), value: 'caret' },
                                { label: __('Custom SVG', 'elayne-blocks'), value: 'custom' }
                            ]}
                            onChange={(value) => setAttributes({ arrowStyle: value })}
                            help={__('Choose the arrow icon style - all icons are SVG-based for sharp, scalable rendering', 'elayne-blocks')}
                        />
                        {arrowStyle === 'custom' && (
                            <TextareaControl
                                label={__('Custom SVG Code', 'elayne-blocks')}
                                value={customArrowSvg}
                                onChange={(value) => setAttributes({ customArrowSvg: value })}
                                help={__('Paste SVG code for custom arrow icon', 'elayne-blocks')}
                                rows={4}
                            />
                        )}
                        <SelectControl
                            label={__('Arrow Background Shape', 'elayne-blocks')}
                            value={arrowBackgroundStyle}
                            options={[
                                { label: __('Circle', 'elayne-blocks'), value: 'circle' },
                                { label: __('Rounded Square', 'elayne-blocks'), value: 'rounded' },
                                { label: __('Square', 'elayne-blocks'), value: 'square' },
                                { label: __('None', 'elayne-blocks'), value: 'none' }
                            ]}
                            onChange={(value) => setAttributes({ arrowBackgroundStyle: value })}
                            help={__('Choose the arrow background shape', 'elayne-blocks')}
                        />
                        <RangeControl
                            label={__('Arrow Size (px)', 'elayne-blocks')}
                            value={arrowSize}
                            onChange={(value) => setAttributes({ arrowSize: value })}
                            min={20}
                            max={80}
                            step={2}
                        />
                    </PanelBody>
                )}
                <PanelBody title={__('Responsive', 'elayne-blocks')} initialOpen={false}>
                    <RangeControl
                        label={__('Mobile Breakpoint (px)', 'elayne-blocks')}
                        value={responsiveWidth}
                        onChange={(value) => setAttributes({ responsiveWidth: value })}
                        min={320}
                        max={1200}
                        step={1}
                    />
                    <RangeControl
                        label={__('Mobile: Slides to Show', 'elayne-blocks')}
                        value={responsiveSlides}
                        onChange={(value) => setAttributes({ responsiveSlides: value })}
                        min={1}
                        max={5}
                    />
                    <RangeControl
                        label={__('Mobile: Slides to Scroll', 'elayne-blocks')}
                        value={responsiveSlidesToScroll}
                        onChange={(value) => setAttributes({ responsiveSlidesToScroll: value })}
                        min={1}
                        max={5}
                    />
                </PanelBody>
                <PanelBody title={__('Advanced', 'elayne-blocks')} initialOpen={false}>
                    <RangeControl
                        label={__('Total Slides', 'elayne-blocks')}
                        help={__('Number of slide blocks to generate', 'elayne-blocks')}
                        value={slides}
                        onChange={(value) => setAttributes({ slides: value })}
                        min={1}
                        max={20}
                    />
                    <ToggleControl
                        label={__('Slide Padding', 'elayne-blocks')}
                        help={__('Add padding around slides', 'elayne-blocks')}
                        checked={slidePadding}
                        onChange={(value) => setAttributes({ slidePadding: value })}
                    />
                    <ToggleControl
                        label={__('RTL Mode', 'elayne-blocks')}
                        help={__('Right-to-left language support', 'elayne-blocks')}
                        checked={rtl}
                        onChange={(value) => setAttributes({ rtl: value })}
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

/**
 * Edit component for Mega Menu Section block
 */

import { useBlockProps, InnerBlocks, InspectorControls, RichText } from '@wordpress/block-editor';
import { PanelBody, ToggleControl, SelectControl, TextControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

// Note: IconPicker will be imported from shared location
// For now, we'll use a placeholder comment
// TODO: Import IconPicker from mega-menu block

export default function Edit({ attributes, setAttributes }) {
	const {
		heading,
		iconName,
		customSVG,
		isLinkWrapper,
		linkUrl,
		collapsibleMobile,
		headingLevel,
	} = attributes;

	const blockProps = useBlockProps({
		className: 'wp-block-elayne-mega-menu-section',
	});

	const HeadingTag = headingLevel;

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Section Settings', 'elayne-blocks')} initialOpen={true}>
					<SelectControl
						label={__('Heading Level', 'elayne-blocks')}
						value={headingLevel}
						options={[
							{ label: 'H2', value: 'h2' },
							{ label: 'H3', value: 'h3' },
							{ label: 'H4', value: 'h4' },
							{ label: 'H5', value: 'h5' },
							{ label: 'H6', value: 'h6' },
						]}
						onChange={(val) => setAttributes({ headingLevel: val })}
					/>

					<ToggleControl
						label={__('Collapsible on Mobile', 'elayne-blocks')}
						help={__('Allow users to expand/collapse section on mobile', 'elayne-blocks')}
						checked={collapsibleMobile}
						onChange={(val) => setAttributes({ collapsibleMobile: val })}
					/>
				</PanelBody>

				<PanelBody title={__('Icon', 'elayne-blocks')} initialOpen={false}>
					<TextControl
						label={__('Dashicon Name', 'elayne-blocks')}
						value={iconName}
						onChange={(val) => setAttributes({ iconName: val })}
						placeholder="admin-home"
						help={__('Enter a Dashicon name (e.g., admin-home, star-filled)', 'elayne-blocks')}
					/>
					{/* TODO: Replace with IconPicker component */}
				</PanelBody>

				<PanelBody title={__('Link Settings', 'elayne-blocks')} initialOpen={false}>
					<ToggleControl
						label={__('Make Entire Section Clickable', 'elayne-blocks')}
						help={__('Wrap section heading in a link', 'elayne-blocks')}
						checked={isLinkWrapper}
						onChange={(val) => setAttributes({ isLinkWrapper: val })}
					/>

					{isLinkWrapper && (
						<TextControl
							label={__('Link URL', 'elayne-blocks')}
							value={linkUrl}
							onChange={(val) => setAttributes({ linkUrl: val })}
							type="url"
							placeholder="https://example.com"
						/>
					)}
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				<div className="wp-block-elayne-mega-menu-section__header">
					{iconName && !customSVG && (
						<span className={`dashicons dashicons-${iconName}`} />
					)}
					{customSVG && (
						<span
							className="custom-icon"
							dangerouslySetInnerHTML={{ __html: customSVG }}
						/>
					)}
					<RichText
						tagName={HeadingTag}
						value={heading}
						onChange={(val) => setAttributes({ heading: val })}
						placeholder={__('Section heading...', 'elayne-blocks')}
						className="wp-block-elayne-mega-menu-section__heading"
					/>
				</div>

				<div className="wp-block-elayne-mega-menu-section__content">
					<InnerBlocks
						allowedBlocks={[
							'elayne/mega-menu-item',
							'core/paragraph',
							'core/heading',
							'core/image',
							'core/list',
							'core/buttons',
						]}
					/>
				</div>
			</div>
		</>
	);
}

/**
 * Edit component for Mega Menu Item block
 */

import { useBlockProps, InspectorControls, RichText } from '@wordpress/block-editor';
import { PanelBody, TextControl, SelectControl, ToggleControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import classnames from 'classnames';

export default function Edit({ attributes, setAttributes }) {
	const {
		label,
		description,
		iconName,
		customSVG,
		linkUrl,
		linkTarget,
		badgeText,
		badgeStyle,
	} = attributes;

	const blockProps = useBlockProps({
		className: 'wp-block-elayne-mega-menu-item',
	});

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Link Settings', 'elayne-blocks')} initialOpen={true}>
					<TextControl
						label={__('Link URL', 'elayne-blocks')}
						value={linkUrl}
						onChange={(val) => setAttributes({ linkUrl: val })}
						type="url"
						placeholder="https://example.com"
					/>

					<ToggleControl
						label={__('Open in New Tab', 'elayne-blocks')}
						checked={linkTarget === '_blank'}
						onChange={(val) =>
							setAttributes({ linkTarget: val ? '_blank' : '_self' })
						}
					/>
				</PanelBody>

				<PanelBody title={__('Icon', 'elayne-blocks')} initialOpen={false}>
					<TextControl
						label={__('Dashicon Name', 'elayne-blocks')}
						value={iconName}
						onChange={(val) => setAttributes({ iconName: val })}
						placeholder="star-filled"
						help={__('Enter a Dashicon name (e.g., star-filled, cart)', 'elayne-blocks')}
					/>
					{/* TODO: Replace with IconPicker component */}
				</PanelBody>

				<PanelBody title={__('Badge', 'elayne-blocks')} initialOpen={false}>
					<TextControl
						label={__('Badge Text', 'elayne-blocks')}
						value={badgeText}
						onChange={(val) => setAttributes({ badgeText: val })}
						placeholder={__('New, Sale, Hot, etc.', 'elayne-blocks')}
					/>

					{badgeText && (
						<SelectControl
							label={__('Badge Style', 'elayne-blocks')}
							value={badgeStyle}
							options={[
								{ label: __('Default (Gray)', 'elayne-blocks'), value: 'default' },
								{ label: __('Success (Green)', 'elayne-blocks'), value: 'success' },
								{ label: __('Warning (Yellow)', 'elayne-blocks'), value: 'warning' },
								{ label: __('Danger (Red)', 'elayne-blocks'), value: 'danger' },
								{ label: __('Info (Blue)', 'elayne-blocks'), value: 'info' },
							]}
							onChange={(val) => setAttributes({ badgeStyle: val })}
						/>
					)}
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				<div className="wp-block-elayne-mega-menu-item__link">
					{iconName && !customSVG && (
						<span className={`dashicons dashicons-${iconName}`} />
					)}
					{customSVG && (
						<span
							className="custom-icon"
							dangerouslySetInnerHTML={{ __html: customSVG }}
						/>
					)}

					<div className="wp-block-elayne-mega-menu-item__content">
						<div className="wp-block-elayne-mega-menu-item__header">
							<RichText
								tagName="span"
								value={label}
								onChange={(val) => setAttributes({ label: val })}
								placeholder={__('Item label...', 'elayne-blocks')}
								className="wp-block-elayne-mega-menu-item__label"
							/>
							{badgeText && (
								<span
									className={classnames(
										'wp-block-elayne-mega-menu-item__badge',
										`badge-${badgeStyle}`
									)}
								>
									{badgeText}
								</span>
							)}
						</div>

						<RichText
							tagName="span"
							value={description}
							onChange={(val) => setAttributes({ description: val })}
							placeholder={__('Optional description...', 'elayne-blocks')}
							className="wp-block-elayne-mega-menu-item__description"
						/>
					</div>
				</div>
			</div>
		</>
	);
}

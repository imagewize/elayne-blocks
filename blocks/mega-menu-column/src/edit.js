/**
 * Edit component for Mega Menu Column block
 */

import { useBlockProps, InnerBlocks, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, SelectControl, PanelColorSettings } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import classnames from 'classnames';

export default function Edit({ attributes, setAttributes }) {
	const { width, verticalAlignment, backgroundColor, textColor } = attributes;

	const blockProps = useBlockProps({
		className: classnames(
			`width-${width.replace('/', '-')}`,
			`align-${verticalAlignment}`
		),
		style: {
			backgroundColor: backgroundColor || undefined,
			color: textColor || undefined,
		},
	});

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Column Settings', 'elayne-blocks')} initialOpen={true}>
					<SelectControl
						label={__('Column Width', 'elayne-blocks')}
						value={width}
						options={[
							{ label: __('Auto', 'elayne-blocks'), value: 'auto' },
							{ label: __('1/2 (50%)', 'elayne-blocks'), value: '1/2' },
							{ label: __('1/3 (33%)', 'elayne-blocks'), value: '1/3' },
							{ label: __('2/3 (66%)', 'elayne-blocks'), value: '2/3' },
							{ label: __('1/4 (25%)', 'elayne-blocks'), value: '1/4' },
							{ label: __('3/4 (75%)', 'elayne-blocks'), value: '3/4' },
						]}
						onChange={(val) => setAttributes({ width: val })}
					/>

					<SelectControl
						label={__('Vertical Alignment', 'elayne-blocks')}
						value={verticalAlignment}
						options={[
							{ label: __('Top', 'elayne-blocks'), value: 'top' },
							{ label: __('Center', 'elayne-blocks'), value: 'center' },
							{ label: __('Bottom', 'elayne-blocks'), value: 'bottom' },
						]}
						onChange={(val) => setAttributes({ verticalAlignment: val })}
					/>
				</PanelBody>

				<PanelColorSettings
					title={__('Color Settings', 'elayne-blocks')}
					colorSettings={[
						{
							value: backgroundColor,
							onChange: (color) => setAttributes({ backgroundColor: color }),
							label: __('Background Color', 'elayne-blocks'),
						},
						{
							value: textColor,
							onChange: (color) => setAttributes({ textColor: color }),
							label: __('Text Color', 'elayne-blocks'),
						},
					]}
				/>
			</InspectorControls>

			<div {...blockProps}>
				<InnerBlocks
					allowedBlocks={[
						'elayne/mega-menu-section',
						'elayne/mega-menu-item',
						'core/paragraph',
						'core/heading',
						'core/image',
						'core/list',
						'core/buttons',
						'core/template-part',
					]}
				/>
			</div>
		</>
	);
}

import { __ } from '@wordpress/i18n';
import {
	BaseControl,
	Button,
	ButtonGroup,
	ColorPalette,
	RangeControl,
	ToggleControl,
} from '@wordpress/components';

/**
 * StylePanel Component
 *
 * Provides styling controls for the mega menu panel container effects.
 *
 * @param {Object} props Component props
 * @param {Object} props.attributes Block attributes
 * @param {Function} props.setAttributes Attribute setter function
 * @param {string} props.layoutMode Current layout mode (dropdown, overlay, sidebar, grid)
 */
export default function StylePanel({ attributes, setAttributes, layoutMode }) {
	const {
		panelBoxShadow,
		panelBorderRadius,
		panelBorderWidth,
		panelBorderColor,
		panelBackdropBlur,
	} = attributes;

	return (
		<>
				<BaseControl
					label={__('Box Shadow', 'elayne')}
					help={__('Add depth to the panel container', 'elayne')}
				>
					<ButtonGroup>
						<Button
							variant={panelBoxShadow === 'none' ? 'primary' : 'secondary'}
							onClick={() => setAttributes({ panelBoxShadow: 'none' })}
						>
							{__('None', 'elayne')}
						</Button>
						<Button
							variant={panelBoxShadow === 'small' ? 'primary' : 'secondary'}
							onClick={() => setAttributes({ panelBoxShadow: 'small' })}
						>
							{__('Small', 'elayne')}
						</Button>
						<Button
							variant={panelBoxShadow === 'medium' ? 'primary' : 'secondary'}
							onClick={() => setAttributes({ panelBoxShadow: 'medium' })}
						>
							{__('Medium', 'elayne')}
						</Button>
						<Button
							variant={panelBoxShadow === 'large' ? 'primary' : 'secondary'}
							onClick={() => setAttributes({ panelBoxShadow: 'large' })}
						>
							{__('Large', 'elayne')}
						</Button>
					</ButtonGroup>
				</BaseControl>

				<RangeControl
					label={__('Border Radius (px)', 'elayne')}
					value={panelBorderRadius}
					onChange={(value) => setAttributes({ panelBorderRadius: value })}
					min={0}
					max={50}
					step={1}
				/>

				<RangeControl
					label={__('Border Width (px)', 'elayne')}
					value={panelBorderWidth}
					onChange={(value) => setAttributes({ panelBorderWidth: value })}
					min={0}
					max={10}
					step={1}
				/>

				{panelBorderWidth > 0 && (
					<BaseControl label={__('Border Color', 'elayne')}>
						<ColorPalette
							value={panelBorderColor}
							onChange={(value) => setAttributes({ panelBorderColor: value })}
						/>
					</BaseControl>
				)}

				{(layoutMode === 'overlay' || layoutMode === 'sidebar') && (
					<ToggleControl
						label={__('Backdrop Blur', 'elayne')}
						help={__('Add a blur effect to the panel background', 'elayne')}
						checked={panelBackdropBlur}
						onChange={(value) => setAttributes({ panelBackdropBlur: value })}
					/>
				)}
		</>
	);
}

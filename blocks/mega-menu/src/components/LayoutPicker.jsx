/**
 * LayoutPicker Component
 *
 * Visual layout mode selector for the Mega Menu block.
 * Allows users to choose between 4 distinct layout engines:
 * - Dropdown: Classic mega menu below trigger
 * - Overlay: Full-screen overlay with backdrop
 * - Sidebar: Drawer from left/right
 * - Grid: Full-width multi-column layout
 */

import { Button, ButtonGroup, Tooltip } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { Icon, arrowDown, cover, menu, grid } from '@wordpress/icons';

/**
 * LayoutPicker component
 *
 * @param {Object} props - Component props
 * @param {string} props.value - Currently selected layout mode
 * @param {Function} props.onChange - Callback when layout mode changes
 */
export default function LayoutPicker({ value, onChange }) {
	const layouts = [
		{
			value: 'dropdown',
			label: __('Dropdown', 'elayne'),
			icon: arrowDown,
			description: __('Classic dropdown below trigger', 'elayne'),
		},
		{
			value: 'overlay',
			label: __('Overlay', 'elayne'),
			icon: cover,
			description: __('Full-screen overlay', 'elayne'),
		},
		{
			value: 'sidebar',
			label: __('Sidebar', 'elayne'),
			icon: menu,
			description: __('Drawer from left/right', 'elayne'),
		},
		{
			value: 'grid',
			label: __('Mega Grid', 'elayne'),
			icon: grid,
			description: __('Full-width grid layout', 'elayne'),
		},
	];

	return (
		<div className="layout-picker">
			<label className="components-base-control__label">
				{__('Layout Mode', 'elayne')}
			</label>
			<ButtonGroup className="layout-picker__buttons">
				{layouts.map((layout) => (
					<Tooltip key={layout.value} text={layout.description}>
						<Button
							isPressed={value === layout.value}
							onClick={() => onChange(layout.value)}
							className="layout-picker__button"
							aria-label={layout.description}
						>
							<Icon icon={layout.icon} />
							<span>{layout.label}</span>
						</Button>
					</Tooltip>
				))}
			</ButtonGroup>
		</div>
	);
}

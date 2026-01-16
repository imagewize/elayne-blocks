/**
 * Save component for Mega Menu Column block
 */

import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import classnames from 'classnames';

export default function Save({ attributes }) {
	const { width, verticalAlignment, backgroundColor, textColor } = attributes;

	const blockProps = useBlockProps.save({
		className: classnames(
			'wp-block-elayne-mega-menu-column',
			`width-${width.replace('/', '-')}`,
			`align-${verticalAlignment}`
		),
		style: {
			backgroundColor: backgroundColor || undefined,
			color: textColor || undefined,
		},
	});

	return (
		<div {...blockProps}>
			<InnerBlocks.Content />
		</div>
	);
}

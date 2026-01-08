/**
 * WordPress dependencies
 */
import { useBlockProps } from '@wordpress/block-editor';

/**
 * Save component
 */
export default function save({ attributes }) {
	const { overlayBackgroundColor, searchBarBorderColor } = attributes;
	const blockProps = useBlockProps.save();

	return (
		<div { ...blockProps }>
			<figure
				className="wp-block-image size-full is-resized search-overlay-trigger"
				data-overlay-bg-color={ overlayBackgroundColor }
				data-border-color={ searchBarBorderColor }
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="currentColor"
					viewBox="0 0 24 24"
					style={{ width: '20px', height: '20px' }}
				>
					<g data-name="search">
						<path d="M20.71 19.29l-3.4-3.39A7.92 7.92 0 0 0 19 11a8 8 0 1 0-8 8 7.92 7.92 0 0 0 4.9-1.69l3.39 3.4a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42zM5 11a6 6 0 1 1 6 6 6 6 0 0 1-6-6z"></path>
					</g>
				</svg>
			</figure>
		</div>
	);
}

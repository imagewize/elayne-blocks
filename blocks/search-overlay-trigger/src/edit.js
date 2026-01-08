/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls, ColorGradientControl } from '@wordpress/block-editor';
import { PanelBody } from '@wordpress/components';

/**
 * Edit component
 */
export default function Edit({ attributes, setAttributes }) {
	const { overlayBackgroundColor, searchBarBorderColor } = attributes;
	const blockProps = useBlockProps();

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Overlay Settings', 'elayne-blocks' ) } initialOpen={ true }>
					<ColorGradientControl
						label={ __( 'Overlay Background Color', 'elayne-blocks' ) }
						colorValue={ overlayBackgroundColor }
						onColorChange={ ( color ) => setAttributes({ overlayBackgroundColor: color }) }
						enableAlpha={ true }
					/>
					<ColorGradientControl
						label={ __( 'Search Bar Border Color', 'elayne-blocks' ) }
						colorValue={ searchBarBorderColor }
						onColorChange={ ( color ) => setAttributes({ searchBarBorderColor: color }) }
						enableAlpha={ false }
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...blockProps }>
				<figure className="wp-block-image size-full is-resized search-overlay-trigger">
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
				<span style={{ fontSize: '12px', color: '#666', marginLeft: '8px' }}>
					{ __( '(Search icon - click to open overlay)', 'elayne-blocks' ) }
				</span>
			</div>
		</>
	);
}

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';

/**
 * Edit component — visible in editor only, renders nothing on frontend.
 */
export default function Edit() {
	const blockProps = useBlockProps( {
		className: 'elayne-plumbing-styles-indicator',
	} );

	return (
		<div { ...blockProps }>
			<span className="elayne-plumbing-styles-indicator__icon">🔧</span>
			<span className="elayne-plumbing-styles-indicator__label">
				{ __( 'Plumbing CSS', 'elayne-blocks' ) }
			</span>
		</div>
	);
}

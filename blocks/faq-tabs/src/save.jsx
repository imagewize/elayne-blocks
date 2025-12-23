/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

/**
 * The save function defines the way in which the different attributes should
 * be combined into the final markup, which is then serialized by the block
 * editor into `post_content`.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#save
 *
 * @return {Element} Element to render.
 */
export default function save() {
	return (
		<div {...useBlockProps.save({ className: 'faq-tabs-wrapper' })}>
			<div className="wp-block-columns">
				<div
					className="wp-block-column faq-questions-column"
					style={{ flexBasis: '40%' }}
				>
					<div className="faq-vertical-tabs"></div>
				</div>

				<div
					className="wp-block-column faq-content-column"
					style={{ flexBasis: '60%' }}
				>
					<div className="faq-content-area">
						<InnerBlocks.Content />
					</div>
				</div>
			</div>
		</div>
	);
}

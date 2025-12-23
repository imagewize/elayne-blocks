/**
 * React hook that is used to mark the block wrapper element.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps, InnerBlocks, RichText } from '@wordpress/block-editor';

/**
 * The save function defines the way in which the different attributes should
 * be combined into the final markup, which is then serialized by the block
 * editor into `post_content`.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#save
 *
 * @param {Object} props Block properties
 * @return {Element} Element to render.
 */
export default function save({ attributes }) {
	const { question, title } = attributes;

	const blockProps = useBlockProps.save({
		className: 'faq-tab-answer',
		'data-question': question,
	});

	return (
		<div {...blockProps}>
			<div className="faq-answer-header">
				<RichText.Content tagName="h3" className="faq-answer-title" value={title} />
			</div>
			<div className="faq-answer-content">
				<InnerBlocks.Content />
			</div>
		</div>
	);
}

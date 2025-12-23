/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * React hook that is used to mark the block wrapper element.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import {
	useBlockProps,
	InnerBlocks,
	RichText,
	InspectorControls,
} from '@wordpress/block-editor';

import { PanelBody, TextControl } from '@wordpress/components';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';

/**
 * The edit function describes the structure of your block in the context of the
 * editor.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @param {Object} props Block properties
 * @return {Element} Element to render.
 */
export default function Edit({ attributes, setAttributes }) {
	const { question, title } = attributes;

	const blockProps = useBlockProps({
		className: 'faq-tab-answer-editor',
	});

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Tab Settings', 'elayne-blocks')}>
					<TextControl
						label={__('Question Text', 'elayne-blocks')}
						value={question}
						onChange={(value) => setAttributes({ question: value })}
						help={__('The question shown in the tab navigation', 'elayne-blocks')}
					/>
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				<div className="faq-answer-header">
					<RichText
						tagName="h3"
						className="faq-answer-title"
						value={title}
						onChange={(value) => setAttributes({ title: value })}
						placeholder={__('Enter answer title...', 'elayne-blocks')}
					/>
				</div>
				<div className="faq-answer-content">
					<InnerBlocks
						template={[
							[
								'core/paragraph',
								{
									placeholder: __(
										'Add content for this FAQ answer...',
										'elayne-blocks'
									),
								},
							],
						]}
					/>
				</div>
			</div>
		</>
	);
}

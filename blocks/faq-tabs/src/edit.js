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
} from '@wordpress/block-editor';

import { useSelect, useDispatch } from '@wordpress/data';
import { useState, useEffect } from '@wordpress/element';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {Element} Element to render.
 */
export default function Edit({ clientId, attributes, setAttributes }) {
	const [activeTab, setActiveTab] = useState(0);
	const { align } = attributes;

	const blockProps = useBlockProps({
		className: 'faq-tabs-wrapper',
	});

	const { updateBlockAttributes } = useDispatch('core/block-editor');

	// Get inner blocks (FAQ tab answers)
	const { innerBlocks } = useSelect(
		(select) => {
			const { getBlock } = select('core/block-editor');
			const block = getBlock(clientId);
			return {
				innerBlocks: block?.innerBlocks || [],
			};
		},
		[clientId]
	);

	// Set default alignment on block insertion
	useEffect(() => {
		if (align === undefined) {
			setAttributes({ align: 'wide' });
		}
	}, []);

	// Adjust active tab if it's out of bounds
	useEffect(() => {
		if (activeTab >= innerBlocks.length && innerBlocks.length > 0) {
			setActiveTab(innerBlocks.length - 1);
		}
	}, [innerBlocks.length, activeTab]);

	// Handle question text change
	const handleQuestionChange = (newQuestion, blockId) => {
		updateBlockAttributes(blockId, { question: newQuestion });
	};

	const TEMPLATE = [
		[
			'elayne/faq-tab-answer',
			{
				question: 'What services do you offer?',
				title: 'Our Comprehensive Services',
			},
		],
		[
			'elayne/faq-tab-answer',
			{
				question: 'How long does a typical project take?',
				title: 'Project Timeline & Process',
			},
		],
		[
			'elayne/faq-tab-answer',
			{
				question: 'What makes your approach different?',
				title: 'Our Unique Approach',
			},
		],
	];

	return (
		<div {...blockProps}>
			<div className="wp-block-columns">
				<div
					className="wp-block-column faq-questions-column"
					style={{ flexBasis: '40%' }}
				>
					<div className="faq-vertical-tabs">
						{innerBlocks.length === 0 && (
							<p className="faq-tabs-placeholder">
								{__('Add FAQ Tab Answer blocks to get started', 'elayne-blocks')}
							</p>
						)}
						{innerBlocks.map((block, index) => (
							<div
								key={block.clientId}
								className={`faq-tab-item ${activeTab === index ? 'active' : ''}`}
							>
								<RichText
									tagName="div"
									className="tab-question"
									value={block.attributes.question || ''}
									onChange={(newQuestion) => handleQuestionChange(newQuestion, block.clientId)}
									placeholder={__('Enter question...', 'elayne-blocks')}
									onClick={() => setActiveTab(index)}
									allowedFormats={[]}
								/>
								<div
									className="tab-arrow-circle"
									onClick={() => setActiveTab(index)}
									style={{ cursor: 'pointer' }}
								>
									<svg
										width="16"
										height="16"
										viewBox="0 0 16 16"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											d="M6 4L10 8L6 12"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
									</svg>
								</div>
							</div>
						))}
					</div>
				</div>

				<div
					className="wp-block-column faq-content-column"
					style={{ flexBasis: '60%' }}
				>
					<div className="faq-content-area">
						<InnerBlocks
							allowedBlocks={['elayne/faq-tab-answer']}
							template={TEMPLATE}
							renderAppender={() => <InnerBlocks.ButtonBlockAppender />}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}

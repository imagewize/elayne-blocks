/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import {
	useBlockProps,
	RichText,
	InspectorControls,
} from '@wordpress/block-editor';

import {
	PanelBody,
	TextControl,
	Button,
	IconButton,
} from '@wordpress/components';

import { useState } from '@wordpress/element';

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
export default function Edit({ attributes, setAttributes }) {
	const { questions, buttonText, buttonUrl } = attributes;
	const [activeTab, setActiveTab] = useState(0);

	const blockProps = useBlockProps({
		className: 'faq-tabs-wrapper',
	});

	const updateQuestion = (index, field, value) => {
		const newQuestions = [...questions];
		newQuestions[index] = { ...newQuestions[index], [field]: value };
		setAttributes({ questions: newQuestions });
	};

	const addQuestion = () => {
		const newQuestions = [
			...questions,
			{
				question: 'New Question',
				title: 'New Title',
				description: 'New description',
			},
		];
		setAttributes({ questions: newQuestions });
	};

	const removeQuestion = (index) => {
		if (questions.length <= 1) {
			return; // Keep at least one question
		}
		const newQuestions = questions.filter((_, i) => i !== index);
		setAttributes({ questions: newQuestions });
		if (activeTab >= newQuestions.length) {
			setActiveTab(newQuestions.length - 1);
		}
	};

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('FAQ Questions', 'elayne-blocks')}>
					{questions.map((item, index) => (
						<div
							key={index}
							style={{
								marginBottom: '20px',
								padding: '10px',
								border: '1px solid #ddd',
								borderRadius: '4px',
							}}
						>
							<div
								style={{
									display: 'flex',
									justifyContent: 'space-between',
									alignItems: 'center',
									marginBottom: '10px',
								}}
							>
								<strong>
									{__('Question', 'elayne-blocks')} {index + 1}
								</strong>
								<Button
									isDestructive
									isSmall
									onClick={() => removeQuestion(index)}
									disabled={questions.length <= 1}
								>
									{__('Remove', 'elayne-blocks')}
								</Button>
							</div>
							<TextControl
								label={__('Question', 'elayne-blocks')}
								value={item.question}
								onChange={(value) => updateQuestion(index, 'question', value)}
							/>
							<TextControl
								label={__('Answer Title', 'elayne-blocks')}
								value={item.title}
								onChange={(value) => updateQuestion(index, 'title', value)}
							/>
							<TextControl
								label={__('Answer Description', 'elayne-blocks')}
								value={item.description}
								onChange={(value) =>
									updateQuestion(index, 'description', value)
								}
								help={__('The detailed answer text', 'elayne-blocks')}
							/>
						</div>
					))}
					<Button isPrimary onClick={addQuestion}>
						{__('Add Question', 'elayne-blocks')}
					</Button>
				</PanelBody>
				<PanelBody title={__('Button Settings', 'elayne-blocks')}>
					<TextControl
						label={__('Button Text', 'elayne-blocks')}
						value={buttonText}
						onChange={(value) => setAttributes({ buttonText: value })}
					/>
					<TextControl
						label={__('Button URL', 'elayne-blocks')}
						value={buttonUrl}
						onChange={(value) => setAttributes({ buttonUrl: value })}
					/>
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				<div className="wp-block-columns">
					<div
						className="wp-block-column faq-questions-column"
						style={{ flexBasis: '40%' }}
					>
						<div className="faq-vertical-tabs">
							{questions.map((item, index) => (
								<div
									key={index}
									className={`faq-tab-item ${
										activeTab === index ? 'active' : ''
									}`}
									onClick={() => setActiveTab(index)}
									style={{ cursor: 'pointer' }}
								>
									<div className="tab-question">{item.question}</div>
									<div className="tab-arrow-circle">
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
						<div className="faq-content-box">
							<h3 className="faq-answer-title">{questions[activeTab].title}</h3>
							<p className="faq-answer-description">
								{questions[activeTab].description}
							</p>
							<div className="wp-block-buttons">
								<div className="wp-block-button">
									<a className="wp-block-button__link" href={buttonUrl}>
										{buttonText}
									</a>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

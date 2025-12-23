/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps } from '@wordpress/block-editor';

/**
 * The save function defines the way in which the different attributes should
 * be combined into the final markup, which is then serialized by the block
 * editor into `post_content`.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#save
 *
 * @return {Element} Element to render.
 */
export default function save({ attributes }) {
	const { questions, buttonText, buttonUrl } = attributes;

	return (
		<div {...useBlockProps.save({ className: 'faq-tabs-wrapper' })}>
			{/* Store FAQ data for frontend JS */}
			<script
				type="application/json"
				className="faq-data"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify({ questions, buttonText, buttonUrl }),
				}}
			/>

			<div className="wp-block-columns">
				<div
					className="wp-block-column faq-questions-column"
					style={{ flexBasis: '40%' }}
				>
					<div className="faq-vertical-tabs">
						{questions.map((item, index) => (
							<div
								key={index}
								className={`faq-tab-item ${index === 0 ? 'active' : ''}`}
								data-tab-index={index}
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
						<h3 className="faq-answer-title">{questions[0].title}</h3>
						<p className="faq-answer-description">{questions[0].description}</p>
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
	);
}

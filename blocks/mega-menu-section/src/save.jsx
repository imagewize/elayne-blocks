/**
 * Save component for Mega Menu Section block
 */

import { useBlockProps, InnerBlocks, RichText } from '@wordpress/block-editor';
import classnames from 'classnames';

export default function Save({ attributes }) {
	const {
		heading,
		iconName,
		customSVG,
		isLinkWrapper,
		linkUrl,
		collapsibleMobile,
		headingLevel,
	} = attributes;

	const blockProps = useBlockProps.save({
		className: classnames('wp-block-elayne-mega-menu-section', {
			'is-collapsible-mobile': collapsibleMobile,
		}),
	});

	const HeadingTag = headingLevel;

	const headerContent = (
		<>
			{iconName && !customSVG && (
				<span className={`dashicons dashicons-${iconName}`} />
			)}
			{customSVG && (
				<span
					className="custom-icon"
					dangerouslySetInnerHTML={{ __html: customSVG }}
				/>
			)}
			<RichText.Content
				tagName={HeadingTag}
				value={heading}
				className="wp-block-elayne-mega-menu-section__heading"
			/>
		</>
	);

	return (
		<div {...blockProps}>
			<div className="wp-block-elayne-mega-menu-section__header">
				{isLinkWrapper && linkUrl ? (
					<a href={linkUrl}>{headerContent}</a>
				) : (
					headerContent
				)}
			</div>
			<div className="wp-block-elayne-mega-menu-section__content">
				<InnerBlocks.Content />
			</div>
		</div>
	);
}

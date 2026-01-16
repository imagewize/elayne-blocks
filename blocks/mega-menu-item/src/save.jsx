/**
 * Save component for Mega Menu Item block
 */

import { useBlockProps, RichText } from '@wordpress/block-editor';
import classnames from 'classnames';

export default function Save({ attributes }) {
	const {
		label,
		description,
		iconName,
		customSVG,
		linkUrl,
		linkTarget,
		badgeText,
		badgeStyle,
	} = attributes;

	const blockProps = useBlockProps.save({
		className: 'wp-block-elayne-mega-menu-item',
	});

	return (
		<div {...blockProps}>
			<a
				className="wp-block-elayne-mega-menu-item__link"
				href={linkUrl || '#'}
				target={linkTarget}
				rel={linkTarget === '_blank' ? 'noopener noreferrer' : undefined}
			>
				{iconName && !customSVG && (
					<span className={`dashicons dashicons-${iconName}`} />
				)}
				{customSVG && (
					<span
						className="custom-icon"
						dangerouslySetInnerHTML={{ __html: customSVG }}
					/>
				)}

				<div className="wp-block-elayne-mega-menu-item__content">
					<div className="wp-block-elayne-mega-menu-item__header">
						<RichText.Content
							tagName="span"
							value={label}
							className="wp-block-elayne-mega-menu-item__label"
						/>
						{badgeText && (
							<span
								className={classnames(
									'wp-block-elayne-mega-menu-item__badge',
									`badge-${badgeStyle}`
								)}
							>
								{badgeText}
							</span>
						)}
					</div>

					{description && (
						<RichText.Content
							tagName="span"
							value={description}
							className="wp-block-elayne-mega-menu-item__description"
						/>
					)}
				</div>
			</a>
		</div>
	);
}

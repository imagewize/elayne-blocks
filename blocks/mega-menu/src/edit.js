/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __, sprintf } from '@wordpress/i18n';
import {
	BlockControls,
	InspectorControls,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';
import { useEntityRecords } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';
import { createInterpolateElement } from '@wordpress/element';
import {
	ComboboxControl,
	PanelBody,
	TextControl,
	ColorPalette,
	SelectControl,
	ToggleControl,
	RangeControl,
	ToolbarGroup,
	ToolbarButton,
} from '@wordpress/components';

/**
 * Internal dependencies
 */
import IconPicker from './components/IconPicker';
import AnimationControls from './components/AnimationControls';
import LayoutPicker from './components/LayoutPicker';
import StylePanel from './components/StylePanel';

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
export default function Edit( { attributes, setAttributes } ) {
	const {
		label,
		labelColor,
		description,
		menuSlug,
		layoutMode,
		enableAnimations,
		animationType,
		animationSpeed,
		enableIcon,
		iconName,
		iconPosition,
		customSVG,
		enableMobileMode,
		mobileBreakpoint,
		dropdownAlignment,
		dropdownSpacing,
		dropdownMaxWidth,
		useFullWidth,
		overlayBackdropColor,
		enableHoverActivation,
	} = attributes;

	const siteUrl = useSelect( ( select ) => select( 'core' ).getSite()?.url );
	const menuTemplateUrl =
		( siteUrl || window.location.origin ) +
		'/wp-admin/site-editor.php?p=%2Fpattern&postType=wp_template_part&categoryId=elayne-mega-menu';

	const { hasResolved, records } = useEntityRecords(
		'postType',
		'wp_template_part',
		{
			per_page: -1,
		}
	);

	let menuOptions = [];

	if ( hasResolved ) {
		menuOptions = records
			.filter( ( item ) => item.area === 'menu' || item.area === 'elayne-mega-menu' )
			.map( ( item ) => ( {
				label: item.title.rendered,
				value: item.slug,
			} ) );
	}

	const hasMenus = menuOptions.length > 0;

	const blockProps = useBlockProps( {
		className:
			'wp-block-navigation-item wp-block-elayne-mega-menu__toggle',
		style: {
			color: labelColor || 'inherit',
			'--mm-dropdown-spacing': `${dropdownSpacing || 16}px`,
			'--mm-dropdown-max-width': `${dropdownMaxWidth || 600}px`,
		},
	} );

	return (
		<>
			{ /* Toolbar Controls */ }
			<BlockControls>
				<ToolbarGroup>
					<ToolbarButton
						icon={ enableAnimations ? 'yes' : 'admin-appearance' }
						label={ __( 'Enable Animations', 'elayne-blocks' ) }
						isPressed={ enableAnimations }
						onClick={ () =>
							setAttributes( {
								enableAnimations: ! enableAnimations,
							} )
						}
					/>
					<ToolbarButton
						icon={ enableIcon ? 'yes' : 'star-empty' }
						label={ __( 'Enable Icon', 'elayne-blocks' ) }
						isPressed={ enableIcon }
						onClick={ () =>
							setAttributes( { enableIcon: ! enableIcon } )
						}
					/>
				</ToolbarGroup>
			</BlockControls>

			{ /* Inspector Controls */ }
			<InspectorControls group="settings">
				{ /* Settings Panel */ }
				<PanelBody
					className="mega-menu__settings-panel"
					title={ __( 'Settings', 'elayne-blocks' ) }
					initialOpen={ true }
				>
					<TextControl
						label={ __( 'Label', 'elayne-blocks' ) }
						type="text"
						value={ label }
						onChange={ ( value ) =>
							setAttributes( { label: value } )
						}
						autoComplete="off"
					/>
					<TextControl
						label={ __( 'Description', 'elayne-blocks' ) }
						type="text"
						value={ description }
						onChange={ ( value ) =>
							setAttributes( { description: value } )
						}
						help={ __(
							'Optional description for accessibility',
							'elayne-blocks'
						) }
						autoComplete="off"
					/>
					<ColorPalette
						label={ __( 'Label Color', 'elayne-blocks' ) }
						value={ labelColor }
						onChange={ ( colorValue ) =>
							setAttributes( { labelColor: colorValue } )
						}
						clearable={ true }
					/>

					<ComboboxControl
						label={ __( 'Select Menu Template', 'elayne-blocks' ) }
						value={ menuSlug }
						options={ menuOptions }
						onChange={ ( value ) =>
							setAttributes( { menuSlug: value } )
						}
						help={
							hasMenus
								? __(
										'Select a template part to display in the mega menu',
										'elayne-blocks'
								  )
								: createInterpolateElement(
										__(
											'No menu template parts found. <a>Create one in the Site Editor</a>',
											'elayne-blocks'
										),
										{
											a: (
												// eslint-disable-next-line jsx-a11y/anchor-has-content
												<a
													href={ menuTemplateUrl }
													target="_blank"
													rel="noreferrer noopener"
												/>
											),
										}
								  )
						}
					/>
				</PanelBody>

				{ /* Layout Panel */ }
				<PanelBody
					className="mega-menu__layout-panel"
					title={ __( 'Layout', 'elayne-blocks' ) }
					initialOpen={ false }
				>
					<LayoutPicker
						value={ layoutMode }
						onChange={ ( value ) =>
							setAttributes( { layoutMode: value } )
						}
					/>

					{ layoutMode === 'dropdown' && (
						<>
							<SelectControl
								label={ __( 'Dropdown Alignment', 'elayne-blocks' ) }
								value={ dropdownAlignment }
								options={ [
									{ label: __( 'Left', 'elayne-blocks' ), value: 'left' },
									{ label: __( 'Right', 'elayne-blocks' ), value: 'right' },
									{ label: __( 'Center', 'elayne-blocks' ), value: 'center' },
								] }
								onChange={ ( value ) =>
									setAttributes( { dropdownAlignment: value } )
								}
								help={ __( 'Choose how the dropdown panel aligns relative to the menu toggle button.', 'elayne-blocks' ) }
							/>
							<RangeControl
								label={ __( 'Dropdown Spacing', 'elayne-blocks' ) }
								value={ dropdownSpacing }
								onChange={ ( value ) =>
									setAttributes( { dropdownSpacing: value } )
								}
								min={ 0 }
								max={ 48 }
								step={ 2 }
								help={ __( 'Vertical space between menu item and dropdown (in pixels)', 'elayne-blocks' ) }
							/>
							<RangeControl
								label={ __( 'Maximum Dropdown Width', 'elayne-blocks' ) }
								value={ dropdownMaxWidth }
								onChange={ ( value ) =>
									setAttributes( { dropdownMaxWidth: value } )
								}
								min={ 300 }
								max={ 1600 }
								step={ 50 }
								help={ __( 'Maximum width of the dropdown on desktop (in pixels). Mobile always uses full width.', 'elayne-blocks' ) }
								disabled={ useFullWidth }
							/>
							<ToggleControl
								label={ __( 'Use Full Width', 'elayne-blocks' ) }
								help={ __( 'Align dropdown with theme\'s wide content width. Enable this and adjust the offset below to match your header layout.', 'elayne-blocks' ) }
								checked={ useFullWidth }
								onChange={ ( value ) =>
									setAttributes( { useFullWidth: value } )
								}
							/>
						</>
					) }

					{ layoutMode === 'overlay' && (
						<TextControl
							label={ __( 'Backdrop Color', 'elayne-blocks' ) }
							value={ overlayBackdropColor }
							onChange={ ( value ) =>
								setAttributes( { overlayBackdropColor: value } )
							}
							help={ __( 'e.g., rgba(0, 0, 0, 0.5)', 'elayne-blocks' ) }
						/>
					) }

					{ layoutMode === 'dropdown' && (
						<ToggleControl
							label={ __( 'Activate on Hover', 'elayne-blocks' ) }
							help={ __( 'Open menu on hover instead of click', 'elayne-blocks' ) }
							checked={ enableHoverActivation }
							onChange={ ( value ) =>
								setAttributes( { enableHoverActivation: value } )
							}
						/>
					) }
				</PanelBody>

				{ /* Icon Panel - Conditional */ }
				{ enableIcon && (
					<PanelBody
						title={ __( 'Icon', 'elayne-blocks' ) }
						initialOpen={ false }
					>
						<IconPicker
							value={ iconName }
							onChange={ ( value ) =>
								setAttributes( { iconName: value } )
							}
							customSVG={ customSVG }
							onCustomSVGChange={ ( value ) =>
								setAttributes( { customSVG: value } )
							}
						/>
						<SelectControl
							label={ __( 'Icon Position', 'elayne-blocks' ) }
							value={ iconPosition }
							options={ [
								{ label: __( 'Left of Label', 'elayne-blocks' ), value: 'left' },
								{ label: __( 'Right of Label', 'elayne-blocks' ), value: 'right' },
								{ label: __( 'Above Label', 'elayne-blocks' ), value: 'top' },
							] }
							onChange={ ( value ) =>
								setAttributes( { iconPosition: value } )
							}
						/>
					</PanelBody>
				) }

				{ /* Animation Panel - Conditional */ }
				{ enableAnimations && (
					<PanelBody
						title={ __( 'Animation', 'elayne-blocks' ) }
						initialOpen={ false }
					>
						<AnimationControls
							animationType={ animationType }
							animationSpeed={ animationSpeed }
							onTypeChange={ ( value ) =>
								setAttributes( { animationType: value } )
							}
							onSpeedChange={ ( value ) =>
								setAttributes( { animationSpeed: value } )
							}
						/>
					</PanelBody>
				) }

				{ /* Mobile Panel */ }
				<PanelBody
					title={ __( 'Mobile Behavior', 'elayne-blocks' ) }
					initialOpen={ false }
				>
					<ToggleControl
						label={ __( 'Enable Mobile Mode', 'elayne-blocks' ) }
						checked={ enableMobileMode }
						onChange={ ( value ) =>
							setAttributes( { enableMobileMode: value } )
						}
					/>
					{ enableMobileMode && (
						<RangeControl
							label={ __( 'Mobile Breakpoint (px)', 'elayne-blocks' ) }
							value={ mobileBreakpoint }
							onChange={ ( value ) =>
								setAttributes( { mobileBreakpoint: value } )
							}
							min={ 320 }
							max={ 1024 }
							step={ 1 }
						/>
					) }
				</PanelBody>

				{ /* Panel Effects */ }
				<PanelBody
					title={ __( 'Panel Effects', 'elayne-blocks' ) }
					initialOpen={ false }
				>
					<StylePanel
						attributes={ attributes }
						setAttributes={ setAttributes }
						layoutMode={ layoutMode }
					/>
				</PanelBody>
			</InspectorControls>

			{ /* Block Preview */ }
			<div { ...blockProps }>
				<button className="wp-block-navigation-item__content wp-block-elayne-mega-menu__toggle">
					<RichText
						identifier="label"
						className="wp-block-navigation-item__label"
						value={ label }
						onChange={ ( labelValue ) => {
							setAttributes( {
								label: labelValue,
							} );
						} }
						placeholder={ __( 'Add label...', 'elayne-blocks' ) }
						allowedFormats={ [
							'core/bold',
							'core/italic',
							'core/image',
							'core/strikethrough',
						] }
					/>
					<span>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="12"
							height="12"
							viewBox="0 0 12 12"
							fill="currentColor"
							aria-hidden="true"
							focusable="false"
						>
							<path
								d="M1.50002 4L6.00002 8L10.5 4"
								strokeWidth="1.5"
								stroke="currentColor"
								fill="none"
							></path>
						</svg>
					</span>
				</button>
			</div>
		</>
	);
}

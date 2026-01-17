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
	__experimentalHStack as HStack,
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOptionIcon as ToggleGroupControlOptionIcon,
} from '@wordpress/components';
import {
	alignNone,
	justifyLeft,
	justifyCenter,
	justifyRight,
	stretchWide,
	stretchFullWidth,
	page,
	overlayText,
	menu,
	grid,
} from '@wordpress/icons';

/**
 * Internal dependencies
 */
import IconPicker from './components/IconPicker';
import AnimationControls from './components/AnimationControls';
import LayoutPicker from './components/LayoutPicker';

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
		justifyMenu,
		width,
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
		sidebarDirection,
		gridColumns,
		dropdownAlignment,
		overlayBackdropColor,
		enableHoverActivation,
		menuBackgroundColor,
		menuTextColor,
		menuBorderRadius,
		menuBoxShadow,
		backdropBlur,
	} = attributes;

	const layout = useSelect(
		( select ) =>
			select( 'core/editor' ).getEditorSettings()?.__experimentalFeatures
				?.layout
	);

	const siteUrl = useSelect( ( select ) => select( 'core' ).getSite()?.url );
	const menuTemplateUrl =
		( siteUrl || window.location.origin ) +
		'/wp-admin/site-editor.php?p=%2Fpattern&postType=wp_template_part&categoryId=menu';

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
			.filter( ( item ) => item.area === 'menu' )
			.map( ( item ) => ( {
				label: item.title.rendered,
				value: item.slug,
			} ) );
	}

	const hasMenus = menuOptions.length > 0;

	const blockProps = useBlockProps( {
		className:
			'wp-block-navigation-item wp-block-elayne-mega-menu__toggle',
		style: { color: labelColor || 'inherit' },
	} );

	const justificationOptions = [
		{
			value: 'left',
			icon: justifyLeft,
			label: __( 'Justify menu left', 'elayne-blocks' ),
		},
		{
			value: 'center',
			icon: justifyCenter,
			label: __( 'Justify menu center', 'elayne-blocks' ),
		},
		{
			value: 'right',
			icon: justifyRight,
			label: __( 'Justify menu right', 'elayne-blocks' ),
		},
	];

	const widthOptions = [
		{
			value: 'content',
			icon: alignNone,
			label: sprintf(
				// translators: %s: container size (i.e. 600px etc)
				__( 'Content width (%s wide)', 'elayne-blocks' ),
				layout?.contentSize || '1200px'
			),
		},
		{
			value: 'wide',
			icon: stretchWide,
			label: sprintf(
				// translators: %s: container size (i.e. 600px etc)
				__( 'Wide width (%s wide)', 'elayne-blocks' ),
				layout?.wideSize || '1600px'
			),
		},
		{
			value: 'full',
			icon: stretchFullWidth,
			label: __( 'Full width', 'elayne-blocks' ),
		},
	];

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

					{ layoutMode === 'sidebar' && (
						<SelectControl
							label={ __( 'Sidebar Direction', 'elayne-blocks' ) }
							value={ sidebarDirection }
							options={ [
								{ label: __( 'Left', 'elayne-blocks' ), value: 'left' },
								{ label: __( 'Right', 'elayne-blocks' ), value: 'right' },
							] }
							onChange={ ( value ) =>
								setAttributes( { sidebarDirection: value } )
							}
						/>
					) }

					{ layoutMode === 'grid' && (
						<RangeControl
							label={ __( 'Grid Columns', 'elayne-blocks' ) }
							value={ gridColumns }
							onChange={ ( value ) =>
								setAttributes( { gridColumns: value } )
							}
							min={ 2 }
							max={ 6 }
							step={ 1 }
						/>
					) }

					{ layoutMode === 'dropdown' && (
						<SelectControl
							label={ __( 'Dropdown Alignment', 'elayne-blocks' ) }
							value={ dropdownAlignment }
							options={ [
								{ label: __( 'Auto (Smart Positioning)', 'elayne-blocks' ), value: 'auto' },
								{ label: __( 'Left', 'elayne-blocks' ), value: 'left' },
								{ label: __( 'Right', 'elayne-blocks' ), value: 'right' },
								{ label: __( 'Center', 'elayne-blocks' ), value: 'center' },
							] }
							onChange={ ( value ) =>
								setAttributes( { dropdownAlignment: value } )
							}
						/>
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

					{ ( layoutMode === 'dropdown' || layoutMode === 'grid' ) && (
						<ToggleControl
							label={ __( 'Activate on Hover', 'elayne-blocks' ) }
							help={ __( 'Open menu on hover instead of click', 'elayne-blocks' ) }
							checked={ enableHoverActivation }
							onChange={ ( value ) =>
								setAttributes( { enableHoverActivation: value } )
							}
						/>
					) }

					<HStack alignment="top" justify="space-between">
						<ToggleGroupControl
							className="block-editor-hooks__flex-layout-justification-controls"
							label={ __( 'Justification', 'elayne-blocks' ) }
							value={ justifyMenu }
							onChange={ ( justificationValue ) => {
								setAttributes( {
									justifyMenu: justificationValue,
								} );
							} }
							isDeselectable={ true }
						>
							{ justificationOptions.map(
								( { value, icon, label: iconLabel } ) => {
									return (
										<ToggleGroupControlOptionIcon
											key={ value }
											value={ value }
											icon={ icon }
											label={ iconLabel }
										/>
									);
								}
							) }
						</ToggleGroupControl>
						<ToggleGroupControl
							className="block-editor-hooks__flex-layout-justification-controls"
							label={ __( 'Width', 'elayne-blocks' ) }
							value={ width || 'content' }
							onChange={ ( widthValue ) => {
								setAttributes( {
									width: widthValue,
								} );
							} }
							__nextHasNoMarginBottom
						>
							{ widthOptions.map(
								( { value, icon, label: iconLabel } ) => {
									return (
										<ToggleGroupControlOptionIcon
											key={ value }
											value={ value }
											icon={ icon }
											label={ iconLabel }
										/>
									);
								}
							) }
						</ToggleGroupControl>
					</HStack>
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

				{ /* Advanced Styling Panel */ }
				<PanelBody
					title={ __( 'Advanced Styling', 'elayne-blocks' ) }
					initialOpen={ false }
				>
					<ColorPalette
						label={ __( 'Menu Background Color', 'elayne-blocks' ) }
						value={ menuBackgroundColor }
						onChange={ ( value ) =>
							setAttributes( { menuBackgroundColor: value } )
						}
						clearable={ true }
					/>
					<ColorPalette
						label={ __( 'Menu Text Color', 'elayne-blocks' ) }
						value={ menuTextColor }
						onChange={ ( value ) =>
							setAttributes( { menuTextColor: value } )
						}
						clearable={ true }
					/>
					<TextControl
						label={ __( 'Border Radius', 'elayne-blocks' ) }
						value={ menuBorderRadius }
						onChange={ ( value ) =>
							setAttributes( { menuBorderRadius: value } )
						}
						help={ __( 'e.g., 8px, 1rem, 0', 'elayne-blocks' ) }
					/>
					<ToggleControl
						label={ __( 'Box Shadow', 'elayne-blocks' ) }
						checked={ menuBoxShadow }
						onChange={ ( value ) =>
							setAttributes( { menuBoxShadow: value } )
						}
					/>
					{ layoutMode === 'overlay' && (
						<ToggleControl
							label={ __( 'Backdrop Blur', 'elayne-blocks' ) }
							checked={ backdropBlur }
							onChange={ ( value ) =>
								setAttributes( { backdropBlur: value } )
							}
						/>
					) }
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

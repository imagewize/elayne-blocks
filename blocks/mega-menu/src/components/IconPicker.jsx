/**
 * Icon Picker Component
 *
 * Provides a visual interface for selecting Dashicons or uploading custom SVG icons.
 */
import { __ } from '@wordpress/i18n';
import {
	BaseControl,
	Button,
	ButtonGroup,
	Popover,
	TextControl,
	TextareaControl,
	SearchControl,
	__experimentalGrid as Grid,
} from '@wordpress/components';
import { Icon } from '@wordpress/icons';
import { useState } from '@wordpress/element';

/**
 * Popular Dashicons for menu navigation
 */
const DASHICONS = [
	{ name: 'menu', label: __( 'Menu (Hamburger)', 'elayne-blocks' ) },
	{ name: 'menu-alt', label: __( 'Menu Alt', 'elayne-blocks' ) },
	{ name: 'menu-alt2', label: __( 'Menu Alt 2', 'elayne-blocks' ) },
	{ name: 'menu-alt3', label: __( 'Menu Alt 3', 'elayne-blocks' ) },
	{ name: 'admin-site', label: __( 'Site', 'elayne-blocks' ) },
	{ name: 'admin-site-alt', label: __( 'Site Alt', 'elayne-blocks' ) },
	{ name: 'admin-site-alt2', label: __( 'Site Alt 2', 'elayne-blocks' ) },
	{ name: 'admin-site-alt3', label: __( 'Site Alt 3', 'elayne-blocks' ) },
	{ name: 'admin-home', label: __( 'Home', 'elayne-blocks' ) },
	{ name: 'building', label: __( 'Building', 'elayne-blocks' ) },
	{ name: 'store', label: __( 'Store', 'elayne-blocks' ) },
	{ name: 'cart', label: __( 'Cart', 'elayne-blocks' ) },
	{ name: 'products', label: __( 'Products', 'elayne-blocks' ) },
	{ name: 'portfolio', label: __( 'Portfolio', 'elayne-blocks' ) },
	{ name: 'book', label: __( 'Book', 'elayne-blocks' ) },
	{ name: 'book-alt', label: __( 'Book Alt', 'elayne-blocks' ) },
	{ name: 'lightbulb', label: __( 'Lightbulb', 'elayne-blocks' ) },
	{ name: 'heart', label: __( 'Heart', 'elayne-blocks' ) },
	{ name: 'star-filled', label: __( 'Star Filled', 'elayne-blocks' ) },
	{ name: 'star-empty', label: __( 'Star Empty', 'elayne-blocks' ) },
	{ name: 'flag', label: __( 'Flag', 'elayne-blocks' ) },
	{ name: 'location', label: __( 'Location', 'elayne-blocks' ) },
	{ name: 'phone', label: __( 'Phone', 'elayne-blocks' ) },
	{ name: 'email', label: __( 'Email', 'elayne-blocks' ) },
	{ name: 'admin-users', label: __( 'Users', 'elayne-blocks' ) },
	{ name: 'groups', label: __( 'Groups', 'elayne-blocks' ) },
	{ name: 'businessman', label: __( 'Businessman', 'elayne-blocks' ) },
	{ name: 'id', label: __( 'ID', 'elayne-blocks' ) },
	{ name: 'shield', label: __( 'Shield', 'elayne-blocks' ) },
	{ name: 'sos', label: __( 'SOS', 'elayne-blocks' ) },
	{ name: 'search', label: __( 'Search', 'elayne-blocks' ) },
	{ name: 'welcome-learn-more', label: __( 'Learn More', 'elayne-blocks' ) },
	{ name: 'info', label: __( 'Info', 'elayne-blocks' ) },
	{ name: 'megaphone', label: __( 'Megaphone', 'elayne-blocks' ) },
	{ name: 'chart-pie', label: __( 'Chart Pie', 'elayne-blocks' ) },
	{ name: 'chart-bar', label: __( 'Chart Bar', 'elayne-blocks' ) },
	{ name: 'analytics', label: __( 'Analytics', 'elayne-blocks' ) },
	{ name: 'money-alt', label: __( 'Money', 'elayne-blocks' ) },
	{ name: 'palmtree', label: __( 'Palmtree', 'elayne-blocks' ) },
	{ name: 'smiley', label: __( 'Smiley', 'elayne-blocks' ) },
];

/**
 * IconPicker Component
 *
 * @param {Object} props - Component props
 * @param {string} props.value - Current icon name or custom SVG
 * @param {Function} props.onChange - Callback when icon changes
 * @param {string} props.customSVG - Custom SVG code
 * @param {Function} props.onCustomSVGChange - Callback when custom SVG changes
 */
export default function IconPicker( {
	value,
	onChange,
	customSVG,
	onCustomSVGChange,
} ) {
	const [ showPicker, setShowPicker ] = useState( false );
	const [ iconType, setIconType ] = useState( customSVG ? 'custom' : 'dashicon' );
	const [ searchTerm, setSearchTerm ] = useState( '' );

	// Filter icons based on search
	const filteredIcons = DASHICONS.filter( ( icon ) =>
		icon.name.toLowerCase().includes( searchTerm.toLowerCase() ) ||
		icon.label.toLowerCase().includes( searchTerm.toLowerCase() )
	);

	return (
		<BaseControl
			label={ __( 'Icon', 'elayne-blocks' ) }
			help={ __( 'Choose a Dashicon or upload custom SVG', 'elayne-blocks' ) }
		>
			<ButtonGroup>
				<Button
					variant={ iconType === 'dashicon' ? 'primary' : 'secondary' }
					onClick={ () => setIconType( 'dashicon' ) }
				>
					{ __( 'Dashicon', 'elayne-blocks' ) }
				</Button>
				<Button
					variant={ iconType === 'custom' ? 'primary' : 'secondary' }
					onClick={ () => setIconType( 'custom' ) }
				>
					{ __( 'Custom SVG', 'elayne-blocks' ) }
				</Button>
			</ButtonGroup>

			{ iconType === 'dashicon' && (
				<div style={ { marginTop: '12px' } }>
					<Button
						variant="secondary"
						onClick={ () => setShowPicker( ! showPicker ) }
						style={ {
							display: 'flex',
							alignItems: 'center',
							gap: '8px',
							width: '100%',
							justifyContent: 'flex-start',
						} }
					>
						{ value && (
							<span
								className={ `dashicons dashicons-${ value }` }
								style={ { fontSize: '20px' } }
							/>
						) }
						<span>
							{ value
								? DASHICONS.find( ( i ) => i.name === value )
										?.label || value
								: __( 'Select Icon...', 'elayne-blocks' ) }
						</span>
					</Button>

					{ showPicker && (
						<Popover
							position="bottom left"
							onClose={ () => setShowPicker( false ) }
							style={ { width: '400px' } }
						>
							<div style={ { padding: '16px' } }>
								<SearchControl
									value={ searchTerm }
									onChange={ setSearchTerm }
									placeholder={ __(
										'Search icons...',
										'elayne-blocks'
									) }
								/>

								<div
									style={ {
										display: 'grid',
										gridTemplateColumns:
											'repeat(5, 1fr)',
										gap: '8px',
										marginTop: '12px',
										maxHeight: '300px',
										overflowY: 'auto',
									} }
								>
									{ filteredIcons.map( ( icon ) => (
										<Button
											key={ icon.name }
											variant={
												value === icon.name
													? 'primary'
													: 'secondary'
											}
											onClick={ () => {
												onChange( icon.name );
												onCustomSVGChange?.( '' );
												setShowPicker( false );
											} }
											style={ {
												height: '50px',
												display: 'flex',
												flexDirection: 'column',
												alignItems: 'center',
												justifyContent: 'center',
												padding: '8px',
											} }
											title={ icon.label }
										>
											<span
												className={ `dashicons dashicons-${ icon.name }` }
												style={ { fontSize: '24px' } }
											/>
										</Button>
									) ) }
								</div>

								{ filteredIcons.length === 0 && (
									<p
										style={ {
											textAlign: 'center',
											color: '#757575',
											marginTop: '16px',
										} }
									>
										{ __(
											'No icons found',
											'elayne-blocks'
										) }
									</p>
								) }
							</div>
						</Popover>
					) }

					{ value && (
						<Button
							variant="link"
							isDestructive
							onClick={ () => {
								onChange( '' );
								onCustomSVGChange?.( '' );
							} }
							style={ { marginTop: '8px' } }
						>
							{ __( 'Clear Icon', 'elayne-blocks' ) }
						</Button>
					) }
				</div>
			) }

			{ iconType === 'custom' && (
				<div style={ { marginTop: '12px' } }>
					<TextareaControl
						label={ __( 'Custom SVG Code', 'elayne-blocks' ) }
						value={ customSVG || '' }
						onChange={ ( svg ) => {
							onCustomSVGChange?.( svg );
							onChange( '' );
						} }
						placeholder={ __(
							'<svg>...</svg>',
							'elayne-blocks'
						) }
						help={ __(
							'Paste your custom SVG code here',
							'elayne-blocks'
						) }
						rows={ 6 }
					/>

					{ customSVG && (
						<div style={ { marginTop: '8px' } }>
							<p style={ { marginBottom: '4px', fontWeight: 600 } }>
								{ __( 'Preview:', 'elayne-blocks' ) }
							</p>
							<div
								style={ {
									padding: '12px',
									border: '1px solid #ddd',
									borderRadius: '4px',
									backgroundColor: '#f9f9f9',
								} }
								dangerouslySetInnerHTML={ {
									__html: customSVG,
								} }
							/>
						</div>
					) }
				</div>
			) }
		</BaseControl>
	);
}

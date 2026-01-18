/**
 * Animation Controls Component
 *
 * Enhanced animation settings with visual previews and intuitive controls.
 */
import { __ } from '@wordpress/i18n';
import {
	BaseControl,
	Button,
	RangeControl,
	ToggleControl,
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
} from '@wordpress/components';
import { useState, useEffect } from '@wordpress/element';

/**
 * Animation type options with descriptions
 */
const ANIMATION_TYPES = [
	{
		value: 'fade',
		label: __( 'Fade', 'elayne-blocks' ),
		description: __( 'Smooth fade in/out effect', 'elayne-blocks' ),
		icon: '○',
	},
	{
		value: 'slide',
		label: __( 'Slide', 'elayne-blocks' ),
		description: __( 'Slide down from top', 'elayne-blocks' ),
		icon: '↓',
	},
	{
		value: 'scale',
		label: __( 'Scale', 'elayne-blocks' ),
		description: __( 'Grow from center', 'elayne-blocks' ),
		icon: '⊕',
	},
	{
		value: 'slidefade',
		label: __( 'Slide + Fade', 'elayne-blocks' ),
		description: __( 'Combined slide and fade', 'elayne-blocks' ),
		icon: '⤓',
	},
];

/**
 * Animation speed presets
 */
const SPEED_PRESETS = [
	{ value: 150, label: __( 'Fast', 'elayne-blocks' ) },
	{ value: 300, label: __( 'Normal', 'elayne-blocks' ) },
	{ value: 500, label: __( 'Slow', 'elayne-blocks' ) },
];

/**
 * AnimationControls Component
 *
 * @param {Object} props - Component props
 * @param {string} props.animationType - Current animation type
 * @param {number} props.animationSpeed - Current animation speed in ms
 * @param {Function} props.onTypeChange - Callback when type changes
 * @param {Function} props.onSpeedChange - Callback when speed changes
 */
export default function AnimationControls( {
	animationType,
	animationSpeed,
	onTypeChange,
	onSpeedChange,
} ) {
	const [ isPlaying, setIsPlaying ] = useState( false );

	// Preview animation when type or speed changes
	const playPreview = () => {
		setIsPlaying( true );
		setTimeout( () => {
			setIsPlaying( false );
		}, animationSpeed );
	};

	return (
		<div className="elayne-animation-controls">
			{ /* Animation Type Selector */ }
			<BaseControl
				label={ __( 'Animation Type', 'elayne-blocks' ) }
				help={ __(
					'Choose how the mega menu appears and disappears',
					'elayne-blocks'
				) }
			>
				<div
					style={ {
						display: 'grid',
						gridTemplateColumns: '1fr 1fr',
						gap: '8px',
						marginTop: '8px',
					} }
				>
					{ ANIMATION_TYPES.map( ( type ) => (
						<Button
							key={ type.value }
							variant={
								animationType === type.value
									? 'primary'
									: 'secondary'
							}
							onClick={ () => onTypeChange( type.value ) }
							style={ {
								height: 'auto',
								padding: '12px',
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
								gap: '4px',
								textAlign: 'center',
							} }
						>
							<span style={ { fontSize: '24px', lineHeight: 1 } }>
								{ type.icon }
							</span>
							<span
								style={ {
									fontSize: '13px',
									fontWeight: 500,
								} }
							>
								{ type.label }
							</span>
							<span
								style={ {
									fontSize: '11px',
									opacity: 0.7,
									lineHeight: 1.3,
								} }
							>
								{ type.description }
							</span>
						</Button>
					) ) }
				</div>
			</BaseControl>

			{ /* Animation Speed */ }
			<div style={ { marginTop: '20px' } }>
				<BaseControl
					label={ __( 'Animation Speed', 'elayne-blocks' ) }
				>
					{ /* Speed Presets */ }
					<div
						style={ {
							display: 'flex',
							gap: '8px',
							marginBottom: '12px',
						} }
					>
						{ SPEED_PRESETS.map( ( preset ) => (
							<Button
								key={ preset.value }
								variant={
									animationSpeed === preset.value
										? 'primary'
										: 'secondary'
								}
								onClick={ () =>
									onSpeedChange( preset.value )
								}
								style={ { flex: 1 } }
							>
								{ preset.label }
							</Button>
						) ) }
					</div>

					{ /* Custom Speed Range */ }
					<RangeControl
						value={ animationSpeed }
						onChange={ onSpeedChange }
						min={ 100 }
						max={ 1000 }
						step={ 50 }
						help={ `${ animationSpeed }ms` }
						withInputField={ false }
					/>
				</BaseControl>
			</div>

			{ /* Preview Button */ }
			<div style={ { marginTop: '16px' } }>
				<Button
					variant="secondary"
					onClick={ playPreview }
					style={ { width: '100%' } }
				>
					{ __( 'Preview Animation', 'elayne-blocks' ) }
				</Button>

				{ /* Preview Box */ }
				<div
					style={ {
						marginTop: '12px',
						padding: '20px',
						border: '2px dashed #ddd',
						borderRadius: '4px',
						backgroundColor: '#f9f9f9',
						position: 'relative',
						overflow: 'hidden',
						minHeight: '100px',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
					} }
				>
					<div
						className={ `animation-preview ${ isPlaying ? 'is-playing' : '' }` }
						style={ {
							padding: '16px 24px',
							backgroundColor: '#fff',
							border: '1px solid #ddd',
							borderRadius: '4px',
							boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
							animation: isPlaying
								? `mega-menu-${ animationType } ${ animationSpeed }ms ease-out`
								: 'none',
							opacity: isPlaying ? 1 : 0.5,
						} }
					>
						{ __( 'Mega Menu', 'elayne-blocks' ) }
					</div>
				</div>
			</div>

			{ /* Animation CSS (injected into editor) */ }
			<style>
				{ `
				@keyframes mega-menu-fade {
					from {
						opacity: 0;
					}
					to {
						opacity: 1;
					}
				}

				@keyframes mega-menu-slide {
					from {
						opacity: 0;
						transform: translateY(-10px);
					}
					to {
						opacity: 1;
						transform: translateY(0);
					}
				}

				@keyframes mega-menu-scale {
					from {
						opacity: 0;
						transform: scale(0.95);
					}
					to {
						opacity: 1;
						transform: scale(1);
					}
				}

				@keyframes mega-menu-slidefade {
					from {
						opacity: 0;
						transform: translateY(-10px);
					}
					to {
						opacity: 1;
						transform: translateY(0);
					}
				}
				` }
			</style>
		</div>
	);
}

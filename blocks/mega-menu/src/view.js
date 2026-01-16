/**
 * WordPress Interactivity API for Mega Menu Block
 * Based on Human Made Mega Menu Block implementation
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/interactivity-api/
 * @see https://github.com/humanmade/hm-mega-menu-block
 */
import { store, getContext, getElement } from '@wordpress/interactivity';

const { state, actions } = store( 'elayne/mega-menu', {
	state: {
		get isMenuOpen() {
			return Object.values( state.menuOpenedBy ).filter( Boolean ).length > 0;
		},

		get menuOpenedBy() {
			const context = getContext();
			return context.menuOpenedBy || {};
		},
	},

	actions: {
		toggleMenuOnClick() {
			const context = getContext();
			const { ref } = getElement();

			if ( context.menuOpenedBy.click || context.menuOpenedBy.focus ) {
				actions.closeMenuOnClick();
			} else {
				context.previousFocus = ref;
				actions.openMenu( 'click' );
			}
		},

		closeMenuOnClick() {
			actions.closeMenu( 'click' );
			actions.closeMenu( 'focus' );
		},

		handleMenuKeydown( event ) {
			const context = getContext();
			if ( context.menuOpenedBy.click ) {
				// If Escape close the menu.
				if ( event?.key === 'Escape' ) {
					actions.closeMenuOnClick();
				}
			}
		},

		handleOutsideClick( event ) {
			const context = getContext();
			const megaMenu = context?.megaMenu;

			if ( ! megaMenu || megaMenu.contains( event.target ) ) {
				return;
			}

			actions.closeMenuOnClick();
		},

		openMenu( menuOpenedOn = 'click' ) {
			const context = getContext();
			const { layoutMode } = context;

			// Layout-specific open logic
			switch ( layoutMode ) {
				case 'overlay':
					actions.openOverlay();
					break;
				case 'sidebar':
					actions.openSidebar();
					break;
				case 'grid':
					actions.openGrid();
					break;
				default:
					actions.openDropdown();
			}

			context.menuOpenedBy[ menuOpenedOn ] = true;

			// Apply animation speed CSS variable
			if ( context.animationSpeed ) {
				const { ref } = getElement();
				ref.style.setProperty( '--mm-animation-speed', `${ context.animationSpeed }ms` );
			}
		},

		openOverlay() {
			// Add body class to prevent scrolling
			document.body.classList.add( 'mm-overlay-open' );
			document.body.style.overflow = 'hidden';
		},

		openSidebar() {
			// Add body class for sidebar mode
			document.body.classList.add( 'mm-sidebar-open' );

			// Initialize swipe handler for mobile
			const context = getContext();
			if ( context.isMobile ) {
				actions.initSwipeHandler();
			}
		},

		openDropdown() {
			// Default dropdown behavior (no special logic needed)
		},

		openGrid() {
			// Grid layout behavior (no special logic needed)
		},

		closeMenu( menuClosedOn = 'click' ) {
			const context = getContext();
			context.menuOpenedBy[ menuClosedOn ] = false;

			// Cleanup layout-specific states
			if ( ! state.isMenuOpen ) {
				document.body.classList.remove( 'mm-overlay-open', 'mm-sidebar-open' );
				document.body.style.overflow = '';

				// Reset the menu reference and button focus when closed
				if ( context.megaMenu?.contains( window.document.activeElement ) ) {
					context.previousFocus?.focus();
				}
				context.previousFocus = null;
				context.megaMenu = null;
			}
		},

		initSwipeHandler() {
			const context = getContext();
			const { ref } = getElement();

			let touchStartX = 0;
			let touchEndX = 0;

			const handleSwipe = () => {
				const swipeDistance = touchEndX - touchStartX;

				// Threshold: 50px swipe required
				if ( Math.abs( swipeDistance ) > 50 ) {
					const { sidebarDirection } = context;

					// Close on swipe in correct direction
					if (
						( sidebarDirection === 'left' && swipeDistance < 0 ) ||
						( sidebarDirection === 'right' && swipeDistance > 0 )
					) {
						actions.closeMenuOnClick();
					}
				}
			};

			const menuContainer = ref.querySelector( '.elayne-mega-menu, .wp-block-elayne-mega-menu__menu-container' );
			if ( ! menuContainer ) {
				return;
			}

			menuContainer.addEventListener( 'touchstart', ( e ) => {
				touchStartX = e.touches[ 0 ].clientX;
			}, { passive: true } );

			menuContainer.addEventListener( 'touchend', ( e ) => {
				touchEndX = e.changedTouches[ 0 ].clientX;
				handleSwipe();
			}, { passive: true } );
		},
	},

	callbacks: {
		initMenu() {
			const context = getContext();
			const { ref } = getElement();

			// Set the menu reference when initialized
			if ( state.isMenuOpen ) {
				context.megaMenu = ref;
			}

			// Update mobile state on initialization
			actions.updateMobileState();

			// Add resize listener for mobile detection
			if ( ! context.resizeListenerAdded ) {
				window.addEventListener( 'resize', actions.updateMobileState );
				context.resizeListenerAdded = true;
			}
		},

		updateMobileState() {
			const context = getContext();
			const breakpoint = context.mobileBreakpoint || 768;
			context.isMobile = window.innerWidth < breakpoint;
		},
	},
} );

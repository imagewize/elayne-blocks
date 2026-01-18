/**
 * WordPress Interactivity API for Mega Menu Block
 * Phase 2C: Enhanced with layout-specific logic and positioning
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/interactivity-api/
 */
import { store, getContext, getElement } from '@wordpress/interactivity';

/**
 * Calculate dropdown position with collision detection
 * Hybrid approach: flip for large overflows, nudge for small ones
 *
 * @param {HTMLElement} panel - Menu panel element
 * @param {string} alignment - Dropdown alignment setting
 * @return {Object} Positioning data
 */
function calculateDropdownPosition( panel, alignment ) {
	if ( alignment !== 'auto' ) {
		return {};
	}

	const panelRect = panel.getBoundingClientRect();
	const viewportWidth = window.innerWidth;
	const overflowRight = panelRect.right - viewportWidth;

	// If overflow is significant (>100px), flip to right alignment
	if ( overflowRight > 100 ) {
		return {
			flipHorizontal: true,
			nudgeLeft: 0,
		};
	}

	// If minor overflow, nudge left slightly with 20px buffer
	if ( overflowRight > 0 ) {
		return {
			flipHorizontal: false,
			nudgeLeft: overflowRight + 20,
		};
	}

	// No overflow, keep default position
	return {
		flipHorizontal: false,
		nudgeLeft: 0,
	};
}

const { state, actions } = store( 'elayne/mega-menu', {
	state: {
		get isMenuOpen() {
			const context = getContext();
			return context.isOpen || false;
		},

		get isMobile() {
			return window.innerWidth < 768;
		},
	},

	actions: {
		toggleMenu() {
			const context = getContext();
			if ( context.isOpen ) {
				actions.closeMenu();
			} else {
				actions.openMenu();
			}
		},

		toggleMenuOnClick() {
			const context = getContext();
			const { ref } = getElement();

			if ( context.menuOpenedBy.click || context.menuOpenedBy.focus ) {
				actions.closeMenu();
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

			// ESC key closes menu
			if ( event?.key === 'Escape' && context.isOpen ) {
				actions.closeMenu();
				event.preventDefault();
			}

			// Tab key focus trap (for overlay/sidebar modes)
			if ( event?.key === 'Tab' && context.isOpen ) {
				const { layoutMode } = context;

				// Only trap focus in overlay and sidebar modes
				if ( layoutMode === 'overlay' || layoutMode === 'sidebar' ) {
					const { firstFocusable, lastFocusable } = context;

					if ( event.shiftKey && document.activeElement === firstFocusable ) {
						event.preventDefault();
						lastFocusable?.focus();
					} else if ( ! event.shiftKey && document.activeElement === lastFocusable ) {
						event.preventDefault();
						firstFocusable?.focus();
					}
				}
			}

			// Legacy support
			if ( context.menuOpenedBy?.click ) {
				if ( event?.key === 'Escape' ) {
					actions.closeMenuOnClick();
				}
			}
		},

		handleOutsideClick( event ) {
			const context = getContext();
			const { ref } = getElement();

			if ( ! context.isOpen ) {
				return;
			}

			const isClickInside = ref.contains( event.target );
			if ( ! isClickInside ) {
				actions.closeMenu();
			}

			// Legacy support
			const megaMenu = context?.megaMenu;
			if ( megaMenu && ! megaMenu.contains( event.target ) ) {
				actions.closeMenuOnClick();
			}
		},

		openMenu( menuOpenedOn = 'click' ) {
			const context = getContext();
			const { ref } = getElement();
			const { layoutMode, dropdownAlignment } = context;

			// Layout-specific open logic (BEFORE setting isOpen)
			switch ( layoutMode ) {
				case 'dropdown':
					// Calculate positioning for dropdown BEFORE making visible
					if ( dropdownAlignment === 'auto' ) {
						const panel = ref.querySelector( '.wp-block-elayne-mega-menu__panel' );
						if ( panel ) {
							// Temporarily make visible for measurement (without opacity)
							panel.style.visibility = 'hidden';
							panel.style.opacity = '0';
							panel.classList.add( 'is-open' );

							// Get measurements with panel rendered but invisible
							const { flipHorizontal, nudgeLeft } = calculateDropdownPosition(
								panel,
								dropdownAlignment
							);

							// Apply positioning
							if ( flipHorizontal ) {
								// Significant overflow: flip to right alignment
								panel.classList.add( 'flip-horizontal' );
								panel.style.left = '';
								panel.style.right = '0';
							} else if ( nudgeLeft > 0 ) {
								// Minor overflow: nudge left with buffer
								panel.classList.remove( 'flip-horizontal' );
								panel.style.left = `-${ nudgeLeft }px`;
								panel.style.right = '';
							} else {
								// No overflow: reset to default
								panel.classList.remove( 'flip-horizontal' );
								panel.style.left = '';
								panel.style.right = '';
							}

							// Remove temporary visibility styles
							panel.style.visibility = '';
							panel.style.opacity = '';
							panel.classList.remove( 'is-open' );
						}
					}
					break;

				case 'overlay':
					// Lock body scroll
					document.body.classList.add( 'mega-menu-overlay-open' );
					break;

				case 'sidebar':
					// Lock body scroll
					document.body.classList.add( 'mega-menu-sidebar-open' );
					// Initialize swipe handler for mobile
					if ( state.isMobile ) {
						actions.initSwipeHandler();
					}
					break;

				case 'grid':
					// No special logic needed for grid
					break;
			}

			// Set open state AFTER positioning is calculated
			context.isOpen = true;

			// Track how menu was opened (for legacy support)
			if ( menuOpenedOn && context.menuOpenedBy ) {
				context.menuOpenedBy[ menuOpenedOn ] = true;
			}

			// Apply animation speed CSS variable
			if ( context.animationSpeed ) {
				ref.style.setProperty( '--mm-animation-speed', `${ context.animationSpeed }ms` );
			}

			// Set focus trap
			actions.setFocusTrap();
		},

		openOverlay() {
			// Add body class to prevent scrolling
			document.body.classList.add( 'mega-menu-overlay-open' );
		},

		openSidebar() {
			// Add body class for sidebar mode
			document.body.classList.add( 'mega-menu-sidebar-open' );

			// Initialize swipe handler for mobile
			if ( state.isMobile ) {
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
			const { ref } = getElement();
			const { layoutMode } = context;

			// Set closed state
			context.isOpen = false;

			// Track close event (for legacy support)
			if ( menuClosedOn && context.menuOpenedBy ) {
				context.menuOpenedBy[ menuClosedOn ] = false;
			}

			// Layout-specific close logic
			switch ( layoutMode ) {
				case 'dropdown':
					const panel = ref.querySelector( '.wp-block-elayne-mega-menu__panel' );
					if ( panel ) {
						panel.classList.remove( 'flip-horizontal' );
						panel.style.left = ''; // Reset inline styles
						panel.style.right = ''; // Reset inline styles
					}
					break;

				case 'overlay':
					document.body.classList.remove( 'mega-menu-overlay-open' );
					break;

				case 'sidebar':
					document.body.classList.remove( 'mega-menu-sidebar-open' );
					break;
			}

			// Return focus to trigger
			actions.returnFocus();
		},

		setFocusTrap() {
			const context = getContext();
			const { ref } = getElement();
			const panel = ref.querySelector( '.wp-block-elayne-mega-menu__panel' );

			if ( ! panel ) {
				return;
			}

			const focusableElements = panel.querySelectorAll(
				'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
			);

			context.firstFocusable = focusableElements[ 0 ];
			context.lastFocusable = focusableElements[ focusableElements.length - 1 ];

			// Focus first element after a short delay
			setTimeout( () => {
				context.firstFocusable?.focus();
			}, 100 );
		},

		returnFocus() {
			const { ref } = getElement();
			const trigger = ref.querySelector( '.wp-block-elayne-mega-menu__trigger' );
			trigger?.focus();
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

		updateMobileState() {
			const context = getContext();
			const breakpoint = context.mobileBreakpoint || 768;
			context.isMobile = window.innerWidth < breakpoint;
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
	},
} );

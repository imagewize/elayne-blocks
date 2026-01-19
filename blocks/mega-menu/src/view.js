/**
 * WordPress Interactivity API for Mega Menu Block
 * Phase 2C: Enhanced with layout-specific logic
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/interactivity-api/
 */
import { store, getContext, getElement } from '@wordpress/interactivity';

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

			// Tab key focus trap (for overlay mode)
			if ( event?.key === 'Tab' && context.isOpen ) {
				const { layoutMode } = context;

				// Only trap focus in overlay mode
				if ( layoutMode === 'overlay' ) {
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
			const { layoutMode } = context;

			// Layout-specific open logic
			if ( layoutMode === 'overlay' ) {
				// Lock body scroll
				document.body.classList.add( 'mega-menu-overlay-open' );
			}

			// Set open state
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

		closeMenu( menuClosedOn = 'click' ) {
			const context = getContext();
			const { layoutMode } = context;

			// Set closed state
			context.isOpen = false;

			// Track close event (for legacy support)
			if ( menuClosedOn && context.menuOpenedBy ) {
				context.menuOpenedBy[ menuClosedOn ] = false;
			}

			// Layout-specific close logic
			if ( layoutMode === 'overlay' ) {
				document.body.classList.remove( 'mega-menu-overlay-open' );
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

		updateMobileState() {
			const context = getContext();
			const breakpoint = context.mobileBreakpoint || 768;
			context.isMobile = window.innerWidth < breakpoint;
		},

		positionFullWidthPanel() {
			const { ref } = getElement();
			const panel = ref.querySelector( '.wp-block-elayne-mega-menu__panel.mm-full-width' );

			if ( ! panel ) {
				return;
			}

			// Get the navigation container's position
			const nav = ref.closest( '.wp-block-navigation' );
			if ( ! nav ) {
				return;
			}

			const navRect = nav.getBoundingClientRect();

			// Get dropdown spacing from CSS variable
			const computedStyle = getComputedStyle( ref );
			const dropdownSpacing = parseInt( computedStyle.getPropertyValue( '--mm-dropdown-spacing' ) ) || 16;

			// Calculate position to align panel with navigation container
			const topPosition = navRect.bottom + dropdownSpacing; // Position below nav with spacing
			const leftPosition = navRect.left;

			// Apply positioning
			panel.style.top = `${ topPosition }px`;
			panel.style.left = `${ leftPosition }px`;
			panel.style.transform = 'none';
			panel.style.width = `${ navRect.width }px`;
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

			// Position full-width panels
			actions.positionFullWidthPanel();

			// Add resize listener for mobile detection and full-width positioning
			if ( ! context.resizeListenerAdded ) {
				window.addEventListener( 'resize', () => {
					actions.updateMobileState();
					actions.positionFullWidthPanel();
				} );
				context.resizeListenerAdded = true;
			}
		},
	},
} );

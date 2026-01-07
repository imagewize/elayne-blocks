/**
 * Search Overlay Trigger Block - Frontend Functionality
 * Creates and manages the full-screen search overlay
 */
(function() {
	'use strict';

	// Only initialize once
	if (document.getElementById('search-overlay')) {
		return;
	}

	// Create overlay structure dynamically
	const overlay = document.createElement('div');
	overlay.id = 'search-overlay';
	overlay.className = 'search-overlay';
	overlay.style.display = 'none';

	overlay.innerHTML = `
		<div class="search-overlay-backdrop"></div>
		<div class="search-overlay-content">
			<button id="search-overlay-close" class="search-overlay-close" aria-label="Close search">
				<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
				</svg>
			</button>
			<div class="search-overlay-form">
				<form role="search" method="get" class="search-form-overlay">
					<div class="search-form-wrapper">
						<input type="search" class="search-field-overlay" placeholder="Search..." name="s" required />
						<button type="submit" class="search-submit-overlay" aria-label="Search">
							<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" style="width:24px;height:24px;">
								<g data-name="search">
									<path d="M20.71 19.29l-3.4-3.39A7.92 7.92 0 0 0 19 11a8 8 0 1 0-8 8 7.92 7.92 0 0 0 4.9-1.69l3.39 3.4a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42zM5 11a6 6 0 1 1 6 6 6 6 0 0 1-6-6z"></path>
								</g>
							</svg>
						</button>
					</div>
				</form>
			</div>
		</div>
	`;

	// Append to body when DOM is ready
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', function() {
			document.body.appendChild(overlay);
			initializeOverlay();
		});
	} else {
		document.body.appendChild(overlay);
		initializeOverlay();
	}

	function initializeOverlay() {
		// Get references
		const triggers = document.querySelectorAll('.search-overlay-trigger');
		const closeBtn = overlay.querySelector('#search-overlay-close');
		const backdrop = overlay.querySelector('.search-overlay-backdrop');
		const searchField = overlay.querySelector('.search-field-overlay');

		// Open overlay
		function openOverlay() {
			overlay.style.display = 'block';
			// Force reflow for transition
			overlay.offsetHeight;
			overlay.classList.add('active');
			document.body.classList.add('search-overlay-open');

			// Focus search field after animation
			setTimeout(() => {
				searchField.focus();
			}, 100);
		}

		// Close overlay
		function closeOverlay() {
			overlay.classList.remove('active');
			document.body.classList.remove('search-overlay-open');

			// Hide after transition
			setTimeout(() => {
				overlay.style.display = 'none';
				searchField.value = '';
			}, 300);
		}

		// Event listeners for all triggers
		triggers.forEach(function(trigger) {
			trigger.addEventListener('click', openOverlay);
			trigger.style.cursor = 'pointer';
		});

		closeBtn.addEventListener('click', closeOverlay);
		backdrop.addEventListener('click', closeOverlay);

		// Close on Escape key
		document.addEventListener('keydown', (e) => {
			if (e.key === 'Escape' && overlay.classList.contains('active')) {
				closeOverlay();
			}
		});

		// Prevent clicks inside overlay content from closing
		overlay.querySelector('.search-overlay-form').addEventListener('click', (e) => {
			e.stopPropagation();
		});
	}
})();

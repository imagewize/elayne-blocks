/**
 * FAQ Tabs Frontend Functionality
 *
 * Handles the interactive tab switching and content display on the frontend.
 * Works with the InnerBlocks pattern where FAQ answers are child blocks.
 *
 * Desktop: Two-column layout with tabs on left, content on right
 * Mobile: Accordion layout with questions and answers stacked
 */
document.addEventListener('DOMContentLoaded', function () {
	// Mobile breakpoint (matches CSS media query)
	const MOBILE_BREAKPOINT = 781;

	// Find all FAQ tabs blocks on the page
	const faqBlocks = document.querySelectorAll('.faq-tabs-wrapper');

	faqBlocks.forEach((block) => {
		// Get the tab navigation container and all answer blocks
		const tabsContainer = block.querySelector('.faq-vertical-tabs');
		const contentArea = block.querySelector('.faq-content-area');
		const answerBlocks = contentArea.querySelectorAll('.faq-tab-answer');

		if (!tabsContainer || !answerBlocks.length) {
			return; // Exit if elements not found
		}

		// Check if we're on mobile
		function isMobile() {
			return window.innerWidth <= MOBILE_BREAKPOINT;
		}

		// Desktop tab functionality
		function initDesktopTabs() {
			// Clear existing tabs
			tabsContainer.innerHTML = '';

			// Build tabs from answer blocks
			answerBlocks.forEach((answerBlock, index) => {
				const question = answerBlock.getAttribute('data-question') || `Question ${index + 1}`;

				// Create tab item
				const tabItem = document.createElement('div');
				tabItem.className = `faq-tab-item ${index === 0 ? 'active' : ''}`;
				tabItem.setAttribute('data-tab-index', index);

				// Create question text
				const tabQuestion = document.createElement('div');
				tabQuestion.className = 'tab-question';
				tabQuestion.textContent = question;

				// Create arrow icon
				const arrowCircle = document.createElement('div');
				arrowCircle.className = 'tab-arrow-circle';
				arrowCircle.innerHTML = `
					<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M6 4L10 8L6 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
					</svg>
				`;

				tabItem.appendChild(tabQuestion);
				tabItem.appendChild(arrowCircle);
				tabsContainer.appendChild(tabItem);

				// Add click handler for desktop tabs
				tabItem.addEventListener('click', function () {
					// Remove active from all tabs
					tabsContainer.querySelectorAll('.faq-tab-item').forEach(tab => {
						tab.classList.remove('active');
					});

					// Remove active from all answer blocks
					answerBlocks.forEach(block => {
						block.classList.remove('active');
					});

					// Add active to clicked tab
					this.classList.add('active');

					// Add active to corresponding answer block
					answerBlock.classList.add('active');
				});
			});

			// Show first answer by default on desktop
			if (answerBlocks[0]) {
				answerBlocks[0].classList.add('active');
			}

			// Hide all other answers
			answerBlocks.forEach((block, index) => {
				if (index !== 0) {
					block.classList.remove('active');
				}
			});
		}

		// Mobile accordion functionality
		function initMobileAccordion() {
			// Clear existing tabs
			tabsContainer.innerHTML = '';

			// Move each answer block to appear after its question
			answerBlocks.forEach((answerBlock, index) => {
				const question = answerBlock.getAttribute('data-question') || `Question ${index + 1}`;

				// Create accordion item (question button)
				const accordionItem = document.createElement('div');
				accordionItem.className = 'faq-accordion-item';
				accordionItem.setAttribute('data-accordion-index', index);

				// Create question button
				const accordionButton = document.createElement('button');
				accordionButton.className = 'faq-accordion-button';
				accordionButton.setAttribute('aria-expanded', 'false');

				// Create question text
				const accordionQuestion = document.createElement('div');
				accordionQuestion.className = 'tab-question';
				accordionQuestion.textContent = question;

				// Create arrow icon
				const arrowCircle = document.createElement('div');
				arrowCircle.className = 'tab-arrow-circle';
				arrowCircle.innerHTML = `
					<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M6 4L10 8L6 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
					</svg>
				`;

				accordionButton.appendChild(accordionQuestion);
				accordionButton.appendChild(arrowCircle);
				accordionItem.appendChild(accordionButton);

				// Clone the answer block to appear after the question
				const answerClone = answerBlock.cloneNode(true);
				answerClone.classList.add('faq-accordion-content');
				answerClone.classList.remove('active');
				accordionItem.appendChild(answerClone);

				// Add to tabs container
				tabsContainer.appendChild(accordionItem);

				// Add click handler for accordion
				accordionButton.addEventListener('click', function () {
					const isExpanded = accordionButton.getAttribute('aria-expanded') === 'true';

					// Toggle this accordion
					accordionButton.setAttribute('aria-expanded', !isExpanded);
					accordionButton.classList.toggle('active');
					answerClone.classList.toggle('active');
				});
			});

			// Hide the original content area on mobile (we're using clones)
			contentArea.style.display = 'none';
		}

		// Initialize based on viewport
		function init() {
			if (isMobile()) {
				// Reset content area visibility
				contentArea.style.display = '';
				initMobileAccordion();
			} else {
				// Reset content area visibility
				contentArea.style.display = '';
				initDesktopTabs();
			}
		}

		// Initial setup
		init();

		// Handle resize
		let resizeTimer;
		window.addEventListener('resize', function () {
			clearTimeout(resizeTimer);
			resizeTimer = setTimeout(function () {
				init();
			}, 250);
		});
	});
});

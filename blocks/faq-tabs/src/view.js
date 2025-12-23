/**
 * FAQ Tabs Frontend Functionality
 *
 * Handles the interactive tab switching and content display on the frontend.
 * Works with the InnerBlocks pattern where FAQ answers are child blocks.
 */
document.addEventListener('DOMContentLoaded', function () {
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

			// Add click handler
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

		// Show first answer by default
		if (answerBlocks[0]) {
			answerBlocks[0].classList.add('active');
		}
	});
});

/**
 * FAQ Tabs Frontend Functionality
 *
 * Handles the interactive tab switching and content updates on the frontend.
 */
document.addEventListener('DOMContentLoaded', function () {
	// Find all FAQ tabs blocks on the page
	const faqBlocks = document.querySelectorAll('.faq-tabs-wrapper');

	faqBlocks.forEach((block) => {
		// Get all tab items and content elements within this block
		const tabItems = block.querySelectorAll('.faq-tab-item');
		const answerTitle = block.querySelector('.faq-answer-title');
		const answerDescription = block.querySelector('.faq-answer-description');

		if (!tabItems.length || !answerTitle || !answerDescription) {
			return; // Exit if elements not found
		}

		// Build content array from data attributes
		const faqContent = Array.from(tabItems).map((item) => {
			const tabIndex = parseInt(item.getAttribute('data-tab-index'));
			return {
				title: item.querySelector('.tab-question')?.textContent || '',
				description: item.querySelector('.tab-question')?.textContent || '',
			};
		});

		// Get actual content from save function
		// Since we save the first item's content, we need to extract all from DOM
		const contentData = [];
		tabItems.forEach((item, index) => {
			const question = item.querySelector('.tab-question')?.textContent;
			// We'll populate this from the block's saved data
			contentData.push({
				question: question,
				title: index === 0 ? answerTitle.textContent : question,
				description: index === 0 ? answerDescription.textContent : '',
			});
		});

		// Function to update content box
		function updateContent(index, title, description) {
			// Add fade transition
			answerTitle.style.opacity = '0';
			answerDescription.style.opacity = '0';

			setTimeout(function () {
				answerTitle.textContent = title;
				answerDescription.textContent = description;

				answerTitle.style.opacity = '1';
				answerDescription.style.opacity = '1';
			}, 200);
		}

		// Add click handlers to tab items
		tabItems.forEach(function (item, index) {
			item.addEventListener('click', function () {
				// Remove active class from all tabs
				tabItems.forEach(function (tab) {
					tab.classList.remove('active');
				});

				// Add active class to clicked tab
				this.classList.add('active');

				// Get data from the block's attributes (stored in script tag)
				const scriptTag = block.querySelector(
					'script[type="application/json"]'
				);
				if (scriptTag) {
					try {
						const data = JSON.parse(scriptTag.textContent);
						if (data.questions && data.questions[index]) {
							updateContent(
								index,
								data.questions[index].title,
								data.questions[index].description
							);
						}
					} catch (e) {
						console.error('Error parsing FAQ data:', e);
					}
				}
			});
		});

		// Add transition styles
		answerTitle.style.transition = 'opacity 0.3s ease-in-out';
		answerDescription.style.transition = 'opacity 0.3s ease-in-out';
	});
});

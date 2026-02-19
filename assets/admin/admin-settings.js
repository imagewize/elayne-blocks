/**
 * Admin Settings Page JavaScript
 *
 * Handles bulk actions and parent-child block dependencies.
 *
 * @package ELayneBlocks
 */

(function ($) {
	'use strict';

	$(document).ready(function () {
		// Handle Enable All button.
		$('#elayne-enable-all').on('click', function (e) {
			e.preventDefault();
			$('.elayne-block-checkbox').prop('checked', true);
		});

		// Handle Disable All button.
		$('#elayne-disable-all').on('click', function (e) {
			e.preventDefault();
			$('.elayne-block-checkbox').prop('checked', false);
		});

		// Handle parent-child dependencies.
		function handleDependencies() {
			// Carousel -> Slide dependency.
			const carouselCheckbox = $('#elayne_blocks_carousel');
			const slideCheckbox = $('#elayne_blocks_slide');

			if (carouselCheckbox.length && slideCheckbox.length) {
				if (!carouselCheckbox.prop('checked')) {
					slideCheckbox.prop('checked', false).prop('disabled', true);
				} else {
					slideCheckbox.prop('disabled', false);
				}
			}

			// FAQ Tabs -> FAQ Tab Answer dependency.
			const faqTabsCheckbox = $('#elayne_blocks_faq-tabs');
			const faqTabAnswerCheckbox = $('#elayne_blocks_faq-tab-answer');

			if (faqTabsCheckbox.length && faqTabAnswerCheckbox.length) {
				if (!faqTabsCheckbox.prop('checked')) {
					faqTabAnswerCheckbox.prop('checked', false).prop('disabled', true);
				} else {
					faqTabAnswerCheckbox.prop('disabled', false);
				}
			}
		}

		// Run on page load.
		handleDependencies();

		// Run when checkboxes change.
		$('.elayne-block-checkbox').on('change', function () {
			handleDependencies();
		});

		// Warn before disabling parent blocks with dependent children.
		$('#elayne_blocks_carousel, #elayne_blocks_faq-tabs').on('change', function () {
			const isChecked = $(this).prop('checked');
			const blockId = $(this).attr('id');
			let dependentBlockName = '';

			if (blockId === 'elayne_blocks_carousel') {
				dependentBlockName = 'Slide';
			} else if (blockId === 'elayne_blocks_faq-tabs') {
				dependentBlockName = 'FAQ Tab Answer';
			}

			if (!isChecked && dependentBlockName) {
				const message =
					'Disabling this block will also disable the ' +
					dependentBlockName +
					' block. Continue?';

				if (!confirm(message)) {
					$(this).prop('checked', true);
					handleDependencies();
				}
			}
		});
	});
})(jQuery);

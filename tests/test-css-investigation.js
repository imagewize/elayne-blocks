/**
 * Mega Menu CSS Investigation Test
 * Deep dive into what's setting right/bottom values
 */

const playwright = require( 'playwright' );

( async () => {
	console.log( '🔬 Starting CSS Investigation\n' );

	const browser = await playwright.chromium.launch( {
		headless: false,
		slowMo: 500,
	} );

	const context = await browser.newContext( {
		viewport: { width: 1920, height: 1080 },
	} );

	const page = await context.newPage();

	try {
		// Navigate to test site
		console.log( '📍 Navigating to http://demo.imagewize.test' );
		await page.goto( 'http://demo.imagewize.test', { waitUntil: 'networkidle' } );
		console.log( '✅ Page loaded\n' );

		// Find and click toggle
		const toggle = page.locator( '.wp-block-elayne-mega-menu__toggle' ).first();
		await toggle.click();
		console.log( '✅ Menu opened\n' );

		// Wait for animations
		await page.waitForTimeout( 500 );

		// Get the panel
		const panel = page.locator( '.wp-block-elayne-mega-menu__panel' ).first();

		// Get all computed styles related to positioning
		const positioningData = await panel.evaluate( ( el ) => {
			const computed = window.getComputedStyle( el );
			const inline = el.style;

			return {
				computed: {
					position: computed.position,
					top: computed.top,
					right: computed.right,
					bottom: computed.bottom,
					left: computed.left,
					width: computed.width,
					height: computed.height,
					transform: computed.transform,
				},
				inline: {
					position: inline.position,
					top: inline.top,
					right: inline.right,
					bottom: inline.bottom,
					left: inline.left,
					width: inline.width,
					height: inline.height,
					transform: inline.transform,
				},
				classes: el.className,
				hasFlipClass: el.classList.contains( 'flip-horizontal' ),
			};
		} );

		console.log( '📊 Computed Styles (from CSS):' );
		console.log( JSON.stringify( positioningData.computed, null, 2 ) );
		console.log( '\n📊 Inline Styles (from JS):' );
		console.log( JSON.stringify( positioningData.inline, null, 2 ) );
		console.log( '\n📊 Classes:' );
		console.log( positioningData.classes );
		console.log( '\n📊 Has flip-horizontal class:', positioningData.hasFlipClass );

		// Now let's check which CSS rules are actually applying
		const cssRules = await panel.evaluate( ( el ) => {
			const matchedRules = [];
			const sheets = Array.from( document.styleSheets );

			sheets.forEach( ( sheet ) => {
				try {
					const rules = Array.from( sheet.cssRules || [] );
					rules.forEach( ( rule ) => {
						if ( rule.selectorText && el.matches( rule.selectorText ) ) {
							const positionProps = {};
							if ( rule.style.position ) positionProps.position = rule.style.position;
							if ( rule.style.top ) positionProps.top = rule.style.top;
							if ( rule.style.right ) positionProps.right = rule.style.right;
							if ( rule.style.bottom ) positionProps.bottom = rule.style.bottom;
							if ( rule.style.left ) positionProps.left = rule.style.left;

							if ( Object.keys( positionProps ).length > 0 ) {
								matchedRules.push( {
									selector: rule.selectorText,
									props: positionProps,
								} );
							}
						}
					} );
				} catch ( e ) {
					// Skip CORS-blocked stylesheets
				}
			} );

			return matchedRules;
		} );

		console.log( '\n📋 Matched CSS Rules Setting Position Properties:' );
		cssRules.forEach( ( rule ) => {
			console.log( `\n   Selector: ${ rule.selector }` );
			console.log( `   Props: ${ JSON.stringify( rule.props, null, 2 ) }` );
		} );

		console.log( '\n✅ Investigation complete!' );
	} catch ( error ) {
		console.error( '❌ Test failed:', error );
	} finally {
		await browser.close();
		console.log( '\n🔚 Browser closed' );
	}
} )();

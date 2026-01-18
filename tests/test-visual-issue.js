/**
 * Visual Investigation - See What's Actually Wrong
 */

const playwright = require( 'playwright' );
const path = require( 'path' );

( async () => {
	console.log( '📸 Starting Visual Investigation\n' );

	const browser = await playwright.chromium.launch( {
		headless: false,
		slowMo: 500,
	} );

	const context = await browser.newContext( {
		viewport: { width: 1920, height: 1080 },
	} );

	const page = await context.newPage();

	try {
		console.log( '📍 Navigating to http://demo.imagewize.test' );
		await page.goto( 'http://demo.imagewize.test', { waitUntil: 'networkidle' } );
		console.log( '✅ Page loaded\n' );

		// Take screenshot before opening
		await page.screenshot( {
			path: path.join( __dirname, 'screenshots', 'visual-before.png' ),
			fullPage: true,
		} );
		console.log( '📸 Screenshot saved: visual-before.png\n' );

		// Find toggle
		const toggle = page.locator( '.wp-block-elayne-mega-menu__toggle' ).first();
		const toggleText = await toggle.textContent();
		console.log( `🔍 Found toggle: "${ toggleText.trim() }"\n` );

		// Get toggle position
		const toggleBox = await toggle.boundingBox();
		console.log( '📏 Toggle position:' );
		console.log( `   X: ${ toggleBox.x }px` );
		console.log( `   Y: ${ toggleBox.y }px` );
		console.log( `   Width: ${ toggleBox.width }px` );
		console.log( `   Height: ${ toggleBox.height }px\n` );

		// Click it
		await toggle.click();
		console.log( '✅ Clicked toggle\n' );

		// Wait for menu to open
		await page.waitForTimeout( 500 );

		// Take screenshot after opening
		await page.screenshot( {
			path: path.join( __dirname, 'screenshots', 'visual-after.png' ),
			fullPage: true,
		} );
		console.log( '📸 Screenshot saved: visual-after.png\n' );

		// Get panel position
		const panel = page.locator( '.wp-block-elayne-mega-menu__panel' ).first();
		const panelBox = await panel.boundingBox();
		console.log( '📏 Panel position:' );
		console.log( `   X: ${ panelBox.x }px` );
		console.log( `   Y: ${ panelBox.y }px` );
		console.log( `   Width: ${ panelBox.width }px` );
		console.log( `   Height: ${ panelBox.height }px\n` );

		// Calculate viewport overflow
		const viewportWidth = 1920;
		const panelRight = panelBox.x + panelBox.width;
		const overflow = panelRight - viewportWidth;

		console.log( '📊 Overflow Analysis:' );
		console.log( `   Panel right edge: ${ panelRight }px` );
		console.log( `   Viewport width: ${ viewportWidth }px` );
		console.log( `   Overflow: ${ overflow }px` );

		if ( overflow > 0 ) {
			console.log( '\n❌ PROBLEM FOUND: Panel extends beyond viewport!' );
			console.log( `   The panel is sticking out ${ overflow }px beyond the right edge\n` );
		} else {
			console.log( '\n✅ No viewport overflow detected\n' );
		}

		// Check if menu is actually visible
		const isVisible = await panel.isVisible();
		console.log( `📋 Panel visible: ${ isVisible }` );

		// Get opacity
		const opacity = await panel.evaluate( ( el ) => window.getComputedStyle( el ).opacity );
		console.log( `📋 Panel opacity: ${ opacity }` );

		// Highlight the panel with a red border for visual debugging
		await panel.evaluate( ( el ) => {
			el.style.outline = '5px solid red';
			el.style.outlineOffset = '0';
		} );

		await page.waitForTimeout( 1000 );

		// Take final screenshot with highlighted panel
		await page.screenshot( {
			path: path.join( __dirname, 'screenshots', 'visual-highlighted.png' ),
			fullPage: true,
		} );
		console.log( '\n📸 Screenshot with highlighted panel saved: visual-highlighted.png' );

		console.log( '\n✅ Visual investigation complete!' );
		console.log( 'Check the screenshots folder to see the actual issue.' );
	} catch ( error ) {
		console.error( '❌ Test failed:', error );
	} finally {
		await page.waitForTimeout( 2000 ); // Keep browser open for 2 seconds
		await browser.close();
		console.log( '\n🔚 Browser closed' );
	}
} )();

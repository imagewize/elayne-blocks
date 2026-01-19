/**
 * Check if the updated JavaScript is loaded
 */

const playwright = require( 'playwright' );

( async () => {
	console.log( '🔍 Checking if updated JS is loaded\n' );

	const browser = await playwright.chromium.launch( {
		headless: false,
	} );

	const context = await browser.newContext( {
		viewport: { width: 1920, height: 1080 },
	} );

	const page = await context.newPage();

	try {
		// Listen to console messages
		page.on( 'console', ( msg ) => {
			console.log( `   Browser console: ${ msg.text() }` );
		} );

		await page.goto( 'http://demo.imagewize.test', { waitUntil: 'networkidle' } );
		console.log( '✅ Page loaded\n' );

		// Check if the view.js file is loaded
		const scripts = await page.evaluate( () => {
			const scripts = Array.from( document.querySelectorAll( 'script[src]' ) );
			return scripts.map( ( script ) => script.src ).filter( ( src ) => src.includes( 'view' ) );
		} );

		console.log( '📋 View scripts loaded:' );
		scripts.forEach( ( src ) => {
			console.log( `   ${ src }` );
		} );

		// Click the toggle and check if the new code is running
		console.log( '\n🖱️  Clicking toggle...' );
		const toggle = page.locator( '.wp-block-elayne-mega-menu__toggle' ).first();
		await toggle.click();
		await page.waitForTimeout( 500 );

		// Check the panel's inline styles
		const panel = page.locator( '.wp-block-elayne-mega-menu__panel' ).first();
		const inlineStyles = await panel.evaluate( ( el ) => ( {
			left: el.style.left,
			right: el.style.right,
			visibility: el.style.visibility,
			opacity: el.style.opacity,
		} ) );

		console.log( '\n📊 Panel inline styles:' );
		console.log( JSON.stringify( inlineStyles, null, 2 ) );

		// Check if it has the flip-horizontal class
		const hasFlipClass = await panel.evaluate( ( el ) => el.classList.contains( 'flip-horizontal' ) );
		console.log( `\n📋 Has flip-horizontal class: ${ hasFlipClass }` );

		// Get the panel bounding box
		const panelBox = await panel.boundingBox();
		const viewportWidth = 1920;
		const overflow = ( panelBox.x + panelBox.width ) - viewportWidth;

		console.log( `\n📏 Panel position:` );
		console.log( `   Right edge: ${ panelBox.x + panelBox.width }px` );
		console.log( `   Viewport width: ${ viewportWidth }px` );
		console.log( `   Overflow: ${ overflow }px` );

		if ( overflow > 0 ) {
			console.log( '\n❌ Panel is overflowing by', overflow, 'px' );
			console.log( '   The positioning logic should have kicked in!' );
		} else {
			console.log( '\n✅ Panel fits within viewport' );
		}

		console.log( '\n✅ Check complete!' );
	} catch ( error ) {
		console.error( '❌ Error:', error );
	} finally {
		await page.waitForTimeout( 2000 );
		await browser.close();
	}
} )();

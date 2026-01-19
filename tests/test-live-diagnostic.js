/**
 * Complete diagnostic of live site
 */

const playwright = require( 'playwright' );
const path = require( 'path' );

( async () => {
	console.log( '🔬 Complete Live Site Diagnostic\n' );

	const browser = await playwright.chromium.launch( {
		headless: false,
		slowMo: 300,
	} );

	const context = await browser.newContext( {
		viewport: { width: 1920, height: 1080 },
	} );

	const page = await context.newPage();

	try {
		console.log( '📍 Loading http://demo.imagewize.test...' );
		await page.goto( 'http://demo.imagewize.test', { waitUntil: 'networkidle' } );
		console.log( '✅ Page loaded\n' );

		// Get view.js content to check if code is updated
		console.log( '📄 Checking view.js file content...' );
		const viewJsUrl = await page.evaluate( () => {
			const script = Array.from( document.querySelectorAll( 'script[src]' ) )
				.find( ( s ) => s.src.includes( 'mega-menu' ) && s.src.includes( 'view.js' ) );
			return script ? script.src : null;
		} );

		if ( viewJsUrl ) {
			console.log( `   Found: ${ viewJsUrl }\n` );

			// Fetch the file
			const response = await page.goto( viewJsUrl );
			const content = await response.text();

			// Check for our new code markers
			const hasNewCode = content.includes( 'BEFORE setting isOpen' );
			const hasVisibilityHidden = content.includes( 'visibility' ) && content.includes( 'hidden' );

			console.log( '🔍 Code inspection:' );
			console.log( `   Contains "BEFORE setting isOpen" comment: ${ hasNewCode ? '✅ YES' : '❌ NO' }` );
			console.log( `   Contains visibility/hidden logic: ${ hasVisibilityHidden ? '✅ YES' : '❌ NO' }` );
			console.log( '' );

			// Go back to the main page
			await page.goto( 'http://demo.imagewize.test', { waitUntil: 'networkidle' } );
		}

		// Click toggle
		console.log( '🖱️  Clicking mega menu toggle...' );
		const toggle = page.locator( '.wp-block-elayne-mega-menu__toggle' ).first();
		await toggle.click();
		await page.waitForTimeout( 500 );

		// Take a screenshot with measurements
		const panel = page.locator( '.wp-block-elayne-mega-menu__panel' ).first();
		const panelBox = await panel.boundingBox();

		console.log( '📏 Measurements:' );
		console.log( `   Panel X: ${ panelBox.x }px` );
		console.log( `   Panel Width: ${ panelBox.width }px` );
		console.log( `   Panel Right Edge: ${ panelBox.x + panelBox.width }px` );
		console.log( `   Viewport Width: 1920px` );
		console.log( `   Clearance: ${ 1920 - ( panelBox.x + panelBox.width ) }px` );

		// Draw measurement lines
		await page.evaluate( ( measurements ) => {
			const container = document.createElement( 'div' );
			container.style.cssText = 'position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; pointer-events: none; z-index: 999999;';

			// Viewport right edge (green)
			const vpLine = document.createElement( 'div' );
			vpLine.style.cssText = 'position: absolute; top: 0; right: 0; width: 5px; height: 100%; background: lime;';
			container.appendChild( vpLine );

			// Panel right edge (red)
			const panelLine = document.createElement( 'div' );
			panelLine.style.cssText = `position: absolute; top: 0; left: ${ measurements.panelRight }px; width: 5px; height: 100%; background: red;`;
			container.appendChild( panelLine );

			// Label
			const label = document.createElement( 'div' );
			label.style.cssText = `
				position: absolute;
				top: 100px;
				right: 20px;
				background: rgba(0,0,0,0.8);
				color: white;
				padding: 15px;
				font-family: monospace;
				font-size: 14px;
				line-height: 1.6;
			`;
			label.innerHTML = `
				<strong>Diagnostic Info:</strong><br>
				Viewport: ${ measurements.viewport }px (green line)<br>
				Panel right edge: ${ measurements.panelRight }px (red line)<br>
				<br>
				${ measurements.overflow > 0
		? `<span style="color: #ff5555">❌ OVERFLOW: +${ measurements.overflow }px</span>`
		: `<span style="color: #50fa7b">✅ FITS: -${ Math.abs( measurements.overflow ) }px clearance</span>`
}
			`;
			container.appendChild( label );

			document.body.appendChild( container );
		}, {
			viewport: 1920,
			panelRight: panelBox.x + panelBox.width,
			overflow: ( panelBox.x + panelBox.width ) - 1920,
		} );

		await page.waitForTimeout( 1000 );

		// Take final screenshot
		await page.screenshot( {
			path: path.join( __dirname, 'screenshots', 'diagnostic-final.png' ),
			fullPage: false,
		} );
		console.log( '\n📸 Screenshot saved: diagnostic-final.png' );

		console.log( '\n✅ Diagnostic complete!' );
		console.log( '   Review the screenshot to see the exact positioning.' );
	} catch ( error ) {
		console.error( '❌ Error:', error );
	} finally {
		await page.waitForTimeout( 3000 );
		await browser.close();
	}
} )();

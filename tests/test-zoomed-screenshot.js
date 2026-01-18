/**
 * Zoomed Screenshot of Menu Area
 */

const playwright = require( 'playwright' );
const path = require( 'path' );

( async () => {
	console.log( '🔍 Taking zoomed screenshot\n' );

	const browser = await playwright.chromium.launch( {
		headless: false,
	} );

	const context = await browser.newContext( {
		viewport: { width: 1920, height: 1080 },
	} );

	const page = await context.newPage();

	try {
		await page.goto( 'http://demo.imagewize.test', { waitUntil: 'networkidle' } );

		// Click toggle
		const toggle = page.locator( '.wp-block-elayne-mega-menu__toggle' ).first();
		await toggle.click();
		await page.waitForTimeout( 500 );

		// Take a screenshot of just the header area
		await page.screenshot( {
			path: path.join( __dirname, 'screenshots', 'menu-zoomed.png' ),
			clip: {
				x: 0,
				y: 0,
				width: 1920,
				height: 500,
			},
		} );
		console.log( '📸 Zoomed screenshot saved: menu-zoomed.png' );

		// Also get the panel's actual rendered boundaries
		const panel = page.locator( '.wp-block-elayne-mega-menu__panel' ).first();

		// Add visual markers
		await page.evaluate( () => {
			// Add a line at viewport right edge
			const viewportLine = document.createElement( 'div' );
			viewportLine.style.cssText = `
				position: fixed;
				top: 0;
				right: 0;
				width: 3px;
				height: 100vh;
				background: lime;
				z-index: 99999;
			`;
			document.body.appendChild( viewportLine );

			// Add a line at 1920px mark
			const marker1920 = document.createElement( 'div' );
			marker1920.style.cssText = `
				position: fixed;
				top: 0;
				left: 1920px;
				width: 3px;
				height: 100vh;
				background: red;
				z-index: 99999;
			`;
			document.body.appendChild( marker1920 );
		} );

		// Highlight panel
		await panel.evaluate( ( el ) => {
			el.style.outline = '3px solid blue';
		} );

		await page.waitForTimeout( 500 );

		// Take screenshot with markers
		await page.screenshot( {
			path: path.join( __dirname, 'screenshots', 'menu-with-markers.png' ),
			clip: {
				x: 0,
				y: 0,
				width: 1920,
				height: 500,
			},
		} );
		console.log( '📸 Screenshot with markers saved: menu-with-markers.png' );

		console.log( '\n✅ Done!' );
	} catch ( error ) {
		console.error( '❌ Error:', error );
	} finally {
		await page.waitForTimeout( 1000 );
		await browser.close();
	}
} )();

/**
 * Mega Menu Positioning Test
 *
 * This script tests the smart positioning logic of the mega menu block:
 * - Verifies menu opens correctly
 * - Checks for flip-horizontal class or negative left positioning
 * - Captures screenshots for visual verification
 * - Reports computed styles and positioning data
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function testMegaMenuPositioning() {
  console.log('🚀 Starting Mega Menu Positioning Test\n');

  const browser = await chromium.launch({
    headless: false, // Set to true if you don't want to see the browser
    slowMo: 100 // Slow down actions for visibility
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });

  const page = await context.newPage();

  try {
    // Step 1: Navigate to the test site
    console.log('📍 Step 1: Navigating to http://demo.imagewize.test');
    await page.goto('http://demo.imagewize.test', { waitUntil: 'networkidle' });
    console.log('✅ Page loaded successfully\n');

    // Step 2: Take screenshot of initial state
    console.log('📸 Step 2: Taking screenshot of initial page state');
    const screenshotsDir = path.join(__dirname, 'screenshots');
    if (!fs.existsSync(screenshotsDir)) {
      fs.mkdirSync(screenshotsDir);
    }
    await page.screenshot({
      path: path.join(screenshotsDir, '01-initial-state.png'),
      fullPage: true
    });
    console.log('✅ Screenshot saved: screenshots/01-initial-state.png\n');

    // Step 3: Look for mega menu toggle button
    console.log('🔍 Step 3: Looking for mega menu toggle button');

    // Try multiple selectors to find the toggle
    const possibleSelectors = [
      '.wp-block-elayne-mega-menu__toggle',
      '[data-wp-on--click*="toggleMenu"]',
      '.mega-menu-toggle',
      'button[aria-expanded]',
      'a.wp-block-navigation-item__content' // Navigation items that might contain mega menu
    ];

    let toggleButton = null;
    let usedSelector = null;

    for (const selector of possibleSelectors) {
      const elements = await page.$$(selector);
      if (elements.length > 0) {
        console.log(`   Found ${elements.length} element(s) with selector: ${selector}`);
        toggleButton = elements[0]; // Use the first one
        usedSelector = selector;
        break;
      }
    }

    if (!toggleButton) {
      console.log('❌ No mega menu toggle found. Available navigation items:');
      const navItems = await page.$$('.wp-block-navigation-item__content');
      for (let i = 0; i < navItems.length; i++) {
        const text = await navItems[i].textContent();
        console.log(`   - Navigation item ${i + 1}: "${text}"`);
      }

      // Try to click the first navigation item
      if (navItems.length > 0) {
        console.log('\n⚠️  Attempting to click first navigation item as fallback');
        toggleButton = navItems[0];
        usedSelector = '.wp-block-navigation-item__content (first)';
      } else {
        throw new Error('No mega menu toggle or navigation items found');
      }
    }

    const toggleText = await toggleButton.textContent();
    console.log(`✅ Found toggle: "${toggleText}" using selector: ${usedSelector}\n`);

    // Get toggle position before clicking
    const toggleBox = await toggleButton.boundingBox();
    console.log('📏 Toggle button position:');
    console.log(`   - X: ${toggleBox.x}px`);
    console.log(`   - Y: ${toggleBox.y}px`);
    console.log(`   - Width: ${toggleBox.width}px`);
    console.log(`   - Height: ${toggleBox.height}px\n`);

    // Step 4: Click the mega menu toggle
    console.log('🖱️  Step 4: Clicking mega menu toggle');
    await toggleButton.click();
    console.log('✅ Toggle clicked\n');

    // Step 5: Wait for animations
    console.log('⏳ Step 5: Waiting 500ms for animations');
    await page.waitForTimeout(500);
    console.log('✅ Animation wait complete\n');

    // Step 6: Take screenshot of opened menu
    console.log('📸 Step 6: Taking screenshot of opened menu');
    await page.screenshot({
      path: path.join(screenshotsDir, '02-menu-opened.png'),
      fullPage: true
    });
    console.log('✅ Screenshot saved: screenshots/02-menu-opened.png\n');

    // Step 7: Get computed styles and classes of menu panel
    console.log('🔍 Step 7: Analyzing menu panel element');

    const panelSelector = '.wp-block-elayne-mega-menu__panel';
    const panel = await page.$(panelSelector);

    if (!panel) {
      console.log('❌ Menu panel not found. Looking for alternative selectors...');
      const alternatives = await page.$$('[class*="mega-menu"]');
      console.log(`   Found ${alternatives.length} elements with "mega-menu" in class name\n`);

      for (let i = 0; i < alternatives.length; i++) {
        const className = await alternatives[i].getAttribute('class');
        console.log(`   - Element ${i + 1}: ${className}`);
      }
      throw new Error('Menu panel element not found');
    }

    console.log('✅ Menu panel found\n');

    // Get all classes
    const panelClasses = await panel.getAttribute('class');
    console.log('📋 Panel Classes:');
    console.log(`   ${panelClasses}\n`);

    // Get computed styles
    const computedStyles = await panel.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        position: styles.position,
        top: styles.top,
        left: styles.left,
        right: styles.right,
        bottom: styles.bottom,
        transform: styles.transform,
        width: styles.width,
        height: styles.height,
        display: styles.display,
        visibility: styles.visibility,
        opacity: styles.opacity,
        zIndex: styles.zIndex
      };
    });

    console.log('🎨 Computed Styles:');
    Object.entries(computedStyles).forEach(([key, value]) => {
      console.log(`   - ${key}: ${value}`);
    });
    console.log('');

    // Get bounding box
    const panelBox = await panel.boundingBox();
    console.log('📏 Panel Bounding Box:');
    console.log(`   - X: ${panelBox.x}px`);
    console.log(`   - Y: ${panelBox.y}px`);
    console.log(`   - Width: ${panelBox.width}px`);
    console.log(`   - Height: ${panelBox.height}px\n`);

    // Get viewport size
    const viewportSize = page.viewportSize();
    console.log('🖥️  Viewport Size:');
    console.log(`   - Width: ${viewportSize.width}px`);
    console.log(`   - Height: ${viewportSize.height}px\n`);

    // Step 8 & 9: Check for smart positioning
    console.log('🧠 Step 8 & 9: Analyzing Smart Positioning Logic\n');

    const hasFlipHorizontal = panelClasses.includes('flip-horizontal');
    const leftValue = parseFloat(computedStyles.left);
    const hasNegativeLeft = leftValue < 0;

    console.log('🔍 Positioning Analysis:');
    console.log(`   - Has "flip-horizontal" class: ${hasFlipHorizontal ? '✅ YES' : '❌ NO'}`);
    console.log(`   - Left value: ${computedStyles.left}`);
    console.log(`   - Has negative left value: ${hasNegativeLeft ? '✅ YES' : '❌ NO'}`);

    // Check if menu would overflow viewport
    const menuRightEdge = panelBox.x + panelBox.width;
    const wouldOverflow = menuRightEdge > viewportSize.width;

    console.log(`   - Menu right edge: ${menuRightEdge}px`);
    console.log(`   - Would overflow viewport: ${wouldOverflow ? '⚠️  YES' : '✅ NO'}`);

    // Calculate overflow amount
    if (wouldOverflow) {
      const overflowAmount = menuRightEdge - viewportSize.width;
      console.log(`   - Overflow amount: ${overflowAmount}px`);
    }

    console.log('\n📊 Smart Positioning Report:');

    if (hasFlipHorizontal) {
      console.log('   ✅ FLIP HORIZONTAL: Menu is using right-side alignment');
      console.log('      The menu has been flipped to prevent overflow on the right side');
    } else if (hasNegativeLeft) {
      console.log('   ✅ NUDGE LEFT: Menu is using negative left positioning');
      console.log(`      The menu has been nudged left by ${Math.abs(leftValue)}px to prevent overflow`);
    } else if (!wouldOverflow) {
      console.log('   ✅ NORMAL POSITIONING: Menu fits within viewport');
      console.log('      No smart positioning adjustments needed');
    } else {
      console.log('   ⚠️  WARNING: Menu appears to overflow but no positioning fix detected');
      console.log('      This may indicate the smart positioning logic is not working');
    }

    console.log('\n✅ Test completed successfully!');
    console.log(`\nScreenshots saved in: ${screenshotsDir}`);

  } catch (error) {
    console.error('\n❌ Test failed with error:', error.message);
    console.error('\nStack trace:', error.stack);

    // Take error screenshot
    try {
      await page.screenshot({
        path: path.join(__dirname, 'screenshots', '99-error-state.png'),
        fullPage: true
      });
      console.log('\n📸 Error screenshot saved: screenshots/99-error-state.png');
    } catch (screenshotError) {
      console.error('Failed to capture error screenshot:', screenshotError.message);
    }
  } finally {
    console.log('\n🔚 Closing browser...');
    await browser.close();
  }
}

// Run the test
testMegaMenuPositioning().catch(console.error);

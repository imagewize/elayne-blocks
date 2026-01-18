/**
 * Mega Menu Edge Case Testing
 *
 * This script tests the mega menu positioning at different viewport widths
 * to verify the smart positioning logic activates when needed.
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function testViewportWidth(browser, width, testName) {
  console.log(`\n${'='.repeat(80)}`);
  console.log(`🔍 Testing: ${testName} (Viewport: ${width}px)`);
  console.log('='.repeat(80));

  const context = await browser.newContext({
    viewport: { width, height: 1080 }
  });

  const page = await context.newPage();

  try {
    // Navigate to the site
    console.log('📍 Navigating to http://demo.imagewize.test');
    await page.goto('http://demo.imagewize.test', { waitUntil: 'networkidle' });

    // Take initial screenshot
    const screenshotsDir = path.join(__dirname, 'screenshots');
    if (!fs.existsSync(screenshotsDir)) {
      fs.mkdirSync(screenshotsDir);
    }

    const testSlug = testName.toLowerCase().replace(/\s+/g, '-');
    await page.screenshot({
      path: path.join(screenshotsDir, `${testSlug}-01-initial.png`),
      fullPage: false
    });

    // Find and click the mega menu toggle
    const toggleButton = await page.$('.wp-block-elayne-mega-menu__toggle');
    if (!toggleButton) {
      console.log('❌ No mega menu toggle found');
      return null;
    }

    const toggleText = await toggleButton.textContent();
    console.log(`✅ Found toggle: "${toggleText.trim()}"`);

    // Get toggle position
    const toggleBox = await toggleButton.boundingBox();
    console.log(`📏 Toggle position: X=${toggleBox.x.toFixed(2)}px, Width=${toggleBox.width.toFixed(2)}px`);

    // Click the toggle
    await toggleButton.click();
    await page.waitForTimeout(500);

    // Take opened screenshot
    await page.screenshot({
      path: path.join(screenshotsDir, `${testSlug}-02-opened.png`),
      fullPage: false
    });

    // Analyze the panel
    const panel = await page.$('.wp-block-elayne-mega-menu__panel');
    if (!panel) {
      console.log('❌ Menu panel not found');
      return null;
    }

    // Get panel details
    const panelClasses = await panel.getAttribute('class');
    const computedStyles = await panel.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        position: styles.position,
        top: styles.top,
        left: styles.left,
        right: styles.right,
        width: styles.width,
      };
    });

    const panelBox = await panel.boundingBox();

    // Analysis
    const hasFlipHorizontal = panelClasses.includes('flip-horizontal');
    const leftValue = parseFloat(computedStyles.left);
    const hasNegativeLeft = leftValue < 0;
    const menuRightEdge = panelBox.x + panelBox.width;
    const wouldOverflow = menuRightEdge > width;
    const overflowAmount = wouldOverflow ? menuRightEdge - width : 0;

    console.log('\n📊 Analysis:');
    console.log(`   Panel Width: ${panelBox.width.toFixed(2)}px`);
    console.log(`   Panel X Position: ${panelBox.x.toFixed(2)}px`);
    console.log(`   Panel Right Edge: ${menuRightEdge.toFixed(2)}px`);
    console.log(`   Viewport Width: ${width}px`);
    console.log(`   Left Style: ${computedStyles.left}`);
    console.log(`   Flip Horizontal: ${hasFlipHorizontal ? '✅ YES' : '❌ NO'}`);
    console.log(`   Negative Left: ${hasNegativeLeft ? '✅ YES' : '❌ NO'}`);
    console.log(`   Would Overflow: ${wouldOverflow ? `⚠️  YES (${overflowAmount.toFixed(2)}px)` : '✅ NO'}`);

    if (hasFlipHorizontal) {
      console.log('\n   ✅ SMART POSITIONING: Flip horizontal applied');
    } else if (hasNegativeLeft) {
      console.log(`\n   ✅ SMART POSITIONING: Nudged left by ${Math.abs(leftValue)}px`);
    } else if (wouldOverflow) {
      console.log('\n   ⚠️  WARNING: Menu overflows but no fix applied!');
    } else {
      console.log('\n   ✅ NORMAL POSITIONING: Menu fits naturally');
    }

    await context.close();

    return {
      width,
      testName,
      toggleX: toggleBox.x,
      panelWidth: panelBox.width,
      panelX: panelBox.x,
      leftStyle: computedStyles.left,
      hasFlipHorizontal,
      hasNegativeLeft,
      wouldOverflow,
      overflowAmount
    };

  } catch (error) {
    console.error('❌ Test error:', error.message);
    await context.close();
    return null;
  }
}

async function runTests() {
  console.log('🚀 Starting Mega Menu Edge Case Tests\n');

  const browser = await chromium.launch({
    headless: false,
    slowMo: 50
  });

  const testCases = [
    { width: 1920, name: 'Desktop Wide' },
    { width: 1440, name: 'Desktop Standard' },
    { width: 1280, name: 'Desktop Small' },
    { width: 1024, name: 'Tablet Landscape' },
    { width: 768, name: 'Tablet Portrait' }
  ];

  const results = [];

  for (const testCase of testCases) {
    const result = await testViewportWidth(browser, testCase.width, testCase.name);
    if (result) {
      results.push(result);
    }
    await new Promise(resolve => setTimeout(resolve, 1000)); // Pause between tests
  }

  await browser.close();

  // Summary Report
  console.log('\n\n' + '='.repeat(80));
  console.log('📊 SUMMARY REPORT');
  console.log('='.repeat(80));

  console.log('\n| Viewport | Test Name         | Panel Width | Overflow | Fix Applied |');
  console.log('|----------|-------------------|-------------|----------|-------------|');

  results.forEach(r => {
    const fix = r.hasFlipHorizontal ? 'Flip' : r.hasNegativeLeft ? 'Nudge' : 'None';
    const overflow = r.wouldOverflow ? `${r.overflowAmount.toFixed(0)}px` : 'No';
    console.log(`| ${r.width}px | ${r.testName.padEnd(17)} | ${r.panelWidth.toFixed(0).padStart(9)}px | ${overflow.padStart(8)} | ${fix.padEnd(11)} |`);
  });

  console.log('\n✅ All tests completed!');
  console.log('📸 Screenshots saved in: screenshots/');
}

runTests().catch(console.error);

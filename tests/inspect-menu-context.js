/**
 * Inspect Mega Menu Context and Configuration
 *
 * This script extracts the actual context data from the mega menu
 * to see what alignment and other settings are being used.
 */

const { chromium } = require('playwright');

async function inspectMenuContext() {
  console.log('🔍 Inspecting Mega Menu Context\n');

  const browser = await chromium.launch({
    headless: false,
    slowMo: 100
  });

  const page = await browser.newPage({
    viewport: { width: 1440, height: 1080 }
  });

  try {
    await page.goto('http://demo.imagewize.test', { waitUntil: 'networkidle' });
    console.log('✅ Page loaded\n');

    // Extract context data from the mega menu element
    const contextData = await page.evaluate(() => {
      const megaMenuBlock = document.querySelector('[data-wp-interactive="elayne/mega-menu"]');
      if (!megaMenuBlock) {
        return { error: 'No mega menu block found' };
      }

      // Get the data-wp-context attribute
      const contextAttr = megaMenuBlock.getAttribute('data-wp-context');

      // Get all relevant attributes
      const attributes = {};
      for (const attr of megaMenuBlock.attributes) {
        if (attr.name.startsWith('data-wp-')) {
          attributes[attr.name] = attr.value;
        }
      }

      // Get panel classes
      const panel = megaMenuBlock.querySelector('.wp-block-elayne-mega-menu__panel');
      const panelClasses = panel ? panel.className : 'Panel not found';

      // Get all class attributes that might indicate alignment
      const allMenuClasses = megaMenuBlock.className;

      return {
        contextAttribute: contextAttr,
        allAttributes: attributes,
        panelClasses,
        blockClasses: allMenuClasses,
        hasPanel: !!panel
      };
    });

    console.log('📋 Mega Menu Context Data:');
    console.log('─'.repeat(80));

    if (contextData.error) {
      console.log('\n❌ Error:', contextData.error);
      console.log('\n   Attempting to find mega menu with alternative selectors...\n');
    } else {
      console.log('\n1️⃣ Context Attribute (data-wp-context):');
      if (contextData.contextAttribute) {
        try {
          const parsed = JSON.parse(contextData.contextAttribute);
          console.log(JSON.stringify(parsed, null, 2));
        } catch (e) {
          console.log('   Raw:', contextData.contextAttribute);
        }
      } else {
        console.log('   None found');
      }

      console.log('\n2️⃣ Block Classes:');
      console.log('  ', contextData.blockClasses || 'None');

      console.log('\n3️⃣ Panel Classes:');
      console.log('  ', contextData.panelClasses || 'None');

      console.log('\n4️⃣ All Interactivity API Attributes:');
      if (contextData.allAttributes && Object.keys(contextData.allAttributes).length > 0) {
        Object.entries(contextData.allAttributes).forEach(([key, value]) => {
          if (value.length > 100) {
            console.log(`   ${key}: ${value.substring(0, 100)}...`);
          } else {
            console.log(`   ${key}: ${value}`);
          }
        });
      } else {
        console.log('   None found');
      }
    }

    // Now click the menu and inspect runtime state
    console.log('\n\n🖱️  Clicking mega menu toggle...\n');
    await page.click('.wp-block-elayne-mega-menu__toggle');
    await page.waitForTimeout(600);

    const runtimeState = await page.evaluate(() => {
      const panel = document.querySelector('.wp-block-elayne-mega-menu__panel');
      if (!panel) {
        return { error: 'Panel not found after click' };
      }

      const rect = panel.getBoundingClientRect();
      const computedStyle = window.getComputedStyle(panel);

      return {
        classList: Array.from(panel.classList),
        inlineStyle: panel.style.cssText,
        computedStyles: {
          position: computedStyle.position,
          left: computedStyle.left,
          right: computedStyle.right,
          top: computedStyle.top,
        },
        boundingBox: {
          x: rect.x,
          y: rect.y,
          width: rect.width,
          height: rect.height,
          right: rect.right
        },
        viewportWidth: window.innerWidth
      };
    });

    console.log('📊 Runtime State After Opening:');
    console.log('─'.repeat(80));
    console.log('\n5️⃣ Panel Class List:');
    console.log('  ', runtimeState.classList.join(', '));

    console.log('\n6️⃣ Inline Styles (Applied by JS):');
    console.log('  ', runtimeState.inlineStyle || '(none)');

    console.log('\n7️⃣ Computed Styles:');
    Object.entries(runtimeState.computedStyles).forEach(([key, value]) => {
      console.log(`   ${key}: ${value}`);
    });

    console.log('\n8️⃣ Positioning Analysis:');
    console.log(`   Panel X: ${runtimeState.boundingBox.x.toFixed(2)}px`);
    console.log(`   Panel Width: ${runtimeState.boundingBox.width.toFixed(2)}px`);
    console.log(`   Panel Right Edge: ${runtimeState.boundingBox.right.toFixed(2)}px`);
    console.log(`   Viewport Width: ${runtimeState.viewportWidth}px`);

    const overflow = runtimeState.boundingBox.right - runtimeState.viewportWidth;
    if (overflow > 0) {
      console.log(`   ⚠️  OVERFLOW: ${overflow.toFixed(2)}px beyond viewport!`);
    } else {
      console.log(`   ✅ Fits within viewport (${Math.abs(overflow).toFixed(2)}px margin)`);
    }

    const hasFlip = runtimeState.classList.includes('flip-horizontal');
    const hasNudge = runtimeState.inlineStyle.includes('left:');

    console.log('\n9️⃣ Smart Positioning Status:');
    console.log(`   flip-horizontal class: ${hasFlip ? '✅ Applied' : '❌ Not applied'}`);
    console.log(`   Inline left style: ${hasNudge ? '✅ Applied' : '❌ Not applied'}`);

    if (overflow > 0 && !hasFlip && !hasNudge) {
      console.log('\n   ⚠️  ISSUE DETECTED: Menu overflows but no positioning fix applied!');
      console.log('   This indicates the smart positioning logic is not working.');
    }

    // Take a screenshot showing the inspector view
    await page.screenshot({
      path: '/Users/jasperfrumau/code/elayne-blocks/screenshots/context-inspection.png',
      fullPage: false
    });

    console.log('\n✅ Inspection complete!');
    console.log('📸 Screenshot: screenshots/context-inspection.png');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error(error.stack);
  } finally {
    await browser.close();
  }
}

inspectMenuContext().catch(console.error);

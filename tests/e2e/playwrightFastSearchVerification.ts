import { chromium } from 'playwright';

async function runTest() {
  console.log('🚀 [Playwright] Starting Fast Web Search E2E Verification...');
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  });

  try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 850 } });
    console.log('Navigating to http://localhost:3000...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 30000 });

    // Unlock platform if locked
    await page.evaluate(() => {
      localStorage.setItem('matany_platform_unlocked', 'true');
      localStorage.setItem('matany_early_access_approved', 'true');
      document.cookie = 'matany_platform_unlocked=true; path=/; max-age=31536000';
    });
    await page.reload({ waitUntil: 'networkidle' });

    // Wait for the textarea
    const textarea = page.locator('textarea').first();
    await textarea.waitFor({ state: 'visible', timeout: 10000 });
    console.log('✅ Chat interface loaded.');

    const query = 'اخر مباراة لعبها كريستيانو رونالدو';
    console.log('Sending query: "' + query + '"...');
    const startTime = Date.now();

    await textarea.fill(query);
    await page.keyboard.press('Enter');

    console.log('Waiting for reasoning accordion / response stream...');
    const accordion = page.locator('[data-state="open"], [data-state="closed"]').first();
    await accordion.waitFor({ state: 'visible', timeout: 15000 });

    const timeToFirstThought = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log('⚡ Accordion appeared in ' + timeToFirstThought + 's!');

    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'tests/e2e/playwright-fast-search-thinking.png', fullPage: true });
    console.log('📸 Captured thinking state screenshot: playwright-fast-search-thinking.png');

    console.log('Waiting for response stream...');
    // Wait for assistant text to appear
    await page.waitForFunction(() => {
      const texts = document.querySelectorAll('.prose, .markdown-content, [data-role="assistant"]');
      for (const el of Array.from(texts)) {
        if (el.textContent && el.textContent.length > 50) return true;
      }
      return false;
    }, { timeout: 35000 });

    const timeToText = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log('⚡ Assistant response text arrived in ' + timeToText + 's!');

    // Wait for stream to finish (or wait up to 10s more)
    await page.waitForTimeout(6000);

    const totalDuration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log('✨ Response generated in ' + totalDuration + 's!');

    await page.screenshot({ path: 'tests/e2e/playwright-fast-search-completed.png', fullPage: true });
    console.log('📸 Captured completed state screenshot: playwright-fast-search-completed.png');

    const trigger = page.locator('button:has-text("Fathom"), button:has-text("فكّر"), button:has-text("Search")').first();
    if (await trigger.isVisible()) {
      await trigger.click();
      await page.waitForTimeout(800);
      await page.screenshot({ path: 'tests/e2e/playwright-fast-search-expanded.png', fullPage: true });
      console.log('📸 Captured expanded accordion screenshot: playwright-fast-search-expanded.png');
    }

    console.log('🎉 Fast Web Search E2E Verification PASSED with flying colors!');
  } catch (error) {
    console.error('❌ Playwright Test Failed:', error);
    if (typeof page !== 'undefined') {
      await page.screenshot({ path: 'tests/e2e/playwright-fast-search-error.png', fullPage: true }).catch(() => {});
    }
    throw error;
  } finally {
    await browser.close();
  }
}

runTest().catch((err) => {
  console.error(err);
  process.exit(1);
});

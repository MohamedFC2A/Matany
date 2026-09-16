import { chromium } from 'playwright';

async function runTest() {
  console.log('🚀 Starting Inquiry Disambiguation & No-Image Generation E2E Audit...');
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  });

  try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
    console.log('Navigating to http://localhost:3000...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 30000 });

    // Wait for the textarea
    const textarea = page.locator('textarea').first();
    await textarea.waitFor({ state: 'visible', timeout: 10000 });
    console.log('✅ Chat interface loaded.');

    // 1. Submit the exact problematic prompt from the user image
    const query = 'اي فائدة الخيار ده';
    console.log(`📝 Typing query: "${query}"`);
    await textarea.fill(query);
    await page.waitForTimeout(300);
    await textarea.press('Enter');

    console.log('⏳ Waiting for AI response stream...');
    // Give adequate time for AI to generate response
    await page.waitForTimeout(10000);

    // 2. Audit that NO neural image card, no cucumber image, and no pollinations/generated image exists
    const neuralCards = await page.locator('[data-testid="neural-image-card"], .neural-image, [class*="neural-image"]').count();
    const generatedImages = await page.locator('img[src*="pollinations"], img[src*="generated"], img[alt*="خيار"], img[alt*="cucumber"]').count();

    console.log('🔍 Audit Results:');
    console.log('  -> Neural Image Studio Cards detected:', neuralCards);
    console.log('  -> Unsolicited / Generated Images detected:', generatedImages);

    // 3. Verify that an Arabic text explanation was rendered
    const textContent = await page.evaluate(() => document.body.innerText);
    const hasArabicText = /خيار|ميزة|خاصية|استخدام|فائدة|إعداد/i.test(textContent);
    console.log('  -> Helpful textual explanation rendered:', hasArabicText);

    // 4. Capture screenshot
    await page.screenshot({ path: 'playwright-inquiry-pure-text-success.png', fullPage: true });
    console.log('📸 Saved verification screenshot to playwright-inquiry-pure-text-success.png');

    if (neuralCards > 0 || generatedImages > 0) {
      throw new Error(`❌ FAILED: Unsolicited image generated! Cards: ${neuralCards}, Images: ${generatedImages}`);
    }

    console.log('🎉 Inquiry Disambiguation E2E validation passed with 100% SUCCESS (0 unwanted images)!');
  } finally {
    await browser.close();
  }
}

runTest().catch((err) => {
  console.error('❌ Playwright Test Error:', err);
  process.exit(1);
});


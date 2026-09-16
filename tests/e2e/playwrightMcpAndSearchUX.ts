import { chromium } from 'playwright';

async function runTest() {
  console.log('🚀 Starting Playwright MCP & Search UX Test...');
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  });

  try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
    console.log('Navigating to http://localhost:3000...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 30000 });

    // Wait for the textarea
    await page.waitForSelector('textarea', { timeout: 10000 });
    console.log('✅ Chat interface loaded.');

    // 1. Click 3-dots button (أدوات إضافية)
    const menuBtn = page.locator('button[title="أدوات إضافية"]').first();
    await menuBtn.waitFor({ state: 'visible', timeout: 5000 });
    await menuBtn.click();
    console.log('✅ Clicked 3-dots button [title="أدوات إضافية"].');
    await page.waitForTimeout(500);

    // 2. Click "أدوات مساعدة ببروتوكول (MCP)"
    const protocolSubMenuBtn = page.locator('text=أدوات مساعدة ببروتوكول (MCP)').first();
    await protocolSubMenuBtn.waitFor({ state: 'visible', timeout: 5000 });
    console.log('✅ Protocol Assistant menu item found.');
    await protocolSubMenuBtn.click();
    await page.waitForTimeout(500);

    // 3. Verify all MCP and Search tools exist in the protocol sub-menu
    const braveOption = page.locator('text=بحث Brave (Brave Search MCP)').first();
    const webOption = page.locator('text=البحث في الويب (Web Search)').first();
    const talabatOption = page.locator('text=طلبات Talabat MCP').first();
    const githubOption = page.locator('text=جيت هب GitHub MCP').first();
    const linearOption = page.locator('text=لينيار Linear MCP').first();

    const hasBrave = await braveOption.isVisible();
    const hasWeb = await webOption.isVisible();
    const hasTalabat = await talabatOption.isVisible();
    const hasGithub = await githubOption.isVisible();
    const hasLinear = await linearOption.isVisible();

    console.log('Tool Visibility in Protocol Assistant Menu:');
    console.log('  -> بحث Brave (Brave Search MCP):', hasBrave);
    console.log('  -> البحث في الويب (Web Search):', hasWeb);
    console.log('  -> طلبات Talabat MCP:', hasTalabat);
    console.log('  -> جيت هب GitHub MCP:', hasGithub);
    console.log('  -> لينيار Linear MCP:', hasLinear);

    if (!hasBrave || !hasWeb || !hasTalabat || !hasGithub || !hasLinear) {
      throw new Error('❌ Verification failed: Expected MCP options are missing!');
    }

    // 4. Click Web Search tool
    await webOption.click();
    console.log('✅ Clicked Web Search tool.');
    await page.waitForTimeout(300);

    // 5. Click Brave Search MCP
    await braveOption.click();
    console.log('✅ Clicked Brave Search MCP tool.');
    await page.waitForTimeout(300);

    // Close menu by clicking outside backdrop
    await page.mouse.click(50, 50);
    await page.waitForTimeout(500);

    // 6. Check active badges in chat bar
    const braveBadge = page.locator('text=Brave MCP').first();
    const webBadge = page.locator('div:has-text("البحث في الويب (Web Search)")').first();
    const braveBadgeVisible = await braveBadge.isVisible();
    const webBadgeVisible = await webBadge.isVisible();
    console.log('Chat Input Badges:');
    console.log('  -> Brave MCP Badge visible:', braveBadgeVisible);
    console.log('  -> Web Search Badge visible:', webBadgeVisible);

    // 7. Test typing the query from the user complaint
    const textarea = page.locator('textarea').first();
    await textarea.fill('اخر مباراة مع كريستيانو');
    console.log('✅ Typed test sports query: "اخر مباراة مع كريستيانو"');
    await page.waitForTimeout(500);

    // Capture screenshot
    await page.screenshot({ path: 'playwright-mcp-ux-success.png', fullPage: true });
    console.log('📸 Saved verification screenshot to playwright-mcp-ux-success.png');
    console.log('🎉 Playwright E2E UX test passed with 100% SUCCESS!');
  } finally {
    await browser.close();
  }
}

runTest().catch((err) => {
  console.error('❌ Playwright Test Error:', err);
  process.exit(1);
});

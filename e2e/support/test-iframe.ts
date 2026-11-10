import { test } from '@playwright/test';

test('check iframe', async ({ page }) => {
  await page.goto('http://localhost:6006/iframe.html?id=components-badge--default');
  await page.waitForLoadState('networkidle');

  // Check for iframes
  const frames = page.frames();
  console.warn('Number of frames:', frames.length);
  for (const frame of frames) {
    console.warn('Frame URL:', frame.url());
  }

  // Check for storybook iframe
  const storybookFrame = page.frameLocator('#storybook-preview-iframe');
  const content = await storybookFrame.locator('body').innerHTML();
  console.warn('Iframe content length:', content.length);

  // Check for data-testid
  const testids = await storybookFrame.locator('[data-testid]').all();
  console.warn('Test IDs found:', testids.length);
  for (const t of testids) {
    const id = await t.getAttribute('data-testid');
    console.warn('  -', id);
  }
});

import { test } from "@playwright/test";

test("check iframe", async ({ page }) => {
  await page.goto(
    "http://localhost:6006/iframe.html?id=components-badge--default",
  );
  await page.waitForLoadState("networkidle");

  // Wait for story to render - usar waitForLoadState en lugar de waitForTimeout
  await page.waitForLoadState("networkidle");

  // Check for error display
  const errorDisplay = await page.locator(".sb-errordisplay").isVisible();
  console.warn("Error display visible:", errorDisplay);

  // eslint-disable-next-line playwright/no-conditional-in-test
  if (errorDisplay) {
    const errorText = await page.locator(".sb-errordisplay").innerText();
    console.warn("Error text:", errorText);
  }

  // Check storybook-root content
  const storyRoot = page.locator("#storybook-root");
  const storyContent = await storyRoot.innerHTML();
  console.warn("Story root content length:", storyContent.length);

  // Look for our test id
  const testids = await storyRoot.locator("[data-testid]").all();
  console.warn("Test IDs in story root:", testids.length);
  for (const t of testids) {
    const id = await t.getAttribute("data-testid");
    console.warn("  -", id);
  }

  // Look for badge elements
  const badges = await storyRoot.locator("*").all();
  console.warn("All elements in story root:", badges.length);
  for (const el of badges) {
    const tag = await el.evaluate((e) => e.tagName);
    const className = await el.getAttribute("class");
    const id = await el.getAttribute("id");
    const testid = await el.getAttribute("data-testid");
    console.warn(
      `  ${tag}`,
      className ? `.${className}` : "",
      id ? `#${id}` : "",
      testid ? `data-testid="${testid}"` : "",
    );
  }
});

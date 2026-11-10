import { test, expect } from "@playwright/test";
import { snapshotName } from "../support/utils";

/** ErrorPage visual regression tests */
test.describe("ErrorPage", () => {
  const STATUS_CODES = [404, 500, 403, 401, 503] as const;

  for (const statusCode of STATUS_CODES) {
    test(`status-${statusCode}`, async ({ page }) => {
      const storyUrl = `/iframe.html?id=components-error-page--${statusCode}`;

      await page.goto(storyUrl, { waitUntil: "networkidle" });
      await page.evaluate(() => {
        document.documentElement.setAttribute("data-theme", "light");
      });

      const root = page.locator('[data-testid="error-page-story"]');
      await expect(root).toBeVisible();
      // waitForTimeout reemplazado por waitForLoadState para estabilidad
      await page.waitForLoadState("networkidle");

      await expect(root).toHaveScreenshot(
        snapshotName("error-page", `${statusCode}`, "light", "desktop"),
        { animations: "disabled", caret: "hide" },
      );
    });

    test(`status-${statusCode}-dark`, async ({ page }) => {
      const storyUrl = `/iframe.html?id=components-error-page--${statusCode}`;

      await page.goto(storyUrl, { waitUntil: "networkidle" });
      await page.evaluate(() => {
        document.documentElement.setAttribute("data-theme", "dark");
      });

      const root = page.locator('[data-testid="error-page-story"]');
      await expect(root).toBeVisible();
      // waitForTimeout reemplazado por waitForLoadState para estabilidad
      await page.waitForLoadState("networkidle");

      await expect(root).toHaveScreenshot(
        snapshotName("error-page", `${statusCode}`, "dark", "desktop"),
        { animations: "disabled", caret: "hide" },
      );
    });
  }
});

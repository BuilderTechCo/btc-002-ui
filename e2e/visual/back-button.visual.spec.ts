import { test } from "@playwright/test";
import { testComponent, StateHelpers } from "../support/utils";

/** BackButton visual regression tests */
test.describe("BackButton", () => {
  const STORY_URL = "/iframe.html?id=components-back-button--default";

  test("visual regression", async ({ page }) => {
    await testComponent(page, {
      componentName: "back-button",
      storyUrl: STORY_URL,
      rootSelector: '[data-testid="story-root"]',
      states: [
        { name: "default" },
        { name: "hover", setup: StateHelpers.hover },
        { name: "focus", setup: StateHelpers.focus },
        {
          name: "variant-primary",
          setup: async (_page, el) => {
            await el.evaluate((node) => {
              (node as HTMLElement).setAttribute("data-variant", "primary");
            });
          },
        },
        {
          name: "variant-secondary",
          setup: async (_page, el) => {
            await el.evaluate((node) => {
              (node as HTMLElement).setAttribute("data-variant", "secondary");
            });
          },
        },
        {
          name: "size-md",
          setup: async (_page, el) => {
            await el.evaluate((node) => {
              (node as HTMLElement).setAttribute("data-size", "md");
            });
          },
        },
        {
          name: "with-fallback",
          setup: async (_page, el) => {
            await el.evaluate((node) => {
              (node as HTMLElement).setAttribute("data-fallback", "true");
            });
          },
        },
      ],
    });
  });
});

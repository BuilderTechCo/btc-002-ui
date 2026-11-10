import { test } from "@playwright/test";
import { testComponent } from "../support/utils";

/** Badge visual regression tests */
test.describe("Badge", () => {
  const STORY_URL = "/iframe.html?id=components-badge--default";

  test("visual regression", async ({ page }) => {
    await testComponent(page, {
      componentName: "badge",
      storyUrl: STORY_URL,
      rootSelector: '[data-testid="story-root"]',
      states: [
        { name: "default" },
        {
          name: "success",
          setup: async (_page, el) => {
            await el.evaluate((node) => {
              (node as HTMLElement).setAttribute("data-variant", "success");
            });
          },
        },
        {
          name: "warning",
          setup: async (_page, el) => {
            await el.evaluate((node) => {
              (node as HTMLElement).setAttribute("data-variant", "warning");
            });
          },
        },
        {
          name: "error",
          setup: async (_page, el) => {
            await el.evaluate((node) => {
              (node as HTMLElement).setAttribute("data-variant", "error");
            });
          },
        },
        {
          name: "info",
          setup: async (_page, el) => {
            await el.evaluate((node) => {
              (node as HTMLElement).setAttribute("data-variant", "info");
            });
          },
        },
        {
          name: "brand",
          setup: async (_page, el) => {
            await el.evaluate((node) => {
              (node as HTMLElement).setAttribute("data-variant", "brand");
            });
          },
        },
        {
          name: "sm",
          setup: async (_page, el) => {
            await el.evaluate((node) => {
              (node as HTMLElement).setAttribute("data-size", "sm");
            });
          },
        },
        {
          name: "with-dot",
          setup: async (_page, el) => {
            await el.evaluate((node) => {
              (node as HTMLElement).setAttribute("data-dot", "true");
            });
          },
        },
      ],
    });
  });
});

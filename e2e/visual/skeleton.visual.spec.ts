import { test } from "@playwright/test";
import { testComponent } from "../support/utils";

/** Skeleton visual regression tests */
test.describe("Skeleton", () => {
  const STORY_URL = "/iframe.html?id=components-skeleton--text";

  test("visual regression", async ({ page }) => {
    await testComponent(page, {
      componentName: "skeleton",
      storyUrl: STORY_URL,
      rootSelector: '[data-testid="story-root"]',
      states: [
        { name: "text-1-line" },
        {
          name: "text-3-lines",
          setup: async (_page, el) => {
            await el.evaluate((node) => {
              (node as HTMLElement).setAttribute("data-lines", "3");
            });
          },
        },
        {
          name: "text-5-lines",
          setup: async (_page, el) => {
            await el.evaluate((node) => {
              (node as HTMLElement).setAttribute("data-lines", "5");
            });
          },
        },
        {
          name: "circular",
          setup: async (_page, el) => {
            await el.evaluate((node) => {
              (node as HTMLElement).setAttribute("data-variant", "circular");
            });
          },
        },
        {
          name: "rectangular",
          setup: async (_page, el) => {
            await el.evaluate((node) => {
              (node as HTMLElement).setAttribute("data-variant", "rectangular");
            });
          },
        },
        {
          name: "animation-pulse",
          setup: async (_page, el) => {
            await el.evaluate((node) => {
              (node as HTMLElement).setAttribute("data-animation", "pulse");
            });
          },
        },
        {
          name: "animation-none",
          setup: async (_page, el) => {
            await el.evaluate((node) => {
              (node as HTMLElement).setAttribute("data-animation", "none");
            });
          },
        },
      ],
    });
  });
});

import { test } from "@playwright/test";
import { testComponent, StateHelpers } from "../support/utils";

/** DropdownMenu visual regression tests */
test.describe("DropdownMenu", () => {
  const STORY_URL = "/iframe.html?id=components-dropdown-menu--default";

  test("visual regression", async ({ page }) => {
    await testComponent(page, {
      componentName: "dropdown-menu",
      storyUrl: STORY_URL,
      rootSelector: '[data-testid="story-root"]',
      states: [
        { name: "closed" },
        { name: "open", setup: StateHelpers.click },
        {
          name: "with-checkbox",
          setup: async (_page, el) => {
            await el.evaluate((node) => {
              (node as HTMLElement).setAttribute("data-checkbox", "true");
            });
            await StateHelpers.click(page, el);
          },
        },
        {
          name: "with-radio",
          setup: async (_page, el) => {
            await el.evaluate((node) => {
              (node as HTMLElement).setAttribute("data-radio", "true");
            });
            await StateHelpers.click(page, el);
          },
        },
        {
          name: "with-separator",
          setup: async (_page, el) => {
            await el.evaluate((node) => {
              (node as HTMLElement).setAttribute("data-separator", "true");
            });
            await StateHelpers.click(page, el);
          },
        },
        {
          name: "side-top",
          setup: async (_page, el) => {
            await el.evaluate((node) => {
              (node as HTMLElement).setAttribute("data-side", "top");
            });
            await StateHelpers.click(page, el);
          },
        },
        {
          name: "align-end",
          setup: async (_page, el) => {
            await el.evaluate((node) => {
              (node as HTMLElement).setAttribute("data-align", "end");
            });
            await StateHelpers.click(page, el);
          },
        },
      ],
    });
  });
});

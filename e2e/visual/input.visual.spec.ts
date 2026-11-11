import { test } from "@playwright/test";
import { testComponent, StateHelpers } from "../support/utils";

/** Input visual regression tests */
test.describe("Input", () => {
  const STORY_URL = "/iframe.html?id=components-input--default";

  test("visual regression", async ({ page }) => {
    await testComponent(page, {
      componentName: "input",
      storyUrl: STORY_URL,
      rootSelector: '[data-testid="story-root"]',
      states: [
        { name: "default" },
        { name: "focus", setup: StateHelpers.focus },
        {
          name: "filled",
          setup: async (_page, el) => {
            await el.evaluate((node) => {
              const input = node.querySelector("input");
              input?.setAttribute("value", "Texto de ejemplo");
            });
          },
        },
        { name: "disabled", setup: StateHelpers.disabled },
        { name: "error", setup: StateHelpers.error },
        {
          name: "with-helper",
          setup: async (_page, el) => {
            await el.evaluate((node) => {
              (node as HTMLElement).setAttribute("data-helper", "true");
            });
          },
        },
        {
          name: "with-left-icon",
          setup: async (_page, el) => {
            await el.evaluate((node) => {
              (node as HTMLElement).setAttribute("data-left-icon", "true");
            });
          },
        },
        {
          name: "with-right-icon",
          setup: async (_page, el) => {
            await el.evaluate((node) => {
              (node as HTMLElement).setAttribute("data-right-icon", "true");
            });
          },
        },
        {
          name: "variant-filled",
          setup: async (_page, el) => {
            await el.evaluate((node) => {
              (node as HTMLElement).setAttribute("data-variant", "filled");
            });
          },
        },
        {
          name: "variant-outlined",
          setup: async (_page, el) => {
            await el.evaluate((node) => {
              (node as HTMLElement).setAttribute("data-variant", "outlined");
            });
          },
        },
      ],
    });
  });
});

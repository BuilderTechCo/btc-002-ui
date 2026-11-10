import { test } from '@playwright/test';
import { testComponent } from '../support/utils';

/** Slot visual regression tests */
test.describe('Slot', () => {
  const STORY_URL = '/iframe.html?id=components-slot--as-child';

  test('visual regression', async ({ page }) => {
    await testComponent(page, {
      componentName: 'slot',
      storyUrl: STORY_URL,
      rootSelector: '[data-testid="story-root"]',
      states: [
        { name: 'as-child-link', setup: async (_page, el) => {
          await el.evaluate((node) => {
            (node as HTMLElement).setAttribute('data-as-child', 'link');
          });
        }},
        { name: 'as-child-button', setup: async (_page, el) => {
          await el.evaluate((node) => {
            (node as HTMLElement).setAttribute('data-as-child', 'button');
          });
        }},
        { name: 'default-div', setup: async (_page, el) => {
          await el.evaluate((node) => {
            (node as HTMLElement).setAttribute('data-as-child', 'div');
          });
        }},
      ],
    });
  });
});
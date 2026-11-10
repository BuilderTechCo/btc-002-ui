import { test } from '@playwright/test';
import { testComponent, StateHelpers } from '../support/utils';

/** ThemeToggle visual regression tests */
test.describe('ThemeToggle', () => {
  const STORY_URL = '/iframe.html?id=components-theme-toggle--default';

  test('visual regression', async ({ page }) => {
    await testComponent(page, {
      componentName: 'theme-toggle',
      storyUrl: STORY_URL,
      rootSelector: '[data-testid="story-root"]',
      states: [
        { name: 'default-md' },
        { name: 'sm', setup: async (_page, el) => {
          await el.evaluate((node) => {
            (node as HTMLElement).setAttribute('data-size', 'sm');
          });
        }},
        { name: 'no-label', setup: async (_page, el) => {
          await el.evaluate((node) => {
            (node as HTMLElement).setAttribute('data-show-label', 'false');
          });
        }},
        { name: 'open-dropdown', setup: StateHelpers.click },
      ],
    });
  });
});
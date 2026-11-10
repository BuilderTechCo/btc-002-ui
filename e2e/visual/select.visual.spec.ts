import { test } from '@playwright/test';
import { testComponent, StateHelpers } from '../support/utils';

/** Select visual regression tests */
test.describe('Select', () => {
  const STORY_URL = '/iframe.html?id=components-select--default';

  test('visual regression', async ({ page }) => {
    await testComponent(page, {
      componentName: 'select',
      storyUrl: STORY_URL,
      rootSelector: '[data-testid="story-root"]',
      states: [
        { name: 'default' },
        { name: 'open', setup: StateHelpers.click },
        { name: 'disabled', setup: StateHelpers.disabled },
        { name: 'error', setup: StateHelpers.error },
        { name: 'with-groups', setup: async (_page, el) => {
          await el.evaluate((node) => {
            (node as HTMLElement).setAttribute('data-groups', 'true');
          });
        }},
        { name: 'side-top', setup: async (_page, el) => {
          await el.evaluate((node) => {
            (node as HTMLElement).setAttribute('data-side', 'top');
          });
        }},
      ],
    });
  });
});
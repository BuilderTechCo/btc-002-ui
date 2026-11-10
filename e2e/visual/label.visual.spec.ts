import { test } from '@playwright/test';
import { testComponent, StateHelpers } from '../support/utils';

/** Label visual regression tests */
test.describe('Label', () => {
  const STORY_URL = '/iframe.html?id=components-label--default';

  test('visual regression', async ({ page }) => {
    await testComponent(page, {
      componentName: 'label',
      storyUrl: STORY_URL,
      rootSelector: '[data-testid="story-root"]',
      states: [
        { name: 'default' },
        { name: 'with-input', setup: async (_page, el) => {
          await el.evaluate((node) => {
            (node as HTMLElement).setAttribute('data-with-input', 'true');
          });
        }},
        { name: 'required', setup: async (_page, el) => {
          await el.evaluate((node) => {
            (node as HTMLElement).setAttribute('data-required', 'true');
          });
        }},
        { name: 'disabled', setup: StateHelpers.disabled },
      ],
    });
  });
});
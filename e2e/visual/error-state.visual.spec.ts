import { test } from '@playwright/test';
import { testComponent } from '../support/utils';

/** ErrorState visual regression tests */
test.describe('ErrorState', () => {
  const STORY_URL = '/iframe.html?id=components-error-state--default';

  test('visual regression', async ({ page }) => {
    await testComponent(page, {
      componentName: 'error-state',
      storyUrl: STORY_URL,
      rootSelector: '[data-testid="story-root"]',
      states: [
        { name: 'default' },
        { name: 'with-description', setup: async (_page, el) => {
          await el.evaluate((node) => {
            (node as HTMLElement).setAttribute('data-description', 'true');
          });
        }},
        { name: 'with-action', setup: async (_page, el) => {
          await el.evaluate((node) => {
            (node as HTMLElement).setAttribute('data-action', 'true');
          });
        }},
        { name: 'with-retry', setup: async (_page, el) => {
          await el.evaluate((node) => {
            (node as HTMLElement).setAttribute('data-retry', 'true');
          });
        }},
        { name: 'custom-icon', setup: async (_page, el) => {
          await el.evaluate((node) => {
            (node as HTMLElement).setAttribute('data-custom-icon', 'info');
          });
        }},
      ],
    });
  });
});
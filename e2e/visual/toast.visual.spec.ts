import { test } from '@playwright/test';
import { testComponent } from '../support/utils';

/** Toast visual regression tests */
test.describe('Toast', () => {
  const STORY_URL = '/iframe.html?id=components-toast--default';

  test('visual regression', async ({ page }) => {
    await testComponent(page, {
      componentName: 'toast',
      storyUrl: STORY_URL,
      rootSelector: '[data-testid="story-root"]',
      states: [
        { name: 'default' },
        { name: 'success', setup: async (_page, el) => {
          await el.evaluate((node) => {
            (node as HTMLElement).setAttribute('data-variant', 'success');
          });
        }},
        { name: 'warning', setup: async (_page, el) => {
          await el.evaluate((node) => {
            (node as HTMLElement).setAttribute('data-variant', 'warning');
          });
        }},
        { name: 'error', setup: async (_page, el) => {
          await el.evaluate((node) => {
            (node as HTMLElement).setAttribute('data-variant', 'error');
          });
        }},
        { name: 'info', setup: async (_page, el) => {
          await el.evaluate((node) => {
            (node as HTMLElement).setAttribute('data-variant', 'info');
          });
        }},
        { name: 'with-action', setup: async (_page, el) => {
          await el.evaluate((node) => {
            (node as HTMLElement).setAttribute('data-action', 'true');
          });
        }},
        { name: 'with-description', setup: async (_page, el) => {
          await el.evaluate((node) => {
            (node as HTMLElement).setAttribute('data-description', 'true');
          });
        }},
      ],
    });
  });
});
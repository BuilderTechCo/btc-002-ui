import { test } from '@playwright/test';
import { testComponent } from '../support/utils';

/** Separator visual regression tests */
test.describe('Separator', () => {
  const STORY_URL = '/iframe.html?id=components-separator--horizontal';

  test('visual regression', async ({ page }) => {
    await testComponent(page, {
      componentName: 'separator',
      storyUrl: STORY_URL,
      rootSelector: '[data-testid="story-root"]',
      states: [
        { name: 'horizontal' },
        { name: 'vertical', setup: async (_page, el) => {
          await el.evaluate((node) => {
            (node as HTMLElement).setAttribute('data-orientation', 'vertical');
          });
        }},
        { name: 'decorative-false', setup: async (_page, el) => {
          await el.evaluate((node) => {
            (node as HTMLElement).setAttribute('data-decorative', 'false');
          });
        }},
      ],
    });
  });
});
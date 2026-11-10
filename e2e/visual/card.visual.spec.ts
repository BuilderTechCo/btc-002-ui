import { test } from '@playwright/test';
import { testComponent, StateHelpers } from '../support/utils';

/** Card visual regression tests */
test.describe('Card', () => {
  const STORY_URL = '/iframe.html?id=components-card--default';

  test('visual regression', async ({ page }) => {
    await testComponent(page, {
      componentName: 'card',
      storyUrl: STORY_URL,
      rootSelector: '[data-testid="story-root"]',
      states: [
        { name: 'default' },
        { name: 'hover', setup: StateHelpers.hover },
        { name: 'outlined', setup: async (_page, el) => {
          await el.evaluate((node) => {
            (node as HTMLElement).setAttribute('data-variant', 'outlined');
          });
        }},
        { name: 'elevated', setup: async (_page, el) => {
          await el.evaluate((node) => {
            (node as HTMLElement).setAttribute('data-variant', 'elevated');
          });
        }},
      ],
    });
  });
});
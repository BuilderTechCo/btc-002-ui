import { test } from '@playwright/test';
import { testComponent, StateHelpers } from '../support/utils';

/** CopyButton visual regression tests */
test.describe('CopyButton', () => {
  const STORY_URL = '/iframe.html?id=components-copy-button--default';

  test('visual regression', async ({ page }) => {
    await testComponent(page, {
      componentName: 'copy-button',
      storyUrl: STORY_URL,
      rootSelector: '[data-testid="story-root"]',
      states: [
        { name: 'default' },
        { name: 'hover', setup: StateHelpers.hover },
        { name: 'success', setup: async (_page, el) => {
          await el.evaluate((node) => {
            (node as HTMLElement).setAttribute('data-success', 'true');
          });
        }},
        { name: 'variant-secondary', setup: async (_page, el) => {
          await el.evaluate((node) => {
            (node as HTMLElement).setAttribute('data-variant', 'secondary');
          });
        }},
        { name: 'variant-ghost', setup: async (_page, el) => {
          await el.evaluate((node) => {
            (node as HTMLElement).setAttribute('data-variant', 'ghost');
          });
        }},
        { name: 'size-md', setup: async (_page, el) => {
          await el.evaluate((node) => {
            (node as HTMLElement).setAttribute('data-size', 'md');
          });
        }},
      ],
    });
  });
});
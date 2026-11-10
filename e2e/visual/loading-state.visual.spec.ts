import { test } from '@playwright/test';
import { testComponent } from '../support/utils';

/** LoadingState visual regression tests */
test.describe('LoadingState', () => {
  const STORY_URL = '/iframe.html?id=components-loading-state--skeleton';

  test('visual regression', async ({ page }) => {
    await testComponent(page, {
      componentName: 'loading-state',
      storyUrl: STORY_URL,
      rootSelector: '[data-testid="story-root"]',
      states: [
        { name: 'skeleton' },
        { name: 'skeleton-5-lines', setup: async (_page, el) => {
          await el.evaluate((node) => {
            (node as HTMLElement).setAttribute('data-lines', '5');
          });
        }},
        { name: 'spinner', setup: async (_page, el) => {
          await el.evaluate((node) => {
            (node as HTMLElement).setAttribute('data-variant', 'spinner');
          });
        }},
        { name: 'inline', setup: async (_page, el) => {
          await el.evaluate((node) => {
            (node as HTMLElement).setAttribute('data-variant', 'inline');
          });
        }},
        { name: 'page', setup: async (_page, el) => {
          await el.evaluate((node) => {
            (node as HTMLElement).setAttribute('data-variant', 'page');
          });
        }},
        { name: 'animation-wave', setup: async (_page, el) => {
          await el.evaluate((node) => {
            (node as HTMLElement).setAttribute('data-animation', 'wave');
          });
        }},
        { name: 'animation-pulse', setup: async (_page, el) => {
          await el.evaluate((node) => {
            (node as HTMLElement).setAttribute('data-animation', 'pulse');
          });
        }},
      ],
    });
  });
});
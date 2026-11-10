import { test } from '@playwright/test';
import { testComponent } from '../support/utils';

/** EmptyState visual regression tests */
test.describe('EmptyState', () => {
  const STORY_URL = '/iframe.html?id=components-empty-state--default';

  test('visual regression', async ({ page }) => {
    await testComponent(page, {
      componentName: 'empty-state',
      storyUrl: STORY_URL,
      rootSelector: '[data-testid="story-root"]',
      states: [
        { name: 'default' },
        { name: 'search', setup: async (_page, el) => {
          await el.evaluate((node) => {
            (node as HTMLElement).setAttribute('data-illustration', 'search');
          });
        }},
        { name: 'folder', setup: async (_page, el) => {
          await el.evaluate((node) => {
            (node as HTMLElement).setAttribute('data-illustration', 'folder');
          });
        }},
        { name: 'inbox', setup: async (_page, el) => {
          await el.evaluate((node) => {
            (node as HTMLElement).setAttribute('data-illustration', 'inbox');
          });
        }},
        { name: 'users', setup: async (_page, el) => {
          await el.evaluate((node) => {
            (node as HTMLElement).setAttribute('data-illustration', 'users');
          });
        }},
        { name: 'with-action', setup: async (_page, el) => {
          await el.evaluate((node) => {
            (node as HTMLElement).setAttribute('data-action', 'true');
          });
        }},
        { name: 'custom-icon', setup: async (_page, el) => {
          await el.evaluate((node) => {
            (node as HTMLElement).setAttribute('data-custom-icon', 'true');
          });
        }},
      ],
    });
  });
});
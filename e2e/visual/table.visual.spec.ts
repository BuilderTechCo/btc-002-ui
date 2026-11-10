import { test } from '@playwright/test';
import { testComponent } from '../support/utils';

/** Table visual regression tests */
test.describe('Table', () => {
  const STORY_URL = '/iframe.html?id=components-table--default';

  test('visual regression', async ({ page }) => {
    await testComponent(page, {
      componentName: 'table',
      storyUrl: STORY_URL,
      rootSelector: '[data-testid="story-root"]',
      states: [
        { name: 'default' },
        { name: 'striped', setup: async (_page, el) => {
          await el.evaluate((node) => {
            (node as HTMLElement).setAttribute('data-variant', 'striped');
          });
        }},
        { name: 'bordered', setup: async (_page, el) => {
          await el.evaluate((node) => {
            (node as HTMLElement).setAttribute('data-variant', 'bordered');
          });
        }},
        { name: 'sm', setup: async (_page, el) => {
          await el.evaluate((node) => {
            (node as HTMLElement).setAttribute('data-size', 'sm');
          });
        }},
        { name: 'lg', setup: async (_page, el) => {
          await el.evaluate((node) => {
            (node as HTMLElement).setAttribute('data-size', 'lg');
          });
        }},
        { name: 'selected-row', setup: async (_page, el) => {
          await el.evaluate((node) => {
            const row = node.querySelector('tr');
            row?.setAttribute('data-selected', 'true');
          });
        }},
        { name: 'clickable-row', setup: async (_page, el) => {
          await el.evaluate((node) => {
            const row = node.querySelector('tr');
            row?.setAttribute('data-clickable', 'true');
          });
        }},
      ],
    });
  });
});
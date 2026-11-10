import { test } from '@playwright/test';
import { testComponent } from '../support/utils';

/** Dialog visual regression tests */
test.describe('Dialog', () => {
  const STORY_URL = '/iframe.html?id=components-dialog--default';

  test('visual regression', async ({ page }) => {
    await testComponent(page, {
      componentName: 'dialog',
      storyUrl: STORY_URL,
      rootSelector: '[data-testid="story-root"]',
      states: [
        { name: 'default' },
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
        { name: 'xl', setup: async (_page, el) => {
          await el.evaluate((node) => {
            (node as HTMLElement).setAttribute('data-size', 'xl');
          });
        }},
        { name: 'full', setup: async (_page, el) => {
          await el.evaluate((node) => {
            (node as HTMLElement).setAttribute('data-size', 'full');
          });
        }},
        { name: 'align-top', setup: async (_page, el) => {
          await el.evaluate((node) => {
            (node as HTMLElement).setAttribute('data-align', 'top');
          });
        }},
        { name: 'align-bottom', setup: async (_page, el) => {
          await el.evaluate((node) => {
            (node as HTMLElement).setAttribute('data-align', 'bottom');
          });
        }},
      ],
    });
  });
});
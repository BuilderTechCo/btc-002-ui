import { test } from '@playwright/test';
import { testComponent, StateHelpers } from '../support/utils';

/** NavLink visual regression tests */
test.describe('NavLink', () => {
  const STORY_URL = '/iframe.html?id=components-nav-link--default';

  test('visual regression', async ({ page }) => {
    await testComponent(page, {
      componentName: 'nav-link',
      storyUrl: STORY_URL,
      rootSelector: '[data-testid="story-root"]',
      states: [
        { name: 'default' },
        { name: 'active', setup: async (_page, el) => {
          await el.evaluate((node) => {
            (node as HTMLElement).setAttribute('data-active', 'true');
          });
        }},
        { name: 'hover', setup: StateHelpers.hover },
        { name: 'focus', setup: StateHelpers.focus },
        { name: 'with-icon', setup: async (_page, el) => {
          await el.evaluate((node) => {
            (node as HTMLElement).setAttribute('data-icon', 'true');
          });
        }},
        { name: 'with-badge', setup: async (_page, el) => {
          await el.evaluate((node) => {
            (node as HTMLElement).setAttribute('data-badge', '5');
          });
        }},
        { name: 'exact-match', setup: async (_page, el) => {
          await el.evaluate((node) => {
            (node as HTMLElement).setAttribute('data-exact', 'true');
          });
        }},
      ],
    });
  });
});
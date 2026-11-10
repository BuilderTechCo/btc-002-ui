import { test, expect } from '@playwright/test';
import { testComponent, StateHelpers, snapshotName } from '../support/utils';

/** Button visual regression tests */
test.describe('Button', () => {
  const STORY_URL = '/iframe.html?id=components-button--primary';

  test('visual regression', async ({ page }) => {
    await testComponent(page, {
      componentName: 'button',
      storyUrl: STORY_URL,
      rootSelector: '[data-testid="story-root"]',
      states: [
        { name: 'default' },
        { name: 'hover', setup: StateHelpers.hover },
        { name: 'focus', setup: StateHelpers.focus },
        { name: 'disabled', setup: StateHelpers.disabled },
        { name: 'loading', setup: StateHelpers.loading },
      ],
      // Máscara para elementos dinámicos (si los hay)
      maskSelectors: ['.timestamp', '.random-id'],
    });
  });
});

/** Ejemplo: test manual para casos especiales */
test.describe('Button - variant matrix', () => {
  const VARIANTS = ['primary', 'secondary', 'outline', 'ghost', 'destructive'] as const;
  const SIZES = ['sm', 'md', 'lg'] as const;

  for (const variant of VARIANTS) {
    for (const size of SIZES) {
      test(`${variant}-${size}`, async ({ page }) => {
        const storyUrl = `/iframe.html?id=components-button--${variant}&args=size:${size}`;

        await page.goto(storyUrl, { waitUntil: 'networkidle' });
        await page.evaluate(() => {
          document.documentElement.setAttribute('data-theme', 'light');
        });

        const button = page.locator('[data-testid="button-story"] button');
        await expect(button).toBeVisible();
        // waitForTimeout reemplazado por waitForLoadState para estabilidad
        await page.waitForLoadState('networkidle');

        await expect(button).toHaveScreenshot(
          snapshotName('button', `${variant}-${size}`, 'light', 'desktop'),
          { animations: 'disabled', caret: 'hide' }
        );
      });
    }
  }
});

/** Ejemplo: test con tema dark solo para variantes críticas */
test.describe('Button - dark theme critical variants', () => {
  const CRITICAL_VARIANTS = ['primary', 'destructive'] as const;

  for (const variant of CRITICAL_VARIANTS) {
    test(`${variant}-dark`, async ({ page }) => {
      const storyUrl = `/iframe.html?id=components-button--${variant}`;

      await page.goto(storyUrl, { waitUntil: 'networkidle' });
      await page.evaluate(() => {
        document.documentElement.setAttribute('data-theme', 'dark');
      });

      const button = page.locator('[data-testid="button-story"] button');
      await expect(button).toBeVisible();
      // waitForTimeout reemplazado por waitForLoadState para estabilidad
      await page.waitForLoadState('networkidle');

      await expect(button).toHaveScreenshot(
        snapshotName('button', `${variant}-dark`, 'dark', 'desktop'),
        { animations: 'disabled', caret: 'hide' }
      );
    });
  }
});
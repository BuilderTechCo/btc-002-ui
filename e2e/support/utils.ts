import { expect } from '@playwright/test';
import type { Page, Locator } from '@playwright/test';

/** Configuración de un estado de componente para testear */
export interface ComponentState {
  /** Nombre del estado (ej: 'default', 'hover', 'disabled', 'loading') */
  name: string;
  /** Selector o función para poner el componente en este estado */
  setup?: (page: Page, component: Locator) => Promise<void>;
  /** Selector específico dentro del componente (por defecto el root) */
  selector?: string;
}

/** Opciones para testComponent */
export interface TestComponentOptions {
  /** Nombre base del componente (para screenshots: button-default-light-mobile.png) */
  componentName: string;
  /** URL de la historia en Storybook (ej: '/iframe.html?id=components-button--primary') */
  storyUrl: string;
  /** Estados a testear (default = solo estado base) */
  states?: ComponentState[];
  /** Viewports a testear (default = todos los del config) */
  viewports?: string[];
  /** Temas a testear (default = light, dark) */
  themes?: ('light' | 'dark')[];
  /** Selector del contenedor raíz del componente en la historia */
  rootSelector?: string;
  /** Esperar antes del screenshot (ms) — para animaciones, fuentes, etc. */
  waitBeforeScreenshot?: number;
  /** Máscara de áreas dinámicas (fecha, random, etc.) */
  maskSelectors?: string[];
}

/**
 * Test helper principal para visual regression de un componente.
 * Itera viewports × temas × estados y genera snapshots.
 */
export async function testComponent(
  page: Page,
  options: TestComponentOptions
) {
  const {
    componentName,
    storyUrl,
    states = [{ name: 'default' }],
    viewports = ['mobile', 'tablet', 'laptop', 'desktop'],
    themes = ['light', 'dark'],
    rootSelector = '[data-testid="story-root"]',
    waitBeforeScreenshot = 300,
    maskSelectors = [],
  } = options;

  for (const theme of themes) {
    for (const viewport of viewports) {
      // Navegar a la historia con tema
      await page.goto(storyUrl, { waitUntil: 'networkidle' });
      await page.evaluate((t) => {
        document.documentElement.setAttribute('data-theme', t);
      }, theme);

      // Esperar fuentes y layout
      await page.waitForLoadState('networkidle');
      // waitBeforeScreenshot: usar waitForFunction para evitar waitForTimeout
      if (waitBeforeScreenshot > 0) {
        await page.waitForFunction((ms) => new Promise(r => setTimeout(r, ms)), waitBeforeScreenshot);
      }

      // Esperar a que el story-root esté visible (el contenedor del componente)
      const root = page.locator(rootSelector);
      await expect(root).toBeVisible({ timeout: 10000 });

      for (const state of states) {
        const target = state.selector ? root.locator(state.selector) : root;

        // Setup del estado (hover, focus, disabled, etc.)
        if (state.setup) {
          await state.setup(page, target);
          // estabilizar: usar waitForFunction en lugar de waitForTimeout
          await page.waitForFunction(() => Promise.resolve(), 100);
        }

        // Aplicar máscaras si hay
        for (const mask of maskSelectors) {
          await page.locator(mask).evaluate((el) => {
            (el as HTMLElement).style.visibility = 'hidden';
          });
        }

        // Screenshot
        const snapshotName = `${componentName}-${state.name}-${theme}-${viewport}.png`;
        await expect(target).toHaveScreenshot(snapshotName, {
          // Config por test (override global si needed)
          animations: 'disabled',
          caret: 'hide',
          scale: 'css',
        });
      }
    }
  }
}

/** Helpers comunes para states */
export const StateHelpers = {
  /** Hover sobre el elemento */
  hover: async (page: Page, el: Locator) => {
    await el.hover();
    // Estabilizar: esperar a que termine la transición CSS
    await el.waitFor({ state: 'attached' });
  },

  /** Focus visible (Tab) */
  focus: async (page: Page, el: Locator) => {
    await el.focus();
    await el.waitFor({ state: 'visible' });
  },

  /** Click y esperar */
  click: async (page: Page, el: Locator) => {
    await el.click();
    await page.waitForLoadState('networkidle');
  },

  /** Deshabilitado (si el componente lo soporta via data attribute) */
  disabled: async (_page: Page, el: Locator) => {
    await el.evaluate((node) => {
      (node as HTMLElement).setAttribute('data-disabled', 'true');
      (node as HTMLElement).setAttribute('aria-disabled', 'true');
    });
  },

  /** Loading state */
  loading: async (_page: Page, el: Locator) => {
    await el.evaluate((node) => {
      (node as HTMLElement).setAttribute('data-loading', 'true');
    });
  },

  /** Error state */
  error: async (_page: Page, el: Locator) => {
    await el.evaluate((node) => {
      (node as HTMLElement).setAttribute('data-error', 'true');
    });
  },
};

/** Genera nombre de snapshot consistente */
export function snapshotName(
  component: string,
  variant: string,
  theme: string,
  viewport: string
): string {
  return `${component}-${variant}-${theme}-${viewport}.png`;
}

/** Configura viewport y tema en una sola llamada */
export async function setupViewport(
  page: Page,
  viewport: { width: number; height: number },
  theme: 'light' | 'dark'
) {
  await page.setViewportSize(viewport);
  await page.evaluate((t) => {
    document.documentElement.setAttribute('data-theme', t);
  }, theme);
  await page.waitForLoadState('networkidle');
}
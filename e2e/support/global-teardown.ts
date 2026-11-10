import type { FullConfig } from "@playwright/test";

export default function globalTeardown(_config: FullConfig) {
  // En CI no hay proceso local que matar
  if (process.env.CI) return;

  // El proceso de Storybook se mata automáticamente cuando el test runner termina
  // (se ejecuta como hijo del proceso Node de Playwright)
  console.warn("[globalTeardown] Limpieza completada");
}

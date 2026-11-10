import { defineConfig, devices } from "@playwright/test";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** Viewports objetivo (mobile → desktop) */
const VIEWPORTS = [
  { name: "mobile", width: 360, height: 800 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "laptop", width: 1024, height: 1024 },
  { name: "desktop", width: 1440, height: 1024 },
] as const;

/** Temas soportados */
const THEMES = ["light", "dark"] as const;

/** Genera 8 proyectos: 4 viewports × 2 temas */
const projects = VIEWPORTS.flatMap(({ name, width, height }) =>
  THEMES.map((theme) => ({
    name: `${theme}-${name}`,
    use: {
      ...devices["Desktop Chrome"],
      viewport: { width, height },
      colorScheme: theme,
      // Base URL apunta al servidor de preview del DS (Storybook, o app demo)
      baseURL: "http://localhost:6006",
    },
  })),
);

export default defineConfig({
  // ── Estructura ──────────────────────────────────────────────
  testDir: "./e2e/visual",
  snapshotDir: "./e2e/visual/snapshots",
  outputDir: "./test-results",

  // ── Timeouts ────────────────────────────────────────────────
  timeout: 30_000,
  expect: {
    timeout: 10_000,
    toHaveScreenshot: {
      // Umbral de diferencia permitida (0-1)
      maxDiffPixels: 0,
      maxDiffPixelRatio: 0.001,
      // Umbral de color (más estricto = más sensible)
      threshold: 0.2,
      // Animaciones: esperar a que se estabilicen
      animations: "disabled",
      // Caret (cursor) invisible
      caret: "hide",
      // Escala para HiDPI
      scale: "css",
    },
  },

  // ── Reintentos (flaky guard) ───────────────────────────────
  retries: process.env.CI ? 2 : 0,

  // ── Reporter ───────────────────────────────────────────────
  reporter: [
    ["html", { outputFolder: "./playwright-report", open: "never" }],
    ["list"],
    ["json", { outputFile: "./test-results/results.json" }],
  ],

  // ── Proyectos (8 combinaciones) ────────────────────────────
  projects,

  // ── Configuración global ───────────────────────────────────
  use: {
    // Trace solo en fallos (CI)
    trace: "on-first-retry",
    // Video solo en CI
    video: process.env.CI ? "retain-on-failure" : "off",
    // Screenshot solo en fallo
    screenshot: "only-on-failure",
    // Acción base: navegar a componente isolado
    actionTimeout: 10_000,
    navigationTimeout: 15_000,
  },

  // ── Web Server (opcional: levanta Storybook/preview local) ──
  webServer: process.env.CI
    ? undefined
    : {
        command: "pnpm storybook --ci --port 6006",
        url: "http://localhost:6006",
        reuseExistingServer: !process.env.CI,
        timeout: 60_000,
        stderr: "pipe",
      },

  // ── Global setup/teardown ─────────────────────────────────
  globalSetup: "./e2e/support/global-setup.ts",
  globalTeardown: "./e2e/support/global-teardown.ts",
});

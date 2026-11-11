import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineWorkspace } from "vitest/config";
import { storybookTest } from "@storybook/experimental-addon-test/vitest-plugin";

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineWorkspace([
  // Unit tests - run in Node environment (no DOM needed)
  {
    extends: "./vitest.config.ts",
    test: {
      name: "unit",
      environment: "node",
      include: ["src/lib/**/*.{test,spec}.{ts,tsx}"],
      setupFiles: ["./src/test/setup-unit.ts"],
      poolOptions: {
        forks: {
          // @ts-expect-error maxForks is supported at runtime but missing from types
          maxForks: 2,
        },
      },
      exclude: [
        "e2e/**",
        "scripts/**",
        "node_modules/**",
        "dist/**",
        "src/components/**",
      ],
    },
  },
  // Integration tests - run in jsdom environment (DOM needed)
  {
    extends: "./vitest.config.ts",
    test: {
      name: "integration",
      environment: "jsdom",
      include: ["src/components/**/*.{test,spec}.{ts,tsx}"],
      setupFiles: ["./src/test/setup.ts"],
      poolOptions: {
        forks: {
          // @ts-expect-error maxForks is supported at runtime but missing from types
          maxForks: 2,
        },
      },
      exclude: [
        "e2e/**",
        "scripts/**",
        "node_modules/**",
        "dist/**",
        "src/lib/**",
      ],
    },
  },
  // Storybook tests - render every story in a real browser with Playwright
  {
    // Sin `extends`: el plugin construye su propia config de Vite a partir
    // de .storybook/main.ts y genera el `include` desde el índice de stories.
    plugins: [storybookTest({ configDir: path.join(dirname, ".storybook") })],
    test: {
      name: "storybook",
      browser: {
        enabled: true,
        headless: true,
        name: "chromium",
        provider: "playwright",
      },
      setupFiles: ["./.storybook/vitest.setup.ts"],
    },
  },
]);

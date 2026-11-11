import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const sharedPlugins = [
  react({
    jsxImportSource: "react",
  }),
  tailwindcss(),
];

const sharedAlias = {
  "@": path.resolve(__dirname, "./src"),
};

const sharedCoverageExclude = [
  "node_modules/**",
  "dist/**",
  "src/test/**",
  "**/*.d.ts",
  "**/*.stories.tsx",
  "**/*.test.tsx",
  "**/*.spec.tsx",
  "scripts/**",
  "src/styles/**",
  ".storybook/**",
  "storybook-static/**",
  "vitest.config.ts",
  "vitest.workspace.ts",
  "eslint.config.js",
];

export default defineConfig({
  plugins: sharedPlugins,
  resolve: { alias: sharedAlias },
  test: {
    globals: true,
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    exclude: ["e2e/**", "scripts/**", "node_modules/**", "dist/**"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html", "lcov"],
      exclude: sharedCoverageExclude,
      thresholds: {
        lines: 50,
        functions: 50,
        branches: 50,
        statements: 50,
      },
    },
    deps: {
      optimizer: {
        web: {
          include: ["@buildertechco/ui"],
        },
      },
    },
  },
});

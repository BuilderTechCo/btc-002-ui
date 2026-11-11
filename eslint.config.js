// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

// eslint.config.js
// Configuración ESLint flat config para @buildertechco/ui

import js from "@eslint/js";
import tseslint from "typescript-eslint";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import jsxA11yPlugin from "eslint-plugin-jsx-a11y";
import prettierConfig from "eslint-config-prettier";
import testingLibraryPlugin from "eslint-plugin-testing-library";
import vitestPlugin from "@vitest/eslint-plugin";
import playwrightPlugin from "eslint-plugin-playwright";

export default tseslint.config(
  {
    ignores: [
      "dist/**",
      "node_modules/**",
      "*.config.*",
      "*.d.ts",
      "playwright-report/**",
      "test-results/**",
      "coverage/**",
      "*.tsbuildinfo",
      "storybook-static/**",
      "e2e/visual/snapshots/**",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...tseslint.configs.stylistic,
  // Config para test files - sin project para evitar errores de parser
  // Debe ir ANTES de la config general para que coincida primero
  {
    files: [
      "**/*.test.ts",
      "**/*.test.tsx",
      "**/*.spec.ts",
      "**/*.spec.tsx",
      "src/test/setup.ts",
      "src/test/setup-unit.ts",
    ],
    ignores: ["e2e/**"],
    plugins: {
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
      "jsx-a11y": jsxA11yPlugin,
      "testing-library": testingLibraryPlugin,
      vitest: vitestPlugin,
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: "latest",
        sourceType: "module",
        // No project para test files - evita error "file not found in project"
      },
      globals: {
        React: "writable",
        JSX: "readonly",
        window: "readonly",
        document: "readonly",
        navigator: "readonly",
        localStorage: "readonly",
        console: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        vi: "readonly",
        describe: "readonly",
        it: "readonly",
        expect: "readonly",
        beforeAll: "readonly",
        afterAll: "readonly",
        beforeEach: "readonly",
        afterEach: "readonly",
      },
    },
    settings: {
      react: {
        version: "18.3",
      },
      vitest: {
        vitestImports: ["vitest"],
      },
    },
    rules: {
      // React rules
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "react/display-name": "warn",
      "react/self-closing-comp": "warn",
      "react/jsx-uses-react": "off",
      "react/jsx-uses-vars": "off",
      "react/no-unknown-property": "warn",

      // React Hooks rules
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      // JSX A11y rules
      "jsx-a11y/anchor-is-valid": "warn",
      "jsx-a11y/click-events-have-key-events": "warn",
      "jsx-a11y/no-noninteractive-element-interactions": "warn",
      "jsx-a11y/role-has-required-aria-props": "warn",
      "jsx-a11y/alt-text": "error",

      // Testing Library rules - quality gate
      "testing-library/await-async-queries": "error",
      "testing-library/no-await-sync-queries": "error",
      "testing-library/no-debugging-utils": "error",
      "testing-library/no-unnecessary-act": "error",
      "testing-library/prefer-screen-queries": "error",
      "testing-library/prefer-find-by": "error",
      "testing-library/no-container": "error",
      "testing-library/no-node-access": "error",

      // Vitest rules - quality gate
      "vitest/no-disabled-tests": "error",
      "vitest/no-focused-tests": "error",
      "vitest/no-identical-title": "error",
      "vitest/prefer-hooks-in-order": "warn",
      "vitest/prefer-hooks-on-top": "warn",
      "vitest/prefer-lowercase-title": "warn",
      "vitest/require-hook": "error",
      "vitest/consistent-test-it": ["warn", { fn: "test" }],
      "vitest/expect-expect": "error",

      // TypeScript rules - deshabilitar reglas que requieren type info (project)
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/consistent-type-imports": "warn",
      "@typescript-eslint/no-floating-promises": "off",
      "@typescript-eslint/no-misused-promises": "off",
      "@typescript-eslint/require-await": "off",

      // General rules
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "prefer-const": "warn",
      "no-var": "error",

      // Restricted syntax - no ByTestId
      "no-restricted-syntax": [
        "error",
        {
          selector: "CallExpression[callee.property.name=/ByTestId$/]",
          message: "Usa getByRole / getByLabelText en lugar de getByTestId",
        },
      ],
    },
  },
  // Config general para archivos source (incluye stories, excluye tests)
  {
    files: ["**/*.{ts,tsx}"],
    ignores: [
      "**/*.test.ts",
      "**/*.test.tsx",
      "**/*.spec.ts",
      "**/*.spec.tsx",
      "src/test/setup.ts",
      "src/test/setup-unit.ts",
    ],
    plugins: {
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
      "jsx-a11y": jsxA11yPlugin,
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: "latest",
        sourceType: "module",
        project: "./tsconfig.eslint.json",
      },
      globals: {
        React: "writable",
        JSX: "readonly",
        window: "readonly",
        document: "readonly",
        navigator: "readonly",
        localStorage: "readonly",
        console: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
      },
    },
    settings: {
      react: {
        version: "18.3",
      },
    },
    rules: {
      // React rules
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "react/display-name": "warn",
      "react/self-closing-comp": "warn",
      "react/jsx-uses-react": "off",
      "react/jsx-uses-vars": "off",
      "react/no-unknown-property": "warn",

      // React Hooks rules
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      // JSX A11y rules
      "jsx-a11y/anchor-is-valid": "warn",
      "jsx-a11y/click-events-have-key-events": "warn",
      "jsx-a11y/no-noninteractive-element-interactions": "warn",
      "jsx-a11y/role-has-required-aria-props": "warn",
      "jsx-a11y/alt-text": "error",

      // TypeScript rules
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/consistent-type-imports": "warn",
      "@typescript-eslint/no-floating-promises": "warn",
      "@typescript-eslint/no-misused-promises": "warn",
      "@typescript-eslint/require-await": "warn",

      // General rules
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "prefer-const": "warn",
      "no-var": "error",
    },
  },
  prettierConfig,
  storybook.configs["flat/recommended"],
  {
    files: ["**/*.stories.tsx", "**/*.stories.ts"],
    rules: {
      "storybook/no-renderer-packages": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-explicit-any": "error",
    },
  },
  // Config para e2e/ - usa project para type-aware
  {
    files: ["e2e/**/*.{ts,tsx}"],
    plugins: {
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
      "jsx-a11y": jsxA11yPlugin,
      playwright: playwrightPlugin,
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: { jsx: true },
        ecmaVersion: "latest",
        sourceType: "module",
        project: "./tsconfig.eslint.json",
      },
      globals: {
        React: "writable",
        JSX: "readonly",
        window: "readonly",
        document: "readonly",
        navigator: "readonly",
        localStorage: "readonly",
        console: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        test: "readonly",
        expect: "readonly",
        page: "readonly",
        browser: "readonly",
        context: "readonly",
        beforeAll: "readonly",
        afterAll: "readonly",
        beforeEach: "readonly",
        afterEach: "readonly",
        describe: "readonly",
        it: "readonly",
      },
    },
    settings: { react: { version: "18.3" } },
    rules: {
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "react/display-name": "warn",
      "react/self-closing-comp": "warn",
      "react/jsx-uses-react": "off",
      "react/jsx-uses-vars": "off",
      "react/no-unknown-property": "warn",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "jsx-a11y/anchor-is-valid": "warn",
      "jsx-a11y/click-events-have-key-events": "warn",
      "jsx-a11y/no-noninteractive-element-interactions": "warn",
      "jsx-a11y/role-has-required-aria-props": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/consistent-type-imports": "warn",
      "@typescript-eslint/no-floating-promises": "warn",
      "@typescript-eslint/no-misused-promises": "warn",
      "@typescript-eslint/require-await": "warn",
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "prefer-const": "warn",
      "no-var": "error",

      // Playwright rules
      "playwright/no-conditional-in-test": "error",
      "playwright/no-focused-test": "error",
      "playwright/no-skipped-test": "warn",
      "playwright/require-to-throw-message": "error",
      "playwright/valid-title": "warn",
      "playwright/no-page-pause": "error",
      "playwright/no-wait-for-timeout": "error",
      "playwright/expect-expect": "off",
      "playwright/prefer-web-first-assertions": "error",

      // Restricted syntax - no ByTestId
      "no-restricted-syntax": [
        "error",
        {
          selector: "CallExpression[callee.property.name=/ByTestId$/]",
          message: "Usa getByRole / getByLabelText en lugar de getByTestId",
        },
      ],
    },
  },
  // Config para scripts/ TypeScript - usa project para type-aware
  {
    files: ["scripts/**/*.{ts,tsx}"],
    plugins: {
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
      "jsx-a11y": jsxA11yPlugin,
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: { jsx: true },
        ecmaVersion: "latest",
        sourceType: "module",
        project: "./tsconfig.eslint.json",
      },
      globals: {
        React: "writable",
        JSX: "readonly",
        console: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        process: "readonly",
        __dirname: "readonly",
        import: "readonly",
        module: "readonly",
        require: "readonly",
        global: "readonly",
      },
    },
    settings: { react: { version: "18.3" } },
    rules: {
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "react/display-name": "warn",
      "react/self-closing-comp": "warn",
      "react/jsx-uses-react": "off",
      "react/jsx-uses-vars": "off",
      "react/no-unknown-property": "warn",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "jsx-a11y/anchor-is-valid": "warn",
      "jsx-a11y/click-events-have-key-events": "warn",
      "jsx-a11y/no-noninteractive-element-interactions": "warn",
      "jsx-a11y/role-has-required-aria-props": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/consistent-type-imports": "warn",
      "@typescript-eslint/no-floating-promises": "warn",
      "@typescript-eslint/no-misused-promises": "warn",
      "@typescript-eslint/require-await": "warn",
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "prefer-const": "warn",
      "no-var": "error",
    },
  },
  // Config para scripts/ JavaScript (.mjs) - sin project, sin reglas type-aware
  {
    files: ["scripts/**/*.mjs"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        console: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        process: "readonly",
        __dirname: "readonly",
        import: "readonly",
        module: "readonly",
        require: "readonly",
        global: "readonly",
      },
    },
    rules: {
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "prefer-const": "warn",
      "no-var": "error",
    },
  },
);

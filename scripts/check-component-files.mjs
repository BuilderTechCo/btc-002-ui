#!/usr/bin/env node
/**
 * check-component-files.mjs
 * Verifica que cada componente en src/components/ tenga los 4 archivos requeridos:
 * - index.ts
 * - <nombre>.tsx
 * - <nombre>.test.tsx
 * - <nombre>.stories.tsx
 */

import { readdirSync } from "fs";
import { join } from "path";

const componentsDir = join(process.cwd(), "src", "components");

function checkComponents() {
  let hasErrors = false;
  const errors = [];

  const entries = readdirSync(componentsDir, { withFileTypes: true });
  const components = entries.filter((e) => e.isDirectory()).map((e) => e.name);

  console.warn(
    `🔍 Verificando ${components.length} componentes en src/components/...\n`,
  );

  for (const component of components) {
    const componentPath = join(componentsDir, component);
    const files = readdirSync(componentPath);

    // Check index.ts
    if (!files.includes("index.ts")) {
      errors.push(`${component}: falta index.ts`);
      hasErrors = true;
      continue;
    }

    // Check main component file (e.g., button.tsx)
    const mainFile = files.find((f) => f === `${component}.tsx`);
    if (!mainFile) {
      errors.push(`${component}: falta ${component}.tsx`);
      hasErrors = true;
      continue;
    }

    // Check test file
    const testFile = files.find((f) => f === `${component}.test.tsx`);
    if (!testFile) {
      errors.push(`${component}: falta ${component}.test.tsx`);
      hasErrors = true;
      continue;
    }

    // Check stories file
    const storiesFile = files.find((f) => f === `${component}.stories.tsx`);
    if (!storiesFile) {
      errors.push(`${component}: falta ${component}.stories.tsx`);
      hasErrors = true;
      continue;
    }

    console.warn(`  ✅ ${component}`);
  }

  if (hasErrors) {
    console.error("\n❌ Errores encontrados:");
    for (const error of errors) {
      console.error(`  - ${error}`);
    }
    process.exit(1);
  } else {
    console.warn(
      "\n✅ check:component-files PASÓ - Todos los componentes tienen los 4 archivos requeridos",
    );
    process.exit(0);
  }
}

checkComponents();

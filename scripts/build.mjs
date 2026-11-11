import {
  rmSync,
  copyFileSync,
  mkdirSync,
  readdirSync,
  statSync,
  writeFileSync,
} from "fs";
import { execSync } from "child_process";
import { join } from "path";
import { fixImportsInDir } from "./fix-imports.mjs";

// Clean dist
try {
  rmSync("dist", { recursive: true, force: true });
} catch {
  // ignore if dist doesn't exist
}

// Run tsc - this generates .js and .d.ts files in dist/
execSync("tsc -p tsconfig.build.json", { stdio: "inherit" });
fixImportsInDir("dist");

// Copy CSS files from src/styles to dist/styles
mkdirSync("dist/styles", { recursive: true });
for (const file of readdirSync("src/styles")) {
  const srcPath = join("src/styles", file);
  if (statSync(srcPath).isFile() && file.endsWith(".css")) {
    copyFileSync(srcPath, join("dist/styles", file));
  }
}

// Create wrapper files for lib/classnames and lib/fonts to match exports
// exports expect: ./dist/lib/classnames.d.ts, ./dist/lib/classnames.js
// but tsc generates: ./dist/lib/classnames/index.d.ts, ./dist/lib/classnames/index.js
// These modules ONLY have named exports, no default export.

// lib/classnames - re-export all named exports
writeFileSync(
  "dist/lib/classnames.d.ts",
  `export * from './classnames/index.js';\n`,
);
writeFileSync(
  "dist/lib/classnames.js",
  `export * from './classnames/index.js';\n`,
);

// lib/fonts - re-export all named exports
writeFileSync("dist/lib/fonts.d.ts", `export * from './fonts/index.js';\n`);
writeFileSync("dist/lib/fonts.js", `export * from './fonts/index.js';\n`);

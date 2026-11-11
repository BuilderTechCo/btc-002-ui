import assert from "node:assert/strict";
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import ts from "typescript";
import { fixImportsInDir } from "./fix-imports.mjs";

function createDist() {
  const root = mkdtempSync(join(tmpdir(), "buildertech-ui-dist-"));
  const dist = join(root, "dist");
  mkdirSync(join(dist, "components", "button"), { recursive: true });
  mkdirSync(join(dist, "components", "empty-state"), { recursive: true });
  mkdirSync(join(dist, "lib", "classnames"), { recursive: true });
  writeFileSync(join(dist, "components", "button", "index.js"), "");
  writeFileSync(join(dist, "components", "empty-state", "index.js"), "");
  writeFileSync(join(dist, "components", "empty-state", "empty-state.js"), "");
  writeFileSync(join(dist, "lib", "classnames", "classnames.js"), "");
  writeFileSync(join(dist, "lib", "classnames.js"), "");
  return { root, dist };
}

test("rewrites ESM relative imports against the emitted dist structure", () => {
  const { root, dist } = createDist();
  const entry = join(dist, "index.js");
  const component = join(dist, "components", "empty-state", "empty-state.js");
  writeFileSync(
    entry,
    [
      'export { Button } from "./components/button";',
      'export * from "./components/empty-state";',
      'import "./components/button";',
      'const component = import("./components/empty-state");',
    ].join("\n"),
  );
  writeFileSync(
    component,
    [
      'import { clsx } from "../../lib/classnames";',
      "import {",
      "  Button,",
      '} from "../button";',
    ].join("\n"),
  );

  try {
    fixImportsInDir(dist);

    assert.equal(
      readFileSync(entry, "utf8"),
      [
        'export { Button } from "./components/button/index.js";',
        'export * from "./components/empty-state/index.js";',
        'import "./components/button/index.js";',
        'const component = import("./components/empty-state/index.js");',
      ].join("\n"),
    );
    assert.equal(
      readFileSync(component, "utf8"),
      [
        'import { clsx } from "../../lib/classnames.js";',
        "import {",
        "  Button,",
        '} from "../button/index.js";',
      ].join("\n"),
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("leaves package imports, explicit extensions, comments, and source maps unchanged", () => {
  const { root, dist } = createDist();
  const entry = join(dist, "index.js");
  const declarations = join(dist, "index.d.ts");
  const sourceMap = join(dist, "index.js.map");
  const source = [
    'import React from "react";',
    'import styles from "./theme.css";',
    'import metadata from "./metadata.json";',
    'import legacy from "./legacy.cjs";',
    'import modern from "./modern.mjs";',
    '// import "./missing";',
    "const note = 'import \"./also-missing\"';",
  ].join("\n");
  writeFileSync(entry, source);
  writeFileSync(
    declarations,
    'export type { ButtonProps } from "./components/button/index.js";',
  );
  writeFileSync(sourceMap, '{"sources":["./missing"]}');

  try {
    fixImportsInDir(dist);

    assert.equal(readFileSync(entry, "utf8"), source);
    assert.equal(
      readFileSync(declarations, "utf8"),
      'export type { ButtonProps } from "./components/button/index.js";',
    );
    assert.equal(readFileSync(sourceMap, "utf8"), '{"sources":["./missing"]}');
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("fails with the importing file and unresolved relative specifier", () => {
  const { root, dist } = createDist();
  const entry = join(dist, "index.js");
  writeFileSync(entry, 'export * from "./missing";');

  try {
    assert.throws(
      () => fixImportsInDir(dist),
      (error) =>
        error.message.includes("dist/index.js") &&
        error.message.includes('"./missing"'),
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("does not add extensions again on repeated builds", () => {
  const { root, dist } = createDist();
  const entry = join(dist, "index.js");
  writeFileSync(entry, 'export { Button } from "./components/button";');

  try {
    fixImportsInDir(dist);
    fixImportsInDir(dist);

    assert.equal(
      readFileSync(entry, "utf8"),
      'export { Button } from "./components/button/index.js";',
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("rewrites declaration imports so package types resolve with NodeNext", () => {
  const root = mkdtempSync(join(tmpdir(), "buildertech-ui-types-"));
  const packageRoot = join(root, "package");
  const packageDist = join(packageRoot, "dist");
  const scopedPackage = join(root, "node_modules", "@fixture");
  mkdirSync(join(packageDist, "components", "button"), { recursive: true });
  mkdirSync(scopedPackage, { recursive: true });
  writeFileSync(
    join(packageRoot, "package.json"),
    JSON.stringify({
      name: "@fixture/ui",
      type: "module",
      exports: {
        ".": {
          types: "./dist/index.d.ts",
          import: "./dist/index.js",
        },
        "./button": {
          types: "./dist/components/button/index.d.ts",
          import: "./dist/components/button/index.js",
        },
      },
    }),
  );
  writeFileSync(join(packageDist, "index.js"), "export {};");
  writeFileSync(
    join(packageDist, "index.d.ts"),
    [
      'export type { ButtonProps } from "./components/button";',
      'export type ButtonReference = import("./components/button").ButtonProps;',
    ].join("\n"),
  );
  writeFileSync(
    join(packageDist, "components", "button", "index.js"),
    "export {};",
  );
  writeFileSync(
    join(packageDist, "components", "button", "index.d.ts"),
    'export type { ButtonProps } from "./button";',
  );
  writeFileSync(
    join(packageDist, "components", "button", "button.js"),
    "export {};",
  );
  writeFileSync(
    join(packageDist, "components", "button", "button.d.ts"),
    "export interface ButtonProps { label: string }",
  );
  symlinkSync(packageRoot, join(scopedPackage, "ui"), "dir");
  const consumer = join(root, "consumer.mts");
  writeFileSync(
    consumer,
    [
      'import type { ButtonProps } from "@fixture/ui";',
      'import type { ButtonProps as ButtonSubpathProps } from "@fixture/ui/button";',
      'const fromRoot: ButtonProps = { label: "root" };',
      'const fromSubpath: ButtonSubpathProps = { label: "subpath" };',
      "void [fromRoot, fromSubpath];",
    ].join("\n"),
  );

  try {
    fixImportsInDir(packageDist);
    fixImportsInDir(packageDist);

    const program = ts.createProgram([consumer], {
      module: ts.ModuleKind.NodeNext,
      moduleResolution: ts.ModuleResolutionKind.NodeNext,
      noEmit: true,
      skipLibCheck: false,
      strict: true,
      target: ts.ScriptTarget.ES2022,
    });
    const diagnostics = ts.getPreEmitDiagnostics(program);

    assert.deepEqual(
      diagnostics.map((diagnostic) =>
        ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n"),
      ),
      [],
    );
    assert.equal(
      readFileSync(join(packageDist, "index.d.ts"), "utf8"),
      [
        'export type { ButtonProps } from "./components/button/index.js";',
        'export type ButtonReference = import("./components/button/index.js").ButtonProps;',
      ].join("\n"),
    );
    assert.equal(
      readFileSync(
        join(packageDist, "components", "button", "index.d.ts"),
        "utf8",
      ),
      'export type { ButtonProps } from "./button.js";',
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

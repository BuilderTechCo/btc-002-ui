// @buildertechco/ui - check:contract Validator
// Valida que todos los exports públicos del paquete coincidan con package.json exports

import { readFileSync, readdirSync, statSync } from "fs";
import { resolve, relative, join } from "path";

interface ExportEntry {
  name: string;
  path: string;
}

interface Violation {
  type:
    | "missing-export"
    | "extra-export"
    | "missing-file"
    | "missing-barrel"
    | "version-mismatch";
  message: string;
  file?: string;
  exportName?: string;
}

type PackageExport = string | Record<string, string>;

const EXPORTS_DIR = "src";
const PACKAGE_JSON = "package.json";

function getPackageExports(): Record<string, PackageExport> {
  const pkg = JSON.parse(readFileSync(PACKAGE_JSON, "utf-8"));
  return pkg.exports || {};
}

function normalizeExportName(name: string): string {
  // Remove leading "./" and file extensions
  let normalized = name;
  if (normalized.startsWith("./")) {
    normalized = normalized.slice(2);
  }
  // Remove .css, .js, .d.ts extensions
  normalized = normalized.replace(/\.(css|js|d\.ts)$/, "");
  return normalized;
}

function getSourceExports(): ExportEntry[] {
  const exports: ExportEntry[] = [];

  // Escanear directorios de componentes
  const componentsDir = join(EXPORTS_DIR, "components");
  if (statSync(componentsDir).isDirectory()) {
    const componentDirs = readdirSync(componentsDir);
    for (const comp of componentDirs) {
      const compPath = join(componentsDir, comp);
      if (statSync(compPath).isDirectory()) {
        // Verificar index.ts o index.tsx
        const indexTs = join(compPath, "index.ts");
        const indexTsx = join(compPath, "index.tsx");
        if (statSync(indexTs).isFile() || statSync(indexTsx).isFile()) {
          exports.push({ name: comp, path: relative(EXPORTS_DIR, compPath) });
        }
      }
    }
  }

  // lib/*
  const libDir = join(EXPORTS_DIR, "lib");
  if (statSync(libDir).isDirectory()) {
    const libDirs = readdirSync(libDir);
    for (const lib of libDirs) {
      const libPath = join(libDir, lib);
      if (statSync(libPath).isDirectory()) {
        const indexTs = join(libPath, "index.ts");
        if (statSync(indexTs).isFile()) {
          exports.push({
            name: `lib/${lib}`,
            path: relative(EXPORTS_DIR, libPath),
          });
        }
      } else if (
        lib === "classnames.ts" ||
        lib === "icon.ts" ||
        lib === "fonts.ts"
      ) {
        exports.push({
          name: `lib/${lib.replace(".ts", "")}`,
          path: relative(EXPORTS_DIR, libPath),
        });
      }
    }
  }

  // styles/*
  const stylesDir = join(EXPORTS_DIR, "styles");
  if (statSync(stylesDir).isDirectory()) {
    const styleFiles = readdirSync(stylesDir).filter((f) => f.endsWith(".css"));
    for (const style of styleFiles) {
      exports.push({
        name: `styles/${style.replace(".css", "")}`,
        path: `styles/${style}`,
      });
    }
  }

  // Entry point principal
  const mainIndex = join(EXPORTS_DIR, "index.ts");
  if (statSync(mainIndex).isFile()) {
    exports.push({ name: ".", path: "index.ts" });
  }

  return exports;
}

function checkExportsMatch(): Violation[] {
  const violations: Violation[] = [];
  const pkgExports = getPackageExports();
  const srcExports = getSourceExports();

  const pkgExportNames = Object.keys(pkgExports).map(normalizeExportName);
  const srcExportNames = srcExports.map((e) => e.name);

  // Verificar exports en package.json que no existen en src
  for (const name of pkgExportNames) {
    if (name === ".") continue; // entry point principal
    if (!srcExportNames.includes(name)) {
      violations.push({
        type: "missing-file",
        message: `Export "${name}" definido en package.json pero no existe en src/`,
        exportName: name,
      });
    }
  }

  // Verificar archivos en src que no están en package.json exports
  for (const src of srcExports) {
    if (src.name === ".") continue;
    if (!pkgExportNames.includes(src.name)) {
      violations.push({
        type: "missing-export",
        message: `Archivo "${src.path}" existe en src/ pero no está exportado en package.json`,
        file: src.path,
        exportName: src.name,
      });
    }
  }

  // Verificar que los paths en package.json apunten a dist/
  for (const [name, path] of Object.entries(pkgExports)) {
    if (typeof path === "string") {
      if (name === ".") {
        if (!path.includes("./dist/index")) {
          violations.push({
            type: "version-mismatch",
            message: `Entry point "." debe apuntar a dist/index.d.ts e index.js`,
            exportName: name,
          });
        }
      } else if (path.startsWith("./dist/")) {
        // OK - path apunta a dist
      } else if (path.startsWith("./")) {
        violations.push({
          type: "version-mismatch",
          message: `Export "${name}" apunta a "${path}" pero debería apuntar a "./dist/..."`,
          exportName: name,
        });
      }
    }
  }

  return violations;
}

function checkDistExists(): Violation[] {
  const violations: Violation[] = [];
  const pkgExports = getPackageExports();

  for (const [name, exportValue] of Object.entries(pkgExports)) {
    const paths =
      typeof exportValue === "string"
        ? [exportValue]
        : Object.values(exportValue);

    for (const path of paths) {
      if (!path.startsWith("./dist/")) {
        violations.push({
          type: "version-mismatch",
          message: `Export "${name}" apunta a "${path}" pero debería apuntar a "./dist/..."`,
          exportName: name,
        });
        continue;
      }

      try {
        statSync(resolve(path));
      } catch {
        violations.push({
          type: "missing-file",
          message: `Archivo faltante: ${path} (export "${name}")`,
          exportName: name,
        });
      }
    }
  }

  return violations;
}

function main(): void {
  try {
    console.warn("🔍 Iniciando check:contract...\n");

    const violations: Violation[] = [];

    // Check 1: package.json exports vs src/
    const exportViolations = checkExportsMatch();
    violations.push(...exportViolations);

    // Check 2: dist/ files exist
    const distViolations = checkDistExists();
    violations.push(...distViolations);

    // Report
    if (violations.length === 0) {
      console.warn(
        "✅ check:contract PASÓ - Todos los exports son consistentes",
      );
      process.exit(0);
    }

    console.warn(
      `❌ check:contract FALLÓ - ${violations.length} violación(es):\n`,
    );

    for (const v of violations) {
      const prefix =
        v.type === "missing-file"
          ? "📁"
          : v.type === "missing-export"
            ? "📦"
            : "⚙️";
      console.warn(`${prefix} [${v.type}] ${v.message}`);
      if (v.file) console.warn(`   Archivo: ${v.file}`);
      if (v.exportName) console.warn(`   Export: ${v.exportName}`);
      console.warn("");
    }

    process.exit(1);
  } catch (err) {
    console.error("💥 Error en check:contract:", err);
    process.exit(1);
  }
}

main();

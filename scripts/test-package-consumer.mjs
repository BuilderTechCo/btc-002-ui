import { createRequire } from "node:module";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import { build } from "vite";

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const packageJson = JSON.parse(
  readFileSync(join(packageRoot, "package.json"), "utf8"),
);
const packageDist = join(packageRoot, "dist");

if (!existsSync(join(packageDist, "index.js"))) {
  throw new Error("Run `pnpm build` before testing package consumption.");
}

const javascriptExports = Object.entries(packageJson.exports)
  .filter(
    ([name, value]) =>
      name !== "./lib/fonts" &&
      typeof value === "object" &&
      typeof value.import === "string",
  )
  .map(([name]) =>
    name === "." ? "@buildertechco/ui" : `@buildertechco/ui/${name.slice(2)}`,
  );

const consumerRoot = mkdtempSync(join(tmpdir(), "buildertech-ui-consumer-"));

function readCssFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return readCssFiles(path);
    return entry.isFile() && entry.name.endsWith(".css")
      ? [readFileSync(path, "utf8")]
      : [];
  });
}

try {
  const consumerNodeModules = join(consumerRoot, "node_modules");
  const scopedPackageDirectory = join(consumerNodeModules, "@buildertechco");
  const tailwindcssRequire = createRequire(
    import.meta.resolve("@tailwindcss/vite"),
  );
  const tailwindcssPackageDirectory = dirname(
    tailwindcssRequire.resolve("tailwindcss/package.json"),
  );
  const packageLinkType = process.platform === "win32" ? "junction" : "dir";

  mkdirSync(scopedPackageDirectory, { recursive: true });
  symlinkSync(packageRoot, join(scopedPackageDirectory, "ui"), packageLinkType);
  symlinkSync(
    tailwindcssPackageDirectory,
    join(consumerNodeModules, "tailwindcss"),
    packageLinkType,
  );

  const importStatements = javascriptExports
    .map(
      (specifier, index) =>
        `import * as export${index} from ${JSON.stringify(specifier)};`,
    )
    .join("\n");
  const referencedExports = javascriptExports
    .map((_, index) => `export${index}`)
    .join(", ");

  writeFileSync(
    join(consumerRoot, "entry.js"),
    `${importStatements}\nimport './styles.css';\nconsole.log(${referencedExports});\n`,
  );
  writeFileSync(
    join(consumerRoot, "styles.css"),
    '@import "tailwindcss";\n' +
      '@import "@buildertechco/ui/styles/globals.css";\n' +
      '@import "@buildertechco/ui/styles/tokens.css";\n' +
      '@source "./node_modules/@buildertechco/ui/dist";\n',
  );

  const outputDirectory = join(consumerRoot, "dist");
  await build({
    configFile: false,
    logLevel: "error",
    plugins: [tailwindcss()],
    resolve: { preserveSymlinks: true },
    root: consumerRoot,
    build: {
      outDir: outputDirectory,
      emptyOutDir: true,
      rollupOptions: {
        input: join(consumerRoot, "entry.js"),
        external: ["react", "react-dom", "react/jsx-runtime"],
        onwarn(warning, defaultHandler) {
          if (warning.code !== "MODULE_LEVEL_DIRECTIVE")
            defaultHandler(warning);
        },
      },
    },
  });

  if (
    !readCssFiles(outputDirectory).some((css) => css.includes("--btc-bg-app"))
  ) {
    throw new Error("The consumer build did not emit the package CSS.");
  }

  process.stdout.write(
    `Package consumer check passed: ${javascriptExports.length} JavaScript exports and both CSS exports resolved with Vite/Tailwind.\n`,
  );
} finally {
  rmSync(consumerRoot, { recursive: true, force: true });
}

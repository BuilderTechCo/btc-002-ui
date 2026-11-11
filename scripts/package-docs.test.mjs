import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));

function markdownFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return markdownFiles(path);
    return entry.isFile() && path.endsWith(".md") ? [path] : [];
  });
}

const docs = [
  join(root, "README.md"),
  join(root, "CHANGELOG.md"),
  join(root, "CLAUDE.md"),
  ...markdownFiles(join(root, "docs")),
  ...markdownFiles(join(root, ".github")),
].map((path) => [path, readFileSync(path, "utf8")]);
const docsText = docs.map(([, content]) => content).join("\n");

test("package identity and published registry match the documented scope", () => {
  assert.equal(pkg.name, "@buildertechco/ui");
  assert.equal(pkg.publishConfig.registry, "https://npm.pkg.github.com");
  assert.ok(
    docsText.includes("@buildertechco:registry=https://npm.pkg.github.com"),
  );
  assert.doesNotMatch(docsText, /@buildertech\/ui|@buildertech:registry/);
});

test("package scripts are listed in alphabetical order", () => {
  const scriptNames = Object.keys(pkg.scripts);
  assert.deepEqual(scriptNames, [...scriptNames].sort());
});

test("format commands default to checking or formatting the repository", () => {
  assert.equal(pkg.scripts.format, "prettier --write .");
  assert.equal(pkg.scripts["format:check"], "prettier --check .");
});

test("consumer documentation does not instruct linking a cross-repository workspace", () => {
  assert.doesNotMatch(
    docsText,
    /pnpm\s+(?:--filter\s+\S+\s+)?add\s+@buildertechco\/ui\s+--workspace/,
  );
  assert.doesNotMatch(docsText, /@buildertechco\/ui@workspace:/);
});

test("consumer installation guide documents the published package and read access", () => {
  const guide = readFileSync(join(root, "docs/componentes/guia.md"), "utf8");

  assert.match(guide, /pnpm add @buildertechco\/ui@0\.1\.0/);
  assert.match(guide, /read:packages/);
  assert.match(guide, /npm\.pkg\.github\.com/);
});

test("release documentation reflects whether publishing automation exists", () => {
  const workflowsDirectory = join(root, ".github/workflows");

  if (!existsSync(workflowsDirectory)) {
    assert.match(docsText, /publicación manual|release manual/i);
    assert.doesNotMatch(
      docsText,
      /publica automáticamente|CI publica automáticamente/i,
    );
  }
});

test("pull request checklist only references scripts defined by this package", () => {
  const template = readFileSync(
    join(root, ".github/pull_request_template.md"),
    "utf8",
  );
  const commands = [
    ...template.matchAll(/`pnpm\s+(?:run\s+)?([a-z][a-z0-9:-]*)/g),
  ].map(([, command]) => command);

  assert.ok(commands.length > 0, "PR template should list validation commands");
  assert.deepEqual(commands, [...commands].sort());
  for (const command of commands) {
    assert.ok(
      Object.hasOwn(pkg.scripts, command),
      `PR template command "pnpm ${command}" is not defined in package.json`,
    );
  }
});

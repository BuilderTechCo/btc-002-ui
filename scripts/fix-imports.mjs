import ts from "typescript";
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, extname, join, resolve } from "node:path";

const explicitExtensions = new Set([".js", ".mjs", ".cjs", ".json", ".css"]);

function resolveRelativeSpecifier(specifier, importingFile) {
  if (!specifier.startsWith("./") && !specifier.startsWith("../")) return null;
  if (explicitExtensions.has(extname(specifier))) return null;

  const resolvedFile = resolve(dirname(importingFile), specifier);
  const withExtension = `${resolvedFile}.js`;
  if (statSync(withExtension, { throwIfNoEntry: false })?.isFile()) {
    return `${specifier}.js`;
  }

  const indexFile = join(resolvedFile, "index.js");
  if (statSync(indexFile, { throwIfNoEntry: false })?.isFile()) {
    return `${specifier}/index.js`;
  }

  throw new Error(
    `Unable to resolve relative import "${specifier}" in ${importingFile}`,
  );
}

function collectSpecifierLiterals(sourceFile, literals) {
  function visit(node) {
    if (
      (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) &&
      node.moduleSpecifier &&
      ts.isStringLiteral(node.moduleSpecifier)
    ) {
      literals.push(node.moduleSpecifier);
    } else if (
      ts.isCallExpression(node) &&
      node.expression.kind === ts.SyntaxKind.ImportKeyword &&
      node.arguments.length === 1 &&
      ts.isStringLiteral(node.arguments[0])
    ) {
      literals.push(node.arguments[0]);
    } else if (
      ts.isImportTypeNode(node) &&
      ts.isLiteralTypeNode(node.argument) &&
      ts.isStringLiteral(node.argument.literal)
    ) {
      literals.push(node.argument.literal);
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
}

function fixImportsInFile(filePath) {
  const sourceText = readFileSync(filePath, "utf8");
  const sourceFile = ts.createSourceFile(
    filePath,
    sourceText,
    ts.ScriptTarget.Latest,
    true,
    filePath.endsWith(".d.ts") ? ts.ScriptKind.TS : ts.ScriptKind.JS,
  );
  const literals = [];
  collectSpecifierLiterals(sourceFile, literals);

  const replacements = literals.flatMap((literal) => {
    const updatedSpecifier = resolveRelativeSpecifier(literal.text, filePath);
    if (!updatedSpecifier) return [];

    const start = literal.getStart(sourceFile);
    const quote = sourceText[start];
    return [
      {
        start,
        end: literal.getEnd(),
        text: `${quote}${updatedSpecifier}${quote}`,
      },
    ];
  });

  if (replacements.length === 0) return;

  let updatedSource = sourceText;
  for (const replacement of replacements.sort((a, b) => b.start - a.start)) {
    updatedSource =
      updatedSource.slice(0, replacement.start) +
      replacement.text +
      updatedSource.slice(replacement.end);
  }
  writeFileSync(filePath, updatedSource);
}

export function fixImportsInDir(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const filePath = join(directory, entry.name);
    if (entry.isDirectory()) {
      fixImportsInDir(filePath);
    } else if (
      entry.isFile() &&
      (extname(entry.name) === ".js" || entry.name.endsWith(".d.ts"))
    ) {
      fixImportsInFile(filePath);
    }
  }
}

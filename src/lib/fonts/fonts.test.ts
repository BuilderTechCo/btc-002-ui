import { describe, test, expect } from "vitest";
import * as ts from "typescript";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe("fonts: next/font loaders must receive literal objects", () => {
  const sourcePath = join(__dirname, "fonts.ts");
  const sourceText = readFileSync(sourcePath, "utf-8");
  const sourceFile = ts.createSourceFile(
    "fonts.ts",
    sourceText,
    ts.ScriptTarget.Latest,
    true,
  );

  const loaderNames = ["Inter", "JetBrains_Mono", "Space_Grotesk"] as const;
  type LoaderName = (typeof loaderNames)[number];
  const foundLoaders = new Set<LoaderName>();

  function checkObjectLiteral(node: ts.Node, context: string): void {
    if (!ts.isObjectLiteralExpression(node)) {
      throw new Error(
        `${context}: expected ObjectLiteralExpression, got ${ts.SyntaxKind[node.kind]}`,
      );
    }

    // Check no SpreadAssignment
    for (const prop of node.properties) {
      if (ts.isSpreadAssignment(prop)) {
        throw new Error(
          `${context}: contains SpreadAssignment (spread operator)`,
        );
      }
      if (ts.isPropertyAssignment(prop)) {
        checkLiteralValue(
          prop.initializer,
          `${context}.${prop.name.getText()}`,
        );
      }
    }
  }

  function checkLiteralValue(node: ts.Node, context: string): void {
    // Unwrap type assertions (AsExpression) - they're compile-time only
    if (ts.isAsExpression(node)) {
      return checkLiteralValue(node.expression, context);
    }
    if (
      ts.isStringLiteral(node) ||
      ts.isNumericLiteral(node) ||
      node.kind === ts.SyntaxKind.TrueKeyword ||
      node.kind === ts.SyntaxKind.FalseKeyword
    ) {
      return; // OK: primitive literal
    }
    if (ts.isArrayLiteralExpression(node)) {
      for (const element of node.elements) {
        if (element && !ts.isOmittedExpression(element)) {
          checkLiteralValue(element, `${context}[...]`);
        }
      }
      return;
    }
    if (ts.isObjectLiteralExpression(node)) {
      for (const prop of node.properties) {
        if (ts.isSpreadAssignment(prop)) {
          throw new Error(
            `${context}: contains SpreadAssignment in nested object`,
          );
        }
        if (ts.isPropertyAssignment(prop)) {
          checkLiteralValue(
            prop.initializer,
            `${context}.${prop.name.getText()}`,
          );
        }
      }
      return;
    }
    throw new Error(
      `${context}: expected literal value, got ${ts.SyntaxKind[node.kind]} (${node.getText()})`,
    );
  }

  function visit(node: ts.Node): void {
    if (ts.isCallExpression(node)) {
      const expr = node.expression;
      if (
        ts.isIdentifier(expr) &&
        loaderNames.includes(expr.text as LoaderName)
      ) {
        foundLoaders.add(expr.text as LoaderName);
        // Check exactly one argument
        expect(node.arguments).toHaveLength(1);
        const arg = node.arguments[0];
        if (arg) {
          checkObjectLiteral(arg, `Call to ${expr.text}`);
        }
      }
    }
    ts.forEachChild(node, visit);
  }

  test("has exactly three loader calls (Inter, JetBrains_Mono, Space_Grotesk)", () => {
    visit(sourceFile);
    expect(foundLoaders.size).toBe(3);
    for (const name of loaderNames) {
      expect(foundLoaders.has(name)).toBe(true);
    }
  });

  test("each loader call receives a single object literal argument with no spread and only literal values", () => {
    // This runs the same checks as above but as a separate test for clarity
    const errors: string[] = [];
    function visitWithErrors(node: ts.Node): void {
      if (ts.isCallExpression(node)) {
        const expr = node.expression;
        if (
          ts.isIdentifier(expr) &&
          loaderNames.includes(expr.text as LoaderName)
        ) {
          try {
            expect(node.arguments).toHaveLength(1);
            const arg = node.arguments[0];
            if (arg) {
              checkObjectLiteral(arg, `Call to ${expr.text}`);
            }
          } catch (e) {
            errors.push(e instanceof Error ? e.message : String(e));
          }
        }
      }
      ts.forEachChild(node, visitWithErrors);
    }
    visitWithErrors(sourceFile);
    if (errors.length > 0) {
      throw new Error(errors.join("\n"));
    }
  });
});

#!/usr/bin/env node
// check-suppressions.mjs — Gate para presupuesto de supresiones
// Cuenta supresiones por tipo y grupo (test vs producción) y compara con budget.json

import { readFileSync, readdirSync, statSync } from "fs";
import { join, extname } from "path";

const ROOT = process.cwd();
const SRC_DIR = join(ROOT, "src");
const BUDGET_FILE = join(ROOT, "scripts/suppressions-budget.json");

const SUPPRESSION_TYPES = [
  "eslint-disable",
  "@ts-ignore",
  "@ts-expect-error",
  "as any",
  "as unknown as",
  ": any",
];

function isTestFile(filePath) {
  return filePath.includes(".test.") || filePath.includes(".spec.");
}

function walkDir(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      walkDir(full, files);
    } else if ([".ts", ".tsx"].includes(extname(full))) {
      files.push(full);
    }
  }
  return files;
}

function countSuppressions(content) {
  const counts = {};
  for (const type of SUPPRESSION_TYPES) {
    let regex;
    if (type === "eslint-disable") {
      // Matches // eslint-disable, // eslint-disable-next-line, /* eslint-disable */
      regex =
        /\/\/\s*eslint-disable(?:-(?:next-line|line))?\b|\/\*\s*eslint-disable\b/gi;
    } else if (type === "@ts-ignore") {
      regex = /\/\/\s*@ts-ignore\b/gi;
    } else if (type === "@ts-expect-error") {
      regex = /\/\/\s*@ts-expect-error\b/gi;
    } else if (type === "as any") {
      regex = /\bas\s+any\b/g;
    } else if (type === "as unknown as") {
      regex = /\bas\s+unknown\s+as\b/g;
    } else if (type === ": any") {
      // Matches variable: any (type annotation), but not in comments
      regex = /:\s*any\b/g;
    }
    const matches = content.match(regex);
    counts[type] = matches ? matches.length : 0;
  }
  return counts;
}

function main() {
  const files = walkDir(SRC_DIR);

  const totals = {
    test: {},
    prod: {},
  };

  for (const type of SUPPRESSION_TYPES) {
    totals.test[type] = 0;
    totals.prod[type] = 0;
  }

  const fileDetails = { test: {}, prod: {} };

  for (const file of files) {
    const content = readFileSync(file, "utf-8");
    const counts = countSuppressions(content);
    const isTest = isTestFile(file);
    const group = isTest ? "test" : "prod";

    for (const type of SUPPRESSION_TYPES) {
      totals[group][type] += counts[type];
    }

    if (Object.values(counts).some((v) => v > 0)) {
      const relPath = file.replace(ROOT + "/", "");
      fileDetails[group][relPath] = counts;
    }
  }

  // Read budget
  let budget = { test: {}, prod: {} };
  try {
    budget = JSON.parse(readFileSync(BUDGET_FILE, "utf-8"));
  } catch {
    console.error(`Budget file not found: ${BUDGET_FILE}`);
    process.exit(1);
  }

  // Compare and report
  let hasViolation = false;
  let hasUnderBudget = false;

  for (const group of ["test", "prod"]) {
    for (const type of SUPPRESSION_TYPES) {
      const current = totals[group][type];
      const allowed = budget[group]?.[type] ?? 0;

      if (current > allowed) {
        hasViolation = true;
        console.error(
          `❌ VIOLATION: ${type} in ${group} = ${current} > budget ${allowed}`,
        );
        // List files with this suppression
        for (const [file, counts] of Object.entries(fileDetails[group])) {
          if (counts[type] > 0) {
            console.error(`   ${file}: ${counts[type]}`);
          }
        }
      } else if (current < allowed) {
        hasUnderBudget = true;
        console.warn(
          `⚠️  UNDER BUDGET: ${type} in ${group} = ${current} < budget ${allowed} (consider reducing budget)`,
        );
      }
    }
  }

  // Summary
  console.error("\n=== Suppression Summary ===");
  for (const group of ["test", "prod"]) {
    console.error(`\n${group.toUpperCase()}:`);
    for (const type of SUPPRESSION_TYPES) {
      const current = totals[group][type];
      const allowed = budget[group]?.[type] ?? 0;
      const status = current > allowed ? "❌" : current < allowed ? "⚠️" : "✅";
      console.error(`  ${type}: ${current}/${allowed} ${status}`);
    }
  }

  if (hasViolation) {
    console.error("\n❌ Suppression budget exceeded!");
    process.exit(1);
  }

  if (hasUnderBudget) {
    console.warn(
      "\n⚠️  Some budgets can be reduced. Update scripts/suppressions-budget.json",
    );
  }

  console.error("\n✅ All suppression budgets respected.");
  process.exit(0);
  process.exit(0);
}

main();

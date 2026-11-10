// @buildertech/ui - check:design Validator
// Validador DS: 12 reglas visuales + grep fetch|supabase|prisma|axios como guardarraíl anti-lógica-de-negocio

import { glob } from "glob";
import { readFileSync } from "fs";
import { resolve } from "path";

interface ScanConfig {
  scanDirs: string[];
  ignorePatterns?: string[];
}

interface Violation {
  file: string;
  line: number;
  rule: string;
  message: string;
  severity: "error" | "warning";
  snippet: string;
}

interface Rule {
  id: string;
  name: string;
  pattern: RegExp;
  allowedPatterns?: RegExp[];
  message: string;
  severity: "error" | "warning";
  fileExtensions: string[];
}

// ============================================
// CONFIGURACIÓN
// ============================================

const DEFAULT_CONFIG: ScanConfig = {
  scanDirs: ["src"],
  ignorePatterns: [
    "**/node_modules/**",
    "**/dist/**",
    "**/*.d.ts",
    "**/*.test.ts",
    "**/*.test.tsx",
    "**/*.spec.ts",
    "**/*.spec.tsx",
    // Configuración interna de utilidades: define los nombres `*-btc-*`,
    // no usa clases en JSX/CSS.
    "**/lib/classnames/**",
  ],
};

// ============================================
// 12 REGLAS VISUALES
// ============================================

const VISUAL_RULES: Rule[] = [
  // R1: Solo tokens btc-* para colores
  {
    id: "only-btc-color-tokens",
    name: "Solo tokens de color btc-*",
    pattern:
      /\b(bg|text|border|ring|fill|stroke|divide|outline|accent|decoration)-([a-z]+-)?(?!btc-)(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d{2,3}\b/g,
    allowedPatterns: [/bg-btc-/, /text-btc-/, /border-btc-/, /ring-btc-/],
    message:
      "Usar tokens btc-* para colores (ej: bg-btc-brand, text-btc-text-primary)",
    severity: "error",
    fileExtensions: [".tsx", ".ts", ".css"],
  },

  // R2: Solo utilidades btc-* para spacing, radius y shadow.
  // Sizing/layout (inset, translate, scale, rotate...) usan Tailwind estándar.
  {
    id: "only-btc-utilities",
    name: "Solo utilidades btc-*",
    pattern: new RegExp(
      [
        String.raw`(?<![\w-])-?(?:p[trblxy]?|m[trblxy]?|gap(?:-[xy])?|space-[xy])-(?!btc-)(?:\d+(?:\.\d+)?|px)\b`,
        String.raw`(?<![\w-])rounded(?:-(?!btc-)(?:none|xs|sm|md|lg|xl|2xl|3xl|full))?\b(?!-btc)`,
        String.raw`(?<![\w-])shadow(?:-(?!btc-)(?:none|xs|sm|md|lg|xl|2xl|3xl|inner))?\b(?!-btc)`,
      ].join("|"),
      "g",
    ),
    allowedPatterns: [
      /p-btc-/,
      /m-btc-/,
      /gap-btc-/,
      /space-btc-/,
      /rounded-btc-/,
      /shadow-btc-/,
    ],
    message:
      "Usar utilidades btc-* (ej: p-btc-4, rounded-btc-md, shadow-btc-1)",
    severity: "error",
    fileExtensions: [".tsx", ".ts", ".css"],
  },

  // R3: Espaciado base 4px (solo valores definidos en la escala)
  {
    id: "spacing-scale",
    name: "Escala de espaciado base 4px",
    pattern:
      /(?<![\w-])-?(?:p[trblxy]?|m[trblxy]?|gap(?:-[xy])?|space-[xy])-btc-(?!(?:0|1|2|3|4|6|8|12|16)(?![\d.]))\d+(?:\.\d+)?\b/g,
    message:
      "Espaciado debe usar escala base 4px: 0,1,2,3,4,6,8,12,16 (ej: p-btc-4, gap-btc-6)",
    severity: "error",
    fileExtensions: [".tsx", ".ts", ".css"],
  },

  // R3b: Sizing con tokens btc-* debe existir en la escala
  {
    id: "sizing-scale",
    name: "Sizing con escala definida",
    pattern:
      /(?<![\w-])(?:w|h|min-w|max-w|min-h|max-h|size)-btc-(?!(?:0|1|2|3|4|6|8|12|16)(?![\d.]))\d+(?:\.\d+)?\b/g,
    message:
      "Sizing debe usar Tailwind estándar (w-12, h-16) o un token btc existente",
    severity: "error",
    fileExtensions: [".tsx", ".ts", ".css"],
  },

  // R4: Radios definidos
  {
    id: "radius-defined",
    name: "Solo radios definidos",
    pattern: /\brounded-(?!btc-)(none|sm|md|lg|xl|2xl|full)\b/g,
    allowedPatterns: [/rounded-btc-/],
    message: "Usar radios btc-*: rounded-btc-xs|sm|md|lg|xl|2xl|full",
    severity: "error",
    fileExtensions: [".tsx", ".ts", ".css"],
  },

  // R5: Fuentes del sistema
  {
    id: "font-system",
    name: "Solo fuentes del sistema",
    pattern: /(?<![\w-])font-(sans|mono|serif)(?![\w-])/g,
    message: "Usar font-btc-sans o font-btc-mono (vía @theme inline)",
    severity: "error",
    fileExtensions: [".tsx", ".ts", ".css"],
  },

  // R6: Duraciones estándar
  {
    id: "duration-standard",
    name: "Duraciones estándar",
    pattern: /\b(duration|delay)-(?!btc-)(75|100|150|200|300|500|700|1000)\b/g,
    allowedPatterns: [/duration-btc-/, /delay-btc-/],
    message: "Usar duraciones btc-*: duration-btc-fast|base|slow",
    severity: "error",
    fileExtensions: [".tsx", ".ts", ".css"],
  },

  // R7: Easing estándar
  {
    id: "ease-standard",
    name: "Easing estándar",
    pattern: /(?<![\w-])ease(?:-in-out|-in|-out)?(?![\w-])/g,
    allowedPatterns: [/ease-btc-standard/],
    message:
      "Usar easing estándar: ease-btc-standard (cubic-bezier(0.2, 0, 0, 1))",
    severity: "error",
    fileExtensions: [".tsx", ".ts", ".css"],
  },

  // R8: Sombras definidas
  {
    id: "shadow-defined",
    name: "Solo sombras definidas",
    pattern: /\bshadow-(?!btc-)(none|sm|md|lg|xl|2xl|inner)\b/g,
    allowedPatterns: [/shadow-btc-/],
    message: "Usar sombras btc-*: shadow-btc-1|2|3|4|5",
    severity: "error",
    fileExtensions: [".tsx", ".ts", ".css"],
  },

  // R9: Z-index controlado
  {
    id: "z-index-controlled",
    name: "Z-index controlado",
    pattern: /(?<![\w-])-?z-(?:\[[^\]]+\]|\d+|auto)(?![\w-])/g,
    allowedPatterns: [/z-btc-/],
    message:
      "Usar z-index controlados: z-btc-base|dropdown|sticky|modal|popover|tooltip|toast",
    severity: "error",
    fileExtensions: [".tsx", ".ts", ".css"],
  },

  // R10: Transiciones permitidas
  {
    id: "transition-allowed",
    name: "Transiciones permitidas",
    pattern:
      /(?<![\w-])(?:transition(?![\w-])|transition-(?:all|none)(?![\w-]))/g,
    allowedPatterns: [/transition-btc-/],
    message:
      "Transiciones permitidas: transition-btc-colors|opacity|transform|shadow",
    severity: "error",
    fileExtensions: [".tsx", ".ts", ".css"],
  },

  // R11: No !important (salvo globals.css @layer utilities)
  {
    id: "no-important",
    name: "No !important",
    pattern: /!important/g,
    message: "No usar !important (salvo en globals.css @layer utilities)",
    severity: "error",
    fileExtensions: [".tsx", ".ts", ".css"],
  },
];

// ============================================
// GUARDARRAÍL ANTI-LÓGICA DE NEGOCIO
// ============================================

const BUSINESS_LOGIC_PATTERN = /\b(fetch|supabase|prisma|axios)\b/g;

const BUSINESS_LOGIC_RULE: Rule = {
  id: "no-business-logic",
  name: "No lógica de negocio en @buildertech/ui",
  pattern: BUSINESS_LOGIC_PATTERN,
  message:
    "Lógica de negocio detectada en componente UI (fetch, supabase, prisma, axios prohibidos en src)",
  severity: "error",
  fileExtensions: [".tsx", ".ts"],
};

// ============================================
// ESCANER
// ============================================

async function scanFiles(config: ScanConfig): Promise<string[]> {
  const files: string[] = [];

  for (const dir of config.scanDirs) {
    const pattern = resolve(dir, "**/*.{ts,tsx,css}");
    const found = await glob(pattern, {
      ignore: config.ignorePatterns,
      absolute: true,
    });
    files.push(...found);
  }

  return files;
}

function stripComments(content: string): string {
  const chars = content.split("");
  let inBlock = false;
  let inLine = false;
  let quote: string | null = null;
  let escaped = false;

  for (let i = 0; i < content.length; i++) {
    const char = content[i];
    const next = content[i + 1];

    if (inBlock) {
      if (char === "*" && next === "/") {
        chars[i] = " ";
        chars[i + 1] = " ";
        i++;
        inBlock = false;
      } else if (char !== "\n") {
        chars[i] = " ";
      }
      continue;
    }

    if (inLine) {
      if (char === "\n") {
        inLine = false;
      } else {
        chars[i] = " ";
      }
      continue;
    }

    if (quote) {
      if (escaped) {
        escaped = false;
      } else if (char === "\\") {
        escaped = true;
      } else if (char === quote) {
        quote = null;
      }
      continue;
    }

    if (char === '"' || char === "'" || char === "`") {
      quote = char;
      continue;
    }

    if (char === "/" && next === "*") {
      chars[i] = " ";
      chars[i + 1] = " ";
      i++;
      inBlock = true;
      continue;
    }

    if (char === "/" && next === "/") {
      chars[i] = " ";
      chars[i + 1] = " ";
      i++;
      inLine = true;
    }
  }

  return chars.join("");
}

function checkFile(
  filePath: string,
  content: string,
  rules: Rule[],
): Violation[] {
  const violations: Violation[] = [];
  const lines = content.split("\n");
  const scanContent = stripComments(content);
  const isGlobalStyles = filePath
    .replace(/\\/g, "/")
    .endsWith("src/styles/globals.css");

  for (const rule of rules) {
    if (!rule.fileExtensions.some((ext) => filePath.endsWith(ext))) {
      continue;
    }

    // R11: `!important` está permitido únicamente en globals.css @layer utilities
    if (rule.id === "no-important" && isGlobalStyles) {
      continue;
    }

    // Los regex son globales y se comparten entre archivos: reiniciar lastIndex
    rule.pattern.lastIndex = 0;
    let match;
    while ((match = rule.pattern.exec(scanContent)) !== null) {
      // Verificar si está en patrón permitido
      const matchStart = match.index;
      const lineNumber = scanContent
        .substring(0, matchStart)
        .split("\n").length;
      const lineContent = lines[lineNumber - 1]?.trim() ?? "";

      // Saltar si coincide con patrón permitido
      let isAllowed = false;
      if (rule.allowedPatterns) {
        for (const allowed of rule.allowedPatterns) {
          allowed.lastIndex = 0;
          if (allowed.test(match[0])) {
            isAllowed = true;
            break;
          }
        }
      }

      if (!isAllowed) {
        violations.push({
          file: filePath,
          line: lineNumber,
          rule: rule.id,
          message: rule.message,
          severity: rule.severity,
          snippet: lineContent,
        });
      }
    }
  }

  return violations;
}

function checkBusinessLogic(filePath: string, content: string): Violation[] {
  if (!filePath.includes("src")) {
    return []; // Solo validar en src
  }

  const violations: Violation[] = [];
  const lines = content.split("\n");
  const scanContent = stripComments(content);

  BUSINESS_LOGIC_PATTERN.lastIndex = 0;
  let match;
  while ((match = BUSINESS_LOGIC_PATTERN.exec(scanContent)) !== null) {
    const matchStart = match.index;
    const lineNumber = scanContent.substring(0, matchStart).split("\n").length;
    const lineContent = lines[lineNumber - 1]?.trim() ?? "";

    violations.push({
      file: filePath,
      line: lineNumber,
      rule: "no-business-logic",
      message: BUSINESS_LOGIC_RULE.message,
      severity: "error",
      snippet: lineContent,
    });
  }

  return violations;
}

// ============================================
// MAIN
// ============================================

async function main() {
  console.warn("🔍 Iniciando check:design...\n");

  // Cargar config desde package.json si existe
  let config = DEFAULT_CONFIG;
  try {
    const pkgPath = resolve("package.json");
    const pkgContent = readFileSync(pkgPath, "utf-8");
    const pkg = JSON.parse(pkgContent);
    if (pkg.checkDesign?.scanDirs) {
      config = { ...config, scanDirs: pkg.checkDesign.scanDirs };
    }
  } catch {
    // Usar config por defecto
  }

  console.warn(`📁 Directorios a escanear: ${config.scanDirs.join(", ")}`);

  const files = await scanFiles(config);
  console.warn(`📄 Archivos encontrados: ${files.length}\n`);

  let totalViolations = 0;
  let errorCount = 0;
  let warningCount = 0;

  for (const file of files) {
    const content = readFileSync(file, "utf-8");
    const relativePath = file.replace(process.cwd() + "/", "");

    // Reglas visuales
    const visualViolations = checkFile(file, content, VISUAL_RULES);

    // Guardarraíl lógica de negocio
    const businessViolations = checkBusinessLogic(file, content);

    const allViolations = [...visualViolations, ...businessViolations];

    for (const v of allViolations) {
      totalViolations++;
      if (v.severity === "error") errorCount++;
      else warningCount++;

      const prefix = v.severity === "error" ? "❌" : "⚠️";
      console.warn(`${prefix} ${relativePath}:${v.line} [${v.rule}]`);
      console.warn(`   ${v.message}`);
      console.warn(`   ${v.snippet}\n`);
    }
  }

  // Resumen
  console.warn("━".repeat(60));
  console.warn(
    `📊 Resumen: ${totalViolations} violación(es) (${errorCount} errores, ${warningCount} warnings)`,
  );

  if (errorCount > 0) {
    console.error(
      "\n❌ check:design FALLÓ - Corregir errores antes de continuar",
    );
    process.exit(1);
  } else if (warningCount > 0) {
    console.warn("\n⚠️ check:design PASÓ con warnings");
    process.exit(0);
  } else {
    console.warn("\n✅ check:design PASÓ - Sin violaciones");
    process.exit(0);
  }
}

main().catch((err) => {
  console.error("💥 Error en check:design:", err);
  process.exit(1);
});

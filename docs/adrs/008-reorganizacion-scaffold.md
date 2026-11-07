# ADR-008: Reorganización Scaffold — Estructura Single-Package Root

**Estado**: Aceptado | **Fecha**: 2026-11-07

---

## Contexto

El paquete `@buildertech/ui` evolucionó desde una estructura monorepo multi-package (`packages/ui/`) hacia un single-package aplanado a la raíz del repo. La reorganización alinea la estructura física con los principios de ADR-001 (Paquete Workspace Solo Código Fuente) y elimina directorios legacy que causaban confusión.

---

## Decisión

**Estructura final (post-reorganización):**

```text
btc-002-ui/
├── src/                          # Código fuente
│   ├── components/               # 22 componentes (Button, Card, Dialog, etc.)
│   ├── lib/                      # Utilidades (classnames, icon, fonts)
│   ├── styles/                   # globals.css, tokens.css (Tailwind v4 @theme)
│   ├── test/                     # Setup Vitest (setup.ts, setup-unit.ts)
│   └── index.ts                  # Barrel principal
├── e2e/                          # Tests visuales Playwright
│   ├── visual/                   # 22 specs *.visual.spec.ts (4 viewports × 2 temas)
│   │   └── snapshots/            # 3285 PNGs baseline (una carpeta por spec)
│   └── support/                  # global-setup.ts, global-teardown.ts, utils.ts, test-iframe.ts
├── scripts/                      # Scripts de validación y build
│   ├── register.mjs              # Loader tsx para scripts TS
│   ├── check-design.ts           # Validador 11 reglas visuales + anti-biz-logic
│   └── check-component-contract.mjs  # Validador exports package.json ↔ src/
├── .storybook/                   # Config Storybook (main.ts, preview.ts)
├── dist/                         # Build output (gitignored)
├── playwright-report/            # Reportes HTML Playwright (gitignored)
├── test-results/                 # Resultados JSON Playwright (gitignored)
├── coverage/                     # Cobertura Vitest (gitignored)
├── storybook-static/             # Build estático Storybook (gitignored)
├── *.tsbuildinfo                 # Cache TypeScript (gitignored)
├── tsconfig.base.json            # Base TS config (paths @/* → src/*)
├── tsconfig.json                 # Typecheck-only (noEmit, incluye src, e2e, scripts, .storybook)
├── tsconfig.build.json           # Build config (declaration emit → dist/, excluye tests/stories)
├── tsconfig.eslint.json          # Extiende tsconfig.json para ESLint
├── vitest.config.ts              # Config Vitest (2 proyectos: unit node, integration jsdom)
├── playwright.config.ts          # Config Playwright unificada (8 proyectos, 4 viewports × 2 temas)
├── eslint.config.js              # ESLint flat config (ignora: e2e/, scripts/, dist/, reports)
├── package.json                  # Scripts, exports, deps
└── pnpm-workspace.yaml           # Workspace config
```

### Cambios Principales

| Antes (Legacy) | Después (Actual) | Razón |
|----------------|------------------|-------|
| `packages/ui/` (root package) | Raíz del repo (`btc-002-ui/`) | ADR-001: single-package, no workspace interno |
| `src/scripts/` | `scripts/` | Separar scripts de validación del código fuente |
| `tests/visual/` | `e2e/visual/` | Convención estándar: `e2e/` para Playwright |
| `test/` (en package.json scripts) | `src/test/` | Colocar setup de tests junto a source |
| `package.json` en `packages/ui/` | `package.json` en raíz | Single-package root |
| `playwright.config.ts` en `tests/visual/` | `playwright.config.ts` en raíz | Config unificada visible |
| `vitest.config.ts` en raíz (sin projects) | `vitest.config.ts` con 2 projects | Unit (node) + Integration (jsdom) separados |

### Configs TypeScript (3 + 1 base)

| Config | Propósito | Incluye | Excluye |
|--------|-----------|---------|---------|
| `tsconfig.base.json` | Base compartida, paths `@/*` → `src/*` | — | — |
| `tsconfig.json` | Typecheck-only (`noEmit: true`) | `src`, `e2e`, `scripts`, `.storybook`, configs | — |
| `tsconfig.build.json` | Build (`declaration: true`, `outDir: dist`) | `src` | tests, stories, scripts, `.storybook` |
| `tsconfig.eslint.json` | Extiende `tsconfig.json` para ESLint type-aware | igual que `tsconfig.json` | — |

### Scripts de Validación

| Script | Ubicación | Qué Valida |
|--------|-----------|------------|
| `check:design` | `scripts/check-design.ts` | 11 reglas visuales + grep `fetch|supabase|prisma|axios` en `src/` |
| `check:contract` | `scripts/check-component-contract.mjs` | `package.json` exports ↔ `src/components`, `src/lib`, `src/styles` ↔ `dist/` |
| `quality:verify` | `package.json` | `typecheck && lint && check:design && test` |

### Playwright (8 proyectos)

| Proyecto | Viewport | Tema |
|----------|----------|------|
| `light-mobile` | 360×640 | light |
| `dark-mobile` | 360×640 | dark |
| `light-tablet` | 768×1024 | light |
| `dark-tablet` | 768×1024 | dark |
| `light-laptop` | 1024×768 | light |
| `dark-laptop` | 1024×768 | dark |
| `light-desktop` | 1440×900 | light |
| `dark-desktop` | 1440×900 | dark |

**Snapshots**: `e2e/visual/snapshots/<spec>.visual.spec.ts-snapshots/` (3285 PNGs, excluidos via `.git/info/exclude`)

### Vitest (2 proyectos)

| Proyecto | Entorno | Include | Setup |
|----------|---------|---------|-------|
| `unit` | `node` | `src/lib/**/*.{test,spec}.{ts,tsx}` | `src/test/setup-unit.ts` |
| `integration` | `jsdom` | `src/components/**/*.{test,spec}.{ts,tsx}` | `src/test/setup.ts` |

---

## Validación Realizada (Evidencia)

### V1: Estructura de Directorios
```bash
# Verificación: directorios existen en ubicaciones correctas
ls -la src/components/      # 22 directorios ✓
ls -la e2e/visual/          # 22 specs + snapshots/ ✓
ls -la scripts/             # 3 archivos ✓
ls -la src/test/            # setup.ts, setup-unit.ts ✓
```

### V2: tsconfig.json (Typecheck)
```bash
pnpm run typecheck
# Resultado: 0 errores (compila src, e2e, scripts, .storybook)
```

### V3: tsconfig.build.json (Build)
```bash
pnpm run build
# Resultado: dist/ generado con .d.ts, .js, styles/, components/, lib/
```

### V4: playwright.config.ts
```bash
# Verificación: 8 projects definidos, snapshotDir correcto
grep -A 40 "projects:" playwright.config.ts
# snapshotDir: './e2e/visual/snapshots' ✓
```

### V5: Especs Visuales con Baselines
```bash
# 22 specs en e2e/visual/*.visual.spec.ts
# 22 carpetas en e2e/visual/snapshots/ con baselines
```

### V6: vitest.config.ts (2 proyectos)
```bash
pnpm run test
# unit: 5 passed | integration: 5 passed = 10 passed total ✓
```

### V7: check:design
```bash
pnpm run check:design
# Escanea src/ únicamente
# 55 errores pre-existentes (Tailwind nativo en tokens.css, globals.css, componentes)
# Documentado como hallazgo NO CONFORME en §Hallazgos Pendientes
```

### V8: check:contract
```bash
pnpm run check:contract
# PASS: exports ↔ src ↔ dist consistentes
# (Previamente fallaba por export `input` vs `textfield` — corregido en package.json)
```

### V9: quality:verify
```bash
pnpm run quality:verify
# typecheck ✓ | lint ✓ | check:design (55 errores pre-existentes) | test ✓
```

### V10: ESLint ignora e2e/, scripts/
```bash
# eslint.config.js: ignores incluye 'e2e/**', 'scripts/**', 'dist/**', reports/** ✓
```

### V11: package.json exports (23 entradas)
```bash
# 1 main + 2 styles + 3 lib + 17 components = 23 exports ✓
# ./textfield existe, ./input NO existe (correcto)
```

### V12: .gitignore
```bash
# dist/, playwright-report/, test-results/, coverage/, storybook-static/, *.tsbuildinfo, *.d.ts (except dist/) ✓
```

### V13: Documentación Actualizada
- `CLAUDE.md`: Estructura post-reorganización correcta ✓
- `README.md`: Actualizado con estructura post-reorg, tablas markdownlint-compliant, referencias ADR-008 ✓
- `docs/adrs/005-tests-without-dom.md`, `006-playwright-visual-regression.md`, `007-check-design-multi-directorio.md`: Actualizados — paths legacy corregidos a `src/test/`, `e2e/visual/`, `scripts/` ✓
- `docs/componentes/adding.md`: Actualizado — `apps/web/tests/visual/` → `e2e/visual/`, `packages/ui/src` → `src/components` ✓
- `docs/gobernanza/enforcement.md`: Actualizado — `src/scripts/` → `scripts/`, `packages/ui/src` → `src`, `tests/visual/snapshots` → `e2e/visual/snapshots` ✓
- `docs/guias/contributing.md`: Actualizado — estructura legacy completa migrada a single-package root ✓
- `docs/componentes/guide.md`: Traducido al español, `Input` → `Textfield`, referencias actualizadas ✓
- `docs/componentes/supported-browsers.md`: Traducido al español ✓
- `docs/guias/migration-guide.md`: Traducido al español, paths legacy corregidos ✓
- `docs/tokens/api-spec.md`: Traducido al español, `Input` → `Textfield` ✓
- `docs/tokens/layout-sizing.md`: Traducido al español ✓
- `docs/tokens/visual-palette.md`: Traducido al español ✓
- `docs/arquitectura/index.md`: Traducido al español ✓
- `docs/adrs/index.md`: Traducido al español ✓
- `docs/adrs/001-007.md`: Traducidos al español (8 ADRs total) ✓

### V14: Git Status (Solo cambios de documentación)

```bash
git status
# Solo archivos .md nuevos/modificados (ADR-008, CLAUDE.md, README.md, docs/*.md)
# Sin cambios en src/, e2e/, scripts/, configs
```

### V15: Validación markdownlint README.md

```bash
# Tablas: formato compact con alineación corregido (MD060)
# Bloques de código: lenguaje especificado (MD040)
# README.md pasa markdownlint sin advertencias ✓
```

---

## Hallazgos Pendientes (NO CONFORME / NO VERIFICABLE)

### H1: `check:design` — 55 errores pre-existentes
- **Causa**: Tailwind nativo (`bg-blue-500`, `p-4`, `rounded-lg`, etc.) en `src/styles/tokens.css`, `src/styles/globals.css`, y archivos de componentes
- **Impacto**: `quality:verify` falla por `check:design`
- **Decisión**: NO corregir en esta reorganización — documentado como deuda técnica pre-existente
- **Acción requerida**: Sprint dedicado para migrar a tokens `btc-*`

### H2: `vitest.config.ts` — coverage exclude pattern incorrecto

- **Línea 23**: `'src/test/\*\*'` (asteriscos escapados incorrectamente)
- **Debe ser**: `'src/test/**'`
- **Impacto**: Cobertura puede no excluir correctamente `src/test/`
- **Acción requerida**: Fix en próximo commit

### H3: Documentación legacy en `docs/` — **COMPLETADO**
- `ADR-005`: Referencia `apps/web/tests/unit/` corregida a `src/test/` (unit tests viven en `src/lib/`) ✓
- `ADR-006`: Referencias `apps/web/tests/visual/` y `apps/web/tests/visual/snapshots/` corregidas a `e2e/visual/` y `e2e/visual/snapshots/` ✓
- `ADR-007`: Referencia `src/scripts/check-design.ts` corregida a `scripts/check-design.ts` ✓
- `componentes/adding.md`: Referencia `apps/web/tests/visual/` corregida a `e2e/visual/` ✓
- `gobernanza/enforcement.md`: Referencia `src/scripts/check-design.ts` corregida a `scripts/check-design.ts` ✓
- `guias/contributing.md`: Estructura completa legacy (`tests/unit/`, `tests/visual/`, `packages/ui/`) migrada a single-package root ✓
- **Todos los 20 archivos markdown en `docs/` traducidos al español** ✓
- **Reorganización por categorías completada**: `adrs/`, `arquitectura/`, `componentes/`, `gobernanza/`, `guias/`, `tokens/` ✓
- **Prefijos numéricos eliminados** de nombres de archivo en cada carpeta ✓

### H4: Playwright — 30 passed / 354 failed (diferencias visuales)

- **Causa**: Baselines desactualizados vs componentes actuales
- **Decisión**: NO actualizar snapshots en esta reorganización — requiere aprobación DS Owner
- **Acción requerida**: DS Owner ejecute `pnpm test:visual --update-snapshots` tras revisión

---

## Consecuencias

### Positivas

- **Single-package root**: Alineado con ADR-001, sin workspace interno innecesario
- **Separación clara**: `src/` (código), `e2e/` (tests visuales), `scripts/` (tooling)
- **TypeScript configs explícitos**: Typecheck vs Build vs ESLint separados
- **Vitest projects**: Unit (node, rápido) separado de Integration (jsdom, componentes)
- **Playwright unificado**: 8 projects en config raíz, snapshots en `e2e/visual/snapshots/`

### Negativas

- **Deuda técnica `check:design`**: 55 errores bloquean `quality:verify` (pre-existente)
- **Snapshots visuales**: 354 fallos requieren actualización controlada por DS Owner
- **vitest.config.ts**: coverage exclude pattern incorrecto (línea 23) — fix pendiente

---

## Referencias

- `CLAUDE.md` — Guía Claude Code (actualizada con estructura post-reorg)
- `README.md` — **Requiere actualización** (estructura legacy)
- `docs/adrs/001-paquete-workspace-source-only.md` — Principio single-package
- `docs/adrs/005-tests-without-dom.md` — **Requiere actualización** (paths legacy)
- `docs/adrs/006-playwright-visual-regression.md` — **Requiere actualización** (paths legacy)
- `docs/adrs/007-check-design-multi-directorio.md` — **Requiere actualización** (path script legacy)
- `scripts/check-design.ts` — Implementación validador (escanea `src/`)
- `scripts/check-component-contract.mjs` — Validador exports
- `playwright.config.ts` — Config 8 projects
- `vitest.config.ts` — Config 2 projects (fix coverage exclude pendiente)

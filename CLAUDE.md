# CLAUDE.md - @buildertech/ui

Guía para Claude Code al trabajar en el monorepo `@buildertech/ui` (Design System propietario de BuilderTech).

---

## 1. Visión general del proyecto

- **Paquete**: `@buildertech/ui` — Design System versionado independientemente (tokens, componentes, utilidades, validación, docs).
- **Stack**: React 18 + TypeScript 5.6 + pnpm 9 + Vite 6 + Vitest 2 + Playwright 1.48 + Storybook 8.
- **Arquitectura**: Monorepo single-package (`packages/ui` fue aplanado a raíz del repo).
- **Estilo**: Tailwind CSS v4 (CSS-first) + tokens `btc-*` (colores, spacing, radius, shadow, font, duration, easing, z-index, transition).
- **Calidad**: 11 reglas visuales (`check:design`), guardarraíl anti-lógica-de-negocio (`fetch|supabase|prisma|axios`), contrato de exports (`check:contract`), typecheck estricto, lint, tests unitarios (Vitest), tests visuales (Playwright), Storybook.

---

## 2. Estructura de directorios (post-reorganización)

```text
btc-002-ui/
├── src/                          # Código fuente
│   ├── components/               # 22 componentes (Button, Card, Dialog, etc.)
│   ├── lib/                      # Utilidades (classnames, icon, fonts)
│   ├── styles/                   # globals.css, tokens.css (Tailwind v4 @theme)
│   ├── test/                     # Setup Vitest (setup.ts)
│   └── index.ts                  # Barrel principal
├── e2e/                          # Tests visuales Playwright
│   ├── visual/                   # 22 specs *.visual.spec.ts (mobile/tablet/laptop/desktop × light/dark)
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
├── vitest.config.ts              # Config Vitest (jsdom, setupFiles: src/test/setup.ts)
├── playwright.config.ts          # Config Playwright unificada (8 proyectos, 4 viewports × 2 temas)
├── eslint.config.js              # ESLint flat config (ignores: e2e/, scripts/, dist/, reports)
├── package.json                  # Scripts, exports, deps
└── pnpm-workspace.yaml           # Workspace config
```

---

## 3. Scripts principales (`package.json`)

| Script | Descripción |
|--------|-------------|
| `build` | `tsc -p tsconfig.build.json` + copia `src/styles`, `src/components`, `src/lib` a `dist/` |
| `typecheck` | `tsc --noEmit` (usa `tsconfig.json`) |
| `lint` | `eslint src --ext .ts,.tsx` |
| `lint:fix` | `eslint src --ext .ts,.tsx --fix` |
| `test` | `vitest run` (unitarios) |
| `test:watch` | `vitest` (watch mode) |
| `test:ui` | `vitest --ui` (UI visual) |
| `test:coverage` | `vitest run --coverage` |
| `test:visual` | `playwright test` (8 proyectos: 4 viewports × 2 temas) |
| `check:design` | Valida 11 reglas visuales + anti-lógica-de-negocio en `src/` |
| `check:contract` | Valida que `package.json` exports ↔ `src/` ↔ `dist/` son consistentes |
| `quality:verify` | `typecheck && lint && check:design && test` (gate pre-publish) |
| `prepublishOnly` | `quality:verify && build` |
| `storybook` | `storybook dev -p 6006` |
| `build-storybook` | `storybook build` |
| `storybook:static` | `storybook build --output-dir storybook-static` |

---

## 4. Reglas de desarrollo (NO negociables)

### 4.1 Tokens y estilos

- **Solo tokens `btc-*`**: Colores (`bg-btc-brand`, `text-btc-text-primary`), spacing (`p-btc-4`, `gap-btc-6`), radius (`rounded-btc-md`), shadow (`shadow-btc-2`), font (`font-btc-sans`), duration (`duration-btc-base`), easing (`ease-btc-standard`), z-index (`z-btc-modal`), transition (`transition-btc-colors`).
- **Escala spacing base 4px**: Valores permitidos `1,2,3,4,6,8,12,16` (equivale a 4,8,12,16,24,32,48,64px).
- **No Tailwind nativo**: Prohibidos `bg-blue-500`, `p-5`, `rounded-lg`, `shadow-md`, `font-sans`, `duration-200`, `ease-in-out`, `z-50`, `transition-all`, etc.
- **No `!important`**: Salvo en `globals.css` dentro de `@layer utilities`.

### 4.2 Lógica de negocio (guardarraíl)

- **Prohibido en `src/`**: `fetch`, `supabase`, `prisma`, `axios`. El DS es puramente presentacional.
- `check:design` falla si detecta estos patrones en `packages/ui/src` (ahora `src/`).

### 4.3 Componentes

- **Props tipadas estrictamente**: Usar `typeof Component` para forwardRef, no el componente como tipo.
- **Nombres de props canónicos**: `text` (no `textToCopy`), `variant` con valores definidos, `code`/`status` según componente, `tagName` para Label, etc.
- **No `ref` en props**: Usar `forwardRef` correctamente.
- **Export barrel**: Cada componente en `src/components/<name>/index.ts` re-exporta todo.

### 4.4 Testing

- **Unitarios (Vitest)**: En `src/**/*.test.tsx`, setup en `src/test/setup.ts`.
- **Visuales (Playwright)**: En `e2e/visual/*.visual.spec.ts`, snapshots en `e2e/visual/snapshots/*.visual.spec.ts-snapshots/`.
- **Naming**: `<Component>.visual.spec.ts` (no `.test.ts`).
- **8 proyectos**: `light-mobile`, `dark-mobile`, `light-tablet`, `dark-tablet`, `light-laptop`, `dark-laptop`, `light-desktop`, `dark-desktop`.
- **Thresholds**: `maxDiffPixels: 0`, `maxDiffPixelRatio: 0.001`, `threshold: 0.2`.

### 4.5 TypeScript

- **3 tsconfigs**:
  - `tsconfig.base.json`: Base compartida, `paths: { "@/*": ["src/*"] }`.
  - `tsconfig.json`: Typecheck-only (`noEmit: true`), incluye `src`, `e2e`, `scripts`, `.storybook`, configs.
  - `tsconfig.build.json`: Build (`declaration: true`, `outDir: dist`), excluye tests, stories, scripts.
  - `tsconfig.eslint.json`: Extiende `tsconfig.json` para ESLint.
- **`typecheck` usa `tsconfig.json`** (no emite, valida todo).
- **`build` usa `tsconfig.build.json`** (emite a `dist/`).

### 4.6 ESLint

- **Flat config** (`eslint.config.js`).
- **Ignora**: `e2e/`, `scripts/`, `dist/`, `playwright-report/`, `test-results/`, `coverage/`, `*.tsbuildinfo`.
- **Test files**: Config separada sin `project` (evita error "file not found in project").
- **Source files**: Usa `project: ./tsconfig.eslint.json` para type-aware rules.

---

## 5. Flujo de trabajo estándar

```bash
# Desarrollo
pnpm storybook          # Storybook en http://localhost:6006
pnpm test:watch         # Vitest watch
pnpm test:visual        # Playwright (requiere Storybook corriendo)

# Validación local (pre-push)
pnpm run quality:verify # typecheck + lint + check:design + test

# Build y publish
pnpm run build          # Genera dist/
pnpm run prepublishOnly # quality:verify + build (automático en publish)
```

---

## 6. Actualización de snapshots visuales

```bash
# Actualizar TODOS los baselines (8 proyectos)
pnpm test:visual -- --update-snapshots

# Actualizar solo un componente
pnpm test:visual -- --update-snapshots -g "Button"

# Ver reporte HTML
npx playwright show-report playwright-report
```

---

## 7. Añadir nuevo componente

1. Crear `src/components/<nombre>/` con `index.ts`, `<Nombre>.tsx`, `<Nombre>.test.tsx`, `<Nombre>.stories.tsx`.
2. Exportar en `src/components/<nombre>/index.ts`.
3. Añadir entrada en `package.json` → `exports` (apuntando a `./dist/components/<nombre>/index.*`).
4. Añadir stories en Storybook.
5. Añadir test visual en `e2e/visual/<nombre>.visual.spec.ts`.
6. Ejecutar `pnpm test:visual -- --update-snapshots` para generar baselines.
7. Verificar `pnpm run quality:verify` pasa.

---

## 8. Troubleshooting común

| Problema | Solución |
|----------|----------|
| `check:design` falla por color/spacing | Reemplazar Tailwind nativo por token `btc-*` equivalente |
| `check:design` falla por `fetch`/`axios` | Mover lógica de datos fuera del componente (props o context) |
| `typecheck` error en test file | Usar `typeof Component` para forwardRef, corregir prop names |
| Playwright no encuentra snapshots | Verificar `snapshotDir: ./e2e/visual/snapshots` en config |
| `check:contract` falla export missing | Añadir entrada en `package.json` exports para el nuevo componente |
| Build no genera `.d.ts` | Verificar `tsconfig.build.json` tiene `declaration: true` y `outDir: dist` |

---

## 9. Referencias rápidas

- **Tokens CSS**: `src/styles/tokens.css` (definidos vía `@theme inline` en Tailwind v4)
- **Globals CSS**: `src/styles/globals.css` (importa tokens, define `@layer`)
- **Barrel principal**: `src/index.ts`
- **Config Playwright**: `playwright.config.ts` (8 proyectos, global setup/teardown)
- **Config Vitest**: `vitest.config.ts` (setupFiles: `./src/test/setup.ts`)
- **Config ESLint**: `eslint.config.js` (flat config, ignora `e2e/`, `scripts/`)
- **Validador diseño**: `scripts/check-design.ts` (11 reglas + anti-biz-logic)
- **Validador contrato**: `scripts/check-component-contract.mjs` (exports ↔ src ↔ dist)

---

## 10. Notas importantes

- **No commitear** `dist/`, `playwright-report/`, `test-results/`, `coverage/`, `storybook-static/`, `*.tsbuildinfo` (ver `.gitignore`).
- **Node ≥20, pnpm ≥9** (ver `engines` y `packageManager` en `package.json`).
- **Peer deps**: `next≥14`, `react≥18.3`, `react-dom≥18.3`.
- **Registro**: GitHub Packages (`npm.pkg.github.com`, access: restricted).

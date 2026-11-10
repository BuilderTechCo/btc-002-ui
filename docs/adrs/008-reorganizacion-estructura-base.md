# ADR-008: Reorganización del scaffold — single-package root

**Estado**: Aceptado | **Fecha**: 2026-11-07 | **Actualizado**: 2026-11-09

---

## Contexto

El paquete `@buildertechco/ui` evolucionó desde una estructura monorepo multi-package (`packages/ui/`) hacia un single-package aplanado a la raíz del repositorio. La reorganización alinea la estructura física con ADR-001 y elimina directorios legacy.

## Decisión

**Estructura final:**

```text
btc-002-ui/
├── src/
│   ├── components/               # 21 directorios / 23 componentes públicos
│   ├── lib/                      # classnames, icon, fonts
│   ├── styles/                   # globals.css, tokens.css
│   ├── test/                     # setup.ts, setup-unit.ts
│   └── index.ts                  # Barrel principal
├── e2e/
│   ├── visual/                   # 22 specs; snapshots locales no versionados
│   └── support/                  # global-setup, global-teardown, utils, test-iframe
├── scripts/
│   ├── register.mjs
│   ├── check-design.ts           # 12 reglas + guardarraíl
│   ├── check-component-contract.ts
│   ├── check-component-files.mjs
│   └── check-suppressions.mjs
├── .storybook/
│   ├── main.ts
│   ├── preview.tsx
│   ├── preview-head.html
│   └── vitest.setup.ts
├── docs/
├── dist/                         # Build output (gitignored)
├── coverage/                     # Cobertura (gitignored)
├── storybook-static/             # Build Storybook (gitignored)
├── playwright-report/            # Reporte Playwright (gitignored)
├── test-results/                 # Resultados Playwright (gitignored)
├── tsconfig.base.json
├── tsconfig.json                 # Typecheck-only
├── tsconfig.build.json           # Build → dist/
├── tsconfig.eslint.json          # ESLint
├── vitest.config.ts              # Config base
├── vitest.workspace.ts           # unit + integration + storybook
├── playwright.config.ts          # 8 proyectos visuales
├── eslint.config.js
├── package.json
└── pnpm-workspace.yaml
```

### Cambios principales

| Antes (legacy)                            | Después (actual)            | Razón                                |
| :---------------------------------------- | :-------------------------- | :----------------------------------- |
| `packages/ui/`                            | Raíz del repo               | ADR-001: single-package              |
| `src/scripts/`                            | `scripts/`                  | Separar tooling del código fuente    |
| `tests/visual/`                           | `e2e/visual/`               | Convención Playwright                |
| `test/`                                   | `src/test/`                 | Setup junto al código                |
| `playwright.config.ts` en `tests/visual/` | Raíz                        | Config unificada visible             |
| `vitest.config.ts` con 2 proyectos        | `vitest.workspace.ts` con 3 | Unit + integration + storybook       |
| Sin catálogo                              | `.storybook/`               | Storybook 8 + a11y + component tests |

### TypeScript

| Config                 | Propósito                             | Incluye                                        | Excluye                               |
| :--------------------- | :------------------------------------ | :--------------------------------------------- | :------------------------------------ |
| `tsconfig.base.json`   | Base y paths `@/*` → `src/*`          | —                                              | —                                     |
| `tsconfig.json`        | Typecheck (`noEmit`)                  | `src`, `e2e`, `scripts`, `.storybook`, configs | —                                     |
| `tsconfig.build.json`  | Build (`declaration`, `outDir: dist`) | `src`                                          | tests, stories, scripts, `.storybook` |
| `tsconfig.eslint.json` | ESLint type-aware                     | igual que `tsconfig.json`                      | —                                     |

### Vitest

| Proyecto      | Entorno  | Include                                    | Setup                        |
| :------------ | :------- | :----------------------------------------- | :--------------------------- |
| `unit`        | Node     | `src/lib/**/*.{test,spec}.{ts,tsx}`        | `src/test/setup-unit.ts`     |
| `integration` | jsdom    | `src/components/**/*.{test,spec}.{ts,tsx}` | `src/test/setup.ts`          |
| `storybook`   | Chromium | generado por el plugin de Storybook        | `.storybook/vitest.setup.ts` |

### Playwright

8 proyectos (`light-*` / `dark-*`) con viewports 360×800, 768×1024, 1024×1024 y 1440×1024.

---

## Validación histórica de la reorganización (2026-11-09)

Los conteos siguientes son el resultado registrado al completar la reorganización y no deben tomarse como medición actual. Para el estado actual de unit/integration, Storybook y `check:design`, consulta [`docs/arquitectura/indice.md`](../arquitectura/indice.md).

| Gate                  | Resultado                                               |
| :-------------------- | :------------------------------------------------------ |
| `pnpm typecheck`      | ✅ 0 errores                                            |
| `pnpm lint`           | ✅ 0 errores/warnings                                   |
| `pnpm test`           | ✅ 24 archivos / 330 tests                              |
| `pnpm check:design`   | ✅ 0 violaciones                                        |
| `pnpm test:storybook` | ✅ 21 archivos / 251 tests                              |
| `pnpm test:visual`    | ⏸️ Fuera del pipeline base; requiere Storybook/Chromium |

> La validación visual es una suite separada y no se ejecutó para cerrar esta reorganización. Hay 3285 PNGs locales, pero no están versionados; un checkout limpio no dispone de ellos. El requisito de una regresión reproducible antes del release sigue pendiente.

## Estado y límites de evidencia (2026-11-10)

- `pnpm test:consumer` construye con Vite/Tailwind v4 el barrel raíz, 23 subrutas JavaScript no específicas de Next y ambas subrutas CSS. El helper `@buildertechco/ui/lib/fonts` es Next-only y queda fuera de esa prueba.
- Node ESM nativo no está soportado: los imports relativos emitidos por TypeScript carecen de extensión y el consumo de CSS requiere un bundler.
- Los baselines visuales se excluyen mediante una regla local de `.git/info/exclude`; no forman parte del historial ni de un checkout limpio.
- El historial disponible empieza con un commit que solo contiene `LICENSE`; el commit de reorganización ya contiene la estructura nueva. No hay un snapshot versionado del scaffold anterior con el que comparar exports o demostrar equivalencia funcional. Esos dos criterios no se consideran verificados.
- La verificación actual excluye deliberadamente Storybook/Chromium y Playwright; los resultados históricos de la tabla anterior no sustituyen una ejecución actual.

---

## Consecuencias

### Positivas

- Single-package root alineado con ADR-001.
- Separación clara: `src/` (código), `e2e/` (visual), `scripts/` (tooling), `.storybook/` (catálogo).
- TypeScript explícito: typecheck vs build vs ESLint.
- Testing en capas: unit, integration, stories y visual.
- Storybook como catálogo vivo con a11y y component tests.

### Negativas

- Más configuración y más comandos que mantener.
- `test:storybook` y `test:visual` requieren Chromium/Storybook y quedan fuera de `quality:verify`.
- No hay CI ni Husky; la disciplina de validación es local.

---

## Referencias

- `README.md` — Estructura y comandos
- `CLAUDE.md` — Guía de trabajo
- `docs/arquitectura/indice.md` — Principios y capas
- `docs/adrs/001-paquete-workspace-solo-fuente.md`
- `docs/adrs/005-pruebas-sin-dom.md`
- `docs/adrs/009-storybook-validacion-visual.md`
- `vitest.workspace.ts`, `playwright.config.ts`, `.storybook/`

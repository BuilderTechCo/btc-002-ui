# Índice de Decisiones Arquitectónicas (ADRs) — @buildertech/ui

> **Versión**: 0.1.0 | **Fecha**: 2026-11-09

---

## Índice de ADRs

| ID                                                   | Título                                         | Estado              | Fecha      |
| :--------------------------------------------------- | :--------------------------------------------- | :------------------ | :--------- |
| [ADR-001](./001-paquete-workspace-solo-fuente.md)    | Paquete workspace solo código fuente           | Aceptado            | 2026-11-01 |
| [ADR-002](./002-distribucion-css-tema-inline.md)    | Distribución CSS vía `@theme inline`           | Aceptado            | 2026-11-01 |
| [ADR-003](./003-librerias-ui-externas-eliminadas.md) | Librerías UI externas eliminadas               | Aceptado            | 2026-11-02 |
| [ADR-004](./004-versionado-independiente.md)         | Versionado independiente `0.1.x`               | Aceptado            | 2026-11-02 |
| [ADR-005](./005-pruebas-sin-dom.md)                | Tests sin DOM (ampliado con integración jsdom) | Aceptado / ampliado | 2026-11-03 |
| [ADR-006](./006-playwright-regresion-visual.md)     | Playwright visual regression 4×2               | Aceptado            | 2026-11-03 |
| [ADR-007](./007-check-design-multiples-directorios.md)    | `check:design` multi-directorio + guardarraíl  | Aceptado            | 2026-11-04 |
| [ADR-008](./008-reorganizacion-estructura-base.md)          | Reorganización scaffold single-package root    | Aceptado            | 2026-11-07 |
| [ADR-009](./009-storybook-validacion-visual.md)      | Storybook 8 + a11y + component tests           | Aceptado            | 2026-11-09 |

---

## Resumen de decisiones clave

### ADR-001: Paquete publicado `dist`-only

El artefacto publicado contiene solo `dist/` (JS, `.d.ts`, CSS). El repositorio incluye además tests, e2e, Storybook y scripts. No se publican configs de apps, builds de apps ni documentación de consumidores.

### ADR-002: Distribución CSS vía `@theme inline`

Tailwind v4 `@theme inline` en `globals.css` mapea variables CSS `--btc-*` → utilidades `btc-*`.

```css
@theme inline {
  --color-btc-brand: var(--btc-bg-brand);
  --shadow-btc-1: var(--btc-elevation-1);
  --spacing-btc-4: var(--btc-space-4);
}
```

El consumidor importa `@buildertech/ui/styles/globals.css` y declara `@source` para que Tailwind detecte las clases del paquete publicado.

### ADR-003: Librerías UI externas eliminadas

Siete dependencias `@librerias-ui-externas/*` fueron reemplazadas por implementaciones nativas: Dialog, Select, DropdownMenu, Toast, Label, Separator y Slot. También se eliminó `class-variance-authority`; el estilo se compone con `clsx` + `tailwind-merge`.

### ADR-004: Versionado independiente

`0.1.x` en desarrollo; `1.0.0` como objetivo de congelación. La publicación es manual en GitHub Packages; no hay CI ni Changesets instalados actualmente.

### ADR-005: Tests sin DOM (ampliado)

La estrategia original usaba `renderToStaticMarkup` sin DOM. Hoy convive con tests de integración en jsdom para comportamiento (eventos, foco, teclado, ARIA) y con tests de stories en Chromium.

### ADR-006: Playwright visual regression 4×2

8 proyectos (4 viewports × 2 temas), 22 specs y 3285 snapshots. Viewports reales: 360×800, 768×1024, 1024×1024, 1440×1024. `test:visual` queda fuera de `quality:verify`.

### ADR-007: `check:design`

Validador de 12 reglas visuales + guardarraíl anti-lógica-de-negocio. Escanea `src/` por defecto; los directorios se configuran en `package.json` (`checkDesign.scanDirs`), no por CLI.

### ADR-008: Reorganización scaffold

`packages/ui/` → raíz del repo; `src/scripts/` → `scripts/`; `tests/visual/` → `e2e/visual/`; `test/` → `src/test/`. Se añadieron `tsconfig` separados y proyectos Vitest.

### ADR-009: Storybook 8 + a11y + component tests

Storybook 8.6.19 con addon-essentials, links, a11y y experimental-addon-test. Vitest browser mode con Chromium/Playwright. Catálogo de 21 stories. **251 tests es la cifra registrada al aceptar ADR-009; la cifra más reciente en la documentación es 255, pendiente de revalidación.**

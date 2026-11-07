# Índice de Decisiones Arquitectónicas (ADRs) — @buildertech/ui

> **Versión**: 0.1.0 | **Fecha**: 2026-11-07

---

## Índice de ADRs

| ID | Título | Estado | Fecha |
|----|--------|--------|-------|
| [ADR-001](./001-paquete-workspace-source-only.md) | Paquete Workspace Solo Código Fuente | Aceptado | 2026-11-01 |
| [ADR-002](./002-distribucion-css-theme-inline.md) | Distribución CSS vía @theme inline | Aceptado | 2026-11-01 |
| [ADR-003](./003-librerias-ui-externas-eliminadas.md) | Librerías UI Externas Eliminadas | Aceptado | 2026-11-02 |
| [ADR-004](./004-versionado-independiente.md) | Versionado Independiente 0.1.x | Aceptado | 2026-11-02 |
| [ADR-005](./005-tests-without-dom.md) | Tests Sin DOM | Aceptado | 2026-11-03 |
| [ADR-006](./006-playwright-visual-regression.md) | Playwright Visual Regression 4×2 | Aceptado | 2026-11-03 |
| [ADR-007](./007-check-design-multi-directorio.md) | check:design Multi-Directorio + Guardarraíl Lógica Negocio | Aceptado | 2026-11-04 |
| [ADR-008](./008-reorganizacion-scaffold.md) | Reorganización Scaffold — Estructura Single-Package Root | Aceptado | 2026-11-07 |

---

## Resumen de Decisiones Clave

### ADR-001: Paquete Workspace Solo Código Fuente
**El paquete `@buildertech/ui` solo contiene código fuente en `src/`**. No incluye:
- Tests (se ejecutan en CI desde apps consumidoras)
- Configs de apps (tailwind.config.js, next.config.js, playwright.config.ts)
- Build outputs (`dist/`, `.next/`)
- Node modules

**Razón**: Single source of truth, builds reproducibles, separación clara paquete/app.

---

### ADR-002: Distribución CSS vía @theme inline
**Tailwind v4 `@theme inline` en `globals.css`** mapea variables CSS `--btc-*` → utilidades `btc-*`.

```css
@theme inline {
  --color-btc-brand: var(--btc-bg-brand);
  --shadow-btc-1: var(--btc-elevation-1);
  --spacing-btc-4: var(--btc-space-4);
  /* ... */
}
```

**Razón**: Zero-config para consumidores, tree-shaking automático, tipos TypeScript generados.

---

### ADR-003: Librerías UI Externas Eliminadas
**Eliminadas 7 dependencias `@librerias-ui-externas/*`** reemplazadas por implementaciones nativas:
- `react-dialog` → `Dialog` nativo (`<dialog>` HTML)
- `react-select` → `Select` nativo (`<select>` + portal)
- `react-dropdown-menu` → `DropdownMenu` nativo (Radix-style)
- `react-toast` → `Toast` nativo (ARIA live region)
- `react-label` → `Label` nativo (`<label>`)
- `react-separator` → `Separator` nativo (`<hr>`)
- `react-slot` → `Slot` nativo (asChild pattern)

**Razón**: Bundle size (-45KB), zero deps runtime, control total API, accesibilidad nativa.

---

### ADR-004: Versionado Independiente 0.1.x
**Versionado independiente** del paquete (`0.1.0` → `1.0.0` freeze).
- Apps consumidoras usan `workspace:*` en desarrollo, `@buildertech/ui@^0.1.0` en prod
- Changesets para versionado automático
- GitHub Packages registry (`npm.pkg.github.com/@buildertech`)

**Razón**: Ciclo de vida propio, breaking changes controlados en minor (0.x), SemVer estricto en 1.0.0+.

---

### ADR-005: Tests Sin DOM
**Tests unitarios sin DOM/jsdom** usando `renderToStaticMarkup`:
```tsx
const html = renderToStaticMarkup(<Button variant="primary">Click</Button>);
expect(html).toContain('bg-btc-brand');
expect(html).toContain('rounded-btc-md');
```

**Validaciones**: clases `btc-*`, HTML semántico, props a11y (aria-*, role).

**Razón**: Velocidad (<100ms/test), sin flakiness, CI simple, enfocado en contrato visual.

---

### ADR-006: Playwright Visual Regression 4×2
**8 proyectos Playwright** (4 viewports × 2 temas):
- Viewports: `mobile: 360px`, `tablet: 768px`, `laptop: 1024px`, `desktop: 1440px`
- Temas: `light`, `dark`
- ~550 snapshots base (22 componentes × ~3 estados × 8 proyectos)
- Umbral: `maxDiffPixels: 0`, `maxDiffPixelRatio: 0.001`, `threshold: 0.2`

**Razón**: Cobertura real de responsive + theming, sin jsdom, CI paralela.

---

### ADR-007: check:design Multi-Directorio + Guardarraíl Lógica Negocio
**Validador `check:design` escanea múltiples directorios**:
- `src/` (paquete — estricto)
- `apps/web/src` (app consumidora — permisivo W1-W3)

**11 Reglas Visuales + 1 Guardarraíl**:
1. Solo tokens `btc-*` (colores)
2. Solo utilidades `btc-*` (spacing, radius, shadow, etc.)
3. Espaciado base 4px (escala 1,2,3,4,6,8,12,16)
4. Radios definidos (xs, sm, md, lg, xl, 2xl, full)
5. Fuentes del sistema (`--btc-font-sans/mono`)
6. Duraciones estándar (fast, base, slow)
7. Easing estándar (`cubic-bezier(0.2, 0, 0, 1)`)
8. **Sombras definidas** (`elevation-1` a `5` → `shadow-btc-1` a `5`)
9. Z-index controlado (`--btc-z-*`)
10. Transiciones permitidas (colors, opacity, transform, shadow)
11. No `!important` (salvo utilities)
12. **Guardarraíl**: Prohíbe `fetch|supabase|prisma|axios` en `src/`

**Razón**: Single source of truth visual, previene deriva, detecta lógica negocio en UI.

---

### ADR-008: Reorganización Scaffold — Estructura Single-Package Root
**Reorganización completa** del scaffold del paquete:
- `packages/ui/` → raíz del repo (`btc-002-ui/`)
- `src/scripts/` → `scripts/`
- `tests/visual/` → `e2e/visual/`
- `test/` → `src/test/`
- 3 tsconfigs separados: `tsconfig.json` (typecheck), `tsconfig.build.json` (build), `tsconfig.eslint.json` (ESLint)
- Vitest 2 projects: unit (node) + integration (jsdom)
- Playwright config unificada en raíz con 8 projects

**Hallazgos pendientes (H1-H4)**: 55 errores `check:design` pre-existentes, pattern coverage exclude incorrecto, docs legacy, 354 fallos visuales.

**Razón**: Alineación con ADR-001, separación clara responsabilidades, configs explícitos.

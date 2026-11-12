# Arquitectura — @buildertechco/ui

> **Versión**: 0.3.2 (borrador, no publicado) | **Fecha**: 2026-11-12 | **Estado**: Revisado contra el repositorio

---

## 1. Principios fundamentales

| Principio                            | Descripción                                                                                                                                                          |
| :----------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Paquete publicado `dist`-only**    | El artefacto publicado contiene solo `dist/` (JS, `.d.ts`, CSS). El repositorio sí incluye tests, e2e, Storybook y scripts. ADR-001                                  |
| **Layout vía Tailwind CSS**          | No hay tokens propios para sizing, flexbox, grid, box alignment o layout. Solo espaciado (`--btc-space-*`), elevación (`--btc-elevation-*`) y z-index (`--btc-z-*`). |
| **Distribución CSS**                 | `@theme inline` en `globals.css` mapea `--btc-*` → utilidades `btc-*`. ADR-002                                                                                       |
| **Cero dependencias de UI externas** | Dialog, Select, DropdownMenu, Toast, Label, Separator y Slot son nativos. ADR-003                                                                                    |
| **Versionado independiente**         | `0.1.0` publicado; `0.3.2` en preparación; `1.0.0` como objetivo de congelación. ADR-004                                                                             |
| **Testing en capas**                 | Unit (Node), integration (jsdom), stories (Chromium) y regresión visual Playwright. ADR-005 / ADR-009                                                                |
| **Regresión visual**                 | Playwright: 4 viewports × 2 temas = 8 proyectos. ADR-006                                                                                                             |
| **Validación visual**                | `check:design`: 12 reglas + guardarraíl anti-lógica-de-negocio. ADR-007                                                                                              |
| **Catálogo vivo**                    | Storybook 8.6.19 con controles, a11y y component tests. ADR-009                                                                                                      |

---

## 2. Estructura del paquete

```text
src/
├── index.ts                 # Barrel público (23 componentes)
├── styles/
│   ├── tokens.css           # Variables CSS primitivas + roles semánticos light/dark
│   └── globals.css          # @theme inline → utilidades Tailwind btc-*
├── lib/
│   ├── classnames/          # clsx + tailwind-merge → export `clsx`
│   ├── icon/                # Wrapper semántico de Lucide
│   └── fonts/               # Helpers next/font (Inter, JetBrains Mono, Space Grotesk)
└── components/              # 21 directorios / 23 componentes públicos
    ├── button/              # Button (7 variantes, iconos por nombre, fullWidth)
    ├── card/                # Card + Header/Title/Description/Content/Footer/Actions
    ├── dialog/              # Dialog + Header/Content/Footer/Close
    ├── select/              # Select (options[], searchable, multiple, clearable)
    ├── table/               # Table (columns[], data[], sorting, selection)
    ├── nav-link/            # NavLink (active explícito; no detecta la ruta)
    ├── badge/               # Badge (6 variantes, icono, removable)
    ├── textfield/           # TextField (label, error, helpText, iconos, variantes)
    ├── empty-state/         # EmptyState (ilustraciones predefinidas)
    ├── loading-state/       # LoadingState (skeleton, spinner, inline, page)
    ├── error-state/         # ErrorState (default, inline, toast)
    ├── error-page/          # ErrorPage (401, 403, 404, 500, 503, maintenance, offline)
    ├── copy-button/         # CopyButton (feedback de copiado)
    ├── back-button/         # BackButton (history.back + fallback)
    ├── theme-toggle/        # ThemeToggle (button/dropdown, light/dark/system)
    ├── skeleton/            # Skeleton (text, rect, circle, card, table-row)
    ├── label/               # Label (nativo + required, helpText, error)
    ├── separator/           # Separator (horizontal/vertical, 4 variantes)
    ├── slot/                # Slot (polimorfismo `as`)
    ├── toast/               # Toast + ToastProvider + ToastViewport + useToast
    └── dropdown-menu/       # DropdownMenu compound
```

### Testing y tooling

```text
src/test/                    # Setup de unit (Node) e integration (jsdom)
e2e/visual/                  # 22 specs; 3285 snapshots locales no versionados
e2e/support/                 # global setup/teardown y utilidades
.storybook/                  # main.ts, preview.tsx, preview-head.html, vitest.setup.ts
scripts/                     # check-design, contract, component-files, suppressions
vitest.workspace.ts          # unit + integration + storybook
playwright.config.ts         # 8 proyectos visuales
```

---

## 3. Convenciones de código

### 3.1 Componentes

- **forwardRef** obligatorio en componentes base.
- **displayName** para debugging.
- **Compound components** vía `Object.assign`:
  - `Card.Header`, `Card.Title`, `Card.Description`, `Card.Content`, `Card.Footer`, `Card.Actions`.
  - `Dialog.Header`, `Dialog.Content`, `Dialog.Footer`, `Dialog.Close`.
  - `DropdownMenu.Trigger`, `.Content`, `.Item`, `.CheckboxItem`, `.RadioItem`, `.Separator`, `.Label`.
- Los sub-componentes también se exportan por nombre desde el barrel.
- **Props extendidas** de elemento HTML nativo; `Omit` cuando se sobrescribe `onChange`, `size`, etc.
- **Type aliases** en lugar de interfaces vacías.
- **Ref forwarding polimórfico** para elementos nativos (`button` | `a`).
- **Iconos en Button/TextField**: se pasan por nombre (`leftIcon="plus"`), no como ReactNode.

### 3.2 Estilos

- Solo utilidades `btc-*` (colores, spacing, radius, shadow, z-index, tipografía, transiciones).
- **Prohibido**: valores hardcodeados, utilidades Tailwind por defecto para spacing/radius/shadow, `!important` salvo utilities globales, `transition-all`.
- **Validación**: `check:design` (12 reglas + guardarraíl).

### 3.3 Iconos

- `Icon` envuelve Lucide React.
- Props: `name`, `category` (`nav` | `action` | `status` | `empty`), `size` (`xs` | `sm` | `md` | `lg` | `xl`), `color`, `aria-label`, `decorative`.

### 3.4 Tipografía

- 3 fuentes: `--btc-font-sans` (Inter), `--btc-font-mono` (JetBrains Mono), `--btc-font-display` (Space Grotesk).
- Utilidades: `text-btc-display`, `text-btc-h1`…`h4`, `text-btc-body`, `text-btc-body-s`, `text-btc-control`, `text-btc-caption`, `text-btc-mono`.
- `globals.css` solo genera `font-btc-sans` y `font-btc-mono`. `--btc-font-display` se define con `getFontDisplay()`, pero no tiene utilidad `font-btc-display`; úsalo vía `var(--btc-font-display)`.

### 3.5 Tema y portales

- El tema se aplica en `<html data-theme="light|dark">`.
- Dialog, Toast y DropdownMenu se portalean a `document.body`; así heredan las variables del tema y evitan ancestros con `transform`, `filter` o `contain`.

---

## 4. Qué sí / qué no está en el paquete

| ✅ Sí (en `@buildertechco/ui`)   | ❌ No (en apps consumidoras)                               |
| :------------------------------- | :--------------------------------------------------------- |
| 23 componentes públicos          | AppShell, Topbar, Sidebar, layouts                         |
| Tokens CSS (`--btc-*`)           | Overrides de tokens (salvo W1 justificado)                 |
| Utilidades `btc-*` generadas     | Lógica de negocio (`fetch`, `supabase`, `prisma`, `axios`) |
| `Icon`, `clsx`                   | Wrappers de componentes (`CustomCard`, etc.)               |
| `check:design`, `check:contract` | Tests E2E o configs de apps                                |
| ADRs, arquitectura, gobernanza   | Código específico de dominio                               |

---

## 5. Capas de testing

| Capa            | Herramienta                           | Qué valida                                                   |
| :-------------- | :------------------------------------ | :----------------------------------------------------------- |
| **Unit**        | Vitest + Node                         | Utilidades puras, classnames, iconos, tipos                  |
| **Integration** | Vitest + jsdom + Testing Library      | Comportamiento, eventos, foco, teclado, ARIA                 |
| **Stories**     | Storybook + Vitest browser + Chromium | Render de cada story y assertions de `play`                  |
| **Visual**      | Playwright                            | 4 viewports × 2 temas; 3285 snapshots locales no versionados |
| **A11y**        | `@storybook/addon-a11y` (axe)         | Violaciones por story                                        |

Comandos: `pnpm test`, `pnpm test:storybook`, `pnpm test:visual`, `pnpm storybook`.

### Estado verificado (2026-11-10)

- Unit + integration: **334 tests**, todos pasaron en dos ejecuciones consecutivas; no hubo suites fallidas ni diferencias de nombre/estado.
- Storybook: **255/255 tests aprobados en 21 archivos** con `pnpm test:storybook`.
- `check:design`: **0 violaciones**.
- Calidad y distribución: pasaron `pnpm test:static`, `pnpm format:check`, `pnpm quality:verify`, `pnpm build`, `pnpm build-storybook`, `pnpm test:consumer`, `npm pack --dry-run` y `pnpm install --frozen-lockfile --offline`.
- Consumo: `pnpm test:consumer` valida con Vite/Tailwind v4 el barrel raíz, 23 subrutas JavaScript no específicas de Next y las dos subrutas CSS. No valida Next.js ni el subpath de fuentes.
- Node ESM nativo sigue sin soporte por imports relativos sin extensión y CSS.
- Bloqueo Playwright: `pnpm test:visual` no se ejecutó; los 3285 snapshots visuales registrados solo existen localmente y no están versionados, por lo que faltan en un checkout limpio. Al ser obligatorio antes de cada commit, el gate no se puede aprobar en checkouts sin baselines reproducibles.

---

## 6. Referencias

- [Decisiones arquitectónicas (ADRs)](../adrs/indice.md)
- [Especificación de API](../tokens/especificacion-api.md)
- [Layout, sizing, flexbox, grid y spacing](../tokens/dimensiones-disposicion.md)
- [Paleta visual](../tokens/paleta-visual.md)
- [Enforcement](../gobernanza/cumplimiento.md)
- [Guía de componentes](../componentes/guia.md)
- [Añadir un componente](../componentes/agregar-componente.md)
- [Navegadores soportados](../componentes/navegadores-compatibles.md)
- [Guía de migración](../guias/guia-migracion.md)
- [Contribuir](../guias/contribuir.md)

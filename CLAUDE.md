Agentes: no crear ramas ni worktrees sin aprobación humana previa, explícita y
específica. NO commits, NO push, NO merge ni PR nunca.

# CLAUDE.md — @buildertechco/ui

Guía de trabajo para agentes y colaboradores del Design System `@buildertechco/ui`.

---

## 1. Visión general

- **Paquete**: `@buildertechco/ui` — Design System propietario de BuilderTech.
- **Estructura**: single-package en la raíz del repositorio (`btc-002-ui/`). No hay `packages/ui/`.
- **Estilo**: Tailwind CSS v4 CSS-first (`@theme inline`) + tokens `btc-*`.
- **Calidad**: 12 reglas visuales (`check:design`) + guardarraíl anti-lógica-de-negocio, contrato de exports, typecheck estricto, lint, tests unit/integration, Storybook component tests y regresión visual Playwright.
- **Documentación**: `docs/` es la fuente de verdad. Todo cambio de API o de tokens debe actualizar docs y `CHANGELOG.md`.

### Versiones reales

| Herramienta       | Versión                            |
| :---------------- | :--------------------------------- |
| Node              | `>=26` (`.nvmrc` incluido)         |
| pnpm              | `9.12.0`                           |
| React / React DOM | `18.3.1`                           |
| TypeScript        | `5.9.3` (rango `^5.7.2`)           |
| Vite              | `5.4.21`                           |
| Vitest            | `2.1.9`                            |
| Playwright        | `1.65.0` (Chromium 1254 instalado) |
| Storybook         | `8.6.19`                           |
| Tailwind CSS      | `4.3.5`                            |

---

## 2. Estructura

```text
src/
├── index.ts                  # Barrel público
├── styles/
│   ├── tokens.css            # Variables --btc-* + roles light/dark
│   └── globals.css           # @theme inline → utilidades btc-*
├── lib/
│   ├── classnames/           # clsx + tailwind-merge
│   ├── icon/                 # Wrapper semántico de Lucide
│   └── fonts/                # Helpers next/font
├── components/               # 21 directorios / 23 componentes públicos
│   ├── <componente>/
│   │   ├── <componente>.tsx
│   │   ├── <componente>.test.tsx
│   │   ├── <componente>.stories.tsx
│   │   └── index.ts
│   └── ...
└── test/
    ├── setup.ts              # Integration (jsdom)
    └── setup-unit.ts         # Unit (Node)

e2e/
├── visual/                   # 22 specs + snapshots (3285 PNGs)
└── support/                  # global setup/teardown y utilidades

.storybook/
├── main.ts                   # Addons + framework + Tailwind plugin
├── preview.tsx               # Tema, viewports, backgrounds, decorador global
├── preview-head.html         # Ancho completo del root
└── vitest.setup.ts           # Annotations + beforeAll para storybook test

scripts/                      # check-design, contract, files, suppressions, build
docs/                         # Arquitectura, ADRs, componentes, tokens, guías
```

### Componentes públicos (23)

- **Base (16)**: Button, Card, Dialog, Select, Table, NavLink, Badge, TextField, EmptyState, LoadingState, ErrorState, ErrorPage, CopyButton, BackButton, ThemeToggle, Skeleton.
- **Primitivas (7)**: Toast, ToastProvider, ToastViewport, Label, Separator, Slot, DropdownMenu.

`Card`, `Dialog` y `DropdownMenu` son compound: exponen sub-componentes estáticos (`Card.Header`, `Dialog.Footer`, `DropdownMenu.Item`) y también exports nombrados.

---

## 3. Comandos

```bash
pnpm build
pnpm build-storybook
pnpm check:component-files
pnpm check:contract
pnpm check:design
pnpm check:suppressions
pnpm format                    # Prettier en todo el repositorio
pnpm format:check              # verificar todo el repositorio sin modificar
pnpm lint
pnpm quality:verify            # typecheck + lint + check:design + test
pnpm storybook                 # http://127.0.0.1:6006 (auto-open)
pnpm test                      # unit + integration
pnpm test:consumer             # Vite/Tailwind package-consumer smoke test
pnpm test:coverage             # cobertura unit + integration
pnpm test:docs-contract        # consistencia de docs, registry y checklist del PR
pnpm test:static               # typecheck + lint + component/export/docs contracts
pnpm test:storybook            # stories en Chromium
pnpm test:visual               # Playwright (8 proyectos)
pnpm typecheck
```

### `check:design`

- Escanea `src/` por defecto.
- **No** acepta `--scan-dirs`; configura `checkDesign.scanDirs` en `package.json` si hace falta.
- Implementa **12 reglas visuales + 1 guardarraíl**:
  `only-btc-color-tokens`, `only-btc-utilities`, `spacing-scale`, `sizing-scale`, `radius-defined`, `font-system`, `duration-standard`, `ease-standard`, `shadow-defined`, `z-index-controlled`, `transition-allowed`, `no-important`, `no-business-logic`.
- `no-important` se omite en estilos globales; `no-business-logic` prohíbe `fetch|supabase|prisma|axios`.

### Storybook

- El auto-open se verificó interceptando `BROWSER`; abre `http://127.0.0.1:6006/`.
- Si el puerto está ocupado por una instancia vieja, Storybook falla o sirve la versión anterior. Detén la instancia antes de reiniciar.
- Cambios en `.storybook/main.ts` requieren reinicio; `preview.tsx` y `preview-head.html` recargan en caliente.
- **API legacy de Storybook 8.6.19**: `parameters.viewport.viewports` y `parameters.backgrounds.values`. No migrar a `options` sin actualizar Storybook.
- `preview-head.html` fuerza `#storybook-root { width: 100%; flex: 1 1 auto; }` para evitar el colapso de `layout: centered`.
- El decorador global aplica `data-theme` en `<html>` y un contenedor de 1024/1280px centrado.
- Addons: `@storybook/addon-essentials`, `@storybook/addon-links`, `@storybook/addon-a11y`, `@storybook/experimental-addon-test`.
- Tests de stories: Vitest browser mode con Chromium/Playwright. Requiere `~/.cache/ms-playwright/chromium-1254` (y `chromium_headless_shell-1254`).

### Vitest

`vitest.workspace.ts` define 3 proyectos:

| Proyecto      | Entorno  | Include                                           | Setup                        |
| :------------ | :------- | :------------------------------------------------ | :--------------------------- |
| `unit`        | Node     | `src/lib/**/*.{test,spec}.{ts,tsx}`               | `src/test/setup-unit.ts`     |
| `integration` | jsdom    | `src/components/**/*.{test,spec}.{ts,tsx}`        | `src/test/setup.ts`          |
| `storybook`   | Chromium | generado por `@storybook/experimental-addon-test` | `.storybook/vitest.setup.ts` |

El proyecto `storybook` **no** extiende `vitest.config.ts` para evitar el warning de `test.include`; el plugin genera el include desde el índice de stories.

### Playwright

- `playwright.config.ts` en la raíz.
- 8 proyectos: `light-mobile`, `dark-mobile`, `light-tablet`, `dark-tablet`, `light-laptop`, `dark-laptop`, `light-desktop`, `dark-desktop`.
- Viewports reales: 360×800, 768×1024, 1024×1024, 1440×1024.
- `webServer` arranca Storybook en local (`reuseExistingServer: true`) y se desactiva en CI.
- Snapshots en `e2e/visual/snapshots/` (3285 PNGs, gitignored vía `.git/info/exclude`).

---

## 4. Convenciones de código

- **TypeScript estricto**; sin `any`.
- **forwardRef + displayName** en componentes base.
- **Compound components** vía `Object.assign` (Card, Dialog, DropdownMenu).
- **Props extendidas** de elementos HTML nativos; usa `Omit` cuando se sobrescribe `onChange`, `size`, etc.
- **Type aliases** para props vacías.
- **Iconos**: `Icon` con `name`, `category`, `size`, `color`, `aria-label`, `decorative`.
- **Botones y TextField**: los iconos se pasan por nombre (`leftIcon="plus"`), no como ReactNode.
- **Clases**: solo utilidades `btc-*`; escala de espaciado `0,1,2,3,4,6,8,12,16`; radios y sombras definidos; sin `!important`; sin `transition-all`.
- **Tema**: se aplica en `<html data-theme="light|dark">`; los portales a `document.body` (Dialog, Toast, DropdownMenu) dependen de ello.
- **Portales**: Dialog y Toast usan `document.body` por defecto; `portalId` es opcional.

---

## 5. Testing y validación

Antes de cualquier commit, ejecuta localmente y verifica todos estos gates
(también para cambios solo de documentación):

```bash
pnpm format:check
pnpm quality:verify
pnpm test:static
pnpm test:storybook
pnpm test:visual
pnpm test:consumer
pnpm build
```

- **Estado verificado (2026-11-10)**: 334 tests unit/integration pasaron en dos ejecuciones, 255 tests de Storybook en 21 archivos, 0 violaciones `check:design`; `test:static`, `format:check`, build, `build-storybook`, `test:consumer` y `npm pack --dry-run` también pasaron.
- **Bloqueo Playwright**: `test:visual` no se ejecutó en la validación del 2026-11-10 y no está en `quality:verify`; los snapshots no están versionados y faltan en un checkout limpio. Como el test es obligatorio antes del commit, no se puede aprobar el gate desde un checkout sin baselines reproducibles. No actualices snapshots sin aprobación del DS Owner.
- `check:contract` compara exports de `package.json` con `src/` y `dist/`; `check:component-files` valida la estructura de cada componente.
- No hay CI ni Husky configurados; la validación es local y obligatoria antes del commit/PR. Los comandos completos están en `AGENTS.md`.

---

## 6. Documentación

| Documento                                | Cuándo actualizarlo                               |
| :--------------------------------------- | :------------------------------------------------ |
| `README.md`                              | Comandos, stack, estructura, conteos, instalación |
| `CHANGELOG.md`                           | Todo cambio visible para consumidores             |
| `CLASIFICACION.md`                       | Cambios en tests/deuda conocida                   |
| `docs/tokens/especificacion-api.md`      | Cambios de props o exports                        |
| `docs/componentes/guia.md`               | Ejemplos de uso e instalación                     |
| `docs/tokens/paleta-visual.md`           | Tokens de color o ratios de contraste             |
| `docs/tokens/dimensiones-disposicion.md` | Espaciado, elevación, z-index o reglas            |
| `docs/gobernanza/cumplimiento.md`        | Reglas, excepciones o procesos                    |
| `docs/arquitectura/indice.md`            | Estructura, principios, testing                   |
| `docs/adrs/`                             | Decisiones arquitectónicas nuevas                 |
| `docs/guias/`                            | Flujo de contribución, release y migración        |
| `docs/gobernanza/versionado.md`          | Incrementos SemVer por issue y PR                 |

### Deuda conocida de accesibilidad

**Resuelta según la última evidencia documentada**: el botón primario usa `--btc-action-primary: coral-700 (#C93A1E)` con texto blanco: **5.11:1** ✅ WCAG AA. Hover `coral-800` (6.97:1), pressed `coral-900` (10.28:1). Axe no se volvió a ejecutar el 2026-11-10. `coral-600` se conserva como primitiva de marca (`--btc-brand`) para acentos no textuales.

---

## 7. Reglas para agentes

1. No borres archivos no rastreados ni trabajo del usuario sin confirmación.
2. No cambies la API pública sin actualizar `src/index.ts`, exports de `package.json`, docs y changelog.
3. No edites snapshots visuales sin aprobación explícita.
4. No añadas lógica de negocio (`fetch`, `supabase`, `prisma`, `axios`) a `src/`.
5. No introduzcas colores, spacing, radios o sombras fuera de los tokens `btc-*`.
6. No afirmes que una suite pasa sin ejecutarla.
7. Mantén los conteos de tests y componentes sincronizados con la realidad.
8. Antes de cada tarea, lee toda la documentación propia y versionada del
   repositorio y sigue los estándares aprobados; no los debilites ni los eludas.
   Consulta `AGENTS.md` para el alcance y las reglas completas.

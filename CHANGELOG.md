# Changelog — @buildertechco/ui

Todos los cambios notables de este paquete se documentan aquí.

El formato sigue [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y el proyecto adhiere a [Semantic Versioning](https://semver.org/lang/es/).

---

## [Unreleased]

---

## [0.1.0] — 2026-11-10

> **Versión inicial del paquete.** No hubo publicaciones previas en GitHub Packages ni tags anteriores: esta entrada consolida el scaffold inicial (2026-11-05), los arreglos antes listados como `0.1.1` (2026-11-06) y el trabajo acumulado en `[Unreleased]`.

### Agregado

- **Scaffold inicial** del paquete `@buildertechco/ui`.
- **Tokens de diseño** (`src/styles/tokens.css`):
  - Forest (marca), Coral (acción), Blue (info), Red (error), Neutral Warm.
  - Espaciado base 4px, radios, fuentes, movimiento y z-index.
  - Roles semánticos light/dark y `color-scheme`.
- **Mapeo Tailwind v4** (`src/styles/globals.css`): `@theme inline` → utilidades `btc-*`.
- **Utilidades base**:
  - `clsx` (clsx + tailwind-merge), exportado desde `src/lib/classnames`.
  - `Icon`, wrapper semántico de Lucide.
  - Helpers `next/font` para Inter, JetBrains Mono y Space Grotesk.
- **23 componentes públicos**:
  - Base (16): Button, Card, Dialog, Select, Table, NavLink, Badge, TextField, EmptyState, LoadingState, ErrorState, ErrorPage, CopyButton, BackButton, ThemeToggle, Skeleton.
  - Primitivas (7): Toast, ToastProvider, ToastViewport, Label, Separator, Slot, DropdownMenu.
- **Validación**:
  - `check:design`: 12 reglas visuales + guardarraíl `fetch|supabase|prisma|axios`.
  - `check:contract`, `check:component-files`, `check:suppressions`.
- **Tests**:
  - Unit (Node) + integration (jsdom) con Vitest; unitarios para utilidades, integration para componentes.
  - Regresión visual Playwright: 4 viewports × 2 temas = 8 proyectos.
- **Publicación**:
  - `publishConfig.registry: https://npm.pkg.github.com/`.
  - `files: ["dist"]`; build con JS, `.d.ts` y CSS.
- **Prueba de consumo del paquete**: `pnpm test:consumer` valida con Vite/Tailwind el barrel, las subrutas JavaScript no específicas de Next y ambos exports CSS; se ejecuta en `prepublishOnly`.
- **Contrato de documentación**: `pnpm test:docs-contract` detecta scope/registry obsoletos, instrucciones de workspace inválidas y comandos inexistentes en el template de PR; forma parte de `test:static` y `prepublishOnly`.
- **Formato reproducible**: `pnpm format` aplica Prettier al repositorio y `pnpm format:check` verifica sin modificar, excluyendo salidas generadas y el lockfile.
- **Guías de publicación y consumo**: alineadas con `@buildertechco/ui`, GitHub Packages y la publicación manual; se eliminaron pasos de workspace entre repositorios.
- **Card variant `elevated-bordered`**: sombra `shadow-btc-2` + borde `border-btc-default`.
- **Card.Header**: nuevo slot `leftIcon` (altura = título + subtitle, centrado vertical) y props `onClose` / `closeAriaLabel` para botón de cerrar opcional.
- **Card.Description**: ahora usa `text-btc-caption text-btc-text-primary` (mejor contraste).
- **Card.Content**: padding vertical `py-btc-3`.
- **Card.Actions**: sin borde superior y sin `mt-btc-4` (evita duplicados cuando hay Footer).
- **Dialog stories**: apertura manual (botón trigger) en lugar de auto-open para ahorro de recursos.
- **Skeleton**: fondo `bg-btc-border-strong` (neutral-400 / neutral-700) para contraste visible (2.5:1 decorativo).
- **Separator label**: `text-btc-text-secondary` (4.61:1 AA).
- **Documentación**: `README.md`, `CHANGELOG.md`, `CLASIFICACION.md`, `CLAUDE.md`, `docs/tokens/especificacion-api.md`, `docs/tokens/paleta-visual.md`, `docs/componentes/guia.md`, stories actualizados.
- **Documentación base**: arquitectura, APIs, tokens, gobernanza, guías y ADR-001 a ADR-009.

### Cambiado

- **Exports raíz**: CSS y helpers `next/font` dejan de exportarse desde el barrel raíz. Los estilos siguen disponibles como imports CSS y los helpers de Next en `@buildertechco/ui/lib/fonts`; `next` queda como peer opcional.
- **Action tokens**: `--btc-action-primary` `coral-700`, `--btc-action-hover` `coral-800`, `--btc-action-pressed` `coral-900` (todos AA con blanco).
- **Border subtle**: `--btc-border-subtle` → `neutral-200` (light) / `forest-700` (dark) para divisores visibles.
- **Ghost text**: `--btc-action-ghost-text` → `text-primary` (17.2:1 AA).
- **Badge default**: `bg-btc-action-primary` (coral-700) en lugar de `bg-btc-brand` (coral-600).
- **CopyButton**: `aria-label` estable (no cambia al copiar); texto visible indica estado.
- **DropdownMenu**: `DropdownMenuTrigger` requiere `aria-label`; `select` oculto con `role="presentation"`.
- **EmptyState**: description `text-btc-text-primary`.
- **ErrorState**: message `text-btc-error`, retry button `variant="primary"`.
- **Label helpText**: `text-btc-text-secondary`.
- **LoadingState inline**: text `text-btc-text-primary`.
- **NavLink active**: `bg-btc-brand/10 text-btc-error` (coral-700 5.11:1); hover sin underline.
- **Select**: hidden select `role="presentation"`.
- **Quality pipeline**: `quality:verify` deja fuera `test:visual` porque requiere Storybook/Chromium.
- **ESLint 9**: migración a flat config (`eslint.config.js`).
- **Scripts**: loader `tsx` actualizado a `tsx.initialize()`.

### Corregido

- **Contraste WCAG AA resuelto en 13 componentes**: Button, Badge, Card, CopyButton, DropdownMenu, EmptyState, ErrorState, Label, LoadingState, NavLink, Select, Separator, Skeleton.
- **TypeScript**: errores de compilación resueltos en componentes:
  - `BackButton`: ref forwarding para `<button>` y `<a>` con type guards.
  - `ThemeToggle`: `Omit<ButtonHTMLAttributes, 'onChange'>`.
  - `Select`: type guard `isSelectGroup` para discriminar `SelectGroup`/`SelectOption`.
  - `Table`: `rowKey` incluye `'id'`; checkbox indeterminado con ref callback.
  - `Slot`: forwardRef polimórfico simplificado.
  - `TextField`: foco con type assertion correcta.
  - `Dialog`, `Card` y `ToastViewport`: interfaces vacías → type aliases.
  - `DropdownMenu`: children callable, null check de posición y limpieza de imports.
  - `Toast`: export explícito del componente.
  - `Label` y `Separator`: exports duplicados eliminados.
- **Storybook puerto 6006**: script `pre-storybook` mata proceso previo antes de levantar.
- **Lint typo**: `separator.tsx` `<spans>` → `<span>`.
- **Imports**: `card.stories.tsx` Icon path, `card.tsx` Slot path.
- **Tests**: copy-button (visible text), label (text-secondary), dropdown-menu (25 aria-labels).

### Decisiones arquitectónicas

- ADR-001: Paquete workspace source-only.
- ADR-002: Distribución CSS vía `@theme inline`.
- ADR-003: Librerías UI externas eliminadas.
- ADR-004: Versionado independiente `0.1.x`.
- ADR-005: Tests sin DOM (ampliado después con integración jsdom).
- ADR-006: Playwright visual regression 4×2.
- ADR-007: `check:design` multi-directorio + guardarraíl.
- ADR-008: Reorganización scaffold single-package root.
- ADR-009: Storybook 8 como catálogo vivo y validación visual.

### Conocido / pendiente

- No hay workflows de CI en `.github/workflows/` ni Changesets instalado; el release es manual.
- `test:visual` fuera de `quality:verify` (requiere Storybook/Chromium).
- Node ESM nativo no está soportado por los imports relativos sin extensión y los estilos CSS. Vite/Tailwind sí se valida con `pnpm test:consumer`; esa prueba no cubre Next.js ni `@buildertechco/ui/lib/fonts`.
- Los 3285 baselines visuales existen solo en el entorno local y no están versionados; la suite visual no puede reproducirse desde un checkout limpio.
- El estado de error visible de `CopyButton` sigue pendiente de implementación; actualmente, si copiar falla, solo emite `onCopy(false)`.

---

## [1.0.0] — objetivo Q1 2027

### Cambiado

- Congelación de API pública.
- SemVer estricto (patch/minor/major).

### Agregado

- Soporte multi-app y guías de migración por app.
- Métricas de adopción y uso.

---

## Formato de entradas

### Tipos de cambio

- `Agregado` — nueva funcionalidad.
- `Cambiado` — cambio en funcionalidad existente.
- `Eliminado` — funcionalidad removida.
- `Corregido` — bug fix.
- `Seguridad` — fix de vulnerabilidad.
- `Deprecado` — funcionalidad marcada para eliminación futura.

### Convención de versiones

- `0.x.x` — desarrollo activo; breaking changes permitidos en minor.
- `1.0.0+` — API estable; SemVer estricto.

### Referencias

Cada entrada puede referenciar issue, PR, ADR o HU. Ejemplo: `Agregado: Button component (HU-03, PR #42, ADR-003)`.

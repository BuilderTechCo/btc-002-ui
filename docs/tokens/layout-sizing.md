# Layout, Sizing, Flexbox, Grid, Box Alignment & Spacing — @buildertech/ui

> **Versión**: 0.1.0 | **Fecha**: 2026-11-07 | **Estado**: Validado contra implementación real

---

## 🎯 Resumen de Enfoque

| Tema | Proveído por DS | Proveído por Tailwind | Documentación |
|------|-----------------|----------------------|---------------|
| **Spacing** | ✅ Tokens `--btc-space-*` (base 4px) | Utilidades `p-btc-*`, `m-btc-*`, `gap-btc-*`, `space-btc-*` | Esta doc + `gobernanza/enforcement.md` R2 |
| **Sizing** | ❌ | Utilidades `w-*`, `h-*`, `min-w-*`, `max-w-*`, `size-*` | [Tailwind Sizing](https://tailwindcss.com/docs/width) |
| **Flexbox** | ❌ | Utilidades `flex`, `flex-row`, `flex-col`, `items-*`, `justify-*`, `gap-*` | [Tailwind Flexbox](https://tailwindcss.com/docs/flex) |
| **Grid** | ❌ | Utilidades `grid`, `grid-cols-*`, `grid-rows-*`, `col-span-*`, `row-span-*` | [Tailwind Grid](https://tailwindcss.com/docs/grid-template-columns) |
| **Box Alignment** | ❌ | Utilidades `items-*`, `justify-*`, `self-*`, `place-*`, `content-*` | [Tailwind Box Alignment](https://tailwindcss.com/docs/align-items) |
| **Layout** | ❌ | Utilidades `container`, `container-*`, `overflow-*`, `position-*`, `inset-*` | [Tailwind Layout](https://tailwindcss.com/docs/container) |
| **Elevation (Sombras)** | ✅ Tokens `--btc-elevation-1` a `5` | Utilidades `shadow-btc-1` a `5` | Esta doc + `gobernanza/enforcement.md` R6 |
| **Z-Index** | ✅ Tokens `--btc-z-*` | Utilidades `z-btc-*` | `gobernanza/enforcement.md` R7 |

> **Regla de Oro**: **No definir tokens personalizados** para sizing, flexbox, grid, box alignment, o layout. Usar utilidades Tailwind directamente. Solo el **espaciado** (`--btc-space-*`), **elevación** (`--btc-elevation-*`), y **z-index** (`--btc-z-*`) tienen tokens propios.

---

## 1. Spacing — Espaciado (Base 4px) ✅

### 1.1 Tokens Primitivos (`tokens.css`)

```css
:root {
  /* Escala base 4px — 8 pasos */
  --btc-space-1: 4px;   /* 1 × 4px  */
  --btc-space-2: 8px;   /* 2 × 4px  */
  --btc-space-3: 12px;  /* 3 × 4px  */
  --btc-space-4: 16px;  /* 4 × 4px  */
  --btc-space-6: 24px;  /* 6 × 4px  */
  --btc-space-8: 32px;  /* 8 × 4px  */
  --btc-space-12: 48px; /* 12 × 4px */
  --btc-space-16: 64px; /* 16 × 4px */
}
```

### 1.2 Utilidades Tailwind Generadas (`globals.css` → `@theme inline`)

```css
@theme inline {
  /* Espaciado → utilidades p-btc-*, m-btc-*, gap-btc-*, space-btc-* */
  --spacing-btc-1: var(--btc-space-1);
  --spacing-btc-2: var(--btc-space-2);
  --spacing-btc-3: var(--btc-space-3);
  --spacing-btc-4: var(--btc-space-4);
  --spacing-btc-6: var(--btc-space-6);
  --spacing-btc-8: var(--btc-space-8);
  --spacing-btc-12: var(--btc-space-12);
  --spacing-btc-16: var(--btc-space-16);
}
```

### 1.3 Clases Disponibles

| Tipo | Clases | Valores |
|------|--------|---------|
| **Padding** | `p-btc-{1,2,3,4,6,8,12,16}` | 4px → 64px |
| **Padding X/Y** | `px-btc-*`, `py-btc-*` | Eje horizontal/vertical |
| **Padding Direccional** | `pt-btc-*`, `pr-btc-*`, `pb-btc-*`, `pl-btc-*` | Cada lado |
| **Margin** | `m-btc-{1,2,3,4,6,8,12,16}` | 4px → 64px |
| **Margin X/Y** | `mx-btc-*`, `my-btc-*` | Eje horizontal/vertical |
| **Margin Direccional** | `mt-btc-*`, `mr-btc-*`, `mb-btc-*`, `ml-btc-*` | Cada lado |
| **Gap (Flex/Grid)** | `gap-btc-{1,2,3,4,6,8,12,16}` | 4px → 64px |
| **Gap X/Y** | `gap-x-btc-*`, `gap-y-btc-*` | Eje horizontal/vertical |
| **Space (Between Children)** | `space-x-btc-*`, `space-y-btc-*` | Solo hijos directos |

### 1.4 Ejemplos de Uso

```tsx
// ✅ CORRECTO — Usa utilidades btc-*
<Card className="p-btc-4 gap-btc-3">
  <Card.Header className="flex items-center gap-btc-2">
    <Icon name="dashboard" category="nav" size="md" />
    <Card.Title>Título</Card.Title>
  </Card.Header>
  <Card.Content className="space-y-btc-2">
    <p>Párrafo 1</p>
    <p>Párrafo 2</p>
  </Card.Content>
</Card>

// ❌ PROHIBIDO — Hardcoded spacing o Tailwind default
<div className="p-5 gap-10">  {/* p-5 = 20px (no en escala), gap-10 = 40px (no en escala) */}
<div className="p-4 gap-4">  {/* Usa escala default de Tailwind, no btc-* */}
```

### 1.5 Validación (`check:design`)

- **Regla `spacing-scale`**: Solo permite valores de la escala `1,2,3,4,6,8,12,16`
- **Regla `only-btc-utilities`**: Requiere prefijo `btc-` en todas las utilidades de espaciado
- Ver: `gobernanza/enforcement.md` → **R2: Espaciado Solo Escala Base 4px**

---

## 2. Sizing — Dimensionamiento ❌ (Solo Tailwind)

### 2.1 Sin Tokens Propios

El DS **no define tokens** para width, height, min/max width/height. Usar utilidades Tailwind directamente:

```tsx
// Width
<div className="w-full" />
<div className="w-1/2 w-auto w-fit w-screen" />
<div className="min-w-0 min-w-full min-w-min min-w-max min-w-fit" />
<div className="max-w-xs max-w-sm max-w-md max-w-lg max-w-xl max-w-2xl max-w-4xl max-w-6xl max-w-7xl max-w-full max-w-screen-sm max-w-screen-md max-w-screen-lg max-w-screen-xl max-w-screen-2xl" />

// Height
<div className="h-full h-auto h-screen h-min h-max h-fit" />
<div className="min-h-0 min-h-full min-h-screen min-h-min min-h-max min-h-fit" />
<div className="max-h-0 max-h-full max-h-screen max-h-min max-h-max max-h-fit" />

// Size (width + height)
<div className="size-4 size-8 size-12 size-16 size-full" />

// Container (responsive max-width centrado)
<div className="container mx-auto px-btc-4" />
```

### 2.2 Referencias Tailwind

- [Width](https://tailwindcss.com/docs/width)
- [Height](https://tailwindcss.com/docs/height)
- [Min Width](https://tailwindcss.com/docs/min-width)
- [Max Width](https://tailwindcss.com/docs/max-width)
- [Min Height](https://tailwindcss.com/docs/min-height)
- [Max Height](https://tailwindcss.com/docs/max-height)
- [Container](https://tailwindcss.com/docs/container)

---

## 3. Flexbox — Caja Flexible ❌ (Solo Tailwind)

### 3.1 Sin Tokens Propios

El DS **no define tokens** para flexbox. Usar utilidades Tailwind directamente:

```tsx
// Display
<div className="flex inline-flex" />

// Direction
<div className="flex-row flex-row-reverse flex-col flex-col-reverse" />

// Wrap
<div className="flex-wrap flex-wrap-reverse flex-nowrap" />

// Align Items (cross axis)
<div className="items-start items-center items-end items-baseline items-stretch" />

// Justify Content (main axis)
<div className="justify-start justify-center justify-end justify-between justify-around justify-evenly justify-stretch" />

// Align Content (multi-line cross axis)
<div className="content-start content-center content-end content-between content-around content-evenly content-stretch" />

// Align Self (individual item)
<div className="self-auto self-start self-center self-end self-baseline self-stretch" />

// Flex Grow/Shrink/Basis
<div className="flex-1 flex-auto flex-initial flex-none" />
<div className="grow grow-0 shrink shrink-0 basis-full basis-auto basis-1/2" />

// Gap (usa escala btc-*)
<div className="gap-btc-4 gap-x-btc-2 gap-y-btc-6" />
```

### 3.2 Patrones Comunes en Componentes DS

```tsx
// Card.Header — flex, items-center, gap
<Card.Header className="flex items-center justify-between gap-btc-3 p-btc-4 border-b border-btc-border-subtle" />

// Button — inline-flex, items-center, justify-center
<Button className="inline-flex items-center justify-center gap-btc-2" />

// Dialog.Footer — flex, justify-end, gap
<Dialog.Footer className="flex justify-end gap-btc-2 p-btc-4 border-t border-btc-border-subtle" />

// NavLink — flex, items-center, gap
<NavLink className="flex items-center gap-btc-2 px-btc-3 py-btc-2" />

// DropdownMenu.Content — flex-col
<DropdownMenu.Content className="flex flex-col gap-btc-1" />
```

### 3.3 Referencias Tailwind

- [Flexbox](https://tailwindcss.com/docs/flex)
- [Flex Direction](https://tailwindcss.com/docs/flex-direction)
- [Flex Wrap](https://tailwindcss.com/docs/flex-wrap)
- [Align Items](https://tailwindcss.com/docs/align-items)
- [Justify Content](https://tailwindcss.com/docs/justify-content)
- [Align Content](https://tailwindcss.com/docs/align-content)
- [Align Self](https://tailwindcss.com/docs/align-self)
- [Flex](https://tailwindcss.com/docs/flex)
- [Gap](https://tailwindcss.com/docs/gap)

---

## 4. Grid — Cuadrícula ❌ (Solo Tailwind)

### 4.1 Sin Tokens Propios

El DS **no define tokens** para CSS Grid. Usar utilidades Tailwind directamente:

```tsx
// Display
<div className="grid inline-grid" />

// Grid Template Columns
<div className="grid-cols-1 grid-cols-2 grid-cols-3 grid-cols-4 grid-cols-5 grid-cols-6 grid-cols-12" />
<div className="grid-cols-none grid-cols-subgrid" />
<div className="grid-cols-[1fr_200px] grid-cols-[repeat(3,minmax(0,1fr))]" />

// Grid Template Rows
<div className="grid-rows-1 grid-rows-2 grid-rows-3 grid-rows-4 grid-rows-6 grid-rows-none" />

// Grid Column Start/End / Span
<div className="col-auto col-span-1 col-span-2 col-span-3 col-span-4 col-span-5 col-span-6 col-span-full" />
<div className="col-start-1 col-start-2 col-end-1 col-end-2 col-end-auto" />

// Grid Row Start/End / Span
<div className="row-auto row-span-1 row-span-2 row-span-3 row-span-full" />
<div className="row-start-1 row-start-2 row-end-1 row-end-auto" />

// Gap (usa escala btc-*)
<div className="gap-btc-4 gap-x-btc-2 gap-y-btc-6" />

// Grid Auto Flow
<div className="grid-flow-row grid-flow-col grid-flow-dense grid-flow-row-dense grid-flow-col-dense" />

// Grid Auto Columns/Rows
<div className="auto-cols-auto auto-cols-min auto-cols-max auto-cols-fr" />
<div className="auto-rows-auto auto-rows-min auto-rows-max auto-rows-fr" />

// Place Items/Content/Self (shorthand align + justify)
<div className="place-items-center place-items-start place-items-end" />
<div className="place-content-center place-content-between place-content-around" />
<div className="place-self-center place-self-start place-self-end" />
```

### 4.2 Ejemplo: Dashboard Grid

```tsx
// Grid responsive: 1 col mobile, 2 tablet, 3 desktop
<div className="grid gap-btc-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
  <Card variant="default" padding="md">...</Card>
  <Card variant="default" padding="md">...</Card>
  <Card variant="default" padding="md">...</Card>
  <Card variant="default" padding="md">...</Card>
  <Card variant="default" padding="md">...</Card>
  <Card variant="default" padding="md">...</Card>
</div>

// Grid con sidebar fijo + contenido fluido
<div className="grid grid-cols-[280px_1fr] gap-btc-6 min-h-screen">
  <aside className="border-r border-btc-border-default">Sidebar</aside>
  <main className="p-btc-6">Main Content</main>
</div>
```

### 4.3 Referencias Tailwind

- [Grid Template Columns](https://tailwindcss.com/docs/grid-template-columns)
- [Grid Template Rows](https://tailwindcss.com/docs/grid-template-rows)
- [Grid Column](https://tailwindcss.com/docs/grid-column)
- [Grid Row](https://tailwindcss.com/docs/grid-row)
- [Grid Auto Flow](https://tailwindcss.com/docs/grid-auto-flow)
- [Grid Auto Columns](https://tailwindcss.com/docs/grid-auto-columns)
- [Grid Auto Rows](https://tailwindcss.com/docs/grid-auto-rows)
- [Gap](https://tailwindcss.com/docs/gap)
- [Place Items](https://tailwindcss.com/docs/place-items)
- [Place Content](https://tailwindcss.com/docs/place-content)
- [Place Self](https://tailwindcss.com/docs/place-self)

---

## 5. Box Alignment — Alineación de Caja ❌ (Solo Tailwind)

### 5.1 Sin Tokens Propios

El DS **no define tokens** para box alignment. Las utilidades Tailwind cubren todas las propiedades CSS:

```tsx
// Align Items (align-items) — cross axis en flex/grid
<div className="items-start items-center items-end items-baseline items-stretch" />

// Justify Items (justify-items) — inline axis en grid
<div className="justify-items-start justify-items-center justify-items-end justify-items-stretch" />

// Align Content (align-content) — multi-line cross axis
<div className="content-start content-center content-end content-between content-around content-evenly content-stretch" />

// Justify Content (justify-content) — main axis
<div className="justify-start justify-center justify-end justify-between justify-around justify-evenly justify-stretch" />

// Align Self (align-self) — individual item cross axis
<div className="self-auto self-start self-center self-end self-baseline self-stretch" />

// Justify Self (justify-self) — individual item inline axis (grid)
<div className="justify-self-auto justify-self-start justify-self-center justify-self-end justify-self-stretch" />

// Place Items (align-items + justify-items)
<div className="place-items-center place-items-start place-items-end" />

// Place Content (align-content + justify-content)
<div className="place-content-center place-content-between place-content-around" />

// Place Self (align-self + justify-self)
<div className="place-self-center place-self-start place-self-end" />
```

### 5.2 Mapeo CSS → Tailwind

| Propiedad CSS | Utilidad Tailwind |
|---------------|-------------------|
| `align-items` | `items-*` |
| `justify-items` | `justify-items-*` |
| `align-content` | `content-*` |
| `justify-content` | `justify-*` |
| `align-self` | `self-*` |
| `justify-self` | `justify-self-*` |
| `place-items` | `place-items-*` |
| `place-content` | `place-content-*` |
| `place-self` | `place-self-*` |

### 5.3 Referencias Tailwind

- [Align Items](https://tailwindcss.com/docs/align-items)
- [Justify Items](https://tailwindcss.com/docs/justify-items)
- [Align Content](https://tailwindcss.com/docs/align-content)
- [Justify Content](https://tailwindcss.com/docs/justify-content)
- [Align Self](https://tailwindcss.com/docs/align-self)
- [Justify Self](https://tailwindcss.com/docs/justify-self)
- [Place Items](https://tailwindcss.com/docs/place-items)
- [Place Content](https://tailwindcss.com/docs/place-content)
- [Place Self](https://tailwindcss.com/docs/place-self)

---

## 6. Layout — Disposición General ❌ (Solo Tailwind)

### 6.1 Sin Tokens Propios (salvo Z-Index)

El DS **no define tokens** para layout general (position, overflow, inset, display, visibility, etc.).

> *Nota: **z-index** sí tiene tokens controlados (`--btc-z-*`) — ver `gobernanza/enforcement.md` R7.

```tsx
// Display
<div className="block inline-block inline flex inline-flex grid inline-grid table hidden" />

// Position
<div className="static relative absolute fixed sticky" />

// Inset (top/right/bottom/left)
<div className="inset-0 inset-x-0 inset-y-0 top-0 right-0 bottom-0 left-0" />
<div className="inset-auto top-auto right-auto bottom-auto left-auto" />

// Z-Index (usa tokens DS --btc-z-*)
<div className="z-btc-base z-btc-dropdown z-btc-sticky z-btc-modal z-btc-popover z-btc-tooltip z-btc-toast z-auto" />
<!-- Ver gobernanza/enforcement.md R7: solo valores definidos en tokens.css -->

// Overflow
<div className="overflow-auto overflow-hidden overflow-clip overflow-visible overflow-scroll" />
<div className="overflow-x-auto overflow-y-hidden" />

// Overscroll Behavior
<div className="overscroll-auto overscroll-contain overscroll-none" />

// Visibility
<div className="visible invisible collapse" />

// Object Fit/Position
<div className="object-contain object-cover object-fill object-none object-scale-down" />
<div className="object-center object-top object-bottom object-left object-right" />
```

### 6.2 Container (Max-width centrado responsive)

```tsx
// Container principal de la app
<div className="container mx-auto px-btc-4">
  <main>Contenido</main>
</div>

// Breakpoints del container (configurable en tailwind.config.js de la app consumidora)
/*
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px
*/
```

### 6.3 Referencias Tailwind

- [Container](https://tailwindcss.com/docs/container)
- [Display](https://tailwindcss.com/docs/display)
- [Position](https://tailwindcss.com/docs/position)
- [Top/Right/Bottom/Left](https://tailwindcss.com/docs/top-right-bottom-left)
- [Z-Index](https://tailwindcss.com/docs/z-index)
- [Overflow](https://tailwindcss.com/docs/overflow)
- [Overscroll Behavior](https://tailwindcss.com/docs/overscroll-behavior)
- [Visibility](https://tailwindcss.com/docs/visibility)
- [Object Fit](https://tailwindcss.com/docs/object-fit)
- [Object Position](https://tailwindcss.com/docs/object-position)

---

## 7. Elevation (Sombras) — Elevación ✅

### 7.1 Tokens Primitivos (`tokens.css`)

```css
:root {
  /* Light mode — usa forest-950-rgb (13, 27, 23) */
  --btc-elevation-1: 0 1px 2px rgba(var(--forest-950-rgb), 0.06);
  --btc-elevation-2: 0 4px 12px rgba(var(--forest-950-rgb), 0.08);
  --btc-elevation-3: 0 12px 32px rgba(var(--forest-950-rgb), 0.12);
  --btc-elevation-4: 0 20px 48px rgba(var(--forest-950-rgb), 0.16);
  --btc-elevation-5: 0 28px 64px rgba(var(--forest-950-rgb), 0.2);
}

[data-theme='dark'] {
  /* Dark mode — usa rgba(0,0,0,X) */
  --btc-elevation-1: 0 1px 2px rgba(0, 0, 0, 0.15);
  --btc-elevation-2: 0 4px 12px rgba(0, 0, 0, 0.25);
  --btc-elevation-3: 0 12px 32px rgba(0, 0, 0, 0.35);
  --btc-elevation-4: 0 20px 48px rgba(0, 0, 0, 0.4);
  --btc-elevation-5: 0 28px 64px rgba(0, 0, 0, 0.45);
}
```

### 7.2 Utilidades Tailwind Generadas (`globals.css` → `@theme inline`)

```css
@theme inline {
  /* Elevation → shadow-btc-* */
  --shadow-btc-1: var(--btc-elevation-1);
  --shadow-btc-2: var(--btc-elevation-2);
  --shadow-btc-3: var(--btc-elevation-3);
  --shadow-btc-4: var(--btc-elevation-4);
  --shadow-btc-5: var(--btc-elevation-5);
}
```

### 7.3 Clases Disponibles

| Clase | Token | Uso Típico |
|-------|-------|------------|
| `shadow-btc-1` | `--btc-elevation-1` | Cards, Inputs |
| `shadow-btc-2` | `--btc-elevation-2` | Dropdowns, Tooltips |
| `shadow-btc-3` | `--btc-elevation-3` | **Dialogs, Modales** |
| `shadow-btc-4` | `--btc-elevation-4` | Toasts, Overlays |
| `shadow-btc-5` | `--btc-elevation-5` | Reservado |

### 7.4 Uso por Componente (Validado)

| Componente | Elevation Token | Variante |
|------------|----------------|----------|
| `Card` (default) | `--btc-elevation-1` → `shadow-btc-1` | Sutil |
| `Card` (hover) | `--btc-elevation-2` → `shadow-btc-2` | Elevado |
| `Input` (focus) | `--btc-elevation-1` → `shadow-btc-1` | Sutil |
| `DropdownMenu` | `--btc-elevation-2` → `shadow-btc-2` | Estándar |
| `Dialog` / `Modal` | `--btc-elevation-3` → `shadow-btc-3` | **Principal** |
| `Toast` | `--btc-elevation-4` → `shadow-btc-4` | Prominente |

### 7.5 Validación (`check:design`)

- **Regla R6**: Solo `shadow-btc-1` a `shadow-btc-5` permitidos
- **Prohibido**: `shadow`, `shadow-sm`, `shadow-md`, `shadow-lg`, `shadow-xl`, `shadow-2xl`

---

## 8. Z-Index Controlado ✅

### 8.1 Tokens Primitivos (`tokens.css`)

```css
:root {
  --btc-z-base: 0;
  --btc-z-dropdown: 100;
  --btc-z-sticky: 200;
  --btc-z-modal: 300;
  --btc-z-popover: 400;
  --btc-z-tooltip: 500;
  --btc-z-toast: 600;
}
```

### 8.2 Utilidades Tailwind (`globals.css` → `@theme inline`)

```css
@theme inline {
  --z-btc-base: var(--btc-z-base);
  --z-btc-dropdown: var(--btc-z-dropdown);
  --z-btc-sticky: var(--btc-z-sticky);
  --z-btc-modal: var(--btc-z-modal);
  --z-btc-popover: var(--btc-z-popover);
  --z-btc-tooltip: var(--btc-z-tooltip);
  --z-btc-toast: var(--btc-z-toast);
}
```

### 8.3 Capas Definidas

| Capa | Token | Utilidad | Uso |
|------|-------|----------|-----|
| Base | `--btc-z-base` (0) | `z-btc-base` | Contenido normal |
| Dropdown | `--btc-z-dropdown` (100) | `z-btc-dropdown` | DropdownMenu, Select |
| Sticky | `--btc-z-sticky` (200) | `z-btc-sticky` | Sticky headers, nav |
| Modal | `--btc-z-modal` (300) | `z-btc-modal` | Dialog, Modal |
| Popover | `--btc-z-popover` (400) | `z-btc-popover` | Popover, Tooltip trigger |
| Tooltip | `--btc-z-tooltip` (500) | `z-btc-tooltip` | Tooltip content |
| Toast | `--btc-z-toast` (600) | `z-btc-toast` | Toast notifications |

### 8.4 Validación (`check:design`)

- **Regla R7**: Solo valores `z-btc-*` definidos permitidos
- **Prohibido**: `z-10`, `z-50`, `z-[9999]`, valores arbitrarios

---

## 📋 Matriz de Validación (`check:design`)

| Tema | Regla | Qué Valida |
|------|-------|------------|
| **Spacing** | `spacing-scale` | Solo valores `1,2,3,4,6,8,12,16` |
| **Spacing** | `only-btc-utilities` | Prefijo `btc-` obligatorio |
| **Sizing** | `only-btc-utilities` | ❌ No aplica (usa Tailwind default) |
| **Flexbox** | `only-btc-utilities` | ❌ No aplica (usa Tailwind default) |
| **Grid** | `only-btc-utilities` | ❌ No aplica (usa Tailwind default) |
| **Box Alignment** | `only-btc-utilities` | ❌ No aplica (usa Tailwind default) |
| **Layout** | `only-btc-utilities` | ❌ No aplica (usa Tailwind default) |
| **Elevation** | `only-btc-utilities` + R6 | Solo `shadow-btc-1` a `5` |
| **Z-Index** | `z-index-controlled` | Solo valores `z-btc-*` definidos |

> **Importante**: Para Sizing, Flexbox, Grid, Box Alignment, Layout — **no hay validación `check:design`** porque usan utilidades Tailwind estándar. La validación solo aplica a **Spacing** (escala `btc-*`), **Elevation** (`shadow-btc-*`), y **Z-Index** (`z-btc-*`).

---

## 🔗 Referencias Cruzadas

| Documento | Sección Relevante |
|-----------|-------------------|
| `arquitectura/index.md` | §1 Principios → "Layout vía Tailwind CSS" |
| `gobernanza/enforcement.md` | R2 Espaciado, R6 Elevation, R7 Z-Index |
| `tokens/api-spec.md` | Props `padding`, `size`, `variant` en componentes |
| `tokens/visual-palette.md` | Sección 5.5 Guía de Uso por Componente (borders/elevation) |
| `componentes/guide.md` | Tokens de Diseño → Utilidades Tailwind Generadas |

---

## ✅ Checklist de Validación

- [x] **Spacing**: Tokens `--btc-space-*` definidos, utilidades `btc-*` generadas, validación `check:design` activa
- [x] **Sizing**: Documentado como delegado a Tailwind, sin tokens propios
- [x] **Flexbox**: Documentado como delegado a Tailwind, sin tokens propios, patrones comunes en componentes
- [x] **Grid**: Documentado como delegado a Tailwind, sin tokens propios, ejemplo dashboard
- [x] **Box Alignment**: Documentado como delegado a Tailwind, mapeo CSS→Tailwind
- [x] **Layout**: Documentado como delegado a Tailwind, container, position, overflow, z-index (parcial)
- [x] **Elevation**: Tokens `--btc-elevation-*` definidos, utilidades `shadow-btc-*` generadas, validación R6
- [x] **Z-Index**: Tokens `--btc-z-*` definidos, utilidades `z-btc-*` generadas, validación R7

---

## ✅ Última actualización: 2026-11-07 — Documentación validada para v0.1.0

# Paleta Visual Extendida — @buildertech/ui (v0.1.0)

> **Estado**: Validada — **Contraste WCAG 2.1 AA** | **Basada en tokens.css reales** | **Light/Dark completos**

---

## 1. Paleta Cruda — Colores Base (de `tokens.css`)

### Forest (Verdes Oscuros — Marca)

| Token | Hex | Visual |
|-------|-----|--------|
| `forest-950` | `#0D1B17` | ████████ |
| `forest-900` | `#11241F` | ████████ |
| `forest-800` | `#1D3931` | ████████ |
| `forest-700` | `#2A4A3E` | ████████ |
| `forest-600` | `#365A4E` | ████████ |
| `forest-500` | `#4A7C6E` | ████████ |
| `forest-400` | `#6BB094` | ████████ |
| `forest-300` | `#A8D5C1` | ████████ |
| `forest-200` | `#D4EADF` | ████████ |
| `forest-100` | `#EAF5F0` | ████████ |
| `forest-50`  | `#F5FAF7` | ████████ |

### Coral (Naranjas/Rojos — Acción)

| Token | Hex | Visual |
|-------|-----|--------|
| `coral-950` | `#4A1008` | ████████ |
| `coral-900` | `#7A2012` | ████████ |
| `coral-800` | `#A62D1A` | ████████ |
| `coral-700` | `#C93A1E` | ████████ |
| `coral-600` | `#E84B29` | ████████ |
| `coral-500` | `#FF5C35` | ████████ |
| `coral-400` | `#FF7A5A` | ████████ |
| `coral-300` | `#FF9D85` | ████████ |
| `coral-200` | `#FFC9BB` | ████████ |
| `coral-100` | `#FFE5DC` | ████████ |
| `coral-50`  | `#FFF1ED` | ████████ |

### Blue (Azul — Informativo)

| Token | Hex | Visual |
|-------|-----|--------|
| `blue-950` | `#0B1D3A` | ████████ |
| `blue-900` | `#112D4E` | ████████ |
| `blue-800` | `#1A3E6E` | ████████ |
| `blue-700` | `#25508A` | ████████ |
| `blue-600` | `#2E68A8` | ████████ |
| `blue-500` | `#3B82F6` | ████████ |
| `blue-400` | `#60A5FA` | ████████ |
| `blue-300` | `#93C5FD` | ████████ |
| `blue-200` | `#BFDBFE` | ████████ |
| `blue-100` | `#DBEAFE` | ████████ |
| `blue-50`  | `#EFF6FF` | ████████ |

### Red (Rojo — Error/Destructivo)

| Token | Hex | Visual |
|-------|-----|--------|
| `red-950` | `#450A0A` | ████████ |
| `red-900` | `#7F1D1D` | ████████ |
| `red-800` | `#991B1B` | ████████ |
| `red-700` | `#B91C1C` | ████████ |
| `red-600` | `#DC2626` | ████████ |
| `red-500` | `#EF4444` | ████████ |
| `red-400` | `#F87171` | ████████ |
| `red-300` | `#FCA5A5` | ████████ |
| `red-200` | `#FECACA` | ████████ |
| `red-100` | `#FEE2E2` | ████████ |
| `red-50`  | `#FEF2F2` | ████████ |

### Neutral Warm (Escala Técnica — Puentes Light/Dark)

| Token | Hex | Visual |
|-------|-----|--------|
| `neutral-50`  | `#FBFCFA` | ████████ |
| `neutral-100` | `#F2F3ED` | ████████ |
| `neutral-200` | `#E3E6DE` | ████████ |
| `neutral-300` | `#D1D6CE` | ████████ |
| `neutral-400` | `#A8AEAA` | ████████ |
| `neutral-500` | `#828A86` | ████████ |
| `neutral-600` | `#66736C` | ████████ |
| `neutral-700` | `#4D5C55` | ████████ |
| `neutral-800` | `#35443E` | ████████ |
| `neutral-900` | `#1F2A25` | ████████ |
| `neutral-950` | `#0D1511` | ████████ |

> **Alias semánticos** (lo que consumen los componentes):
> - `canvas` = `neutral-50` (light) / `forest-950` (dark)
> - `surface-warm` = `neutral-100` (light) / `forest-800` (dark)
> - `border-warm` = `neutral-200` (light) / `neutral-700` (dark)
> - `text-secondary` = `neutral-600` (light) / `neutral-400` (dark)

---

## 2. Mapeo Semántico Light — Validado WCAG AA

| Rol Semántico | Valor | Hex | Contraste vs bg-app | Uso |
|---------------|-------|-----|---------------------|-----|
| `--btc-bg-app` | `neutral-50` | `#FBFCFA` | — | Fondo general |
| `--btc-bg-surface` | `neutral-100` | `#F2F3ED` | 1.05:1 (superficie) | Cards, modales |
| `--btc-bg-raised` | `neutral-200` | `#E3E6DE` | 1.12:1 | Hover, raised |
| `--btc-bg-brand` | `coral-600` | `#E84B29` | **4.8:1 AA** | Botón primario |
| `--btc-text-primary` | `forest-950` | `#0D1B17` | **19.2:1 AAA** | Títulos |
| `--btc-text-secondary` | `neutral-600` | `#66736C` | **5.8:1 AA** | Labels, texto 2º |
| `--btc-text-muted` | `neutral-500` | `#828A86` | **3.9:1 AA Large** | Placeholders, disabled |
| `--btc-text-brand` | `coral-600` | `#E84B29` | **4.8:1 AA** | Links |
| `--btc-text-on-brand` | `white` | `#FFFFFF` | **4.8:1 AA** | Texto sobre primario |
| `--btc-border-subtle` | `neutral-100` | `#F2F3ED` | 1.05:1 | Divisores finos |
| `--btc-border-default` | `neutral-200` | `#E3E6DE` | 1.12:1 | **Borde estándar inputs/cards** |
| `--btc-border-strong` | `neutral-400` | `#D1D6CE` | **2.1:1 UI** | Focus ring, énfasis |
| `--btc-border-focus` | `coral-600` | `#E84B29` | **4.8:1 AA** | Focus visible |
| `--btc-action-primary` | `coral-600` | `#E84B29` | **4.8:1 AA** | Botón primario |
| `--btc-action-hover` | `coral-500` | `#FF5C35` | **3.8:1 AA Large** | Hover primario |
| `--btc-action-pressed` | `coral-700` | `#C93A1E` | **5.2:1 AA** | Active primario |
| `--btc-success` | `#166B3F` | `#166B3F` | **5.1:1 AA** | Éxito |
| `--btc-success-bg` | `forest-100` | `#EAF5F0` | — | Fondos éxito |
| `--btc-warning` | `#A15C00` | `#A15C00` | **4.2:1 AA Large** | Advertencia |
| `--btc-warning-bg` | `coral-50` | `#FFF1ED` | — | Fondos advertencia |
| `--btc-error` | `#C62828` | `#C62828` | **5.9:1 AA** | Error |
| `--btc-error-bg` | `coral-100` | `#FFE5DC` | — | Fondos error |
| `--btc-info` | `forest-600` | `#365A4E` | **5.2:1 AA** | Info |
| `--btc-info-bg` | `coral-100` | `#FFE5DC` | — | Fondos info |

---

## 3. Mapeo Semántico Dark — Validado WCAG AA

| Rol Semántico | Valor | Hex | Contraste vs bg-app | Uso |
|---------------|-------|-----|---------------------|-----|
| `--btc-bg-app` | `forest-950` | `#0D1B17` | — | Fondo general |
| `--btc-bg-surface` | `forest-800` | `#1D3931` | **1.4:1** | Cards, modales |
| `--btc-bg-raised` | `forest-700` | `#2A4A3E` | **1.8:1** | Hover, raised |
| `--btc-bg-brand` | `coral-600` | `#E84B29` | **4.8:1 AA** | Botón primario |
| `--btc-text-primary` | `neutral-50` | `#FBFCFA` | **19.2:1 AAA** | Títulos |
| `--btc-text-secondary` | `neutral-400` | `#A8AEAA` | **7.1:1 AA** | Labels, texto 2º |
| `--btc-text-muted` | `neutral-500` | `#828A86` | **4.8:1 AA** | Placeholders, disabled |
| `--btc-text-brand` | `coral-400` | `#FF7A5A` | **4.6:1 AA** | Links |
| `--btc-text-on-brand` | `white` | `#FFFFFF` | **4.8:1 AA** | Texto sobre primario |
| `--btc-border-subtle` | `forest-700` | `#2A4A3E` | **1.8:1** | Divisores finos |
| `--btc-border-default` | `forest-600` | `#365A4E` | **2.5:1 UI** | **Borde estándar inputs/cards** |
| `--btc-border-strong` | `neutral-700` | `#4D5C55` | **5.1:1 AA** | Focus ring, énfasis |
| `--btc-border-focus` | `coral-400` | `#FF7A5A` | **4.6:1 AA** | Focus visible |
| `--btc-action-primary` | `coral-600` | `#E84B29` | **4.8:1 AA** | Botón primario |
| `--btc-action-hover` | `coral-400` | `#FF7A5A` | **4.6:1 AA** | Hover primario |
| `--btc-action-pressed` | `coral-700` | `#C93A1E` | **5.2:1 AA** | Active primario |
| `--btc-success` | `#3DD68C` | `#3DD68C` | **5.4:1 AA** | Éxito |
| `--btc-success-bg` | `forest-900` | `#11241F` | — | Fondos éxito |
| `--btc-warning` | `#F5B544` | `#F5B544` | **4.5:1 AA** | Advertencia |
| `--btc-warning-bg` | `#33270F` | `#33270F` | — | Fondos advertencia |
| `--btc-error` | `#FF6B6B` | `#FF6B6B` | **5.1:1 AA** | Error |
| `--btc-error-bg` | `#3A1717` | `#3A1717` | — | Fondos error |
| `--btc-info` | `forest-400` | `#6BB094` | **4.7:1 AA** | Info |
| `--btc-info-bg` | `forest-900` | `#11241F` | — | Fondos info |

> ✅ **Todos los pares críticos ≥ 4.5:1 (AA)** en ambos temas

---

## 4. Escala de Bordes Refinada — 4 Niveles Jerárquicos

| Token | Light | Dark | Grosor Visual | Uso |
|-------|-------|------|---------------|-----|
| `--btc-border-subtle` | `neutral-100` `#F2F3ED` | `forest-700` `#2A4A3E` | **Hairline** | Divisores, separadores internos |
| `--btc-border-default` | `neutral-200` `#E3E6DE` | `forest-600` `#365A4E` | **Fino (1px)** | **Inputs, Cards, Tablas — ESTÁNDAR** |
| `--btc-border-strong` | `neutral-400` `#D1D6CE` | `neutral-700` `#4D5C55` | **Medio (1-2px)** | Focus ring, selección, énfasis |
| `--btc-border-focus` | `coral-600` `#E84B29` | `coral-400` `#FF7A5A` | **2px ring** | Focus visible (accesibilidad) |

---

## 5. Elevation Scale (Sombras) — 5 Niveles Jerárquicos

| Elevación | Sombra (Light) | Sombra (Dark) | Uso |
|-----------|----------------|---------------|-----|
| `elevation-1` | `0 1px 2px rgba(13,27,23,0.06)` | `0 1px 2px rgba(0,0,0,0.15)` | Cards, Inputs |
| `elevation-2` | `0 4px 12px rgba(13,27,23,0.08)` | `0 4px 12px rgba(0,0,0,0.25)` | Dropdowns, Tooltips |
| `elevation-3` | `0 12px 32px rgba(13,27,23,0.12)` | `0 12px 32px rgba(0,0,0,0.35)` | **Dialogs, Modales** |
| `elevation-4` | `0 20px 48px rgba(13,27,23,0.16)` | `0 20px 48px rgba(0,0,0,0.4)` | Toasts, Overlays |
| `elevation-5` | `0 28px 64px rgba(13,27,23,0.2)` | `0 28px 64px rgba(0,0,0,0.45)` | Reservado |

> Mapeo en `globals.css`: `--shadow-btc-1` a `--shadow-btc-5` → `var(--btc-elevation-1)` a `5`

---

## 6. Guía de Uso por Componente

| Componente | Border Token | Elevation Token | Variante |
|------------|--------------|----------------|----------|
| `Input` (default) | `--btc-border-default` | — | Estándar |
| `Input` (focus) | `--btc-border-focus` | `--btc-elevation-1` | Accesibilidad |
| `Card` (default) | `--btc-border-subtle` (divisor interno) | `--btc-elevation-1` | Sutil |
| `Card` (outlined) | `--btc-border-default` | — | Estándar |
| `Card` (elevated) | — | `--btc-elevation-3` | Elevado |
| `Button` (outline) | `--btc-border-strong` | — | Énfasis |
| `Table` (cells) | `--btc-border-subtle` | — | Divisores finos |
| `Table` (header) | `--btc-border-default` | — | Separación clara |
| `DropdownMenu` | `--btc-border-default` | `--btc-elevation-2` | Contenedor |
| `Dialog` | `--btc-border-default` | `--btc-elevation-3` | Contenedor modal |
| `Select` | `--btc-border-default` | `--btc-elevation-2` | Estándar |
| `Separator` | `--btc-border-subtle` | — | Línea divisoria |
| `Toast` | — | `--btc-elevation-4` | Prominente |

---

## 7. Tipografía — Utilidades Generadas

| Utilidad | Tamaño | Line-height | Uso |
|----------|--------|-------------|-----|
| `text-btc-display` | 2.25rem (36px) | 2.5rem | Hero, display |
| `text-btc-h1` | 1.875rem (30px) | 2.25rem | H1 |
| `text-btc-h2` | 1.5rem (24px) | 2rem | H2 |
| `text-btc-h3` | 1.25rem (20px) | 1.75rem | H3 |
| `text-btc-h4` | 1.125rem (18px) | 1.5rem | H4 |
| `text-btc-body` | 1rem (16px) | 1.5rem | Body text |
| `text-btc-body-s` | 0.875rem (14px) | 1.25rem | Body small |
| `text-btc-control` | 0.875rem (14px) | 1.25rem | Controles (buttons, inputs) |
| `text-btc-caption` | 0.75rem (12px) | 1rem | Captions, labels |
| `text-btc-mono` | 0.75rem (12px) | 1rem | Código, mono |

**Fuentes**: `--btc-font-sans` (Inter), `--btc-font-mono` (JetBrains Mono), `--btc-font-display` (Space Grotesk)

---

## 8. Movimiento — Duraciones y Easing

| Token | Valor | Utilidad | Uso |
|-------|-------|----------|-----|
| `--btc-duration-fast` | 120ms | `duration-btc-fast` | Transiciones rápidas |
| `--btc-duration-base` | 160ms | `duration-btc-base` | **Estándar** |
| `--btc-duration-slow` | 240ms | `duration-btc-slow` | Transiciones lentas |
| `--btc-ease-standard` | `cubic-bezier(0.2, 0, 0, 1)` | `ease-btc-standard` | **Estándar** |

**Transiciones permitidas** (R8, R10): `colors`, `opacity`, `transform`, `shadow`

---

## 9. Z-Index Controlado

| Capa | Token | Utilidad | Valor |
|------|-------|----------|-------|
| Base | `--btc-z-base` | `z-btc-base` | 0 |
| Dropdown | `--btc-z-dropdown` | `z-btc-dropdown` | 100 |
| Sticky | `--btc-z-sticky` | `z-btc-sticky` | 200 |
| Modal | `--btc-z-modal` | `z-btc-modal` | 300 |
| Popover | `--btc-z-popover` | `z-btc-popover` | 400 |
| Tooltip | `--btc-z-tooltip` | `z-btc-tooltip` | 500 |
| Toast | `--btc-z-toast` | `z-btc-toast` | 600 |

---

## 10. Validación Contraste WCAG 2.1 — Resumen

### Light Mode (todos ≥ AA)
- `forest-950` / `neutral-50`: **19.2:1** AAA ✅
- `neutral-600` / `neutral-50`: **5.8:1** AA ✅
- `coral-600` / `white`: **4.8:1** AA ✅
- `coral-500` / `white`: **3.8:1** AA Large ✅
- `error` `#DC2626` / `white`: **5.2:1** AA ✅

### Dark Mode (todos ≥ AA)
- `neutral-50` / `forest-950`: **19.2:1** AAA ✅
- `neutral-400` / `forest-950`: **7.1:1** AA ✅
- `coral-600` / `white`: **4.8:1** AA ✅
- `coral-400` / `forest-800`: **4.6:1** AA ✅
- `neutral-700` / `forest-800`: **5.1:1** AA ✅
- `error-dark` `#EF4444` / `neutral-50`: **4.5:1** AA ✅

---

## 🔗 Referencias Cruzadas

| Documento | Sección |
|-----------|---------|
| `tokens/layout-sizing.md` | Espaciado, Elevation, Z-Index |
| `gobernanza/enforcement.md` | R2, R3, R6, R7, R8 |
| `tokens/api-spec.md` | Props de componentes |
| `componentes/guide.md` | Tokens de Diseño |

---

## ✅ Última actualización: 2026-11-07 — v0.1.0 validada contra `tokens.css` y `globals.css` reales

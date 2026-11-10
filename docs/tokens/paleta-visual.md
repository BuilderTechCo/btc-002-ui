# Paleta visual — color, contraste y uso

> **Versión**: 0.1.0 | **Fecha**: 2026-11-09 | **Estado**: Validado contra `src/styles/tokens.css` y `src/styles/globals.css`
>
> Los ratios de esta página están calculados con la fórmula de luminancia relativa de WCAG 2.1 sobre los hex reales del paquete. No se redondean "a favor": si un par no alcanza AA, se indica explícitamente.

---

## 1. Principios

- **Light y dark comparten primitivas**: la paleta cruda (`forest`, `coral`, `blue`, `red`, `neutral`) no cambia entre temas.
- **Los roles semánticos sí cambian**: `--btc-*` es la única capa que consumen los componentes.
- **El tema vive en `<html data-theme="...">`**: `Dialog`, `Toast` y `DropdownMenu` se portalean a `document.body` y necesitan heredar las variables desde la raíz.
- **El color de marca no es el color de acción por accidente**: `coral-600` se conserva como color de marca, pero no se usa como fondo de botón con texto blanco; el token de acción usa `coral-700` para cumplir contraste (§6).

---

## 2. Primitivas

### 2.1 Forest — verdes de marca

| Token        | Hex       |
| ------------ | --------- |
| `forest-950` | `#0D1B17` |
| `forest-900` | `#11241F` |
| `forest-800` | `#1D3931` |
| `forest-700` | `#2A4A3E` |
| `forest-600` | `#365A4E` |
| `forest-500` | `#4A7C6E` |
| `forest-400` | `#6BB094` |
| `forest-300` | `#A8D5C1` |
| `forest-200` | `#D4EADF` |
| `forest-100` | `#EAF5F0` |
| `forest-50`  | `#F5FAF7` |

### 2.2 Coral — acción y marca

| Token       | Hex       |
| ----------- | --------- |
| `coral-950` | `#4A1008` |
| `coral-900` | `#7A2012` |
| `coral-800` | `#A62D1A` |
| `coral-700` | `#C93A1E` |
| `coral-600` | `#E84B29` |
| `coral-500` | `#FF5C35` |
| `coral-400` | `#FF7A5A` |
| `coral-300` | `#FF9D85` |
| `coral-200` | `#FFC9BB` |
| `coral-100` | `#FFE5DC` |
| `coral-50`  | `#FFF1ED` |

### 2.3 Blue — información

| Token      | Hex       |
| ---------- | --------- |
| `blue-950` | `#0B1D3A` |
| `blue-900` | `#112D4E` |
| `blue-800` | `#1A3E6E` |
| `blue-700` | `#25508A` |
| `blue-600` | `#2E68A8` |
| `blue-500` | `#3B82F6` |
| `blue-400` | `#60A5FA` |
| `blue-300` | `#93C5FD` |
| `blue-200` | `#BFDBFE` |
| `blue-100` | `#DBEAFE` |
| `blue-50`  | `#EFF6FF` |

### 2.4 Red — error y destructivo

| Token     | Hex       |
| --------- | --------- |
| `red-950` | `#450A0A` |
| `red-900` | `#7F1D1D` |
| `red-800` | `#991B1B` |
| `red-700` | `#B91C1C` |
| `red-600` | `#DC2626` |
| `red-500` | `#EF4444` |
| `red-400` | `#F87171` |
| `red-300` | `#FCA5A5` |
| `red-200` | `#FECACA` |
| `red-100` | `#FEE2E2` |
| `red-50`  | `#FEF2F2` |

### 2.5 Neutral warm — puentes light/dark

| Token         | Hex       |
| ------------- | --------- |
| `neutral-50`  | `#FBFCFA` |
| `neutral-100` | `#F2F3ED` |
| `neutral-200` | `#E3E6DE` |
| `neutral-300` | `#D1D6CE` |
| `neutral-400` | `#A8AEAA` |
| `neutral-500` | `#828A86` |
| `neutral-600` | `#66736C` |
| `neutral-700` | `#4D5C55` |
| `neutral-800` | `#35443E` |
| `neutral-900` | `#1F2A25` |
| `neutral-950` | `#0D1511` |

---

## 3. Roles semánticos — tema claro

Todos los ratios se miden contra `--btc-bg-app` (`neutral-50`, `#FBFCFA`) salvo que se indique otra superficie.

| Token                  | Valor         | Hex       | Ratio vs app | Uso real                      | Estado               |
| ---------------------- | ------------- | --------- | -----------: | ----------------------------- | -------------------- |
| `--btc-bg-app`         | `neutral-50`  | `#FBFCFA` |            — | Fondo general                 | —                    |
| `--btc-bg-surface`     | `neutral-100` | `#F2F3ED` |       1.05:1 | Cards, inputs, modales        | No es texto          |
| `--btc-bg-raised`      | `neutral-200` | `#E3E6DE` |       1.23:1 | Hover, superficies elevadas   | No es texto          |
| `--btc-bg-brand`       | `coral-600`   | `#E84B29` |       3.73:1 | Fondo de marca, Badge default | No es texto          |
| `--btc-text-primary`   | `forest-950`  | `#0D1B17` |  **17.20:1** | Títulos y cuerpo              | ✅ AAA               |
| `--btc-text-secondary` | `neutral-600` | `#66736C` |   **4.82:1** | Labels y texto secundario     | ✅ AA                |
| `--btc-text-muted`     | `neutral-500` | `#828A86` |   **3.44:1** | Placeholders, disabled        | ⚠️ Solo texto grande |
| `--btc-text-brand`     | `coral-600`   | `#E84B29` |   **3.73:1** | Enlaces de marca              | ⚠️ Solo texto grande |
| `--btc-text-on-brand`  | `white`       | `#FFFFFF` |   **3.84:1** | Texto sobre coral-600         | ❌ AA normal         |
| `--btc-border-subtle`  | `neutral-100` | `#F2F3ED` |       1.05:1 | Divisores internos            | Decorativo           |
| `--btc-border-default` | `neutral-200` | `#E3E6DE` |       1.23:1 | Bordes estándar               | Ver §6.3             |
| `--btc-border-strong`  | `neutral-400` | `#A8AEAA` |       2.19:1 | Énfasis, Card outlined        | Decorativo           |
| `--btc-border-focus`   | `coral-600`   | `#E84B29` |   **3.73:1** | Focus visible                 | ✅ UI 3:1            |
| `--btc-action-primary` | `coral-700`   | `#C93A1E` |   **5.11:1** | Botón primario                | ✅ AA                |
| `--btc-action-hover`   | `coral-800`   | `#A62D1A` |   **6.97:1** | Hover del primario            | ✅ AA                |
| `--btc-action-pressed` | `coral-900`   | `#7A2012` |  **10.28:1** | Active del primario           | ✅ AA                |
| `--btc-success`        | `#166B3F`     | `#166B3F` |   **6.36:1** | Éxito                         | ✅ AA                |
| `--btc-success-bg`     | `forest-100`  | `#EAF5F0` |            — | Fondo de éxito                | No es texto          |
| `--btc-warning`        | `#A15C00`     | `#A15C00` |   **5.04:1** | Advertencia                   | ✅ AA                |
| `--btc-warning-bg`     | `coral-50`    | `#FFF1ED` |            — | Fondo de advertencia          | No es texto          |
| `--btc-error`          | `#C62828`     | `#C62828` |   **5.46:1** | Error                         | ✅ AA                |
| `--btc-error-bg`       | `coral-100`   | `#FFE5DC` |            — | Fondo de error                | No es texto          |
| `--btc-info`           | `blue-700`    | `#25508A` |   **7.87:1** | Información                   | ✅ AAA               |
| `--btc-info-bg`        | `blue-100`    | `#DBEAFE` |            — | Fondo informativo             | No es texto          |

> En superficies (`neutral-100`) los ratios de texto bajan: `text-secondary` 4.44:1, `text-muted` 3.17:1 y `text-brand` 3.44:1. `text-primary` sigue en 15.86:1.

---

## 4. Roles semánticos — tema oscuro

Todos los ratios se miden contra `--btc-bg-app` (`forest-950`, `#0D1B17`) salvo que se indique otra superficie.

| Token                  | Valor         | Hex       | Ratio vs app | Uso real                      | Estado       |
| ---------------------- | ------------- | --------- | -----------: | ----------------------------- | ------------ |
| `--btc-bg-app`         | `forest-950`  | `#0D1B17` |            — | Fondo general                 | —            |
| `--btc-bg-surface`     | `forest-800`  | `#1D3931` |       1.40:1 | Cards, inputs, modales        | No es texto  |
| `--btc-bg-raised`      | `forest-700`  | `#2A4A3E` |       1.81:1 | Hover, superficies elevadas   | No es texto  |
| `--btc-bg-brand`       | `coral-600`   | `#E84B29` |       4.61:1 | Fondo de marca, Badge default | No es texto  |
| `--btc-text-primary`   | `neutral-50`  | `#FBFCFA` |  **17.20:1** | Títulos y cuerpo              | ✅ AAA       |
| `--btc-text-secondary` | `neutral-400` | `#A8AEAA` |   **7.84:1** | Labels y texto secundario     | ✅ AAA       |
| `--btc-text-muted`     | `neutral-500` | `#828A86` |   **5.00:1** | Placeholders, disabled        | ✅ AA en app |
| `--btc-text-brand`     | `coral-400`   | `#FF7A5A` |   **6.90:1** | Enlaces de marca              | ✅ AA        |
| `--btc-text-on-brand`  | `white`       | `#FFFFFF` |   **3.84:1** | Texto sobre coral-600         | ❌ AA normal |
| `--btc-border-subtle`  | `forest-700`  | `#2A4A3E` |       1.81:1 | Divisores internos            | Decorativo   |
| `--btc-border-default` | `forest-600`  | `#365A4E` |       2.30:1 | Bordes estándar               | Ver §6.3     |
| `--btc-border-strong`  | `neutral-700` | `#4D5C55` |       1.77:1 | Énfasis, Card outlined        | Decorativo   |
| `--btc-border-focus`   | `coral-400`   | `#FF7A5A` |   **6.90:1** | Focus visible                 | ✅ UI 3:1    |
| `--btc-action-primary` | `coral-700`   | `#C93A1E` |   **5.11:1** | Botón primario                | ✅ AA        |
| `--btc-action-hover`   | `coral-800`   | `#A62D1A` |   **6.97:1** | Hover del primario            | ✅ AA        |
| `--btc-action-pressed` | `coral-900`   | `#7A2012` |  **10.28:1** | Active del primario           | ✅ AA        |
| `--btc-success`        | `#3DD68C`     | `#3DD68C` |   **9.44:1** | Éxito                         | ✅ AAA       |
| `--btc-success-bg`     | `forest-900`  | `#11241F` |            — | Fondo de éxito                | No es texto  |
| `--btc-warning`        | `#F5B544`     | `#F5B544` |   **9.76:1** | Advertencia                   | ✅ AAA       |
| `--btc-warning-bg`     | `#33270F`     | `#33270F` |            — | Fondo de advertencia          | No es texto  |
| `--btc-error`          | `#FF6B6B`     | `#FF6B6B` |   **6.38:1** | Error                         | ✅ AA        |
| `--btc-error-bg`       | `#3A1717`     | `#3A1717` |            — | Fondo de error                | No es texto  |
| `--btc-info`           | `blue-400`    | `#60A5FA` |   **6.96:1** | Información                   | ✅ AA        |
| `--btc-info-bg`        | `blue-900`    | `#112D4E` |            — | Fondo informativo             | No es texto  |

> En superficies (`forest-800`) los ratios de texto bajan: `text-secondary` 5.53:1, `text-brand` 4.87:1 y `text-muted` 3.53:1. `text-primary` sigue en 12.13:1.

---

## 5. Contraste texto/fondo

### 5.1 Texto sobre fondos de estado

Estos pares son los que usan `Badge` y los mensajes de estado. Todos pasan AA para texto normal.

| Par                                                    |  Ratio | Estado |
| :----------------------------------------------------- | -----: | :----- |
| `success` `#166B3F` / `success-bg` `#EAF5F0`           | 5.86:1 | ✅ AA  |
| `warning` `#A15C00` / `warning-bg` `#FFF1ED`           | 4.71:1 | ✅ AA  |
| `error` `#C62828` / `error-bg` `#FFE5DC`               | 4.68:1 | ✅ AA  |
| `info` `#25508A` / `info-bg` `#DBEAFE`                 | 6.64:1 | ✅ AA  |
| `success-dark` `#3DD68C` / `success-bg-dark` `#11241F` | 8.64:1 | ✅ AAA |
| `warning-dark` `#F5B544` / `warning-bg-dark` `#33270F` | 8.05:1 | ✅ AAA |
| `error-dark` `#FF6B6B` / `error-bg-dark` `#3A1717`     | 5.76:1 | ✅ AA  |
| `info-dark` `#60A5FA` / `info-bg-dark` `#112D4E`       | 5.47:1 | ✅ AA  |

### 5.2 Texto sobre acción primaria

| Combinación                |   Ratio | AA normal (4.5) | AA grande (3.0) |
| :------------------------- | ------: | :-------------: | :-------------: |
| `coral-600` / `white`      |  3.84:1 |       ❌        |       ✅        |
| `coral-500` / `white`      |  3.07:1 |       ❌        |       ✅        |
| `coral-400` / `white`      |  2.57:1 |       ❌        |       ❌        |
| `coral-700` / `white`      |  5.11:1 |       ✅        |       ✅        |
| `coral-800` / `white`      |  6.97:1 |       ✅        |       ✅        |
| `coral-900` / `white`      | 10.28:1 |       ✅        |       ✅        |
| `coral-600` / `forest-950` |  4.61:1 |       ✅        |       ✅        |
---

## 6. Estado WCAG y deuda conocida

### 6.1 Botón primario — **Resuelto** (v0.1.0)

El botón primario ahora usa `bg-btc-action-primary` (`coral-700` `#C93A1E`) con `text-btc-text-on-brand` (`white`):

- **5.11:1** ✅ cumple **WCAG AA** para texto normal (14–16 px).
- Estados actualizados:
  - Hover: `coral-800` → **6.97:1**
  - Pressed: `coral-900` → **10.28:1**
- La documentación registra una ejecución histórica de axe sin `color-contrast` en el botón primario. Axe no se volvió a ejecutar en la revisión del 2026-11-10; el resultado queda pendiente de revalidación.

> **Nota**: `coral-600` se conserva como primitiva de marca para acentos no textuales (Badges, enlaces de marca, bordes focus). El token semántico `--btc-brand` (alias de `coral-600`) sigue disponible para usos decorativos.
### 6.3 Texto atenuado y secundario

| Caso                                  |  Ratio | Lectura                                       |
| :------------------------------------ | -----: | :-------------------------------------------- |
| `text-secondary` light / `bg-app`     | 4.82:1 | ✅ AA                                         |
| `text-secondary` light / `bg-surface` | 4.44:1 | ⚠️ Marginal, por debajo de 4.5                |
| `text-muted` light / `bg-app`         | 3.44:1 | ⚠️ Solo texto grande; placeholders y disabled |
| `text-muted` light / `bg-surface`     | 3.17:1 | ⚠️ Solo texto grande                          |
| `text-muted` dark / `bg-app`          | 5.00:1 | ✅ AA                                         |
| `text-muted` dark / `bg-surface`      | 3.53:1 | ⚠️ Solo texto grande                          |

Los controles deshabilitados están exentos de 1.4.3, pero los placeholders no. Si se usan placeholders como única etiqueta, deben revisarse.

### 6.4 Bordes y contraste no textual

- `--btc-border-focus` pasa 3:1 tanto en light (3.73:1 sobre app, 3.44:1 sobre surface) como en dark (6.90:1 sobre app, 4.87:1 sobre surface). El focus visible es correcto.
- `--btc-border-default` (1.23:1 light, 1.62–2.30:1 dark) y `--btc-border-strong` (2.19:1 light, 1.77:1 dark) **no alcanzan 3:1**. Los divisores, Cards y separadores son decorativos y no están obligados; el borde de un `TextField`/`Select` sí identifica el control y requiere revisión manual de **WCAG 1.4.11**. axe no evalúa bordes.
- No se declara cumplimiento AA completo de componentes: la suite automatizada solo cubre las stories y el tema por defecto.

---

## 7. Escala de bordes

| Token                  | Light                   | Dark                    | Uso real                                  |
| ---------------------- | ----------------------- | ----------------------- | ----------------------------------------- |
| `--btc-border-subtle`  | `neutral-100` `#F2F3ED` | `forest-700` `#2A4A3E`  | Divisores internos de Card, Table, Select |
| `--btc-border-default` | `neutral-200` `#E3E6DE` | `forest-600` `#365A4E`  | Bordes estándar de Card, inputs y menús   |
| `--btc-border-strong`  | `neutral-400` `#A8AEAA` | `neutral-700` `#4D5C55` | Card outlined, énfasis                    |
| `--btc-border-focus`   | `coral-600` `#E84B29`   | `coral-400` `#FF7A5A`   | Anillo de focus (`ring-2`)                |

---

## 8. Elevación

| Token               | Light                            | Dark                          | Uso real                                       |
| ------------------- | -------------------------------- | ----------------------------- | ---------------------------------------------- |
| `--btc-elevation-1` | `0 1px 2px rgba(13,27,23,.06)`   | `0 1px 2px rgba(0,0,0,.15)`   | Reservado                                      |
| `--btc-elevation-2` | `0 4px 12px rgba(13,27,23,.08)`  | `0 4px 12px rgba(0,0,0,.25)`  | `Card` elevated, `DropdownMenu`                |
| `--btc-elevation-3` | `0 12px 32px rgba(13,27,23,.12)` | `0 12px 32px rgba(0,0,0,.35)` | `Select` listbox, `ErrorState`, `LoadingState` |
| `--btc-elevation-4` | `0 20px 48px rgba(13,27,23,.16)` | `0 20px 48px rgba(0,0,0,.4)`  | `Toast`                                        |
| `--btc-elevation-5` | `0 28px 64px rgba(13,27,23,.2)`  | `0 28px 64px rgba(0,0,0,.45)` | `Dialog`                                       |

Mapeo en `globals.css`: `--shadow-btc-1` … `--shadow-btc-5` → `var(--btc-elevation-1)` … `5`.

---

## 9. Tipografía

| Utilidad           | Tamaño          | Line-height | Uso               |
| ------------------ | --------------- | ----------- | ----------------- |
| `text-btc-display` | 2.25rem (36px)  | 2.5rem      | Hero, display     |
| `text-btc-h1`      | 1.875rem (30px) | 2.25rem     | H1                |
| `text-btc-h2`      | 1.5rem (24px)   | 2rem        | H2                |
| `text-btc-h3`      | 1.25rem (20px)  | 1.75rem     | H3                |
| `text-btc-h4`      | 1.125rem (18px) | 1.5rem      | H4                |
| `text-btc-body`    | 1rem (16px)     | 1.5rem      | Cuerpo            |
| `text-btc-body-s`  | 0.875rem (14px) | 1.25rem     | Cuerpo pequeño    |
| `text-btc-control` | 0.875rem (14px) | 1.25rem     | Botones e inputs  |
| `text-btc-caption` | 0.75rem (12px)  | 1rem        | Captions y labels |
| `text-btc-mono`    | 0.75rem (12px)  | 1rem        | Código            |

**Fuentes**:

- `--btc-font-sans` = Inter + fallback del sistema.
- `--btc-font-mono` = JetBrains Mono + fallback mono.
- `--btc-font-display` lo define `getFontDisplay()` (Space Grotesk), pero `globals.css` **no** lo mapea a una utilidad `font-btc-display`. Para usarlo, aplica el `variable` del helper en el layout y referencia `var(--btc-font-display)` en CSS.

---

## 10. Movimiento

| Token                 | Valor                        | Utilidad            | Uso                  |
| --------------------- | ---------------------------- | ------------------- | -------------------- |
| `--btc-duration-fast` | 120ms                        | `duration-btc-fast` | Transiciones rápidas |
| `--btc-duration-base` | 160ms                        | `duration-btc-base` | Estándar             |
| `--btc-duration-slow` | 240ms                        | `duration-btc-slow` | Transiciones lentas  |
| `--btc-ease-standard` | `cubic-bezier(0.2, 0, 0, 1)` | `ease-btc-standard` | Estándar             |

Transiciones permitidas por `transition-allowed`: `colors`, `opacity`, `transform`, `shadow`.

---

## 11. Z-index

| Capa     | Token              | Utilidad         | Valor |
| -------- | ------------------ | ---------------- | ----- |
| Base     | `--btc-z-base`     | `z-btc-base`     | 0     |
| Dropdown | `--btc-z-dropdown` | `z-btc-dropdown` | 100   |
| Sticky   | `--btc-z-sticky`   | `z-btc-sticky`   | 200   |
| Modal    | `--btc-z-modal`    | `z-btc-modal`    | 300   |
| Popover  | `--btc-z-popover`  | `z-btc-popover`  | 400   |
| Tooltip  | `--btc-z-tooltip`  | `z-btc-tooltip`  | 500   |
| Toast    | `--btc-z-toast`    | `z-btc-toast`    | 600   |

---

## 12. Resumen de cumplimiento

| Área                           | Estado                                          |
| :----------------------------- | :---------------------------------------------- |
| Texto principal en ambos temas | ✅ AAA (17.20:1 sobre app)                      |
| Texto secundario en app        | ✅ AA (4.82:1 light, 7.84:1 dark)               |
| Texto sobre fondos de estado   | ✅ AA en ambos temas                            |
| Focus visible                  | ✅ 3:1 en ambos temas                           |
| Botón primario                 | ✅ 5.11:1 (coral-700 con blanco)                |
| Hover del primario             | ✅ 6.97:1 (coral-800 con blanco)                |
| Enlaces de marca en light      | ⚠️ 3.73:1; usar coral-700 o texto grande        |
| Texto atenuado en superficies  | ⚠️ 3.17–3.53:1; solo texto grande o no esencial |
| Bordes de inputs (no textual)  | ⚠️ Pendiente de revisión 1.4.11                 |

> Los ratios anteriores son cálculos de paleta, no una ejecución de axe. La última ejecución de Storybook/axe no se repitió en la revisión del 2026-11-10.

---

## 🔗 Referencias cruzadas

| Documento                                 | Sección                                                                               |
| :---------------------------------------- | :------------------------------------------------------------------------------------ |
| `tokens/dimensiones-disposicion.md`                 | Spacing, elevation, z-index                                                           |
| `gobernanza/cumplimiento.md`               | `only-btc-color-tokens`, `shadow-defined`, `z-index-controlled`, `transition-allowed` |
| `tokens/especificacion-api.md`                      | Props de componentes y deuda a11y                                                     |
| `componentes/guia.md`                    | Uso de tokens en componentes                                                          |
| `adrs/009-storybook-validacion-visual.md` | Violación axe y contexto de la suite                                                  |

---

## ✅ Última actualización: 2026-11-09 — ratios recalculados contra `tokens.css`; deuda AA documentada sin modificar la paleta

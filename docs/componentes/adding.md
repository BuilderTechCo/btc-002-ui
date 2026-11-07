# Añadir un Componente — @buildertech/ui

> **Proceso obligatorio** para contribuir un nuevo componente al paquete.
> **Versión**: 0.1.0 | **Fecha**: 2026-11-07

---

## 📋 Checklist Pre-Implementación

- [ ] **Issue creado** tipo `feature_request` con: caso de uso, props propuestas, variantes, accesibilidad
- [ ] **DS Owner aprobado** — sin aprobación no se mergea
- [ ] **No duplica** componente existente (ver `src/components/`)
- [ ] **Es presentacional** — sin lógica de negocio (ver `gobernanza/enforcement.md` R11)

---

## 🏗️ Estructura de Archivos Requerida

```
src/components/mi-componente/
├── mi-componente.tsx    # Implementación principal
└── index.ts             # Barrel export
```

> **Nota**: NO crear `.types.ts` ni `.test.ts` separados — tests viven en `src/components/` (integration) o `src/lib/` (unit), tipos en el mismo `.tsx`.

---

## 📝 Template de Componente Base

```tsx
// src/components/mi-componente/mi-componente.tsx
'use client';

import { forwardRef } from 'react';
import { clsx } from '@/lib/classnames';
import type { HTMLAttributes, ForwardRefExoticComponent, RefAttributes } from 'react';

export interface MiComponenteProps extends HTMLAttributes<HTMLDivElement> {
  /** Variante visual */
  variant?: 'default' | 'outlined' | 'elevated';
  /** Tamaño */
  size?: 'sm' | 'md' | 'lg';
  /** Estado deshabilitado */
  disabled?: boolean;
}

const MiComponenteRoot = forwardRef<HTMLDivElement, MiComponenteProps>(
  ({ variant = 'default', size = 'md', disabled, className, children, ...props }, ref) => {
    const baseStyles = clsx(
      'inline-flex items-center justify-center font-medium transition-colors duration-btc-base ease-btc-standard',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-btc-border-focus focus-visible:ring-offset-2',
      disabled && 'opacity-50 pointer-events-none cursor-not-allowed',
      {
        // Variant styles — SOLO utilidades btc-*
        'bg-btc-brand text-btc-on-brand hover:bg-btc-action-hover active:bg-btc-action-pressed':
          variant === 'default',
        'border border-btc-border-strong bg-transparent text-btc-text-primary hover:bg-btc-raised':
          variant === 'outlined',
        'bg-btc-surface shadow-btc-3 border border-btc-border-default':
          variant === 'elevated',
      },
      {
        // Size styles
        'h-8 px-3 text-btc-caption': size === 'sm',
        'h-10 px-4 text-btc-control': size === 'md',
        'h-12 px-6 text-btc-body': size === 'lg',
      },
      className
    );

    return (
      <div
        ref={ref}
        className={baseStyles}
        aria-disabled={disabled}
        {...props}
      >
        {children}
      </div>
    );
  }
);

MiComponenteRoot.displayName = 'MiComponente';

export const MiComponente = MiComponenteRoot as ForwardRefExoticComponent<
  RefAttributes<HTMLDivElement> & MiComponenteProps
>;
```

```ts
// src/components/mi-componente/index.ts
export { MiComponente } from './mi-componente';
export type { MiComponenteProps } from './mi-componente';
```

---

## 📦 Registrar en Barrel Principal

```ts
// src/index.ts — AÑADIR AL FINAL
export { MiComponente } from './components/mi-componente';
export type { MiComponenteProps } from './components/mi-componente';
```

---

## ✅ Validaciones Obligatorias (Pre-Commit + CI)

### 1. `check:design` — Debe pasar sin errores
```bash
pnpm --filter @buildertech/ui check:design --scan-dirs=src/components/mi-componente
```
- Solo utilidades `btc-*` (R1)
- Espaciado escala base 4px (R2)
- Radios definidos (R3)
- Solo transiciones permitidas (R8)
- No `!important` (R9)
- No lógica negocio (R10)

### 2. TypeScript — Sin errores
```bash
pnpm --filter @buildertech/ui typecheck
```

### 3. Lint — Sin warnings (ESLint v9 flat config)
```bash
pnpm --filter @buildertech/ui lint
```
> **Config**: `eslint.config.js` (flat config) con `@eslint/js`, `typescript-eslint`, `eslint-plugin-react`, `eslint-plugin-react-hooks`, `eslint-plugin-jsx-a11y`, `eslint-config-prettier`.

### 4. Accesibilidad — Mínimo requerido
- [ ] `forwardRef` en componente raíz
- [ ] `displayName` para debugging
- [ ] Props extendidas de elemento HTML nativo (`HTMLAttributes<HTMLElement>`)
- [ ] `aria-disabled` / `aria-invalid` / `aria-label` según corresponda
- [ ] Focus visible: `focus-visible:ring-2 focus-visible:ring-btc-border-focus`
- [ ] Contraste WCAG AA en todas las variantes (ver `tokens/visual-palette.md`)
- [ ] Semántica HTML correcta (`<button>`, `<label>`, `<hr>`, `<dialog>`, etc.)

### 5. Tests Visuales — Playwright (requiere Storybook local)
```ts
// e2e/visual/mi-componente.visual.spec.ts
import { test, expect } from '@playwright/test';

test.describe('MiComponente visual regression', () => {
  const variants = ['default', 'outlined', 'elevated'];
  const sizes = ['sm', 'md', 'lg'];

  for (const variant of variants) {
    for (const size of sizes) {
      test(`${variant}-${size} light`, async ({ page }) => {
        await page.goto('/test/mi-componente', { waitUntil: 'networkidle' });
        await page.evaluate(([v, s]) => {
          document.documentElement.setAttribute('data-theme', 'light');
          // Render variante/tamaño específico
        }, [variant, size]);
        await expect(page.locator('[data-testid="mi-componente"]')).toHaveScreenshot(
          `mi-componente-${variant}-${size}-light.png`,
          { maxDiffPixels: 100 }
        );
      });

      test(`${variant}-${size} dark`, async ({ page }) => {
        await page.goto('/test/mi-componente', { waitUntil: 'networkidle' });
        await page.evaluate(([v, s]) => {
          document.documentElement.setAttribute('data-theme', 'dark');
        }, [variant, size]);
        await expect(page.locator('[data-testid="mi-componente"]')).toHaveScreenshot(
          `mi-componente-${variant}-${size}-dark.png`,
          { maxDiffPixels: 100 }
        );
      });
    }
  }
});
```

> **Nota**: `test:visual` se ejecuta por separado con `pnpm test:visual` (requiere Storybook local corriendo). No está en `quality:verify`.

---

## 📚 Documentación Requerida

### 1. Actualizar `tokens/api-spec.md`
Añadir sección con:
- Interface de props completa
- Tabla de props (tipo, default, descripción)
- Variantes/tamaños con clases CSS
- Ejemplos de uso

### 2. Actualizar `componentes/guide.md`
Añadir a tabla de componentes + ejemplo en sección "Uso de Componentes"

### 3. Actualizar `CHANGELOG.md` (root)
```markdown
## [0.1.x] - 2026-XX-XX

### Agregado
- **MiComponente**: Descripción breve (Issue #XX, PR #XX)
```

---

## 🔍 Patrones Comunes por Tipo

### Compound Components (Card, DropdownMenu, Table)
```tsx
export const MiComponente = Object.assign(MiComponenteRoot, {
  Header: MiComponenteHeader,
  Title: MiComponenteTitle,
  Content: MiComponenteContent,
  // ...
});
```

### Props-Based Controlado (Dialog, Select)
```tsx
interface MiComponenteProps {
  open: boolean;
  onClose: () => void;
  // ...
}
```

### Data-Driven (Table)
```tsx
interface MiComponenteProps<T> {
  columns: MiColumna<T>[];
  data: T[];
  rowKey: keyof T | ((row: T) => string);
  // ...
}
```

### Primitive Wrapper (Label, Separator, Slot)
```tsx
// Extiende elemento HTML nativo
interface MiComponenteProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  // props extra
}
```

---

## 🚫 Errores Comunes a Evitar

| Error | Consecuencia |
|-------|--------------|
| Usar `class-variance-authority` | Lint error — usar `clsx` |
| Hardcodear `p-4`, `rounded-md`, `shadow-lg` | `check:design` error — usar `btc-*` |
| Importar `fetch`/`supabase`/`prisma`/`axios` | `check:design` error R10 |
| Sin `forwardRef` | TypeScript warning, refs rotas |
| Sin `displayName` | Debugging imposible en React DevTools |
| Variantes sin contraste AA | Accesibilidad falla, DS Owner rechaza |
| Tests en `packages/ui/src/__tests__` | ADR-001 violado — tests en `src/components/` o `src/lib/` |
| Interfaces vacías (`interface Props {}`) | Warning `@typescript-eslint/no-empty-object-type` — usar `type Props = ...` |
| Extender `ButtonHTMLAttributes` sin `Omit` para `onChange` | Conflicto de tipos en componentes con `onChange` propio |
| Ref forwarding genérico complejo | TypeScript errors — simplificar con `ComponentPropsWithRef` |

---

## 📋 Referencias

- `arquitectura/index.md` §3 — Convenciones de código
- `gobernanza/enforcement.md` — Reglas R1-R11
- `tokens/api-spec.md` — API reference de componentes existentes
- `tokens/visual-palette.md` — Colores y contraste
- `guias/contributing.md` — Checklist completo PR

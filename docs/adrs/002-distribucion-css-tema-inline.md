# ADR-002: Distribución CSS vía @theme inline

**Estado**: Aceptado | **Fecha**: 2026-11-01

---

## Contexto

Tailwind v4 introduce `@theme inline` para definir tokens CSS que se convierten en utilidades. Necesitamos distribuir los tokens del DS (`--btc-*`) como utilidades `btc-*` a apps consumidoras sin configuración extra.

## Decisión

**Usar `@theme inline` en `src/styles/globals.css`** para mapear variables CSS `--btc-*` → utilidades Tailwind `btc-*`.

```css
/* src/styles/globals.css */
@import "./tokens.css";

@theme inline {
  /* Colors */
  --color-btc-brand: var(--btc-bg-brand);
  --color-btc-surface: var(--btc-bg-surface);
  --color-btc-raised: var(--btc-bg-raised);
  --color-btc-text-primary: var(--btc-text-primary);
  --color-btc-text-secondary: var(--btc-text-secondary);
  --color-btc-text-muted: var(--btc-text-muted);
  --color-btc-text-brand: var(--btc-text-brand);
  --color-btc-text-on-brand: var(--btc-text-on-brand);
  --color-btc-border-subtle: var(--btc-border-subtle);
  --color-btc-border-default: var(--btc-border-default);
  --color-btc-border-strong: var(--btc-border-strong);
  --color-btc-border-focus: var(--btc-border-focus);
  --color-btc-action-primary: var(--btc-action-primary);
  --color-btc-action-hover: var(--btc-action-hover);
  --color-btc-action-pressed: var(--btc-action-pressed);
  --color-btc-success: var(--btc-success);
  --color-btc-success-bg: var(--btc-success-bg);
  --color-btc-warning: var(--btc-warning);
  --color-btc-warning-bg: var(--btc-warning-bg);
  --color-btc-error: var(--btc-error);
  --color-btc-error-bg: var(--btc-error-bg);
  --color-btc-info: var(--btc-info);
  --color-btc-info-bg: var(--btc-info-bg);

  /* Spacing */
  --spacing-btc-0: var(--btc-space-0);
  --spacing-btc-1: var(--btc-space-1);
  --spacing-btc-2: var(--btc-space-2);
  --spacing-btc-3: var(--btc-space-3);
  --spacing-btc-4: var(--btc-space-4);
  --spacing-btc-6: var(--btc-space-6);
  --spacing-btc-8: var(--btc-space-8);
  --spacing-btc-12: var(--btc-space-12);
  --spacing-btc-16: var(--btc-space-16);

  /* Radius */
  --radius-btc-xs: var(--btc-radius-xs);
  --radius-btc-sm: var(--btc-radius-sm);
  --radius-btc-md: var(--btc-radius-md);
  --radius-btc-lg: var(--btc-radius-lg);
  --radius-btc-xl: var(--btc-radius-xl);
  --radius-btc-2xl: var(--btc-radius-2xl);
  --radius-btc-full: var(--btc-radius-full);

  /* Elevation (Sombras) */
  --shadow-btc-1: var(--btc-elevation-1);
  --shadow-btc-2: var(--btc-elevation-2);
  --shadow-btc-3: var(--btc-elevation-3);
  --shadow-btc-4: var(--btc-elevation-4);
  --shadow-btc-5: var(--btc-elevation-5);

  /* Z-Index */
  --z-btc-base: var(--btc-z-base);
  --z-btc-dropdown: var(--btc-z-dropdown);
  --z-btc-sticky: var(--btc-z-sticky);
  --z-btc-modal: var(--btc-z-modal);
  --z-btc-popover: var(--btc-z-popover);
  --z-btc-tooltip: var(--btc-z-tooltip);
  --z-btc-toast: var(--btc-z-toast);

  /* Tipografía */
  --font-btc-sans: var(--btc-font-sans);
  --font-btc-mono: var(--btc-font-mono);
  /* --btc-font-display se aplica vía var(); no hay utilidad font-btc-display */

  /* Transiciones */
  --duration-btc-fast: var(--btc-duration-fast);
  --duration-btc-base: var(--btc-duration-base);
  --duration-btc-slow: var(--btc-duration-slow);
  --ease-btc-standard: var(--btc-ease-standard);
}
```

## Consecuencias

### Positivas

- Zero-config para apps consumidoras: solo `@import "@buildertechco/ui/styles/globals.css"`
- Tree-shaking automático: solo utilidades usadas se incluyen en build
- Tipos TypeScript generados automáticamente por Tailwind v4
- Single source of truth: tokens en `tokens.css`, mapeo en `globals.css`

### Negativas

- Requiere Tailwind v4+ en apps consumidoras
- En Tailwind v4, la app debe añadir `@source "../node_modules/@buildertechco/ui/dist";` para que detecte las clases del paquete

---

## Referencias

- `arquitectura/indice.md` §1 Principio 3
- `tokens/dimensiones-disposicion.md` — Utilidades generadas
- Tailwind v4 docs: https://tailwindcss.com/docs/theme

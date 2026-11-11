# ADR-009: Storybook 8 como catálogo vivo y validación visual

**Estado**: Aceptado | **Fecha**: 2026-11-09

---

## Contexto

El paquete no tenía un catálogo navegable de componentes. La validación se repartía entre tests de contrato (clases CSS), tests de integración en jsdom y regresión visual Playwright, pero faltaba:

- Un lugar único para revisar props, variantes y estados.
- Inspección visual con controles y acciones.
- Validación de accesibilidad por story.
- Ejecución de las stories en un navegador real, no solo en jsdom.

Se necesitaba una herramienta que no duplicara la suite visual ni sustituyera los tests existentes.

## Decisión

**Storybook 8.6.19** como catálogo vivo y entorno de validación, con **Vitest browser mode** para ejecutar las stories en Chromium.

### Addons

| Addon                                | Uso                                                                  |
| :----------------------------------- | :------------------------------------------------------------------- |
| `@storybook/addon-essentials`        | Controls, Actions, Viewport, Backgrounds, Measure, Outline, Toolbars |
| `@storybook/addon-links`             | Enlaces entre stories                                                |
| `@storybook/addon-a11y`              | Auditoría axe por story                                              |
| `@storybook/experimental-addon-test` | Panel de component tests + plugin de Vitest                          |

### Configuración

`.storybook/main.ts`:

```ts
stories: ["../src/components/**/*.stories.@(ts|tsx)"],
addons: [
  "@storybook/addon-essentials",
  "@storybook/addon-links",
  "@storybook/addon-a11y",
  "@storybook/experimental-addon-test",
],
framework: "@storybook/react-vite",
viteFinal: (config) => {
  config.plugins?.push(tailwindcss());
  return config;
}
```

`.storybook/preview.tsx`:

- Tema global light/dark aplicado en `<html data-theme="...">` y en el contenedor de la story.
- `parameters.viewport.viewports` y `parameters.backgrounds.values` (API legacy de Storybook 8; no usar `options` sin actualizar Storybook).
- Viewports: Mobile 360×800, Tablet 768×1024, Laptop 1024×768, Desktop 1440×900.
- Backgrounds: `light`, `surface`, `raised`, todos resueltos con tokens `--btc-*`.
- Decorador global con `width: 100%`, `maxWidth` 1024 (centered) / 1280 (padded) y centrado horizontal.
- `layout: "centered"` por defecto y `tags: ["autodocs"]`.

`.storybook/preview-head.html`:

- Precarga Inter desde Google Fonts para reducir diferencias de render.
- Fuerza `#storybook-root { width: 100%; flex: 1 1 auto; }` para que `layout: centered` no colapse componentes anchos (Select, Table).
- `-webkit-font-smoothing: antialiased` y `-moz-osx-font-smoothing: grayscale`.

### Vitest browser mode

El proyecto `storybook` de `vitest.workspace.ts`:

```ts
{
  plugins: [storybookTest({ configDir: path.join(dirname, ".storybook") })],
  test: {
    name: "storybook",
    browser: {
      enabled: true,
      headless: true,
      name: "chromium",
      provider: "playwright",
    },
    setupFiles: ["./.storybook/vitest.setup.ts"],
  },
}
```

**No extiende `vitest.config.ts`**: el plugin de Storybook construye su propia configuración de Vite desde `.storybook/main.ts` y genera el `include` a partir del índice de stories. Extender la config base provoca un warning de `test.include` duplicado.

`.storybook/vitest.setup.ts` aplica las anotaciones del preview (`setProjectAnnotations`) y ejecuta `beforeAll`.

### Requisitos

- Chromium de Playwright instalado: `pnpm exec playwright install chromium`.
- Versión resuelta actual: Playwright **1.65.0** → Chromium **1254** en `~/.cache/ms-playwright/chromium-1254` y `chromium_headless_shell-1254`.
- El puerto `6006` debe estar libre para `pnpm storybook`; Storybook falla o sirve una instancia vieja si el puerto está ocupado.

## Comandos

```bash
pnpm storybook           # catálogo en http://127.0.0.1:6006 (auto-open)
pnpm build-storybook     # build estático en storybook-static/
pnpm test:storybook      # stories en Chromium (21 archivos / 251 tests)
```

## Resultado

- Catálogo de **21 stories**.
- **251 tests** de stories en Chromium en la ejecución registrada al aceptar este ADR (2026-11-09). Es una cifra histórica; el valor posterior de 255 citado en la documentación aún requiere revalidación.
- Panel de accesibilidad con axe y panel de component tests operativos.
- Toolbar verificada: viewports, backgrounds, tema, measure, outline y simulador de visión.
- El contenedor ya no colapsa: en viewport 1440 el root mide 1140px y el contenido 1024px.

### Accesibilidad

La ejecución histórica de la suite registrada al aceptar este ADR reportó **1 violación** `color-contrast` (serious) en el botón primario:

- `--btc-bg-brand` = `coral-600` `#E84B29` con texto blanco = **3.84:1**.
- No alcanza AA para texto normal (4.5:1).
- En esa fecha era deuda conocida y no se corrigió la paleta como parte de este ADR. La paleta actual usa `coral-700` para el botón primario (5.11:1); axe no se reejecutó en la revisión del 2026-11-10.

## Consecuencias

### Positivas

- Catálogo navegable, con controles y acciones por story.
- A11y visible durante el desarrollo, no solo en un informe.
- Las stories se ejecutan en Chromium, además de jsdom.
- Menos dependencia de inspección manual para regresiones básicas.

### Negativas

- Añade dependencias de Storybook y Playwright.
- `test:storybook` requiere Chromium y no forma parte de `quality:verify`.
- La API legacy de viewport/backgrounds de Storybook 8 debe revisarse al actualizar de major.
- El `preview-head.html` depende de Google Fonts para la consistencia tipográfica.

## Referencias

- `.storybook/main.ts`
- `.storybook/preview.tsx`
- `.storybook/preview-head.html`
- `.storybook/vitest.setup.ts`
- `vitest.workspace.ts`
- `docs/arquitectura/indice.md` §5
- `docs/adrs/005-pruebas-sin-dom.md`
- `docs/adrs/006-playwright-regresion-visual.md`
- `docs/tokens/paleta-visual.md` §6

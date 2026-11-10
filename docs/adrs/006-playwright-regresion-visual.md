# ADR-006: Playwright Visual Regression 4×2

**Estado**: Aceptado | **Fecha**: 2026-11-03 | **Actualizado**: 2026-11-09

---

## Contexto

Los tests de contrato y de integración validan clases, comportamiento y accesibilidad, pero no el render visual real. Se necesita regresión visual que cubra responsive y theming.

## Decisión

**Playwright Visual Regression con 8 proyectos** (4 viewports × 2 temas):

| Viewport  |  Ancho |   Alto |
| :-------- | -----: | -----: |
| `mobile`  |  360px |  800px |
| `tablet`  |  768px | 1024px |
| `laptop`  | 1024px | 1024px |
| `desktop` | 1440px | 1024px |

| Tema    | Atributo                    |
| :------ | :-------------------------- |
| `light` | `<html data-theme="light">` |
| `dark`  | `<html data-theme="dark">`  |

**Proyectos**: `light-mobile`, `dark-mobile`, `light-tablet`, `dark-tablet`, `light-laptop`, `dark-laptop`, `light-desktop`, `dark-desktop`.

**Baselines**: 22 specs y **3285 PNGs** en `e2e/visual/snapshots/`, excluidos vía `.git/info/exclude`.

**Umbral** (`playwright.config.ts`):

```ts
expect: {
  toHaveScreenshot: {
    maxDiffPixels: 0,
    maxDiffPixelRatio: 0.001,
    threshold: 0.2,
    animations: 'disabled',
    caret: 'hide',
    scale: 'css',
  },
}
```

**Servidor**: en local, `webServer` arranca Storybook en `http://localhost:6006` y reutiliza una instancia existente. En CI (`process.env.CI`) el `webServer` se desactiva y el entorno debe proporcionar el servidor.

**Actualización de snapshots**: solo DS Owner con aprobación.

```bash
pnpm test:visual --update-snapshots
```

## Consecuencias

### Positivas

- Cobertura real de responsive + light/dark.
- Detecta regresiones de layout, subpixel, antialiasing y fuentes.
- Usa Chromium real, sin jsdom.

### Negativas

- Requiere Storybook/Chromium y es más lento que unit/integration.
- Sensible a fuentes y entorno; los snapshots deben regenerarse en el entorno acordado.
- No está en `quality:verify` para no bloquear validaciones sin navegador.

## Implementación

- Specs en `e2e/visual/*.visual.spec.ts` (22).
- Config en `playwright.config.ts` (raíz).
- `test:visual` ejecuta `playwright test`.
- Estado actual: los snapshots existen (3285); la suite visual no forma parte del pipeline base y debe ejecutarse antes de un release.

---

## Referencias

- `docs/arquitectura/indice.md` §5 — Capas de testing
- `docs/componentes/navegadores-compatibles.md` — Viewports y browsers
- `docs/guias/contribuir.md` — Visual regression
- `README.md` § Testing

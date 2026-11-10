# ADR-006: Playwright Visual Regression 4×2

**Estado**: Aceptado | **Fecha**: 2026-11-03 | **Actualizado**: 2026-11-10

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

**Baselines locales**: existen **3285 PNGs** en `e2e/visual/snapshots/` en el entorno de trabajo auditado. No están versionados; `.git/info/exclude` los excluye solo en ese clon. Un checkout limpio no contiene estos baselines y no puede ejecutar la regresión visual de forma reproducible.

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
- **Deuda técnica abierta:** `test:visual` no se ejecutó en la validación del 2026-11-10. Los 3285 snapshots registrados son locales, no están versionados y faltan en un checkout limpio; la ejecución reproducible queda pendiente hasta acordar una fuente de baselines disponible para el equipo y validar la suite en un checkout limpio. La suite sigue fuera de `quality:verify`.

---

## Referencias

- `docs/arquitectura/indice.md` §5 — Capas de testing
- `docs/componentes/navegadores-compatibles.md` — Viewports y browsers
- `docs/guias/contribuir.md` — Visual regression
- `README.md` § Testing

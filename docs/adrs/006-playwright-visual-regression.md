# ADR-006: Playwright Visual Regression 4×2

**Estado**: Aceptado | **Fecha**: 2026-11-03 | **Actualizado**: 2026-11-06

---

## Contexto

Los tests sin DOM (ADR-005) validan el contrato de clases CSS, pero no el render visual real. Necesitamos visual regression testing que cubra responsive + theming.

## Decisión

**Playwright Visual Regression con 8 proyectos** (4 viewports × 2 temas):

| Viewport | Ancho | Alto | Dispositivo |
|----------|-------|------|-------------|
| `mobile` | 360px | 640px | Mobile Chrome |
| `tablet` | 768px | 1024px | iPad Pro |
| `laptop` | 1024px | 768px | Laptop Chrome |
| `desktop` | 1440px | 900px | Desktop Chrome |

| Tema | Atributo HTML |
|------|---------------|
| `light` | `<html data-theme="light">` |
| `dark` | `<html data-theme="dark">` |

**Total**: 8 proyectos × ~23 componentes × ~3 estados = **~550 snapshots base**

**Configuración** (`playwright.config.ts`):
```typescript
projects: [
  { name: 'mobile-light', use: { ...devices['Mobile Chrome'], viewport: { width: 360, height: 640 } } },
  { name: 'mobile-dark', use: { ...devices['Mobile Chrome'], viewport: { width: 360, height: 640 } } },
  { name: 'tablet-light', use: { ...devices['iPad Pro'], viewport: { width: 768, height: 1024 } } },
  { name: 'tablet-dark', use: { ...devices['iPad Pro'], viewport: { width: 768, height: 1024 } } },
  { name: 'laptop-light', use: { ...devices['Desktop Chrome'], viewport: { width: 1024, height: 768 } } },
  { name: 'laptop-dark', use: { ...devices['Desktop Chrome'], viewport: { width: 1024, height: 768 } } },
  { name: 'desktop-light', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
  { name: 'desktop-dark', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
]
```

**Umbral**: `maxDiffPixels: 100` (0.2% aprox)

**Actualización snapshots**: Solo DS Owner con aprobación
```bash
pnpm --filter @buildertech/ui test:visual --update-snapshots
```

## Consecuencias

### Positivas
- **Cobertura real**: responsive + light/dark + interacciones (hover, focus, open/close)
- **Sin jsdom**: usa browser real (WebKit/Chromium/Firefox)
- **CI paralela**: 6 proyectos corren en paralelo
- **Detecta regressions** que tests unitarios no (subpixel, antialiasing, font rendering)

### Negativas
- **Más lento**: ~2-3 min total CI
- **Flakiness potencial**: network, fonts, timing → mitigado con `waitUntil: 'networkidle'` + retries
- **Mantenimiento snapshots**: requiere proceso de aprobación para updates

## Implementación

- Specs visuales en `e2e/visual/*.visual.spec.ts` (22 componentes)
- Config Playwright unificada en raíz: `playwright.config.ts` (8 proyectos)
- Baselines en `e2e/visual/snapshots/` (3285 PNGs, gitignored via `.git/info/exclude`)
- `test:visual` ejecuta `playwright test` (requiere Storybook local)

---

## Referencias

- `arquitectura.md` §1 Principio 7
- `componentes-supported-browsers.md` — Viewports y browsers
- `guias-contributing.md` — Visual Regression

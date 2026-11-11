# Navegadores soportados — @buildertechco/ui

> **Versión**: 0.1.0 | **Fecha**: 2026-11-10

---

## 1. Soporte oficial

El paquete usa **Tailwind CSS v4 CSS-first** (`@theme inline`), variables CSS y `color-mix()`. El mínimo real lo impone Tailwind v4:

| Navegador          | Versión mínima | Notas                                         |
| :----------------- | :------------- | :-------------------------------------------- |
| **Chrome**         | 111+           | `@theme inline`, variables CSS, `color-mix()` |
| **Edge**           | 111+           | Basado en Chromium                            |
| **Firefox**        | 128+           | Requisito de Tailwind v4                      |
| **Safari**         | 16.4+          | Requisito de Tailwind v4                      |
| **iOS Safari**     | 16.4+          | iOS 16.4+                                     |
| **Chrome Android** | 111+           |                                               |

> **No se declara un nivel Baseline formal.** El mínimo lo determina Tailwind v4 y se revisa al actualizar Tailwind. No hay polyfills en el paquete.

---

## 2. Features CSS utilizadas

| Feature                               | Uso en el DS                                                                  | Soporte mínimo                          |
| :------------------------------------ | :---------------------------------------------------------------------------- | :-------------------------------------- |
| **CSS Custom Properties** (`--btc-*`) | Tokens y theming light/dark                                                   | Chrome 49+, Firefox 31+, Safari 9.1+    |
| **`@theme inline`** (Tailwind v4)     | Genera utilidades `btc-*`                                                     | Chrome 111+, Firefox 128+, Safari 16.4+ |
| **`color-mix()`**                     | Hover de variantes outline y superficies                                      | Chrome 111+, Firefox 113+, Safari 16.2+ |
| **`:has()`**                          | `Dialog` ajusta padding cuando hay `data-dialog-content`/`data-dialog-footer` | Chrome 105+, Firefox 121+, Safari 15.4+ |
| **`:where()` / `:is()`**              | Especificidad controlada de Tailwind                                          | Chrome 88+, Firefox 78+, Safari 14+     |
| **`data-theme` + variables**          | Tema light/dark en `<html>`                                                   | Todos los navegadores con CSS variables |
| **`prefers-color-scheme`**            | `ThemeToggle` en modo `system`                                                | Chrome 76+, Firefox 67+, Safari 12.1+   |
| **`prefers-reduced-motion`**          | Desactiva animaciones                                                         | Chrome 74+, Firefox 63+, Safari 10.1+   |

No se usan `oklch()`, container queries ni `@property` directamente en los componentes.

---

## 3. Validación en navegador

### 3.1 Storybook component tests (Chromium)

```bash
pnpm test:storybook
```

- Ejecuta las **21 stories** en **Chromium** con Vitest browser mode y Playwright.
- **255 tests en 21 archivos** pasaron en Chromium con `pnpm test:storybook` el 2026-11-10.
- Requiere Chromium de Playwright instalado (`pnpm exec playwright install chromium`).
- Solo cubre Chromium; Firefox y WebKit **no** se ejecutan en esta suite.

### 3.2 Regresión visual Playwright (Chromium)

```bash
pnpm test:visual
```

| Viewport  |  Ancho |   Alto |
| :-------- | -----: | -----: |
| `mobile`  |  360px |  800px |
| `tablet`  |  768px | 1024px |
| `laptop`  | 1024px | 1024px |
| `desktop` | 1440px | 1024px |

- **8 proyectos**: 4 viewports × 2 temas (`light-*`, `dark-*`).
- **22 specs** y **3285 snapshots** locales no versionados; no disponibles en un checkout limpio.
- Configuración: `maxDiffPixels: 0`, `maxDiffPixelRatio: 0.001`, `threshold: 0.2`.
- `webServer` arranca Storybook en `http://localhost:6006` en local; en CI se desactiva.
- Todos los proyectos usan `devices["Desktop Chrome"]` con viewport propio: **la suite no valida Firefox, Safari ni dispositivos reales**.
- **Deuda técnica:** la regresión visual no se ejecutó el 2026-11-10. Los baselines no están versionados y no existen en un checkout limpio; se necesita una fuente reproducible antes de considerar validada esta cobertura.

### 3.3 Lo que no se valida automáticamente

| Área                        | Estado                                                 |
| :-------------------------- | :----------------------------------------------------- |
| Firefox                     | No hay suite automatizada                              |
| Safari / WebKit             | No hay suite automatizada                              |
| Dispositivos móviles reales | No hay suite; solo viewport 360×800 en Chromium        |
| Lectores de pantalla        | No hay pruebas automatizadas; se revisa semántica/ARIA |
| Zoom de texto al 200%       | Revisión manual                                        |

---

## 4. Requisitos de la app consumidora

| Requisito                    | Detalle                                                                                               |
| :--------------------------- | :---------------------------------------------------------------------------------------------------- |
| **Tailwind CSS v4**          | Necesario para `@theme inline`; no se soporta Tailwind v3                                             |
| **PostCSS / Vite / Next.js** | Opciones para procesar Tailwind v4; `pnpm test:consumer` valida Vite, no una app Next.js              |
| **`@source`**                | Debe apuntar a `node_modules/@buildertechco/ui/dist` para que Tailwind detecte las clases del paquete |
| **`data-theme` en `<html>`** | Necesario para portales y tokens light/dark                                                           |
| **React 18.3+**              | Peer dependency                                                                                       |
| **Next.js 14+**              | Solo para `@buildertechco/ui/lib/fonts`; `next` es un peer opcional                                   |
| **Node 26+**                 | Solo para el repositorio del DS; no es requisito de runtime                                           |

El barrel raíz se puede consumir con Vite/Tailwind v4. Los helpers de fuente son específicos de Next y se importan únicamente desde `@buildertechco/ui/lib/fonts`. La importación ESM nativa de Node no está soportada.

```css
/* app/globals.css */
@import "tailwindcss";
@import "@buildertechco/ui/styles/globals.css";
@source "../node_modules/@buildertechco/ui/dist";
```

---

## 5. Navegadores no soportados

| Navegador            | Motivo                                |
| :------------------- | :------------------------------------ |
| Internet Explorer 11 | EOL; sin variables CSS ni Tailwind v4 |
| Chrome < 111         | Sin `@theme inline`                   |
| Firefox < 128        | Requisito de Tailwind v4              |
| Safari < 16.4        | Requisito de Tailwind v4              |
| React Native / Expo  | El paquete es web-only                |

> **Política**: no se añaden polyfills. Una app que necesite navegadores fuera de la matriz debe implementar su propia capa de compatibilidad y asumir la divergencia visual.

---

## 6. Checklist de release

- [ ] `pnpm test` verde (unit + integration).
- [ ] `pnpm test:storybook` verde (21 stories; registrar el total obtenido en la ejecución de release).
- [ ] `pnpm check:design` sin violaciones.
- [ ] `pnpm typecheck` y `pnpm lint` sin errores.
- [ ] `pnpm build` genera `dist/` con JS, `.d.ts` y CSS.
- [ ] Snapshots visuales revisados si cambió algún token o layout.
- [ ] Documentación y `CHANGELOG.md` actualizados.

---

## 7. Referencias

- [Tailwind v4 Browser Support](https://tailwindcss.com/docs/browser-support)
- [CSS Custom Properties — MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)
- [color-mix() — MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/color-mix)
- [`:has()` — MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/:has)
- `docs/adrs/006-playwright-regresion-visual.md`
- `docs/adrs/009-storybook-validacion-visual.md`
- `playwright.config.ts`, `vitest.workspace.ts`

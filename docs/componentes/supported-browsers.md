# Navegadores Soportados — @buildertech/ui

> **Versión**: 0.1.0 | **Fecha**: 2026-11-07

---

## 🎯 Soporte Oficial

| Navegador | Versión Mínima | Notas |
|-----------|----------------|-------|
| **Chrome** | 115+ | Tailwind v4 + CSS Variables + `@theme inline` |
| **Firefox** | 115+ | Full support |
| **Safari** | 16.4+ | CSS Variables, `:has()`, `:where()` |
| **Edge** | 115+ | Chromium-based |
| **Mobile Safari** | 16.4+ | iOS 16.4+ |
| **Chrome Android** | 115+ | |

> **Baseline**: **Baseline 2023** (widely available features)

---

## 🔧 Features CSS Requeridas

| Feature | Uso en DS | Soporte |
|---------|-----------|---------|
| **CSS Custom Properties** (`--btc-*`) | Tokens, theming | ✅ All |
| **`@theme inline`** (Tailwind v4) | Utilidades `btc-*` | Chrome 115+, Firefox 115+, Safari 16.4+ |
| **`color-mix()`** | Border focus rings | ✅ All |
| **`oklch()` / `lab()`** | Paleta extendida (futuro) | Chrome 111+, Firefox 113+, Safari 15.4+ |
| **`:has()`** | Selector padre (futuro) | Chrome 105+, Firefox 121+, Safari 15.4+ |
| **`:where()` / `:is()`** | Especificidad controlada | ✅ All |
| **`container queries`** | Responsive components (futuro) | Chrome 105+, Firefox 110+, Safari 16+ |
| **`@property`** | Animaciones CSS (futuro) | Chrome 85+, Firefox 128+, Safari 16.4+ |

---

## 📱 Viewports de Test (Playwright)

| Dispositivo | Ancho | Alto | User Agent |
|-------------|-------|------|------------|
| **Mobile** | 360px | 640px | Mobile Chrome |
| **Tablet** | 768px | 1024px | iPad Pro |
| **Laptop** | 1024px | 768px | Desktop Chrome |
| **Desktop** | 1440px | 900px | Desktop Chrome |

**Proyectos**: 4 viewports × 2 temas (light/dark) = **8 proyectos Playwright**

---

## 🚫 No Soportados (Intencional)

| Navegador/Versión | Motivo |
|-------------------|--------|
| IE 11 | EOL, sin CSS Variables |
| Chrome < 115 | Sin `@theme inline` |
| Firefox < 115 | Sin `@theme inline` |
| Safari < 16.4 | Sin `:has()`, CSS Variables parciales |
| React Native / Expo | Web-only, usar librería nativa |

> **Política**: No polyfills. Apps consumidoras que necesiten soporte legacy deben implementar su propia capa de compatibilidad.

---

## 🧪 Validación Continua

```bash
# CI corre visual regression en 6 proyectos
pnpm test:visual

# Browserslist en package.json (app consumidora)
# "browserslist": ["> 0.5%", "last 2 versions", "not dead", "not IE 11"]
```

---

## 📋 Checklist Release

- [ ] Visual regression pasa en 8 proyectos (4 viewports × 2 temas)
- [ ] `check:design` 0 errores en `src/`
- [ ] TypeScript 0 errores
- [ ] Lint 0 warnings
- [ ] Bundle size < 50KB gzipped (sin deps UI externas)
- [ ] Documentación actualizada (`CHANGELOG.md`, `tokens-especificacion-api.md`, `componentes-guide.md`)

---

## 🔗 Referencias

- [Tailwind v4 Browser Support](https://tailwindcss.com/docs/browser-support)
- [CSS Custom Properties MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)
- [Baseline 2023](https://web.dev/baseline/)
- `tokens/layout-sizing.md` — Features CSS usadas

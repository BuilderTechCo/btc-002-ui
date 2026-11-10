# ADR-005: Tests sin DOM (ampliado con integración jsdom)

**Estado**: Aceptado / ampliado por ADR-009 | **Fecha**: 2026-11-03 | **Actualizado**: 2026-11-09

---

## Contexto

Los tests unitarios tradicionales con jsdom/Jest pueden ser lentos y no validan el contrato visual real (clases CSS generadas). La decisión original fue usar `renderToStaticMarkup` de React DOM Server para tests rápidos en Node.

Con la evolución del DS aparecieron necesidades que el render estático no cubre: foco, teclado, portales, click fuera, `Escape`, selección múltiple y estados interactivos. Por eso la estrategia se amplió en capas.

## Decisión original

**Tests unitarios sin DOM** para utilidades y contratos de markup:

```tsx
import { renderToStaticMarkup } from "react-dom/server";
import { Button } from "@buildertech/ui";

test("Button primary render", () => {
  const html = renderToStaticMarkup(<Button variant="primary">Click</Button>);
  expect(html).toContain("bg-btc-action-primary");
  expect(html).toContain("text-btc-text-on-brand");
  expect(html).toContain("rounded-btc-md");
});
```

**Válido para**: clases `btc-*`, HTML semántico, props `aria-*`, estados estáticos.

## Ampliación (2026-11-09)

| Capa          | Entorno  | Herramienta                 | Alcance                                      |
| :------------ | :------- | :-------------------------- | :------------------------------------------- |
| `unit`        | Node     | Vitest                      | Utilidades puras, classnames, iconos, tipos  |
| `integration` | jsdom    | Vitest + Testing Library    | Comportamiento, eventos, foco, teclado, ARIA |
| `storybook`   | Chromium | Vitest browser + Playwright | Render de stories y assertions de `play`     |
| `visual`      | Chromium | Playwright                  | Regresión 4 viewports × 2 temas              |

Los tests viven junto al código:

- `src/lib/**/*.test.ts*` → unit.
- `src/components/**/*.test.tsx` → integration.
- `src/components/**/*.stories.tsx` → storybook.
- `e2e/visual/*.visual.spec.ts` → visual.

## Consecuencias

### Positivas

- Unit sigue siendo rápido y sin browser.
- Integration cubre comportamiento real sin depender de un navegador.
- Storybook valida el render en Chromium y la accesibilidad.
- Playwright cubre layout, responsive y temas.

### Negativas

- Más capas y más tiempo total de validación.
- `test:storybook` y `test:visual` requieren Chromium/Storybook y no están en `quality:verify`.
- Los tests de integración necesitan jsdom y setup de Testing Library.

## Implementación

- `vitest.workspace.ts` define `unit`, `integration` y `storybook`.
- `src/test/setup-unit.ts` y `src/test/setup.ts` contienen los setups.
- `package.json`:
  - `test`: `vitest run --project=unit --project=integration`.
  - `test:storybook`: `vitest run --project=storybook`.
  - `test:visual`: `playwright test`.
- Resultado histórico de la verificación del **2026-11-09**: **330 tests unit/integration + 251 tests de stories**. No representa el conteo actual de unit/integration; consulta la sección de estado verificado en [`docs/arquitectura/indice.md`](../arquitectura/indice.md). La cifra de stories queda como registro histórico hasta volver a ejecutar esa suite.

---

## Referencias

- `docs/arquitectura/indice.md` §5 — Capas de testing
- `docs/guias/contribuir.md` — Testing
- `docs/adrs/009-storybook-validacion-visual.md` — Storybook y browser mode
- `docs/tokens/especificacion-api.md` — Props a validar por componente

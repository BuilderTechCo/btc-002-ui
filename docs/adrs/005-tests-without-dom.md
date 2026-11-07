# ADR-005: Tests Without DOM

**Estado**: Aceptado | **Fecha**: 2026-11-03

---

## Contexto

Tests unitarios tradicionales con jsdom/Jest son lentos, flaky, y no validan el contrato visual real (clases CSS generadas). Necesitamos una estrategia de testing rápida y confiable.

## Decisión

**Tests unitarios sin DOM/jsdom** usando `renderToStaticMarkup` de React DOM Server:

```tsx
// Ejemplo test
import { renderToStaticMarkup } from 'react-dom/server';
import { Button } from '@buildertech/ui';

test('Button primary render', () => {
  const html = renderToStaticMarkup(<Button variant="primary">Click</Button>);
  
  // Validar contrato visual: clases btc-* esperadas
  expect(html).toContain('bg-btc-brand');
  expect(html).toContain('text-btc-on-brand');
  expect(html).toContain('rounded-btc-md');
  expect(html).toContain('font-medium');
  expect(html).toContain('transition-colors');
  expect(html).toContain('duration-btc-base');
  expect(html).toContain('focus-visible:ring-2');
  expect(html).toContain('focus-visible:ring-btc-border-focus');
});

test('Button disabled aria-disabled', () => {
  const html = renderToStaticMarkup(<Button disabled>Click</Button>);
  expect(html).toContain('aria-disabled="true"');
  expect(html).toContain('opacity-50');
  expect(html).toContain('pointer-events-none');
});
```

**Validaciones cubiertas**:
- ✅ Clases `btc-*` correctas (colores, spacing, radius, shadow, etc.)
- ✅ HTML semántico (`<button>`, `<label>`, `<hr>`, `<dialog>`, etc.)
- ✅ Props de accesibilidad (`aria-*`, `role`, `data-*`)
- ✅ Estados (disabled, loading, error, focus-visible)
- ✅ Compound components render correctamente

**NO cubiertos** (intencional):
- ❌ Comportamiento runtime (click handlers, state changes)
- ❌ Layout visual real (eso es visual regression)
- ❌ Interacciones complejas (keyboard nav, focus trap)

## Consecuencias

### Positivas
- **Velocidad**: <100ms por test (vs 500-2000ms con jsdom)
- **Cero flakiness**: sin DOM, sin timers, sin async
- **CI simple**: sin dependencias de browser, corre en cualquier entorno
- **Enfoque en contrato**: valida lo que importa — clases CSS generadas

### Negativas
- No testea comportamiento runtime
- Requiere visual regression (Playwright) para cobertura completa
- Desarrolladores deben entender `renderToStaticMarkup` vs DOM testing

## Implementación

- Tests unitarios viven en `src/lib/**/*.test.tsx` (entorno Node, sin DOM)
- Tests de integración viven en `src/components/**/*.test.tsx` (entorno jsdom)
- Paquete NO tiene `tests/` ni `__tests__/` (ADR-001)
- `package.json` scripts: `test` ejecuta Vitest con 2 projects (unit + integration)

---

## Referencias

- `arquitectura.md` §1 Principio 6
- `guias-contributing.md` — Testing
- `tokens-especificacion-api.md` — Props a validar por componente

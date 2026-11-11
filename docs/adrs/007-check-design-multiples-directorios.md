# ADR-007: `check:design` multi-directorio + guardarraíl de lógica de negocio

**Estado**: Aceptado | **Fecha**: 2026-11-04 | **Actualizado**: 2026-11-09

---

## Contexto

El validador `check:design` debe garantizar consistencia visual en el paquete y, si se configura, en apps consumidoras. También debe impedir que lógica de negocio se filtre en componentes del DS.

## Decisión

**Un único validador estricto** (`scripts/check-design.ts`) que escanea los directorios configurados.

### Configuración

- Por defecto escanea `src/`.
- Los directorios se configuran en `package.json`:

```json
{
  "checkDesign": {
    "scanDirs": ["src"]
  }
}
```

- **No existe** el flag `--scan-dirs` ni un `--profile=app`. La CLI no los acepta.
- El validador **no** aplica un perfil permisivo automático a apps: si se añade `apps/web/src` a `scanDirs`, se aplican las mismas reglas.

### 12 reglas visuales + 1 guardarraíl

| #   | ID                      | Qué valida                                                                   | Severidad |
| :-- | :---------------------- | :--------------------------------------------------------------------------- | :-------- |
| 1   | `only-btc-color-tokens` | Solo tokens de color `btc-*`; prohíbe paletas Tailwind (`bg-blue-500`, etc.) | Error     |
| 2   | `only-btc-utilities`    | Solo utilidades `btc-*` para spacing, radius y shadow                        | Error     |
| 3   | `spacing-scale`         | Espaciado `btc-*` en escala `0,1,2,3,4,6,8,12,16`                            | Error     |
| 4   | `sizing-scale`          | `w/h/min/max/size-btc-*` en escala definida o Tailwind estándar              | Error     |
| 5   | `radius-defined`        | Radios `rounded-btc-*` definidos                                             | Error     |
| 6   | `font-system`           | Solo `font-btc-sans` / `font-btc-mono`                                       | Error     |
| 7   | `duration-standard`     | Duraciones `duration-btc-fast                                                | base      | slow`     | Error          |
| 8   | `ease-standard`         | Solo `ease-btc-standard`                                                     | Error     |
| 9   | `shadow-defined`        | Solo `shadow-btc-1..5`                                                       | Error     |
| 10  | `z-index-controlled`    | Solo `z-btc-*` definidos                                                     | Error     |
| 11  | `transition-allowed`    | Solo `transition-btc-colors                                                  | opacity   | transform | shadow`        | Error         |
| 12  | `no-important`          | Sin `!important` (excepto estilos globales)                                  | Error     |
| —   | `no-business-logic`     | **Guardarraíl**: prohíbe `fetch                                              | supabase  | prisma    | axios`en`src/` | Error crítico |

### Exclusiones del escaneo

`dist/`, `node_modules/`, tests, specs, declaraciones `.d.ts` y `src/lib/classnames/` (define nombres de utilidades, no las usa).

## Consecuencias

### Positivas

- Una sola implementación y una sola fuente de reglas.
- Detecta deriva visual y lógica de negocio en UI.
- Configuración explícita por `package.json`, sin flags frágiles.

### Negativas

- Si se escanean apps consumidoras, las reglas estrictas pueden generar falsos positivos; requieren triage.
- Las excepciones W1-W3 son un proceso de gobernanza, no un modo automático del validador.
- El mantenimiento de las reglas acompaña a la evolución de tokens.

## Implementación

- `scripts/check-design.ts` — implementación única.
- `package.json` → `checkDesign.scanDirs` (opcional; default `["src"]`).
- `pnpm check:design` — ejecución local.
- `pnpm quality:verify` incluye `check:design`.
- Estado verificado: **0 violaciones** sobre `src/`.

---

## Referencias

- `docs/gobernanza/cumplimiento.md` — Reglas, excepciones y sanciones
- `docs/guias/contribuir.md` — Quality verify
- `docs/arquitectura/indice.md` §1 — Principios
- `scripts/check-design.ts` — Implementación

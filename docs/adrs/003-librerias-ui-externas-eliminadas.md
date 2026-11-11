# ADR-003: Librerías UI Externas Eliminadas

**Estado**: Aceptado | **Fecha**: 2026-11-02

---

## Contexto

El proyecto usaba 7 dependencias `@librerias-ui-externas/*` para componentes UI complejos. Estas librerías añadían bundle size, dependencias runtime, y limitaban control sobre API y accesibilidad.

## Decisión

**Eliminar todas las dependencias externas UI** y reemplazar con implementaciones nativas en `@buildertechco/ui`:

| Librería Externa                             | Reemplazo Nativo | Implementación                             |
| -------------------------------------------- | ---------------- | ------------------------------------------ |
| `@librerias-ui-externas/react-dialog`        | `Dialog`         | `<dialog>` HTML + portal + focus trap      |
| `@librerias-ui-externas/react-select`        | `Select`         | `<select>` nativo + portal + search/filter |
| `@librerias-ui-externas/react-dropdown-menu` | `DropdownMenu`   | Compound components (estilo Radix)         |
| `@librerias-ui-externas/react-toast`         | `Toast`          | ARIA live region + portal                  |
| `@librerias-ui-externas/react-label`         | `Label`          | `<label>` nativo + estilos btc-*           |
| `@librerias-ui-externas/react-separator`     | `Separator`      | `<hr>` nativo + variantes                  |
| `@librerias-ui-externas/react-slot`          | `Slot`           | Polimorfismo `asChild` pattern             |

**También eliminado**: `class-variance-authority` (CVA) → reemplazado por `clsx` + `tailwind-merge` en `lib/classnames.ts`

## Consecuencias

### Positivas

- **Bundle size**: -45KB gzipped (sin deps UI externas)
- **Zero runtime deps** para componentes UI
- **Control total** de API, estilos, accesibilidad
- **Accesibilidad nativa**: `<dialog>`, `<select>`, `<label>`, `<hr>`, ARIA live
- **Consistencia visual**: todos usan tokens `btc-*` y `check:design`

### Negativas

- **Esfuerzo de migración** en apps consumidoras (Dialog, Select, Table APIs cambiaron)
- **Mantenimiento** de componentes complejos (Dialog focus trap, Select search, DropdownMenu keyboard nav)
- **Testing** visual regression obligatorio para garantizar paridad

## Migración (apps/web)

Ver `guias/guia-migracion.md` — Paso 4: APIs cambiadas críticamente:

- **Dialog**: compound → props-based controlado (`open`/`onClose`)
- **Select**: compound Radix → single component con `options[]`
- **Table**: compound → data-driven `columns[]` + `data[]`

---

## Referencias

- `arquitectura/indice.md` §1 Principio 4
- `tokens/especificacion-api.md` — APIs de Dialog, Select, DropdownMenu, Toast, Label, Separator, Slot
- `guias/guia-migracion.md` — Guía completa de migración

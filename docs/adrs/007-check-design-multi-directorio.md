# ADR-007: check:design Multi-Directorio + Guardarraíl Lógica Negocio

**Estado**: Aceptado | **Fecha**: 2026-11-04

---

## Contexto

El validador `check:design` debe garantizar consistencia visual en todo el monorepo: tanto en el paquete `@buildertech/ui` como en apps consumidoras (`apps/web`). Además, debe prevenir que lógica de negocio se filtre en componentes del DS.

## Decisión

**`check:design` escanea múltiples directorios con perfiles diferentes**:

```bash
# Paquete — ESTRICTO (todas las reglas)
pnpm --filter @buildertech/ui check:design --scan-dirs=src

# App consumidora — PERMISIVO (W1-W3 permitidos con justificación)
pnpm --filter @buildertech/ui check:design --scan-dirs=apps/web/src --profile=app
```

### 11 Reglas Visuales + 1 Guardarraíl

| Regla | Qué Valida | Directorio | Severidad |
|-------|------------|------------|-----------|
| **R1** `only-btc-tokens` | Solo tokens `--btc-*` en colores | `src/` | Error |
| **R1** `only-btc-utilities` | Solo utilidades `btc-*` en spacing/radius/shadow/z-index/typography/transitions | `src/` | Error |
| **R2** `spacing-scale` | Espaciado solo escala 1,2,3,4,6,8,12,16 | `src/` | Error |
| **R3** `radius-defined` | Radios solo xs,sm,md,lg,xl,2xl,full | `src/` | Error |
| **R4** `font-system` | Fuentes solo `--btc-font-sans/mono` | `src/` | Error |
| **R5** `duration-standard` | Duraciones fast,base,slow | `src/` | Error |
| **R6** `elevation-defined` | Sombras solo `shadow-btc-1` a `5` (mapean a `--btc-elevation-*`) | `src/` | Error |
| **R7** `z-index-controlled` | Z-index solo `z-btc-*` definidos | `src/` | Error |
| **R8** `transitions-allowed` | Solo colors,opacity,transform,shadow | `src/` | Error |
| **R9** `no-important` | No `!important` en componentes | `src/` | Error |
| **R10** `no-business-logic` | **Guardarraíl**: prohíbe `fetch|supabase|prisma|axios` | `src/` | **Error Crítico** |
| **R11** `presentational-only` | Componentes sin estado/efectos de negocio | `src/` | Warning |

### Perfil App Consumidora (`apps/web/src`)

| Regla | Comportamiento |
|-------|----------------|
| R1-R9 | **Warning** (no error) — permite W1-W3 documentados |
| R10 | **No aplica** — apps SÍ tienen lógica de negocio |
| R11 | **No aplica** — apps tienen componentes con lógica |

### Excepciones Permitidas en Apps (W1-W3)

Ver `gobernanza/enforcement.md`:
- **W1**: Override tokens `--btc-*` en `apps/web/src/app/styles/globals.css` (justificado)
- **W2**: Wrapper components en app (ej: `CustomCard` extendiendo `Card`)
- **W3**: Utilidades custom en `@layer utilities` (ej: `scrollbar-hide`)

## Consecuencias

### Positivas
- **Single source of truth**: reglas definidas una vez, aplicadas en todo el monorepo
- **Previene deriva visual**: apps no pueden inventar tokens/utilidades
- **Detecta lógica en UI**: guardarraíl R10 catcha `fetch`/`supabase`/`prisma`/`axios` en paquete
- **Flexibilidad controlada**: apps pueden extender con proceso documentado

### Negativas
- **Complejidad**: dos perfiles de validación
- **Falsos positivos**: apps pueden trigger warnings legítimos → requiere triage
- **Mantenimiento**: reglas deben actualizarse cuando DS evoluciona

## Implementación

- `scripts/check-design.ts` — implementación única, configurable por perfil
- `package.json` scripts: `check:design`, `check:design:app`
- CI corre ambos: `quality:verify` incluye ambos scans

---

## Referencias

- `arquitectura/index.md` §1 Principio 8
- `gobernanza/enforcement.md` — R1-R11, W1-W3, procesos
- `guias/contributing.md` — Quality Verify

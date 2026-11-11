# Enforcement — Políticas de uso del Design System

> **Reglas obligatorias, excepciones y procesos** para `@buildertechco/ui`.
> **Versión**: 0.1.0 | **Fecha**: 2026-11-09 | **Estado**: Validado contra `scripts/check-design.ts`

---

## 1. Principio

> **El Design System es la única fuente de verdad para UI.** Cualquier desviación debe ser intencional, documentada y aprobada.

El paquete es presentacional: recibe props, renderiza UI y emite eventos. No contiene lógica de negocio, acceso a datos ni configuración de apps.

---

## 2. Herramientas de enforcement

| Comando                      | Qué valida                                                                  |
| :--------------------------- | :-------------------------------------------------------------------------- |
| `pnpm check:design`          | 12 reglas visuales + guardarraíl de lógica de negocio                       |
| `pnpm check:contract`        | Exports de `package.json` ↔ `src/` ↔ `dist/`                                |
| `pnpm check:component-files` | `index.ts`, `<componente>.tsx`, `.test.tsx` y `.stories.tsx` por componente |
| `pnpm check:suppressions`    | Supresiones de lint/TS sin justificación                                    |
| `pnpm typecheck`             | TypeScript estricto                                                         |
| `pnpm lint`                  | ESLint 9 flat config                                                        |
| `pnpm test`                  | Unit (Node) + integration (jsdom)                                           |
| `pnpm test:consumer`         | Build de consumo con Vite/Tailwind para el barrel, subrutas JS y CSS        |
| `pnpm test:docs-contract`    | Scope/registry, instalación y comandos existentes en el template de PR      |
| `pnpm test:storybook`        | Stories en Chromium                                                         |
| `pnpm test:visual`           | Regresión visual Playwright                                                 |
| `pnpm format:check`          | Formato de los archivos versionados                                         |
| `pnpm quality:verify`        | Typecheck, lint, reglas de diseño y unit/integration                        |
| `pnpm test:static`           | Contratos de componentes, exports, suppressions y documentación             |
| `pnpm build`                 | Build del paquete                                                           |

`quality:verify` ejecuta `typecheck`, `lint`, `check:design` y `test`. **No incluye** `test:storybook` ni `test:visual` porque requieren Chromium/Storybook.

`test:static` incluye la prueba del contrato documental. `prepublishOnly` ejecuta los checks de calidad y de contratos (exports y documentación), `build` y `test:consumer`; no ejecuta tests de navegador.

Antes de cualquier commit, incluidos cambios solo de documentación, son
obligatorios y deben pasar localmente: `pnpm format:check`,
`pnpm quality:verify`, `pnpm test:static`, `pnpm test:storybook`,
`pnpm test:visual`, `pnpm test:consumer` y `pnpm build`. La política completa
está en [`AGENTS.md`](../../AGENTS.md) y en
[`docs/guias/contribuir.md`](../guias/contribuir.md).

**Bloqueo técnico Playwright:** `test:visual` no se ejecutó en la validación del
2026-11-10. Sus baselines no están versionados y faltan en un checkout limpio,
por lo que la suite no es reproducible para todo el equipo. Al ser obligatoria
antes de cada commit, un checkout sin baselines no supera el gate; no omitas la
prueba ni declares cobertura verificada.

---

## 3. Reglas bloqueantes (12)

### R1 — `only-btc-color-tokens`

Solo tokens de color `btc-*`. Prohibidas las paletas Tailwind por defecto.

```css
/* ❌ */
.bg-blue-500 {
}
.text-gray-900 {
}
.border-red-200 {
}

/* ✅ */
.bg-btc-brand {
}
.text-btc-text-primary {
}
.border-btc-border-default {
}
```

**Severidad**: error.

### R2 — `only-btc-utilities`

Spacing, radios y sombras deben usar utilidades `btc-*`.

```css
/* ❌ */
.p-4 {
}
.gap-10 {
}
.rounded-md {
}
.shadow-lg {
}

/* ✅ */
.p-btc-4 {
}
.gap-btc-8 {
}
.rounded-btc-md {
}
.shadow-btc-2 {
}
```

**Severidad**: error.

### R3 — `spacing-scale`

El espaciado `btc-*` solo admite la escala `0, 1, 2, 3, 4, 6, 8, 12, 16`.

```css
/* ❌ */
.p-btc-5 {
} /* 20px */
.m-btc-7 {
} /* 28px */
.gap-btc-10 {
} /* 40px */

/* ✅ */
.p-btc-0 {
} /* 0px */
.p-btc-4 {
} /* 16px */
.gap-btc-6 {
} /* 24px */
.p-btc-16 {
} /* 64px */
```

**Severidad**: error.

### R4 — `sizing-scale`

Si usas `w-btc-*`, `h-btc-*`, `min-w-btc-*`, `max-w-btc-*`, `min-h-btc-*`, `max-h-btc-*` o `size-btc-*`, el valor debe existir en la escala. Para sizing libre usa Tailwind estándar (`w-12`, `h-16`, `max-w-md`).

```css
/* ❌ */
.w-btc-5 {
}
.size-btc-10 {
}

/* ✅ */
.w-btc-16 {
} /* existe */
.w-12 {
} /* Tailwind estándar */
.max-w-md {
} /* Tailwind estándar */
```

**Severidad**: error.

### R5 — `radius-defined`

Solo radios `btc-*`.

```css
/* ❌ */
.rounded-xl {
}
.rounded-2xl {
}

/* ✅ */
.rounded-btc-xs {
} /* 2px */
.rounded-btc-sm {
} /* 4px */
.rounded-btc-md {
} /* 8px */
.rounded-btc-lg {
} /* 12px */
.rounded-btc-xl {
} /* 16px */
.rounded-btc-2xl {
} /* 24px */
.rounded-btc-full {
} /* 999px */
```

**Severidad**: error.

### R6 — `font-system`

Solo fuentes del sistema `btc-*`.

```css
/* ❌ */
font-sans {
}
font-mono {
}
font-serif {
}

/* ✅ */
font-btc-sans {
}
font-btc-mono {
}
```

**Severidad**: error.

### R7 — `duration-standard`

Duraciones y delays solo `btc-*`.

```css
/* ❌ */
.duration-300 {
}
.delay-150 {
}

/* ✅ */
.duration-btc-fast {
} /* 120ms */
.duration-btc-base {
} /* 160ms */
.duration-btc-slow {
} /* 240ms */
```

**Severidad**: error.

### R8 — `ease-standard`

Solo `ease-btc-standard` (`cubic-bezier(0.2, 0, 0, 1)`).

```css
/* ❌ */
.ease-in-out {
}
.ease-in {
}
.ease-out {
}

/* ✅ */
.ease-btc-standard {
}
```

**Severidad**: error.

### R9 — `shadow-defined`

Solo `shadow-btc-1` a `shadow-btc-5`.

```css
/* ❌ */
.shadow {
}
.shadow-sm {
}
.shadow-xl {
}

/* ✅ */
.shadow-btc-1 {
}
.shadow-btc-3 {
}
.shadow-btc-5 {
}
```

**Severidad**: error.

### R10 — `z-index-controlled`

Solo capas `z-btc-*`.

```css
/* ❌ */
.z-10 {
}
.z-50 {
}
.z-[9999] {
}
.z-auto {
}

/* ✅ */
.z-btc-base {
} /* 0 */
.z-btc-dropdown {
} /* 100 */
.z-btc-sticky {
} /* 200 */
.z-btc-modal {
} /* 300 */
.z-btc-popover {
} /* 400 */
.z-btc-tooltip {
} /* 500 */
.z-btc-toast {
} /* 600 */
```

**Severidad**: error.

### R11 — `transition-allowed`

Solo transiciones explícitas.

```css
/* ❌ */
.transition {
}
.transition-all {
}
.transition-none {
}

/* ✅ */
.transition-btc-colors {
}
.transition-btc-opacity {
}
.transition-btc-transform {
}
.transition-btc-shadow {
}
```

**Severidad**: error.

### R12 — `no-important`

Prohibido `!important`, salvo en `src/styles/globals.css` dentro de `@layer utilities` (por ejemplo, `prefers-reduced-motion`).

```css
/* ❌ en componentes */
.class {
  color: red !important;
}

/* ✅ excepción acotada en globals.css */
@media (prefers-reduced-motion: reduce) {
  .animate-spin {
    animation: none !important;
  }
}
```

**Severidad**: error.

---

## 4. Guardarraíl — `no-business-logic`

Prohíbe `fetch`, `supabase`, `prisma` y `axios` en `src/`.

```tsx
// ❌ PROHIBIDO
export function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  useEffect(() => {
    fetch(`/api/users/${userId}`)
      .then((r) => r.json())
      .then(setUser);
  }, [userId]);
  return <div>{user?.name}</div>;
}

// ✅ CORRECTO
interface UserProfileProps {
  name: string;
  avatar?: string;
  onEditClick?: () => void;
}

export function UserProfile({ name, avatar, onEditClick }: UserProfileProps) {
  return (
    <Card>
      <Card.Content>
        {avatar && <img src={avatar} alt="" />}
        <span>{name}</span>
        {onEditClick && <Button onClick={onEditClick}>Editar</Button>}
      </Card.Content>
    </Card>
  );
}
```

**Severidad**: error crítico. El componente debe ser presentacional; los datos llegan por props.

---

## 5. Configuración de `check:design`

- Escanea `src/` por defecto.
- **No acepta `--scan-dirs` ni `--profile`.** No existe un modo permisivo para apps.
- Si necesitas escanear otros directorios, configura `checkDesign.scanDirs` en `package.json`:

```json
{
  "checkDesign": {
    "scanDirs": ["src"]
  }
}
```

> Actualmente `package.json` no define `checkDesign`; se usa el default `["src"]`. Si añades apps consumidoras, las mismas 12 reglas se aplican a esos directorios: no hay perfil `app`.

### Exclusiones del escaneo

- `dist/`, `node_modules/`.
- Tests y specs (`*.test.*`, `*.spec.*`).
- Declaraciones `.d.ts`.
- `src/lib/classnames/` (define nombres de utilidades, no las usa).

### Excepción de `no-important`

Solo se omite en `src/styles/globals.css`. En cualquier otro archivo, `!important` es error.

---

## 6. Excepciones documentadas (W1–W3)

Estas prácticas **no las valida automáticamente** `check:design`; requieren justificación en el PR y aprobación del DS Owner.

### W1 — Override de tokens en la app

```css
/* app/globals.css */
@import "@buildertechco/ui/styles/globals.css";

:root {
  --btc-bg-app: #fafafa; /* Solo si la app necesita un fondo distinto */
}
```

Debe documentarse el motivo, el alcance y el plan de migración.

### W2 — Wrapper específico de app

```tsx
// app/src/components/ui/CustomCard.tsx
import { Card } from "@buildertechco/ui";

export function CustomCard(props: React.ComponentProps<typeof Card>) {
  return <Card variant="elevated" padding="lg" {...props} />;
}
```

Permitido **componer**, no replicar ni forkear el componente base.

### W3 — Utilidades CSS de propósito único

```css
/* app/globals.css */
@layer utilities {
  .scrollbar-hide {
    scrollbar-width: none;
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
}
```

Solo utilidades que el DS no cubre. No introduzcas colores, spacing o radios nuevos con esta vía.

---

## 7. Prohibiciones absolutas

| Prohibición                                       | Motivo                                    | Consecuencia                     |
| :------------------------------------------------ | :---------------------------------------- | :------------------------------- |
| Forkear un componente del DS en la app            | Deriva visual y deuda técnica             | PR bloqueado                     |
| Definir tokens `--btc-*` en la app sin W1         | Rompe la fuente única de verdad           | Revert                           |
| Importar `@librerias-ui-externas/*` en el paquete | ADR-003                                   | Fallo de build/revisión          |
| Usar `class-variance-authority`                   | Reemplazado por `clsx` + `tailwind-merge` | Rechazo en revisión              |
| Hardcodear colores, spacing o radios              | Rompe theming y consistencia              | `check:design` error             |
| Lógica de negocio en `src/`                       | ADR-001 / ADR-007                         | `check:design` error             |
| Modificar snapshots visuales sin aprobación       | Los baselines son contrato visual         | Revert; el DS Owner aprueba `-u` |

---

## 8. Proceso de cumplimiento

No hay Husky ni workflows de CI en el repositorio. Las verificaciones anteriores
son **obligatorias en local antes de cualquier commit**:

```bash
pnpm format:check
pnpm quality:verify
pnpm test:static
pnpm test:storybook
pnpm test:visual
pnpm test:consumer
pnpm build
```

### Protección de operaciones Git

Los agentes no crean ramas ni worktrees sin aprobación humana previa, explícita
y específica. En este repositorio `CLAUDE.md` prohíbe a los agentes hacer commit,
push, merge o crear PR. Estas reglas son instrucciones documentadas, no un
bloqueo técnico: no asumas que Git o GitHub las hacen cumplir.

### Issues, PRs y versión

- Usa siempre una plantilla existente de `.github/ISSUE_TEMPLATE/` y
  `.github/pull_request_template.md`.
- Incrementa `package.json` por cada issue antes de presentar la PR y documenta
  la versión anterior/nueva, tipo y motivo según
  [`docs/gobernanza/versionado.md`](./versionado.md).
- Incluye en la descripción de la PR evidencia real de todos los gates locales.

### Revisión

- **DS Owner**: arquitectura, tokens, patrones, ADRs y excepciones.
- **Un reviewer adicional**: implementación, tests, DX y documentación.
- Checklist en [`docs/guias/contribuir.md`](../guias/contribuir.md).

### Auditoría periódica

```bash
pnpm check:design
pnpm check:contract
pnpm test
pnpm test:storybook
```

Si en el futuro se añaden apps al `scanDirs`, la auditoría debe revisar los falsos positivos y documentar las excepciones.

---

## 9. Severidad y sanciones

| Severidad   | Incumplimiento                                  | Acción                                      |
| :---------- | :---------------------------------------------- | :------------------------------------------ |
| **Crítica** | Lógica de negocio en `src/`; fork de componente | Revert inmediato, PR bloqueado, post-mortem |
| **Alta**    | R1–R12; prohibiciones absolutas                 | PR bloqueado hasta corregir                 |
| **Media**   | W1–W3 sin justificación                         | Fix en el follow-up, máximo un sprint       |
| **Baja**    | Warning preexistente                            | Backlog de deuda técnica                    |

---

## 10. Solicitud de excepción

1. Crea un issue con la plantilla `task_chore` y especifica que solicita una excepción. No existe una plantilla `exception-request` independiente.
   - Regla afectada (R1–R12, W1–W3).
   - Justificación técnica/negocio.
   - Alternativas consideradas.
   - Impacto de no concederla.
   - Plan y fecha de migración.
2. Revisan el DS Owner y el Tech Lead.
3. Si se aprueba, se documenta en el PR y, si aplica, en `docs/exceptions.md`.
4. Toda excepción tiene fecha de expiración; la renovación requiere un nuevo proceso.

---

## 11. Métricas

| Métrica                  | Objetivo               | Frecuencia   |
| :----------------------- | :--------------------- | :----------- |
| `check:design` en `src/` | 0 violaciones          | Cada cambio  |
| `check:contract`         | 100% exports válidos   | Cada cambio  |
| Tests unit/integration   | 100% verdes            | Cada cambio  |
| Story tests              | 100% verdes            | Cada commit  |
| Visual tests             | 100% verdes            | Cada commit  |
| Excepciones activas      | ≤ 3                    | Trimestral   |
| Deuda a11y conocida      | Documentada y con plan | Cada release |

---

## 12. Referencias

- `scripts/check-design.ts` — implementación de las 12 reglas + guardarraíl.
- `scripts/check-component-contract.ts`, `scripts/check-component-files.mjs`, `scripts/check-suppressions.mjs`.
- [ADR-001](../adrs/001-paquete-workspace-solo-fuente.md)
- [ADR-002](../adrs/002-distribucion-css-tema-inline.md)
- [ADR-003](../adrs/003-librerias-ui-externas-eliminadas.md)
- [ADR-007](../adrs/007-check-design-multiples-directorios.md)
- [Contribuir](../guias/contribuir.md)
- [Arquitectura](../arquitectura/indice.md)

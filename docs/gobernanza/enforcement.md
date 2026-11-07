# Enforcement — Políticas de Uso del Design System

> **Reglas obligatorias, sanciones y procesos de cumplimiento** para `@buildertech/ui`.
> **Versión**: 0.1.0 | **Fecha**: 2026-11-07 | **Estado**: Validado

---

## ⚖️ Principio Fundamental

> **El Design System es la única fuente de verdad para UI.** Cualquier desviación debe ser intencional, documentada y aprobada.

---

## 📜 Reglas Obligatorias (Bloqueantes)

### R1: Solo Tokens y Utilidades `btc-*`
```css
/* ❌ PROHIBIDO */
.bg-blue-500 { }
.rounded-md { }
.shadow-lg { }
.p-4 { }
.text-gray-900 { }

/* ✅ OBLIGATORIO */
.bg-btc-brand { }
.rounded-btc-md { }
.shadow-btc-1 { }
.p-btc-4 { }
.text-btc-text-primary { }
```
**Validación**: `check:design` regla `only-btc-tokens` + `only-btc-utilities` → **Error si falla**.

---

### R2: Espaciado Solo Escala Base 4px
```css
/* ❌ PROHIBIDO */
.p-5 { }      /* 20px - no está en escala */
.m-7 { }      /* 28px - no está en escala */
.gap-10 { }   /* 40px - no está en escala */

/* ✅ PERMITIDO (escala 1,2,3,4,6,8,12,16) */
.p-btc-1 { }  /* 4px */
.p-btc-2 { }  /* 8px */
.p-btc-3 { }  /* 12px */
.p-btc-4 { }  /* 16px */
.p-btc-6 { }  /* 24px */
.p-btc-8 { }  /* 32px */
.p-btc-12 { } /* 48px */
.p-btc-16 { } /* 64px */
```
**Validación**: `check:design` regla `spacing-scale` → **Error si falla**.

---

### R3: Radios Solo Definidos
```css
/* ❌ PROHIBIDO */
.rounded-xl { }      /* Tailwind default */
.rounded-2xl { }     /* Tailwind default */

/* ✅ OBLIGATORIO */
.rounded-btc-xs { }  /* 2px */
.rounded-btc-sm { }  /* 4px */
.rounded-btc-md { }  /* 8px */
.rounded-btc-lg { }  /* 12px */
.rounded-btc-xl { }  /* 16px */
.rounded-btc-2xl { } /* 24px */
.rounded-btc-full { } /* 999px */
```

---

### R4: Fuentes Solo del Sistema
```css
/* ❌ PROHIBIDO */
font-sans { }      /* Tailwind default - no usa --btc-font-sans */
font-mono { }      /* Tailwind default - no usa --btc-font-mono */

/* ✅ OBLIGATORIO */
/* Las utilidades text-btc-* ya mapean a --btc-font-sans/mono via @theme inline */
```

---

### R5: Duraciones y Easing Estándar
```css
/* ❌ PROHIBIDO */
.transition { }           /* Sin duración definida */
.duration-300 { }         /* No está en escala */
.ease-in-out { }          /* No es --btc-ease-standard */

/* ✅ OBLIGATORIO */
.transition-colors { }    /* Duración base + easing standard */
.transition-opacity { }
.transition-transform { }
.transition-shadow { }
```

---

### R6: Elevation (Sombras) Solo Definidas
```css
/* ❌ PROHIBIDO */
.shadow { }       /* Tailwind default */
.shadow-xl { }    /* Tailwind default */

/* ✅ OBLIGATORIO */
.shadow-btc-1 { } /* elevation-1: 0 1px 2px */
.shadow-btc-2 { } /* elevation-2: 0 4px 12px */
.shadow-btc-3 { } /* elevation-3: 0 12px 32px */
.shadow-btc-4 { } /* elevation-4: 0 20px 48px */
.shadow-btc-5 { } /* elevation-5: 0 28px 64px */
```
**Validación**: `check:design` regla `only-btc-utilities` + R6 → **Error si falla**.
> **Nota**: Los tokens son `--btc-elevation-1` a `5` en `tokens.css`, mapeados a `--shadow-btc-1` a `5` en `globals.css` via `@theme inline`.

---

### R7: Z-Index Controlado
```css
/* ❌ PROHIBIDO */
.z-50 { }     /* Arbitrario */
.z-[9999] { } /* Magic number */

/* ✅ OBLIGATORIO */
/* Usar valores definidos en tokens.css --btc-z-* */
```
| Capa | Token | Utilidad | Valor |
|------|-------|----------|-------|
| Base | `--btc-z-base` | `z-btc-base` | 0 |
| Dropdown | `--btc-z-dropdown` | `z-btc-dropdown` | 100 |
| Sticky | `--btc-z-sticky` | `z-btc-sticky` | 200 |
| Modal | `--btc-z-modal` | `z-btc-modal` | 300 |
| Popover | `--btc-z-popover` | `z-btc-popover` | 400 |
| Tooltip | `--btc-z-tooltip` | `z-btc-tooltip` | 500 |
| Toast | `--btc-z-toast` | `z-btc-toast` | 600 |

**Validación**: `check:design` regla `z-index-controlled` → **Error si falla**.

---

### R8: Transiciones Solo Permitidas
```css
/* ❌ PROHIBIDO */
.transition-all { }
.transition { }

/* ✅ PERMITIDO */
.transition-colors { }
.transition-opacity { }
.transition-transform { }
.transition-shadow { }
```
**Propiedades permitidas**: `color`, `background-color`, `border-color`, `text-decoration-color`, `fill`, `stroke`, `opacity`, `transform`, `box-shadow`.

---

### R9: No `!important` (Salvo Excepciones)
```css
/* ❌ PROHIBIDO EN COMPONENTES */
.mi-clase { color: red !important; }

/* ✅ EXCEPCIÓN: Solo en globals.css @layer utilities */
@layer utilities {
  .text-balance { text-wrap: balance !important; } /* Utility de propósito único */
  .scrollbar-hide { scrollbar-width: none !important; }
  .scrollbar-hide::-webkit-scrollbar { display: none !important; }
}
```

---

### R10: Cero Lógica de Negocio en `@buildertech/ui`
```typescript
// ❌ PROHIBIDO EN src/
import { fetch } from '...';
import { supabase } from '...';
import { prisma } from '...';
import axios from 'axios';

// Cualquier uso de:
fetch(...)
supabase.from(...)
prisma.user.findMany()
axios.get(...)

// ✅ PERMITIDO EN apps/web/src/ (apps consumidoras)
```
**Validación**: `check:design` regla `no-business-logic` (grep `fetch|supabase|prisma|axios`) → **Error en `src/`**.

---

### R11: Componentes Son Presentacionales Únicamente
```tsx
// ❌ PROHIBIDO - Componente con lógica de negocio
export function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  useEffect(() => {
    fetch(`/api/users/${userId}`).then(r => r.json()).then(setUser); // LÓGICA DE NEGOCIO
  }, [userId]);
  return <div>{user?.name}</div>;
}

// ✅ CORRECTO - Componente presentacional
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

---

## ⚠️ Reglas de Advertencia (No Bloqueantes, Requieren Justificación)

### W1: Override de Tokens en App Consumidora
```css
/* apps/web/src/app/styles/globals.css */
@import "@buildertech/ui/styles/globals.css";

/* ⚠️ PERMITIDO CON JUSTIFICACIÓN DOCUMENTADA */
:root {
  --btc-bg-app: #fafafa; /* Solo si la app requiere fondo distinto al DS */
}
```
**Proceso**: Documentar en PR + issue → DS Owner aprueba.

---

### W2: Componente Wrapper en App (No en Paquete)
```tsx
// apps/web/src/components/ui/CustomCard.tsx
import { Card } from '@buildertech/ui';

/* ⚠️ PERMITIDO - Wrapper específico de app */
export function CustomCard({ children, ...props }) {
  return <Card variant="elevated" padding="lg" {...props}>{children}</Card>;
}
```
**Regla**: No replicar componente base, solo componer/extender.

---

### W3: Clases Utility Custom en App
```css
/* apps/web/src/app/styles/globals.css */
@layer utilities {
  /* ⚠️ PERMITIDO - Solo utilidades de propósito único no cubiertas por DS */
  .scrollbar-hide { scrollbar-width: none; }
  .scrollbar-hide::-webkit-scrollbar { display: none; }
}
```

---

## 🚫 Prohibiciones Absolutas (Nunca Permitidas)

| Prohibición | Motivo | Sanción |
|-------------|--------|---------|
| Forkear componente del DS en app | Deriva visual, deuda técnica | Revert inmediato, PR bloqueado |
| Definir `--btc-*` tokens en app | Rompe single source of truth | `check:design` error, revert |
| Importar `@librerias-ui-externas/*` en paquete | ADR-003: eliminadas | Build fail, dependency audit |
| Usar `class-variance-authority` | Reemplazado por `clsx` + `tailwind-merge` | Lint error |
| Hardcodear colores/espaciado/radios | Rompe theming, mantenimiento | `check:design` error |
| Lógica de negocio en `src/` | ADR-001, ADR-007 | `check:design` error, revert |
| Modificar `e2e/visual/snapshots/` sin aprobación | Baselines son contrato visual | Revert, DS Owner aprueba `-u` |

---

## 🔍 Procesos de Cumplimiento

### 1. Pre-Commit (Local - Husky)
```bash
# .husky/pre-commit
pnpm --filter @buildertech/ui check:design --scan-dirs=src
pnpm --filter @buildertech/ui lint --fix
```
**Falla** → Commit rechazado.

---

### 2. PR CI (GitHub Actions)
```yaml
# .github/workflows/quality.yml
- name: Quality Verify
  run: |
    pnpm --filter @buildertech/ui quality:verify
    # Incluye: typecheck, lint, check:design (paquete + apps), test
    # test:visual se ejecuta por separado (requiere Storybook local)
```
**Falla** → PR no mergeable.

---

### 3. Code Review (Obligatorio)
- **DS Owner** revisa: arquitectura, tokens, patrones, ADRs
- **1 reviewer adicional** revisa: implementación, tests, DX
- **Checklist** (ver `guias/contributing.md`) completado

---

### 4. Auditoría Periódica (Trimestral)
```bash
# Ejecutar en main branch
pnpm --filter @buildertech/ui check:design --scan-dirs=src,apps/web/src
# Reporte de:
# - Violaciones R1-R11
# - Excepciones W1-W3 activas
# - Deuda técnica acumulada
```
**Resultado**: Issue triage → plan de pago de deuda.

---

## 📋 Sanciones por Incumplimiento

| Severidad | Incumplimiento | Acción |
|-----------|----------------|--------|
| **Crítica** | R10 (lógica negocio en paquete), R11 (componente no presentacional) | Revert inmediato, PR bloqueado, issue post-mortem |
| **Alta** | R1-R9 (tokens/utilidades incorrectas), Prohibiciones absolutas | PR bloqueado hasta fix, DS Owner review requerido |
| **Media** | W1-W3 sin justificación documentada | Warning en PR, fix en follow-up obligatorio (max 1 sprint) |
| **Baja** | Warning `check:design` pre-existente no resuelto | Tech debt backlog, priorizar en sprint planning |

---

## 🛡️ Excepciones (Proceso Formal)

### Solicitud de Excepción
1. **Crear issue** tipo `exception-request` con:
   - Regla afectada (R1-R11, W1-W3)
   - Justificación técnica/negocio
   - Alternativas consideradas
   - Impacto si NO se concede
   - Plan de migración (cuándo se resolverá)

2. **Review**: DS Owner + Tech Lead
   - Aprobada → Documentada en `docs/exceptions.md` + comentario en código
   - Rechazada → Plan alternativo obligatorio

3. **Registro**: `docs/exceptions.md`
```markdown
# Excepciones Aprobadas

| ID | Regla | Archivo | Justificación | Aprobado | Expira | Plan Migración |
|----|-------|---------|---------------|----------|--------|----------------|
| EXC-001 | R1 | apps/web/src/app/styles/globals.css | Override --btc-bg-app para brand landing | 2026-11-01 | 2027-01-15 | Migrar a token DS v0.2 |
```

4. **Expiración**: Toda excepción tiene fecha límite. Renovación requiere nuevo proceso.

---

## 📊 Métricas de Cumplimiento (Dashboard)

| Métrica | Target | Frecuencia |
|---------|--------|------------|
| **`check:design` pass rate** | 100% en main | Cada PR |
| **Excepciones activas** | ≤ 3 | Trimestral |
| **Deuda técnica (warnings)** | 0 en `src/` | Sprint review |
| **Tiempo medio resolución excepción** | < 2 sprints | Trimestral |
| **Auditoría findings críticos** | 0 | Trimestral |

---

## 📝 Referencias

- `check:design` implementation: `scripts/check-design.ts`
- ADR-001: Package Workspace Source-Only
- ADR-002: CSS Distribution via @theme inline
- ADR-003: External UI Libraries Eliminated
- ADR-007: check:design Multi-Directory + Business Logic Guardrail
- `guias/contributing.md` — Checklist pre-PR
- `arquitectura/index.md` §1 — Qué SÍ/NO está en el paquete

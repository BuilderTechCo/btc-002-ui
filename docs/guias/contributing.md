# Contribuir a @buildertech/ui

> **Guía obligatoria** para PRs, issues y releases.
> **Versión**: 0.1.0 | **Fecha**: 2026-11-07

---

## 🚀 Flujo de Trabajo

### 1. Issue Primero

- **Nunca** PR sin issue asociado
- Tipos: `feature_request`, `bug_report`, `task_chore`, `exception-request`
- Template: `.github/ISSUE_TEMPLATE/`

### 2. Nomenclatura de Ramas

```bash
feat/issue-123-nuevo-componente
fix/issue-456-button-variant
chore/issue-789-update-deps
docs/issue-101-update-guide
```

### 3. Commits (Conventional Commits)

```bash
feat: add DropdownMenu compound component
fix: Button outline variant border color
chore: update dependencies
docs: update migration guide
```

### 4. Checklist de PR (Obligatorio)

#### Pre-Push (Local)

```bash
# 1. Quality verify completo
pnpm --filter @buildertech/ui quality:verify
# Incluye: typecheck, lint, check:design (src + apps/web), test
# test:visual se ejecuta por separado (requiere Storybook local)

# 2. Build exitoso
pnpm --filter @buildertech/ui build

# 3. Tests visuales sin diffs (ejecutar por separado)
pnpm --filter @buildertech/ui test:visual
```

#### En PR (GitHub)

- [ ] **Issue vinculado** en descripción (`Closes #123`)
- [ ] **DS Owner** como reviewer obligatorio
- [ ] **1 reviewer adicional** aprobado
- [ ] **Checklist técnico** completado:
  - [ ] `check:design` 0 errores en `src/`
  - [ ] TypeScript 0 errores
  - [ ] Lint 0 warnings
  - [ ] Build exitoso
  - [ ] Tests visuales 0 diffs (8 proyectos)
  - [ ] Accesibilidad: focus visible, contraste AA, semántica HTML
  - [ ] `forwardRef` + `displayName` en componentes nuevos
  - [ ] Props extendidas de elemento HTML nativo
  - [ ] Sin lógica negocio en `src/` (R10)
  - [ ] Documentación actualizada (ver abajo)

#### Documentación Requerida por Tipo

| Tipo PR | Docs a Actualizar |
|---------|-------------------|
| **Nuevo componente** | `tokens/api-spec.md`, `componentes/guide.md`, `CHANGELOG.md`, `componentes/adding.md` |
| **Cambio API breaking** | `tokens/api-spec.md`, `componentes/guide.md`, `CHANGELOG.md`, `guias/migration-guide.md` |
| **Fix visual/token** | `tokens/visual-palette.md`, `tokens/layout-sizing.md`, `CHANGELOG.md` |
| **Fix bug** | `CHANGELOG.md` (referencia issue) |
| **Solo docs** | Archivo modificado + `CHANGELOG.md` si relevante |
| **Chore/deps** | `CHANGELOG.md` si afecta consumidores |

---

## 🧪 Testing

### Unit Tests (En Apps Consumidoras)

```tsx
// apps/web/src/test/unit/button.test.tsx
import { renderToStaticMarkup } from 'react-dom/server';
import { Button } from '@buildertech/ui';

test('Button primary render', () => {
  const html = renderToStaticMarkup(<Button variant="primary">Click</Button>);
  expect(html).toContain('bg-btc-brand');
  expect(html).toContain('text-btc-on-brand');
  expect(html).toContain('rounded-btc-md');
});
```

### Visual Regression (Playwright)

```ts
// e2e/visual/button.visual.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Button visual regression', () => {
  const variants = ['primary', 'outline', 'ghost', 'danger', 'danger-outline', 'info', 'info-outline'];
  const sizes = ['sm', 'md', 'lg'];

  for (const variant of variants) {
    for (const size of sizes) {
      test(`${variant}-${size} light`, async ({ page }) => {
        await page.goto('/test/button', { waitUntil: 'networkidle' });
        await page.evaluate(([v, s]) => {
          document.documentElement.setAttribute('data-theme', 'light');
        }, [variant, size]);
        await expect(page.locator('[data-testid="button"]')).toHaveScreenshot(
          `button-${variant}-${size}-light.png`,
          { maxDiffPixels: 100 }
        );
      });

      test(`${variant}-${size} dark`, async ({ page }) => {
        await page.goto('/test/button', { waitUntil: 'networkidle' });
        await page.evaluate(([v, s]) => {
          document.documentElement.setAttribute('data-theme', 'dark');
        }, [variant, size]);
        await expect(page.locator('[data-testid="button"]')).toHaveScreenshot(
          `button-${variant}-${size}-dark.png`,
          { maxDiffPixels: 100 }
        );
      });
    }
  }
});
```

### Actualizar Snapshots (Solo DS Owner)

```bash
# SOLO DS Owner tras aprobación
pnpm --filter @buildertech/ui test:visual --update-snapshots
```

---

## 📦 Release Process

### Versionado (Changesets)

```bash
# 1. Crear changeset
pnpm changeset
# Seleccionar: patch / minor / major
# Escribir resumen: "feat: add DropdownMenu component"

# 2. Version bump
pnpm changeset:version
# Actualiza package.json + CHANGELOG.md

# 3. Commit + tag
git add .
git commit -m "chore: version bump [skip ci]"
git tag v0.1.x

# 4. Publish (CI automático en push tag)
git push origin main --tags
```

### GitHub Actions (CI/CD)

```yaml
# .github/workflows/release.yml
on:
  push:
    tags: ['v*']

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - run: pnpm install --frozen-lockfile
      - run: pnpm --filter @buildertech/ui build
      - run: pnpm --filter @buildertech/ui quality:verify
      - run: npm publish --registry=https://npm.pkg.github.com
        env:
          NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

---

## 🏷️ Convenciones de Código

### TypeScript

- **Strict mode** obligatorio
- **No `any`** — usar `unknown` + type guards
- **Interfaces** para props públicas
- **Type exports** en barrel (`export type { Props }`)

### React

- **Function components** + hooks
- **`forwardRef`** obligatorio en componentes base
- **`displayName`** para debugging
- **Compound components** via `Object.assign`

### Estilos

- **Solo utilidades `btc-*`** (R1)
- **Espaciado escala 4px** (R2)
- **Radios definidos** (R3)
- **Transiciones permitidas** (R8)
- **No `!important`** (R9)

### Accesibilidad (Mínimo)

- Focus visible: `focus-visible:ring-2 focus-visible:ring-btc-border-focus`
- Contraste AA en todas las variantes (ver `tokens/visual-palette.md`)
- Semántica HTML correcta (`<button>`, `<label>`, `<hr>`, `<dialog>`)
- `aria-disabled`, `aria-invalid`, `aria-label`, `aria-describedby` según corresponda
- Focus trap + restoration en Dialog/Modal/Dropdown

---

## 📁 Estructura del Repo

```
.
├── src/
│   ├── index.ts                    # Barrel principal
│   ├── styles/
│   │   ├── tokens.css              # Variables CSS --btc-*
│   │   └── globals.css             # @theme inline → utilidades btc-*
│   ├── lib/
│   │   ├── classnames.ts           # clsx + tailwind-merge
│   │   ├── icon.tsx                # Wrapper Lucide semántico
│   │   └── fonts.ts                # next/font helpers
│   ├── test/                       # Setup Vitest (setup.ts)
│   └── components/
│       ├── button/
│       ├── card/
│       └── ... (23 total)
├── e2e/
│   ├── visual/                     # Playwright specs (8 proyectos)
│   └── support/                    # global-setup, utils, test-iframe
├── scripts/                        # Scripts de validación
│   ├── check-design.ts
│   ├── check-component-contract.mjs
│   └── register.mjs
├── docs/
│   ├── adrs/                       # ADR-001 a ADR-008 + index.md
│   ├── arquitectura/
│   ├── componentes/
│   ├── gobernanza/
│   ├── guias/
│   └── tokens/
├── CHANGELOG.md                    # Raíz — único changelog oficial
├── package.json
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── tsconfig.json
├── tsconfig.build.json
├── tsconfig.eslint.json
├── vitest.config.ts
├── playwright.config.ts
└── eslint.config.js
```

---

## 🚫 Lo Que NO Va en Este Repo

| ❌ No Incluir | Dónde Va |
|---------------|----------|
| Tests E2E / Playwright configs de app | `apps/web/` |
| AppShell, Topbar, Sidebar, Layouts | `apps/web/src/components/` |
| Wrappers de componentes (CustomCard) | `apps/web/src/components/ui/` |
| Lógica de negocio (fetch, supabase, prisma, axios) | `apps/web/src/` |
| Override de tokens sin justificación | `apps/web/src/app/styles/globals.css` (con W1 documentado) |
| `node_modules`, `dist`, `.next` | `.gitignore` |

---

## 📞 Contacto

- **DS Owner**: @ds-owner (aprobación obligatoria en PRs)
- **Tech Lead**: @tech-lead (arquitectura, excepciones)
- **Slack**: `#design-system`
- **Issues**: GitHub Issues con templates

---

## ✅ Quick Reference — Pre-Push Checklist

```bash
# Ejecutar ANTES de push
pnpm --filter @buildertech/ui quality:verify
pnpm --filter @buildertech/ui build
pnpm --filter @buildertech/ui test:visual

# Verificar docs actualizadas
git diff --name-only | grep -E '\.md$|CHANGELOG'
```

> **Si algo falla → No push. Fix primero.**

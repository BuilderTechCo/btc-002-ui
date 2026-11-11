# Contribuir a @buildertechco/ui

> **Guía obligatoria** para issues, PRs, validación y releases.
> **Versión**: 0.2.0 (borrador, no publicado) | **Fecha**: 2026-11-11

---

## 1. Flujo de trabajo

### 1.1 Issue primero

- **Nunca** abras un PR sin issue asociado.
- Tipos: `feature_request`, `bug_report`, `task_chore`, `exception-request`.
- Templates en `.github/ISSUE_TEMPLATE/`.

### 1.2 Nomenclatura de ramas

```bash
feat/issue-123-nuevo-componente
fix/issue-456-button-variant
chore/issue-789-update-deps
docs/issue-101-update-guide
```

### 1.3 Commits (Conventional Commits)

```bash
feat: add DropdownMenu compound component
fix: correct Select multiple keyboard handling
docs: update migration guide for Tailwind v4
chore: update dev dependencies
```

### 1.4 PR

- Vincula el issue (`Closes #123`).
- DS Owner como reviewer obligatorio.
- Un reviewer adicional.
- Completa el checklist técnico y de documentación.

---

## 2. Checklist pre-push

Ejecuta desde la raíz del repositorio:

```bash
# 1. Tipos y lint
pnpm typecheck
pnpm lint

# 2. Formato de todo el repositorio
pnpm format:check

# 3. Reglas visuales y guardarraíl
pnpm check:design

# 4. Contrato de archivos y exports
pnpm check:component-files
pnpm check:contract
pnpm check:suppressions

# 5. Tests unit + integration
pnpm test

# 6. Stories en Chromium
pnpm test:storybook

# 7. Build
pnpm build

# 8. Consumo del paquete con Vite/Tailwind
pnpm test:consumer

# 9. Consistencia de documentación de consumo y PR
pnpm test:docs-contract
```

`pnpm format` aplica Prettier a todo el repositorio y `pnpm format:check` lo verifica sin modificar archivos. Para formatear archivos concretos, usa `pnpm exec prettier --write <archivos>`. Los artefactos generados y el lockfile están excluidos por `.prettierignore`.

Atajos:

| Comando                   | Incluye                                                                               |
| :------------------------ | :------------------------------------------------------------------------------------ |
| `pnpm quality:verify`     | `typecheck` + `lint` + `check:design` + `test`                                        |
| `pnpm test:static`        | `typecheck` + `lint` + checks de componentes, exports, suppressions y documentación   |
| `pnpm test:consumer`      | Requiere `pnpm build`; valida barrel, subrutas JS no Next y estilos con Vite/Tailwind |
| `pnpm test:docs-contract` | Valida nombre/scope, guía de instalación y comandos del template de PR                |

> `quality:verify` **no** incluye `test:storybook` ni `test:visual`: requieren Chromium/Storybook.
> `prepublishOnly` ejecuta quality, checks de componentes/exports/docs, build y `test:consumer`; no ejecuta suites de navegador.

### 2.1 Regresión visual

```bash
pnpm test:visual
```

- 8 proyectos (4 viewports × 2 temas), 22 specs y 3285 snapshots locales no versionados. En un checkout limpio faltan los baselines.
- El `webServer` arranca Storybook en local si no está corriendo.
- Los proyectos Playwright establecen el viewport. `testComponent` itera nombres de viewports para los snapshots, pero no llama por sí mismo a `page.setViewportSize`; no interpretar esa iteración como cambio de tamaño dentro de un proyecto.
- **No forma parte del pipeline base.** Ejecútala antes de un release o si cambias tokens/layout.
- **No actualices snapshots sin aprobación del DS Owner**:

```bash
pnpm test:visual --update-snapshots
```

### 2.2 Requisito de Chromium

```bash
pnpm exec playwright install chromium
```

`test:storybook` y `test:visual` usan Chromium de Playwright (versión resuelta actual: 1.65.0 → Chromium 1254).

---

## 3. Documentación requerida por tipo de PR

| Tipo de PR                | Documentos a actualizar                                                                                                                                                 |
| :------------------------ | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Nuevo componente**      | `docs/tokens/especificacion-api.md`, `docs/componentes/guia.md`, `docs/componentes/agregar-componente.md` (si cambia el proceso), `README.md` (conteos), `CHANGELOG.md` |
| **Cambio de API**         | `docs/tokens/especificacion-api.md`, `docs/componentes/guia.md`, `docs/guias/guia-migracion.md`, `CHANGELOG.md`                                                         |
| **Token o estilo visual** | `docs/tokens/paleta-visual.md`, `docs/tokens/dimensiones-disposicion.md`, `CHANGELOG.md`                                                                                |
| **Regla de validación**   | `docs/gobernanza/cumplimiento.md`, `docs/adrs/007-check-design-multiples-directorios.md`, `scripts/check-design.ts`, `CHANGELOG.md`                                     |
| **Fix de bug**            | `CHANGELOG.md` con referencia al issue                                                                                                                                  |
| **Solo docs**             | Archivo modificado; `CHANGELOG.md` si afecta a consumidores                                                                                                             |
| **Chore/deps**            | `CHANGELOG.md` si afecta a consumidores                                                                                                                                 |

La documentación es la fuente de verdad: si el código y los docs difieren, el PR debe reconciliarlos.

---

## 4. Testing

### 4.1 Capas

| Capa        | Comando               | Entorno  | Alcance                                     |
| :---------- | :-------------------- | :------- | :------------------------------------------ |
| Unit        | `pnpm test`           | Node     | Utilidades puras, classnames, iconos, tipos |
| Integration | `pnpm test`           | jsdom    | Componentes: eventos, foco, teclado, ARIA   |
| Stories     | `pnpm test:storybook` | Chromium | Render de las 21 stories                    |
| Visual      | `pnpm test:visual`    | Chromium | 4 viewports × 2 temas                       |

**Verificación actual (2026-11-10):** `pnpm test` pasó dos veces (**334/334** en ambas); `pnpm test:storybook` pasó **255 tests en 21 archivos**; `pnpm check:design` terminó con **0 violaciones**. También pasaron `pnpm test:static`, `pnpm format:check`, `pnpm quality:verify`, `pnpm build`, `pnpm build-storybook`, `pnpm test:consumer`, `npm pack --dry-run` y `pnpm install --frozen-lockfile --offline`. El smoke test validó el barrel raíz, 23 subrutas JavaScript no específicas de Next y ambas subrutas CSS con Vite/Tailwind. `pnpm test:visual` no se ejecutó y permanece como deuda: los snapshots no están versionados y faltan en un checkout limpio.

### 4.2 Unit test

```ts
// src/lib/classnames/classnames.test.ts
import { describe, expect, test } from "vitest";
import { clsx } from "./classnames";

test("combina clases", () => {
  expect(clsx("p-btc-4", "text-btc-text-primary")).toBe(
    "p-btc-4 text-btc-text-primary",
  );
});
```

### 4.3 Integration test

```tsx
// src/components/button/button.test.tsx
import { test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "./button";

test("emite onClick", async () => {
  const onClick = vi.fn();
  render(<Button onClick={onClick}>Guardar</Button>);

  await userEvent.click(screen.getByRole("button", { name: "Guardar" }));
  expect(onClick).toHaveBeenCalledOnce();
});
```

### 4.4 Story

```tsx
// src/components/button/button.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./button";

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: { variant: "primary", children: "Guardar" },
};
```

### 4.5 Qué testear

- Comportamiento visible y contrato de clases `btc-*`.
- Eventos, foco, teclado, `Escape`, click fuera y ARIA.
- Estados: `loading`, `disabled`, `error`, `open`, `selected`.
- No testees detalles internos de implementación.

---

## 5. Convenciones de código

### TypeScript

- `strict` obligatorio; sin `any`.
- `interface` para props públicas; `type` para uniones y aliases.
- Exporta los tipos públicos en el barrel.
- `Omit` cuando sobrescribes props nativas (`onChange`, `size`, `value`, etc.).

### React

- Function components + hooks.
- `forwardRef` + `displayName` en componentes base.
- Compound components con `Object.assign` (`Card`, `Dialog`, `DropdownMenu`).
- Iconos por nombre (`leftIcon="plus"`), no como `ReactNode`.

### Estilos

- Solo utilidades `btc-*`.
- Espaciado `0, 1, 2, 3, 4, 6, 8, 12, 16`.
- Sin `!important` (salvo `globals.css` en `@layer utilities`).
- Sin `transition-all`.
- Sin colores, radios, sombras o z-index fuera de tokens.

### Accesibilidad

- HTML nativo correcto (`button`, `a`, `label`, `hr`, `table`).
- Nombre accesible en todos los controles.
- Foco visible: `focus-visible:ring-2 focus-visible:ring-btc-border-focus`.
- Estados ARIA cuando corresponda (`aria-disabled`, `aria-invalid`, `aria-expanded`, `aria-selected`, `aria-sort`).
- Focus trap y restauración en `Dialog`.
- La última evidencia documentada de axe indica que se resolvieron las violaciones `color-contrast` conocidas; axe no se ejecutó el 2026-11-10.
- El contraste del botón primario está resuelto en la paleta actual (coral-700 con blanco: 5.11:1). Ver `docs/tokens/paleta-visual.md` §6.

---

## 6. Estructura del repositorio

```text
.
├── src/
│   ├── index.ts                    # Barrel principal
│   ├── styles/
│   │   ├── tokens.css              # Variables --btc-*
│   │   └── globals.css             # @theme inline → utilidades btc-*
│   ├── lib/
│   │   ├── classnames/             # clsx + tailwind-merge
│   │   ├── icon/                   # Wrapper Lucide
│   │   └── fonts/                  # Helpers next/font
│   ├── test/
│   │   ├── setup.ts                # Integration (jsdom)
│   │   └── setup-unit.ts           # Unit (Node)
│   └── components/                 # 21 directorios / 23 componentes
│       ├── button/
│       ├── card/
│       ├── dialog/
│       └── ...
├── e2e/
│   ├── visual/                     # 22 specs + snapshots
│   └── support/                    # global setup/teardown y utilidades
├── scripts/                        # check-design, contract, files, suppressions, build
├── .storybook/                     # main.ts, preview.tsx, preview-head.html, vitest.setup.ts
├── docs/                           # Arquitectura, ADRs, componentes, tokens, guías
├── vitest.workspace.ts             # unit + integration + storybook
├── playwright.config.ts            # 8 proyectos visuales
├── CHANGELOG.md
└── package.json
```

---

## 7. Lo que no va en este repo

| ❌ No incluir                                              | Dónde va                         |
| :--------------------------------------------------------- | :------------------------------- |
| AppShell, Topbar, Sidebar, layouts                         | App consumidora                  |
| Lógica de negocio (`fetch`, `supabase`, `prisma`, `axios`) | App consumidora                  |
| Wrappers específicos de app                                | App consumidora (W2)             |
| Overrides de tokens sin justificación                      | App consumidora (W1 documentado) |
| Tests E2E de flujos de negocio                             | App consumidora                  |
| `node_modules`, `dist`, `coverage`, `storybook-static`     | Ignorados                        |

---

## 8. Release

**No hay CI, Husky ni Changesets instalados.** El release es manual.

Para publicar, configura en el `.npmrc` de usuario un token con permiso `write:packages` (no lo guardes en el repositorio). La instalación desde consumidores solo requiere `read:packages`.

```bash
# 1. Validación completa
pnpm quality:verify
pnpm test:storybook

# 2. Build
pnpm build

# 3. Actualizar versión y changelog manualmente
#    - package.json → version
#    - CHANGELOG.md → mover [Unreleased] a la versión y fecha
#    - No publicar mientras la entrada siga marcada como borrador

# 4. Commit y tag
git add package.json CHANGELOG.md
git commit -m "chore: release vX.Y.Z"
git tag vX.Y.Z

# 5. Publicar (prepublishOnly ejecuta los gates configurados en package.json)
pnpm publish --registry=https://npm.pkg.github.com
```

> El script `release` (`changeset publish`) se eliminó de `package.json` porque Changesets no está instalado. El release actual es manual. Si se adopta Changesets en el futuro, se documentará en un ADR y se añadirá la dependencia.

### Versionado

- `0.x`: desarrollo activo; breaking changes permitidos en minor. Estado actual: `0.1.0` publicado, `0.2.0` en preparación y sin publicar.
- `1.0.0`: objetivo de congelación de API y SemVer estricto.
- Publicación en GitHub Packages con `publishConfig.access: restricted`.

---

## 9. Contacto y revisión

- **DS Owner**: aprobación obligatoria de API, tokens, a11y y excepciones.
- **Tech Lead**: arquitectura y excepciones.
- **Issues**: GitHub Issues con los templates del repositorio.
- **Documentación**: `docs/` es la fuente de verdad; `CHANGELOG.md` es el historial oficial.

---

## 10. Quick reference

```bash
pnpm build
pnpm check:component-files
pnpm check:contract
pnpm check:design
pnpm check:suppressions
pnpm format -- <archivos>
pnpm format:check -- <archivos>
pnpm lint
pnpm publish --registry=https://npm.pkg.github.com
pnpm quality:verify        # typecheck + lint + check:design + test
pnpm storybook             # catálogo en http://127.0.0.1:6006
pnpm test                  # unit + integration
pnpm test:consumer         # build de consumo con Vite/Tailwind
pnpm test:coverage         # cobertura unit + integration
pnpm test:docs-contract    # scope, instalación y comandos documentados
pnpm test:static           # typecheck + lint + contracts
pnpm test:storybook        # stories en Chromium
pnpm test:visual           # regresión visual (8 proyectos)
pnpm typecheck
```

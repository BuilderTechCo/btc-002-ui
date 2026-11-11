# Añadir un componente — @buildertechco/ui

> **Proceso obligatorio** para contribuir un componente nuevo al paquete.
> **Versión**: 0.1.0 | **Fecha**: 2026-11-09

---

## 1. Checklist previo

- [ ] **Issue creado** (`feature_request`) con caso de uso, props propuestas, variantes y requisitos de accesibilidad.
- [ ] **Aprobación del DS Owner** antes de implementar.
- [ ] **No duplica** un componente existente (revisa `src/components/`).
- [ ] **Es presentacional**: sin `fetch`, `supabase`, `prisma`, `axios` ni lógica de dominio.
- [ ] **Tiene tokens**: colores, spacing, radios, sombras y movimiento salen de `--btc-*`.
- [ ] **Tiene historia**: se puede describir y probar de forma aislada en Storybook.

---

## 2. Estructura requerida

`check:component-files` exige **cuatro archivos** por componente:

```text
src/components/mi-componente/
├── mi-componente.tsx           # Implementación + tipos
├── mi-componente.test.tsx      # Tests de integración (jsdom)
├── mi-componente.stories.tsx   # Storybook (CSF3)
└── index.ts                    # Barrel del componente
```

> Los tests viven co-locados con el componente. Los tests de utilidades puras viven en `src/lib/**/*.test.ts` (proyecto `unit`, entorno Node).

---

## 3. Template de componente

```tsx
// src/components/mi-componente/mi-componente.tsx
"use client"; // solo si usa hooks, eventos o APIs del navegador

import { forwardRef, type HTMLAttributes } from "react";
import { clsx } from "../../lib/classnames";
import { Icon } from "../../lib/icon";

export type MiComponenteVariant = "default" | "outlined" | "elevated";
export type MiComponenteSize = "sm" | "md" | "lg";

export interface MiComponenteProps extends HTMLAttributes<HTMLDivElement> {
  /** Variante visual */
  variant?: MiComponenteVariant;
  /** Tamaño */
  size?: MiComponenteSize;
  /** Icono por nombre (no ReactNode) */
  icon?: string;
  /** Categoría del icono */
  iconCategory?: "nav" | "action" | "status" | "empty";
}

const variantClasses: Record<MiComponenteVariant, string> = {
  default: "bg-btc-surface border border-btc-border-default",
  outlined: "bg-transparent border border-btc-border-strong",
  elevated: "bg-btc-surface border-none shadow-btc-2",
};

const sizeClasses: Record<MiComponenteSize, string> = {
  sm: "p-btc-2 text-btc-caption gap-btc-1",
  md: "p-btc-4 text-btc-body-s gap-btc-2",
  lg: "p-btc-6 text-btc-body gap-btc-3",
};

export const MiComponente = forwardRef<HTMLDivElement, MiComponenteProps>(
  (
    {
      variant = "default",
      size = "md",
      icon,
      iconCategory = "action",
      className = "",
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={clsx(
          "inline-flex items-center rounded-btc-md",
          "transition-btc-colors duration-btc-fast ease-btc-standard",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-btc-border-focus",
          variantClasses[variant],
          sizeClasses[size],
          className,
        )}
        {...props}
      >
        {icon && (
          <Icon
            name={icon}
            category={iconCategory}
            size="sm"
            aria-hidden="true"
          />
        )}
        {children}
      </div>
    );
  },
);

MiComponente.displayName = "MiComponente";
```

### Reglas del template

- `forwardRef` + `displayName` en componentes base.
- Extiende las props del elemento nativo; usa `Omit` si sobrescribes `onChange`, `size`, `value`, etc.
- Iconos por **nombre** (`string`), nunca como componente.
- Clases solo `btc-*`; spacing `0,1,2,3,4,6,8,12,16`.
- Sin `!important`, sin `transition-all`, sin valores arbitrarios de color.
- Usa `type` en lugar de `interface` si la props no se extiende.
- Si el componente es compound, usa `Object.assign`:

```tsx
export const MiComponente = Object.assign(MiComponenteRoot, {
  Header: MiComponenteHeader,
  Content: MiComponenteContent,
});
```

Los sub-componentes también deben exportarse por nombre desde `index.ts` y el barrel raíz.

---

## 4. Barrel del componente

```ts
// src/components/mi-componente/index.ts
export {
  MiComponente,
  MiComponenteHeader,
  MiComponenteContent,
} from "./mi-componente";
export type {
  MiComponenteProps,
  MiComponenteVariant,
  MiComponenteSize,
  MiComponenteHeaderProps,
  MiComponenteContentProps,
} from "./mi-componente";
```

---

## 5. Test de integración

```tsx
// src/components/mi-componente/mi-componente.test.tsx
import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import { MiComponente } from "./mi-componente";

describe("miComponente", () => {
  test("renderiza el contenido y la variante por defecto", () => {
    render(<MiComponente>Contenido</MiComponente>);

    const element = screen.getByText("Contenido");
    expect(element).toBeInTheDocument();
    // eslint-disable-next-line testing-library/no-node-access -- se valida la clase del wrapper
    expect(element.parentElement).toHaveClass("bg-btc-surface");
  });

  test("aplica la variante elevada", () => {
    render(<MiComponente variant="elevated">Elevado</MiComponente>);
    // eslint-disable-next-line testing-library/no-node-access -- se valida la clase del wrapper
    expect(screen.getByText("Elevado").parentElement).toHaveClass(
      "shadow-btc-2",
    );
  });
});
```

- Usa Testing Library: `render`, `screen`, `userEvent`.
- Testea comportamiento (eventos, foco, teclado, ARIA), no solo clases.
- Si necesitas clases, justifica el `eslint-disable` como en los tests existentes.
- Los tests de integración corren en jsdom (`pnpm test`).

---

## 6. Story de Storybook

```tsx
// src/components/mi-componente/mi-componente.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import { MiComponente } from "./mi-componente";

const meta: Meta<typeof MiComponente> = {
  title: "Components/MiComponente",
  component: MiComponente,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "outlined", "elevated"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof MiComponente>;

export const Default: Story = {
  args: {
    children: "Mi componente",
  },
};

export const Elevated: Story = {
  args: {
    variant: "elevated",
    children: "Elevado",
  },
};
```

- Título `Components/<Nombre>`.
- `tags: ["autodocs"]`.
- `argTypes` para props relevantes.
- Si hay interacción, añade `play` con `@storybook/test`.
- La story debe renderizar sin errores en Chromium y sin violaciones nuevas de axe.

---

## 7. Exports públicos

### 7.1 Barrel raíz

```ts
// src/index.ts
export { MiComponente } from "./components/mi-componente";
export type {
  MiComponenteProps,
  MiComponenteVariant,
  MiComponenteSize,
} from "./components/mi-componente";
```

### 7.2 Subpath en `package.json`

Añade el subpath junto a los demás componentes:

```json
"./mi-componente": {
  "types": "./dist/components/mi-componente/index.d.ts",
  "import": "./dist/components/mi-componente/index.js",
  "default": "./dist/components/mi-componente/index.js"
}
```

`check:contract` verifica que los exports de `package.json` coincidan con `src/` y que el build genere los archivos.

### 7.3 Contrato de archivos

El componente debe pasar:

```bash
pnpm check:component-files
pnpm check:contract
```

---

## 8. Documentación obligatoria

| Archivo                             | Qué actualizar                      |
| :---------------------------------- | :---------------------------------- |
| `docs/tokens/especificacion-api.md` | Props, tipos, comportamiento y a11y |
| `docs/componentes/guia.md`          | Ejemplo de uso real                 |
| `README.md`                         | Conteo de componentes, si cambia    |
| `CHANGELOG.md`                      | Entrada en `[Unreleased]`           |
| `docs/arquitectura/indice.md`       | Estructura, si añade carpeta        |
| `CLASIFICACION.md`                  | Solo si cambia la suite de tests    |

---

## 9. Validación

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm check:design
pnpm check:component-files
pnpm check:contract
pnpm test:storybook
pnpm build
```

- `check:design` escanea `src/` por defecto. **No acepta `--scan-dirs`**; si necesitas otros directorios, configura `checkDesign.scanDirs` en `package.json` (opcional, no definido actualmente).
- `test:storybook` requiere Chromium: `pnpm exec playwright install chromium`.
- `test:visual` solo se ejecuta antes de un release y con aprobación para actualizar snapshots.

---

## 10. Checklist de accesibilidad

- [ ] Elemento HTML nativo correcto (`button`, `a`, `label`, `hr`, `table`).
- [ ] Nombre accesible (`aria-label`, texto visible o `aria-labelledby`).
- [ ] Estados (`aria-disabled`, `aria-invalid`, `aria-expanded`, `aria-selected`) cuando aplique.
- [ ] Navegación por teclado (Tab, Enter, Espacio, Escape, flechas si es un widget compuesto).
- [ ] Foco visible con `focus-visible:ring-2`.
- [ ] Sin violaciones nuevas en el panel de accesibilidad de Storybook.
- [ ] Contraste AA; si hay deuda, se documenta en `paleta-visual.md`.

---

## 11. Checklist final

- [ ] 4 archivos requeridos creados.
- [ ] Componente exportado en `index.ts` del componente, barrel raíz y `package.json`.
- [ ] Tests de integración verdes.
- [ ] Story renderiza en Storybook.
- [ ] `pnpm quality:verify` verde.
- [ ] `pnpm test:storybook` verde.
- [ ] Documentación y changelog actualizados.
- [ ] Sin lógica de negocio en `src/`.

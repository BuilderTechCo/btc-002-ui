# Guía de Componentes — @buildertech/ui

> **Versión**: 0.1.0 | **Fecha**: 2026-11-07 | **Estado**: Validado

---

## 📦 Componentes Disponibles (23 Total)

| Categoría | Componentes | Count |
|-----------|-------------|-------|
| **Base** | Button, Card, Dialog, Select, Table, NavLink, Badge, Textfield, EmptyState, LoadingState, ErrorState, ErrorPage, CopyButton, BackButton, ThemeToggle, Skeleton | 16 |
| **Primitivas Nativas** | Label, Separator, Slot, Toast, DropdownMenu | 7 (types: type aliases) |
| **Total** | | **23** |

---

## 🚀 Inicio Rápido

### Instalación
```bash
# En monorepo (pnpm workspace)
pnpm add @buildertech/ui --workspace --filter=apps/web

# O desde GitHub Packages
npm install @buildertech/ui@0.1.0 --registry=https://npm.pkg.github.com
```

### Configuración Tailwind (App Consumidora)
```js
// apps/web/tailwind.config.ts
import type { Config } from 'tailwindcss';

export default {
  content: [
    './src/**/*.{ts,tsx}',
    // IMPORTANTE: incluir node_modules del paquete para que Tailwind genere utilidades btc-*
    '../../node_modules/@buildertech/ui/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config;
```

### Importar Estilos Globales
```css
/* apps/web/src/app/globals.css */
@import "@buildertech/ui/styles/globals.css";

/* Opcional: override tokens con justificación documentada (ver gobernanza/enforcement.md W1) */
:root {
  /* --btc-bg-app: #fafafa; */
}
```

### Provider Requerido (Toast)
```tsx
// apps/web/src/app/providers.tsx
'use client';

import { ToastProvider, ToastViewport } from '@buildertech/ui';
import { ReactNode } from 'react';

export function UIProviders({ children }: { children: ReactNode }) {
  return (
    <ToastProvider position="top-right" maxToasts={5}>
      {children}
      <ToastViewport />
    </ToastProvider>
  );
}
```

```tsx
// apps/web/src/app/layout.tsx
import { UIProviders } from './providers';

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <UIProviders>{children}</UIProviders>
      </body>
    </html>
  );
}
```

---

## 🎨 Tokens de Diseño — Utilidades Tailwind Generadas

El paquete expone variables CSS `--btc-*` mapeadas a utilidades `btc-*` via `@theme inline`:

| Categoría | Tokens CSS | Utilidades Tailwind | Validación |
|-----------|------------|---------------------|------------|
| **Colores** | `--btc-bg-*`, `--btc-text-*`, `--btc-border-*`, `--btc-action-*` | `bg-btc-*`, `text-btc-*`, `border-btc-*`, `hover:bg-btc-*` | R1 |
| **Espaciado** | `--btc-space-1` a `16` | `p-btc-*`, `m-btc-*`, `gap-btc-*`, `space-btc-*` | R2 |
| **Radios** | `--btc-radius-xs` a `full` | `rounded-btc-*` | R3 |
| **Sombras** | `--btc-elevation-1` a `5` | `shadow-btc-1` a `5` | R6 |
| **Z-Index** | `--btc-z-base` a `toast` | `z-btc-base` a `z-btc-toast` | R7 |
| **Tipografía** | `--btc-font-sans/mono/display` | `text-btc-display` a `text-btc-caption` | R4 |
| **Transiciones** | `--btc-duration-*`, `--btc-ease-*` | `duration-btc-*`, `ease-btc-*` | R5, R8 |

> **Ver detalle**: `tokens/layout-sizing.md` + `tokens/visual-palette.md` + `gobernanza/enforcement.md`

---

## 🧩 Uso de Componentes — Ejemplos Reales

### Button (7 variantes, iconos, fullWidth)
```tsx
import { Button, Icon } from '@buildertech/ui';

<Button variant="primary" size="md" onClick={handleClick}>
  Guardar
</Button>

<Button variant="outline" leftIcon={<Icon name="download" category="action" size="sm" />}>
  Descargar
</Button>

<Button variant="danger" rightIcon={<Icon name="trash" category="action" size="sm" />} fullWidth>
  Eliminar
</Button>

<Button variant="info-outline" loading disabled>
  Procesando...
</Button>
```

**Variantes**: `primary`, `outline`, `ghost`, `danger`, `danger-outline`, `info`, `info-outline`
**Tamaños**: `sm` (h-8), `md` (h-10), `lg` (h-12)

---

### Card (6 sub-componentes)
```tsx
import { Card, Button, Icon } from '@buildertech/ui';

<Card variant="default" padding="md">
  <Card.Header>
    <Icon name="users" category="nav" size="md" />
    <Card.Title as="h3">Usuarios</Card.Title>
  </Card.Header>
  <Card.Description>Lista de usuarios activos</Card.Description>
  <Card.Content>
    <UserList />
  </Card.Content>
  <Card.Actions>
    <Button variant="ghost" size="sm">Ver todos</Button>
    <Button variant="primary" size="sm">Nuevo</Button>
  </Card.Actions>
</Card>
```

**Sub-componentes**: `Header`, `Title`, `Description`, `Content`, `Footer`, `Actions`
**Variantes**: `default` (shadow-btc-1), `outlined` (border-btc-border-default), `elevated` (shadow-btc-3)
**Padding**: `none`, `sm` (p-btc-3), `md` (p-btc-4), `lg` (p-btc-6)

---

### Dialog (Props-based Controlado)
```tsx
import { Dialog, Button } from '@buildertech/ui';
import { useState } from 'react';

function ConfirmDelete() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="danger" onClick={() => setOpen(true)}>Eliminar</Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="Confirmar eliminación"
        description="Esta acción no se puede deshacer."
        size="md"
        align="center"
      >
        <Dialog.Footer>
          <Button variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button>
          <Button variant="danger" onClick={() => { /* delete */ setOpen(false); }}>
            Eliminar
          </Button>
        </Dialog.Footer>
      </Dialog>
    </>
  );
}
```

**Props**: `open` (required), `onClose` (required), `title`, `description`, `children`, `size` (`sm`/`md`/`lg`/`xl`/`full`), `align` (`center`/`top`/`bottom`), `closeOnOverlayClick`, `closeOnEscape`, `portal`, `portalId`
**Sub-componentes internos**: `Header`, `Content`, `Footer`, `Close`

---

### Select (Single Component con Options)
```tsx
import { Select } from '@buildertech/ui';

const options = [
  { value: '1', label: 'Opción 1' },
  { value: '2', label: 'Opción 2', group: 'Grupo A' },
  { value: '3', label: 'Opción 3', group: 'Grupo A' },
  { value: '4', label: 'Opción 4', disabled: true },
];

<Select
  placeholder="Seleccionar..."
  options={options}
  value={value}
  onChange={setValue}
  searchable
  clearable
  multiple
  size="md"
  label="Categoría"
  helpText="Elige una o más opciones"
  error={errorMessage}
/>
```

**Props clave**: `options[]` (required), `placeholder`, `value`/`defaultValue`, `onChange`, `multiple`, `clearable`, `searchable`, `size`, `error`, `label`, `helpText`, `disabled`, `loading`
**Funcionalidad integrada**: Búsqueda, filtrado, grupos, multi-select con chips, clearable, loading state

---

### Table (Data-Driven)
```tsx
import { Table, Button, Icon, Badge } from '@buildertech/ui';

const columns = [
  { key: 'name', header: 'Nombre', accessor: 'name' },
  { key: 'email', header: 'Email', accessor: 'email' },
  { key: 'role', header: 'Rol', accessor: 'role', render: (v) => <Badge variant="brand">{v}</Badge> },
  { key: 'status', header: 'Estado', accessor: 'status', render: (v) => <Badge variant={v === 'active' ? 'success' : 'warning'}>{v}</Badge> },
  { key: 'actions', header: 'Acciones', render: (_, row) => (
    <Button variant="ghost" size="sm" onClick={() => edit(row.id)}>
      <Icon name="edit" category="action" size="xs" />
    </Button>
  )},
];

<Table
  columns={columns}
  data={users}
  rowKey="id"
  variant="striped"
  size="md"
  sortable
  sortColumn={sortColumn}
  sortDirection={sortDirection}
  onSort={handleSort}
  selectable
  selectedRows={selectedRows}
  onSelectionChange={setSelectedRows}
  renderActions={(row) => <Button variant="outline" size="sm">Ver</Button>}
  emptyState={<EmptyState illustration="users" title="Sin usuarios" description="No hay usuarios registrados" />}
  loading={isLoading}
  stickyHeader
  responsive
  caption="Lista de usuarios del sistema"
/>
```

**Props**: `columns[]`, `data[]`, `rowKey`, `variant` (`default`/`striped`/`bordered`), `size`, `sortable`, `selectable`, `renderActions`, `emptyState`, `loading`, `stickyHeader`, `responsive`, `caption`

---

### Toast + useToast
```tsx
import { useToast, Button, ToastProvider, ToastViewport } from '@buildertech/ui';

// En componente (requiere ToastProvider en layout)
function MiComponente() {
  const { addToast } = useToast();

  const handleSuccess = () => {
    addToast({
      id: 'success-1',
      title: 'Éxito',
      message: 'Operación completada',
      variant: 'success',
      duration: 4000,
    });
  };

  const handleError = () => {
    addToast({
      id: 'error-1',
      title: 'Error',
      message: 'Algo falló',
      variant: 'error',
      duration: 6000,
      action: { label: 'Reintentar', onClick: handleRetry },
    });
  };

  return (
    <>
      <Button onClick={handleSuccess}>Mostrar éxito</Button>
      <Button variant="danger" onClick={handleError}>Mostrar error</Button>
    </>
  );
}
```

**IMPORTANTE**: `useToast` **SÍ está exportado** en `src/index.ts` → `import { useToast } from '@buildertech/ui'`

---

### DropdownMenu (Compound Components)
```tsx
import { DropdownMenu, Button, Icon } from '@buildertech/ui';

<DropdownMenu>
  <DropdownMenu.Trigger asChild>
    <Button variant="outline" rightIcon={<Icon name="chevron-down" category="nav" size="sm" />}>
      Acciones
    </Button>
  </DropdownMenu.Trigger>
  <DropdownMenu.Content>
    <DropdownMenu.Label>Opciones</DropdownMenu.Label>
    <DropdownMenu.Item onClick={handleEdit}>
      <Icon name="edit" category="action" size="sm" />
      Editar
    </DropdownMenu.Item>
    <DropdownMenu.CheckboxItem checked={enabled} onCheckedChange={setEnabled}>
      Activar notificaciones
    </DropdownMenu.CheckboxItem>
    <DropdownMenu.RadioItem value="daily" checked={freq === 'daily'} onChange={() => setFreq('daily')}>
      Diario
    </DropdownMenu.RadioItem>
    <DropdownMenu.Separator />
    <DropdownMenu.Item variant="danger" onClick={handleDelete}>
      <Icon name="trash" category="action" size="sm" />
      Eliminar
    </DropdownMenu.Item>
  </DropdownMenu.Content>
</DropdownMenu>
```

**Sub-componentes**: `Trigger`, `Content`, `Item`, `CheckboxItem`, `RadioItem`, `Separator`, `Label`

---

## 📋 Iconos — Wrapper Semántico

```tsx
import { Icon } from '@buildertech/ui';

<Icon name="home" category="nav" size="md" />
<Icon name="plus" category="action" size="sm" color="coral-600" />
<Icon name="alert-circle" category="status" size="lg" />
<Icon name="package" category="empty" size="xl" />
```

**Props**: `name` (Lucide icon name), `category` (`nav`|`action`|`status`|`empty`), `size` (`xs`|`sm`|`md`|`lg`|`xl`), `color`, `aria-label`, `decorative`

---

## 🔧 Utilidades Base

```tsx
import { clsx, Icon, Fonts } from '@buildertech/ui';

// clsx = clsx + tailwind-merge
const className = clsx('base-class', condition && 'conditional-class', 'another-class');

// Fonts helpers (next/font)
import { inter, jetbrainsMono, spaceGrotesk } from '@buildertech/ui/lib/fonts';
// o desde Fonts namespace
<Fonts.Inter variable="--font-inter" subsets={['latin']} />
```

---

## ✅ Checklist de Integración

- [ ] `pnpm add @buildertech/ui --workspace --filter=apps/web`
- [ ] Tailwind config incluye `node_modules/@buildertech/ui/dist/**/*.{js,ts,jsx,tsx}` en `content`
- [ ] `@import "@buildertech/ui/styles/globals.css"` en globals.css de la app
- [ ] `ToastProvider` + `ToastViewport` en root layout
- [ ] `check:design` pasa en `apps/web/src` (modo permisivo W1-W3)
- [ ] Imports usan `@buildertech/ui` (no rutas relativas)

---

## 🔗 Referencias

- [Especificación API Completa](../tokens/api-spec.md)
- [Tokens Layout/Sizing/Flexbox/Grid/Alignment/Spacing](../tokens/layout-sizing.md)
- [Paleta Visual](../tokens/visual-palette.md)
- [Enforcement / Políticas](../gobernanza/enforcement.md)
- [Añadir un Componente](./adding.md)
- [Navegadores Soportados](./supported-browsers.md)
- [Guía de Migración](../guias/migration-guide.md)

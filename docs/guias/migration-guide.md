# Guía de Migración — apps/web → @buildertech/ui

> **Versión**: 0.1.0 | **Fecha**: 2026-11-07 | **Estado**: Validado

---

## 🎯 Objetivo

Migrar `apps/web` de componentes UI locales + dependencias externas → **100% `@buildertech/ui`**.

---

## 📦 Estado Actual (Pre-Migración)

### Componentes Locales en `apps/web/src/components/ui/` (A ELIMINAR)
```
apps/web/src/components/ui/
├── button.tsx
├── card.tsx
├── dialog.tsx
├── select.tsx
├── table.tsx
├── nav-link.tsx
├── badge.tsx
├── input.tsx
├── empty-state.tsx
├── loading-state.tsx
├── error-state.tsx
├── error-page.tsx
├── copy-button.tsx
├── back-button.tsx
├── theme-toggle.tsx
├── skeleton.tsx
├── label.tsx
├── separator.tsx
├── slot.tsx
├── toast.tsx
└── dropdown-menu.tsx
```

### Dependencias Externas (A ELIMINAR)
```json
// apps/web/package.json
"dependencies": {
  "@librerias-ui-externas/react-dialog": "^1.0.0",
  "@librerias-ui-externas/react-select": "^1.0.0",
  "@librerias-ui-externas/react-dropdown-menu": "^1.0.0",
  "@librerias-ui-externas/react-toast": "^1.0.0",
  "@librerias-ui-externas/react-label": "^1.0.0",
  "@librerias-ui-externas/react-separator": "^1.0.0",
  "@librerias-ui-externas/react-slot": "^1.0.0",
  "class-variance-authority": "^0.7.0"
}
```

### Utilidades Locales (A ELIMINAR)
```
apps/web/src/lib/
├── cn.ts           # → @buildertech/ui/clsx
├── icons.tsx       # → @buildertech/ui/Icon
└── fonts.ts        # → @buildertech/ui/Fonts
```

### Estilos Locales (A ELIMINAR)
```
apps/web/src/app/styles/
├── btc-tokens.css    # → @buildertech/ui/styles/tokens.css
└── globals.css       # → @buildertech/ui/styles/globals.css
```

### Validador Local (A ELIMINAR)
```
apps/web/scripts/
└── check-design.ts   # → @buildertech/ui check:design
```

---

## 📋 Plan de Migración (6 Pasos)

### Paso 1: Instalar Paquete
```bash
# En monorepo root
pnpm add @buildertech/ui --workspace --filter=apps/web

# Verificar instalación
pnpm --filter apps/web list @buildertech/ui
```

### Paso 2: Configurar Tailwind
```ts
// apps/web/tailwind.config.ts
import type { Config } from 'tailwindcss';

export default {
  content: [
    './src/**/*.{ts,tsx}',
    // CRÍTICO: Incluir dist del paquete para generar utilidades btc-*
    '../../node_modules/@buildertech/ui/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: { extend: {} },
  plugins: [],
} satisfies Config;
```

### Paso 3: Actualizar globals.css
```css
/* apps/web/src/app/globals.css — REEMPLAZAR CONTENIDO */
@import "@buildertech/ui/styles/globals.css";

/* Opcional: Overrides documentados (ver gobernanza/enforcement.md W1) */
:root {
  /* --btc-bg-app: #fafafa; */
}
```

### Paso 4: Migrar Imports (Automatizado + Manual)

#### Script de migración (ejecutar en `apps/web/`)
```bash
# 1. Backup
cp -r src src.backup.$(date +%s)

# 2. Reemplazar imports de componentes UI locales
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i \
  's|@/components/ui/button|@buildertech/ui|g'
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i \
  's|@/components/ui/card|@buildertech/ui|g'
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i \
  's|@/components/ui/dialog|@buildertech/ui|g'
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i \
  's|@/components/ui/select|@buildertech/ui|g'
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i \
  's|@/components/ui/table|@buildertech/ui|g'
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i \
  's|@/components/ui/nav-link|@buildertech/ui|g'
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i \
  's|@/components/ui/badge|@buildertech/ui|g'
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i \
  's|@/components/ui/input|@buildertech/ui|g'
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i \
  's|@/components/ui/empty-state|@buildertech/ui|g'
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i \
  's|@/components/ui/loading-state|@buildertech/ui|g'
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i \
  's|@/components/ui/error-state|@buildertech/ui|g'
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i \
  's|@/components/ui/error-page|@buildertech/ui|g'
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i \
  's|@/components/ui/copy-button|@buildertech/ui|g'
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i \
  's|@/components/ui/back-button|@buildertech/ui|g'
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i \
  's|@/components/ui/theme-toggle|@buildertech/ui|g'
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i \
  's|@/components/ui/skeleton|@buildertech/ui|g'
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i \
  's|@/components/ui/label|@buildertech/ui|g'
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i \
  's|@/components/ui/separator|@buildertech/ui|g'
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i \
  's|@/components/ui/slot|@buildertech/ui|g'
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i \
  's|@/components/ui/toast|@buildertech/ui|g'
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i \
  's|@/components/ui/dropdown-menu|@buildertech/ui|g'

# 3. Reemplazar utilidades locales
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i \
  's|@/lib/cn|@buildertech/ui|g'
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i \
  's|@/lib/icons|@buildertech/ui|g'
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i \
  's|@/lib/fonts|@buildertech/ui|g'

# 4. Reemplazar imports de deps externas
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i \
  's|@librerias-ui-externas/react-dialog|@buildertech/ui|g'
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i \
  's|@librerias-ui-externas/react-select|@buildertech/ui|g'
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i \
  's|@librerias-ui-externas/react-dropdown-menu|@buildertech/ui|g'
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i \
  's|@librerias-ui-externas/react-toast|@buildertech/ui|g'
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i \
  's|@librerias-ui-externas/react-label|@buildertech/ui|g'
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i \
  's|@librerias-ui-externas/react-separator|@buildertech/ui|g'
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i \
  's|@librerias-ui-externas/react-slot|@buildertech/ui|g'
```

#### Revisar manualmente (APIs cambiadas)
| Componente | Cambio Crítico | Acción |
|------------|----------------|--------|
| **Dialog** | Era compound → ahora props-based controlado | Migrar a `<Dialog open={} onClose={} title="" />` |
| **Select** | Era compound Radix → ahora single component con `options[]` | Migrar a `<Select options={[]} value={} onChange={} />` |
| **Table** | Era compound → ahora data-driven `columns[]` + `data[]` | Migrar estructura |
| **Toast** | `useToast` SÍ exportado | Verificar `import { useToast } from '@buildertech/ui'` |
| **Button** | 7 variantes, `leftIcon`/`rightIcon`/`fullWidth` | Actualizar props |
| **Card** | 6 sub-comp (`Description`, `Actions` nuevos) | Añadir donde falte |

### Paso 5: Configurar ToastProvider
```tsx
// apps/web/src/app/providers.tsx — NUEVO ARCHIVO
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

### Paso 6: Limpiar y Verificar

```bash
# 1. Eliminar archivos locales obsoletos
rm -rf apps/web/src/components/ui/
rm -rf apps/web/src/lib/{cn,icons,fonts}.ts
rm -rf apps/web/src/app/styles/btc-tokens.css
rm -rf apps/web/scripts/check-design.ts

# 2. Eliminar dependencias externas
cd apps/web
pnpm remove @librerias-ui-externas/react-dialog @librerias-ui-externas/react-select @librerias-ui-externas/react-dropdown-menu @librerias-ui-externas/react-toast @librerias-ui-externas/react-label @librerias-ui-externas/react-separator @librerias-ui-externas/react-slot class-variance-authority

# 3. Verificar build
pnpm --filter apps/web build

# 4. Verificar quality
pnpm --filter @buildertech/ui quality:verify

# 5. Tests visuales
pnpm --filter @buildertech/ui test:visual
```

---

## 🔍 Diferencias Clave de API (Referencia Rápida)

### Dialog
```tsx
// ANTES (Compound - Radix style)
<Dialog>
  <Dialog.Trigger><Button>Open</Button></Dialog.Trigger>
  <Dialog.Content>
    <Dialog.Header><Dialog.Title>Título</Dialog.Title></Dialog.Header>
    <Dialog.Description>Desc</Dialog.Description>
    <Dialog.Footer><Button>OK</Button></Dialog.Footer>
  </Dialog.Content>
</Dialog>

// DESPUÉS (Props-based controlado)
<Dialog
  open={open}
  onClose={() => setOpen(false)}
  title="Título"
  description="Desc"
>
  <Dialog.Footer>
    <Button onClick={() => setOpen(false)}>OK</Button>
  </Dialog.Footer>
</Dialog>
```

### Select
```tsx
// ANTES (Compound)
<Select>
  <Select.Trigger><Select.Value placeholder="Seleccionar" /></Select.Trigger>
  <Select.Content>
    <Select.Item value="1">Opción 1</Select.Item>
    <Select.Item value="2">Opción 2</Select.Item>
  </Select.Content>
</Select>

// DESPUÉS (Single component)
<Select
  placeholder="Seleccionar"
  options={[{ value: '1', label: 'Opción 1' }, { value: '2', label: 'Opción 2' }]}
  value={value}
  onChange={setValue}
  searchable
  clearable
/>
```

### Table
```tsx
// ANTES (Compound)
<Table>
  <Table.Header>
    <Table.Row>
      <Table.Head>Nombre</Table.Head>
      <Table.Head>Email</Table.Head>
    </Table.Row>
  </Table.Header>
  <Table.Body>
    {data.map(row => (
      <Table.Row key={row.id}>
        <Table.Cell>{row.name}</Table.Cell>
        <Table.Cell>{row.email}</Table.Cell>
      </Table.Row>
    ))}
  </Table.Body>
</Table>

// DESPUÉS (Data-driven)
<Table
  columns={[
    { key: 'name', header: 'Nombre', accessor: 'name' },
    { key: 'email', header: 'Email', accessor: 'email' },
  ]}
  data={data}
  rowKey="id"
  sortable
  selectable
  renderActions={(row) => <Button size="sm">Ver</Button>}
/>
```

---

## ✅ Checklist Post-Migración

- [ ] `pnpm build` pasa sin errores
- [ ] `pnpm quality:verify` pasa (typecheck, lint, check:design, test)
- [ ] No imports de `@/components/ui/*` restantes
- [ ] No imports de `@librerias-ui-externas/*` restantes
- [ ] No `class-variance-authority` en `package.json`
- [ ] No `apps/web/src/components/ui/` directorio
- [ ] No `apps/web/src/lib/{cn,icons,fonts}.ts`
- [ ] No `apps/web/src/app/styles/btc-tokens.css`
- [ ] No `apps/web/scripts/check-design.ts`
- [ ] `ToastProvider` + `ToastViewport` en layout
- [ ] Visual regression 0 diffs en 8 proyectos (`test:visual` por separado)

---

## 🆘 Rollback (Si Algo Falla)

```bash
# Restaurar backup
rm -rf apps/web/src
mv apps/web/src.backup.<timestamp> apps/web/src

# Restaurar deps
cd apps/web
pnpm install

# Verificar
pnpm build
```

---

## 📝 Referencias

- `componentes/guide.md` — Uso de componentes migrados
- `tokens/api-spec.md` — API completa de cada componente
- `gobernanza/enforcement.md` — Reglas de validación
- `arquitectura/index.md` — Qué SÍ/NO está en el paquete

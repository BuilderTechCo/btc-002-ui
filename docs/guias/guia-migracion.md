# Guía de migración — app consumidora → @buildertechco/ui

> **Versión**: 0.1.0 | **Fecha**: 2026-11-09 | **Estado**: Validado contra la API real

---

## 1. Objetivo

Migrar una app de componentes UI locales y dependencias externas a **`@buildertechco/ui`**, con Tailwind CSS v4 y tokens `btc-*`.

---

## 2. Inventario previo (a eliminar)

### 2.1 Componentes locales

```text
app/src/components/ui/
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

### 2.2 Dependencias externas

```json
{
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
}
```

### 2.3 Utilidades y estilos locales

```text
app/src/lib/
├── cn.ts           # → clsx de @buildertechco/ui
├── icons.tsx       # → Icon de @buildertechco/ui
└── fonts.ts        # → helpers de @buildertechco/ui/lib/fonts

app/src/app/styles/
├── btc-tokens.css  # → @buildertechco/ui/styles/tokens.css
└── globals.css     # → @buildertechco/ui/styles/globals.css

app/scripts/
└── check-design.ts # → check:design del paquete
```

---

## 3. Plan de migración (6 pasos)

### Paso 1 — Instalar el paquete

```bash
# Desde la raíz del monorepo, después de que la versión esté publicada
pnpm --filter @buildertech/web add @buildertechco/ui@0.1.0

# Verificar
pnpm --filter @buildertech/web list @buildertechco/ui
```

El `.npmrc` versionado de la raíz del monorepo configura solo el registry:

```ini
@buildertechco:registry=https://npm.pkg.github.com
```

En desarrollo local, configura el token en el `.npmrc` de usuario con un PAT `read:packages` (por ejemplo, `npm config set --location=user //npm.pkg.github.com/:_authToken "$NODE_AUTH_TOKEN"`). En GitHub Actions, concede `packages: read` a `GITHUB_TOKEN` y proporciona el token al registry mediante un `.npmrc` temporal de usuario. pnpm 12 no expande credenciales de variables de entorno declaradas en el `.npmrc` versionado. La publicación del paquete es requisito previo; no se usa `workspace:*` porque el paquete vive en otro repositorio.

### Paso 2 — Configurar Tailwind v4 (CSS-first)

Elimina `tailwind.config.ts` si solo existía para el DS. La configuración pasa a CSS:

```css
/* app/globals.css */
@import "tailwindcss";
@import "@buildertechco/ui/styles/globals.css";

/* El paquete publicado vive en node_modules; Tailwind debe escanearlo. */
@source "../node_modules/@buildertechco/ui/dist";
```

- `globals.css` del DS importa `tokens.css` y define `@theme inline`.
- No copies tokens ni `@theme` en la app.
- Asegúrate de que el pipeline de la app procesa Tailwind v4 (`@tailwindcss/vite`, `@tailwindcss/postcss` o el pipeline de Next.js compatible).

### Paso 3 — Aplicar el tema en `<html>`

```tsx
// app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" data-theme="light">
      <body>{children}</body>
    </html>
  );
}
```

Si usas `ThemeToggle`, este actualiza `data-theme` y persiste la preferencia en `localStorage` (`btc-theme`).

### Paso 4 — Migrar imports y APIs

#### Imports

```tsx
// Antes
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";
import { Icon } from "@/lib/icons";

// Después
import { Button, Card, Icon, clsx } from "@buildertechco/ui";
```

#### Tabla de cambios de API

| Componente       | Cambio                                                                                                    | Acción                                                             |
| :--------------- | :-------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------- |
| **Button**       | `leftIcon` / `rightIcon` son `string`                                                                     | Pasa nombre de icono, no componente                                |
| **Card**         | Compound (`Card.Header`, `Card.Title`, `Card.Description`, `Card.Content`, `Card.Footer`, `Card.Actions`) | Usa sub-componentes; también hay exports nombrados                 |
| **Dialog**       | Root props-based (`open`, `onClose`, `title`, `description`) + sub-componentes estáticos                  | Migrar a `<Dialog open onClose>`; `Dialog.Footer` sigue disponible |
| **Select**       | Data-driven (`options[]`), single o multiple                                                              | Migrar a `options`; `onChange` emite `string` o `string[]`         |
| **Table**        | Data-driven (`columns[]`, `data[]`)                                                                       | Migrar estructura; cabeceras ordenables con `aria-sort`            |
| **TextField**    | Nombre público `TextField` (no `Textfield`)                                                               | `helperText` → `helpText`; `onChange(value, event)`                |
| **Toast**        | `useToast` exportado por el barrel                                                                        | Usar `ToastProvider` + `useToast`; el provider monta su viewport   |
| **NavLink**      | `active` explícito                                                                                        | La app debe calcular la ruta activa                                |
| **ErrorPage**    | Acciones son `<Button>`; `href` no se usa                                                                 | Usar `onClick` con el router                                       |
| **CopyButton**   | `successText` / `defaultText`                                                                             | `successMessage` no existe                                         |
| **DropdownMenu** | Compound (`Trigger`, `Content`, `Item`, …)                                                                | Usar sub-componentes; `Trigger` renderiza un `<button>`            |

#### Card

```tsx
<Card variant="elevated" padding="lg">
  <Card.Header>
    <Card.Title>Usuarios</Card.Title>
    <Card.Description>Lista de usuarios activos</Card.Description>
  </Card.Header>
  <Card.Content>{children}</Card.Content>
  <Card.Footer>
    <Card.Actions>
      <Button variant="ghost">Cancelar</Button>
      <Button variant="primary">Guardar</Button>
    </Card.Actions>
  </Card.Footer>
</Card>
```

#### Dialog

```tsx
// Antes (Radix-style)
<Dialog>
  <Dialog.Trigger>
    <Button>Abrir</Button>
  </Dialog.Trigger>
  <Dialog.Content>
    <Dialog.Title>Título</Dialog.Title>
    <Dialog.Footer>
      <Button>OK</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog>;

// Después
const [open, setOpen] = useState(false);

<>
  <Button onClick={() => setOpen(true)}>Abrir</Button>
  <Dialog
    open={open}
    onClose={() => setOpen(false)}
    title="Título"
    description="Descripción"
  >
    <Dialog.Footer className="flex justify-end gap-btc-2 mt-btc-4">
      <Button onClick={() => setOpen(false)}>OK</Button>
    </Dialog.Footer>
  </Dialog>
</>;
```

#### Select single

```tsx
<Select
  label="Rol"
  placeholder="Selecciona un rol"
  options={[
    { value: "admin", label: "Administrador" },
    { value: "editor", label: "Editor" },
  ]}
  value={role}
  onChange={setRole}
  searchable
  clearable
/>
```

#### Select multiple

```tsx
const [permissions, setPermissions] = useState<string[]>([]);

<Select
  label="Permisos"
  multiple
  options={permissionOptions}
  value={permissions}
  onChange={setPermissions}
  searchable
  clearable
/>;
```

- Single: `onChange?: (value: string) => void`.
- Multiple: `onChange?: (values: string[]) => void`.
- Con `searchable` o `multiple` se usa un combobox/listbox con chips y teclado.

#### Table

```tsx
<Table
  columns={[
    { key: "name", header: "Nombre", accessor: "name", sortable: true },
    { key: "email", header: "Email", accessor: "email" },
    { key: "role", header: "Rol", accessor: "role", align: "center" },
  ]}
  data={users}
  rowKey="id"
  sortable
  sortColumn={sortColumn}
  sortDirection={sortDirection}
  onSort={(column, direction) => {
    setSortColumn(column);
    setSortDirection(direction);
  }}
  selectable
  selectedRows={selected}
  onSelectionChange={setSelected}
  renderActions={(row) => <Button size="sm">Ver</Button>}
/>
```

#### TextField

```tsx
// Antes
<Textfield helperText="..." leftIcon={<Mail />} onChange={(e) => setEmail(e.target.value)} />

// Después
<TextField
  label="Correo"
  helpText="Usaremos este correo para notificaciones."
  leftIcon="mail"
  leftIconCategory="action"
  clearable
  value={email}
  onChange={setEmail}
/>
```

#### DropdownMenu

```tsx
<DropdownMenu>
  <DropdownMenu.Trigger>Acciones</DropdownMenu.Trigger>
  <DropdownMenu.Content align="end">
    <DropdownMenu.Item icon="user" onSelect={() => goProfile()}>
      Perfil
    </DropdownMenu.Item>
    <DropdownMenu.Separator />
    <DropdownMenu.Item disabled>Deshabilitado</DropdownMenu.Item>
  </DropdownMenu.Content>
</DropdownMenu>
```

#### Toast

```tsx
// app/providers.tsx
"use client";

import { ToastProvider } from "@buildertechco/ui";

export function UIProviders({ children }: { children: React.ReactNode }) {
  return <ToastProvider position="top-right">{children}</ToastProvider>;
}
```

```tsx
// En cualquier componente dentro del provider
const { addToast } = useToast();

addToast({
  title: "Guardado",
  message: "Los cambios se guardaron.",
  variant: "success",
});
```

- `ToastProvider` ya renderiza su viewport en un portal.
- No añadas `<ToastViewport />` al layout salvo que construyas una composición personalizada.

### Paso 5 — Actualizar tokens y clases

| Antes                                   | Después                                              |
| :-------------------------------------- | :--------------------------------------------------- |
| `tailwind.config.ts` con `theme.extend` | CSS-first: `@import` + `@theme inline` del paquete   |
| `bg-brand`, `text-primary`              | `bg-btc-brand`, `text-btc-text-primary`              |
| `p-4`, `gap-6`                          | `p-btc-4`, `gap-btc-6`                               |
| `rounded-md`, `shadow-lg`               | `rounded-btc-md`, `shadow-btc-2`                     |
| `transition-all`                        | `transition-btc-colors` (o la transición específica) |
| `z-50`                                  | `z-btc-modal` / capa correspondiente                 |
| `font-sans`                             | `font-btc-sans`                                      |

Reglas completas en [`cumplimiento.md`](../gobernanza/cumplimiento.md).

### Paso 6 — Limpiar y verificar

```bash
# 1. Eliminar componentes/utilidades locales obsoletos
rm -rf app/src/components/ui/
rm -rf app/src/lib/cn.ts app/src/lib/icons.tsx app/src/lib/fonts.ts
rm -rf app/src/app/styles/btc-tokens.css
rm -rf app/scripts/check-design.ts

# 2. Eliminar dependencias externas
pnpm remove @librerias-ui-externas/react-dialog \
  @librerias-ui-externas/react-select \
  @librerias-ui-externas/react-dropdown-menu \
  @librerias-ui-externas/react-toast \
  @librerias-ui-externas/react-label \
  @librerias-ui-externas/react-separator \
  @librerias-ui-externas/react-slot \
  class-variance-authority

# 3. Verificar la app
pnpm build
pnpm typecheck

# 4. Verificar el DS
pnpm quality:verify
pnpm test:storybook
```

> No borres archivos sin confirmar que no contienen trabajo pendiente. Haz backup o usa control de versiones.

---

## 4. Diferencias clave de API

### Dialog

| Antes                         | Ahora                                                                                 |
| :---------------------------- | :------------------------------------------------------------------------------------ |
| Compound con `Dialog.Trigger` | Root controlado con `open` / `onClose`                                                |
| `Dialog.Title` obligatorio    | `title` / `description` como props                                                    |
| —                             | `Dialog.Header`, `Dialog.Content`, `Dialog.Footer`, `Dialog.Close` siguen disponibles |

### Select

| Antes                                         | Ahora                                                   |
| :-------------------------------------------- | :------------------------------------------------------ |
| Compound (`Select.Trigger`, `Select.Item`, …) | `options` + `value` + `onChange`                        |
| Solo single                                   | `multiple` con chips y `string[]`                       |
| Sin búsqueda o búsqueda limitada              | `searchable`, grupos, teclado y `aria-activedescendant` |

### Card

| Antes                  | Ahora                                                  |
| :--------------------- | :----------------------------------------------------- |
| Root con `Card.Header` | Sigue siendo compound; añade `Description` y `Actions` |
| Sin `padding`          | `padding: none / sm / md / lg`                         |
| Sin variante elevada   | `variant: default / outlined / elevated`               |

### Table

| Antes                                     | Ahora                                               |
| :---------------------------------------- | :-------------------------------------------------- |
| Compound (`Table.Header`, `Table.Row`, …) | Data-driven (`columns`, `data`)                     |
| Sin sorting integrado                     | `sortable`, `sortColumn`, `sortDirection`, `onSort` |
| Sin selección                             | `selectable`, `selectedRows`, `onSelectionChange`   |

### Toast

| Antes                   | Ahora                                    |
| :---------------------- | :--------------------------------------- |
| `useToast` no exportado | `useToast` exportado por el barrel       |
| Viewport manual         | `ToastProvider` monta su propio viewport |
| Sin acción              | `action: { label, onClick }`             |

---

## 5. Checklist post-migración

- [ ] No quedan imports de `@/components/ui/*`.
- [ ] No quedan imports de `@librerias-ui-externas/*`.
- [ ] No queda `class-variance-authority` en `package.json`.
- [ ] No quedan `tailwind.config.ts` con configuración del DS.
- [ ] `globals.css` importa `tailwindcss` y `@buildertechco/ui/styles/globals.css`.
- [ ] `@source` apunta al paquete publicado o a su `src/`.
- [ ] `data-theme` está en `<html>`.
- [ ] `ToastProvider` envuelve la app.
- [ ] `useToast` se usa dentro del provider.
- [ ] `Select` multiple usa `string[]` y single usa `string`.
- [ ] `TextField` usa `helpText` (no `helperText`) y `leftIcon` string.
- [ ] `ErrorPage` usa `onClick` (no `href`).
- [ ] `pnpm build` y `pnpm typecheck` pasan.
- [ ] `pnpm quality:verify` pasa.
- [ ] `pnpm test:storybook` pasa.
- [ ] En el repositorio del paquete, `pnpm test:visual` pasa antes de cada commit, independientemente de que cambien tokens o layout; no actualices snapshots sin aprobación del DS Owner.

---

## 6. Rollback

```bash
# Restaurar backup de la app
rm -rf app/src
mv app/src.backup.<timestamp> app/src

# Restaurar dependencias
pnpm install

# Verificar
pnpm build
```

---

## 7. Referencias

- [Guía de componentes](../componentes/guia.md)
- [Especificación de API](../tokens/especificacion-api.md)
- [Enforcement](../gobernanza/cumplimiento.md)
- [Layout, sizing y spacing](../tokens/dimensiones-disposicion.md)
- [Navegadores soportados](../componentes/navegadores-compatibles.md)
- [Arquitectura](../arquitectura/indice.md)

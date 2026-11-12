# Guía de Componentes — @buildertechco/ui

> **Versión**: 0.3.2 (borrador, no publicado) | **Fecha**: 2026-11-12 | **Estado**: Revisado contra el código real

Guía práctica para instalar y consumir el Design System. La versión publicada continúa siendo `0.1.0`; usa `0.3.2` solo después de confirmar su publicación. Para la referencia exhaustiva de props, consulta [`docs/tokens/especificacion-api.md`](../tokens/especificacion-api.md).

---

## 1. Componentes disponibles (23)

| Grupo              | Componentes                                                                                                                                                                                    |
| :----------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Base (16)**      | `Button`, `Card`, `Dialog`, `Select`, `Table`, `NavLink`, `Badge`, `TextField`, `EmptyState`, `LoadingState`, `ErrorState`, `ErrorPage`, `CopyButton`, `BackButton`, `ThemeToggle`, `Skeleton` |
| **Primitivas (7)** | `Toast`, `ToastProvider`, `ToastViewport`, `Label`, `Separator`, `Slot`, `DropdownMenu` + hook `useToast`                                                                                      |

> `Toast`, `ToastProvider`, `ToastViewport` y `useToast` forman un solo sistema; se cuentan como primitivas del paquete.

`Card`, `Dialog` y `DropdownMenu` son **compound**: exponen sub-componentes estáticos (`Card.Header`, `Dialog.Footer`, `DropdownMenu.Item`) y también exports nombrados.

---

## 2. Instalación

### Desde GitHub Packages

```bash
# Configura NODE_AUTH_TOKEN con un PAT que tenga read:packages.
npm config set @buildertechco:registry https://npm.pkg.github.com/
npm config set --location=user //npm.pkg.github.com/:_authToken "$NODE_AUTH_TOKEN"
pnpm add @buildertechco/ui@0.1.0
```

El paquete vive en un repositorio independiente; no se consume con `workspace:*`. En GitHub Actions, usa `GITHUB_TOKEN` con permiso `packages: read` y proporciona el token al registry sin guardarlo en el repositorio. La versión indicada debe estar publicada antes de instalar.

El paquete publicado solo contiene `dist/` (`files: ["dist"]`). Los estilos se publican como CSS y los tipos como `.d.ts`. Los helpers `next/font` solo están disponibles en `@buildertechco/ui/lib/fonts`; no forman parte del barrel raíz y `next` es un peer opcional.

> **Consumo del paquete:** el build genera imports relativos explícitos en los archivos JavaScript y `.d.ts`, de modo que ESM nativo y TypeScript `NodeNext` pueden resolverlos. Los estilos CSS siguen necesitando un bundler. `pnpm test:consumer` valida con Vite/Tailwind v4 el barrel raíz, las 23 subrutas JavaScript no específicas de Next y ambas subrutas CSS; no valida una app Next.js/Turbopack ni `@buildertechco/ui/lib/fonts`.

---

## 3. Configuración en la app consumidora

### 3.1 Tailwind v4 (CSS-first)

No se usa `tailwind.config.ts`. La configuración vive en CSS:

```css
/* app/globals.css */
@import "tailwindcss";
@import "@buildertechco/ui/styles/globals.css";

/* Necesario para que Tailwind detecte las clases usadas por el paquete
   publicado en node_modules. Ajusta la ruta respecto a este archivo. */
@source "../node_modules/@buildertechco/ui/dist";
```

- `globals.css` importa `tokens.css` y define `@theme inline`, que mapea `--btc-*` a utilidades `btc-*`.
- No añadas un `content` array: Tailwind v4 detecta fuentes automáticamente y `@source` cubre el paquete.

### 3.2 Tema

El tema se aplica en el elemento raíz, no en un `div` intermedio:

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

`ThemeToggle` cambia `data-theme` en `<html>` y persiste la preferencia en `localStorage` (`btc-theme`). Los portales de `Dialog`, `Toast` y `DropdownMenu` se montan en `document.body`, por lo que necesitan que el tema esté en `<html>`.

### 3.3 Tipografías (Next.js)

```tsx
// app/layout.tsx
import { getFontSans, getFontMono } from "@buildertechco/ui/lib/fonts";

const sans = getFontSans();
const mono = getFontMono();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${sans.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

- `getFontSans()`, `getFontMono()` y `getFontDisplay()` devuelven `{ variable, className, style }`.
- Requieren `next` (peer dependency `>=14`).
- `--btc-font-display` se define con el helper `getFontDisplay()`, pero `globals.css` solo genera utilidades para `font-btc-sans` y `font-btc-mono`.
- **Nota**: los loaders internos de `next/font` (`Inter`, `JetBrains_Mono`, `Space_Grotesk`) reciben objetos literales (sin spread ni constantes compartidas). El transformador SWC de Next.js evalúa estáticamente los argumentos en build time y exige literales evaluables. El requisito de `transpilePackages: ["@buildertechco/ui"]` en el consumidor queda pendiente de verificar con Turbopack.

### 3.4 Provider de toasts

`ToastProvider` monta su propio viewport en un portal. No hace falta añadir `<ToastViewport />`:

```tsx
// app/providers.tsx
"use client";

import { ToastProvider } from "@buildertechco/ui";

export function UIProviders({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider position="top-right" maxToasts={5}>
      {children}
    </ToastProvider>
  );
}
```

```tsx
// app/layout.tsx
import { UIProviders } from "./providers";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" data-theme="light">
      <body>
        <UIProviders>{children}</UIProviders>
      </body>
    </html>
  );
}
```

---

## 4. Uso por componente

### 4.1 Button

```tsx
import { Button } from "@buildertechco/ui";

<Button variant="primary" size="md" leftIcon="plus" leftIconCategory="action">
  Nuevo usuario
</Button>

<Button variant="outline" size="sm">Cancelar</Button>

<Button variant="danger" loading>
  Eliminando…
</Button>
```

- 7 variantes: `primary`, `outline`, `ghost`, `danger`, `danger-outline`, `info`, `info-outline`.
- `leftIcon` / `rightIcon` son **nombres de icono** (`string`), no componentes.
- `loading` deshabilita el botón y muestra un spinner.

### 4.2 Card

```tsx
import { Button, Card } from "@buildertechco/ui";

<Card variant="elevated" padding="lg">
  <Card.Header>
    <Card.Title>Usuarios</Card.Title>
    <Card.Description>Lista de usuarios activos</Card.Description>
  </Card.Header>
  <Card.Content className="space-y-btc-3">{/* contenido */}</Card.Content>
  <Card.Footer>
    <Card.Actions>
      <Button variant="ghost">Cancelar</Button>
      <Button variant="primary">Guardar</Button>
    </Card.Actions>
  </Card.Footer>
</Card>;

<Card variant="elevated-bordered" padding="md">
  <Card.Header
    leftIcon={<Icon name="user" category="nav" size="md" aria-hidden="true" />}
  >
    <Card.Title>Perfil</Card.Title>
    <Card.Description>Configuración de cuenta</Card.Description>
  </Card.Header>
  <Card.Content>Contenido de la tarjeta...</Card.Content>
</Card>;
```

- Variantes: `default` (borde), `outlined` (borde fuerte), `elevated` (`shadow-btc-2`), `elevated-bordered` (elevación + borde).
- Padding: `none`, `sm`, `md`, `lg`.
- Header/Footer usan sangrado negativo para que sus divisores lleguen a los bordes.

### 4.3 Dialog

```tsx
"use client";

import { Button, Dialog } from "@buildertechco/ui";

const [open, setOpen] = useState(false);

<Dialog
  open={open}
  onClose={() => setOpen(false)}
  title="Eliminar proyecto"
  description="Esta acción no se puede deshacer."
  size="md"
>
  <p className="text-btc-body text-btc-text-secondary">
    ¿Eliminar el proyecto seleccionado?
  </p>
  <Dialog.Footer className="flex justify-end gap-btc-2 mt-btc-4">
    <Button variant="ghost" onClick={() => setOpen(false)}>
      Cancelar
    </Button>
    <Button variant="danger" onClick={confirm}>
      Eliminar
    </Button>
  </Dialog.Footer>
</Dialog>;
```

- Controlado con `open` + `onClose`.
- `title` / `description` generan el header accesible y el botón de cierre.
- Tamaños: `sm`, `md`, `lg`, `xl`, `full`; alineación: `center`, `top`, `bottom`.
- Focus trap, `Escape`, cierre por overlay y restauración de foco incluidos.
- `portalId` permite montar en un contenedor propio; por defecto usa `document.body`.

### 4.4 Select

Single:

```tsx
import { Select } from "@buildertechco/ui";

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
/>;
```

Multiple:

```tsx
<Select
  label="Permisos"
  multiple
  options={permissions}
  value={selected}
  onChange={setSelected}
  searchable
  clearable
/>
```

- Single emite `string`; multiple emite `string[]`.
- Sin `searchable` y sin `multiple` usa un `<select>` nativo.
- Con `searchable` o `multiple` usa un combobox/listbox con chips, búsqueda, grupos y teclado.
- `options` acepta `SelectOption[]` o `SelectGroup[]`.

### 4.5 Table

```tsx
import { Table } from "@buildertechco/ui";

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
  caption="Usuarios del sistema"
/>;
```

- Data-driven: `columns` + `data`.
- Las cabeceras ordenables son `<button>` reales con `aria-sort` y `scope="col"`.
- `renderActions` añade una columna de acciones.
- `loading`, `emptyState`, `stickyHeader` y `responsive` cubren estados y layout.

### 4.6 TextField

```tsx
import { TextField } from "@buildertechco/ui";

<TextField
  label="Correo"
  type="email"
  placeholder="tu@empresa.com"
  helpText="Usaremos este correo para notificaciones."
  leftIcon="mail"
  leftIconCategory="action"
  clearable
  value={email}
  onChange={setEmail}
/>

<TextField
  label="Contraseña"
  type="password"
  showPasswordToggle
  error={!!error}
  errorMessage={error}
/>
```

- `onChange` recibe `(value, event)`.
- `helpText` se usa cuando no hay error; `errorMessage` cuando `error` es `true`.
- Variantes: `default`, `filled`, `outline`; tamaños: `sm`, `md`, `lg`.

### 4.7 NavLink

```tsx
import { NavLink } from "@buildertechco/ui";

<NavLink
  href="/dashboard"
  leftIcon="dashboard"
  active={pathname === "/dashboard"}
>
  Dashboard
</NavLink>

<NavLink href="/reports" badge={3} badgeVariant="warning">
  Reportes
</NavLink>
```

- `active` debe pasarse desde la app; el componente **no** detecta la ruta.
- `active` añade `aria-current="page"`.
- `disabled` bloquea la navegación y quita el enlace del tab order.

### 4.8 Badge

```tsx
import { Badge } from "@buildertechco/ui";

<Badge variant="success" icon="check" iconCategory="action">Activo</Badge>
<Badge variant="warning" icon="alertTriangle" iconCategory="status">Pendiente</Badge>
<Badge variant="outline" removable onRemove={() => removeTag(tag)}>{tag}</Badge>
```

Variantes: `default`, `success`, `warning`, `error`, `info`, `outline`.

### 4.9 Estados

```tsx
import {
  EmptyState,
  ErrorPage,
  ErrorState,
  LoadingState,
  Skeleton,
} from "@buildertechco/ui";

<LoadingState variant="skeleton" skeletonLines={4} label="Cargando usuarios" />

<EmptyState
  title="No hay proyectos"
  description="Crea tu primer proyecto para empezar."
  illustration="folder"
  action={{ label: "Nuevo proyecto", onClick: create, icon: "plus" }}
/>

<ErrorState
  title="No se pudieron cargar los datos"
  message="Revisa tu conexión e inténtalo de nuevo."
  onRetry={refetch}
/>

<ErrorPage
  code={404}
  action={{ label: "Ir al inicio", onClick: () => router.push("/") }}
  showBackButton
/>

<Skeleton variant="card" />
```

- `ErrorPage` admite `401`, `403`, `404`, `500`, `503`, `maintenance` y `offline`.
- Las acciones de `ErrorPage` son `<Button>`; `href` está reservado y no se usa.
- `LoadingState` usa `label` para el texto accesible; `text` está deprecado.

### 4.10 CopyButton y BackButton

```tsx
import { BackButton, CopyButton } from "@buildertechco/ui";

<CopyButton text={apiKey} defaultText="Copiar API key" onCopy={(ok) => !ok && notifyError()} />

<BackButton fallbackHref="/dashboard" />
```

- `CopyButton` usa `navigator.clipboard.writeText` y muestra feedback temporal.
- Si el copiado falla, emite `onCopy(false)` y no cambia la UI. Mostrar un estado de error visible es un requisito de producto pendiente; todavía no está implementado.
- `BackButton` usa `history.back()` con `fallbackHref`; con `href` renderiza un enlace.

### 4.11 ThemeToggle

```tsx
import { ThemeToggle } from "@buildertechco/ui";

<ThemeToggle variant="dropdown" size="md" showLabels />
<ThemeToggle variant="button" />
```

- Temas: `light`, `dark`, `system`.
- Aplica `data-theme` en `<html>` y persiste en `localStorage`.
- `system` escucha `prefers-color-scheme`.

### 4.12 Toast

```tsx
"use client";

import { Button, useToast } from "@buildertechco/ui";

export function SaveButton() {
  const { addToast } = useToast();

  return (
    <Button
      onClick={() =>
        addToast({
          title: "Guardado",
          message: "Los cambios se guardaron correctamente.",
          variant: "success",
          duration: 4000,
        })
      }
    >
      Guardar
    </Button>
  );
}
```

- `useToast` devuelve `{ toasts, addToast, removeToast, clearToasts }`.
- Debe usarse dentro de `ToastProvider`.
- Posiciones: `top-right`, `top-left`, `bottom-right`, `bottom-left`, `top-center`, `bottom-center`.
- `ToastViewport` es una primitiva de layout para composiciones personalizadas; el provider ya monta su propio viewport.

### 4.13 DropdownMenu

```tsx
import { DropdownMenu } from "@buildertechco/ui";

<DropdownMenu>
  <DropdownMenu.Trigger>Acciones</DropdownMenu.Trigger>
  <DropdownMenu.Content align="end">
    <DropdownMenu.Label>Cuenta</DropdownMenu.Label>
    <DropdownMenu.Item icon="user" onSelect={() => goProfile()}>
      Perfil
    </DropdownMenu.Item>
    <DropdownMenu.Item shortcut="⌘K" onSelect={() => openSearch()}>
      Buscar
    </DropdownMenu.Item>
    <DropdownMenu.Separator />
    <DropdownMenu.CheckboxItem
      value="notifications"
      checked={on}
      onCheckedChange={setOn}
    >
      Notificaciones
    </DropdownMenu.CheckboxItem>
  </DropdownMenu.Content>
</DropdownMenu>;
```

- Navegación con flechas, `Home`, `End` y cierre con `Escape`.
- Portal a `document.body` y posicionamiento con colisiones.
- `DropdownMenu.Trigger` renderiza un `<button>`; no implementa `asChild`.

---

## 5. Tokens y estilos

### 5.1 Utilidades `btc-*`

| Área         | Utilidades                                                                                                                                                                                |
| :----------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Colores      | `bg-btc-app`, `bg-btc-surface`, `bg-btc-raised`, `text-btc-text-primary`, `text-btc-text-secondary`, `text-btc-text-muted`, `text-btc-brand`, `bg-btc-brand`, `border-btc-border-default` |
| Espaciado    | `p-btc-{0,1,2,3,4,6,8,12,16}`, `m-btc-*`, `gap-btc-*`, `space-y-btc-*`                                                                                                                    |
| Radios       | `rounded-btc-xs                                                                                                                                                                           | sm       | md        | lg                          | xl      | 2xl                        | full`  |
| Sombras      | `shadow-btc-1` … `shadow-btc-5`                                                                                                                                                           |
| Tipografía   | `text-btc-display                                                                                                                                                                         | h1       | h2        | h3                          | h4      | body                       | body-s | control | caption | mono` |
| Transiciones | `transition-btc-colors                                                                                                                                                                    | opacity  | transform | shadow`, `duration-btc-fast | base    | slow`, `ease-btc-standard` |
| Z-index      | `z-btc-base                                                                                                                                                                               | dropdown | sticky    | modal                       | popover | tooltip                    | toast` |

### 5.2 Reglas

- No uses colores Tailwind por defecto (`bg-blue-500`, `text-gray-900`).
- No uses espaciado Tailwind por defecto (`p-4`, `gap-10`); usa `p-btc-4`, `gap-btc-8`.
- Espaciado permitido: `0, 1, 2, 3, 4, 6, 8, 12, 16`.
- No uses `!important` ni `transition-all`.
- `check:design` valida estas reglas; ver [`cumplimiento.md`](../gobernanza/cumplimiento.md).

---

## 6. Accesibilidad

- Los componentes usan HTML nativo siempre que es posible (`button`, `label`, `hr`, `table`, `select`).
- `Dialog` implementa focus trap, `Escape`, overlay y restauración de foco.
- `Select` múltiple implementa `aria-activedescendant`, chips y navegación por teclado.
- `Table` usa `aria-sort` y botones reales en cabeceras ordenables.
- `Toast` usa `role="alert"` y `aria-live="polite"`.
- `DropdownMenu` usa `role="menu"` y variantes `menuitem*`.

**Deuda de contraste implementada** (v0.1.0): el botón primario usa `coral-700` (`#C93A1E`) con texto blanco: **5.11:1** ✅ WCAG AA. Hover `coral-800` (6.97:1), pressed `coral-900` (10.28:1). La documentación registra una ejecución histórica de axe sin `color-contrast` en el botón primario; axe no se volvió a ejecutar en la revisión del 2026-11-10, así que ese resultado queda pendiente de revalidación.

---

## 7. Storybook

```bash
pnpm storybook        # http://127.0.0.1:6006 (auto-open)
pnpm test:storybook   # stories en Chromium
```

El catálogo incluye:

- Controls y Actions por story.
- Viewports de 360, 768, 1024 y 1440.
- Backgrounds `light`, `surface`, `raised`.
- Tema light/dark.
- Measure, outline y simulador de visión.
- Panel de accesibilidad (axe).
- Panel de component tests y botón **Run tests**.

Para añadir una story, crea `<componente>.stories.tsx` junto al componente. El patrón y los requisitos están en [`agregar-componente.md`](./agregar-componente.md).

---

## 8. Referencias

- [Especificación de API](../tokens/especificacion-api.md)
- [Añadir un componente](./agregar-componente.md)
- [Navegadores soportados](./navegadores-compatibles.md)
- [Layout, sizing y spacing](../tokens/dimensiones-disposicion.md)
- [Paleta visual](../tokens/paleta-visual.md)
- [Enforcement](../gobernanza/cumplimiento.md)
- [Migración](../guias/guia-migracion.md)

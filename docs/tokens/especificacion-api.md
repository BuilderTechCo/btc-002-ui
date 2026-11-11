# Especificación de API — Componentes `@buildertechco/ui`

> **Versión**: 0.3.0 (borrador, no publicado) | **Fecha**: 2026-11-11 | **Estado**: Revisado contra `src/` y el barrel público

Esta especificación describe la API **real** del paquete: props, tipos, valores admitidos, comportamiento y notas de accesibilidad. La versión publicada sigue siendo `0.1.0`; este borrador documenta los cambios preparados para `0.3.0`. Cualquier cambio de API debe actualizar este documento, `src/index.ts`, los exports de `package.json` y `CHANGELOG.md`.

---

## 1. Patrones comunes

### 1.1 Componentes compound

Tres componentes exponen sub-componentes estáticos además de exports nombrados:

```tsx
// Card
<Card>
  <Card.Header>
    <Card.Title>…</Card.Title>
    <Card.Description>…</Card.Description>
  </Card.Header>
  <Card.Content>…</Card.Content>
  <Card.Footer>
    <Card.Actions>…</Card.Actions>
  </Card.Footer>
</Card>

// Dialog
<Dialog open={open} onClose={close}>
  <Dialog.Header>…</Dialog.Header>
  <Dialog.Content>…</Dialog.Content>
  <Dialog.Footer>…</Dialog.Footer>
</Dialog>

// DropdownMenu
<DropdownMenu>
  <DropdownMenu.Trigger>…</DropdownMenu.Trigger>
  <DropdownMenu.Content>
    <DropdownMenu.Item>…</DropdownMenu.Item>
  </DropdownMenu.Content>
</DropdownMenu>
```

Los sub-componentes también están exportados por nombre (`CardHeader`, `DialogFooter`, `DropdownMenuItem`, …). `Card` y `Dialog` conservan sus sub-componentes con `Object.assign`; `DropdownMenu` también.

### 1.2 Iconos por nombre

`Button`, `TextField`, `Badge`, `NavLink`, `EmptyState`, `CopyButton`, `DropdownMenuItem` y `ThemeToggle` reciben iconos como **string** (nombre del icono), no como `ReactNode`:

```tsx
<Button leftIcon="plus" leftIconCategory="action">
  Nuevo
</Button>

<TextField leftIcon="search" leftIconCategory="action" clearable />
```

Categorías válidas: `nav` | `action` | `status` | `empty`. Tamaños de `Icon`: `xs` | `sm` | `md` | `lg` | `xl`.

### 1.3 Props nativas

La mayoría de componentes extienden las props del elemento HTML que renderizan (`ButtonHTMLAttributes`, `InputHTMLAttributes`, `HTMLAttributes`, etc.). Cuando una prop nativa entra en conflicto se omite:

- `Button` conserva todas las props de `<button>`.
- `TextField` omite `size` y `onChange` nativos: `onChange` recibe `(value, event)`.
- `Select` omite `size`, `onChange`, `value`, `defaultValue` y `multiple` nativos.
- `Table` no extiende props nativas; recibe `columns`, `data` y `className`.

### 1.4 Controlado y no controlado

`Select`, `TextField` y `ThemeToggle` admiten modo controlado y no controlado:

```tsx
// Controlado
<TextField value={value} onChange={setValue} />

// No controlado
<TextField defaultValue="Hola" onChange={(value) => console.log(value)} />
```

### 1.5 Tema y portales

El tema se aplica en el elemento raíz:

```tsx
document.documentElement.setAttribute("data-theme", "light" | "dark");
```

`Dialog`, `ToastProvider` y `DropdownMenu` renderizan en `document.body` (o en `portalId` si existe). Por eso dependen de que `data-theme` esté en `<html>` y no solo en un wrapper intermedio. Los contenedores con `transform`, `filter` o `contain` romperían `position: fixed` si los portales se montaran dentro de ellos.

---

## 2. Componentes base (16)

### 2.1 Button

**Archivo**: `src/components/button/button.tsx`

```tsx
type ButtonVariant =
  | "primary"
  | "outline"
  | "ghost"
  | "danger"
  | "danger-outline"
  | "info"
  | "info-outline";

type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant; // default: "primary"
  size?: ButtonSize; // default: "md"
  loading?: boolean; // default: false
  leftIcon?: string;
  leftIconCategory?: "nav" | "action" | "status" | "empty";
  rightIcon?: string;
  rightIconCategory?: "nav" | "action" | "status" | "empty";
  fullWidth?: boolean; // default: false
}
```

- `loading` deshabilita el botón y sustituye el icono izquierdo por un spinner.
- Durante la carga el botón informa el estado con `aria-busy="true"`.
- `fullWidth` aplica `w-full`.
- El botón primario usa `bg-btc-action-primary` (`coral-700`) + `text-btc-text-on-brand` → **5.11:1** ✅ WCAG AA. Hover `coral-800` (6.97:1), pressed `coral-900` (10.28:1).

```tsx
<Button variant="primary" size="md" leftIcon="plus" leftIconCategory="action">
  Nuevo usuario
</Button>

<Button variant="danger-outline" loading>
  Eliminar
</Button>
```

> **Deuda resuelta** (v0.1.0): el botón primario cumple WCAG AA.

### 2.2 Card

**Archivo**: `src/components/card/card.tsx`

```tsx
type CardVariant = "default" | "outlined" | "elevated" | "elevated-bordered";
type CardPadding = "none" | "sm" | "md" | "lg";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant; // default: "default"
  padding?: CardPadding; // default: "md"
}
```

Sub-componentes (todos `HTMLAttributes`):

| Sub-componente     | Elemento | Notas                                                                                                                                |
| :----------------- | :------- | :----------------------------------------------------------------------------------------------------------------------------------- |
| `Card.Header`      | `div`    | Aplica sangrado negativo según el padding del Card. Props: `leftIcon?: ReactNode`, `onClose?: () => void`, `closeAriaLabel?: string` |
| `Card.Title`       | `h3`     | Tipografía de título                                                                                                                 |
| `Card.Description` | `p`      | Texto secundario (`text-btc-caption`, `text-btc-text-primary`)                                                                       |
| `Card.Content`     | `div`    | Contenido principal (`py-btc-3` para separación)                                                                                     |
| `Card.Footer`      | `div`    | Divisor superior y sangrado                                                                                                          |
| `Card.Actions`     | `div`    | Fila de acciones alineada a la derecha (sin borde propio)                                                                            |

```tsx
<Card variant="elevated" padding="lg">
  <Card.Header>
    <Card.Title>Usuarios</Card.Title>
    <Card.Description>Lista de usuarios activos</Card.Description>
  </Card.Header>
  <Card.Content>…</Card.Content>
  <Card.Footer>
    <Card.Actions>
      <Button variant="ghost">Cancelar</Button>
      <Button variant="primary">Guardar</Button>
    </Card.Actions>
  </Card.Footer>
</Card>

<Card variant="elevated-bordered" padding="md">
  <Card.Header leftIcon={<Icon name="user" category="nav" size="md" aria-hidden="true" />}>
    <Card.Title>Perfil</Card.Title>
    <Card.Description>Configuración de cuenta</Card.Description>
  </Card.Header>
  <Card.Content>Contenido de la tarjeta...</Card.Content>
</Card>

<Card>
  <Card.Header onClose={() => setOpen(false)} closeAriaLabel="Cerrar tarjeta">
    <Card.Title>Cerrar</Card.Title>
  </Card.Header>
  <Card.Content>Contenido...</Card.Content>
</Card>
```

Los exports nombrados `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`, `CardActions` y sus tipos están disponibles en el barrel.

### 2.3 Dialog

**Archivo**: `src/components/dialog/dialog.tsx`

```tsx
type DialogSize = "sm" | "md" | "lg" | "xl" | "full";
type DialogAlign = "center" | "top" | "bottom";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  size?: DialogSize; // default: "md"
  align?: DialogAlign; // default: "center"
  closeOnOverlayClick?: boolean; // default: true
  closeOnEscape?: boolean; // default: true
  portal?: boolean; // default: true
  portalId?: string; // si no existe, document.body
}
```

Comportamiento:

- `role="dialog"`, `aria-modal="true"`, `aria-labelledby` y `aria-describedby` cuando hay `title`/`description`.
- Focus trap, cierre con `Escape`, cierre al hacer click en el overlay y restauración del foco previo.
- Bloquea el scroll del `body` mientras está abierto.
- Si hay `title` o `description`, renderiza un header con el botón de cierre. Si no, el cierre es absoluto en la esquina.

Sub-componentes:

```tsx
<Dialog.Close onClose={close} />   // button con aria-label="Cerrar"
<Dialog.Header>…</Dialog.Header>
<Dialog.Content>…</Dialog.Content>
<Dialog.Footer>…</Dialog.Footer>
```

```tsx
<Dialog
  open={open}
  onClose={() => setOpen(false)}
  title="Confirmar eliminación"
  description="Esta acción no se puede deshacer."
  size="md"
>
  <p className="text-btc-body text-btc-text-secondary">
    ¿Eliminar el registro seleccionado?
  </p>
  <Dialog.Footer className="flex justify-end gap-btc-2 mt-btc-4">
    <Button variant="ghost" onClick={() => setOpen(false)}>
      Cancelar
    </Button>
    <Button variant="danger" onClick={confirm}>
      Eliminar
    </Button>
  </Dialog.Footer>
</Dialog>
```

### 2.4 Select

**Archivo**: `src/components/select/select.tsx`

```tsx
interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  group?: string;
}

interface SelectGroup {
  label: string;
  options: SelectOption[];
}

interface SelectBaseProps {
  options: SelectOption[] | SelectGroup[];
  placeholder?: string;
  multiple?: boolean;
  clearable?: boolean;
  searchable?: boolean;
  noResultsText?: string;
  size?: "sm" | "md" | "lg";
  error?: boolean;
  errorMessage?: string;
  label?: string;
  labelId?: string;
  helpText?: string;
  disabled?: boolean;
  loading?: boolean;
  name?: string;
  required?: boolean;
}

interface SingleSelectProps extends SelectBaseProps {
  multiple?: false;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
}

interface MultipleSelectProps extends SelectBaseProps {
  multiple: true;
  value?: string[];
  defaultValue?: string[];
  onChange?: (values: string[]) => void;
}

type SelectProps = SingleSelectProps | MultipleSelectProps;
```

Comportamiento:

- **Single sin búsqueda**: renderiza un `<select>` nativo estilizado.
- **Single con `searchable` o multiple**: renderiza un combobox/listbox propio con `role="combobox"`, `aria-haspopup="listbox"`, `aria-expanded`, `aria-activedescendant` y navegación por teclado.
- **Multiple**: muestra chips con botón de quitar, `aria-multiselectable`, búsqueda opcional y `Backspace` para quitar el último valor.
- Soporta opciones planas o agrupadas (`SelectGroup[]`).
- `loading` muestra un spinner y deshabilita la interacción.
- `clearable` muestra el botón de limpiar cuando hay selección.

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

`SelectOption`, `SelectGroup`, `SelectSide` y `SelectAlign` se exportan desde el barrel.

### 2.5 Table

**Archivo**: `src/components/table/table.tsx`

```tsx
interface TableColumn<T = Record<string, unknown>> {
  key: string;
  header: string;
  accessor?: keyof T | ((row: T) => ReactNode);
  width?: string;
  minWidth?: string;
  align?: "left" | "center" | "right";
  sortable?: boolean;
  render?: (value: unknown, row: T, index: number) => ReactNode;
}

interface TableProps<T = Record<string, unknown>> {
  columns: TableColumn<T>[];
  data: T[];
  rowKey?: keyof T | ((row: T) => string) | "id"; // default: "id"
  variant?: "default" | "striped" | "bordered";
  size?: "sm" | "md" | "lg";
  sortable?: boolean;
  sortColumn?: string;
  sortDirection?: "asc" | "desc"; // default: "asc"
  onSort?: (column: string, direction: "asc" | "desc") => void;
  selectable?: boolean;
  selectedRows?: string[];
  onSelectionChange?: (selectedKeys: string[]) => void;
  renderActions?: (row: T, index: number) => ReactNode;
  emptyState?: ReactNode;
  loading?: boolean;
  loadingRows?: number; // default: 5
  stickyHeader?: boolean;
  responsive?: boolean; // default: true
  caption?: string;
  className?: string;
}
```

Comportamiento:

- Las cabeceras ordenables son `<button>` reales dentro de `<th scope="col">`; el `th` lleva `aria-sort="ascending" | "descending" | "none"`.
- La selección usa checkboxes con estado indeterminado y `aria-label="Seleccionar todas las filas"`.
- `caption` se renderiza como `<caption className="sr-only">`.
- `emptyState` y `loading` sustituyen el cuerpo.
- `responsive` envuelve la tabla en un contenedor con scroll horizontal.

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
  caption="Usuarios del sistema"
/>
```

`TableColumn`, `TableVariant` y `TableSize` se exportan desde el barrel.

### 2.6 NavLink

**Archivo**: `src/components/nav-link/nav-link.tsx`

```tsx
interface NavLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  children: React.ReactNode;
  leftIcon?: string;
  leftIconCategory?: "nav" | "action" | "status" | "empty";
  badge?: string | number;
  badgeVariant?: "default" | "success" | "warning" | "error" | "info";
  active?: boolean; // default: false
  disabled?: boolean; // default: false
  align?: "left" | "center";
  padding?: "sm" | "md" | "lg";
}
```

- **No detecta la ruta automáticamente**: la app debe pasar `active`.
- `active` añade `aria-current="page"` y los estilos de estado activo.
- `disabled` añade `aria-disabled`, quita del tab order y cancela la navegación.

```tsx
<NavLink
  href="/dashboard"
  leftIcon="dashboard"
  active={pathname === "/dashboard"}
>
  Dashboard
</NavLink>
```

### 2.7 Badge

**Archivo**: `src/components/badge/badge.tsx`

```tsx
interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "error" | "info" | "outline";
  size?: "sm" | "md" | "lg";
  icon?: string;
  iconCategory?: "nav" | "action" | "status" | "empty";
  removable?: boolean; // default: false
  onRemove?: () => void;
}
```

- `removable` renderiza un `<button type="button">` interno con `aria-label="Eliminar"`.
- El badge en sí es un `<span>`.

```tsx
<Badge variant="success" icon="check" iconCategory="action">Activo</Badge>

<Badge variant="warning" icon="alertTriangle" iconCategory="status">Pendiente</Badge>

<Badge variant="outline" removable onRemove={() => remove(tag)}>
  {tag}
</Badge>
```

> **Nota**: `default` usa `bg-btc-action-primary` (`coral-700`) + `text-btc-text-on-brand` → **5.11:1** ✅ WCAG AA.

### 2.8 TextField

**Archivo**: `src/components/textfield/textfield.tsx`

```tsx
type TextFieldVariant = "default" | "filled" | "outline";
type TextFieldSize = "sm" | "md" | "lg";

interface TextFieldProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "size" | "onChange"
> {
  label?: string;
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string, e: ChangeEvent<HTMLInputElement>) => void;
  type?: "text" | "email" | "password" | "number" | "tel" | "url" | "search";
  variant?: TextFieldVariant; // default: "default"
  size?: TextFieldSize; // default: "md"
  error?: boolean;
  errorMessage?: string;
  helpText?: string;
  leftIcon?: string;
  leftIconCategory?: "nav" | "action" | "status" | "empty";
  rightIcon?: string;
  rightIconCategory?: "nav" | "action" | "status" | "empty";
  clearable?: boolean;
  showPasswordToggle?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  name?: string;
  id?: string;
  className?: string;
}
```

- `onChange` recibe el valor como primer argumento, no el evento.
- `clearable` muestra un botón para vaciar el valor.
- `showPasswordToggle` solo aplica con `type="password"`.
- `errorMessage` se anuncia con `aria-describedby`; `helpText` se usa cuando no hay error.
- `label` se asocia al input con `htmlFor`/`id`.

```tsx
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
```

### 2.9 EmptyState

**Archivo**: `src/components/empty-state/empty-state.tsx`

```tsx
type EmptyStateIllustration =
  | "default"
  | "folder"
  | "inbox"
  | "users"
  | "package"
  | "target"
  | "building"
  | "building2";

interface EmptyStateProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  illustration?: EmptyStateIllustration; // default: "package"
  action?: {
    label: string;
    onClick: () => void;
    variant?: "primary" | "outline" | "ghost";
    icon?: string;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  size?: "sm" | "md" | "lg";
  centered?: boolean;
}
```

```tsx
<EmptyState
  title="No hay proyectos"
  description="Crea tu primer proyecto para empezar."
  illustration="folder"
  action={{ label: "Nuevo proyecto", onClick: create, icon: "plus" }}
/>
```

### 2.10 LoadingState

**Archivo**: `src/components/loading-state/loading-state.tsx`

```tsx
type LoadingStateVariant = "spinner" | "skeleton" | "inline" | "full";

interface LoadingStateProps extends HTMLAttributes<HTMLDivElement> {
  variant?: LoadingStateVariant; // default: "spinner"
  label?: string; // default: "Cargando…"
  /** @deprecated Usa `label`. */
  text?: string;
  size?: "sm" | "md" | "lg";
  skeletonLines?: number;
  skeletonWidth?: string | string[];
  fullScreen?: boolean;
}
```

- `spinner` / `inline` / `full` usan `Icon` con `animate-spin`.
- `skeleton` reutiliza `Skeleton` (con `bg-btc-border-strong` para contraste).
- `label` es el texto accesible; `text` está deprecado.
- Las variantes de carga exponen `role="status"` y muestran el texto accesible con `sr-only` cuando no hay texto visible.
- `inline` usa `text-btc-text-primary` para el texto (contraste AA).

```tsx
<LoadingState variant="skeleton" skeletonLines={4} label="Cargando usuarios" />
<LoadingState variant="full" fullScreen label="Cargando aplicación" />
```

### 2.11 ErrorState

**Archivo**: `src/components/error-state/error-state.tsx`

```tsx
interface ErrorStateProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
  onDismiss?: () => void;
  details?: string;
  variant?: "default" | "inline" | "toast";
  size?: "sm" | "md" | "lg";
}
```

```tsx
<ErrorState
  title="No se pudieron cargar los datos"
  message="Revisa tu conexión e inténtalo de nuevo."
  details={error.message}
  onRetry={refetch}
/>
```

### 2.12 ErrorPage

**Archivo**: `src/components/error-page/error-page.tsx`

```tsx
type ErrorPageCode = 401 | 403 | 404 | 500 | 503 | "maintenance" | "offline";

interface ErrorPageProps extends HTMLAttributes<HTMLDivElement> {
  code: ErrorPageCode;
  title?: string;
  message?: string;
  action?: {
    label: string;
    onClick: () => void;
    href?: string; // reservado: no implementado
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
    href?: string; // reservado: no implementado
  };
  showBackButton?: boolean;
  onBack?: () => void;
  centered?: boolean;
}
```

- `action` y `secondaryAction` renderizan `<Button>`, no enlaces. `href` está en el tipo pero **no se usa**.
- Para navegación, pasa `onClick` con el router de la app.
- `showBackButton` añade `BackButton`; `onBack` se delega.

```tsx
<ErrorPage
  code={404}
  action={{ label: "Ir al inicio", onClick: () => router.push("/") }}
  secondaryAction={{ label: "Contactar soporte", onClick: openSupport }}
  showBackButton
/>
```

### 2.13 CopyButton

**Archivo**: `src/components/copy-button/copy-button.tsx`

```tsx
interface CopyButtonProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "onClick" | "onCopy"
> {
  text: string;
  "aria-label"?: string; // default: "Copiar al portapapeles"
  successText?: string; // default: "¡Copiado!"
  defaultText?: string; // default: "Copiar"
  icon?: string; // default: "copy"
  successIcon?: string; // default: "check"
  feedbackDuration?: number; // default: 2000 ms
  variant?: "ghost" | "outline" | "primary";
  size?: "sm" | "md" | "lg";
  onCopy?: (success: boolean) => void;
}
```

- Usa `navigator.clipboard.writeText`.
- `aria-label` **fijo** ("Copiar al portapapeles"); no cambia al estado success (WCAG: nombre accesible = acción, no estado).
- `successText` se muestra visualmente al copiar; el botón se deshabilita mientras tanto.
- `onCopy(success)` se invoca tras el intento.
- **Pendiente de producto:** el requisito es mostrar un estado de error cuando falla la copia. La implementación actual solo llama a `onCopy(false)` y no presenta feedback de error; no asumir que esta UX ya está disponible.

```tsx
<CopyButton
  text={apiKey}
  defaultText="Copiar API key"
  onCopy={(ok) => !ok && notifyError()}
/>
```

### 2.14 BackButton

**Archivo**: `src/components/back-button/back-button.tsx`

```tsx
interface BackButtonProps {
  children?: React.ReactNode; // default: "Volver"
  icon?: string; // default: "chevronLeft"
  variant?: "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  useHistoryBack?: boolean; // default: true
  fallbackHref?: string;
  href?: string; // si existe, renderiza <a>
  disabled?: boolean;
  className?: string;
  onClick?: (e: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
  onFocus?: (e: FocusEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
  onBlur?: (e: FocusEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
  onKeyDown?: (e: KeyboardEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
  onKeyUp?: (e: KeyboardEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
}
```

- Con `href` renderiza un `<a>`; sin `href`, un `<button>`.
- Con `useHistoryBack` llama a `history.back()` y usa `fallbackHref` cuando no hay historial.

### 2.15 ThemeToggle

**Archivo**: `src/components/theme-toggle/theme-toggle.tsx`

```tsx
type Theme = "light" | "dark" | "system";

interface ThemeToggleProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "onChange" | "value" | "defaultValue"
> {
  themes?: Theme[]; // default: ["light", "dark", "system"]
  value?: Theme;
  defaultValue?: Theme; // default: "system"
  onChange?: (theme: Theme) => void;
  variant?: "button" | "dropdown";
  size?: "sm" | "md" | "lg";
  showLabels?: boolean;
  className?: string;
}
```

- Aplica `data-theme` en `<html>` y persiste en `localStorage` con la clave `btc-theme`.
- `system` resuelve `prefers-color-scheme` y escucha cambios.
- En `variant="dropdown"` usa `DropdownMenu`.
- Antes de montar renderiza un botón deshabilitado para evitar mismatch de hidratación.

> `Theme` se exporta desde el barrel principal y también desde el subpath `@buildertechco/ui/theme-toggle`.

### 2.16 Skeleton

**Archivo**: `src/components/skeleton/skeleton.tsx`

```tsx
type SkeletonVariant = "text" | "rect" | "circle" | "card" | "table-row";

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: SkeletonVariant; // default: "text"
  width?: string | number;
  height?: string | number;
  lines?: number; // default: 1
  animated?: boolean; // default: true
}
```

```tsx
<Skeleton variant="text" lines={3} />
<Skeleton variant="circle" width={48} />
<Skeleton variant="table-row" />
```

---

## 3. Primitivas nativas (7 componentes + hook `useToast`)

### 3.1 Toast

**Archivo**: `src/components/toast/toast.tsx`

```tsx
type ToastVariant = "default" | "success" | "warning" | "error" | "info";

interface ToastProps extends HTMLAttributes<HTMLDivElement> {
  id: string;
  title?: string;
  message?: string;
  variant?: ToastVariant; // default: "default"
  duration?: number; // default: 5000 ms; 0 = sin auto-cierre
  action?: {
    label: string;
    onClick: () => void;
  };
  onClose?: (id: string) => void;
  dismissible?: boolean; // default: true
  variantStyle?: ToastStyle; // inyectado por el provider
}
```

- `role="alert"`, `aria-live="polite"`, `aria-atomic="true"`.
- El botón de cierre tiene `aria-label="Cerrar notificación"`.
- La acción se renderiza como enlace subrayado.
- Normalmente no se monta a mano: se usa `ToastProvider` + `useToast`.

### 3.2 ToastProvider

```tsx
interface ToastProviderProps {
  children: ReactNode;
  portalId?: string; // si no existe, document.body
  position?:
    | "top-right"
    | "top-left"
    | "bottom-right"
    | "bottom-left"
    | "top-center"
    | "bottom-center"; // default: "top-right"
  maxToasts?: number; // default: 5
  gap?: number; // default: 8
}
```

- Renderiza su propio viewport en un portal, con `aria-label="Notificaciones"`.
- `maxToasts` recorta la cola: conserva los últimos N.
- No es necesario añadir `<ToastViewport />` dentro del provider; ya incluye su viewport.

### 3.3 ToastViewport

```tsx
type ToastViewportProps = HTMLAttributes<HTMLDivElement>;
```

Primitiva de layout (`flex flex-col gap-btc-2`) para composiciones personalizadas. **No consume el contexto de toasts**; el provider ya monta su propio viewport.

### 3.4 useToast

```tsx
const { toasts, addToast, removeToast, clearToasts } = useToast();

const id = addToast({
  title: "Guardado",
  message: "Los cambios se guardaron correctamente.",
  variant: "success",
  duration: 4000,
});

removeToast(id);
clearToasts();
```

- `addToast` acepta `Omit<ToastProps, "id"> & { id?: string }` y devuelve el id final.
- Debe usarse dentro de `ToastProvider`; fuera lanza `useToast must be used within a ToastProvider`.

```tsx
"use client";

import { ToastProvider, useToast } from "@buildertechco/ui";

function SaveButton() {
  const { addToast } = useToast();
  return (
    <Button onClick={() => addToast({ title: "Guardado", variant: "success" })}>
      Guardar
    </Button>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  return <ToastProvider position="top-right">{children}</ToastProvider>;
}
```

### 3.5 Label

**Archivo**: `src/components/label/label.tsx`

```tsx
interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
  required?: boolean; // default: false
  helpText?: string;
  error?: boolean; // default: false
  size?: "sm" | "md" | "lg";
}
```

- `required` añade un `*` decorativo (`aria-hidden`).
- `helpText` se oculta cuando `error` es `true`.
- `error` cambia el color a `text-btc-error`.

### 3.6 Separator

**Archivo**: `src/components/separator/separator.tsx`

```tsx
interface SeparatorProps extends HTMLAttributes<HTMLHRElement> {
  orientation?: "horizontal" | "vertical"; // default: "horizontal"
  variant?: "default" | "dashed" | "dotted" | "thick";
  decorative?: boolean; // default: true
  label?: string;
}
```

- `decorative` usa `role="none"`; si es `false`, `role="separator"`.
- Con `label` y `decorative={false}` renderiza un separador con texto centrado (`text-btc-caption`, `text-btc-text-secondary` → 4.61:1).
- Vertical usa `<hr>` con `aria-orientation="vertical"`.

### 3.7 Slot

**Archivo**: `src/components/slot/slot.tsx`

```tsx
type SlotProps<T extends ElementType = "div"> = {
  as?: T;
  className?: string;
  children?: React.ReactNode;
} & Omit<ComponentPropsWithRef<T>, "as" | "children" | "ref">;

const Slot: ForwardRefExoticComponent<...> & (<T extends ElementType>(props: SlotProps<T> & { as: T }) => JSX.Element);
```

- Implementación propia del patrón Radix Slot: renderiza el elemento indicado en `as` y reenvía `ref`, `className` y props.
- No fusiona clases con el hijo; el `className` se aplica al elemento generado.

```tsx
<Slot as="a" href="/dashboard" className="text-btc-brand">
  Ir al dashboard
</Slot>
```

### 3.8 DropdownMenu

**Archivo**: `src/components/dropdown-menu/dropdown-menu.tsx`

```tsx
interface DropdownMenuProps {
  children: ReactNode;
  modal?: boolean; // declarado; actualmente no se usa
  onOpenChange?: (open: boolean) => void;
}

interface DropdownMenuContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  align?: "start" | "end" | "center"; // default: "start"
  side?: "top" | "bottom" | "left" | "right";
  sideOffset?: number;
  avoidCollisions?: boolean;
}

interface DropdownMenuItemProps extends Omit<
  HTMLAttributes<HTMLButtonElement>,
  "onSelect"
> {
  children: ReactNode;
  disabled?: boolean;
  inset?: boolean;
  shortcut?: string;
  icon?: string;
  iconCategory?: "nav" | "action" | "status" | "empty";
  onSelect?: (value: string) => void;
}

interface DropdownMenuCheckboxItemProps extends HTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  checked?: boolean;
  disabled?: boolean;
  value: string;
  onCheckedChange?: (checked: boolean) => void;
}

interface DropdownMenuRadioItemProps extends HTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  checked?: boolean;
  disabled?: boolean;
  value: string;
  onCheckedChange?: (value: string) => void;
}
```

Sub-componentes: `Trigger`, `Content`, `Item`, `CheckboxItem`, `RadioItem`, `Separator`, `Label` (y exports nombrados).

Comportamiento:

- Portal a `document.body`, posicionamiento con `getBoundingClientRect` y colisiones.
- Cierre con `Escape` y click fuera.
- Navegación con `ArrowUp`/`ArrowDown`/`Home`/`End`.
- `role="menu"` / `role="menuitem"`; checkbox y radio usan `menuitemcheckbox` / `menuitemradio` con `aria-checked`.
- `Trigger` requiere `aria-label` obligatorio (accesibilidad).
- `Select` nativo oculto en modo combobox usa `role="presentation"` para evitar violaciones de axe.

```tsx
<DropdownMenu onOpenChange={setOpen}>
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
    <DropdownMenu.Item disabled>Deshabilitado</DropdownMenu.Item>
  </DropdownMenu.Content>
</DropdownMenu>
```

> `DropdownMenuTrigger` extiende `ButtonHTMLAttributes<HTMLButtonElement>` y renderiza un `<button>`; **no implementa `asChild`**. Pasa props de botón directamente.

---

## 4. Barrel público

### 4.1 Utilidades

| Export | Tipo       | Descripción                                        |
| :----- | :--------- | :------------------------------------------------- |
| `clsx` | función    | `clsx` + `tailwind-merge` configurado para `btc-*` |
| `Icon` | componente | Wrapper semántico de Lucide                        |

Los estilos se importan desde CSS usando `@buildertechco/ui/styles/globals.css` o `@buildertechco/ui/styles/tokens.css`; no son exports JavaScript del barrel. Los helpers `getFontSans`, `getFontMono`, `getFontDisplay` y el tipo `FontHelpers` se exportan solo desde `@buildertechco/ui/lib/fonts`, subpath exclusivo para Next.js.

### 4.2 Componentes y tipos

| Componente                                            | Tipos exportados                                                                                                                                                                                                            |
| :---------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Button`                                              | `ButtonProps`, `ButtonVariant`, `ButtonSize`                                                                                                                                                                                |
| `Card` + sub-componentes                              | `CardProps`, `CardVariant`, `CardPadding`, `CardHeaderProps`, `CardTitleProps`, `CardDescriptionProps`, `CardContentProps`, `CardFooterProps`, `CardActionsProps`                                                           |
| `Dialog` + sub-componentes                            | `DialogProps`, `DialogSize`, `DialogAlign`, `DialogHeaderProps`, `DialogContentProps`, `DialogFooterProps`, `DialogCloseProps`                                                                                              |
| `Select`                                              | `SelectProps`, `SelectOption`, `SelectGroup`, `SelectSide`, `SelectAlign`                                                                                                                                                   |
| `Table`                                               | `TableProps`, `TableColumn`, `TableVariant`, `TableSize`                                                                                                                                                                    |
| `NavLink`                                             | `NavLinkProps`                                                                                                                                                                                                              |
| `Badge`                                               | `BadgeProps`, `BadgeVariant`, `BadgeSize`                                                                                                                                                                                   |
| `TextField`                                           | `TextFieldProps`, `TextFieldVariant`, `TextFieldSize`                                                                                                                                                                       |
| `EmptyState`                                          | `EmptyStateProps`, `EmptyStateIllustration`                                                                                                                                                                                 |
| `LoadingState`                                        | `LoadingStateProps`, `LoadingStateVariant`                                                                                                                                                                                  |
| `ErrorState`                                          | `ErrorStateProps`                                                                                                                                                                                                           |
| `ErrorPage`                                           | `ErrorPageProps`, `ErrorPageCode`                                                                                                                                                                                           |
| `CopyButton`                                          | `CopyButtonProps`                                                                                                                                                                                                           |
| `BackButton`                                          | `BackButtonProps`                                                                                                                                                                                                           |
| `ThemeToggle`                                         | `ThemeToggleProps`, `Theme`                                                                                                                                                                                                 |
| `Skeleton`                                            | `SkeletonProps`, `SkeletonVariant`                                                                                                                                                                                          |
| `Label`                                               | `LabelProps`                                                                                                                                                                                                                |
| `Separator`                                           | `SeparatorProps`, `SeparatorOrientation`, `SeparatorVariant`                                                                                                                                                                |
| `Slot`                                                | `SlotProps`                                                                                                                                                                                                                 |
| `Toast`, `ToastProvider`, `ToastViewport`, `useToast` | `ToastProps`, `ToastProviderProps`, `ToastViewportProps`, `ToastVariant`                                                                                                                                                    |
| `DropdownMenu`                                        | `DropdownMenuProps`, `DropdownMenuTriggerProps`, `DropdownMenuContentProps`, `DropdownMenuItemProps`, `DropdownMenuCheckboxItemProps`, `DropdownMenuRadioItemProps`, `DropdownMenuSeparatorProps`, `DropdownMenuLabelProps` |
| `Icon`                                                | `IconProps`, `IconName`, `IconCategory`, `IconSize`                                                                                                                                                                         |
| `clsx`                                                | `ClassValue`                                                                                                                                                                                                                |
| fuentes (solo `@buildertechco/ui/lib/fonts`)          | `FontHelpers`                                                                                                                                                                                                               |

> `ToastStyle`, los helpers de fuentes y los estilos CSS no están en el barrel principal. `DropdownMenuCompound` existe como alias interno, pero el export público recomendado es `DropdownMenu`.

---

## 5. Notas transversales de accesibilidad

| Componente        | Semántica / teclado                                                                   |
| :---------------- | :------------------------------------------------------------------------------------ |
| `Button`          | `<button>` nativo; `loading` lo deshabilita                                           |
| `Dialog`          | `role="dialog"`, `aria-modal`, focus trap, `Escape`, restauración de foco             |
| `Select`          | `<select>` nativo o combobox/listbox con `aria-activedescendant`                      |
| `Table`           | `<th scope="col">`, `<button>` de orden, `aria-sort`, checkboxes etiquetados          |
| `NavLink`         | `<a>` con `aria-current="page"` cuando `active`                                       |
| `Badge` removible | Botón interno con `aria-label="Eliminar"`                                             |
| `TextField`       | `label` asociado, `aria-invalid`, `aria-describedby`, toggle de password              |
| `Toast`           | `role="alert"`, `aria-live="polite"`, cierre etiquetado                               |
| `DropdownMenu`    | `role="menu"`, `menuitem`/`menuitemcheckbox`/`menuitemradio`, flechas/Home/End/Escape |
| `Separator`       | `role="separator"` o `none` si es decorativo                                          |
| `Label`           | `<label>` con `htmlFor`; asterisco `aria-hidden`                                      |

### Deuda conocida

- **Contraste del botón primario**: resuelto en la paleta actual con `coral-700` y blanco (5.11:1, WCAG AA, según los ratios documentados). Axe no se ejecutó en la revisión del 2026-11-10.
- **ErrorPage**: pendiente de producto. Las props `action.href` y `secondaryAction.href` existen en el tipo, pero no se implementan; ambas acciones se renderizan como botones y requieren `onClick`.
- **CopyButton**: el estado de error visible solicitado está pendiente. Actualmente solo emite `onCopy(false)` ante un fallo de portapapeles.
- **Distribución ESM:** el build postprocesa imports relativos en `.js` y `.d.ts`, incluyendo `import("...").Tipo`, para que el runtime ESM y TypeScript `NodeNext` resuelvan los destinos generados. `pnpm test:consumer` valida el barrel raíz, las subrutas JavaScript no específicas de Next y ambos exports CSS con Vite/Tailwind v4; no valida una app Next.js/Turbopack ni el subpath `@buildertechco/ui/lib/fonts`. CSS requiere un bundler.
- **DropdownMenu `modal`**: aceptado en tipos, no consumido.

# Especificación de API — Componentes `@buildertech/ui`

> **Versión**: 0.1.0 | **Fecha**: 2026-11-07 | **Estado**: Validado contra implementación real

---

## 1. Patrones Comunes

### 1.1 Componentes Compuestos (Card, DropdownMenu, Table)
```tsx
export const Card = Object.assign(CardRoot, {
  Header: CardHeader,
  Title: CardTitle,
  Description: CardDescription,
  Content: CardContent,
  Footer: CardFooter,
  Actions: CardActions,
});
```

### 1.2 Props Base Comunes
```tsx
interface BaseComponentProps<T extends React.ElementType = "div"> {
  as?: T;
  className?: string;
  [key: string]: any;
}
```

### 1.3 Iconos (Wrapper Semántico `Icon`)
Todos los componentes usan `Icon` de `@buildertech/ui/lib/icon`:
```tsx
<Icon name="plus" category="action" size="sm" />
// Categorías: "nav" | "action" | "status" | "empty"
// Tamaños: "xs" | "sm" | "md" | "lg" | "xl"
```

---

## 2. Componentes Base (16)

### 2.1 Button
**Archivo**: `src/components/button/button.tsx`

```tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost' | 'danger' | 'danger-outline' | 'info' | 'info-outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  leftIconCategory?: 'nav' | 'action' | 'status' | 'empty';
  rightIconCategory?: 'nav' | 'action' | 'status' | 'empty';
  fullWidth?: boolean;
}
```

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `variant` | 7 variantes (ver abajo) | `'primary'` | Estilo visual |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Altura + padding + text-size |
| `loading` | `boolean` | `false` | Spinner interno, deshabilita |
| `leftIcon` | `ReactNode` | — | Icono antes del texto |
| `rightIcon` | `ReactNode` | — | Icono después del texto |
| `leftIconCategory` | `'nav' \| 'action' \| 'status' \| 'empty'` | `'action'` | Categoría icono izquierdo |
| `rightIconCategory` | `'nav' \| 'action' \| 'status' \| 'empty'` | `'action'` | Categoría icono derecho |
| `fullWidth` | `boolean` | `false` | Ancho 100% |

**Variantes (7)**:
- `primary`: `bg-btc-brand text-btc-on-brand`
- `outline`: `border-btc-border-strong bg-transparent text-btc-text-primary`
- `ghost`: `bg-transparent text-btc-text-secondary hover:bg-btc-raised`
- `danger`: `bg-btc-error text-btc-on-error`
- `danger-outline`: `border-btc-error bg-transparent text-btc-error`
- `info`: `bg-btc-info text-btc-on-info`
- `info-outline`: `border-btc-info bg-transparent text-btc-info`

**Tamaños**:
- `sm`: `h-8 px-3 text-btc-caption`
- `md`: `h-10 px-4 text-btc-control`
- `lg`: `h-12 px-6 text-btc-body`

---

### 2.2 Card
**Archivo**: `src/components/card/card.tsx`

```tsx
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outlined' | 'elevated';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}
interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4';
}
interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}
interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}
interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}
interface CardActionsProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Card = Object.assign(CardRoot, {
  Header: CardHeader,
  Title: CardTitle,
  Description: CardDescription,
  Content: CardContent,
  Footer: CardFooter,
  Actions: CardActions,
});
```

| Componente | Props Clave | Descripción |
|------------|-------------|-------------|
| `Card` | `variant`, `padding` | Contenedor principal |
| `Card.Header` | — | Wrapper header (flex, gap, items-center, border-b) |
| `Card.Title` | `as?: 'h1'\|'h2'\|'h3'\|'h4'` (default `h3`) | Título semántico |
| `Card.Description` | — | Texto descriptivo bajo título |
| `Card.Content` | — | Cuerpo principal (flex-1) |
| `Card.Footer` | — | Acciones (flex, gap, justify-end, border-t) |
| `Card.Actions` | — | Alias semántico para Footer con acciones |

**Variantes Card**:
- `default`: `bg-btc-surface shadow-btc-1`
- `outlined`: `bg-btc-surface border border-btc-border-default`
- `elevated`: `bg-btc-surface shadow-btc-3`

**Padding**: `none` (0), `sm` (p-btc-3), `md` (p-btc-4), `lg` (p-btc-6)

---

### 2.3 Dialog (Props-Based Controlado)
**Archivo**: `src/components/dialog/dialog.tsx`

```tsx
interface DialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  align?: 'center' | 'top' | 'bottom';
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  portal?: boolean;
  portalId?: string;
}

interface DialogHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}
interface DialogContentProps extends React.HTMLAttributes<HTMLDivElement> {}
interface DialogFooterProps extends React.HTMLAttributes<HTMLDivElement> {}
interface DialogCloseProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const Dialog = Object.assign(DialogRoot, {
  Header: DialogHeader,
  Content: DialogContent,
  Footer: DialogFooter,
  Close: DialogClose,
});
```

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `open` | `boolean` | **required** | Estado controlado |
| `onClose` | `() => void` | **required** | Callback cerrar |
| `title` | `string` | — | Título (aria-labelledby) |
| `description` | `string` | — | Descripción (aria-describedby) |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl' \| 'full'` | `'md'` | `max-w-*` |
| `align` | `'center' \| 'top' \| 'bottom'` | `'center'` | Posición vertical |
| `closeOnOverlayClick` | `boolean` | `true` | Cerrar click overlay |
| `closeOnEscape` | `boolean` | `true` | Cerrar tecla Escape |
| `portal` | `boolean` | `true` | Render en portal |
| `portalId` | `string` | `'dialog-portal'` | ID contenedor portal |

**Sub-componentes internos** (uso opcional para layout custom):
- `Dialog.Header` — Header con título + botón cerrar
- `Dialog.Content` — Contenido principal
- `Dialog.Footer` — Footer con acciones (justify-end)
- `Dialog.Close` — Botón cerrar (icono X por defecto)

**Accesibilidad**: `role="dialog"`, `aria-modal="true"`, focus trap, focus restoration

---

### 2.4 Select (Single Component con Options)
**Archivo**: `src/components/select/select.tsx`

```tsx
interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  group?: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  placeholder?: string;
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  multiple?: boolean;
  clearable?: boolean;
  searchable?: boolean;
  size?: 'sm' | 'md' | 'lg';
  error?: string;
  label?: string;
  helpText?: string;
  disabled?: boolean;
  loading?: boolean;
}
```

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `options` | `SelectOption[]` | **required** | Array de opciones |
| `placeholder` | `string` | — | Texto sin selección |
| `value` / `defaultValue` | `string` | — | Controlado / no controlado |
| `onChange` | `(value: string) => void` | — | Callback cambio |
| `multiple` | `boolean` | `false` | Multi-selección |
| `clearable` | `boolean` | `false` | Botón limpiar |
| `searchable` | `boolean` | `false` | Filtrado + type-ahead |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Tamaño trigger |
| `error` | `string` | — | Mensaje error + estilo destructivo |
| `label` | `string` | — | Label asociado |
| `helpText` | `string` | — | Texto ayuda |
| `disabled` | `boolean` | `false` | Deshabilitado completo |
| `loading` | `boolean` | `false` | Estado carga |

**Funcionalidad integrada**: Búsqueda, filtrado, grupos, multi-select con chips, clearable, loading state, accesibilidad completa (ARIA combobox/listbox)

> **Nota**: Implementación incluye type guard `isSelectGroup` para discriminar correctamente `SelectGroup` vs `SelectOption` en el renderizado.

---

### 2.5 Table (Data-Driven)
**Archivo**: `src/components/table/table.tsx`

```tsx
interface TableColumn<T = Record<string, unknown>> {
  key: string;
  header: string;
  accessor?: keyof T | ((row: T) => React.ReactNode);
  width?: string;
  minWidth?: string;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  render?: (value: unknown, row: T, index: number) => React.ReactNode;
}

interface TableProps<T = Record<string, unknown>> {
  columns: TableColumn<T>[];
  data: T[];
  rowKey?: keyof T | ((row: T) => string);
  variant?: 'default' | 'striped' | 'bordered';
  size?: 'sm' | 'md' | 'lg';
  sortable?: boolean;
  sortColumn?: string;
  sortDirection?: 'asc' | 'desc';
  onSort?: (column: string, direction: 'asc' | 'desc') => void;
  selectable?: boolean;
  selectedRows?: string[];
  onSelectionChange?: (selectedKeys: string[]) => void;
  renderActions?: (row: T, index: number) => React.ReactNode;
  emptyState?: React.ReactNode;
  loading?: boolean;
  loadingRows?: number;
  stickyHeader?: boolean;
  responsive?: boolean;
  caption?: string;
  className?: string;
}
```

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `columns` | `TableColumn[]` | **required** | Definición de columnas |
| `data` | `T[]` | **required** | Datos a mostrar |
| `rowKey` | `keyof T \| (row) => string` | `'id'` | Clave única por fila (incluye `'id'` en tipo) |

> **Nota**: Fix aplicado - `rowKey` type incluye `'id'` explícitamente. Checkbox indeterminado usa ref callback pattern.

| `variant` | `'default' \| 'striped' \| 'bordered'` | `'default'` | Estilo visual |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Padding celdas |
| `sortable` | `boolean` | `false` | Habilitar ordenación |
| `selectable` | `boolean` | `false` | Selección múltiple filas |
| `renderActions` | `(row, index) => ReactNode` | — | Acciones por fila |
| `emptyState` | `ReactNode` | — | Contenido estado vacío |
| `loading` | `boolean` | `false` | Skeleton loading |
| `stickyHeader` | `boolean` | `false` | Header fixed |
| `responsive` | `boolean` | `true` | Scroll horizontal mobile |

**Funcionalidad**: Ordenación, selección múltiple, acciones por fila, loading skeleton, estado vacío, sticky header, responsive

---

### 2.6 NavLink
**Archivo**: `src/components/nav-link/nav-link.tsx`

```tsx
interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  exact?: boolean;
  icon?: React.ReactNode;
  badge?: string | number;
  className?: string;
}
```

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `href` | `string` | **required** | Ruta destino |
| `exact` | `boolean` | `false` | Match exacto vs prefix |
| `icon` | `ReactNode` | — | Icono leading (ej: `<Icon name="dashboard" category="nav" size="md" />`) |
| `badge` | `string \| number` | — | Badge contador |

**Lógica activa**: `usePathname()` (Next.js) → `pathname === href` (exact) o `pathname.startsWith(href)` (prefix)

---

### 2.7 Badge
**Archivo**: `src/components/badge/badge.tsx`

```tsx
interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'brand';
  size?: 'sm' | 'md';
  dot?: boolean;
}
```

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `variant` | 6 variantes | `'default'` | Color semántico |
| `size` | `'sm' \| 'md'` | `'md'` | `text-btc-caption` vs `text-btc-control` |
| `dot` | `boolean` | `false` | Indicador circular CSS (::before) |

**Variantes**: `default`, `success`, `warning`, `error`, `info`, `brand`

---

### 2.8 Textfield
**Archivo**: `src/components/textfield/textfield.tsx`

```tsx
interface TextfieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: 'default' | 'filled' | 'outlined';
}
```

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `label` | `string` | — | Label asociado (genera htmlFor) |
| `error` | `string` | — | Mensaje error + aria-invalid |
| `helperText` | `string` | — | Texto ayuda bajo input |
| `leftIcon` | `ReactNode` | — | Icono leading (position absolute) |
| `rightIcon` | `ReactNode` | — | Icono trailing (position absolute) |
| `variant` | `'default' \| 'filled' \| 'outlined'` | `'default'` | Estilo visual |

**Variantes**: `default` (border), `filled` (bg-raised), `outlined` (border-2)

---

### 2.9 EmptyState
**Archivo**: `src/components/empty-state/empty-state.tsx`

```tsx
interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  illustration?: 'default' | 'search' | 'folder' | 'inbox' | 'users';
  className?: string;
}
```

**Ilustraciones** (usan `Icon` category="empty" size="xl"): `default` (Package), `search` (Target), `folder` (Building), `inbox` (Building2), `users` (Building)

---

### 2.10 LoadingState
**Archivo**: `src/components/loading-state/loading-state.tsx`

```tsx
interface LoadingStateProps {
  variant?: 'skeleton' | 'spinner' | 'inline' | 'page';
  lines?: number;
  width?: string;
  height?: string;
  className?: string;
  'aria-label'?: string;
}
```

**Variantes**: `skeleton` (barras animadas), `spinner` (SVG inline), `inline` (spinner chico), `page` (full viewport)

---

### 2.11 ErrorState
**Archivo**: `src/components/error-state/error-state.tsx`

```tsx
interface ErrorStateProps {
  title?: string;
  message?: string;
  variant?: 'default' | 'inline' | 'toast';
  onRetry?: () => void;
  onDismiss?: () => void;
  className?: string;
}
```

---

### 2.12 ErrorPage
**Archivo**: `src/components/error-page/error-page.tsx`

```tsx
interface ErrorPageProps {
  code: 401 | 403 | 404 | 500 | 503 | 'maintenance' | 'offline';
  title?: string;
  message?: string;
  action?: React.ReactNode;
  className?: string;
}
```

---

### 2.13 CopyButton
**Archivo**: `src/components/copy-button/copy-button.tsx`

```tsx
interface CopyButtonProps {
  text: string;
  variant?: 'ghost' | 'outline' | 'primary';
  size?: 'sm' | 'md' | 'lg';
  successMessage?: string;
  className?: string;
}
```

---

### 2.14 BackButton
**Archivo**: `src/components/back-button/back-button.tsx`

```tsx
interface BackButtonProps {
  fallbackHref?: string;
  variant?: 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children?: React.ReactNode;
  className?: string;
}
```

> **Nota**: Implementación usa ref forwarding separado para `<button>` y `<a>` con renderizado condicional. No extiende `ButtonHTMLAttributes` para evitar conflictos con `onClick` nativo.

---

### 2.15 ThemeToggle
**Archivo**: `src/components/theme-toggle/theme-toggle.tsx`

```tsx
interface ThemeToggleProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  /** Temas disponibles */
  themes?: Theme[];
  /** Tema actual controlado */
  value?: Theme;
  /** Tema por defecto */
  defaultValue?: Theme;
  /** Callback al cambiar */
  onChange?: (theme: Theme) => void;
  /** Variante visual */
  variant?: 'button' | 'dropdown';
  /** Tamaño */
  size?: 'sm' | 'md' | 'lg';
  /** Mostrar etiquetas */
  showLabels?: boolean;
  /** Clase del contenedor (para dropdown) */
  className?: string;
}
```

> **Nota**: Usa `Omit<ButtonHTMLAttributes, 'onChange'>` para evitar conflicto con el `onChange` propio del componente.

---

### 2.16 Skeleton
**Archivo**: `src/components/skeleton/skeleton.tsx`

```tsx
interface SkeletonProps {
  variant?: 'text' | 'rect' | 'circle' | 'card' | 'table-row';
  lines?: number;
  width?: string;
  height?: string;
  className?: string;
}
```

---

## 3. Primitivas Nativas (7)

### 3.1 Label
**Archivo**: `src/components/label/label.tsx`

```tsx
interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
  helpText?: string;
  error?: string;
}
```

---

### 3.2 Separator
**Archivo**: `src/components/separator/separator.tsx`

```tsx
interface SeparatorProps extends React.HTMLAttributes<HTMLHRElement> {
  orientation?: 'horizontal' | 'vertical';
  variant?: 'default' | 'dashed' | 'dotted' | 'thick';
  label?: string;
}
```

---

### 3.3 Slot
**Archivo**: `src/components/slot/slot.tsx`

```tsx
interface SlotProps {
  asChild?: boolean;
  children: React.ReactElement;
}
```

> **Nota**: Usa `React.ComponentPropsWithRef` simplificado para generic forwardRef. Exporta tipo simplificado sin genéricos complejos.

---

### 3.4 Toast + ToastProvider + ToastViewport + useToast
**Archivo**: `src/components/toast/toast.tsx`

```tsx
interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  id: string;
  title?: string;
  message?: string;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  duration?: number;
  action?: { label: string; onClick: () => void };
  onClose?: (id: string) => void;
  dismissible?: boolean;
}

interface ToastProviderProps {
  children: React.ReactNode;
  portalId?: string;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  maxToasts?: number;
  gap?: number;
}

type ToastViewportProps = React.HTMLAttributes<HTMLDivElement>;
```

**Hook**: `useToast()` → `{ addToast, removeToast, clearToasts }`

> **Nota**: `ToastViewportProps` usa `type` alias (no `interface`) para evitar warning `@typescript-eslint/no-empty-object-type`.

---

### 3.5 DropdownMenu (Compound Components)
**Archivo**: `src/components/dropdown-menu/dropdown-menu.tsx`

```tsx
export const DropdownMenu = Object.assign(DropdownMenuRoot, {
  Trigger: DropdownMenuTrigger,
  Content: DropdownMenuContent,
  Item: DropdownMenuItem,
  CheckboxItem: DropdownMenuCheckboxItem,
  RadioItem: DropdownMenuRadioItem,
  Separator: DropdownMenuSeparator,
  Label: DropdownMenuLabel,
});
```

**Sub-componentes**: `Trigger`, `Content`, `Item`, `CheckboxItem`, `RadioItem`, `Separator`, `Label`
**Funcionalidad**: Portal, keyboard nav, checkbox/radio items, separador, label

> **Nota**: Fixes aplicados - children callable pattern corregido, variable `pos` con null check, imports/variables no usadas removidas.

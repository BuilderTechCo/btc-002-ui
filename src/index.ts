// @buildertech/ui - Barrel Export Principal
// Versión: 0.1.0

// ============================================
// UTILIDADES (lib)
// ============================================
export { clsx } from "./lib/classnames";
export type { ClassValue } from "./lib/classnames";

export { Icon } from "./lib/icon";
export type { IconProps, IconName, IconCategory, IconSize } from "./lib/icon";

// ============================================
// COMPONENTES BASE (16)
// ============================================
export { Button } from "./components/button";
export type {
  ButtonProps,
  ButtonVariant,
  ButtonSize,
} from "./components/button";

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardActions,
} from "./components/card";
export type {
  CardProps,
  CardVariant,
  CardPadding,
  CardHeaderProps,
  CardTitleProps,
  CardDescriptionProps,
  CardContentProps,
  CardFooterProps,
  CardActionsProps,
} from "./components/card";

export {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogFooter,
  DialogClose,
} from "./components/dialog";
export type {
  DialogProps,
  DialogSize,
  DialogAlign,
  DialogHeaderProps,
  DialogContentProps,
  DialogFooterProps,
  DialogCloseProps,
} from "./components/dialog";

export { Select } from "./components/select";
export type {
  SelectProps,
  SelectOption,
  SelectGroup,
  SelectSide,
  SelectAlign,
} from "./components/select";

export { Table } from "./components/table";
export type {
  TableProps,
  TableColumn,
  TableVariant,
  TableSize,
} from "./components/table";

export { NavLink } from "./components/nav-link";
export type { NavLinkProps } from "./components/nav-link";

export { Badge } from "./components/badge";
export type { BadgeProps, BadgeVariant, BadgeSize } from "./components/badge";

export { TextField } from "./components/textfield";
export type {
  TextFieldProps,
  TextFieldVariant,
  TextFieldSize,
} from "./components/textfield";

export { EmptyState } from "./components/empty-state";
export type {
  EmptyStateProps,
  EmptyStateIllustration,
} from "./components/empty-state";

export { LoadingState } from "./components/loading-state";
export type {
  LoadingStateProps,
  LoadingStateVariant,
} from "./components/loading-state";

export { ErrorState } from "./components/error-state";
export type { ErrorStateProps } from "./components/error-state";

export { ErrorPage } from "./components/error-page";
export type { ErrorPageProps, ErrorPageCode } from "./components/error-page";

export { CopyButton } from "./components/copy-button";
export type { CopyButtonProps } from "./components/copy-button";

export { BackButton } from "./components/back-button";
export type { BackButtonProps } from "./components/back-button";

export { ThemeToggle } from "./components/theme-toggle";
export type { ThemeToggleProps, Theme } from "./components/theme-toggle";

export { Skeleton } from "./components/skeleton";
export type { SkeletonProps, SkeletonVariant } from "./components/skeleton";

// ============================================
// PRIMITIVAS NATIVAS (7)
// ============================================
export { Label } from "./components/label";
export type { LabelProps } from "./components/label";

export { Separator } from "./components/separator";
export type {
  SeparatorProps,
  SeparatorOrientation,
  SeparatorVariant,
} from "./components/separator";

export { Slot } from "./components/slot";
export type { SlotProps } from "./components/slot";

export {
  Toast,
  ToastProvider,
  ToastViewport,
  useToast,
} from "./components/toast";
export type {
  ToastProps,
  ToastProviderProps,
  ToastViewportProps,
  ToastVariant,
} from "./components/toast";

export { DropdownMenu } from "./components/dropdown-menu";
export type {
  DropdownMenuProps,
  DropdownMenuTriggerProps,
  DropdownMenuContentProps,
  DropdownMenuItemProps,
  DropdownMenuCheckboxItemProps,
  DropdownMenuRadioItemProps,
  DropdownMenuSeparatorProps,
  DropdownMenuLabelProps,
} from "./components/dropdown-menu";

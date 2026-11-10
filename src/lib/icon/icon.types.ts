// @buildertech/ui - Icon Types
// Tipos para el componente Icon (Lucide React wrapper semántico)

import type { LucideIcon } from 'lucide-react';

/** Categorías semánticas de iconos */
export type IconCategory = 'nav' | 'action' | 'status' | 'empty';

/** Tamaños predefinidos */
export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/** Mapeo de nombre de icono a componente Lucide */
export type IconName =
  // Navigation
  | 'dashboard'
  | 'crm'
  | 'organizations'
  | 'prospecting'
  | 'components'
  | 'user'
  | 'logout'
  | 'menu'
  | 'chevronLeft'
  | 'chevronRight'
  | 'chevronUp'
  | 'chevronDown'
  | 'home'
  | 'settings'
  | 'search'
  | 'sun'
  | 'moon'
  | 'monitor'
  | 'bell'

  // Actions
  | 'plus'
  | 'edit'
  | 'delete'
  | 'copy'
  | 'download'
  | 'upload'
  | 'share'
  | 'refresh'
  | 'save'
  | 'cancel'
  | 'check'
  | 'close'
  | 'moreHorizontal'
  | 'moreVertical'
  | 'filter'
  | 'sort'
  | 'externalLink'
  | 'eye'
  | 'eyeOff'
  | 'creditCard'

  // Status
  | 'success'
  | 'error'
  | 'warning'
  | 'info'
  | 'loading'
  | 'checkCircle'
  | 'alertCircle'
  | 'alertTriangle'
  | 'infoCircle'
  | 'loader'
  | 'loaderCircle'

  // Empty States
  | 'default'
  | 'folder'
  | 'inbox'
  | 'users'
  | 'package'
  | 'target'
  | 'building'
  | 'building2'
  | 'folderOpen'
  | 'layoutDashboard'
  | 'logOut'
  | 'wrench'
  | 'wifiOff'
  | 'file'
  | 'searchX';

/** Permite nombres Lucide adicionales sin romper la API tipada */
export type IconNameInput = IconName | (string & {});

/** Props del componente Icon */
export interface IconProps {
  /** Nombre del icono (clave en iconMap o nombre Lucide en camelCase) */
  name: IconNameInput;

  /** Categoría semántica (afecta aria y estilos por defecto) */
  category?: IconCategory;

  /** Tamaño predefinido */
  size?: IconSize;

  /** Color personalizado (override de categoría) */
  color?: string;

  /** Label para accesibilidad (requerido si no decorative) */
  'aria-label'?: string;

  /** Si es decorativo (oculta de lectores de pantalla) */
  decorative?: boolean;

  /** Clases adicionales */
  className?: string;

  /** Props adicionales del elemento SVG */
  [key: string]: unknown;
}

/** Mapa de iconos: category:name → LucideIcon */
export type IconMap = Record<string, LucideIcon>;

/** Configuración de tamaño en px por tamaño */
export const ICON_SIZE_MAP: Record<IconSize, number> = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
};

/** Configuración de color por categoría (light mode) */
export const ICON_COLOR_MAP: Record<IconCategory, string> = {
  nav: 'var(--btc-text-secondary)',
  action: 'var(--btc-text-brand)',
  status: 'currentColor',
  empty: 'var(--btc-text-muted)',
};

/** Configuración de color por categoría (dark mode) */
export const ICON_COLOR_MAP_DARK: Record<IconCategory, string> = {
  nav: 'var(--btc-text-secondary)',
  action: 'var(--btc-text-brand)',
  status: 'currentColor',
  empty: 'var(--btc-text-muted)',
};
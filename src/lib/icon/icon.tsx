// @buildertech/ui - Icon Component
// Wrapper semántico de Lucide React con props: name, category, size, color, aria-label, decorative

import { forwardRef } from 'react';
import * as LucideIcons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { IconProps, IconName, IconCategory, IconSize, IconMap } from './icon.types';

/** Mapa de iconos: "category:name" → Componente Lucide */
const iconMap: IconMap = {
  // Navigation
  'nav:dashboard': LucideIcons.LayoutDashboard,
  'nav:crm': LucideIcons.Database,
  'nav:organizations': LucideIcons.Building2,
  'nav:prospecting': LucideIcons.Target,
  'nav:components': LucideIcons.Box,
  'nav:user': LucideIcons.User,
  'nav:logout': LucideIcons.LogOut,
  'nav:logOut': LucideIcons.LogOut,
  'nav:menu': LucideIcons.Menu,
  'nav:chevronLeft': LucideIcons.ChevronLeft,
  'nav:chevronRight': LucideIcons.ChevronRight,
  'nav:chevronUp': LucideIcons.ChevronUp,
  'nav:chevronDown': LucideIcons.ChevronDown,
  'nav:home': LucideIcons.Home,
  'nav:settings': LucideIcons.Settings,
  'nav:search': LucideIcons.Search,
  'nav:sun': LucideIcons.Sun,
  'nav:moon': LucideIcons.Moon,
  'nav:monitor': LucideIcons.Monitor,
  'nav:bell': LucideIcons.Bell,
  'nav:layoutDashboard': LucideIcons.LayoutDashboard,

  // Actions
  'action:plus': LucideIcons.Plus,
  'action:edit': LucideIcons.Edit,
  'action:delete': LucideIcons.Trash2,
  'action:copy': LucideIcons.Copy,
  'action:download': LucideIcons.Download,
  'action:upload': LucideIcons.Upload,
  'action:share': LucideIcons.Share2,
  'action:refresh': LucideIcons.RefreshCw,
  'action:save': LucideIcons.Save,
  'action:cancel': LucideIcons.X,
  'action:check': LucideIcons.Check,
  'action:close': LucideIcons.X,
  'action:moreHorizontal': LucideIcons.MoreHorizontal,
  'action:moreVertical': LucideIcons.MoreVertical,
  'action:filter': LucideIcons.Filter,
  'action:sort': LucideIcons.ArrowUpDown,
  'action:externalLink': LucideIcons.ExternalLink,
  'action:eye': LucideIcons.Eye,
  'action:eyeOff': LucideIcons.EyeOff,
  'action:creditCard': LucideIcons.CreditCard,
  'action:folderOpen': LucideIcons.FolderOpen,

  // Status
  'status:success': LucideIcons.CheckCircle2,
  'status:error': LucideIcons.XCircle,
  'status:warning': LucideIcons.AlertTriangle,
  'status:info': LucideIcons.Info,
  'status:loading': LucideIcons.Loader2,
  'status:checkCircle': LucideIcons.CheckCircle2,
  'status:alertCircle': LucideIcons.AlertCircle,
  'status:alertTriangle': LucideIcons.AlertTriangle,
  'status:infoCircle': LucideIcons.Info,
  'status:loader': LucideIcons.Loader2,
  'status:loaderCircle': LucideIcons.Loader2,
  'status:wifiOff': LucideIcons.WifiOff,

  // Empty States
  'empty:default': LucideIcons.Package,
  'empty:folder': LucideIcons.FolderOpen,
  'empty:folderOpen': LucideIcons.FolderOpen,
  'empty:inbox': LucideIcons.Inbox,
  'empty:users': LucideIcons.Users,
  'empty:package': LucideIcons.Package,
  'empty:target': LucideIcons.Target,
  'empty:building': LucideIcons.Building,
  'empty:building2': LucideIcons.Building2,
  'empty:wrench': LucideIcons.Wrench,
  'empty:file': LucideIcons.File,
  'empty:searchX': LucideIcons.SearchX,
  // Additional empty state icons for error-page
  'empty:user': LucideIcons.User,
  'empty:alertCircle': LucideIcons.AlertCircle,
  'empty:alertTriangle': LucideIcons.AlertTriangle,
  'empty:wifiOff': LucideIcons.WifiOff,
};

function toPascalCase(name: string): string {
  const normalized = name
    .replace(/[-_\s]+([a-zA-Z0-9])/g, (_match, char: string) => char.toUpperCase())
    .replace(/^[a-z]/, (char) => char.toUpperCase());

  return normalized;
}

function isLucideIcon(value: unknown): value is LucideIcon {
  return typeof value === 'function' || (typeof value === 'object' && value !== null);
}

/** Resuelve el componente Lucide por nombre y categoría */
export function resolveIcon(name: IconName, category: IconCategory = 'nav'): LucideIcon | null {
  const key = `${category}:${name}`;
  const direct = iconMap[key];
  if (direct) return direct;

  // Tolerar nombres que existen en otra categoría (ej. "user" en action)
  const match = Object.entries(iconMap).find(([iconKey]) => iconKey.endsWith(`:${name}`));
  if (match) return match[1];

  // Fallback: aceptar cualquier export PascalCase de lucide-react
  const lucideExport = LucideIcons[toPascalCase(name) as keyof typeof LucideIcons];
  if (isLucideIcon(lucideExport)) return lucideExport;

  return null;
}

/** Obtiene el tamaño en píxeles */
export function getSizePx(size: IconSize = 'md'): number {
  const sizes: Record<IconSize, number> = {
    xs: 12,
    sm: 16,
    md: 20,
    lg: 24,
    xl: 32,
  };
  return sizes[size] ?? 20;
}

/** Componente Icon */
export const Icon = forwardRef<SVGSVGElement, Omit<IconProps, 'ref'>>(
  (props: Omit<IconProps, 'ref'>, ref) => {
    // Extraer restProps manualmente - cast necesario por index signature
    const name: IconName = props.name as IconName;
    const category: IconCategory = (props.category as IconCategory | undefined) ?? 'nav';
    const size: IconSize = (props.size as IconSize | undefined) ?? 'md';
    const color = props.color as string | undefined;
    const ariaLabel = props['aria-label'] as string | undefined;
    const ariaHidden = props['aria-hidden'];
    const isAriaHidden = ariaHidden === true || ariaHidden === 'true';
    const decorative = (props.decorative as boolean | undefined) ?? isAriaHidden;
    const className = (props.className as string | undefined) ?? '';
    const { name: _name, category: _category, size: _size, color: _color, 'aria-label': _ariaLabel, decorative: _decorative, className: _className, ref: _ref, ...restProps } = props;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _ = { _name, _category, _size, _color, _ariaLabel, _decorative, _className, _ref };

    const IconComponent = resolveIcon(name, category);
    const sizePx = getSizePx(size);

    if (!IconComponent) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn(`[Icon] Icono no encontrado: ${category}:${name}`);
      }
      return null;
    }

    // Los iconos heredan el color del contexto; `color` permite sobrescribirlo.
    const resolvedColor = color ?? 'currentColor';

    // Props de accesibilidad
    const a11yProps = decorative
      ? { 'aria-hidden': 'true' as const, focusable: 'false' as const }
      : { 'aria-label': ariaLabel ?? name, role: 'img' as const };

    return (
      <IconComponent
        ref={ref}
        width={sizePx}
        height={sizePx}
        color={resolvedColor}
        className={className}
        {...a11yProps}
        {...(restProps as Record<string, unknown>)}
      />
    );
  }
);

Icon.displayName = 'Icon';

/** Re-export types for consumers */
export type { IconProps, IconName, IconCategory, IconSize, IconMap } from './icon.types';
export { ICON_SIZE_MAP, ICON_COLOR_MAP, ICON_COLOR_MAP_DARK } from './icon.types';

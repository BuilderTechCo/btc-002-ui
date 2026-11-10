// @buildertech/ui - NavLink Component
// Enlace de navegación accesible con estado activo, icono, badge, keyboard navigation

import { forwardRef, type AnchorHTMLAttributes } from "react";
import { clsx } from "../../lib/classnames";
import { Icon } from "../../lib/icon";

export interface NavLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Texto del enlace */
  children: React.ReactNode;

  /** Icono a la izquierda */
  leftIcon?: string;

  /** Categoría del icono */
  leftIconCategory?: "nav" | "action" | "status" | "empty";

  /** Badge de notificación */
  badge?: string | number;

  /** Variante del badge */
  badgeVariant?: "default" | "success" | "warning" | "error" | "info";

  /** Si está activo */
  active?: boolean;

  /** Si está deshabilitado */
  disabled?: boolean;

  /** Alineación del contenido */
  align?: "left" | "center";

  /** Tamaño del padding */
  padding?: "sm" | "md" | "lg";
}

const paddingClasses = {
  sm: "px-btc-2 py-btc-1",
  md: "px-btc-3 py-btc-2",
  lg: "px-btc-4 py-btc-3",
};

const badgeVariantClasses = {
  default: "bg-btc-brand text-btc-text-on-brand",
  success: "bg-btc-success-bg text-btc-success",
  warning: "bg-btc-warning-bg text-btc-warning",
  error: "bg-btc-error-bg text-btc-error",
  info: "bg-btc-info-bg text-btc-info",
};

export const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(
  (
    {
      children,
      leftIcon,
      leftIconCategory = "nav",
      badge,
      badgeVariant = "default",
      active = false,
      disabled = false,
      align = "left",
      padding = "md",
      className = "",
      onClick,
      ...props
    },
    ref,
  ) => {
    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (disabled) {
        e.preventDefault();
        return;
      }
      onClick?.(e);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLAnchorElement>) => {
      if (disabled) return;
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        // Dispara el click nativo para que onClick reciba un MouseEvent real
        e.currentTarget.click();
      }
    };

    return (
      <a
        ref={ref}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        aria-current={active ? "page" : undefined}
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : undefined}
        className={clsx(
          "inline-flex items-center gap-btc-2 font-medium rounded-btc-md",
          "transition-btc-colors duration-btc-fast",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-btc-border-focus focus-visible:ring-offset-2 focus-visible:ring-offset-btc-app",
          disabled && "pointer-events-none opacity-50 cursor-not-allowed",
          paddingClasses[padding],
          align === "center" && "justify-center",
          active
            ? "bg-btc-brand/10 text-btc-error"
            : "text-btc-text-secondary hover:bg-btc-raised hover:text-btc-text-primary",
          className,
        )}
        {...props}
      >
        {leftIcon && (
          <Icon
            name={leftIcon}
            category={leftIconCategory}
            size="md"
            aria-hidden="true"
          />
        )}
        <span className="truncate">{children}</span>
        {badge !== undefined && (
          <span
            className={clsx(
              "inline-flex items-center justify-center px-btc-1 py-btc-0",
              "text-btc-caption font-medium rounded-btc-full",
              badgeVariantClasses[badgeVariant],
            )}
            aria-label={
              typeof badge === "number" ? `${badge} notificaciones` : badge
            }
          >
            {badge}
          </span>
        )}
      </a>
    );
  },
);

NavLink.displayName = "NavLink";

/** Export types (ya exportados arriba) */

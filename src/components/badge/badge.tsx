// @buildertech/ui - Badge Component
// Etiqueta semántica: default, success, warning, error, info, outline
// Tamaños: sm, md, lg | Removible, con icono

import { forwardRef, type HTMLAttributes } from "react";
import { clsx } from "../../lib/classnames";
import { Icon } from "../../lib/icon";

export type BadgeVariant =
  "default" | "success" | "warning" | "error" | "info" | "outline";
export type BadgeSize = "sm" | "md" | "lg";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: string;
  iconCategory?: "nav" | "action" | "status" | "empty";
  removable?: boolean;
  onRemove?: () => void;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: "bg-btc-action-primary text-btc-text-on-brand",
  success: "bg-btc-success-bg text-btc-success border border-btc-success/20",
  warning: "bg-btc-warning-bg text-btc-warning border border-btc-warning/20",
  error: "bg-btc-error-bg text-btc-error border border-btc-error/20",
  info: "bg-btc-info-bg text-btc-info border border-btc-info/20",
  outline:
    "bg-transparent text-btc-text-secondary border border-btc-border-default",
};

const sizeClasses: Record<BadgeSize, string> = {
  sm: "px-btc-1 py-btc-0 text-btc-caption gap-btc-1",
  md: "px-btc-2 py-btc-1 text-btc-caption gap-btc-1",
  lg: "px-btc-3 py-btc-1 text-btc-body-s gap-btc-2",
};

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      children,
      variant = "default",
      size = "md",
      icon,
      iconCategory = "status",
      removable = false,
      onRemove,
      className = "",
      ...props
    },
    ref,
  ) => {
    return (
      <span
        ref={ref}
        className={clsx(
          "inline-flex items-center font-medium rounded-btc-full",
          "transition-btc-colors duration-btc-fast",
          variantClasses[variant],
          sizeClasses[size],
          removable && "pr-btc-1 cursor-pointer",
          className,
        )}
        {...props}
      >
        {icon && (
          <Icon
            name={icon}
            category={iconCategory}
            size="xs"
            aria-hidden="true"
          />
        )}
        <span>{children}</span>
        {removable && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemove?.();
            }}
            className={clsx(
              "inline-flex items-center justify-center rounded-btc-full",
              "hover:bg-btc-text-primary/10 transition-btc-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current",
              size === "sm" && "w-4 h-4",
              size === "md" && "w-5 h-5",
              size === "lg" && "w-6 h-6",
            )}
            aria-label="Eliminar"
          >
            <Icon name="close" category="action" size="xs" aria-hidden="true" />
          </button>
        )}
      </span>
    );
  },
);

Badge.displayName = "Badge";

/** Export types (ya exportados arriba) */

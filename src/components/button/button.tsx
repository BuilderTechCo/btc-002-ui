// @buildertech/ui - Button Component
// Botón principal con variantes: primary, outline, ghost, danger, danger-outline, info, info-outline
// Tamaños: sm, md, lg | Estados: loading, disabled

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { clsx } from "../../lib/classnames";
import { Icon } from "../../lib/icon";

export type ButtonVariant =
  | "primary"
  | "outline"
  | "ghost"
  | "danger"
  | "danger-outline"
  | "info"
  | "info-outline";

export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Variante visual del botón */
  variant?: ButtonVariant;

  /** Tamaño del botón */
  size?: ButtonSize;

  /** Si está en estado de carga */
  loading?: boolean;

  /** Icono a la izquierda del texto */
  leftIcon?: string;

  /** Categoría del icono izquierdo */
  leftIconCategory?: "nav" | "action" | "status" | "empty";

  /** Icono a la derecha del texto */
  rightIcon?: string;

  /** Categoría del icono derecho */
  rightIconCategory?: "nav" | "action" | "status" | "empty";

  /** Ancho completo */
  fullWidth?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-btc-action-primary text-btc-text-on-brand hover:bg-btc-action-hover active:bg-btc-action-pressed",
  outline:
    "bg-btc-action-primary-outline-bg border border-btc-action-primary-outline-border text-btc-action-primary-outline-text hover:bg-btc-action-primary-outline-hover-bg",
  ghost:
    "bg-btc-action-ghost-bg text-btc-action-ghost-text hover:bg-btc-action-ghost-hover-bg hover:text-btc-action-ghost-hover-text",
  danger:
    "bg-btc-error text-btc-text-on-brand hover:bg-btc-error/90 active:bg-btc-error",
  "danger-outline":
    "bg-btc-action-danger-outline-bg border border-btc-action-danger-outline-border text-btc-action-danger-outline-text hover:bg-btc-action-danger-outline-hover-bg",
  info: "bg-btc-info text-btc-text-on-brand hover:bg-btc-info/90 active:bg-btc-info",
  "info-outline":
    "bg-btc-action-info-outline-bg border border-btc-action-info-outline-border text-btc-action-info-outline-text hover:bg-btc-action-info-outline-hover-bg",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-btc-btn-sm px-btc-btn-px-sm text-btc-control gap-btc-1",
  md: "h-btc-btn-md px-btc-btn-px-md text-btc-control gap-btc-2",
  lg: "h-btc-btn-lg px-btc-btn-px-lg text-btc-body gap-btc-2",
};

const iconSizeMap: Record<ButtonSize, "xs" | "sm" | "md"> = {
  sm: "xs",
  md: "sm",
  lg: "md",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      disabled,
      leftIcon,
      leftIconCategory = "action",
      rightIcon,
      rightIconCategory = "action",
      fullWidth = false,
      className = "",
      children,
      "aria-label": ariaLabel,
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        type="button"
        disabled={isDisabled}
        aria-disabled={isDisabled}
        aria-busy={loading || undefined}
        aria-label={ariaLabel}
        className={clsx(
          "inline-flex items-center justify-center font-medium rounded-btc-md",
          "transition-btc-colors duration-btc-base ease-btc-standard",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-btc-border-focus focus-visible:ring-offset-2 focus-visible:ring-offset-btc-app",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "active:scale-[0.98]",
          variantClasses[variant],
          sizeClasses[size],
          fullWidth && "w-full",
          className,
        )}
        {...props}
      >
        {loading ? (
          <svg
            className="animate-spin"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="3"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : leftIcon ? (
          <Icon
            name={leftIcon}
            category={leftIconCategory}
            size={iconSizeMap[size]}
            aria-hidden="true"
          />
        ) : null}

        {children}

        {!loading && rightIcon && (
          <Icon
            name={rightIcon}
            category={rightIconCategory}
            size={iconSizeMap[size]}
            aria-hidden="true"
          />
        )}
      </button>
    );
  },
);

Button.displayName = "Button";

/** Export types (ya exportados arriba) */

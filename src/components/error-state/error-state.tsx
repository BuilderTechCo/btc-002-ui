// @buildertech/ui - ErrorState Component
// Estado de error con reintento, dismissible, detalles técnicos

import { type HTMLAttributes } from "react";
import { clsx } from "../../lib/classnames";
import { Icon } from "../../lib/icon";
import { Button } from "../button";

export interface ErrorStateProps extends HTMLAttributes<HTMLDivElement> {
  /** Título del error */
  title?: string;

  /** Mensaje descriptivo */
  message?: string;

  /** Callback para reintentar */
  onRetry?: () => void;

  /** Texto del botón reintentar */
  retryLabel?: string;

  /** Callback para descartar */
  onDismiss?: () => void;

  /** Mostrar detalles técnicos */
  details?: string;

  /** Variante visual */
  variant?: "default" | "inline" | "toast";

  /** Tamaño */
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "p-btc-3 gap-btc-2",
  md: "p-btc-4 gap-btc-3",
  lg: "p-btc-6 gap-btc-4",
};

const variantClasses = {
  default: "bg-btc-error-bg border border-btc-error/20 rounded-btc-lg",
  inline: "bg-btc-error-bg border border-btc-error/20 rounded-btc-md",
  toast:
    "bg-btc-error-bg border border-btc-error/20 rounded-btc-lg shadow-btc-3",
};

export function ErrorState({
  title = "Algo salió mal",
  message,
  onRetry,
  retryLabel = "Reintentar",
  onDismiss,
  details,
  variant = "default",
  size = "md",
  className = "",
  ...props
}: ErrorStateProps) {
  return (
    <div
      className={clsx(
        "flex flex-col items-start gap-btc-2",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      role="alert"
      {...props}
    >
      <div className="flex items-start gap-btc-3 w-full">
        <div className="flex-shrink-0 size-8 rounded-btc-full bg-btc-error/10 flex items-center justify-center text-btc-error">
          <Icon
            name="alertCircle"
            category="status"
            size="md"
            aria-hidden="true"
          />
        </div>

        <div className="flex-1 min-w-0 flex flex-col gap-btc-1">
          <h4 className="text-btc-control font-semibold text-btc-error">
            {title}
          </h4>
          {message && (
            <p className="text-btc-body-s text-btc-error">{message}</p>
          )}

          {details && (
            <details className="group">
              <summary className="text-btc-caption text-btc-text-muted cursor-pointer hover:text-btc-text-secondary flex items-center gap-btc-1 list-none [&::-webkit-details-marker]:hidden">
                <Icon
                  name="chevronDown"
                  category="nav"
                  size="xs"
                  className="transition-transform group-open:rotate-[180deg]"
                  aria-hidden="true"
                />
                Ver detalles técnicos
              </summary>
              <pre className="mt-btc-2 p-btc-2 bg-btc-app/50 rounded-btc-sm text-btc-caption text-btc-text-muted overflow-x-auto font-btc-mono">
                {details}
              </pre>
            </details>
          )}

          {(onRetry || onDismiss) && (
            <div className="flex items-center gap-btc-2 mt-btc-1">
              {onRetry && (
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon="refresh"
                  leftIconCategory="action"
                  onClick={onRetry}
                >
                  {retryLabel}
                </Button>
              )}
              {onDismiss && (
                <Button variant="ghost" size="sm" onClick={onDismiss}>
                  Descartar
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/** Export types (ya exportados arriba) */

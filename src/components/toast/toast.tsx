// @buildertech/ui - Toast Component
// Sistema de notificaciones toast accesible (ARIA live region)

"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { clsx } from "../../lib/classnames";
import { Icon } from "../../lib/icon";

export type ToastVariant = "default" | "success" | "warning" | "error" | "info";

export interface ToastStyle {
  bg: string;
  border: string;
  icon: string;
  color: string;
}

export interface ToastProps extends HTMLAttributes<HTMLDivElement> {
  /** ID único */
  id: string;

  /** Título */
  title?: string;

  /** Mensaje */
  message?: string;

  /** Variante */
  variant?: ToastVariant;

  /** Duración en ms (0 = no auto-cerrar) */
  duration?: number;

  /** Acción principal */
  action?: {
    label: string;
    onClick: () => void;
  };

  /** Callback al cerrar */
  onClose?: (id: string) => void;

  /** Si se puede descartar */
  dismissible?: boolean;

  /** Variant style (injected by provider) */
  variantStyle?: ToastStyle;
}

export interface ToastProviderProps {
  children: ReactNode;
  /** Contenedor portal ID. Si no existe, se usa document.body */
  portalId?: string;
  /** Posición */
  position?:
    | "top-right"
    | "top-left"
    | "bottom-right"
    | "bottom-left"
    | "top-center"
    | "bottom-center";
  /** Máximo toasts visibles */
  maxToasts?: number;
  /** Gap entre toasts */
  gap?: number;
}

export type ToastViewportProps = HTMLAttributes<HTMLDivElement>;

interface ToastContextValue {
  toasts: ToastProps[];
  addToast: (toast: Omit<ToastProps, "id"> & { id?: string }) => string;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const variantStyles: Record<ToastVariant, ToastStyle> = {
  default: {
    bg: "bg-btc-surface",
    border: "border-btc-border-default",
    icon: "info",
    color: "text-btc-info",
  },
  success: {
    bg: "bg-btc-success-bg",
    border: "border-btc-success/20",
    icon: "checkCircle",
    color: "text-btc-success",
  },
  warning: {
    bg: "bg-btc-warning-bg",
    border: "border-btc-warning/20",
    icon: "alertTriangle",
    color: "text-btc-warning",
  },
  error: {
    bg: "bg-btc-error-bg",
    border: "border-btc-error/20",
    icon: "alertCircle",
    color: "text-btc-error",
  },
  info: {
    bg: "bg-btc-info-bg",
    border: "border-btc-info/20",
    icon: "info",
    color: "text-btc-info",
  },
};

const positionClasses: Record<
  NonNullable<ToastProviderProps["position"]>,
  string
> = {
  "top-right": "top-0 right-0 items-end",
  "top-left": "top-0 left-0 items-start",
  "bottom-right": "bottom-0 right-0 items-end",
  "bottom-left": "bottom-0 left-0 items-start",
  "top-center": "top-0 left-1/2 -translate-x-1/2 items-center",
  "bottom-center": "bottom-0 left-1/2 -translate-x-1/2 items-center",
};

export function ToastProvider({
  children,
  portalId,
  position = "top-right",
  maxToasts = 5,
  gap = 8,
}: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastProps[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const addToast = useCallback(
    (toast: Omit<ToastProps, "id"> & { id?: string }) => {
      const id =
        toast.id ??
        `toast-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
      const newToast: ToastProps = { ...toast, id } as ToastProps;
      setToasts((prev) => [...prev.slice(-(maxToasts - 1)), newToast]);
      return id;
    },
    [maxToasts],
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);

  const viewport = (
    <div
      className={clsx(
        "fixed z-btc-toast flex w-full max-w-md flex-col p-btc-4 pointer-events-none",
        positionClasses[position],
      )}
      style={{ gap }}
      aria-label="Notificaciones"
    >
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          {...toast}
          onClose={removeToast}
          variantStyle={variantStyles[toast.variant ?? "default"]}
          className="pointer-events-auto"
        />
      ))}
    </div>
  );

  return (
    <ToastContext.Provider
      value={{ toasts, addToast, removeToast, clearToasts }}
    >
      {children}
      {mounted &&
        createPortal(
          viewport,
          (portalId ? document.getElementById(portalId) : null) ??
            document.body,
        )}
    </ToastContext.Provider>
  );
}

function Toast({
  id,
  title,
  message,
  variant: _variant = "default",
  duration = 5000,
  action,
  onClose,
  dismissible = true,
  variantStyle = variantStyles.default,
  className = "",
  ...props
}: ToastProps & { variantStyle?: ToastStyle }) {
  useEffect(() => {
    if (duration > 0) {
      const timer = window.setTimeout(() => onClose?.(id), duration);
      return () => window.clearTimeout(timer);
    }
  }, [id, duration, onClose]);

  return (
    <div
      role="alert"
      aria-live="polite"
      aria-atomic="true"
      className={clsx(
        "flex w-full items-start gap-btc-3",
        "rounded-btc-lg border p-btc-4 shadow-btc-4",
        "animate-slide-in-right",
        variantStyle.bg,
        variantStyle.border,
        className,
      )}
      {...props}
    >
      <div
        className={clsx(
          "flex size-8 shrink-0 items-center justify-center rounded-btc-full",
          variantStyle.color,
        )}
        style={{
          backgroundColor: "color-mix(in srgb, currentColor 12%, transparent)",
        }}
      >
        <Icon
          name={variantStyle.icon}
          category="status"
          size="sm"
          aria-hidden="true"
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-btc-1">
        {title && (
          <h4 className="text-btc-control font-semibold text-btc-text-primary">
            {title}
          </h4>
        )}
        {message && (
          <p className="text-btc-body-s text-btc-text-secondary">{message}</p>
        )}
        {action && (
          <button
            type="button"
            onClick={action.onClick}
            className={clsx(
              "mt-btc-1 w-fit self-start rounded-btc-sm",
              "text-btc-caption font-semibold text-btc-text-primary underline underline-offset-2",
              "transition-btc-colors duration-btc-fast hover:opacity-80",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-btc-border-focus",
            )}
          >
            {action.label}
          </button>
        )}
      </div>

      {dismissible && (
        <button
          type="button"
          onClick={() => onClose?.(id)}
          className={clsx(
            "shrink-0 rounded-btc-md p-btc-1 text-btc-text-muted",
            "hover:bg-btc-raised hover:text-btc-text-primary",
            "transition-btc-colors duration-btc-fast",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-btc-border-focus",
          )}
          aria-label="Cerrar notificación"
        >
          <Icon name="close" category="action" size="xs" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

export function ToastViewport({
  className = "",
  ...props
}: ToastViewportProps) {
  return (
    <div className={clsx("flex flex-col gap-btc-2", className)} {...props} />
  );
}

// Export the Toast component as well
export { Toast };

/** Export types (ya exportados arriba) */

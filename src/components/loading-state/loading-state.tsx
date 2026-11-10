// @buildertech/ui - LoadingState Component
// Estados de carga: spinner, skeleton, inline, full-page

import { type HTMLAttributes } from "react";
import { clsx } from "../../lib/classnames";
import { Icon } from "../../lib/icon";
import { Skeleton } from "../skeleton";

export type LoadingStateVariant = "spinner" | "skeleton" | "inline" | "full";

export interface LoadingStateProps extends HTMLAttributes<HTMLDivElement> {
  variant?: LoadingStateVariant;
  /** Texto para lectores de pantalla (por defecto "Cargando…") */
  label?: string;
  /** @deprecated Usa `label` en su lugar. Texto visible (mantenido por compatibilidad) */
  text?: string;
  size?: "sm" | "md" | "lg";
  skeletonLines?: number;
  skeletonWidth?: string | string[];
  fullScreen?: boolean;
}

const spinnerSizes = {
  sm: "size-4",
  md: "size-6",
  lg: "size-8",
};

export function LoadingState({
  variant = "spinner",
  label,
  text,
  size = "md",
  skeletonLines = 3,
  skeletonWidth = "100%",
  fullScreen = false,
  className = "",
  ...props
}: LoadingStateProps) {
  // Use label prop for screen-reader text, fallback to text for backward compat, then default
  const screenReaderText = label ?? text ?? "Cargando…";
  // Only show sr-only text if it differs from visible text, or if there's no visible text
  const showScreenReaderOnly = !text || label !== undefined;

  if (variant === "inline") {
    return (
      <span
        role="status"
        className={clsx(
          "inline-flex items-center gap-btc-2 text-btc-text-muted",
          className,
        )}
        {...props}
      >
        <Icon
          name="loader"
          category="status"
          size={size === "sm" ? "xs" : size === "md" ? "sm" : "md"}
          className="animate-spin"
          aria-hidden="true"
        />
        {showScreenReaderOnly && (
          <span className="sr-only">{screenReaderText}</span>
        )}
        {text && (
          <span className="text-btc-body-s text-btc-text-primary">{text}</span>
        )}
      </span>
    );
  }

  if (variant === "full" || fullScreen) {
    return (
      <div
        role="status"
        className={clsx(
          "fixed inset-0 z-btc-modal flex items-center justify-center bg-btc-app/95 backdrop-blur-sm",
          className,
        )}
        {...props}
      >
        <div className="flex flex-col items-center gap-btc-4 p-btc-8 rounded-btc-lg bg-btc-surface border border-btc-border-default shadow-btc-3">
          <div className="relative">
            <svg
              className="animate-spin text-btc-brand"
              width={size === "sm" ? 32 : size === "md" ? 48 : 64}
              height={size === "sm" ? 32 : size === "md" ? 48 : 64}
              viewBox="0 0 24 24"
              fill="none"
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
          </div>
          {showScreenReaderOnly && (
            <span className="sr-only">{screenReaderText}</span>
          )}
          {text && (
            <p className="text-btc-body text-btc-text-secondary text-center">
              {text}
            </p>
          )}
        </div>
      </div>
    );
  }

  if (variant === "skeleton") {
    const widths = Array.isArray(skeletonWidth)
      ? skeletonWidth
      : Array(skeletonLines).fill(skeletonWidth);
    return (
      <div
        role="status"
        className={clsx("flex flex-col gap-btc-3", className)}
        {...props}
      >
        {showScreenReaderOnly && (
          <span className="sr-only">{screenReaderText}</span>
        )}
        {widths.map((width, i) => (
          <Skeleton key={i} variant="text" width={width} />
        ))}
      </div>
    );
  }

  // spinner
  return (
    <div
      role="status"
      className={clsx("flex flex-col items-center gap-btc-3", className)}
      {...props}
    >
      <div className="relative">
        <svg
          className={clsx("animate-spin text-btc-brand", spinnerSizes[size])}
          viewBox="0 0 24 24"
          fill="none"
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
      </div>
      {showScreenReaderOnly && (
        <span className="sr-only">{screenReaderText}</span>
      )}
      {text && (
        <p className="text-btc-body-s text-btc-text-secondary text-center">
          {text}
        </p>
      )}
    </div>
  );
}

/** Export types (ya exportados arriba) */

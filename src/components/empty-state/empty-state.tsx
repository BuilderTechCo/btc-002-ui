// @buildertech/ui - EmptyState Component
// Estado vacío ilustrado con acción opcional

import { type HTMLAttributes } from "react";
import { clsx } from "../../lib/classnames";
import { Icon } from "../../lib/icon";
import { Button } from "../button";

export type EmptyStateIllustration =
  | "default"
  | "folder"
  | "inbox"
  | "users"
  | "package"
  | "target"
  | "building"
  | "building2";

export interface EmptyStateProps extends HTMLAttributes<HTMLDivElement> {
  /** Título principal */
  title: string;

  /** Descripción */
  description?: string;

  /** Ilustración */
  illustration?: EmptyStateIllustration;

  /** Acción principal */
  action?: {
    label: string;
    onClick: () => void;
    variant?: "primary" | "outline" | "ghost";
    icon?: string;
  };

  /** Acción secundaria */
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };

  /** Tamaño del contenedor */
  size?: "sm" | "md" | "lg";

  /** Centrar contenido */
  centered?: boolean;
}

const sizeClasses = {
  sm: "max-w-sm p-btc-6",
  md: "max-w-md p-btc-8",
  lg: "max-w-lg p-btc-8",
};

const illustrationIcons: Record<EmptyStateIllustration, string> = {
  default: "package",
  folder: "folder",
  inbox: "inbox",
  users: "users",
  package: "package",
  target: "target",
  building: "building",
  building2: "building2",
};

export function EmptyState({
  title,
  description,
  illustration = "default",
  action,
  secondaryAction,
  size = "md",
  centered = true,
  className = "",
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={clsx(
        "rounded-btc-lg bg-btc-surface border border-btc-border-default",
        "flex flex-col items-center text-center gap-btc-4",
        sizeClasses[size],
        centered && "mx-auto",
        className,
      )}
      {...props}
    >
      <div className="flex size-16 rounded-btc-full bg-btc-brand/10 items-center justify-center text-btc-brand">
        <Icon
          name={illustrationIcons[illustration]}
          category="empty"
          size="xl"
          aria-hidden="true"
        />
      </div>

      <div className="flex flex-col gap-btc-2 w-full">
        <h3 className="text-btc-h3 font-semibold text-btc-text-primary">
          {title}
        </h3>
        {description && (
          <p className="text-btc-body text-btc-text-primary">{description}</p>
        )}
      </div>

      {(action || secondaryAction) && (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-btc-2 w-full mt-btc-2">
          {action && (
            <Button
              variant={action.variant ?? "primary"}
              leftIcon={action.icon}
              leftIconCategory="action"
              onClick={action.onClick}
              className="w-full sm:w-auto"
            >
              {action.label}
            </Button>
          )}
          {secondaryAction && (
            <Button
              variant="ghost"
              onClick={secondaryAction.onClick}
              className="w-full sm:w-auto"
            >
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

/** Export types (ya exportados arriba) */

// @buildertech/ui - ErrorPage Component
// Páginas de error completas: 404, 500, 403, 401, maintenance, offline

import { type HTMLAttributes } from "react";
import { clsx } from "../../lib/classnames";
import { Icon } from "../../lib/icon";
import { Button } from "../button";
import { BackButton } from "../back-button";

export type ErrorPageCode =
  401 | 403 | 404 | 500 | 503 | "maintenance" | "offline";

export interface ErrorPageProps extends HTMLAttributes<HTMLDivElement> {
  /** Código de error */
  code: ErrorPageCode;

  /** Título personalizado */
  title?: string;

  /** Mensaje personalizado */
  message?: string;

  /** Acción principal */
  action?: {
    label: string;
    onClick: () => void;
    href?: string;
  };

  /** Acción secundaria */
  secondaryAction?: {
    label: string;
    onClick: () => void;
    href?: string;
  };

  /** Mostrar botón "Volver" */
  showBackButton?: boolean;

  /** Callback del botón volver */
  onBack?: () => void;

  /** Centrar en pantalla */
  centered?: boolean;
}

const errorConfig: Record<
  ErrorPageCode,
  {
    icon: string;
    defaultTitle: string;
    defaultMessage: string;
    iconClass: string;
    displayCode: string;
  }
> = {
  401: {
    icon: "user",
    defaultTitle: "No autorizado",
    defaultMessage: "Debes iniciar sesión para acceder a esta página.",
    iconClass: "bg-btc-warning/10 text-btc-warning",
    displayCode: "401",
  },
  403: {
    icon: "alertCircle",
    defaultTitle: "Acceso denegado",
    defaultMessage: "No tienes permisos para ver esta página.",
    iconClass: "bg-btc-error/10 text-btc-error",
    displayCode: "403",
  },
  404: {
    icon: "target",
    defaultTitle: "Página no encontrada",
    defaultMessage: "La página que buscas no existe o ha sido movida.",
    iconClass: "bg-btc-info/10 text-btc-info",
    displayCode: "404",
  },
  500: {
    icon: "alertTriangle",
    defaultTitle: "Error del servidor",
    defaultMessage:
      "Algo salió mal en nuestro lado. Estamos trabajando en solucionarlo.",
    iconClass: "bg-btc-error/10 text-btc-error",
    displayCode: "500",
  },
  503: {
    icon: "wrench",
    defaultTitle: "Servicio no disponible",
    defaultMessage: "Estamos realizando mantenimiento. Vuelve en unos minutos.",
    iconClass: "bg-btc-warning/10 text-btc-warning",
    displayCode: "503",
  },
  maintenance: {
    icon: "wrench",
    defaultTitle: "En mantenimiento",
    defaultMessage: "El sistema está en mantenimiento programado.",
    iconClass: "bg-btc-warning/10 text-btc-warning",
    displayCode: "503",
  },
  offline: {
    icon: "wifiOff",
    defaultTitle: "Sin conexión",
    defaultMessage: "Parece que estás sin conexión a internet.",
    iconClass: "bg-btc-error/10 text-btc-error",
    displayCode: "Offline",
  },
};

export function ErrorPage({
  code,
  title,
  message,
  action,
  secondaryAction,
  showBackButton = true,
  onBack,
  centered = true,
  className = "",
  ...props
}: ErrorPageProps) {
  const config = errorConfig[code];
  const displayTitle = title ?? config.defaultTitle;
  const displayMessage = message ?? config.defaultMessage;

  return (
    <div
      className={clsx(
        "flex flex-col items-center justify-center gap-btc-6",
        "min-h-[60vh] px-btc-4",
        centered && "mx-auto",
        className,
      )}
      {...props}
    >
      {showBackButton && (
        <div className="w-full max-w-md">
          <BackButton onClick={onBack} />
        </div>
      )}

      <div className="flex flex-col items-center text-center gap-btc-4 max-w-md">
        <div
          className={clsx(
            "flex size-20 items-center justify-center rounded-btc-full",
            config.iconClass,
          )}
        >
          <Icon
            name={config.icon}
            category="empty"
            size="xl"
            aria-hidden="true"
          />
        </div>

        <div>
          <h1 className="text-btc-display font-bold text-btc-text-primary mb-btc-2">
            {config.displayCode}
          </h1>
          <h2 className="text-btc-h2 font-semibold text-btc-text-primary mb-btc-2">
            {displayTitle}
          </h2>
          <p className="text-btc-body text-btc-text-secondary">
            {displayMessage}
          </p>
        </div>

        {(action || secondaryAction) && (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-btc-3 w-full mt-btc-2">
            {action && (
              <Button
                variant="primary"
                onClick={action.onClick}
                className="w-full sm:w-auto"
              >
                {action.label}
              </Button>
            )}
            {secondaryAction && (
              <Button
                variant="outline"
                onClick={secondaryAction.onClick}
                className="w-full sm:w-auto"
              >
                {secondaryAction.label}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/** Export types (ya exportados arriba) */

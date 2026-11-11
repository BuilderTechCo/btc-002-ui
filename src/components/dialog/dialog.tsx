// @buildertech/ui - Dialog Component
// Modal accesible (ARIA role="dialog", focus trap, ESC para cerrar, Portal)
// Tamaños: sm, md, lg, xl, full | Alineación: center, top, bottom

"use client";

import {
  forwardRef,
  useEffect,
  useId,
  useRef,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { clsx } from "../../lib/classnames";
import { Icon } from "../../lib/icon";

export type DialogSize = "sm" | "md" | "lg" | "xl" | "full";
export type DialogAlign = "center" | "top" | "bottom";

export interface DialogProps {
  /** Si el dialog está abierto */
  open: boolean;

  /** Callback al cerrar */
  onClose: () => void;

  /** Título del dialog */
  title?: string;

  /** Descripción para accesibilidad */
  description?: string;

  /** Contenido del dialog */
  children: ReactNode;

  /** Tamaño del dialog */
  size?: DialogSize;

  /** Alineación vertical */
  align?: DialogAlign;

  /** Si se cierra al click fuera */
  closeOnOverlayClick?: boolean;

  /** Si se cierra con ESC */
  closeOnEscape?: boolean;

  /** Renderizar en portal (por defecto en document.body) */
  portal?: boolean;

  /** ID de un contenedor portal explícito. Si no existe, se usa document.body */
  portalId?: string;
}

export type DialogHeaderProps = HTMLAttributes<HTMLDivElement>;
export type DialogContentProps = HTMLAttributes<HTMLDivElement>;
export type DialogFooterProps = HTMLAttributes<HTMLDivElement>;
export interface DialogCloseProps extends HTMLAttributes<HTMLButtonElement> {
  onClose: () => void;
}

const sizeClasses: Record<DialogSize, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  full: "max-w-4xl w-full mx-btc-4",
};

const alignClasses: Record<DialogAlign, string> = {
  center: "items-center justify-center",
  top: "items-start justify-center pt-btc-16",
  bottom: "items-end justify-center pb-btc-16",
};

const focusableSelector =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

const DialogRoot = forwardRef<HTMLDivElement, DialogProps>(
  (
    {
      open,
      onClose,
      title,
      description,
      children,
      size = "md",
      align = "center",
      closeOnOverlayClick = true,
      closeOnEscape = true,
      portal = true,
      portalId,
    },
    ref,
  ) => {
    const dialogRef = useRef<HTMLDivElement | null>(null);
    const previousActiveElement = useRef<HTMLElement | null>(null);
    const previousBodyOverflow = useRef<string>("");
    const titleId = useId();
    const descriptionId = useId();
    const hasHeader = Boolean(title || description);

    useEffect(() => {
      if (!open) return;

      previousActiveElement.current = document.activeElement as HTMLElement;
      previousBodyOverflow.current = document.body.style.overflow;

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape" && closeOnEscape) {
          onClose();
          return;
        }

        if (e.key === "Tab") {
          const focusableElements =
            dialogRef.current?.querySelectorAll<HTMLElement>(focusableSelector);
          if (!focusableElements?.length) return;

          const firstElement = focusableElements[0];
          const lastElement = focusableElements[focusableElements.length - 1];

          if (firstElement && lastElement) {
            if (e.shiftKey && document.activeElement === firstElement) {
              e.preventDefault();
              lastElement.focus();
            } else if (!e.shiftKey && document.activeElement === lastElement) {
              e.preventDefault();
              firstElement.focus();
            }
          }
        }
      };

      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";

      const focusTimer = window.setTimeout(() => {
        const firstFocusable =
          dialogRef.current?.querySelector<HTMLElement>(focusableSelector);
        firstFocusable?.focus();
      }, 0);

      return () => {
        window.clearTimeout(focusTimer);
        document.removeEventListener("keydown", handleKeyDown);
        document.body.style.overflow = previousBodyOverflow.current;
        previousActiveElement.current?.focus();
      };
    }, [open, closeOnEscape, onClose]);

    if (!open) return null;

    function setDialogNode(node: HTMLDivElement | null) {
      dialogRef.current = node;
      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    }

    const dialogContent = (
      <div
        className={clsx(
          "fixed inset-0 z-btc-modal flex bg-black/50 backdrop-blur-sm animate-fade-in",
          alignClasses[align],
        )}
        onClick={(e) => {
          if (closeOnOverlayClick && e.target === e.currentTarget) {
            onClose();
          }
        }}
        role="presentation"
      >
        <div
          ref={setDialogNode}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? titleId : undefined}
          aria-describedby={description ? descriptionId : undefined}
          className={clsx(
            "relative flex w-full max-h-[var(--btc-dialog-max-h,85vh)] flex-col overflow-hidden",
            "rounded-btc-lg border border-btc-border-default bg-btc-surface shadow-btc-5",
            "animate-zoom-in",
            sizeClasses[size],
          )}
        >
          {hasHeader ? (
            <div className="flex items-start justify-between gap-btc-4 border-b border-btc-border-subtle px-btc-6 py-btc-4">
              <div className="min-w-0 flex-1">
                {title && (
                  <h2
                    id={titleId}
                    className="truncate text-btc-h4 font-semibold text-btc-text-primary"
                  >
                    {title}
                  </h2>
                )}
                {description && (
                  <p
                    id={descriptionId}
                    className="mt-btc-1 text-btc-body-s text-btc-text-secondary"
                  >
                    {description}
                  </p>
                )}
              </div>
              <DialogClose onClose={onClose} className="-mr-btc-2 -mt-btc-1" />
            </div>
          ) : (
            <DialogClose
              onClose={onClose}
              className="absolute right-btc-3 top-btc-3 z-btc-sticky"
            />
          )}

          <div className="flex-1 overflow-y-auto" role="document">
            <div className="p-btc-6 has-[>[data-dialog-content]]:p-btc-0 has-[>[data-dialog-footer]]:pb-btc-0">
              {children}
            </div>
          </div>
        </div>
      </div>
    );

    if (portal && typeof document !== "undefined") {
      // Importante: por defecto se monta en <body>. Un contenedor con
      // transform/filter/contain rompería position:fixed y anclaría el
      // overlay arriba a la izquierda.
      const portalRoot = portalId ? document.getElementById(portalId) : null;
      return createPortal(dialogContent, portalRoot ?? document.body);
    }

    return dialogContent;
  },
);

DialogRoot.displayName = "Dialog";

/** Header - Se usa internamente, expuesto para casos avanzados */
export const DialogHeader = forwardRef<HTMLDivElement, DialogHeaderProps>(
  ({ className = "", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-dialog-header=""
        className={clsx(
          "flex items-start justify-between gap-btc-4",
          "border-b border-btc-border-subtle px-btc-6 py-btc-4",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);

DialogHeader.displayName = "DialogHeader";

/** Content */
export const DialogContent = forwardRef<HTMLDivElement, DialogContentProps>(
  ({ className = "", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-dialog-content=""
        className={clsx("flex-1 overflow-y-auto p-btc-6", className)}
        {...props}
      >
        {children}
      </div>
    );
  },
);

DialogContent.displayName = "DialogContent";

/** Footer */
export const DialogFooter = forwardRef<HTMLDivElement, DialogFooterProps>(
  ({ className = "", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-dialog-footer=""
        className={clsx(
          "flex items-center justify-end gap-btc-2",
          "border-t border-btc-border-subtle px-btc-6 py-btc-4",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);

DialogFooter.displayName = "DialogFooter";

/** Close Button */
export const DialogClose = forwardRef<HTMLButtonElement, DialogCloseProps>(
  ({ onClose, className = "", ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        onClick={onClose}
        className={clsx(
          "rounded-btc-md p-btc-1",
          "text-btc-text-muted hover:bg-btc-raised hover:text-btc-text-primary",
          "transition-btc-colors duration-btc-fast",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-btc-border-focus",
          className,
        )}
        aria-label="Cerrar"
        {...props}
      >
        <Icon name="close" category="action" size="md" aria-hidden="true" />
      </button>
    );
  },
);

DialogClose.displayName = "DialogClose";

/**
 * API pública: `Dialog` expone los sub-componentes como estáticos
 * (`Dialog.Header`, `Dialog.Content`, `Dialog.Footer`, `Dialog.Close`)
 * y además se exportan por nombre desde el barrel.
 */
export const Dialog = Object.assign(DialogRoot, {
  Header: DialogHeader,
  Content: DialogContent,
  Footer: DialogFooter,
  Close: DialogClose,
});

/** Export types (ya exportados arriba) */

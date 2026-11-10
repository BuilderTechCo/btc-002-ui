// @buildertech/ui - Card Component
// Contenedor flexible: variant (default, outlined, elevated) + padding (none, sm, md, lg)
// Sub-componentes: Header, Title, Description, Content, Footer, Actions

import {
  createContext,
  forwardRef,
  useContext,
  type HTMLAttributes,
} from "react";
import { clsx } from "../../lib/classnames";
import { Slot } from "../slot";

export type CardVariant = "default" | "outlined" | "elevated" | "elevated-bordered";
export type CardPadding = "none" | "sm" | "md" | "lg";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  padding?: CardPadding;
}

export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  onClose?: () => void;
  closeAriaLabel?: string;
  leftIcon?: React.ReactNode;
}
export type CardTitleProps = HTMLAttributes<HTMLHeadingElement>;
export type CardDescriptionProps = HTMLAttributes<HTMLParagraphElement>;
export type CardContentProps = HTMLAttributes<HTMLDivElement>;
export type CardFooterProps = HTMLAttributes<HTMLDivElement>;
export type CardActionsProps = HTMLAttributes<HTMLDivElement>;

const variantClasses: Record<CardVariant, string> = {
  default: "bg-btc-surface border border-btc-border-default",
  outlined: "bg-transparent border border-btc-border-strong",
  elevated: "bg-btc-surface border-none shadow-btc-2",
  "elevated-bordered": "bg-btc-surface border border-btc-border-default shadow-btc-2",
};

const paddingClasses: Record<CardPadding, string> = {
  none: "",
  sm: "p-btc-3",
  md: "p-btc-4",
  lg: "p-btc-6",
};

/**
 * Cuando el Card ya aporta padding, Header/Footer lo cancelan con márgenes
 * negativos para que sus divisores lleguen a los bordes del contenedor.
 */
const sectionBleed: Record<CardPadding, { header: string; footer: string }> = {
  none: {
    header: "px-btc-4 pt-btc-4 pb-btc-3",
    footer: "px-btc-4 pt-btc-3 pb-btc-4",
  },
  sm: {
    header: "-mx-btc-3 -mt-btc-3 px-btc-3 pt-btc-3 pb-btc-2",
    footer: "-mx-btc-3 -mb-btc-3 px-btc-3 pt-btc-2 pb-btc-3",
  },
  md: {
    header: "-mx-btc-4 -mt-btc-4 px-btc-4 pt-btc-4 pb-btc-3",
    footer: "-mx-btc-4 -mb-btc-4 px-btc-4 pt-btc-3 pb-btc-4",
  },
  lg: {
    header: "-mx-btc-6 -mt-btc-6 px-btc-6 pt-btc-6 pb-btc-4",
    footer: "-mx-btc-6 -mb-btc-6 px-btc-6 pt-btc-4 pb-btc-6",
  },
};

const CardPaddingContext = createContext<CardPadding>("md");

const CardRoot = forwardRef<HTMLDivElement, CardProps>(
  (
    { variant = "default", padding = "md", className = "", children, ...props },
    ref,
  ) => {
    return (
      <CardPaddingContext.Provider value={padding}>
        <div
          ref={ref}
          className={clsx(
            "rounded-btc-lg",
            variantClasses[variant],
            paddingClasses[padding],
            className,
          )}
          {...props}
        >
          {children}
        </div>
      </CardPaddingContext.Provider>
    );
  },
);

CardRoot.displayName = "Card";

/** Header - apila título/descripción y separa con un divisor sutil */
export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({
    className = "",
    children,
    onClose,
    closeAriaLabel = "Cerrar",
    leftIcon,
    ...props
  }, ref) => {
    const padding = useContext(CardPaddingContext);

    return (
      <div
        ref={ref}
        className={clsx(
          "flex flex-col items-start gap-btc-1 border-b border-btc-border-subtle",
          sectionBleed[padding].header,
          className,
        )}
        {...props}
      >
        <div className="flex w-full items-center justify-between gap-btc-2">
          <div className="flex flex-col items-start gap-btc-1 flex-1 min-w-0">
            {leftIcon && (
              <div className="flex gap-btc-2">
                <div className="flex items-start">
                  <Slot className="shrink-0">{leftIcon}</Slot>
                </div>
                <div className="flex flex-col gap-btc-1 flex-1 min-w-0">{children}</div>
              </div>
            )}
            {!leftIcon && <div className="flex flex-col gap-btc-1">{children}</div>}
          </div>
          {onClose && (
              <button
                type="button"
                className="flex h-btc-8 w-btc-8 items-center justify-center rounded-btc-md text-btc-text-muted hover:text-btc-text-primary hover:bg-btc-raised transition-colors duration-btc-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-btc-border-focus"
                onClick={onClose}
                aria-label={closeAriaLabel}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
        </div>
      </div>
    );
  },
);

CardHeader.displayName = "CardHeader";

/** Title - h3, font-semibold, text-btc-text-primary */
export const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className = "", children, ...props }, ref) => {
    return (
      <h3
        ref={ref}
        className={clsx(
          "text-btc-h3 font-semibold text-btc-text-primary",
          className,
        )}
        {...props}
      >
        {children}
      </h3>
    );
  },
);

CardTitle.displayName = "CardTitle";

/** Description - text-btc-caption, text-btc-text-primary */
export const CardDescription = forwardRef<
  HTMLParagraphElement,
  CardDescriptionProps
>(({ className = "", children, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={clsx("text-btc-caption text-btc-text-primary", className)}
      {...props}
    >
      {children}
    </p>
  );
});

CardDescription.displayName = "CardDescription";

/** Content - ocupa el espacio restante; el padding lo aporta el Card */
export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ className = "", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx("flex flex-col gap-btc-3 min-w-0 py-btc-3", className)}
        {...props}
      >
        {children}
      </div>
    );
  },
);

CardContent.displayName = "CardContent";

/** Footer - acciones alineadas a la derecha con divisor superior */
export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className = "", children, ...props }, ref) => {
    const padding = useContext(CardPaddingContext);

    return (
      <div
        ref={ref}
        className={clsx(
          "flex items-center justify-end gap-btc-2 mt-btc-4 border-t border-btc-border-subtle",
          sectionBleed[padding].footer,
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);

CardFooter.displayName = "CardFooter";

/** Actions - contenedor de acciones (sin borde; úsalo dentro de CardFooter) */
export const CardActions = forwardRef<HTMLDivElement, CardActionsProps>(
  ({ className = "", children, ...props }, ref) => {
    const padding = useContext(CardPaddingContext);

    return (
      <div
        ref={ref}
        className={clsx(
          "flex items-center justify-end gap-btc-2",
          sectionBleed[padding].footer,
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);

CardActions.displayName = "CardActions";

/**
 * API pública: `Card` conserva los sub-componentes como estáticos
 * (`Card.Header`, `Card.Title`, ...) y además se exportan por nombre.
 */
export const Card = Object.assign(CardRoot, {
  Header: CardHeader,
  Title: CardTitle,
  Description: CardDescription,
  Content: CardContent,
  Footer: CardFooter,
  Actions: CardActions,
});

/** Export types (ya exportados arriba) */

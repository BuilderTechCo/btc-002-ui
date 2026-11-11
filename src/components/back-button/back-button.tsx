// @buildertech/ui - BackButton Component
// Botón "Volver" accesible con navegación programática o href

import {
  forwardRef,
  useImperativeHandle,
  useRef,
  type ButtonHTMLAttributes,
} from "react";
import { clsx } from "../../lib/classnames";
import { Icon } from "../../lib/icon";

// Simplified approach: use only the non-conflicting props
// Define common props that work for both button and anchor (avoiding conflicting event handler types)
type CommonProps = Pick<
  ButtonHTMLAttributes<HTMLButtonElement>,
  | "className"
  | "style"
  | "id"
  | "disabled"
  | "tabIndex"
  | "aria-label"
  | "aria-describedby"
  | "aria-expanded"
  | "aria-controls"
  | "aria-pressed"
  | "role"
> & {
  onClick?: (
    e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>,
  ) => void;
  onFocus?: (
    e: React.FocusEvent<HTMLButtonElement | HTMLAnchorElement>,
  ) => void;
  onBlur?: (e: React.FocusEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
  onKeyDown?: (
    e: React.KeyboardEvent<HTMLButtonElement | HTMLAnchorElement>,
  ) => void;
  onKeyUp?: (
    e: React.KeyboardEvent<HTMLButtonElement | HTMLAnchorElement>,
  ) => void;
};

export interface BackButtonProps extends CommonProps {
  /** Texto del botón */
  children?: React.ReactNode;

  /** Icono personalizado */
  icon?: string;

  /** Variante */
  variant?: "ghost" | "outline";

  /** Tamaño */
  size?: "sm" | "md" | "lg";

  /** Si usa navegación del navegador (history.back) */
  useHistoryBack?: boolean;

  /** Fallback href si no hay history */
  fallbackHref?: string;

  /** href opcional - si se proporciona, renderiza como <a> */
  href?: string;
}

// Ref union type for both button and anchor
type BackButtonRef = HTMLButtonElement | HTMLAnchorElement;

// Use a simpler approach: render with proper ref handling
export const BackButton = forwardRef<BackButtonRef, BackButtonProps>(
  (
    {
      children = "Volver",
      icon = "chevronLeft",
      variant = "ghost",
      size = "md",
      useHistoryBack = true,
      fallbackHref,
      className = "",
      onClick,
      href,
      onFocus,
      onBlur,
      onKeyDown,
      onKeyUp,
      ...props
    },
    ref,
  ) => {
    const isLink = !!href;
    const buttonRef = useRef<HTMLButtonElement>(null);
    const anchorRef = useRef<HTMLAnchorElement>(null);

    // Forward the ref to the appropriate element
    useImperativeHandle(ref, () => {
      const el = isLink ? anchorRef.current : buttonRef.current;
      return el!;
    }, [isLink]);

    function handleClick(
      e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>,
    ) {
      if (isLink) {
        onClick?.(e);
        return;
      }

      if (useHistoryBack && window.history.length > 1) {
        e.preventDefault();
        window.history.back();
      } else if (fallbackHref) {
        window.location.href = fallbackHref;
      }
      onClick?.(e);
    }

    const baseClassName = clsx(
      "inline-flex items-center gap-btc-2 font-medium rounded-btc-md",
      "transition-btc-colors duration-btc-fast",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-btc-border-focus focus-visible:ring-offset-2 focus-visible:ring-offset-btc-app",
      variant === "ghost"
        ? "bg-btc-action-ghost-bg text-btc-action-ghost-text hover:bg-btc-action-ghost-hover-bg hover:text-btc-action-ghost-hover-text"
        : "bg-btc-action-primary-outline-bg border border-btc-action-primary-outline-border text-btc-action-primary-outline-text hover:bg-btc-action-primary-outline-hover-bg",
      size === "sm" && "px-btc-2 py-btc-1 text-btc-caption",
      size === "md" && "px-btc-3 py-btc-2 text-btc-control",
      size === "lg" && "px-btc-4 py-btc-3 text-btc-body",
      className,
    );

    // Extract only safe props to spread (avoid conflicting types)
    const {
      disabled,
      tabIndex,
      "aria-label": ariaLabel,
      "aria-describedby": ariaDescribedby,
      "aria-expanded": ariaExpanded,
      "aria-controls": ariaControls,
      "aria-pressed": ariaPressed,
      role,
      style,
      ...restProps
    } = props;

    const safeProps = {
      disabled,
      tabIndex,
      "aria-label": ariaLabel,
      "aria-describedby": ariaDescribedby,
      "aria-expanded": ariaExpanded,
      "aria-controls": ariaControls,
      "aria-pressed": ariaPressed,
      role,
      style,
    };

    if (isLink) {
      return (
        <a
          ref={anchorRef}
          href={href}
          onClick={handleClick}
          onFocus={onFocus}
          onBlur={onBlur}
          onKeyDown={onKeyDown}
          onKeyUp={onKeyUp}
          className={baseClassName}
          {...safeProps}
          {...restProps}
        >
          <Icon
            name={icon}
            category="nav"
            size={size === "sm" ? "xs" : size === "md" ? "sm" : "md"}
            aria-hidden="true"
          />
          {children}
        </a>
      );
    }

    return (
      <button
        ref={buttonRef}
        type="button"
        onClick={handleClick}
        onFocus={onFocus}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
        className={baseClassName}
        {...safeProps}
        {...restProps}
      >
        <Icon
          name={icon}
          category="nav"
          size={size === "sm" ? "xs" : size === "md" ? "sm" : "md"}
          aria-hidden="true"
        />
        {children}
      </button>
    );
  },
);

BackButton.displayName = "BackButton";

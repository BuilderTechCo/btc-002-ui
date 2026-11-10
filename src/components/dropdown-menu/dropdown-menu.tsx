// @buildertech/ui - DropdownMenu Component
// Menú desplegable accesible (Radix-style) con items, checkbox, radio, separador

"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
  type HTMLAttributes,
  type ButtonHTMLAttributes,
} from "react";
import { createPortal } from "react-dom";
import { clsx } from "../../lib/classnames";
import { Icon } from "../../lib/icon";

interface DropdownMenuContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLButtonElement>;
  contentRef: React.RefObject<HTMLDivElement>;
  contentId: string;
}

const DropdownMenuContext = createContext<DropdownMenuContextValue | null>(
  null,
);

export interface DropdownMenuProps {
  children: ReactNode;
  modal?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export interface DropdownMenuTriggerProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "aria-label"
> {
  children: ReactNode;
  /** Obligatorio para accesibilidad: describe la acción del menú */
  "aria-label": string;
}

export interface DropdownMenuContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  align?: "start" | "end" | "center";
  side?: "top" | "bottom" | "left" | "right";
  sideOffset?: number;
  avoidCollisions?: boolean;
}

export interface DropdownMenuItemProps extends Omit<
  HTMLAttributes<HTMLButtonElement>,
  "onSelect"
> {
  children: ReactNode;
  disabled?: boolean;
  inset?: boolean;
  shortcut?: string;
  icon?: string;
  iconCategory?: "nav" | "action" | "status" | "empty";
  onSelect?: (value: string) => void;
}

export interface DropdownMenuCheckboxItemProps extends HTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  checked?: boolean;
  disabled?: boolean;
  value: string;
  onCheckedChange?: (checked: boolean) => void;
}

export interface DropdownMenuRadioItemProps extends HTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  checked?: boolean;
  disabled?: boolean;
  value: string;
  onCheckedChange?: (value: string) => void;
}

export type DropdownMenuSeparatorProps = HTMLAttributes<HTMLHRElement>;

export interface DropdownMenuLabelProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  inset?: boolean;
}

function DropdownMenuRoot({ children, onOpenChange }: DropdownMenuProps) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const contentId = useId();

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    onOpenChange?.(nextOpen);
  }

  const contextValue: DropdownMenuContextValue = {
    open,
    onOpenChange: handleOpenChange,
    triggerRef,
    contentRef,
    contentId,
  };

  return (
    <DropdownMenuContext.Provider value={contextValue}>
      {typeof children === "function"
        ? (
            children as (args: {
              open: boolean;
              onOpenChange: (open: boolean) => void;
            }) => ReactNode
          )({ open, onOpenChange: handleOpenChange })
        : children}
    </DropdownMenuContext.Provider>
  );
}

/** Sub-components for composition */
export const DropdownMenu = Object.assign(DropdownMenuRoot, {
  Trigger: DropdownMenuTrigger,
  Content: DropdownMenuContent,
  Item: DropdownMenuItem,
  CheckboxItem: DropdownMenuCheckboxItem,
  RadioItem: DropdownMenuRadioItem,
  Separator: DropdownMenuSeparator,
  Label: DropdownMenuLabel,
});

/** Alias histórico conservado para compatibilidad interna. */
export const DropdownMenuCompound = DropdownMenu;

function useDropdownMenu() {
  const context = useContext(DropdownMenuContext);
  if (!context) {
    throw new Error("DropdownMenu components must be used within DropdownMenu");
  }
  return context;
}

export function DropdownMenuTrigger({
  children,
  "aria-label": ariaLabel,
  className = "",
  onClick,
  onKeyDown,
  ...props
}: DropdownMenuTriggerProps) {
  const { open, onOpenChange, triggerRef, contentId } = useDropdownMenu();

  return (
    <button
      ref={triggerRef}
      type="button"
      aria-haspopup="menu"
      aria-expanded={open}
      aria-controls={open ? contentId : undefined}
      aria-label={ariaLabel}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) onOpenChange(!open);
      }}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (event.defaultPrevented) return;
        if (event.key === "ArrowDown" || event.key === "ArrowUp") {
          event.preventDefault();
          onOpenChange(true);
        }
      }}
      className={clsx("inline-flex items-center gap-btc-2", className)}
      {...props}
    >
      {children}
    </button>
  );
}

DropdownMenuTrigger.displayName = "DropdownMenuTrigger";

export function DropdownMenuContent({
  children,
  align = "start",
  side = "bottom",
  sideOffset = 4,
  avoidCollisions = true,
  className = "",
  ...props
}: DropdownMenuContentProps) {
  const { open, onOpenChange, contentRef, triggerRef, contentId } =
    useDropdownMenu();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const reposition = useCallback(() => {
    if (!triggerRef.current || !contentRef.current) return;

    const margin = 8;
    const trigger = triggerRef.current.getBoundingClientRect();
    const content = contentRef.current;
    const width = content.offsetWidth;
    const height = content.offsetHeight;

    let top: number;
    let left: number;

    if (side === "bottom" || side === "top") {
      top =
        side === "bottom"
          ? trigger.bottom + sideOffset
          : trigger.top - height - sideOffset;

      left =
        align === "end"
          ? trigger.right - width
          : align === "center"
            ? trigger.left + trigger.width / 2 - width / 2
            : trigger.left;

      if (avoidCollisions) {
        const overflowsBottom = top + height > window.innerHeight - margin;
        const overflowsTop = top < margin;
        if (
          side === "bottom" &&
          overflowsBottom &&
          trigger.top - height - sideOffset >= margin
        ) {
          top = trigger.top - height - sideOffset;
        } else if (
          side === "top" &&
          overflowsTop &&
          trigger.bottom + height + sideOffset <= window.innerHeight - margin
        ) {
          top = trigger.bottom + sideOffset;
        }
      }
    } else {
      left =
        side === "right"
          ? trigger.right + sideOffset
          : trigger.left - width - sideOffset;

      top =
        align === "end"
          ? trigger.bottom - height
          : align === "center"
            ? trigger.top + trigger.height / 2 - height / 2
            : trigger.top;

      if (avoidCollisions) {
        const overflowsRight = left + width > window.innerWidth - margin;
        const overflowsLeft = left < margin;
        if (
          side === "right" &&
          overflowsRight &&
          trigger.left - width - sideOffset >= margin
        ) {
          left = trigger.left - width - sideOffset;
        } else if (
          side === "left" &&
          overflowsLeft &&
          trigger.right + width + sideOffset <= window.innerWidth - margin
        ) {
          left = trigger.right + sideOffset;
        }
      }
    }

    if (avoidCollisions) {
      left = Math.min(
        Math.max(left, margin),
        window.innerWidth - width - margin,
      );
      top = Math.min(
        Math.max(top, margin),
        window.innerHeight - height - margin,
      );
    }

    content.style.top = `${Math.round(top)}px`;
    content.style.left = `${Math.round(left)}px`;
  }, [align, side, sideOffset, avoidCollisions, triggerRef, contentRef]);

  useLayoutEffect(() => {
    if (!open) return;

    reposition();

    const handleViewportChange = () => reposition();
    window.addEventListener("resize", handleViewportChange);
    window.addEventListener("scroll", handleViewportChange, true);

    return () => {
      window.removeEventListener("resize", handleViewportChange);
      window.removeEventListener("scroll", handleViewportChange, true);
    };
  }, [open, reposition]);

  useEffect(() => {
    if (!open) return;

    const focusFrame = window.requestAnimationFrame(() => {
      contentRef.current
        ?.querySelector<HTMLElement>('[role^="menuitem"]:not([disabled])')
        ?.focus();
    });

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (
        contentRef.current?.contains(target) ||
        triggerRef.current?.contains(target)
      ) {
        return;
      }
      onOpenChange(false);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onOpenChange(false);
        triggerRef.current?.focus();
        return;
      }

      if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
        return;
      }

      const items = Array.from(
        contentRef.current?.querySelectorAll<HTMLElement>(
          '[role^="menuitem"]:not([disabled])',
        ) ?? [],
      );
      if (items.length === 0) return;

      event.preventDefault();
      const activeIndex = items.indexOf(document.activeElement as HTMLElement);

      if (event.key === "Home") {
        items[0]?.focus();
      } else if (event.key === "End") {
        items[items.length - 1]?.focus();
      } else if (event.key === "ArrowDown") {
        items[(activeIndex + 1 + items.length) % items.length]?.focus();
      } else {
        items[(activeIndex - 1 + items.length) % items.length]?.focus();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, contentRef, triggerRef, onOpenChange]);

  if (!open || !mounted) return null;

  return createPortal(
    <div
      ref={contentRef}
      id={contentId}
      role="menu"
      tabIndex={-1}
      className={clsx(
        "fixed z-btc-popover",
        "bg-btc-surface border border-btc-border-default rounded-btc-md shadow-btc-2",
        "p-btc-1 min-w-[160px] max-h-[300px] overflow-y-auto",
        "animate-zoom-in outline-none",
        className,
      )}
      {...props}
    >
      <div className="flex flex-col">{children}</div>
    </div>,
    document.body,
  );
}

DropdownMenuContent.displayName = "DropdownMenuContent";

export function DropdownMenuItem({
  children,
  disabled = false,
  inset = false,
  shortcut,
  icon,
  iconCategory = "action",
  onSelect,
  className = "",
  onClick,
  ...props
}: DropdownMenuItemProps) {
  const { onOpenChange } = useDropdownMenu();

  function handleClick() {
    if (disabled) return;
    onSelect?.("");
    onOpenChange(false);
  }

  return (
    <button
      type="button"
      role="menuitem"
      disabled={disabled}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) handleClick();
      }}
      className={clsx(
        "flex items-center justify-between gap-btc-2 w-full",
        "px-btc-3 py-btc-2 text-btc-body-s rounded-btc-sm",
        "text-btc-text-primary",
        "hover:bg-btc-raised focus:bg-btc-raised",
        "focus:outline-none focus:ring-2 focus:ring-btc-brand focus:ring-offset-2 focus:ring-offset-btc-surface",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        inset && "pl-btc-8",
        className,
      )}
      {...props}
    >
      {icon && (
        <Icon
          name={icon}
          category={iconCategory}
          size="sm"
          aria-hidden="true"
          className={clsx(inset && "ml-btc-4")}
        />
      )}
      <span className="flex-1 text-left">{children}</span>
      {shortcut && (
        <span className="text-btc-caption text-btc-text-muted font-btc-mono">
          {shortcut}
        </span>
      )}
    </button>
  );
}

DropdownMenuItem.displayName = "DropdownMenuItem";

export function DropdownMenuCheckboxItem({
  children,
  checked = false,
  disabled = false,
  value: _value,
  onCheckedChange,
  className = "",
  onClick,
  ...props
}: DropdownMenuCheckboxItemProps) {
  function handleClick() {
    if (disabled) return;
    onCheckedChange?.(!checked);
  }

  return (
    <button
      type="button"
      role="menuitemcheckbox"
      aria-checked={checked}
      disabled={disabled}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) handleClick();
      }}
      className={clsx(
        "flex items-center gap-btc-2 w-full",
        "px-btc-3 py-btc-2 text-btc-body-s rounded-btc-sm",
        "text-btc-text-primary",
        "hover:bg-btc-raised focus:bg-btc-raised",
        "focus:outline-none focus:ring-2 focus:ring-btc-brand focus:ring-offset-2 focus:ring-offset-btc-surface",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className,
      )}
      {...props}
    >
      <span
        className={clsx(
          "flex size-4 items-center justify-center rounded-btc-sm border bg-btc-surface text-btc-brand",
          checked ? "border-btc-brand" : "border-btc-border-default",
        )}
      >
        {checked && (
          <Icon name="check" category="action" size="xs" aria-hidden="true" />
        )}
      </span>
      <span>{children}</span>
    </button>
  );
}

DropdownMenuCheckboxItem.displayName = "DropdownMenuCheckboxItem";

export function DropdownMenuRadioItem({
  children,
  checked = false,
  disabled = false,
  value: _value,
  onCheckedChange,
  className = "",
  onClick,
  ...props
}: DropdownMenuRadioItemProps) {
  function handleClick() {
    if (disabled) return;
    onCheckedChange?.(_value);
  }

  return (
    <button
      type="button"
      role="menuitemradio"
      aria-checked={checked}
      disabled={disabled}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) handleClick();
      }}
      className={clsx(
        "flex items-center gap-btc-2 w-full",
        "px-btc-3 py-btc-2 text-btc-body-s rounded-btc-sm",
        "text-btc-text-primary",
        "hover:bg-btc-raised focus:bg-btc-raised",
        "focus:outline-none focus:ring-2 focus:ring-btc-brand focus:ring-offset-2 focus:ring-offset-btc-surface",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className,
      )}
      {...props}
    >
      <span
        className={clsx(
          "flex size-4 items-center justify-center rounded-btc-full border bg-btc-surface text-btc-brand",
          checked ? "border-btc-brand" : "border-btc-border-default",
        )}
      >
        {checked && <span className="size-1.5 rounded-btc-full bg-current" />}
      </span>
      <span>{children}</span>
    </button>
  );
}

DropdownMenuRadioItem.displayName = "DropdownMenuRadioItem";

export function DropdownMenuSeparator({
  className = "",
  ...props
}: DropdownMenuSeparatorProps) {
  return (
    <hr
      role="separator"
      className={clsx("my-btc-1 border-t border-btc-border-subtle", className)}
      {...props}
    />
  );
}

DropdownMenuSeparator.displayName = "DropdownMenuSeparator";

export function DropdownMenuLabel({
  children,
  inset = false,
  className = "",
  ...props
}: DropdownMenuLabelProps) {
  return (
    <div
      role="group"
      aria-label={typeof children === "string" ? children : undefined}
      className={clsx(
        "px-btc-3 py-btc-1 text-btc-caption font-medium text-btc-text-muted uppercase tracking-wider",
        inset && "pl-btc-8",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

DropdownMenuLabel.displayName = "DropdownMenuLabel";

/** Export types (ya exportados arriba) */

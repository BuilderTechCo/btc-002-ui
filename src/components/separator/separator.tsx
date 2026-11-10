// @buildertech/ui - Separator Component
// Separador visual accesible (hr) con orientación, variante, texto

import { forwardRef, type HTMLAttributes } from "react";
import { clsx } from "../../lib/classnames";

export type SeparatorOrientation = "horizontal" | "vertical";
export type SeparatorVariant = "default" | "dashed" | "dotted" | "thick";

export interface SeparatorProps extends HTMLAttributes<HTMLHRElement> {
  orientation?: SeparatorOrientation;
  variant?: SeparatorVariant;
  decorative?: boolean;
  label?: string;
}

const variantColorClasses: Record<SeparatorVariant, string> = {
  default: "border-btc-border-default",
  dashed: "border-btc-border-default border-dashed",
  dotted: "border-btc-border-default border-dotted",
  thick: "border-btc-border-strong",
};

function lineClasses(
  variant: SeparatorVariant,
  orientation: SeparatorOrientation,
): string {
  const isVertical = orientation === "vertical";
  const width =
    variant === "thick"
      ? isVertical
        ? "border-l-2"
        : "border-t-2"
      : isVertical
        ? "border-l"
        : "border-t";

  return clsx(variantColorClasses[variant], width);
}

export const Separator = forwardRef<HTMLHRElement, SeparatorProps>(
  (
    {
      orientation = "horizontal",
      variant = "default",
      decorative = true,
      label,
      className = "",
      ...props
    },
    ref,
  ) => {
    if (orientation === "vertical") {
      return (
        <hr
          ref={ref}
          role={decorative ? "none" : "separator"}
          aria-orientation="vertical"
          aria-label={label}
          className={clsx(
            "w-0 self-stretch",
            lineClasses(variant, orientation),
            className,
          )}
          {...props}
        />
      );
    }

    if (label && !decorative) {
      return (
        <div
          role="separator"
          aria-orientation="horizontal"
          aria-label={label}
          className={clsx("my-btc-4 flex items-center gap-btc-3", className)}
          {...props}
        >
          <hr
            ref={ref}
            className={clsx("flex-1", lineClasses(variant, orientation))}
          />
          <span className="whitespace-nowrap text-btc-caption font-medium text-btc-text-secondary">
            {label}
          </span>
          <hr className={clsx("flex-1", lineClasses(variant, orientation))} />
        </div>
      );
    }

    return (
      <hr
        ref={ref}
        role={decorative ? "none" : "separator"}
        aria-orientation="horizontal"
        aria-label={label}
        className={clsx("w-full", lineClasses(variant, orientation), className)}
        {...props}
      />
    );
  },
);

Separator.displayName = "Separator";

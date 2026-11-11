// @buildertech/ui - Skeleton Component
// Placeholder animado para carga de contenido

import { type HTMLAttributes } from "react";
import { clsx } from "../../lib/classnames";

export type SkeletonVariant = "text" | "rect" | "circle" | "card" | "table-row";

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: SkeletonVariant;
  width?: string | number;
  height?: string | number;
  lines?: number;
  animated?: boolean;
}

const variantStyles: Record<SkeletonVariant, string> = {
  text: "h-4 rounded-btc-sm",
  rect: "h-8 rounded-btc-md",
  circle: "aspect-square rounded-btc-full",
  card: "h-32 rounded-btc-lg",
  "table-row": "h-10 rounded-btc-sm",
};

const defaultCircleWidth = 40;

export function Skeleton({
  variant = "text",
  width,
  height,
  lines = 1,
  animated = true,
  className = "",
  ...props
}: SkeletonProps) {
  const resolvedWidth =
    width ?? (variant === "circle" ? defaultCircleWidth : "100%");
  const widthStyle =
    typeof resolvedWidth === "number" ? `${resolvedWidth}px` : resolvedWidth;

  if (variant === "text" && lines > 1) {
    return (
      <div className={clsx("flex flex-col gap-btc-2", className)} {...props}>
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={clsx(
              "bg-btc-border-strong",
              animated && "animate-skeleton",
              variantStyles.text,
              index === lines - 1 ? "w-3/4" : "w-full",
            )}
            style={{
              width: index === lines - 1 ? undefined : widthStyle,
              height: height ?? undefined,
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={clsx(
        "bg-btc-border-strong",
        animated && "animate-skeleton",
        variantStyles[variant],
        className,
      )}
      style={{
        width: widthStyle,
        height: typeof height === "number" ? `${height}px` : height,
      }}
      {...props}
    />
  );
}

/** Export types (ya exportados arriba) */

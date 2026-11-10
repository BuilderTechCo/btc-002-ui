// @buildertech/ui - clsx utility
// Exporta función `clsx` (no `cn`, no `classnames`)
// Configurado con tailwind-merge para btc-*

import { clsx as _clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// Valores de spacing usados en el design system
const SPACING_VALUES = [
  "btc-0",
  "btc-1",
  "btc-2",
  "btc-3",
  "btc-4",
  "btc-5",
  "btc-6",
  "btc-7",
  "btc-8",
  "btc-9",
  "btc-10",
  "btc-11",
  "btc-12",
  "btc-13",
  "btc-14",
  "btc-15",
  "btc-16",
  "btc-17",
  "btc-18",
  "btc-19",
  "btc-20",
];

// Extender tailwind-merge para reconocer prefijos btc-*
// Config extendida tipada como any para permitir class groups personalizados
const customTwMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      // Spacing - padding
      "p-btc": [{ p: SPACING_VALUES }],
      // Spacing - margin
      "m-btc": [{ m: SPACING_VALUES }],
      // Spacing - px
      "px-btc": [{ px: SPACING_VALUES }],
      // Spacing - py
      "py-btc": [{ py: SPACING_VALUES }],
      // Spacing - gap
      "gap-btc": [{ gap: SPACING_VALUES }],
      // Spacing - space
      "space-btc": [{ space: SPACING_VALUES }],
      // Width
      "w-btc": [{ w: SPACING_VALUES }],
      // Height
      "h-btc": [{ h: SPACING_VALUES }],
      // Min Width
      "min-w-btc": [{ "min-w": SPACING_VALUES }],
      // Max Width
      "max-w-btc": [{ "max-w": SPACING_VALUES }],
      // Min Height
      "min-h-btc": [{ "min-h": SPACING_VALUES }],
      // Max Height
      "max-h-btc": [{ "max-h": SPACING_VALUES }],
      // Tipografía (font-size tokens) — sin esto tailwind-merge confunde
      // `text-btc-body-s` (tamaño) con `text-btc-text-secondary` (color)
      // y elimina el tamaño al combinar ambas clases.
      "font-size": [
        {
          text: [
            "btc-display",
            "btc-h1",
            "btc-h2",
            "btc-h3",
            "btc-h4",
            "btc-body",
            "btc-body-s",
            "btc-control",
            "btc-caption",
            "btc-mono",
          ],
        },
      ],
      // Border Radius
      "rounded-btc": [
        {
          rounded: [
            "btc-xs",
            "btc-sm",
            "btc-md",
            "btc-lg",
            "btc-xl",
            "btc-2xl",
            "btc-full",
          ],
        },
      ],
      // Shadow
      "shadow-btc": [{ shadow: ["btc-1", "btc-2", "btc-3", "btc-4", "btc-5"] }],
      // Z-Index
      "z-btc": [
        {
          z: [
            "btc-base",
            "btc-dropdown",
            "btc-sticky",
            "btc-modal",
            "btc-popover",
            "btc-tooltip",
            "btc-toast",
          ],
        },
      ],
      // Position
      "top-btc": [{ top: SPACING_VALUES }],
      "right-btc": [{ right: SPACING_VALUES }],
      "bottom-btc": [{ bottom: SPACING_VALUES }],
      "left-btc": [{ left: SPACING_VALUES }],
      "inset-btc": [{ inset: SPACING_VALUES }],
    },
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any);

/**
 * Combina clases con clsx y resuelve conflictos de Tailwind
 * Prioriza las últimas clases (comportamiento tailwind-merge)
 *
 * @example
 * ```tsx
 * clsx('p-btc-4', 'p-btc-2') // → 'p-btc-2' (tailwind-merge resuelve)
 * clsx('bg-btc-brand', condition && 'bg-btc-error') // Condicional
 * ```
 */
export function clsx(...inputs: ClassValue[]): string {
  return customTwMerge(_clsx(inputs));
}

export type { ClassValue };

// @buildertech/ui - Font Helpers
// Wrappers de next/font con variable CSS para --btc-font-sans/mono/display

import { Inter, JetBrains_Mono, Space_Grotesk } from 'next/font/google';

type SansSubset = 'latin' | 'cyrillic' | 'cyrillic-ext' | 'greek' | 'greek-ext' | 'latin-ext' | 'vietnamese';
type MonoSubset = 'latin' | 'latin-ext';
type DisplaySubset = 'latin' | 'latin-ext' | 'vietnamese';

/** Configuración base compartida */
const baseConfig = {
  variable: '--btc-font-sans',
  subsets: ['latin'] as SansSubset[],
  display: 'swap' as const,
  preload: true,
};

/** Configuración base para mono */
const monoConfig = {
  variable: '--btc-font-mono',
  subsets: ['latin'] as MonoSubset[],
  display: 'swap' as const,
  preload: true,
};

/** Configuración base para display */
const displayConfig = {
  variable: '--btc-font-display',
  subsets: ['latin'] as DisplaySubset[],
  display: 'swap' as const,
  preload: true,
};

/** Inter - Fuente sans principal */
export const fontSans = Inter({
  ...baseConfig,
  weight: ['400', '500', '600', '700'],
  variable: '--btc-font-sans',
});

/** JetBrains Mono - Fuente monoespaciada */
export const fontMono = JetBrains_Mono({
  ...monoConfig,
  weight: ['400', '500', '600', '700'],
  variable: '--btc-font-mono',
});

/** Space Grotesk - Fuente para display/títulos */
export const fontDisplay = Space_Grotesk({
  ...displayConfig,
  weight: ['400', '500', '600', '700'],
  variable: '--btc-font-display',
});

/** Helpers para obtener las clases de variable CSS */
export function getFontSans(): { variable: string; className: string; style: React.CSSProperties } {
  return {
    variable: fontSans.variable,
    className: fontSans.className,
    style: fontSans.style,
  };
}

export function getFontMono(): { variable: string; className: string; style: React.CSSProperties } {
  return {
    variable: fontMono.variable,
    className: fontMono.className,
    style: fontMono.style,
  };
}

export function getFontDisplay(): { variable: string; className: string; style: React.CSSProperties } {
  return {
    variable: fontDisplay.variable,
    className: fontDisplay.className,
    style: fontDisplay.style,
  };
}

/** Tipos para consumers */
export interface FontHelpers {
  variable: string;
  className: string;
  style: React.CSSProperties;
}
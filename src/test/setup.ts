import '@testing-library/jest-dom';
import { vi, beforeAll } from 'vitest';
import React from 'react';

// Suppress specific React warnings at the earliest point
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;
const suppressWarning = (msg: unknown) =>
  typeof msg === 'string' &&
  (
    (msg.includes('Warning: An update to') && msg.includes('was not wrapped in act')) ||
    (msg.includes('The `value` prop supplied to <select> must be an array if `multiple` is true'))
  );

console.error = (...args) => {
  if (suppressWarning(args[0])) return;
  originalConsoleError.apply(console, args);
};

console.warn = (...args) => {
  if (suppressWarning(args[0])) return;
  originalConsoleWarn.apply(console, args);
};

beforeAll(() => {
  // Mock ResizeObserver (not available in jsdom)
  global.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));

  // Mock IntersectionObserver (not available in jsdom)
  global.IntersectionObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));

  // Mock matchMedia
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });

  // Mock scrollTo
  window.scrollTo = vi.fn();

  // Mock HTMLElement.scrollIntoView
  Element.prototype.scrollIntoView = vi.fn();

  // Mock navigator.clipboard (not available in jsdom)
  Object.defineProperty(navigator, 'clipboard', {
    writable: true,
    value: {
      writeText: vi.fn().mockResolvedValue(undefined),
      readText: vi.fn().mockResolvedValue(''),
    },
  });
});


// Helper to render with providers (uses createElement to avoid JSX in setup)
export function renderWithProviders(
  ui: React.ReactElement,
  options?: {
    theme?: 'light' | 'dark';
    wrapper?: React.ComponentType<{ children: React.ReactNode }>;
  }
) {
  const { theme = 'light', wrapper } = options || {};

  const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) =>
    React.createElement('div', { 'data-theme': theme }, children);

  return {
    // This will be replaced by @testing-library/react render
    // but we export it for convenience in tests
    Providers,
    wrapper: wrapper || Providers,
  };
}

// Custom matchers for design tokens
expect.extend({
  toHaveDesignToken(received: HTMLElement, token: string) {
    const styles = window.getComputedStyle(received);
    const value = styles.getPropertyValue(token).trim();
    const pass = value !== '' && value !== 'initial' && value !== 'inherit';

    return {
      pass,
      message: () =>
        pass
          ? `Expected element not to have design token ${token}`
          : `Expected element to have design token ${token} but got "${value}"`,
    };
  },
});

// Extend Vitest types
declare module 'vitest' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Must match Vitest's Assertion<T = any>
  interface Assertion<T = any> {
    toHaveDesignToken(token: string): T;
  }
  interface AsymmetricMatchersContaining {
    toHaveDesignToken(token: string): unknown;
  }
}

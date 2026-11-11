import type { Preview, Decorator } from "@storybook/react";
import React from "react";
import "../src/styles/globals.css";

const ThemeProvider: Decorator = (Story, context) => {
  const theme = (context.globals.theme as "light" | "dark") ?? "light";
  const layout = (context.parameters.layout as string) ?? "padded";
  const isCentered = layout === "centered";
  const isFullscreen = layout === "fullscreen";

  // La documentación del DS define el tema en <html data-theme>. Aplicarlo
  // ahí (y no solo en un wrapper) permite que los portales a <body>
  // (Dialog, Toast, DropdownMenu) hereden las variables correctas.
  React.useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <div
      data-theme={theme}
      data-testid="story-root"
      style={{
        boxSizing: "border-box",
        width: "100%",
        minHeight: "100vh",
        padding: isFullscreen ? 0 : "var(--btc-space-6)",
        color: "var(--btc-text-primary)",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: isCentered ? "center" : "flex-start",
          justifyContent: isCentered ? "center" : "flex-start",
          gap: "var(--btc-space-4)",
          width: "100%",
          maxWidth: isCentered ? 1024 : 1280,
          minHeight: isFullscreen
            ? "100vh"
            : "calc(100vh - var(--btc-space-12))",
          margin: "0 auto",
        }}
      >
        <Story {...context} />
      </div>
    </div>
  );
};

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: "light",
      values: [
        { name: "light", value: "var(--btc-bg-app)" },
        { name: "surface", value: "var(--btc-bg-surface)" },
        { name: "raised", value: "var(--btc-bg-raised)" },
      ],
    },
    layout: "centered",
    viewport: {
      viewports: {
        mobile: {
          name: "Mobile (360px)",
          styles: { width: "360px", height: "800px" },
          type: "mobile",
        },
        tablet: {
          name: "Tablet (768px)",
          styles: { width: "768px", height: "1024px" },
          type: "tablet",
        },
        laptop: {
          name: "Laptop (1024px)",
          styles: { width: "1024px", height: "768px" },
          type: "desktop",
        },
        desktop: {
          name: "Desktop (1440px)",
          styles: { width: "1440px", height: "900px" },
          type: "desktop",
        },
      },
    },
    a11y: {
      config: {
        rules: [{ id: "color-contrast", enabled: true }],
      },
    },
  },

  globalTypes: {
    theme: {
      name: "Theme",
      description: "Global theme for components",
      defaultValue: "light",
      toolbar: {
        icon: "circlehollow",
        items: [
          { value: "light", title: "Light" },
          { value: "dark", title: "Dark" },
        ],
        showName: true,
        dynamicTitle: true,
      },
    },
  },

  decorators: [ThemeProvider],
  tags: ["autodocs"],
};

export default preview;

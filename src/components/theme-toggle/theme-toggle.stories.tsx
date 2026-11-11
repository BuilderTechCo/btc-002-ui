import type { Meta, StoryObj } from "@storybook/react";
import { ThemeToggle, type Theme } from "./theme-toggle";
import { Separator } from "../separator";

const meta: Meta<typeof ThemeToggle> = {
  title: "Components/ThemeToggle",
  component: ThemeToggle,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["button", "dropdown"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    themes: {
      control: "object",
    },
    defaultValue: {
      control: "select",
      options: ["light", "dark", "system"],
    },
    showLabels: {
      control: "boolean",
    },
  },
};

export default meta;
type Story = StoryObj<typeof ThemeToggle>;

export const Default: Story = {
  args: {},
};

export const Small: Story = {
  args: {
    size: "sm",
  },
};

export const Large: Story = {
  args: {
    size: "lg",
  },
};

export const WithLabels: Story = {
  args: {
    showLabels: true,
  },
};

export const SmallWithLabels: Story = {
  args: {
    size: "sm",
    showLabels: true,
  },
};

export const LargeWithLabels: Story = {
  args: {
    size: "lg",
    showLabels: true,
  },
};

export const DefaultLight: Story = {
  args: {
    defaultValue: "light",
  },
};

export const DefaultDark: Story = {
  args: {
    defaultValue: "dark",
  },
};

export const DefaultSystem: Story = {
  args: {
    defaultValue: "system",
  },
};

export const OnlyLightDark: Story = {
  args: {
    themes: ["light", "dark"],
    defaultValue: "light",
  },
};

export const AllThreeThemes: Story = {
  args: {
    themes: ["light", "dark", "system"],
    defaultValue: "system",
  },
};

export const ControlledLight: Story = {
  args: {
    value: "light",
    onChange: (theme) => console.warn("Theme changed to:", theme),
  },
};

export const ControlledDark: Story = {
  args: {
    value: "dark",
    onChange: (theme) => console.warn("Theme changed to:", theme),
  },
};

export const DropdownVariant: Story = {
  args: {
    variant: "dropdown",
    showLabels: true,
  },
};

export const DropdownSmall: Story = {
  args: {
    variant: "dropdown",
    size: "sm",
    showLabels: true,
  },
};

export const DropdownLarge: Story = {
  args: {
    variant: "dropdown",
    size: "lg",
    showLabels: true,
  },
};

export const InNavigation: Story = {
  render: () => (
    <nav className="flex items-center justify-between w-96 p-btc-4 bg-btc-surface border border-btc-border-default rounded-btc-lg">
      <div className="flex items-center gap-btc-4">
        <span className="text-btc-heading-s font-semibold text-btc-text-primary">
          My App
        </span>
        <ThemeToggle size="sm" showLabels />
      </div>
      <div className="flex items-center gap-btc-4">
        <ThemeToggle variant="dropdown" showLabels />
      </div>
    </nav>
  ),
};

export const InToolbar: Story = {
  render: () => (
    <div className="w-96">
      <div className="flex items-center gap-btc-2 p-btc-3 bg-btc-surface border border-btc-border-default rounded-btc-lg">
        <button
          className="p-btc-2 rounded-btc-md hover:bg-btc-muted transition-colors"
          aria-label="Bold"
        >
          <svg
            className="w-5 h-5 text-btc-text-primary"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M15.6 10.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H7v14h7.04c2.09 0 3.71-1.7 3.71-3.79 0-1.52-.86-2.82-2.15-3.42zM10 6.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z" />
          </svg>
        </button>
        <button
          className="p-btc-2 rounded-btc-md hover:bg-btc-muted transition-colors"
          aria-label="Italic"
        >
          <svg
            className="w-5 h-5 text-btc-text-primary"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4z" />
          </svg>
        </button>
        <Separator orientation="vertical" className="h-6" />
        <ThemeToggle size="sm" variant="dropdown" showLabels />
      </div>
    </div>
  ),
};

export const WithCustomClassName: Story = {
  args: {
    className: "rounded-btc-full",
    showLabels: true,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue: "system",
  },
};

export const WithOnChange: Story = {
  args: {
    onChange: (theme: Theme) => console.warn("Theme changed to:", theme),
    showLabels: true,
  },
};

export const ButtonVariants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-btc-4">
      <div className="flex items-center gap-btc-2">
        <span className="text-btc-caption text-btc-text-muted">Button:</span>
        <ThemeToggle size="sm" />
        <ThemeToggle size="md" />
        <ThemeToggle size="lg" />
      </div>
      <div className="flex items-center gap-btc-2">
        <span className="text-btc-caption text-btc-text-muted">
          With labels:
        </span>
        <ThemeToggle size="sm" showLabels />
        <ThemeToggle size="md" showLabels />
        <ThemeToggle size="lg" showLabels />
      </div>
    </div>
  ),
};

export const DropdownVariants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-btc-4">
      <div className="flex items-center gap-btc-2">
        <span className="text-btc-caption text-btc-text-muted">Dropdown:</span>
        <ThemeToggle variant="dropdown" size="sm" showLabels />
        <ThemeToggle variant="dropdown" size="md" showLabels />
        <ThemeToggle variant="dropdown" size="lg" showLabels />
      </div>
    </div>
  ),
};

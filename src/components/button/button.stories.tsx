import type { Meta, StoryObj } from "@storybook/react";
import { Button, type ButtonVariant, type ButtonSize } from "./button";

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: [
        "primary",
        "outline",
        "ghost",
        "danger",
        "danger-outline",
        "info",
        "info-outline",
      ] as ButtonVariant[],
      description: "Visual variant of the button",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"] as ButtonSize[],
      description: "Size of the button",
    },
    loading: {
      control: "boolean",
      description: "Loading state",
    },
    disabled: {
      control: "boolean",
      description: "Disabled state",
    },
    fullWidth: {
      control: "boolean",
      description: "Full width button",
    },
    leftIcon: {
      control: "text",
      description: "Left icon name (from lucide-react)",
    },
    leftIconCategory: {
      control: "select",
      options: ["nav", "action", "status", "empty"],
      description: "Left icon category",
    },
    rightIcon: {
      control: "text",
      description: "Right icon name",
    },
    rightIconCategory: {
      control: "select",
      options: ["nav", "action", "status", "empty"],
      description: "Right icon category",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    children: "Primary Button",
    variant: "primary",
  },
};

export const Secondary: Story = {
  args: {
    children: "Outline Button",
    variant: "outline",
  },
};

export const Ghost: Story = {
  args: {
    children: "Ghost Button",
    variant: "ghost",
  },
};

export const Danger: Story = {
  args: {
    children: "Danger Button",
    variant: "danger",
  },
};

export const DangerOutline: Story = {
  args: {
    children: "Danger Outline",
    variant: "danger-outline",
  },
};

export const Info: Story = {
  args: {
    children: "Info Button",
    variant: "info",
  },
};

export const InfoOutline: Story = {
  args: {
    children: "Info Outline",
    variant: "info-outline",
  },
};

export const Small: Story = {
  args: {
    children: "Small Button",
    size: "sm",
  },
};

export const Large: Story = {
  args: {
    children: "Large Button",
    size: "lg",
  },
};

export const Loading: Story = {
  args: {
    children: "Loading...",
    loading: true,
  },
};

export const Disabled: Story = {
  args: {
    children: "Disabled Button",
    disabled: true,
  },
};

export const WithLeftIcon: Story = {
  args: {
    children: "With Icon",
    leftIcon: "plus",
    leftIconCategory: "action",
  },
};

export const WithRightIcon: Story = {
  args: {
    children: "Continue",
    rightIcon: "chevronRight",
    rightIconCategory: "nav",
  },
};

export const FullWidth: Story = {
  args: {
    children: "Full Width Button",
    fullWidth: true,
  },
  decorators: [
    (Story) => (
      <div style={{ width: "300px" }}>
        <Story />
      </div>
    ),
  ],
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-btc-4">
      {(
        [
          "primary",
          "outline",
          "ghost",
          "danger",
          "danger-outline",
          "info",
          "info-outline",
        ] as ButtonVariant[]
      ).map((variant) => (
        <Button key={variant} variant={variant}>
          {variant}
        </Button>
      ))}
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-btc-4">
      {(["sm", "md", "lg"] as ButtonSize[]).map((size) => (
        <Button key={size} size={size}>
          {size}
        </Button>
      ))}
    </div>
  ),
};

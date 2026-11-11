import type { Meta, StoryObj } from "@storybook/react";
import { Badge, type BadgeVariant, type BadgeSize } from "./badge";

const meta: Meta<typeof Badge> = {
  title: "Components/Badge",
  component: Badge,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: [
        "default",
        "success",
        "warning",
        "error",
        "info",
        "outline",
      ] as BadgeVariant[],
      description: "Visual variant of the badge",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"] as BadgeSize[],
      description: "Size of the badge",
    },
    removable: {
      control: "boolean",
      description: "Show remove button",
    },
    icon: {
      control: "text",
      description: "Icon name (from lucide-react)",
    },
    iconCategory: {
      control: "select",
      options: ["nav", "action", "status", "empty"],
      description: "Icon category",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {
  args: {
    children: "Default Badge",
  },
};

export const Success: Story = {
  args: {
    children: "Success",
    variant: "success",
  },
};

export const Warning: Story = {
  args: {
    children: "Warning",
    variant: "warning",
  },
};

export const Error: Story = {
  args: {
    children: "Error",
    variant: "error",
  },
};

export const Info: Story = {
  args: {
    children: "Info",
    variant: "info",
  },
};

export const Outline: Story = {
  args: {
    children: "Outline",
    variant: "outline",
  },
};

export const Small: Story = {
  args: {
    children: "Small",
    size: "sm",
  },
};

export const Large: Story = {
  args: {
    children: "Large",
    size: "lg",
  },
};

export const WithIcon: Story = {
  args: {
    children: "With Icon",
    icon: "check",
    iconCategory: "status",
  },
};

export const Removable: Story = {
  args: {
    children: "Removable",
    removable: true,
    onRemove: () => console.warn("Removed"),
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-btc-2">
      {(
        [
          "default",
          "success",
          "warning",
          "error",
          "info",
          "outline",
        ] as BadgeVariant[]
      ).map((variant) => (
        <Badge key={variant} variant={variant}>
          {variant}
        </Badge>
      ))}
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-btc-2">
      {(["sm", "md", "lg"] as BadgeSize[]).map((size) => (
        <Badge key={size} size={size}>
          {size}
        </Badge>
      ))}
    </div>
  ),
};

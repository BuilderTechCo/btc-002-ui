import type { Meta, StoryObj } from "@storybook/react";
import { CopyButton } from "./copy-button";

const meta: Meta<typeof CopyButton> = {
  title: "Components/CopyButton",
  component: CopyButton,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["ghost", "outline", "primary"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof CopyButton>;

export const Default: Story = {
  args: {
    text: "Text to copy to clipboard",
  },
};

export const WithCustomText: Story = {
  args: {
    text: "https://example.com/very/long/url/that/gets/copied",
    defaultText: "Copy URL",
    successText: "URL Copied!",
  },
};

export const Primary: Story = {
  args: {
    text: "Primary variant",
    variant: "primary",
  },
};

export const Outline: Story = {
  args: {
    text: "Outline variant",
    variant: "outline",
  },
};

export const Small: Story = {
  args: {
    text: "Small size",
    size: "sm",
  },
};

export const Large: Story = {
  args: {
    text: "Large size",
    size: "lg",
  },
};

export const WithCustomIcons: Story = {
  args: {
    text: "Custom icons",
    icon: "copy",
    successIcon: "check",
  },
};

export const Disabled: Story = {
  args: {
    text: "Disabled",
    disabled: true,
  },
};

export const WithCallback: Story = {
  args: {
    text: "With callback",
    onCopy: (success) => console.warn("Copy result:", success),
  },
};

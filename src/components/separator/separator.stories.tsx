import type { Meta, StoryObj } from "@storybook/react";
import { Separator } from "./separator";

const meta: Meta<typeof Separator> = {
  title: "Components/Separator",
  component: Separator,
  parameters: {
    // Los separadores horizontales usan w-full/flex-1 y necesitan un
    // contenedor con ancho definido para que las líneas sean visibles.
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    orientation: {
      control: "select",
      options: ["horizontal", "vertical"],
    },
    variant: {
      control: "select",
      options: ["default", "dashed", "dotted", "thick"],
    },
    decorative: {
      control: "boolean",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Separator>;

export const Default: Story = {
  args: {},
};

export const Dashed: Story = {
  args: {
    variant: "dashed",
  },
};

export const Dotted: Story = {
  args: {
    variant: "dotted",
  },
};

export const Thick: Story = {
  args: {
    variant: "thick",
  },
};

export const WithLabel: Story = {
  args: {
    label: "Section Title",
    decorative: false,
  },
};

export const WithLongLabel: Story = {
  args: {
    label: "A much longer section title that wraps",
    decorative: false,
  },
};

export const Vertical: Story = {
  args: {
    orientation: "vertical",
    className: "h-32",
  },
};

export const VerticalDashed: Story = {
  args: {
    orientation: "vertical",
    variant: "dashed",
    className: "h-32",
  },
};

export const VerticalThick: Story = {
  args: {
    orientation: "vertical",
    variant: "thick",
    className: "h-32",
  },
};

export const InCard: Story = {
  render: () => (
    <div className="w-80">
      <div className="p-btc-4 bg-btc-surface border border-btc-border-default rounded-btc-lg space-y-btc-4">
        <div>
          <h3 className="text-btc-heading-s font-semibold text-btc-text-primary">
            Card Title
          </h3>
          <p className="text-btc-body text-btc-text-secondary mt-btc-1">
            Some content in the card.
          </p>
        </div>
        <Separator />
        <div>
          <h3 className="text-btc-heading-s font-semibold text-btc-text-primary">
            Another Section
          </h3>
          <p className="text-btc-body text-btc-text-secondary mt-btc-1">
            More content below the separator.
          </p>
        </div>
        <Separator variant="dashed" />
        <div>
          <p className="text-btc-body text-btc-text-secondary">
            Dashed separator above.
          </p>
        </div>
      </div>
    </div>
  ),
};

export const InForm: Story = {
  render: () => (
    <form className="w-80 space-y-btc-4" onSubmit={(e) => e.preventDefault()}>
      <div>
        <label className="block text-btc-control font-medium mb-btc-1">
          Account Information
        </label>
        <input
          type="text"
          className="w-full px-btc-3 py-btc-2 border border-btc-border-default rounded-btc-md text-btc-control bg-btc-surface"
          placeholder="Username"
        />
      </div>
      <Separator label="Profile" decorative={false} />
      <div>
        <label className="block text-btc-control font-medium mb-btc-1">
          Display Name
        </label>
        <input
          type="text"
          className="w-full px-btc-3 py-btc-2 border border-btc-border-default rounded-btc-md text-btc-control bg-btc-surface"
          placeholder="John Doe"
        />
      </div>
      <Separator variant="dashed" />
      <div>
        <label className="block text-btc-control font-medium mb-btc-1">
          Bio
        </label>
        <textarea
          className="w-full px-btc-3 py-btc-2 border border-btc-border-default rounded-btc-md text-btc-control bg-btc-surface min-h-[80px]"
          placeholder="Tell us about yourself"
        />
      </div>
    </form>
  ),
};

export const Decorative: Story = {
  args: {
    decorative: true,
  },
};

export const NonDecorative: Story = {
  args: {
    decorative: false,
    label: "Content divider",
  },
};

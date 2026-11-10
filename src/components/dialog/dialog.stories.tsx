import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  Dialog,
  DialogFooter,
  type DialogSize,
  type DialogAlign,
} from "./dialog";
import { Button } from "../button";
import { TextField } from "../textfield";

const meta: Meta<typeof Dialog> = {
  title: "Components/Dialog",
  component: Dialog,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    open: {
      control: "boolean",
      description: "Whether the dialog is open",
      table: { category: "State" },
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg", "xl", "full"] as DialogSize[],
      description: "Dialog size",
      table: { category: "Appearance" },
    },
    align: {
      control: "select",
      options: ["center", "top", "bottom"] as DialogAlign[],
      description: "Vertical alignment",
      table: { category: "Appearance" },
    },
    closeOnOverlayClick: {
      control: "boolean",
      description: "Close on overlay click",
      table: { category: "Behavior" },
    },
    closeOnEscape: {
      control: "boolean",
      description: "Close on Escape key",
      table: { category: "Behavior" },
    },
    portal: {
      control: "boolean",
      description: "Render in portal",
      table: { category: "Behavior" },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Dialog>;

function DialogDemo({
  open: controlledOpen,
  onClose: controlledOnClose,
  children,
  ...args
}: typeof Default.args & { children: React.ReactNode }) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;

  const open = isControlled ? controlledOpen : uncontrolledOpen;
  const handleClose = isControlled
    ? (controlledOnClose ?? (() => { /* noop */ }))
    : () => setUncontrolledOpen(false);

  return (
    <>
      <Button
        variant="primary"
        onClick={() => isControlled ? (controlledOnClose ?? (() => { /* noop */ }))() : setUncontrolledOpen(true)}
      >
        {open ? "Dialog abierto (click para cerrar)" : "Abrir Dialog"}
      </Button>
      <Dialog open={open} onClose={handleClose} {...args}>
        {children}
      </Dialog>
    </>
  );
}

export const Default: Story = {
  render: (args) => <DialogDemo {...args} />,
  args: {
    title: "Dialog Title",
    description: "This is a dialog description with more details.",
    children: <p>Dialog content goes here. You can put any content inside.</p>,
    onClose: () => console.warn("Dialog closed"),
  },
};

export const Small: Story = {
  render: (args) => <DialogDemo {...args} />,
  args: {
    size: "sm",
    title: "Small Dialog",
    children: <p>This is a small dialog.</p>,
    onClose: () => console.warn("Dialog closed"),
  },
};

export const Large: Story = {
  render: (args) => <DialogDemo {...args} />,
  args: {
    size: "lg",
    title: "Large Dialog",
    children: <p>This is a large dialog with more space for content.</p>,
    onClose: () => console.warn("Dialog closed"),
  },
};

export const FullWidth: Story = {
  render: (args) => <DialogDemo {...args} />,
  args: {
    size: "full",
    title: "Full Width Dialog",
    children: <p>This dialog takes the full width (max-w-4xl).</p>,
    onClose: () => console.warn("Dialog closed"),
  },
};

export const TopAligned: Story = {
  render: (args) => <DialogDemo {...args} />,
  args: {
    align: "top",
    title: "Top Aligned Dialog",
    children: <p>This dialog is aligned to the top.</p>,
    onClose: () => console.warn("Dialog closed"),
  },
};

export const BottomAligned: Story = {
  render: (args) => <DialogDemo {...args} />,
  args: {
    align: "bottom",
    title: "Bottom Aligned Dialog",
    children: <p>This dialog is aligned to the bottom.</p>,
    onClose: () => console.warn("Dialog closed"),
  },
};

export const WithFooter: Story = {
  render: (args) => <DialogDemo {...args} />,
  args: {
    title: "Dialog with Actions",
    description: "Confirm or cancel the action.",
    children: (
      <>
        <p>Are you sure you want to proceed?</p>
        <DialogFooter>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => console.warn("Cancelled")}
          >
            Cancel
          </Button>
          <Button size="sm" onClick={() => console.warn("Confirmed")}>
            Confirm
          </Button>
        </DialogFooter>
      </>
    ),
    onClose: () => console.warn("Dialog closed"),
  },
};

export const WithCustomContent: Story = {
  render: (args) => <DialogDemo {...args} />,
  args: {
    title: "Custom Content",
    children: (
      <div className="space-y-btc-4">
        <TextField label="Email" type="email" placeholder="you@example.com" />
        <TextField label="Message" placeholder="Your message..." />
      </div>
    ),
    onClose: () => console.warn("Dialog closed"),
  },
};

export const WithoutHeader: Story = {
  render: (args) => <DialogDemo {...args} />,
  args: {
    children: <p>Dialog without title - just content.</p>,
    onClose: () => console.warn("Dialog closed"),
  },
};

function AllSizesDemo() {
  const [openSize, setOpenSize] = useState<DialogSize | null>(null);

  return (
    <div className="flex flex-wrap items-center gap-btc-2">
      {(["sm", "md", "lg", "xl", "full"] as DialogSize[]).map((size) => (
        <Button
          key={size}
          variant="outline"
          size="sm"
          onClick={() => setOpenSize(size)}
        >
          {size}
        </Button>
      ))}
      {openSize && (
        <Dialog
          open
          title={`${openSize} dialog`}
          size={openSize}
          onClose={() => setOpenSize(null)}
        >
          <p>Size: {openSize}</p>
        </Dialog>
      )}
    </div>
  );
}

export const AllSizes: Story = {
  render: () => <AllSizesDemo />,
};

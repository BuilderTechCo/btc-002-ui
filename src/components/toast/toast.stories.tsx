import type { Meta, StoryObj } from "@storybook/react";
import {
  Toast,
  ToastProvider,
  ToastViewport,
  useToast,
  type ToastVariant,
} from "./toast";
import { Button } from "../button";

const meta: Meta<typeof Toast> = {
  title: "Components/Toast",
  component: Toast,
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
      ] as ToastVariant[],
    },
    duration: {
      control: "number",
      description: "Auto-close duration in ms (0 = no auto-close)",
    },
    dismissible: {
      control: "boolean",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Toast>;

export const Default: Story = {
  args: {
    id: "toast-1",
    title: "Notification",
    message: "This is a default toast notification.",
    variant: "default",
  },
};

export const Success: Story = {
  args: {
    id: "toast-2",
    title: "Success!",
    message: "Your changes have been saved successfully.",
    variant: "success",
  },
};

export const Warning: Story = {
  args: {
    id: "toast-3",
    title: "Warning",
    message: "Please review your input before proceeding.",
    variant: "warning",
  },
};

export const Error: Story = {
  args: {
    id: "toast-4",
    title: "Error",
    message: "Something went wrong. Please try again.",
    variant: "error",
  },
};

export const Info: Story = {
  args: {
    id: "toast-5",
    title: "Information",
    message: "New features are available. Check them out!",
    variant: "info",
  },
};

export const WithAction: Story = {
  args: {
    id: "toast-6",
    title: "Update Available",
    message: "A new version of the app is ready to install.",
    variant: "info",
    action: {
      label: "Update Now",
      onClick: () => console.warn("Update clicked"),
    },
  },
};

export const NoAutoClose: Story = {
  args: {
    id: "toast-7",
    title: "Persistent Toast",
    message: "This toast will not close automatically.",
    variant: "default",
    duration: 0,
  },
};

export const NonDismissible: Story = {
  args: {
    id: "toast-8",
    title: "Important",
    message: "You must acknowledge this message.",
    variant: "warning",
    dismissible: false,
  },
};

const variantStyles: Record<
  ToastVariant,
  { bg: string; border: string; icon: string; color: string }
> = {
  default: {
    bg: "bg-btc-surface",
    border: "border-btc-border-default",
    icon: "info",
    color: "text-btc-info",
  },
  success: {
    bg: "bg-btc-success-bg",
    border: "border-btc-success/20",
    icon: "checkCircle",
    color: "text-btc-success",
  },
  warning: {
    bg: "bg-btc-warning-bg",
    border: "border-btc-warning/20",
    icon: "alertTriangle",
    color: "text-btc-warning",
  },
  error: {
    bg: "bg-btc-error-bg",
    border: "border-btc-error/20",
    icon: "alertCircle",
    color: "text-btc-error",
  },
  info: {
    bg: "bg-btc-info-bg",
    border: "border-btc-info/20",
    icon: "info",
    color: "text-btc-info",
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-btc-3 w-80">
      {(
        ["default", "success", "warning", "error", "info"] as ToastVariant[]
      ).map((variant) => (
        <Toast
          key={variant}
          id={`toast-${variant}`}
          title={variant.charAt(0).toUpperCase() + variant.slice(1)}
          message={`This is a ${variant} toast message.`}
          variant={variant}
          duration={0}
          variantStyle={variantStyles[variant]}
        />
      ))}
    </div>
  ),
};

function ToastDemoControls() {
  const { addToast, clearToasts } = useToast();

  return (
    <div className="flex flex-col gap-btc-2">
      <Button
        onClick={() =>
          addToast({
            title: "New Toast",
            message: `Toast added at ${new Date().toLocaleTimeString()}`,
            variant: "success",
          })
        }
      >
        Add Success Toast
      </Button>
      <Button
        variant="ghost"
        onClick={() =>
          addToast({
            title: "Error Toast",
            message: "Something went wrong!",
            variant: "error",
          })
        }
      >
        Add Error Toast
      </Button>
      <Button variant="ghost" onClick={clearToasts}>
        Clear All
      </Button>
    </div>
  );
}

export const ToastSystemDemo: Story = {
  render: () => (
    <ToastProvider position="top-right" maxToasts={5}>
      <ToastDemoControls />
      <ToastViewport />
    </ToastProvider>
  ),
};

import type { Meta, StoryObj } from "@storybook/react";
import { ErrorState } from "./error-state";

const meta: Meta<typeof ErrorState> = {
  title: "Components/ErrorState",
  component: ErrorState,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "inline", "toast"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof ErrorState>;

export const Default: Story = {
  args: {
    title: "Something went wrong",
    message:
      "We encountered an error while processing your request. Please try again.",
  },
};

export const WithRetry: Story = {
  args: {
    title: "Connection failed",
    message:
      "Unable to connect to the server. Check your connection and try again.",
    onRetry: () => console.warn("Retry clicked"),
    retryLabel: "Retry",
  },
};

export const Inline: Story = {
  args: {
    variant: "inline",
    title: "Form error",
    message: "Please fix the errors below before submitting.",
  },
};

export const Toast: Story = {
  args: {
    variant: "toast",
    title: "Service unavailable",
    message:
      "We're experiencing technical difficulties. Our team has been notified.",
  },
};

export const WithDismiss: Story = {
  args: {
    title: "Dismissible error",
    message: "This error can be dismissed by the user.",
    onDismiss: () => console.warn("Dismissed"),
  },
};

export const WithCustomAction: Story = {
  args: {
    title: "Payment failed",
    message:
      "Your payment could not be processed. Please update your payment method.",
    onRetry: () => console.warn("Update payment"),
    retryLabel: "Update Payment",
  },
};

export const Generic: Story = {
  args: {
    title: "Oops!",
    message: "An unexpected error occurred. Our team has been notified.",
  },
};

export const NotFound: Story = {
  args: {
    title: "Not found",
    message: "The requested resource could not be found.",
    onRetry: () => console.warn("Go home"),
    retryLabel: "Go Home",
  },
};

export const Unauthorized: Story = {
  args: {
    title: "Unauthorized",
    message: "You don't have permission to access this resource.",
    onRetry: () => console.warn("Log in"),
    retryLabel: "Log In",
  },
};

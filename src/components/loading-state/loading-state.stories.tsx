import type { Meta, StoryObj } from "@storybook/react";
import { LoadingState, type LoadingStateVariant } from "./loading-state";

const meta: Meta<typeof LoadingState> = {
  title: "Components/LoadingState",
  component: LoadingState,
  parameters: {
    // Los skeletons usan width 100%; con `centered` el contenedor se
    // encoge y quedarían con ancho 0.
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: [
        "spinner",
        "skeleton",
        "inline",
        "full",
      ] as LoadingStateVariant[],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof LoadingState>;

export const SpinnerDefault: Story = {
  args: {
    variant: "spinner",
    text: "Loading...",
  },
};

export const SpinnerSmall: Story = {
  args: {
    variant: "spinner",
    size: "sm",
    text: "Loading...",
  },
};

export const SpinnerLarge: Story = {
  args: {
    variant: "spinner",
    size: "lg",
    text: "Loading...",
  },
};

export const SpinnerWithoutText: Story = {
  args: {
    variant: "spinner",
  },
};

export const Inline: Story = {
  args: {
    variant: "inline",
    text: "Saving changes...",
  },
};

export const InlineSmall: Story = {
  args: {
    variant: "inline",
    size: "sm",
    text: "Loading",
  },
};

export const SkeletonDefault: Story = {
  args: {
    variant: "skeleton",
    skeletonLines: 3,
  },
};

export const SkeletonWithWidths: Story = {
  args: {
    variant: "skeleton",
    skeletonLines: 4,
    skeletonWidth: ["100%", "80%", "60%", "40%"],
  },
};

export const SkeletonSingleLine: Story = {
  args: {
    variant: "skeleton",
    skeletonLines: 1,
    skeletonWidth: "100%",
  },
};

export const FullScreen: Story = {
  args: {
    variant: "full",
    text: "Loading application...",
    size: "md",
  },
  parameters: {
    layout: "fullscreen",
  },
};

export const FullScreenLarge: Story = {
  args: {
    variant: "full",
    text: "Initializing...",
    size: "lg",
  },
  parameters: {
    layout: "fullscreen",
  },
};

export const FullScreenSmall: Story = {
  args: {
    variant: "full",
    size: "sm",
  },
  parameters: {
    layout: "fullscreen",
  },
};

export const CardSkeletonExample: Story = {
  render: () => (
    <div className="w-80 space-y-btc-4">
      <LoadingState variant="skeleton" skeletonLines={1} skeletonWidth="40%" />
      <LoadingState
        variant="skeleton"
        skeletonLines={3}
        skeletonWidth={["100%", "80%", "60%"]}
      />
      <div className="flex gap-btc-2">
        <LoadingState
          variant="skeleton"
          skeletonLines={1}
          skeletonWidth="100%"
          className="w-12"
        />
        <LoadingState
          variant="skeleton"
          skeletonLines={2}
          skeletonWidth={["100%", "70%"]}
          className="flex-1"
        />
      </div>
    </div>
  ),
};

export const TableSkeletonExample: Story = {
  render: () => (
    <div className="w-96">
      <div className="space-y-btc-2">
        {[...Array(5)].map((_, i) => (
          <LoadingState
            key={i}
            variant="skeleton"
            skeletonLines={1}
            skeletonWidth="100%"
            className="h-btc-control"
          />
        ))}
      </div>
    </div>
  ),
};

export const ButtonLoadingExample: Story = {
  render: () => (
    <div className="flex gap-btc-4 items-center">
      <LoadingState variant="inline" size="sm" text="Saving..." />
      <LoadingState variant="inline" size="md" text="Processing..." />
      <LoadingState variant="inline" size="lg" text="Uploading..." />
    </div>
  ),
};

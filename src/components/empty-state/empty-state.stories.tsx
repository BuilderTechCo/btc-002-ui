import type { Meta, StoryObj } from "@storybook/react";
import { EmptyState, type EmptyStateIllustration } from "./empty-state";

const meta: Meta<typeof EmptyState> = {
  title: "Components/EmptyState",
  component: EmptyState,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    illustration: {
      control: "select",
      options: [
        "inbox",
        "folder",
        "users",
        "package",
        "target",
        "building",
        "building2",
        "default",
      ] as EmptyStateIllustration[],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof EmptyState>;

export const Default: Story = {
  args: {
    title: "No data available",
    description: "There are no items to display at the moment.",
  },
};

export const Inbox: Story = {
  args: {
    title: "Inbox is empty",
    description: "You have no new messages. Relax and enjoy!",
    illustration: "inbox",
  },
};

export const NoUsers: Story = {
  args: {
    title: "No users found",
    description: "Start by inviting team members to collaborate.",
    illustration: "users",
    action: {
      label: "Invite Users",
      onClick: () => console.warn("Invite clicked"),
    },
  },
};

export const NoProjects: Story = {
  args: {
    title: "No projects yet",
    description: "Create your first project to get started.",
    illustration: "folder",
    action: {
      label: "Create Project",
      onClick: () => console.warn("Create project"),
    },
  },
};

export const NoResults: Story = {
  args: {
    title: "No results found",
    description: "Try adjusting your search or filter criteria.",
    illustration: "target",
  },
};

export const NoPackages: Story = {
  args: {
    title: "No packages",
    description: "You haven't added any packages yet.",
    illustration: "package",
    action: {
      label: "Add Package",
      onClick: () => console.warn("Add package"),
    },
  },
};

export const WithSecondaryAction: Story = {
  args: {
    title: "Empty state",
    description: "Description with two actions.",
    illustration: "building",
    action: {
      label: "Primary Action",
      onClick: () => console.warn("Primary"),
    },
    secondaryAction: {
      label: "Secondary Action",
      onClick: () => console.warn("Secondary"),
    },
  },
};

export const Small: Story = {
  args: {
    title: "Small empty state",
    description: "Compact version for tight spaces.",
    size: "sm",
  },
};

export const Large: Story = {
  args: {
    title: "Large empty state",
    description: "Prominent version for important empty states.",
    size: "lg",
  },
};

export const CustomIllustration: Story = {
  args: {
    title: "Custom",
    description: "Using a custom illustration (building2).",
    illustration: "building2",
  },
};

import type { Meta, StoryObj } from "@storybook/react";
import { NavLink } from "./nav-link";

const meta: Meta<typeof NavLink> = {
  title: "Components/NavLink",
  component: NavLink,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    active: {
      control: "boolean",
    },
    disabled: {
      control: "boolean",
    },
    align: {
      control: "select",
      options: ["left", "center"],
    },
    padding: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    badgeVariant: {
      control: "select",
      options: ["default", "success", "warning", "error", "info"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof NavLink>;

export const Default: Story = {
  args: {
    children: "Dashboard",
    href: "/dashboard",
  },
};

export const Active: Story = {
  args: {
    children: "Dashboard (Active)",
    href: "/dashboard",
    active: true,
  },
};

export const WithBadge: Story = {
  args: {
    children: "Notifications",
    href: "/notifications",
    badge: 5,
  },
};

export const WithErrorBadge: Story = {
  args: {
    children: "Errors",
    href: "/errors",
    badge: 12,
    badgeVariant: "error",
  },
};

export const WithWarningBadge: Story = {
  args: {
    children: "Warnings",
    href: "/warnings",
    badge: 3,
    badgeVariant: "warning",
  },
};

export const WithLeftIcon: Story = {
  args: {
    children: "Settings",
    href: "/settings",
    leftIcon: "settings",
    leftIconCategory: "nav",
  },
};

export const WithIconAndBadge: Story = {
  args: {
    children: "Messages",
    href: "/messages",
    leftIcon: "messageSquare",
    leftIconCategory: "nav",
    badge: 3,
    badgeVariant: "success",
  },
};

export const Disabled: Story = {
  args: {
    children: "Disabled Link",
    href: "/disabled",
    disabled: true,
  },
};

export const Centered: Story = {
  args: {
    children: "Centered",
    href: "/centered",
    align: "center",
  },
};

export const SmallPadding: Story = {
  args: {
    children: "Small Padding",
    href: "/small",
    padding: "sm",
  },
};

export const LargePadding: Story = {
  args: {
    children: "Large Padding",
    href: "/large",
    padding: "lg",
  },
};

export const NavigationExample: Story = {
  render: () => (
    <nav
      className="flex w-64 flex-col gap-btc-1"
      role="navigation"
      aria-label="Main navigation"
    >
      <NavLink
        href="/dashboard"
        leftIcon="layoutDashboard"
        leftIconCategory="nav"
      >
        Dashboard
      </NavLink>
      <NavLink
        href="/projects"
        leftIcon="folderOpen"
        leftIconCategory="nav"
        badge={3}
        badgeVariant="success"
      >
        Projects
      </NavLink>
      <NavLink href="/team" leftIcon="users" leftIconCategory="nav" active>
        Team
      </NavLink>
      <NavLink href="/settings" leftIcon="settings" leftIconCategory="nav">
        Settings
      </NavLink>
      <NavLink
        href="/billing"
        leftIcon="creditCard"
        leftIconCategory="nav"
        badgeVariant="warning"
        badge={1}
      >
        Billing
      </NavLink>
    </nav>
  ),
};

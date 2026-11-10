import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "./dropdown-menu";

const meta: Meta<typeof DropdownMenu> = {
  title: "Components/DropdownMenu",
  component: DropdownMenu,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    modal: {
      control: "boolean",
      description: "Modal mode (close on outside click)",
    },
  },
};

export default meta;
type Story = StoryObj<typeof DropdownMenu>;

export const Default: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger aria-label="Open menu">
        Open Menu
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem>Settings</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger aria-label="User menu">
        User Menu
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem icon="user" iconCategory="nav">
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem icon="settings" iconCategory="nav">
          Settings
        </DropdownMenuItem>
        <DropdownMenuItem icon="bell" iconCategory="action">
          Notifications
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem icon="logOut" iconCategory="nav">
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

export const WithCheckboxes: Story = {
  render: () => {
    const [filters, setFilters] = useState({
      active: true,
      pending: true,
      archived: false,
    });
    const [sort, setSort] = useState("name");

    return (
      <DropdownMenu>
        <DropdownMenuTrigger aria-label="Filter options">
          Filter Options
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Filters</DropdownMenuLabel>
          <DropdownMenuCheckboxItem
            value="active"
            checked={filters.active}
            onCheckedChange={(checked) =>
              setFilters((current) => ({ ...current, active: checked }))
            }
          >
            Active
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            value="pending"
            checked={filters.pending}
            onCheckedChange={(checked) =>
              setFilters((current) => ({ ...current, pending: checked }))
            }
          >
            Pending
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            value="archived"
            checked={filters.archived}
            onCheckedChange={(checked) =>
              setFilters((current) => ({ ...current, archived: checked }))
            }
          >
            Archived
          </DropdownMenuCheckboxItem>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Sort</DropdownMenuLabel>
          <DropdownMenuRadioItem
            value="name"
            checked={sort === "name"}
            onCheckedChange={setSort}
          >
            By Name
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem
            value="date"
            checked={sort === "date"}
            onCheckedChange={setSort}
          >
            By Date
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem
            value="status"
            checked={sort === "status"}
            onCheckedChange={setSort}
          >
            By Status
          </DropdownMenuRadioItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  },
};

export const WithShortcuts: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger aria-label="Actions">Actions</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem shortcut="⌘N">New File</DropdownMenuItem>
        <DropdownMenuItem shortcut="⌘O">Open File</DropdownMenuItem>
        <DropdownMenuItem shortcut="⌘S">Save</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem shortcut="⌘Z">Undo</DropdownMenuItem>
        <DropdownMenuItem shortcut="⌘⇧Z">Redo</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

export const AlignEnd: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger aria-label="Align end">
        Align End
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>Option 1</DropdownMenuItem>
        <DropdownMenuItem>Option 2</DropdownMenuItem>
        <DropdownMenuItem>Option 3</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

export const SideTop: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger aria-label="Top menu">
        Opens Upward
      </DropdownMenuTrigger>
      <DropdownMenuContent side="top">
        <DropdownMenuItem>Option 1</DropdownMenuItem>
        <DropdownMenuItem>Option 2</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

export const WithDisabled: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger aria-label="With disabled">
        With Disabled
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>Enabled Item</DropdownMenuItem>
        <DropdownMenuItem disabled>Disabled Item</DropdownMenuItem>
        <DropdownMenuItem>Another Enabled</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

export const InsetItems: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger aria-label="Inset items">
        Inset Items
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Sections</DropdownMenuLabel>
        <DropdownMenuItem inset>Dashboard</DropdownMenuItem>
        <DropdownMenuItem inset>Reports</DropdownMenuItem>
        <DropdownMenuItem inset>Analytics</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Settings</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

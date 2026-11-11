import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import {
  Table,
  type TableColumn,
  type TableVariant,
  type TableSize,
} from "./table";
import { Badge } from "../badge";
import { Button } from "../button";

interface UserRow {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

const meta: Meta<typeof Table> = {
  title: "Components/Table",
  component: Table,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "striped", "bordered"] as TableVariant[],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"] as TableSize[],
    },
    sortable: {
      control: "boolean",
    },
    selectable: {
      control: "boolean",
    },
    stickyHeader: {
      control: "boolean",
    },
    responsive: {
      control: "boolean",
    },
    loading: {
      control: "boolean",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Table>;

const columns: TableColumn<UserRow>[] = [
  { key: "name", header: "Name", accessor: "name" },
  { key: "email", header: "Email", accessor: "email" },
  { key: "role", header: "Role", accessor: "role" },
  { key: "status", header: "Status", accessor: "status" },
];

const data: UserRow[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    role: "Admin",
    status: "Active",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "Editor",
    status: "Active",
  },
  {
    id: "3",
    name: "Bob Wilson",
    email: "bob@example.com",
    role: "Viewer",
    status: "Inactive",
  },
  {
    id: "4",
    name: "Alice Brown",
    email: "alice@example.com",
    role: "Admin",
    status: "Active",
  },
  {
    id: "5",
    name: "Charlie Davis",
    email: "charlie@example.com",
    role: "Editor",
    status: "Pending",
  },
];

export const Default: Story = {
  args: {
    columns: columns as TableColumn<unknown>[],
    data,
  },
};

export const Striped: Story = {
  args: {
    columns: columns as TableColumn<unknown>[],
    data,
    variant: "striped",
  },
};

export const Bordered: Story = {
  args: {
    columns: columns as TableColumn<unknown>[],
    data,
    variant: "bordered",
  },
};

export const Sortable: Story = {
  render: () => {
    const [sort, setSort] = useState<{
      column: string;
      direction: "asc" | "desc";
    }>({ column: "name", direction: "asc" });

    const sortedData = [...data].sort((a, b) => {
      const left = String(a[sort.column as keyof UserRow]);
      const right = String(b[sort.column as keyof UserRow]);
      return left.localeCompare(right) * (sort.direction === "asc" ? 1 : -1);
    });

    return (
      <Table
        columns={columns.map((column) => ({ ...column, sortable: true }))}
        data={sortedData}
        sortable
        sortColumn={sort.column}
        sortDirection={sort.direction}
        onSort={(column, direction) => setSort({ column, direction })}
      />
    );
  },
};

export const Selectable: Story = {
  render: () => {
    const [selectedRows, setSelectedRows] = useState<string[]>(["1", "3"]);

    return (
      <Table
        columns={columns}
        data={data}
        selectable
        selectedRows={selectedRows}
        onSelectionChange={setSelectedRows}
      />
    );
  },
};

export const WithActions: Story = {
  args: {
    columns: columns as TableColumn<unknown>[],
    data,
    renderActions: (_row) => (
      <div className="flex gap-btc-1">
        <Button variant="ghost" size="sm">
          Edit
        </Button>
        <Button variant="danger-outline" size="sm">
          Delete
        </Button>
      </div>
    ),
  },
};

export const StickyHeader: Story = {
  args: {
    columns: columns as TableColumn<unknown>[],
    data: Array.from({ length: 20 }, (_, i) => ({
      id: String(i + 1),
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
      role: i % 3 === 0 ? "Admin" : i % 3 === 1 ? "Editor" : "Viewer",
      status: i % 2 === 0 ? "Active" : "Inactive",
    })),
    stickyHeader: true,
    className: "max-h-[300px]",
  },
};

export const Small: Story = {
  args: {
    columns: columns as TableColumn<unknown>[],
    data,
    size: "sm",
  },
};

export const Large: Story = {
  args: {
    columns: columns as TableColumn<unknown>[],
    data,
    size: "lg",
  },
};

export const Loading: Story = {
  args: {
    columns: columns as TableColumn<unknown>[],
    data: [],
    loading: true,
    loadingRows: 5,
  },
};

export const EmptyState: Story = {
  args: {
    columns: columns as TableColumn<unknown>[],
    data: [],
    emptyState: (
      <div className="py-btc-8 text-center">
        <p className="text-btc-text-muted">No users found</p>
        <Button className="mt-btc-2">Add User</Button>
      </div>
    ),
  },
};

export const WithCustomRender: Story = {
  args: {
    columns: [
      {
        key: "name",
        header: "User",
        accessor: (row: unknown) => (row as UserRow).name,
      },
      {
        key: "email",
        header: "Email",
        accessor: (row: unknown) => (row as UserRow).email,
      },
      {
        key: "status",
        header: "Status",
        accessor: (row: unknown) => (row as UserRow).status,
        render: (value: unknown) => (
          <Badge
            variant={
              value === "Active"
                ? "success"
                : value === "Pending"
                  ? "warning"
                  : "error"
            }
            size="sm"
          >
            {String(value)}
          </Badge>
        ),
      },
      {
        key: "role",
        header: "Role",
        accessor: (row: unknown) => (row as UserRow).role,
      },
    ],
    data,
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex max-w-3xl flex-col gap-btc-8">
      {(["default", "striped", "bordered"] as TableVariant[]).map((variant) => (
        <div key={variant}>
          <h4 className="mb-btc-2 capitalize">{variant}</h4>
          <Table
            columns={columns as TableColumn<unknown>[]}
            data={data}
            variant={variant}
          />
        </div>
      ))}
    </div>
  ),
};

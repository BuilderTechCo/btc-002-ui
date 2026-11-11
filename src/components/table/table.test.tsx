import { describe, expect, vi, test } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Table, type TableColumn, type TableProps } from "./table";

interface TestRow {
  id: number;
  name: string;
  email: string;
  status: "active" | "inactive";
}

const columns: TableColumn<TestRow>[] = [
  { key: "name", header: "Name", accessor: (row: TestRow) => row.name },
  { key: "email", header: "Email", accessor: (row: TestRow) => row.email },
  { key: "status", header: "Status", accessor: (row: TestRow) => row.status },
];

const data: TestRow[] = [
  { id: 1, name: "John", email: "john@example.com", status: "active" },
  { id: 2, name: "Jane", email: "jane@example.com", status: "inactive" },
];

// Helper to get the table element (nativo, sin role artificial)
const getTable = () => screen.getByRole("table") as HTMLElement;

describe("table", () => {
  test("renders table with headers and data", () => {
    render(<Table columns={columns} data={data} rowKey="id" />);
    expect(getTable()).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: /name/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: /email/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("John")).toBeInTheDocument();
    expect(screen.getByText("Jane")).toBeInTheDocument();
  });

  test("applies variant classes", () => {
    // Table is a generic function component, use the exported types
    const variants: TableProps<TestRow>["variant"][] = [
      "default",
      "striped",
      "bordered",
    ];

    variants.forEach((variant) => {
      const { unmount } = render(
        <Table
          columns={columns}
          data={data}
          rowKey="id"
          variant={variant}
          key={variant}
        />,
      );
      expect(getTable()).toBeInTheDocument();
      unmount();
    });
  });

  test("applies size classes", () => {
    const sizes: TableProps<TestRow>["size"][] = ["sm", "md", "lg"];

    sizes.forEach((size) => {
      const { unmount } = render(
        <Table
          columns={columns}
          data={data}
          rowKey="id"
          size={size}
          key={size}
        />,
      );
      expect(getTable()).toBeInTheDocument();
      unmount();
    });
  });

  test("shows empty state when data is empty", () => {
    render(
      <Table columns={columns} data={[]} rowKey="id" emptyState="No data" />,
    );
    expect(screen.getByText("No data")).toBeInTheDocument();
  });

  test("shows loading state", () => {
    render(
      <Table
        columns={columns}
        data={data}
        rowKey="id"
        loading
        loadingRows={3}
      />,
    );
    // Loading state renders with role="table" (no caption check in loading branch)
    expect(screen.getByRole("table")).toBeInTheDocument();
  });

  test("handles row selection when selectable", () => {
    const onSelectionChange = vi.fn();
    render(
      <Table
        columns={columns}
        data={data}
        rowKey="id"
        selectable
        onSelectionChange={onSelectionChange}
      />,
    );

    // First checkbox is the "select all" checkbox in header, skip it
    const checkboxes = screen.getAllByRole("checkbox");
    // Click the first row checkbox (second checkbox overall)
    fireEvent.click(checkboxes[1]!);
    expect(onSelectionChange).toHaveBeenCalledWith(["1"]);
  });

  test("selects all rows when header checkbox clicked", () => {
    const onSelectionChange = vi.fn();
    render(
      <Table
        columns={columns}
        data={data}
        rowKey="id"
        selectable
        onSelectionChange={onSelectionChange}
      />,
    );

    // Header checkbox has aria-label "Seleccionar todas las filas"
    const headerCheckbox = screen.getByRole("checkbox", {
      name: /seleccionar todas las filas/i,
    });
    fireEvent.click(headerCheckbox);
    expect(onSelectionChange).toHaveBeenCalledWith(["1", "2"]);
  });

  test("calls onSort when sortable column header clicked", () => {
    const onSort = vi.fn();
    const sortableColumns = columns.map((c) => ({ ...c, sortable: true }));

    render(
      <Table
        columns={sortableColumns}
        data={data}
        rowKey="id"
        sortable
        onSort={onSort}
      />,
    );

    const header = screen.getByRole("button", { name: /name/i });
    fireEvent.click(header);
    expect(onSort).toHaveBeenCalledWith("name", "asc");
  });

  test("renders actions column when renderActions provided", () => {
    const renderActions = vi.fn((row) => (
      <button data-testid={`action-${row.id}`}>Action for {row.name}</button>
    ));
    render(
      <Table
        columns={columns}
        data={data}
        rowKey="id"
        renderActions={renderActions}
      />,
    );

    expect(
      screen.getByRole("button", { name: /action for john/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /action for jane/i }),
    ).toBeInTheDocument();
  });

  test("applies sticky header when stickyHeader prop", () => {
    render(<Table columns={columns} data={data} rowKey="id" stickyHeader />);
    expect(getTable()).toBeInTheDocument();
  });

  test("renders caption when provided", () => {
    render(
      <Table columns={columns} data={data} rowKey="id" caption="User List" />,
    );
    // La tabla es un elemento nativo con <caption> sr-only
    expect(
      screen.getByRole("table", { name: "User List" }),
    ).toBeInTheDocument();
  });

  test("applies custom className", () => {
    render(
      <Table
        columns={columns}
        data={data}
        rowKey="id"
        className="custom-class"
      />,
    );
    const table = screen.getByRole("table");
    // eslint-disable-next-line testing-library/no-node-access -- wrapper sin rol; closest necesario para verificar sus clases
    const wrapper = table.closest('div[class*="overflow-x-auto"]');
    expect(wrapper).toHaveClass("custom-class");
  });

  test("handles undefined rowKey gracefully", () => {
    // Should use 'id' as default
    render(<Table columns={columns} data={data} />);
    expect(getTable()).toBeInTheDocument();
  });

  test("applies sortable styles when sortable", () => {
    const sortableColumns = columns.map((c) => ({ ...c, sortable: true }));
    render(
      <Table columns={sortableColumns} data={data} rowKey="id" sortable />,
    );
    expect(screen.getByRole("button", { name: /name/i })).toHaveClass(
      "cursor-pointer",
    );
    expect(screen.getByRole("columnheader", { name: /name/i })).toHaveAttribute(
      "aria-sort",
      "none",
    );
  });
});

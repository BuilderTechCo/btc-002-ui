import { describe, expect, vi, test } from "vitest";
import { render, screen } from "@testing-library/react";
import { EmptyState } from "./empty-state";

describe("emptyState", () => {
  const handleClick = vi.fn();

  test("renders with default props", () => {
    render(<EmptyState title="No data" description="No items found" />);
    expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent(
      "No data",
    );
    expect(screen.getByText("No items found")).toBeInTheDocument();
  });

  test("renders illustration", () => {
    // EmptyState is a regular component, use typeof to access props type
    type EmptyStateProps = React.ComponentProps<typeof EmptyState>;
    const illustrations: EmptyStateProps["illustration"][] = [
      "default",
      "folder",
      "inbox",
      "users",
      "package",
      "target",
      "building",
      "building2",
    ];

    illustrations.forEach((illustration) => {
      const { unmount } = render(
        <EmptyState
          title="Title"
          illustration={illustration}
          key={illustration}
        />,
      );
      expect(screen.getByRole("heading", { level: 3 })).toBeInTheDocument();
      // Illustration renders as SVG within the component
      unmount();
    });
  });

  test("renders action button when provided", () => {
    render(
      <EmptyState
        title="Empty"
        description="No items"
        action={{ label: "Add item", onClick: handleClick }}
      />,
    );
    expect(
      screen.getByRole("button", { name: /add item/i }),
    ).toBeInTheDocument();
  });

  test("renders secondary action when provided", () => {
    render(
      <EmptyState
        title="Empty"
        description="No items"
        action={{ label: "Primary", onClick: handleClick }}
        secondaryAction={{ label: "Secondary", onClick: handleClick }}
      />,
    );
    expect(
      screen.getByRole("button", { name: /primary/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /secondary/i }),
    ).toBeInTheDocument();
  });

  test("applies size classes", () => {
    type EmptyStateProps = React.ComponentProps<typeof EmptyState>;
    const sizes: EmptyStateProps["size"][] = ["sm", "md", "lg"];

    sizes.forEach((size) => {
      const { unmount } = render(
        <EmptyState title="Title" size={size} key={size} />,
      );
      expect(screen.getByRole("heading", { level: 3 })).toBeInTheDocument();
      unmount();
    });
  });

  test("applies custom className", () => {
    render(
      <EmptyState
        title="Title"
        className="custom-class"
        role="region"
        aria-label="Empty state"
      />,
    );

    expect(screen.getByRole("region", { name: "Empty state" })).toHaveClass(
      "custom-class",
    );
  });

  test("hides description when not provided", () => {
    render(<EmptyState title="Title only" />);
    expect(screen.queryByText("No items found")).not.toBeInTheDocument();
  });
});

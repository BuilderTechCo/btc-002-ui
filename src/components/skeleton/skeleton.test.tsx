import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import { Skeleton } from "./skeleton";

describe("skeleton", () => {
  test("renders with default props (text variant)", () => {
    render(<Skeleton aria-label="skeleton" />);
    const skeleton = screen.getByLabelText("skeleton");
    expect(skeleton).toBeInTheDocument();
    expect(skeleton).toHaveClass("animate-skeleton");
    expect(skeleton).toHaveClass("h-4");
    expect(skeleton).toHaveClass("rounded-btc-sm");
  });

  test("applies variant classes", () => {
    // Skeleton is a regular component, use typeof to access props type
    type SkeletonProps = React.ComponentProps<typeof Skeleton>;
    const variants: SkeletonProps["variant"][] = [
      "text",
      "rect",
      "circle",
      "card",
      "table-row",
    ];

    variants.forEach((variant) => {
      const { unmount } = render(
        <Skeleton variant={variant} key={variant} aria-label="skeleton" />,
      );
      // All variants render a div with bg-btc-border-subtle and variant styles
      const skeleton = screen.getByLabelText("skeleton");
      expect(skeleton).toBeInTheDocument();
      unmount();
    });
  });

  test("renders multiple lines for text variant", () => {
    render(<Skeleton variant="text" lines={3} aria-label="skeleton-line" />);
    // El wrapper recibe el aria-label; las 3 líneas son hijos internos
    const wrapper = screen.getByLabelText("skeleton-line");
    expect(wrapper).toBeInTheDocument();
    // eslint-disable-next-line testing-library/no-node-access -- verificar número de líneas generadas; los placeholders no tienen rol semántico
    const lines = Array.from(wrapper.children);
    expect(lines).toHaveLength(3);
    expect(lines.at(-1)).toHaveClass("w-3/4");
  });

  test("applies custom width and height", () => {
    render(<Skeleton width="200px" height="100px" aria-label="skeleton" />);
    const skeleton = screen.getByLabelText("skeleton");
    expect(skeleton).toHaveStyle({ width: "200px", height: "100px" });
  });

  test("applies custom className", () => {
    render(<Skeleton className="custom-class" aria-label="skeleton" />);
    const skeleton = screen.getByLabelText("skeleton");
    expect(skeleton).toHaveClass("custom-class");
  });

  test("disables animation when animated=false", () => {
    render(<Skeleton animated={false} aria-label="skeleton" />);
    const skeleton = screen.getByLabelText("skeleton");
    expect(skeleton).not.toHaveClass("animate-skeleton");
  });

  test("renders circle variant with rounded-full", () => {
    render(
      <Skeleton
        variant="circle"
        width="24px"
        height="24px"
        aria-label="skeleton"
      />,
    );
    const skeleton = screen.getByLabelText("skeleton");
    expect(skeleton).toHaveClass("rounded-btc-full");
  });

  test("renders card variant with rounded-lg", () => {
    render(<Skeleton variant="card" aria-label="skeleton" />);
    const skeleton = screen.getByLabelText("skeleton");
    expect(skeleton).toHaveClass("rounded-btc-lg");
  });
});

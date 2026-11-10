import { describe, expect, vi, test } from "vitest";
import { render, screen } from "@testing-library/react";
import { Label } from "./label";

describe("label", () => {
  test("renders with default props", () => {
    render(<Label>Label text</Label>);
    expect(screen.getByText("Label text")).toBeInTheDocument();
    // Label renders as <label> element - verify via tag
    // eslint-disable-next-line testing-library/no-node-access -- closest required to verify underlying <label> element; no Testing Library query exposes tag name directly
    expect(screen.getByText("Label text").closest("label")).toBeInTheDocument();
  });

  test("applies htmlFor attribute", () => {
    render(<Label htmlFor="input-id">Label</Label>);
    // eslint-disable-next-line testing-library/no-node-access -- closest required to verify underlying <label> element; no Testing Library query exposes tag name directly
    expect(screen.getByText("Label").closest("label")).toHaveAttribute(
      "for",
      "input-id",
    );
  });

  test("renders required asterisk when required", () => {
    render(<Label required>Required field</Label>);
    expect(screen.getByText("*")).toBeInTheDocument();
  });

  test("applies error styles when error prop is true", () => {
    render(<Label error>Error label</Label>);
    // eslint-disable-next-line testing-library/no-node-access -- closest required to verify underlying <label> element; no Testing Library query exposes tag name directly
    expect(screen.getByText("Error label").closest("label")).toHaveClass(
      "text-btc-error",
    );
  });

  test("renders help text when provided", () => {
    render(<Label helpText="Help text">Label</Label>);
    expect(screen.getByText("Help text")).toBeInTheDocument();
    expect(screen.getByText("Help text")).toHaveClass(
      "text-btc-text-secondary",
    );
  });

  test("forwards ref to underlying label element", () => {
    const ref = vi.fn();
    render(<Label ref={ref}>Ref test</Label>);
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLLabelElement));
  });

  test("applies custom className", () => {
    render(<Label className="custom-class">Custom</Label>);
    // eslint-disable-next-line testing-library/no-node-access -- closest required to verify underlying <label> element; no Testing Library query exposes tag name directly
    expect(screen.getByText("Custom").closest("label")).toHaveClass(
      "custom-class",
    );
  });

  test("renders children correctly", () => {
    render(
      <Label>
        <span>Child 1</span>
        <span>Child 2</span>
      </Label>,
    );
    expect(screen.getByText("Child 1")).toBeInTheDocument();
    expect(screen.getByText("Child 2")).toBeInTheDocument();
  });

  test("applies size classes", () => {
    // Label is forwardRef, use typeof to access props type
    type LabelProps = React.ComponentProps<typeof Label>;
    const sizes: LabelProps["size"][] = ["sm", "md", "lg"];

    sizes.forEach((size) => {
      const { unmount } = render(
        <Label size={size} key={size}>
          Label
        </Label>,
      );
      // eslint-disable-next-line testing-library/no-node-access -- closest required to verify underlying <label> element; no Testing Library query exposes tag name directly
      expect(screen.getByText("Label").closest("label")).toBeInTheDocument();
      unmount();
    });
  });
});

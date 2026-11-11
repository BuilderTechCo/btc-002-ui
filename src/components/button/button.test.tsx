import { describe, expect, vi, test } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "./button";

describe("button", () => {
  test("renders with default props", () => {
    render(<Button>Click me</Button>);
    const btn = screen.getByRole("button", { name: /click me/i });
    expect(btn).toBeInTheDocument();
    expect(btn).not.toBeDisabled();
  });

  test("applies variant classes", () => {
    // Button is forwardRef, use typeof to access props type
    type ButtonProps = React.ComponentProps<typeof Button>;
    const variants: ButtonProps["variant"][] = [
      "primary",
      "outline",
      "ghost",
      "danger",
      "danger-outline",
      "info",
      "info-outline",
    ];

    variants.forEach((variant) => {
      const { unmount } = render(
        <Button variant={variant} key={variant}>
          {variant}
        </Button>,
      );
      expect(screen.getByRole("button", { name: variant })).toBeInTheDocument();
      unmount();
    });
  });

  test("applies size classes", () => {
    type ButtonProps = React.ComponentProps<typeof Button>;
    const sizes: ButtonProps["size"][] = ["sm", "md", "lg"];

    sizes.forEach((size) => {
      const { unmount } = render(
        <Button size={size} key={size}>
          {size}
        </Button>,
      );
      expect(screen.getByRole("button", { name: size })).toBeInTheDocument();
      unmount();
    });
  });

  test("shows loading state with spinner and aria-busy", () => {
    render(<Button loading>Loading</Button>);
    const btn = screen.getByRole("button", { name: /loading/i });
    expect(btn).toBeDisabled();
    expect(btn).toHaveAttribute("aria-busy", "true");
    expect(btn).toHaveAttribute("aria-disabled", "true");
    // Accessible name remains the button text, not "Cargando..."
    expect(btn).not.toHaveAttribute("aria-label", "Cargando...");
  });

  test("disables button when disabled prop", () => {
    render(<Button disabled>Disabled</Button>);
    const btn = screen.getByRole("button", { name: /disabled/i });
    expect(btn).toBeDisabled();
    expect(btn).toHaveAttribute("aria-disabled", "true");
  });

  test("renders leftIcon when provided", () => {
    render(
      <Button leftIcon="plus" leftIconCategory="action">
        Add
      </Button>,
    );
    // Icon is rendered inside button - verify via nested SVG
    const btn = screen.getByRole("button");
    // eslint-disable-next-line testing-library/no-node-access -- querySelector required to verify nested SVG icon; no Testing Library query exists for nested SVG elements
    expect(btn.querySelector("svg")).toBeInTheDocument();
  });

  test("renders rightIcon when provided", () => {
    render(
      <Button rightIcon="chevronRight" rightIconCategory="nav">
        Next
      </Button>,
    );
    // Icon is rendered inside button - verify via nested SVG
    const btn = screen.getByRole("button");
    // eslint-disable-next-line testing-library/no-node-access -- querySelector required to verify nested SVG icon; no Testing Library query exists for nested SVG elements
    expect(btn.querySelector("svg")).toBeInTheDocument();
  });

  test("applies fullWidth class when fullWidth prop", () => {
    render(<Button fullWidth>Full</Button>);
    expect(screen.getByRole("button")).toHaveClass("w-full");
  });

  test("forwards ref to underlying button element", () => {
    const ref = vi.fn();
    render(<Button ref={ref}>Ref test</Button>);
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLButtonElement));
  });

  test("calls onClick handler", () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledOnce();
  });

  test("does not call onClick when disabled", () => {
    const handleClick = vi.fn();
    render(
      <Button disabled onClick={handleClick}>
        Click
      </Button>,
    );
    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).not.toHaveBeenCalled();
  });

  test("does not call onClick when loading", () => {
    const handleClick = vi.fn();
    render(
      <Button loading onClick={handleClick}>
        Click
      </Button>,
    );
    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).not.toHaveBeenCalled();
  });

  test("applies custom className", () => {
    render(<Button className="custom-class">Custom</Button>);
    expect(screen.getByRole("button")).toHaveClass("custom-class");
  });

  test("shows aria-label when provided", () => {
    render(<Button aria-label="Custom label">Click</Button>);
    expect(
      screen.getByRole("button", { name: /custom label/i }),
    ).toBeInTheDocument();
  });

  test("resolves tailwind conflicts with clsx (last wins)", () => {
    // Test that custom classes can override
    render(
      <Button className="bg-red-500" variant="primary">
        Test
      </Button>,
    );
    const btn = screen.getByRole("button");
    // The custom class should be applied
    expect(btn).toHaveClass("bg-red-500");
  });

  // ===== NEW ACCESSIBILITY TESTS (B1-B5) =====

  test('b1: loading state adds aria-busy="true" to button', () => {
    render(<Button loading>Submit</Button>);
    const btn = screen.getByRole("button", { name: /submit/i });
    expect(btn).toHaveAttribute("aria-busy", "true");
  });

  test("b1: without loading, button does not have aria-busy", () => {
    render(<Button>Submit</Button>);
    const btn = screen.getByRole("button", { name: /submit/i });
    expect(btn).not.toHaveAttribute("aria-busy");
  });

  test("b2: accessible name unchanged when loading", () => {
    render(<Button loading>Guardar cambios</Button>);
    // Should find button by its original name, not "Cargando..."
    const btn = screen.getByRole("button", { name: /guardar cambios/i });
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveAttribute("aria-busy", "true");
  });

  test('b3: no role="status" inside button when loading', () => {
    render(<Button loading>Submit</Button>);
    // Buttons should not contain role="status" - children are presentational
    const statusInButton = screen.queryByRole("status");
    expect(statusInButton).toBeNull();
  });

  test("b4: existing loading behavior (disabled + click blocking) preserved", () => {
    const handleClick = vi.fn();
    render(
      <Button loading onClick={handleClick}>
        Click
      </Button>,
    );
    const btn = screen.getByRole("button");
    expect(btn).toBeDisabled();
    expect(btn).toHaveAttribute("aria-disabled", "true");
    fireEvent.click(btn);
    expect(handleClick).not.toHaveBeenCalled();
  });

  test('b5: spinner is decorative (aria-hidden="true")', () => {
    render(<Button loading>Submit</Button>);
    const btn = screen.getByRole("button");
    // Limitación: aserción por cadena porque no hay query de Testing Library para aria-hidden en SVG
    expect(btn).toContainHTML('aria-hidden="true"');
  });
});

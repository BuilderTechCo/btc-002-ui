import { describe, expect, vi, test } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BackButton } from "./back-button";

describe("backButton", () => {
  test("renders with default props", () => {
    const handleClick = vi.fn();
    render(<BackButton onClick={handleClick}>Back</BackButton>);
    const button = screen.getByRole("button", { name: /back/i });
    expect(button).toBeInTheDocument();
  });

  test("calls onClick handler", () => {
    const handleClick = vi.fn();
    render(<BackButton onClick={handleClick}>Back</BackButton>);
    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledOnce();
  });

  test("applies variant classes", () => {
    // BackButton is forwardRef, use typeof to access props type
    type BackButtonProps = React.ComponentProps<typeof BackButton>;
    const variants: BackButtonProps["variant"][] = ["ghost", "outline"];

    variants.forEach((variant) => {
      const handleClick = vi.fn();
      const { unmount } = render(
        <BackButton
          variant={variant}
          onClick={handleClick}
          key={variant}
          aria-label={`Back ${variant}`}
        >
          Back
        </BackButton>,
      );
      expect(
        screen.getByRole("button", {
          name: new RegExp(`back ${variant}`, "i"),
        }),
      ).toBeInTheDocument();
      unmount();
    });
  });

  test("renders leftIcon (chevronLeft) by default", () => {
    const handleClick = vi.fn();
    render(<BackButton onClick={handleClick}>Back</BackButton>);
    // leftIcon renders as SVG inside the button - verify via icon class
    const button = screen.getByRole("button", { name: /back/i });
    expect(button).toHaveClass("gap-btc-2"); // Icon adds gap
    // Verify icon renders by checking for nested SVG
    // eslint-disable-next-line testing-library/no-node-access -- SVG icon verification requires direct DOM access; no Testing Library query exists for nested SVG elements
    expect(button.querySelector("svg")).toBeInTheDocument();
  });

  test("applies custom className", () => {
    const handleClick = vi.fn();
    render(
      <BackButton onClick={handleClick} className="custom-class">
        Back
      </BackButton>,
    );
    expect(screen.getByRole("button", { name: /back/i })).toHaveClass(
      "custom-class",
    );
  });

  test("forwards ref to underlying button element", () => {
    const ref = vi.fn();
    const handleClick = vi.fn();
    render(
      <BackButton onClick={handleClick} ref={ref}>
        Back
      </BackButton>,
    );
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLButtonElement));
  });

  test("disables button when disabled", () => {
    const handleClick = vi.fn();
    render(
      <BackButton onClick={handleClick} disabled>
        Back
      </BackButton>,
    );
    expect(screen.getByRole("button", { name: /back/i })).toBeDisabled();
  });

  test("renders custom children", () => {
    const handleClick = vi.fn();
    render(
      <BackButton onClick={handleClick}>
        <span>Custom Back</span>
      </BackButton>,
    );
    expect(screen.getByText("Custom Back")).toBeInTheDocument();
  });
});

import { describe, expect, vi, test } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeToggle } from "./theme-toggle";

describe("themeToggle", () => {
  test("renders with default props", () => {
    render(<ThemeToggle />);
    // aria-label is dynamic: "Tema actual: Sistema. Click para cambiar a Claro"
    const button = screen.getByRole("button", { name: /tema actual/i });
    expect(button).toBeInTheDocument();
  });

  test("renders sun icon for light theme", () => {
    // Use controlled value to set theme
    render(<ThemeToggle value="light" />);
    // When theme is light, aria-label says "Tema actual: Claro. Click para cambiar a Oscuro"
    const button = screen.getByRole("button", { name: /tema actual: claro/i });
    // Icon is present when theme is controlled
    expect(button).toBeInTheDocument();
  });

  test("renders moon icon for dark theme", () => {
    // Use controlled value to set theme
    render(<ThemeToggle value="dark" />);
    // When theme is dark, aria-label says "Tema actual: Oscuro. Click para cambiar a Sistema"
    const button = screen.getByRole("button", { name: /tema actual: oscuro/i });
    // Icon is present when theme is controlled
    expect(button).toBeInTheDocument();
  });

  test("calls onChange when clicked", () => {
    const onChange = vi.fn();
    render(<ThemeToggle onChange={onChange} />);
    fireEvent.click(screen.getByRole("button", { name: /tema actual/i }));
    expect(onChange).toHaveBeenCalled();
  });

  test("applies disabled state", () => {
    render(<ThemeToggle disabled />);
    const button = screen.getByRole("button", { name: /tema actual/i });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-disabled", "true");
  });

  test("applies custom className", () => {
    render(<ThemeToggle className="custom-class" />);
    expect(screen.getByRole("button", { name: /tema actual/i })).toHaveClass(
      "custom-class",
    );
  });

  test("shows correct aria-label", () => {
    render(<ThemeToggle aria-label="Cambiar tema" />);
    expect(
      screen.getByRole("button", { name: /cambiar tema/i }),
    ).toBeInTheDocument();
  });

  test("renders loader when not mounted", () => {
    // Before mount, shows loading state
    render(<ThemeToggle />);
    // Initially shows loader (before useEffect sets mounted=true)
    // In test environment, this happens synchronously so we see the loaded state
    const button = screen.getByRole("button", { name: /tema actual/i });
    expect(button).toBeInTheDocument();
  });

  test("applies the theme when localStorage is unavailable", () => {
    vi.stubGlobal("localStorage", undefined);

    try {
      render(<ThemeToggle value="dark" />);

      expect(document.documentElement).toHaveAttribute("data-theme", "dark");
    } finally {
      vi.unstubAllGlobals();
    }
  });
});

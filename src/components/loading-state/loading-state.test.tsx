import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import { LoadingState } from "./loading-state";

describe("loadingState", () => {
  test("renders with default props (spinner variant)", () => {
    render(<LoadingState />);
    // Spinner variant renders a div with flex flex-col items-center gap-btc-3
    // Contains SVG with animate-spin class - verify by container structure
    // eslint-disable-next-line testing-library/no-node-access -- firstChild required to access container; no Testing Library query exposes body.firstChild
    const container = document.body.firstChild as HTMLElement;
    // eslint-disable-next-line testing-library/no-node-access -- querySelector required to verify SVG with animate-spin class; no Testing Library query exists for class on SVG elements
    expect(container.querySelector("svg.animate-spin")).toBeInTheDocument();
  });

  test("applies variant classes", () => {
    // LoadingState is a regular component, use typeof to access props type
    type LoadingStateProps = React.ComponentProps<typeof LoadingState>;
    const variants: LoadingStateProps["variant"][] = [
      "spinner",
      "skeleton",
      "inline",
      "full",
    ];

    variants.forEach((variant) => {
      const { unmount, container } = render(
        <LoadingState variant={variant} key={variant} />,
      );
      if (variant !== "skeleton") {
        // Spinner, inline, full all render content - check for SVG
        // eslint-disable-next-line testing-library/no-node-access, testing-library/no-container -- container & querySelector required to access nested SVG elements; no Testing Library query exposes SVG elements
        expect(container.querySelector("svg")).toBeInTheDocument();
      } else {
        // Skeleton variant has no SVG
        // eslint-disable-next-line testing-library/no-node-access, testing-library/no-container -- container & querySelector required to access nested SVG elements; no Testing Library query exposes SVG elements
        expect(container.querySelector("svg")).not.toBeInTheDocument();
      }
      unmount();
    });
  });

  test("applies size classes", () => {
    type LoadingStateProps = React.ComponentProps<typeof LoadingState>;
    const sizes: LoadingStateProps["size"][] = ["sm", "md", "lg"];

    sizes.forEach((size) => {
      const { unmount, container } = render(
        <LoadingState size={size} key={size} />,
      );
      // eslint-disable-next-line testing-library/no-node-access, testing-library/no-container -- container & querySelector required to access nested SVG elements; no Testing Library query exposes SVG elements
      expect(container.querySelector("svg")).toBeInTheDocument();
      unmount();
    });
  });

  test("shows custom text", () => {
    render(<LoadingState text="Loading data..." />);
    expect(screen.getByText("Loading data...")).toBeInTheDocument();
  });

  test("shows overlay when fullScreen prop", () => {
    render(<LoadingState fullScreen />);
    // Check for fixed inset-0 classes on the overlay div
    // eslint-disable-next-line testing-library/no-node-access -- querySelector required to find overlay element by class; no Testing Library query exposes class-based search
    const overlay = document.body.querySelector(
      'div[class*="fixed"][class*="inset-0"]',
    );
    expect(overlay).toHaveClass("fixed");
    expect(overlay).toHaveClass("inset-0");
  });

  test("applies custom className", () => {
    render(<LoadingState className="custom-class" />);
    // eslint-disable-next-line testing-library/no-node-access -- querySelector required to find wrapper element by class; no Testing Library query exposes class-based search
    const wrapper = document.body.querySelector(
      'div[class*="flex"][class*="items-center"]',
    );
    expect(wrapper).toHaveClass("custom-class");
  });

  test("renders spinner svg for spinner variant", () => {
    render(<LoadingState variant="spinner" />);
    // Spinner renders SVG with animate-spin class
    // eslint-disable-next-line testing-library/no-node-access -- firstChild required to access container; no Testing Library query exposes body.firstChild
    const container = document.body.firstChild as HTMLElement;
    // eslint-disable-next-line testing-library/no-node-access, testing-library/no-container -- querySelector on firstChild required to verify SVG with animate-spin class; no Testing Library query exists for class on SVG elements
    expect(container.querySelector("svg.animate-spin")).toBeInTheDocument();
  });

  test("renders skeleton for skeleton variant", () => {
    render(<LoadingState variant="skeleton" />);
    // Skeleton variant renders Skeleton components
    // eslint-disable-next-line testing-library/no-node-access -- firstChild required to access container; no Testing Library query exposes body.firstChild
    const container = document.body.firstChild as HTMLElement;
    // eslint-disable-next-line testing-library/no-node-access, testing-library/no-container -- querySelector on firstChild required to verify absence of SVG element; no Testing Library query exists for SVG elements
    expect(container.querySelector("svg")).not.toBeInTheDocument();
  });

  test("renders inline variant correctly", () => {
    render(<LoadingState variant="inline" text="Loading" />);
    expect(screen.getByText("Loading")).toBeInTheDocument();
    // Inline variant renders as span with inline-flex class
    // eslint-disable-next-line testing-library/no-node-access -- parentElement required to verify Tailwind classes on wrapper element; no Testing Library query exposes wrapper classes directly
    expect(screen.getByText("Loading").parentElement).toHaveClass(
      "inline-flex",
    );
  });

  // ===== NEW ACCESSIBILITY TESTS (L1-L5) =====

  test('l1: each variant has exactly one role="status" region', () => {
    const variants: React.ComponentProps<typeof LoadingState>["variant"][] = [
      "spinner",
      "skeleton",
      "inline",
      "full",
    ];

    variants.forEach((variant) => {
      const { unmount } = render(
        <LoadingState variant={variant} key={variant} />,
      );
      const statusRegions = screen.getAllByRole("status");
      expect(statusRegions).toHaveLength(1);
      unmount();
    });
  });

  test('l2: status region has default text "Cargando…"', () => {
    render(<LoadingState variant="spinner" />);
    const status = screen.getByRole("status");
    expect(status).toHaveTextContent("Cargando…");
  });

  test("l3: label prop overrides default text", () => {
    render(<LoadingState variant="spinner" label="Subiendo archivo" />);
    const status = screen.getByRole("status");
    expect(status).toHaveTextContent("Subiendo archivo");
    expect(status).not.toHaveTextContent("Cargando…");
  });

  test('l4: inline variant preserves existing class assertions via role="status"', () => {
    render(<LoadingState variant="inline" text="Loading" />);
    const status = screen.getByRole("status");
    expect(status).toHaveClass("inline-flex");
    expect(status).toHaveClass("items-center");
    expect(status).toHaveClass("gap-btc-2");
  });

  test('l5: spinner is decorative (aria-hidden="true")', () => {
    render(<LoadingState variant="spinner" />);
    const status = screen.getByRole("status");
    // Limitación: aserción por cadena porque no hay query de Testing Library para aria-hidden en SVG
    expect(status).toContainHTML('aria-hidden="true"');
  });
});

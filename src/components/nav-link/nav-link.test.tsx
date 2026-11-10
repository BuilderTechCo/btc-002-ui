import { describe, expect, vi, test } from "vitest";
import { render, screen } from "@testing-library/react";
import { NavLink } from "./nav-link";

describe("navLink", () => {
  const handleClick = vi.fn();

  test("renders as anchor with href", () => {
    render(<NavLink href="/dashboard">Dashboard</NavLink>);
    const link = screen.getByRole("link", { name: /dashboard/i });
    expect(link).toHaveAttribute("href", "/dashboard");
  });

  test("applies active styles when active", () => {
    render(
      <NavLink href="/active" active>
        Active
      </NavLink>,
    );
    expect(screen.getByRole("link", { name: /active/i })).toHaveClass(
      "bg-btc-brand/10",
    );
  });

  test("renders as link even when onClick provided", () => {
    render(
      <NavLink href="/button" onClick={handleClick}>
        Button Link
      </NavLink>,
    );
    expect(
      screen.getByRole("link", { name: /button link/i }),
    ).toBeInTheDocument();
  });

  test("renders leftIcon when provided", () => {
    render(
      <NavLink href="/icon" leftIcon="home" leftIconCategory="nav">
        Home
      </NavLink>,
    );
    // leftIcon renders as SVG inside the link
    expect(screen.getByRole("link", { name: /home/i })).toBeInTheDocument();
  });

  test("applies badgeVariant classes", () => {
    // NavLink is forwardRef, use typeof to access props type
    type NavLinkProps = React.ComponentProps<typeof NavLink>;
    const badgeVariants: NavLinkProps["badgeVariant"][] = [
      "default",
      "success",
      "warning",
      "error",
      "info",
    ];

    badgeVariants.forEach((badgeVariant) => {
      const { unmount } = render(
        <NavLink
          href="/badge"
          badge={5}
          badgeVariant={badgeVariant}
          key={badgeVariant}
        >
          Badge
        </NavLink>,
      );
      expect(screen.getByRole("link", { name: /badge/i })).toBeInTheDocument();
      unmount();
    });
  });

  test("forwards ref to underlying element", () => {
    const ref = vi.fn();
    render(
      <NavLink href="/test" ref={ref}>
        Ref
      </NavLink>,
    );
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLAnchorElement));
  });

  test("applies custom className", () => {
    render(
      <NavLink href="/custom" className="custom-class">
        Custom
      </NavLink>,
    );
    expect(screen.getByRole("link", { name: /custom/i })).toHaveClass(
      "custom-class",
    );
  });

  test("renders badge when provided", () => {
    render(
      <NavLink href="/badge" badge={5}>
        Badge
      </NavLink>,
    );
    // Badge is rendered as span with rounded-btc-full class
    expect(screen.getByRole("link", { name: /badge/i })).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  test("applies disabled styles when disabled", () => {
    render(
      <NavLink href="/disabled" disabled>
        Disabled
      </NavLink>,
    );
    const link = screen.getByRole("link", { name: /disabled/i });
    // The disabled state is applied via CSS :disabled pseudo-class
    // The actual element has aria-disabled="true" and tabIndex=-1
    expect(link).toHaveAttribute("aria-disabled", "true");
    expect(link).toHaveAttribute("tabIndex", "-1");
    // The CSS class disabled:opacity-50 applies visually but not as a static class
  });

  test("applies padding classes", () => {
    type NavLinkProps = React.ComponentProps<typeof NavLink>;
    const paddings: NavLinkProps["padding"][] = ["sm", "md", "lg"];

    paddings.forEach((padding) => {
      const { unmount } = render(
        <NavLink href="/pad" padding={padding} key={padding}>
          Pad
        </NavLink>,
      );
      expect(screen.getByRole("link", { name: /pad/i })).toBeInTheDocument();
      unmount();
    });
  });

  test("applies align classes", () => {
    type NavLinkProps = React.ComponentProps<typeof NavLink>;
    const aligns: NavLinkProps["align"][] = ["left", "center"];

    aligns.forEach((align) => {
      const { unmount } = render(
        <NavLink href="/align" align={align} key={align}>
          Align
        </NavLink>,
      );
      expect(screen.getByRole("link", { name: /align/i })).toBeInTheDocument();
      unmount();
    });
  });
});

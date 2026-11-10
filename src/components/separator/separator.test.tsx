import { describe, expect, vi, test } from "vitest";
import { render, screen } from "@testing-library/react";
import { Separator } from "./separator";

describe("separator", () => {
  test("renders as horizontal rule by default", () => {
    render(<Separator decorative={false} />);
    const separator = screen.getByRole("separator");
    expect(separator).toBeInTheDocument();
    expect(separator).toHaveAttribute("aria-orientation", "horizontal");
  });

  test("renders as vertical when orientation=vertical", () => {
    render(<Separator orientation="vertical" decorative={false} />);
    const separator = screen.getByRole("separator");
    expect(separator).toHaveAttribute("aria-orientation", "vertical");
  });

  test("applies decorative attribute when decorative", () => {
    render(<Separator decorative />);
    const hr = screen.getByRole("none");
    // When decorative, role="none" is used (not aria-hidden)
    expect(hr).toHaveAttribute("role", "none");
  });

  test("does not have role=separator when decorative", () => {
    render(<Separator decorative />);
    // When decorative, it shouldn't have role="separator", it has role="none"
    const hr = screen.getByRole("none");
    expect(hr).not.toHaveAttribute("role", "separator");
    expect(hr).toHaveAttribute("role", "none");
  });

  test("forwards ref to underlying hr element", () => {
    const ref = vi.fn();
    render(<Separator ref={ref} />);
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLHRElement));
  });

  test("applies custom className", () => {
    render(<Separator decorative={false} className="custom-class" />);
    expect(screen.getByRole("separator")).toHaveClass("custom-class");
  });
});

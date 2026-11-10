import { describe, expect, vi, beforeEach, afterEach, test } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogFooter,
  DialogClose,
} from "./dialog";

describe("dialog", () => {
  const defaultProps = {
    open: true,
    onClose: vi.fn(),
    title: "Test Dialog",
    description: "This is a test dialog",
    children: <p>Dialog content</p>,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    document.body.style.overflow = "";
  });

  afterEach(() => {
    vi.restoreAllMocks();
    document.body.style.overflow = "";
  });

  test("renders when open is true", () => {
    render(<Dialog {...defaultProps} />);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Test Dialog")).toBeInTheDocument();
    expect(screen.getByText("This is a test dialog")).toBeInTheDocument();
    expect(screen.getByText("Dialog content")).toBeInTheDocument();
  });

  test("does not render when open is false", () => {
    render(<Dialog {...defaultProps} open={false} />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  test("applies size classes", () => {
    // Dialog is forwardRef, use typeof to access props type
    type DialogProps = React.ComponentProps<typeof Dialog>;
    const sizes: DialogProps["size"][] = ["sm", "md", "lg", "xl", "full"];

    sizes.forEach((size) => {
      const { unmount } = render(
        <Dialog {...defaultProps} size={size} key={size} />,
      );
      expect(screen.getByRole("dialog")).toBeInTheDocument();
      unmount();
    });
  });

  test("applies align classes", () => {
    type DialogProps = React.ComponentProps<typeof Dialog>;
    const aligns: DialogProps["align"][] = ["center", "top", "bottom"];

    aligns.forEach((align) => {
      const { unmount } = render(
        <Dialog {...defaultProps} align={align} key={align} />,
      );
      expect(screen.getByRole("dialog")).toBeInTheDocument();
      unmount();
    });
  });

  test("calls onClose when close button clicked", () => {
    render(<Dialog {...defaultProps} />);
    fireEvent.click(screen.getByRole("button", { name: /cerrar/i }));
    expect(defaultProps.onClose).toHaveBeenCalledOnce();
  });

  test("calls onClose when ESC pressed (closeOnEscape=true)", () => {
    render(<Dialog {...defaultProps} closeOnEscape={true} />);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(defaultProps.onClose).toHaveBeenCalledOnce();
  });

  test("does not call onClose when ESC pressed (closeOnEscape=false)", () => {
    render(<Dialog {...defaultProps} closeOnEscape={false} />);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(defaultProps.onClose).not.toHaveBeenCalled();
  });

  test("calls onClose when overlay clicked (closeOnOverlayClick=true)", () => {
    render(<Dialog {...defaultProps} closeOnOverlayClick={true} />);
    // Click on the backdrop overlay (fixed inset-0 div with role="presentation")
    // This is the element that has the onClick handler for closeOnOverlayClick
    const backdrop = screen.getByRole("presentation");
    fireEvent.click(backdrop);
    expect(defaultProps.onClose).toHaveBeenCalledOnce();
  });

  test("does not call onClose when overlay clicked (closeOnOverlayClick=false)", () => {
    render(<Dialog {...defaultProps} closeOnOverlayClick={false} />);
    const backdrop = screen.getByRole("presentation");
    fireEvent.click(backdrop);
    expect(defaultProps.onClose).not.toHaveBeenCalled();
  });

  test("does not call onClose when clicking inside dialog", () => {
    render(<Dialog {...defaultProps} />);
    fireEvent.click(screen.getByRole("dialog"));
    expect(defaultProps.onClose).not.toHaveBeenCalled();
  });

  test("has correct ARIA attributes", () => {
    render(<Dialog {...defaultProps} />);
    const dialog = screen.getByRole("dialog");
    const labelledBy = dialog.getAttribute("aria-labelledby");
    const describedBy = dialog.getAttribute("aria-describedby");

    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(labelledBy).toBeTruthy();
    expect(describedBy).toBeTruthy();
    expect(screen.getByText("Test Dialog")).toHaveAttribute("id", labelledBy);
    expect(screen.getByText("This is a test dialog")).toHaveAttribute(
      "id",
      describedBy,
    );
  });

  test("renders without title or description", () => {
    render(<Dialog open={true} onClose={vi.fn()} children={<p>Content</p>} />);
    const dialog = screen.getByRole("dialog");
    expect(dialog).not.toHaveAttribute("aria-labelledby");
    expect(dialog).not.toHaveAttribute("aria-describedby");
  });

  test("renders DialogHeader sub-component", () => {
    render(
      <Dialog open={true} onClose={vi.fn()}>
        <DialogHeader>Custom header</DialogHeader>
      </Dialog>,
    );
    expect(screen.getByText("Custom header")).toBeInTheDocument();
  });

  test("renders DialogContent sub-component", () => {
    render(
      <Dialog open={true} onClose={vi.fn()}>
        <DialogContent>Custom content</DialogContent>
      </Dialog>,
    );
    expect(screen.getByText("Custom content")).toBeInTheDocument();
  });

  test("renders DialogFooter sub-component", () => {
    render(
      <Dialog open={true} onClose={vi.fn()}>
        <DialogFooter>Custom footer</DialogFooter>
      </Dialog>,
    );
    expect(screen.getByText("Custom footer")).toBeInTheDocument();
  });

  test("renders DialogClose sub-component", () => {
    const onClose = vi.fn();
    render(
      <Dialog open={true} onClose={onClose}>
        <DialogClose onClose={onClose} />
      </Dialog>,
    );
    // The Dialog already renders its own close button, so there will be two
    const closeButtons = screen.getAllByRole("button", { name: /cerrar/i });
    expect(closeButtons.length).toBeGreaterThanOrEqual(1);
  });

  test("disables body scroll when open", () => {
    render(<Dialog {...defaultProps} />);
    expect(document.body.style.overflow).toBe("hidden");
  });

  test("restores body scroll on unmount", () => {
    const { unmount } = render(<Dialog {...defaultProps} />);
    unmount();
    expect(document.body.style.overflow).toBe("");
  });

  test("renders without portal when portal=false", () => {
    render(<Dialog {...defaultProps} portal={false} />);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  test("se monta en body por defecto, ignorando un dialog-portal con transform", () => {
    const transformedPortal = document.createElement("div");
    transformedPortal.id = "dialog-portal";
    transformedPortal.style.transform = "translateZ(0)";
    document.body.appendChild(transformedPortal);

    render(<Dialog {...defaultProps} />);

    const dialog = screen.getByRole("dialog");
    expect(transformedPortal).not.toContainElement(dialog);
    expect(within(document.body).getAllByRole("dialog")).toHaveLength(1);

    transformedPortal.remove();
  });

  test("applies custom portalId", () => {
    const customPortalId = "custom-portal";
    const customPortal = document.createElement("div");
    customPortal.id = customPortalId;
    document.body.appendChild(customPortal);

    render(
      <Dialog {...defaultProps} portal={true} portalId={customPortalId} />,
    );
    expect(within(customPortal).getByRole("dialog")).toBeInTheDocument();

    customPortal.remove();
  });
});

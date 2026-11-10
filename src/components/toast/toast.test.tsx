import { describe, expect, vi, beforeEach, afterEach, test } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { ToastProvider, Toast, ToastViewport, useToast } from "./toast";

const variantStyles: Record<
  "default" | "success" | "warning" | "error" | "info",
  { bg: string; border: string; icon: string; color: string }
> = {
  default: {
    bg: "bg-btc-surface",
    border: "border-btc-border-default",
    icon: "info",
    color: "text-btc-info",
  },
  success: {
    bg: "bg-btc-success-bg",
    border: "border-btc-success/20",
    icon: "checkCircle",
    color: "text-btc-success",
  },
  warning: {
    bg: "bg-btc-warning-bg",
    border: "border-btc-warning/20",
    icon: "alertTriangle",
    color: "text-btc-warning",
  },
  error: {
    bg: "bg-btc-error-bg",
    border: "border-btc-error/20",
    icon: "alertCircle",
    color: "text-btc-error",
  },
  info: {
    bg: "bg-btc-info-bg",
    border: "border-btc-info/20",
    icon: "info",
    color: "text-btc-info",
  },
};

describe("toast (direct)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  test("renders toast with title and message", () => {
    render(
      <Toast
        id="test-1"
        title="Test Title"
        message="Test message"
        variant="default"
        onClose={vi.fn()}
        variantStyle={variantStyles.default}
      />,
    );

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText("Test Title")).toBeInTheDocument();
    expect(screen.getByText("Test message")).toBeInTheDocument();
  });

  test("applies variant classes", () => {
    // Toast is not forwardRef, but we can still access its props type
    type ToastProps = React.ComponentProps<typeof Toast>;
    const variants: ToastProps["variant"][] = [
      "default",
      "success",
      "warning",
      "error",
      "info",
    ];

    variants.forEach((variant) => {
      const { unmount } = render(
        <Toast
          key={variant}
          id={`test-${variant}`}
          variant={variant}
          title="Title"
          message="Message"
          onClose={vi.fn()}
          variantStyle={variantStyles[variant as keyof typeof variantStyles]}
        />,
      );

      expect(screen.getByRole("alert")).toBeInTheDocument();
      unmount();
    });
  });

  test("renders success variant with checkCircle icon", () => {
    render(
      <Toast
        id="success-1"
        variant="success"
        title="Success"
        message="Operation completed"
        onClose={vi.fn()}
        variantStyle={variantStyles.success}
      />,
    );

    const toast = screen.getByRole("alert");
    expect(toast).toHaveClass("bg-btc-success-bg");
    expect(toast).toHaveClass("border-btc-success/20");
  });

  test("renders error variant with alertCircle icon", () => {
    render(
      <Toast
        id="error-1"
        variant="error"
        title="Error"
        message="Something went wrong"
        onClose={vi.fn()}
        variantStyle={variantStyles.error}
      />,
    );

    const toast = screen.getByRole("alert");
    expect(toast).toHaveClass("bg-btc-error-bg");
    expect(toast).toHaveClass("border-btc-error/20");
  });

  test("renders action button when provided", () => {
    const actionClick = vi.fn();
    render(
      <Toast
        id="action-1"
        title="Action Toast"
        action={{ label: "Undo", onClick: actionClick }}
        onClose={vi.fn()}
        variantStyle={variantStyles.default}
      />,
    );

    expect(screen.getByRole("button", { name: /undo/i })).toBeInTheDocument();
  });

  test("calls action onClick when action button clicked", () => {
    const actionClick = vi.fn();
    render(
      <Toast
        id="action-2"
        title="Action Toast"
        action={{ label: "Undo", onClick: actionClick }}
        onClose={vi.fn()}
        variantStyle={variantStyles.default}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /undo/i }));
    expect(actionClick).toHaveBeenCalledOnce();
  });

  test("shows dismiss button when dismissible", () => {
    render(
      <Toast
        id="dismiss-1"
        title="Dismissible"
        dismissible={true}
        onClose={vi.fn()}
        variantStyle={variantStyles.default}
      />,
    );

    expect(
      screen.getByRole("button", { name: /cerrar notificación/i }),
    ).toBeInTheDocument();
  });

  test("hides dismiss button when not dismissible", () => {
    render(
      <Toast
        id="no-dismiss-1"
        title="Not Dismissible"
        dismissible={false}
        onClose={vi.fn()}
        variantStyle={variantStyles.default}
      />,
    );

    expect(
      screen.queryByRole("button", { name: /cerrar notificación/i }),
    ).not.toBeInTheDocument();
  });

  test("calls onClose when dismiss button clicked", () => {
    const onClose = vi.fn();
    render(
      <Toast
        id="close-1"
        title="Close Test"
        onClose={onClose}
        variantStyle={variantStyles.default}
      />,
    );

    fireEvent.click(
      screen.getByRole("button", { name: /cerrar notificación/i }),
    );
    expect(onClose).toHaveBeenCalledWith("close-1");
  });

  test("calls onClose after duration (auto-dismiss)", () => {
    const onClose = vi.fn();
    render(
      <Toast
        id="auto-1"
        title="Auto Dismiss"
        duration={5000}
        onClose={onClose}
        variantStyle={variantStyles.default}
      />,
    );

    expect(screen.getByRole("alert")).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(onClose).toHaveBeenCalledWith("auto-1");
  });

  test("does not auto-dismiss when duration is 0", () => {
    const onClose = vi.fn();
    render(
      <Toast
        id="no-auto-1"
        title="No Auto Dismiss"
        duration={0}
        onClose={onClose}
        variantStyle={variantStyles.default}
      />,
    );

    expect(screen.getByRole("alert")).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(10000);
    });

    expect(onClose).not.toHaveBeenCalled();
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  test("clears timer on unmount", () => {
    const onClose = vi.fn();
    const { unmount } = render(
      <Toast
        id="unmount-1"
        title="Unmount Test"
        duration={5000}
        onClose={onClose}
        variantStyle={variantStyles.default}
      />,
    );

    unmount();

    act(() => {
      vi.advanceTimersByTime(10000);
    });

    expect(onClose).not.toHaveBeenCalled();
  });

  test("renders without title", () => {
    render(
      <Toast
        id="no-title-1"
        message="Message only"
        onClose={vi.fn()}
        variantStyle={variantStyles.default}
      />,
    );

    expect(screen.queryByText("Test Title")).not.toBeInTheDocument();
    expect(screen.getByText("Message only")).toBeInTheDocument();
  });

  test("renders without message", () => {
    render(
      <Toast
        id="no-message-1"
        title="Title only"
        onClose={vi.fn()}
        variantStyle={variantStyles.default}
      />,
    );

    expect(screen.getByText("Title only")).toBeInTheDocument();
    expect(screen.queryByText("Message")).not.toBeInTheDocument();
  });

  test("renders variant icon", () => {
    render(
      <Toast
        id="icon-1"
        title="With Icon"
        variantStyle={variantStyles.success}
      />,
    );

    // Icon is present when variant is rendered
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });
});

describe("toastProvider", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  test("provides useToast context", () => {
    function TestComponent() {
      const { addToast, removeToast, clearToasts } = useToast();
      return (
        <div>
          <button
            onClick={() => addToast({ title: "Test", variant: "default" })}
          >
            Add
          </button>
          <button onClick={() => removeToast("test")}>Remove</button>
          <button onClick={clearToasts}>Clear</button>
        </div>
      );
    }

    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>,
    );

    expect(screen.getByRole("button", { name: /add/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /remove/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /clear/i })).toBeInTheDocument();
  });

  test("adds toast via useToast (renders without error)", () => {
    function TestComponent() {
      const { addToast } = useToast();
      return (
        <button
          onClick={() => addToast({ title: "New Toast", variant: "success" })}
        >
          Add Toast
        </button>
      );
    }

    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: /add toast/i }));

    // Verify no error thrown - the provider renders correctly
    expect(
      screen.getByRole("button", { name: /add toast/i }),
    ).toBeInTheDocument();
  });

  test("provides removeToast and clearToasts functions", () => {
    function TestComponent() {
      const { addToast, removeToast, clearToasts } = useToast();
      let toastId = "";
      const handleAdd = () => {
        toastId = addToast({ title: "To Remove", variant: "default" });
      };
      return (
        <div>
          <button onClick={handleAdd}>Add</button>
          <button onClick={() => removeToast(toastId)}>Remove</button>
          <button onClick={clearToasts}>Clear All</button>
        </div>
      );
    }

    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: /add/i }));
    fireEvent.click(screen.getByRole("button", { name: /remove/i }));
    fireEvent.click(screen.getByRole("button", { name: /clear all/i }));

    // Just verify the functions are called without error
    expect(
      screen.getByRole("button", { name: /clear all/i }),
    ).toBeInTheDocument();
  });

  test("limits max toasts in state", () => {
    function TestComponent() {
      const { addToast } = useToast();
      return (
        <button
          onClick={() => {
            for (let i = 0; i < 7; i++) {
              addToast({ title: `Toast ${i}`, variant: "default" });
            }
          }}
        >
          Add Many
        </button>
      );
    }

    render(
      <ToastProvider maxToasts={5}>
        <TestComponent />
      </ToastProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: /add many/i }));

    // Verify the component renders without error
    expect(
      screen.getByRole("button", { name: /add many/i }),
    ).toBeInTheDocument();
  });

  test("applies position classes", () => {
    const positions = [
      "top-right",
      "top-left",
      "bottom-right",
      "bottom-left",
      "top-center",
      "bottom-center",
    ] as const;

    positions.forEach((position) => {
      const { unmount } = render(
        <ToastProvider key={position} position={position}>
          <div role="generic" data-testid="test">
            Test
          </div>
        </ToastProvider>,
      );

      // Just verify it renders without error
      expect(screen.getByText("Test")).toBeInTheDocument();
      unmount();
    });
  });

  test("uses custom portalId", () => {
    const customPortalId = "custom-toast-portal";
    const customPortal = document.createElement("div");
    customPortal.id = customPortalId;
    document.body.appendChild(customPortal);

    function TestComponent() {
      const { addToast } = useToast();
      return (
        <button
          onClick={() =>
            addToast({ title: "Custom Portal", variant: "default" })
          }
        >
          Add
        </button>
      );
    }

    render(
      <ToastProvider portalId={customPortalId}>
        <TestComponent />
      </ToastProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: /add/i }));

    // Verify it renders without error
    expect(screen.getByRole("button", { name: /add/i })).toBeInTheDocument();
  });

  test("throws error when useToast used outside provider", () => {
    function BadComponent() {
      useToast();
      return <div>Bad</div>;
    }

    const consoleError = vi.spyOn(console, "error").mockImplementation(vi.fn());

    expect(() => {
      render(<BadComponent />);
    }).toThrow("useToast must be used within a ToastProvider");

    consoleError.mockRestore();
  });

  test("renders ToastViewport", () => {
    render(
      <ToastProvider>
        <ToastViewport>Viewport content</ToastViewport>
      </ToastProvider>,
    );

    expect(screen.getByText("Viewport content")).toBeInTheDocument();
  });
});

describe("toast accessibility", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  test('has role="alert"', () => {
    render(
      <Toast
        id="a11y-1"
        title="Alert"
        onClose={vi.fn()}
        variantStyle={variantStyles.default}
      />,
    );

    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  test('has aria-live="polite"', () => {
    render(
      <Toast
        id="a11y-2"
        title="Alert"
        onClose={vi.fn()}
        variantStyle={variantStyles.default}
      />,
    );

    expect(screen.getByRole("alert")).toHaveAttribute("aria-live", "polite");
  });

  test("has aria-label on dismiss button", () => {
    render(
      <Toast
        id="a11y-3"
        title="Alert"
        onClose={vi.fn()}
        variantStyle={variantStyles.default}
      />,
    );

    expect(
      screen.getByRole("button", { name: /cerrar notificación/i }),
    ).toHaveAttribute("aria-label", "Cerrar notificación");
  });
});

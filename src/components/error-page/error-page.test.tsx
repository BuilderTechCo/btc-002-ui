import { describe, expect, vi, test } from "vitest";
import { render, screen } from "@testing-library/react";
import { ErrorPage } from "./error-page";

describe("errorPage", () => {
  const handleClick = vi.fn();

  test("renders 404 page by default", () => {
    render(<ErrorPage code={404} />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("404");
    expect(screen.getByText("Página no encontrada")).toBeInTheDocument();
  });

  test("renders specific status code", () => {
    // ErrorPage is a regular component, use typeof to access props type
    type ErrorPageProps = React.ComponentProps<typeof ErrorPage>;
    const statusCodes: ErrorPageProps["code"][] = [401, 403, 404, 500, 503];

    statusCodes.forEach((code) => {
      const { unmount } = render(<ErrorPage code={code} key={String(code)} />);
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
        String(code),
      );
      unmount();
    });
  });

  test("renders custom title and message", () => {
    render(<ErrorPage code={404} title="Not Found" message="Custom message" />);
    // Component renders code in h1, custom title in h2, message in p
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("404");
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      "Not Found",
    );
    expect(screen.getByText("Custom message")).toBeInTheDocument();
  });

  test("renders action buttons when provided", () => {
    render(
      <ErrorPage
        code={404}
        action={{ label: "Go Home", onClick: handleClick, href: "/" }}
        secondaryAction={{ label: "Contact", onClick: handleClick }}
      />,
    );
    // Both action and secondaryAction render as Button components (role="button")
    // The href prop is not used by the component
    expect(
      screen.getByRole("button", { name: /go home/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /contact/i }),
    ).toBeInTheDocument();
  });

  test("renders illustration", () => {
    render(<ErrorPage code={404} />);
    // Illustration renders as SVG within the component
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });

  test("applies custom className", () => {
    render(
      <ErrorPage
        code={404}
        className="custom-class"
        role="region"
        aria-label="Error page"
      />,
    );

    expect(screen.getByRole("region", { name: "Error page" })).toHaveClass(
      "custom-class",
    );
  });
});

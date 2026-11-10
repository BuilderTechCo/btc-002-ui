import { describe, expect, vi, test } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardActions,
} from "./card";

describe("card", () => {
  test("renders with default props", () => {
    render(
      <Card role="region" aria-label="Test Card">
        Card content
      </Card>,
    );
    const card = screen.getByRole("region", { name: "Test Card" });
    expect(card).toHaveClass("rounded-btc-lg");
    expect(card).toHaveClass("bg-btc-surface");
    expect(card).toHaveClass("border-btc-border-default");
    expect(card).toHaveClass("p-btc-4");
  });

  test("applies variant classes", () => {
    // Card is forwardRef, use typeof to access props type
    type CardProps = React.ComponentProps<typeof Card>;
    const variants: CardProps["variant"][] = [
      "default",
      "outlined",
      "elevated",
      "elevated-bordered",
    ];

    variants.forEach((variant) => {
      const { unmount } = render(
        <Card
          variant={variant}
          role="region"
          aria-label={`Test Card ${variant}`}
          key={variant}
        >
          Content {variant}
        </Card>,
      );
      const card = screen.getByRole("region", { name: `Test Card ${variant}` });
      expect(card).toBeInTheDocument();
      unmount();
    });
  });

  test("applies padding classes", () => {
    type CardProps = React.ComponentProps<typeof Card>;
    const paddings: CardProps["padding"][] = ["none", "sm", "md", "lg"];

    paddings.forEach((padding) => {
      const { unmount } = render(
        <Card
          padding={padding}
          role="region"
          aria-label={`Test Card ${padding}`}
          key={padding}
        >
          Content {padding}
        </Card>,
      );
      const card = screen.getByRole("region", { name: `Test Card ${padding}` });
      expect(card).toBeInTheDocument();
      unmount();
    });
  });

  test("applies custom className", () => {
    render(
      <Card className="custom-class" role="region" aria-label="Custom Card">
        Content
      </Card>,
    );
    expect(screen.getByRole("region", { name: "Custom Card" })).toHaveClass(
      "custom-class",
    );
  });

  test("forwards ref to underlying div element", () => {
    const ref = vi.fn();
    render(<Card ref={ref}>Content</Card>);
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLDivElement));
  });

  test("renders compound structure with all sub-components", () => {
    render(
      <Card
        variant="outlined"
        padding="md"
        role="region"
        aria-label="Compound Card"
      >
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card description text</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Main content goes here</p>
        </CardContent>
        <CardFooter>
          <CardActions>Action buttons</CardActions>
        </CardFooter>
      </Card>,
    );

    expect(screen.getByText("Card Title")).toBeInTheDocument();
    expect(screen.getByText("Card description text")).toBeInTheDocument();
    expect(screen.getByText("Main content goes here")).toBeInTheDocument();
    expect(screen.getByText("Action buttons")).toBeInTheDocument();

    const card = screen.getByRole("region", { name: "Compound Card" });
    expect(card).toHaveClass("border-btc-border-strong");
  });

  test("renders CardHeader with correct structure", () => {
    render(
      <Card role="region" aria-label="Header Card">
        <CardHeader>
          <CardTitle>Title</CardTitle>
        </CardHeader>
      </Card>,
    );
    // CardHeader apila título y descripción; el gap lo aporta el flex
    const card = screen.getByRole("region", { name: "Header Card" });
    expect(card).toContainHTML("flex");
    expect(card).toContainHTML("flex-col");
    expect(card).toContainHTML("gap-btc-1");
    expect(card).toContainHTML("border-b");
    expect(card).toContainHTML("border-btc-border-subtle");
  });

  test("renders CardTitle with correct classes", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Title</CardTitle>
        </CardHeader>
      </Card>,
    );
    const title = screen.getByRole("heading", { level: 3 });
    expect(title).toHaveClass("font-semibold");
    expect(title).toHaveClass("text-btc-text-primary");
  });

  test("renders CardDescription with correct classes", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Title</CardTitle>
          <CardDescription>Description text</CardDescription>
        </CardHeader>
      </Card>,
    );
    const description = screen.getByText("Description text");
    expect(description).toHaveClass("text-btc-text-primary");
    expect(description).toHaveClass("text-btc-caption");
  });

  test("renders CardContent", () => {
    render(
      <Card>
        <CardContent>Content here</CardContent>
      </Card>,
    );
    expect(screen.getByText("Content here")).toBeInTheDocument();
  });

  test("renders CardFooter with correct structure", () => {
    render(
      <Card role="region" aria-label="Footer Card">
        <CardFooter>Footer content</CardFooter>
      </Card>,
    );
    // CardFooter renders as a flex div - verify via HTML content
    const card = screen.getByRole("region", { name: "Footer Card" });
    expect(card).toContainHTML("flex");
    expect(card).toContainHTML("items-center");
    expect(card).toContainHTML("justify-end");
    expect(card).toContainHTML("border-t");
    expect(card).toContainHTML("border-btc-border-subtle");
  });

  test("renders CardActions with correct structure", () => {
    render(
      <Card role="region" aria-label="Actions Card">
        <CardActions>Actions here</CardActions>
      </Card>,
    );
    // CardActions renders as a flex div - verify via HTML content
    const card = screen.getByRole("region", { name: "Actions Card" });
    expect(card).toContainHTML("flex");
    expect(card).toContainHTML("items-center");
    expect(card).toContainHTML("justify-end");
  });

  test("renders elevated variant with shadow", () => {
    render(
      <Card variant="elevated" role="region" aria-label="Elevated Card">
        Elevated
      </Card>,
    );
    const card = screen.getByRole("region", { name: "Elevated Card" });
    expect(card).toHaveClass("shadow-btc-2");
    expect(card).toHaveClass("border-none");
  });

  test("renders elevated-bordered variant with shadow and border", () => {
    render(
      <Card variant="elevated-bordered" role="region" aria-label="Elevated Bordered Card">
        Elevated Bordered
      </Card>,
    );
    const card = screen.getByRole("region", { name: "Elevated Bordered Card" });
    expect(card).toHaveClass("shadow-btc-2");
    expect(card).toHaveClass("border-btc-border-default");
    expect(card).toHaveClass("bg-btc-surface");
  });

  test("renders outlined variant with strong border", () => {
    render(
      <Card variant="outlined" role="region" aria-label="Outlined Card">
        Outlined
      </Card>,
    );
    const card = screen.getByRole("region", { name: "Outlined Card" });
    expect(card).toHaveClass("bg-transparent");
    expect(card).toHaveClass("border-btc-border-strong");
  });

  test("applies padding none when specified", () => {
    render(
      <Card padding="none" role="region" aria-label="No Padding Card">
        No padding
      </Card>,
    );
    const card = screen.getByRole("region", { name: "No Padding Card" });
    expect(card).not.toHaveClass("p-btc-3");
    expect(card).not.toHaveClass("p-btc-4");
    expect(card).not.toHaveClass("p-btc-6");
  });

  test("renders CardHeader with leftIcon slot", () => {
    render(
      <Card role="region" aria-label="Header with Icon Card">
        <CardHeader leftIcon={<span role="img" aria-label="star">★</span>}>
          <CardTitle>Title with Icon</CardTitle>
        </CardHeader>
      </Card>,
    );
    expect(screen.getByRole("img", { name: "star" })).toBeInTheDocument();
  });

  test("renders CardHeader with onClose button", () => {
    const handleClose = vi.fn();
    render(
      <Card role="region" aria-label="Closable Header Card">
        <CardHeader onClose={handleClose} closeAriaLabel="Cerrar tarjeta">
          <CardTitle>Closable</CardTitle>
        </CardHeader>
      </Card>,
    );
    const closeButton = screen.getByRole("button", { name: "Cerrar tarjeta" });
    expect(closeButton).toBeInTheDocument();
    expect(closeButton).toHaveClass("h-btc-8");
    expect(closeButton).toHaveClass("w-btc-8");
    expect(closeButton).toHaveClass("rounded-btc-md");
    fireEvent.click(closeButton);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  test("cardHeader aligns close button vertically centered", () => {
    render(
      <Card role="region" aria-label="Centered Close Card">
        <CardHeader onClose={() => undefined}>
          <CardTitle>Title</CardTitle>
          <CardDescription>Description text that makes the header taller</CardDescription>
        </CardHeader>
      </Card>,
    );
    const closeButton = screen.getByRole("button", { name: "Cerrar" });
    expect(closeButton).toBeInTheDocument();
    // Verify the header container uses items-center
    const card = screen.getByRole("region", { name: "Centered Close Card" });
    expect(card).toContainHTML("items-center");
  });
});

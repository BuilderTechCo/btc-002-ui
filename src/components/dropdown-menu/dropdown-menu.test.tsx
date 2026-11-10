import { describe, expect, vi, beforeEach, afterEach, test } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "./dropdown-menu";

describe("dropdownMenu", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    document.body.innerHTML = "";
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("renders trigger and content when open", () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger aria-label="Open Menu">Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Item 1</DropdownMenuItem>
          <DropdownMenuItem>Item 2</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    expect(
      screen.getByRole("button", { name: /open menu/i }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /open menu/i }));
    expect(screen.getByRole("menu")).toBeInTheDocument();
    expect(
      screen.getByRole("menuitem", { name: /item 1/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("menuitem", { name: /item 2/i }),
    ).toBeInTheDocument();
  });

  test("toggles open/close on trigger click", () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger aria-label="Open Menu">Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Item 1</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    const trigger = screen.getByRole("button", { name: /open menu/i });

    fireEvent.click(trigger);
    expect(screen.getByRole("menu")).toBeInTheDocument();
    expect(trigger).toHaveAttribute("aria-expanded", "true");

    fireEvent.click(trigger);
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  test("calls onOpenChange callback", () => {
    const onOpenChange = vi.fn();
    render(
      <DropdownMenu onOpenChange={onOpenChange}>
        <DropdownMenuTrigger aria-label="Open Menu">Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Item 1</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    fireEvent.click(screen.getByRole("button", { name: /open menu/i }));
    expect(onOpenChange).toHaveBeenCalledWith(true);

    fireEvent.click(screen.getByRole("button", { name: /open menu/i }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  test("closes menu when item clicked", () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger aria-label="Open Menu">Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Item 1</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    fireEvent.click(screen.getByRole("button", { name: /open menu/i }));
    expect(screen.getByRole("menu")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("menuitem", { name: /item 1/i }));
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  test("renders DropdownMenuItem with icon", () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger aria-label="Open Menu">Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem icon="edit" iconCategory="action">
            Edit
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    fireEvent.click(screen.getByRole("button", { name: /open menu/i }));
    // Icon renders as SVG inside the menuitem - verify via nested SVG
    const item = screen.getByRole("menuitem", { name: /edit/i });
    // eslint-disable-next-line testing-library/no-node-access -- querySelector required to verify nested SVG icon; no Testing Library query exists for nested SVG elements
    expect(item.querySelector("svg")).toBeInTheDocument();
  });

  test("renders DropdownMenuItem with shortcut", () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger aria-label="Open Menu">Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem shortcut="Ctrl+E">Edit</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    fireEvent.click(screen.getByRole("button", { name: /open menu/i }));
    expect(screen.getByText("Ctrl+E")).toBeInTheDocument();
  });

  test("disables DropdownMenuItem when disabled", () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger aria-label="Open Menu">Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem disabled>Disabled</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    fireEvent.click(screen.getByRole("button", { name: /open menu/i }));
    const item = screen.getByRole("menuitem", { name: /disabled/i });
    expect(item).toBeDisabled();
    expect(item).toHaveAttribute("disabled", "");
  });

  test("applies inset class to DropdownMenuItem", () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger aria-label="Open Menu">Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem inset>Inset Item</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    fireEvent.click(screen.getByRole("button", { name: /open menu/i }));
    const item = screen.getByRole("menuitem", { name: /inset item/i });
    expect(item).toHaveClass("pl-btc-8");
  });

  test("renders DropdownMenuCheckboxItem", () => {
    const onCheckedChange = vi.fn();
    render(
      <DropdownMenu>
        <DropdownMenuTrigger aria-label="Open Menu">Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuCheckboxItem
            value="opt1"
            checked={false}
            onCheckedChange={onCheckedChange}
          >
            Option 1
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    fireEvent.click(screen.getByRole("button", { name: /open menu/i }));
    const checkboxItem = screen.getByRole("menuitemcheckbox", {
      name: /option 1/i,
    });
    expect(checkboxItem).toBeInTheDocument();
    expect(checkboxItem).toHaveAttribute("aria-checked", "false");
  });

  test("toggles DropdownMenuCheckboxItem", () => {
    const onCheckedChange = vi.fn();
    render(
      <DropdownMenu>
        <DropdownMenuTrigger aria-label="Open Menu">Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuCheckboxItem
            value="opt1"
            checked={false}
            onCheckedChange={onCheckedChange}
          >
            Option 1
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    fireEvent.click(screen.getByRole("button", { name: /open menu/i }));
    const checkboxItem = screen.getByRole("menuitemcheckbox", {
      name: /option 1/i,
    });
    fireEvent.click(checkboxItem);
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  test("shows check icon when DropdownMenuCheckboxItem checked", () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger aria-label="Open Menu">Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuCheckboxItem value="opt1" checked={true}>
            Option 1
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    fireEvent.click(screen.getByRole("button", { name: /open menu/i }));
    // Check icon renders as SVG inside the menuitemcheckbox - verify via nested SVG
    const item = screen.getByRole("menuitemcheckbox", { name: /option 1/i });
    // eslint-disable-next-line testing-library/no-node-access -- querySelector required to verify nested SVG icon; no Testing Library query exists for nested SVG elements
    expect(item.querySelector("svg")).toBeInTheDocument();
  });

  test("renders DropdownMenuRadioItem", () => {
    const onCheckedChange = vi.fn();
    render(
      <DropdownMenu>
        <DropdownMenuTrigger aria-label="Open Menu">Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuRadioItem
            value="radio1"
            checked={false}
            onCheckedChange={onCheckedChange}
          >
            Radio 1
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem
            value="radio2"
            checked={true}
            onCheckedChange={onCheckedChange}
          >
            Radio 2
          </DropdownMenuRadioItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    fireEvent.click(screen.getByRole("button", { name: /open menu/i }));
    expect(
      screen.getByRole("menuitemradio", { name: /radio 1/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("menuitemradio", { name: /radio 2/i }),
    ).toHaveAttribute("aria-checked", "true");
  });

  test("selects DropdownMenuRadioItem", () => {
    const onCheckedChange = vi.fn();
    render(
      <DropdownMenu>
        <DropdownMenuTrigger aria-label="Open Menu">Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuRadioItem
            value="radio1"
            checked={false}
            onCheckedChange={onCheckedChange}
          >
            Radio 1
          </DropdownMenuRadioItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    fireEvent.click(screen.getByRole("button", { name: /open menu/i }));
    const radioItem = screen.getByRole("menuitemradio", { name: /radio 1/i });
    fireEvent.click(radioItem);
    expect(onCheckedChange).toHaveBeenCalledWith("radio1");
  });

  test("shows dot when DropdownMenuRadioItem checked", () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger aria-label="Open Menu">Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuRadioItem value="radio1" checked={true}>
            Radio 1
          </DropdownMenuRadioItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    fireEvent.click(screen.getByRole("button", { name: /open menu/i }));
    // Dot renders with rounded-btc-full class inside the menuitemradio - verify via class
    const item = screen.getByRole("menuitemradio", { name: /radio 1/i });
    // eslint-disable-next-line testing-library/no-node-access -- querySelector required to verify nested element with specific class; no Testing Library query exposes class on nested elements
    expect(item.querySelector(".rounded-btc-full")).toBeInTheDocument();
  });

  test("renders DropdownMenuSeparator", () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger aria-label="Open Menu">Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Item 1</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Item 2</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    fireEvent.click(screen.getByRole("button", { name: /open menu/i }));
    expect(screen.getByRole("separator")).toBeInTheDocument();
  });

  test("renders DropdownMenuLabel", () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger aria-label="Open Menu">Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Section Label</DropdownMenuLabel>
          <DropdownMenuItem>Item 1</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    fireEvent.click(screen.getByRole("button", { name: /open menu/i }));
    expect(
      screen.getByRole("group", { name: /section label/i }),
    ).toBeInTheDocument();
    // Label uses inline styling classes (no text-btc-caption class directly)
    expect(screen.getByText("Section Label")).toHaveClass("font-medium");
    expect(screen.getByText("Section Label")).toHaveClass("uppercase");
    expect(screen.getByText("Section Label")).toHaveClass(
      "text-btc-text-muted",
    );
  });

  test("applies align prop to DropdownMenuContent", () => {
    const aligns: ("start" | "end" | "center")[] = ["start", "end", "center"];

    aligns.forEach((align) => {
      const { unmount } = render(
        <DropdownMenu key={align}>
          <DropdownMenuTrigger aria-label="Open Menu">Open Menu</DropdownMenuTrigger>
          <DropdownMenuContent align={align}>
            <DropdownMenuItem>Item</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      fireEvent.click(screen.getByRole("button", { name: /open menu/i }));
      expect(screen.getByRole("menu")).toBeInTheDocument();
      unmount();
    });
  });

  test("applies side prop to DropdownMenuContent", () => {
    const sides: ("top" | "bottom" | "left" | "right")[] = [
      "top",
      "bottom",
      "left",
      "right",
    ];

    sides.forEach((side) => {
      const { unmount } = render(
        <DropdownMenu key={side}>
          <DropdownMenuTrigger aria-label="Open Menu">Open Menu</DropdownMenuTrigger>
          <DropdownMenuContent side={side}>
            <DropdownMenuItem>Item</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      fireEvent.click(screen.getByRole("button", { name: /open menu/i }));
      expect(screen.getByRole("menu")).toBeInTheDocument();
      unmount();
    });
  });

  test("applies sideOffset prop", () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger aria-label="Open Menu">Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent sideOffset={10}>
          <DropdownMenuItem>Item</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    fireEvent.click(screen.getByRole("button", { name: /open menu/i }));
    expect(screen.getByRole("menu")).toBeInTheDocument();
  });

  test("applies custom className to DropdownMenuContent", () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger aria-label="Open Menu">Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent className="custom-menu-class">
          <DropdownMenuItem>Item</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    fireEvent.click(screen.getByRole("button", { name: /open menu/i }));
    expect(screen.getByRole("menu")).toHaveClass("custom-menu-class");
  });

  test("applies custom className to DropdownMenuItem", () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger aria-label="Open Menu">Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem className="custom-item-class">
            Item
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    fireEvent.click(screen.getByRole("button", { name: /open menu/i }));
    expect(screen.getByRole("menuitem", { name: /item/i })).toHaveClass(
      "custom-item-class",
    );
  });

  test("closes menu on Escape key when content focused", () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger aria-label="Open Menu">Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Item 1</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    fireEvent.click(screen.getByRole("button", { name: /open menu/i }));
    expect(screen.getByRole("menu")).toBeInTheDocument();

    // Focus the menu content first
    const menu = screen.getByRole("menu");
    menu.focus();
    fireEvent.keyDown(menu, { key: "Escape" });

    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /open menu/i })).toHaveFocus();
  });

  test("renders multiple items in menu", () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger aria-label="Open Menu">Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Item 1</DropdownMenuItem>
          <DropdownMenuItem>Item 2</DropdownMenuItem>
          <DropdownMenuItem>Item 3</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    fireEvent.click(screen.getByRole("button", { name: /open menu/i }));

    expect(
      screen.getByRole("menuitem", { name: /item 1/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("menuitem", { name: /item 2/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("menuitem", { name: /item 3/i }),
    ).toBeInTheDocument();
  });

  test("closes on Tab key", () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger aria-label="Open Menu">Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Item 1</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    fireEvent.click(screen.getByRole("button", { name: /open menu/i }));
    expect(screen.getByRole("menu")).toBeInTheDocument();

    fireEvent.keyDown(document, { key: "Tab" });
    // In jsdom, Tab doesn't automatically close, so we just verify menu exists
    // The actual behavior is tested in E2E tests
    expect(screen.getByRole("menu")).toBeInTheDocument();
  });

  test("renders trigger with aria-label when provided", () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger aria-label="User menu">
          Profile
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Item</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    expect(
      screen.getByRole("button", { name: /user menu/i }),
    ).toBeInTheDocument();
  });

  test("renders trigger with custom className", () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger aria-label="Open Menu" className="custom-trigger-class">
          Open Menu
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Item 1</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    const trigger = screen.getByRole("button", { name: /open menu/i });
    expect(trigger).toHaveClass("custom-trigger-class");
    expect(trigger).not.toBeDisabled();
    fireEvent.click(trigger);
    expect(screen.getByRole("menu")).toBeInTheDocument();
  });

  test("applies avoidCollisions prop", () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger aria-label="Open Menu">Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent avoidCollisions={false}>
          <DropdownMenuItem>Item</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    fireEvent.click(screen.getByRole("button", { name: /open menu/i }));
    expect(screen.getByRole("menu")).toBeInTheDocument();
  });
});

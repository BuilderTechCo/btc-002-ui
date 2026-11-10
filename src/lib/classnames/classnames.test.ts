import { describe, expect, test } from "vitest";
import { clsx } from "./classnames";
import type { ClassValue } from "./classnames";

describe("lib/classnames", () => {
  describe("clsx", () => {
    test("combines multiple class strings", () => {
      expect(clsx("foo", "bar", "baz")).toBe("foo bar baz");
    });

    test("handles conditional classes", () => {
      const active = true;
      const hidden = false;
      expect(clsx("base", active && "active", hidden && "hidden")).toBe(
        "base active",
      );
    });

    test("handles object syntax", () => {
      expect(clsx({ foo: true, bar: false, baz: true })).toBe("foo baz");
    });

    test("handles array syntax", () => {
      expect(clsx(["foo", "bar", "baz"])).toBe("foo bar baz");
    });

    test("resolves tailwind conflicts with tailwind-merge (last wins)", () => {
      // p-btc-4 and p-btc-2 conflict, last should win
      expect(clsx("p-btc-4", "p-btc-2")).toBe("p-btc-2");
    });

    test("preserves btc font-size when combined with text color", () => {
      // Regresión: tailwind-merge no debe confundir tamaño y color
      expect(clsx("text-btc-body-s", "text-btc-text-secondary")).toBe(
        "text-btc-body-s text-btc-text-secondary",
      );
      expect(clsx("text-btc-h2", "text-btc-text-primary")).toBe(
        "text-btc-h2 text-btc-text-primary",
      );
    });

    test("resolves conflicting btc font sizes (last wins)", () => {
      expect(clsx("text-btc-body", "text-btc-h3")).toBe("text-btc-h3");
    });

    test("resolves multiple tailwind conflicts", () => {
      expect(clsx("bg-btc-brand text-white", "bg-btc-error")).toBe(
        "text-white bg-btc-error",
      );
    });

    test("handles empty inputs", () => {
      expect(clsx()).toBe("");
      expect(clsx("")).toBe("");
      expect(clsx(null, undefined, "")).toBe("");
    });

    test("handles mixed inputs", () => {
      expect(
        clsx("base", { active: true, disabled: false }, ["extra", "classes"]),
      ).toBe("base active extra classes");
    });

    test("preserves non-tailwind classes when no conflict", () => {
      expect(clsx("custom-class", "another-class")).toBe(
        "custom-class another-class",
      );
    });

    test("handles responsive tailwind classes", () => {
      expect(clsx("md:p-btc-4", "lg:p-btc-6")).toBe("md:p-btc-4 lg:p-btc-6");
      // Same responsive prefix - last wins
      expect(clsx("md:p-btc-4", "md:p-btc-2")).toBe("md:p-btc-2");
    });

    test("exports ClassValue type", () => {
      // Type-only test - if this compiles, the type is exported
      type TestClassValue = ClassValue;
      const val: TestClassValue = "string";
      const obj: TestClassValue = { foo: true };
      const arr: TestClassValue = ["a", "b"];
      expect([val, obj, arr]).toHaveLength(3);
    });
  });
});

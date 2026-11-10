// @buildertech/ui - ThemeToggle Component
// Toggle de tema (light/dark/system) con persistencia en localStorage

"use client";

import { useState, useEffect, type ButtonHTMLAttributes } from "react";
import { clsx } from "../../lib/classnames";
import { Icon } from "../../lib/icon";
import { Button } from "../button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../dropdown-menu";

export type Theme = "light" | "dark" | "system";

export interface ThemeToggleProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "onChange"
> {
  /** Temas disponibles */
  themes?: Theme[];

  /** Tema actual controlado */
  value?: Theme;

  /** Tema por defecto */
  defaultValue?: Theme;

  /** Callback al cambiar */
  onChange?: (theme: Theme) => void;

  /** Variante visual */
  variant?: "button" | "dropdown";

  /** Tamaño */
  size?: "sm" | "md" | "lg";

  /** Mostrar etiquetas */
  showLabels?: boolean;

  /** Clase del contenedor (para dropdown) */
  className?: string;
}

const themeIcons: Record<Theme, string> = {
  light: "sun",
  dark: "moon",
  system: "monitor",
};

const themeLabels: Record<Theme, string> = {
  light: "Claro",
  dark: "Oscuro",
  system: "Sistema",
};

const dropdownSizeClasses: Record<"sm" | "md" | "lg", string> = {
  sm: "h-btc-btn-sm px-btc-btn-px-sm text-btc-control gap-btc-1",
  md: "h-btc-btn-md px-btc-btn-px-md text-btc-control gap-btc-2",
  lg: "h-btc-btn-lg px-btc-btn-px-lg text-btc-body gap-btc-2",
};

function getSystemTheme(): "light" | "dark" {
  if (typeof window !== "undefined") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
  return "light";
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  const resolvedTheme = theme === "system" ? getSystemTheme() : theme;
  root.setAttribute("data-theme", resolvedTheme);
  localStorage.setItem("btc-theme", theme);
}

export function ThemeToggle({
  themes = ["light", "dark", "system"],
  value: controlledValue,
  defaultValue = "system",
  onChange,
  variant = "button",
  size = "md",
  showLabels = false,
  className = "",
  disabled,
  ...props
}: ThemeToggleProps) {
  const [mounted, setMounted] = useState(false);
  const [value, setValue] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("btc-theme") as Theme) ?? defaultValue;
    }
    return defaultValue;
  });

  const isControlled = controlledValue !== undefined;
  const currentValue = isControlled ? controlledValue : value;

  useEffect(() => {
    setMounted(true);
    applyTheme(currentValue);
  }, [currentValue]);

  useEffect(() => {
    if (!mounted) return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      if (value === "system") {
        applyTheme("system");
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [value, mounted]);

  function handleChange(nextTheme: Theme) {
    if (!isControlled) {
      setValue(nextTheme);
    }
    onChange?.(nextTheme);
  }

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size={size}
        disabled
        aria-label="Cargando tema..."
        className={className}
      >
        <Icon
          name="loader"
          category="status"
          size="sm"
          className="animate-spin"
          aria-hidden="true"
        />
      </Button>
    );
  }

  if (variant === "dropdown") {
    return (
      <div className={clsx("relative inline-flex", className)}>
        <DropdownMenu>
          <DropdownMenuTrigger
            disabled={disabled}
            aria-label={`Tema actual: ${themeLabels[currentValue]}`}
            className={clsx(
              "inline-flex items-center justify-center font-medium rounded-btc-md",
              "transition-btc-colors duration-btc-base ease-btc-standard",
              "bg-btc-action-ghost-bg text-btc-action-ghost-text hover:bg-btc-action-ghost-hover-bg hover:text-btc-action-ghost-hover-text",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-btc-border-focus focus-visible:ring-offset-2 focus-visible:ring-offset-btc-app",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              dropdownSizeClasses[size],
            )}
            {...props}
          >
            <Icon
              name={themeIcons[currentValue]}
              category="nav"
              size={size === "sm" ? "xs" : size === "md" ? "sm" : "md"}
              aria-hidden="true"
            />
            {showLabels && (
              <span className="hidden sm:inline">
                {themeLabels[currentValue]}
              </span>
            )}
            <Icon
              name="chevronDown"
              category="nav"
              size="xs"
              aria-hidden="true"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-40">
            {themes.map((theme) => {
              const isActive = currentValue === theme;
              return (
                <DropdownMenuItem
                  key={theme}
                  icon={themeIcons[theme]}
                  iconCategory="nav"
                  role="menuitemradio"
                  aria-checked={isActive}
                  onSelect={() => handleChange(theme)}
                  className={clsx(isActive && "bg-btc-raised")}
                >
                  <span className="flex w-full items-center justify-between gap-btc-2">
                    {themeLabels[theme]}
                    {isActive && (
                      <Icon
                        name="check"
                        category="action"
                        size="xs"
                        aria-hidden="true"
                      />
                    )}
                  </span>
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  // Button variant - cycle through themes
  const currentIndex = themes.indexOf(currentValue);
  const nextTheme = themes[(currentIndex + 1) % themes.length] ?? "system";

  return (
    <Button
      variant="ghost"
      size={size}
      disabled={disabled}
      onClick={() => handleChange(nextTheme)}
      aria-label={`Tema actual: ${themeLabels[currentValue]}. Click para cambiar a ${themeLabels[nextTheme]}`}
      className={clsx("gap-btc-1", className)}
      {...props}
    >
      <Icon
        name={themeIcons[currentValue]}
        category="nav"
        size={size === "sm" ? "xs" : "sm"}
        aria-hidden="true"
      />
      {showLabels && (
        <span className="hidden sm:inline">{themeLabels[currentValue]}</span>
      )}
    </Button>
  );
}

/** Export types (ya exportados arriba) */

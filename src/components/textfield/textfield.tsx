// @buildertech/ui - TextField Component
// Input accesible con label, error, help, icon, clearable, password toggle
// Variantes: default, filled, outline | Tamaños: sm, md, lg

"use client";

import {
  forwardRef,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
  useState,
  type ChangeEvent,
  type InputHTMLAttributes,
} from "react";
import { clsx } from "../../lib/classnames";
import { Icon } from "../../lib/icon";

export type TextFieldVariant = "default" | "filled" | "outline";
export type TextFieldSize = "sm" | "md" | "lg";

export interface TextFieldProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "size" | "onChange"
> {
  /** Label del input */
  label?: string;

  /** Placeholder */
  placeholder?: string;

  /** Valor controlado */
  value?: string;

  /** Valor por defecto (no controlado) */
  defaultValue?: string;

  /** Callback al cambiar */
  onChange?: (value: string, e: ChangeEvent<HTMLInputElement>) => void;

  /** Tipo de input */
  type?: "text" | "email" | "password" | "number" | "tel" | "url" | "search";

  /** Variante visual */
  variant?: TextFieldVariant;

  /** Tamaño */
  size?: TextFieldSize;

  /** Estado de error */
  error?: boolean;

  /** Mensaje de error */
  errorMessage?: string;

  /** Texto de ayuda */
  helpText?: string;

  /** Icono a la izquierda */
  leftIcon?: string;

  /** Categoría del icono izquierdo */
  leftIconCategory?: "nav" | "action" | "status" | "empty";

  /** Icono a la derecha (ej: ojo para password) */
  rightIcon?: string;

  /** Categoría del icono derecho */
  rightIconCategory?: "nav" | "action" | "status" | "empty";

  /** Permitir limpiar valor */
  clearable?: boolean;

  /** Mostrar toggle password (si type=password) */
  showPasswordToggle?: boolean;

  /** Deshabilitado */
  disabled?: boolean;

  /** Solo lectura */
  readOnly?: boolean;

  /** Requerido */
  required?: boolean;

  /** Nombre del campo */
  name?: string;

  /** ID personalizado */
  id?: string;

  /** Clases adicionales */
  className?: string;
}

const variantClasses: Record<TextFieldVariant, string> = {
  default:
    "bg-btc-surface border border-btc-border-default hover:border-btc-border-strong",
  filled:
    "bg-btc-raised border border-transparent hover:border-btc-border-default",
  outline:
    "bg-transparent border border-btc-border-strong hover:border-btc-border-focus",
};

const sizeClasses: Record<TextFieldSize, string> = {
  sm: "h-btc-btn-sm px-btc-btn-px-sm text-btc-control",
  md: "h-btc-btn-md px-btc-btn-px-md text-btc-control",
  lg: "h-btc-btn-lg px-btc-btn-px-lg text-btc-body",
};

const leftPadding: Record<TextFieldSize, string> = {
  sm: "pl-btc-8",
  md: "pl-btc-12",
  lg: "pl-btc-12",
};

const rightPadding: Record<TextFieldSize, string> = {
  sm: "pr-btc-8",
  md: "pr-btc-12",
  lg: "pr-btc-12",
};

const iconSizeMap: Record<TextFieldSize, "xs" | "sm" | "md"> = {
  sm: "xs",
  md: "sm",
  lg: "md",
};

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      label,
      placeholder,
      value,
      defaultValue,
      onChange,
      type = "text",
      variant = "default",
      size = "md",
      error = false,
      errorMessage,
      helpText,
      leftIcon,
      leftIconCategory = "action",
      rightIcon,
      rightIconCategory = "action",
      clearable = false,
      showPasswordToggle = false,
      disabled = false,
      readOnly = false,
      required = false,
      name,
      id: providedId,
      className = "",
      ...props
    },
    ref,
  ) => {
    const generatedId = useId();
    const id = providedId ?? generatedId;
    const errorId = `${id}-error`;
    const helpId = `${id}-help`;
    const inputRef = useRef<HTMLInputElement>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [hasValue, setHasValue] = useState(!!(value ?? defaultValue));

    useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

    useEffect(() => {
      if (value !== undefined) {
        setHasValue(value !== "");
      }
    }, [value]);

    const inputType =
      type === "password" && showPasswordToggle
        ? showPassword
          ? "text"
          : "password"
        : type;
    const showClear = clearable && hasValue && !disabled && !readOnly;
    const hasSuffixButton =
      showClear || (type === "password" && showPasswordToggle);

    function handleChange(e: ChangeEvent<HTMLInputElement>) {
      const newValue = e.target.value;
      setHasValue(newValue !== "");
      onChange?.(newValue, e);
    }

    function handleClear() {
      if (inputRef.current) {
        inputRef.current.value = "";
        inputRef.current.focus();
      }
      setHasValue(false);
      onChange?.("", {
        currentTarget: { value: "" },
      } as ChangeEvent<HTMLInputElement>);
    }

    function handlePasswordToggle() {
      setShowPassword((current) => !current);
    }

    const describedBy =
      [error && errorMessage && errorId, helpText && !error && helpId]
        .filter(Boolean)
        .join(" ") || undefined;

    return (
      <div className={clsx("w-full", className)}>
        {label && (
          <label
            htmlFor={id}
            className="block text-btc-control font-medium text-btc-text-primary mb-btc-1"
          >
            {label}
            {required && (
              <span className="text-btc-error ml-btc-1" aria-hidden="true">
                *
              </span>
            )}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-btc-3 pointer-events-none text-btc-text-muted">
              <Icon
                name={leftIcon}
                category={leftIconCategory}
                size={iconSizeMap[size]}
                aria-hidden="true"
              />
            </div>
          )}

          <input
            ref={inputRef}
            id={id}
            name={name}
            type={inputType}
            value={value}
            defaultValue={defaultValue}
            onChange={handleChange}
            placeholder={placeholder}
            disabled={disabled}
            readOnly={readOnly}
            required={required}
            aria-describedby={describedBy}
            aria-invalid={error}
            aria-readonly={readOnly}
            className={clsx(
              "w-full appearance-none rounded-btc-md",
              "text-btc-text-primary placeholder:text-btc-text-muted",
              "transition-btc-colors duration-btc-base ease-btc-standard",
              "focus:outline-none focus:ring-2 focus:ring-btc-border-focus focus:border-btc-border-focus",
              "disabled:bg-btc-raised/50 disabled:opacity-60 disabled:cursor-not-allowed",
              "read-only:bg-btc-raised/40",
              variantClasses[variant],
              sizeClasses[size],
              leftIcon && leftPadding[size],
              (rightIcon || hasSuffixButton) && rightPadding[size],
              error &&
                "border-btc-error hover:border-btc-error focus:ring-btc-error focus:border-btc-error",
            )}
            {...props}
          />

          {showClear && (
            <button
              type="button"
              onClick={handleClear}
              className={clsx(
                "absolute inset-y-0 right-btc-3 flex items-center px-btc-1",
                "rounded-btc-sm text-btc-text-muted hover:text-btc-text-primary",
                "transition-btc-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-btc-border-focus",
              )}
              aria-label="Limpiar"
            >
              <Icon
                name="close"
                category="action"
                size={iconSizeMap[size]}
                aria-hidden="true"
              />
            </button>
          )}

          {type === "password" && showPasswordToggle && (
            <button
              type="button"
              onClick={handlePasswordToggle}
              className={clsx(
                "absolute inset-y-0 right-btc-3 flex items-center px-btc-1",
                "rounded-btc-sm text-btc-text-muted hover:text-btc-text-primary",
                "transition-btc-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-btc-border-focus",
              )}
              aria-label={
                showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
              }
            >
              <Icon
                name={showPassword ? "eyeOff" : "eye"}
                category="action"
                size={iconSizeMap[size]}
                aria-hidden="true"
              />
            </button>
          )}

          {rightIcon &&
            !showClear &&
            !(type === "password" && showPasswordToggle) && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-btc-3 pointer-events-none text-btc-text-muted">
                <Icon
                  name={rightIcon}
                  category={rightIconCategory}
                  size={iconSizeMap[size]}
                  aria-hidden="true"
                />
              </div>
            )}
        </div>

        {error && errorMessage && (
          <p
            id={errorId}
            className="mt-btc-1 text-btc-caption text-btc-error"
            role="alert"
          >
            {errorMessage}
          </p>
        )}

        {helpText && !error && (
          <p
            id={helpId}
            className="mt-btc-1 text-btc-caption text-btc-text-muted"
          >
            {helpText}
          </p>
        )}
      </div>
    );
  },
);

TextField.displayName = "TextField";

/** Export types (ya exportados arriba) */

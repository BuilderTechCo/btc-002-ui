// @buildertech/ui - Select Component
// Select nativo accesible + combobox/listbox propio para búsqueda y múltiple
// Tamaños: sm, md, lg | Estados: error, disabled, loading

"use client";

import {
  forwardRef,
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
  type MouseEvent,
  type SelectHTMLAttributes,
} from "react";
import { clsx } from "../../lib/classnames";
import { Icon } from "../../lib/icon";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  group?: string;
}

export interface SelectGroup {
  label: string;
  options: SelectOption[];
}

// Type guard to distinguish SelectGroup from SelectOption
function isSelectGroup(opt: SelectOption | SelectGroup): opt is SelectGroup {
  return "options" in opt;
}

export type SelectSide = "left" | "right";
export type SelectAlign = "start" | "center" | "end";

interface SelectBaseProps extends Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  "size" | "onChange" | "value" | "defaultValue" | "multiple"
> {
  /** Opciones (array plano o agrupadas) */
  options: SelectOption[] | SelectGroup[];

  /** Placeholder cuando no hay selección */
  placeholder?: string;

  /** Permitir múltiples selecciones */
  multiple?: boolean;

  /** Permitir limpiar selección */
  clearable?: boolean;

  /** Mostrar búsqueda/filtrado */
  searchable?: boolean;

  /** Texto cuando no hay resultados */
  noResultsText?: string;

  /** Tamaño */
  size?: "sm" | "md" | "lg";

  /** Estado de error */
  error?: boolean;

  /** Mensaje de error */
  errorMessage?: string;

  /** Label para accesibilidad */
  label?: string;

  /** ID del label asociado */
  labelId?: string;

  /** Descripción de ayuda */
  helpText?: string;

  /** Deshabilitado */
  disabled?: boolean;

  /** Estado de carga */
  loading?: boolean;

  /** Nombre del campo (para forms) */
  name?: string;

  /** Requerido */
  required?: boolean;
}

export interface SingleSelectProps extends SelectBaseProps {
  multiple?: false;
  /** Valor controlado */
  value?: string;
  /** Valor por defecto (no controlado) */
  defaultValue?: string;
  /** Callback al cambiar */
  onChange?: (value: string) => void;
}

export interface MultipleSelectProps extends SelectBaseProps {
  multiple: true;
  /** Valores controlados */
  value?: string[];
  /** Valores por defecto (no controlado) */
  defaultValue?: string[];
  /** Callback al cambiar */
  onChange?: (values: string[]) => void;
}

export type SelectProps = SingleSelectProps | MultipleSelectProps;

const sizeClasses = {
  sm: "h-btc-btn-sm px-btc-btn-px-sm text-btc-control",
  md: "h-btc-btn-md px-btc-btn-px-md text-btc-control",
  lg: "h-btc-btn-lg px-btc-btn-px-lg text-btc-body",
};

const multipleSizeClasses = {
  sm: "min-h-btc-btn-sm px-btc-btn-px-sm py-btc-1 text-btc-caption",
  md: "min-h-btc-btn-md px-btc-btn-px-md py-btc-1 text-btc-control",
  lg: "min-h-btc-btn-lg px-btc-btn-px-lg py-btc-1 text-btc-body",
};

const controlClasses = [
  "w-full appearance-none rounded-btc-md border bg-btc-surface",
  "text-btc-text-primary",
  "transition-btc-colors duration-btc-base ease-btc-standard",
  "hover:border-btc-border-strong",
  "focus:outline-none focus:ring-2 focus:ring-btc-border-focus focus:border-btc-border-focus",
  "disabled:opacity-50 disabled:cursor-not-allowed",
];

function flattenOptions(
  options: SelectOption[] | SelectGroup[],
): SelectOption[] {
  const result: SelectOption[] = [];
  for (const opt of options) {
    if (isSelectGroup(opt)) {
      result.push(...opt.options);
    } else {
      result.push(opt);
    }
  }
  return result;
}

function normalizeValues(value: string | string[] | undefined): string[] {
  if (Array.isArray(value)) return value;
  return value ? [value] : [];
}

function matchesQuery(option: SelectOption, query: string): boolean {
  if (!query) return true;
  const normalized = query.toLowerCase();
  return (
    option.label.toLowerCase().includes(normalized) ||
    option.value.toLowerCase().includes(normalized)
  );
}

interface FilteredGroup {
  label?: string;
  options: { option: SelectOption; index: number }[];
}

function buildFilteredGroups(
  options: SelectOption[] | SelectGroup[],
  query: string,
): FilteredGroup[] {
  const groups: FilteredGroup[] = [];
  let index = 0;

  for (const entry of options) {
    if (isSelectGroup(entry)) {
      const filtered = entry.options
        .filter((option) => matchesQuery(option, query))
        .map((option) => ({ option, index: index++ }));
      if (filtered.length > 0) {
        groups.push({ label: entry.label, options: filtered });
      }
    } else if (matchesQuery(entry, query)) {
      const lastGroup = groups.at(-1);
      if (lastGroup && lastGroup.label === undefined) {
        lastGroup.options.push({ option: entry, index: index++ });
      } else {
        groups.push({ options: [{ option: entry, index: index++ }] });
      }
    }
  }

  return groups;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (props, ref) => {
    const {
      options,
      placeholder = "Seleccionar...",
      value,
      defaultValue,
      onChange,
      multiple = false,
      clearable = false,
      searchable = false,
      noResultsText = "Sin resultados",
      size = "md",
      error = false,
      errorMessage,
      label,
      labelId,
      helpText,
      disabled = false,
      loading = false,
      name,
      required = false,
      className = "",
      id: providedId,
      ...rest
    } = props;

    const isMultiple = multiple === true;
    const generatedId = useId();
    const id = providedId ?? generatedId;
    const errorId = `${id}-error`;
    const helpId = `${id}-help`;
    const labelDomId = labelId ?? `${id}-label`;
    const listboxId = `${id}-listbox`;
    const searchId = `${id}-search`;
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeIndex, setActiveIndex] = useState(0);
    const [internalValue, setInternalValue] = useState<string | string[]>(() =>
      isMultiple ? normalizeValues(defaultValue) : (defaultValue ?? ""),
    );
    const selectRef = useRef<HTMLSelectElement | null>(null);
    const triggerRef = useRef<HTMLElement | null>(null);
    const searchRef = useRef<HTMLInputElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    function setSelectNode(node: HTMLSelectElement | null) {
      selectRef.current = node;
      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    }

    const isControlled = value !== undefined;
    const currentValue: string | string[] = isControlled
      ? value
      : internalValue;
    const selectedValues = isMultiple
      ? normalizeValues(currentValue)
      : normalizeValues(currentValue).slice(0, 1);
    const singleValue = isMultiple ? "" : (selectedValues[0] ?? "");
    const allOptions = flattenOptions(options);
    const selectedOption = allOptions.find(
      (option) => option.value === singleValue,
    );
    const selectedOptions = allOptions.filter((option) =>
      selectedValues.includes(option.value),
    );
    const hasSelection = isMultiple
      ? selectedValues.length > 0
      : singleValue !== "";
    const showClear = clearable && hasSelection && !disabled && !loading;
    const isDisabled = disabled || loading;

    // El combobox propio se usa para búsqueda (single) y siempre en múltiple.
    const useCustomCombobox = searchable || isMultiple;
    const useSearchInput = searchable;
    const filteredGroups = useCustomCombobox
      ? buildFilteredGroups(options, searchQuery)
      : [];
    const filteredOptions = filteredGroups.flatMap((group) =>
      group.options.map((entry) => entry.option),
    );
    const activeOption = filteredOptions[activeIndex];
    const activeDescendant =
      isOpen && activeOption ? `${id}-option-${activeIndex}` : undefined;

    const emitChange = onChange as
      ((nextValue: string | string[]) => void) | undefined;

    function commitValue(nextValue: string | string[]) {
      if (!isControlled) {
        setInternalValue(nextValue);
      }
      emitChange?.(nextValue);
    }

    function handleNativeChange(e: ChangeEvent<HTMLSelectElement>) {
      if (isMultiple) {
        const nextValues = Array.from(e.target.selectedOptions).map(
          (option) => option.value,
        );
        commitValue(nextValues);
        return;
      }
      commitValue(e.target.value);
    }

    function focusTrigger() {
      triggerRef.current?.focus();
    }

    function handleClear(e: MouseEvent) {
      e.stopPropagation();
      e.preventDefault();
      commitValue(isMultiple ? [] : "");
      selectRef.current?.focus();
      focusTrigger();
    }

    function openCombobox() {
      if (isDisabled) return;
      setSearchQuery("");
      setActiveIndex(0);
      setIsOpen(true);
    }

    function closeCombobox({ focus = true }: { focus?: boolean } = {}) {
      setIsOpen(false);
      setSearchQuery("");
      if (focus) {
        focusTrigger();
      }
    }

    function selectOption(option: SelectOption) {
      if (option.disabled) return;

      if (isMultiple) {
        const nextValues = selectedValues.includes(option.value)
          ? selectedValues.filter((selected) => selected !== option.value)
          : [...selectedValues, option.value];
        commitValue(nextValues);
        return;
      }

      commitValue(option.value);
      closeCombobox();
    }

    function removeValue(valueToRemove: string, e?: MouseEvent) {
      e?.stopPropagation();
      e?.preventDefault();
      commitValue(
        selectedValues.filter((selected) => selected !== valueToRemove),
      );
      focusTrigger();
    }

    function toggleOpen() {
      if (isDisabled) return;
      if (isOpen) {
        closeCombobox({ focus: false });
      } else {
        openCombobox();
      }
    }

    function moveActiveIndex(delta: number) {
      setActiveIndex((index) =>
        Math.min(
          Math.max(index + delta, 0),
          Math.max(filteredOptions.length - 1, 0),
        ),
      );
    }

    function handleTriggerKeyDown(e: KeyboardEvent<HTMLElement>) {
      if (isDisabled) return;

      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        if (!isOpen) {
          openCombobox();
        } else {
          moveActiveIndex(e.key === "ArrowDown" ? 1 : -1);
        }
        return;
      }

      if (e.key === "Home" && isOpen) {
        e.preventDefault();
        setActiveIndex(0);
        return;
      }

      if (e.key === "End" && isOpen) {
        e.preventDefault();
        setActiveIndex(Math.max(filteredOptions.length - 1, 0));
        return;
      }

      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        if (!isOpen) {
          openCombobox();
        } else if (activeOption) {
          selectOption(activeOption);
        }
        return;
      }

      if (e.key === "Escape" && isOpen) {
        e.preventDefault();
        closeCombobox();
        return;
      }

      if (
        e.key === "Backspace" &&
        isMultiple &&
        !useSearchInput &&
        selectedValues.length > 0
      ) {
        e.preventDefault();
        const lastValue = selectedValues.at(-1);
        if (lastValue !== undefined) removeValue(lastValue);
        return;
      }

      if (e.key === "Tab" && isOpen) {
        closeCombobox({ focus: false });
      }
    }

    function handleSearchKeyDown(e: KeyboardEvent<HTMLInputElement>) {
      if (e.key === "Escape") {
        e.preventDefault();
        closeCombobox();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        moveActiveIndex(1);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        moveActiveIndex(-1);
      } else if (e.key === "Home") {
        e.preventDefault();
        setActiveIndex(0);
      } else if (e.key === "End") {
        e.preventDefault();
        setActiveIndex(Math.max(filteredOptions.length - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (activeOption) selectOption(activeOption);
      } else if (
        e.key === "Backspace" &&
        isMultiple &&
        searchQuery === "" &&
        selectedValues.length > 0
      ) {
        const lastValue = selectedValues.at(-1);
        if (lastValue !== undefined) removeValue(lastValue);
      } else if (e.key === "Tab") {
        closeCombobox({ focus: false });
      }
    }

    useEffect(() => {
      if (!isOpen) return;

      function handleClickOutside(event: Event) {
        if (
          wrapperRef.current &&
          !wrapperRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
        }
      }

      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    useEffect(() => {
      if (isOpen && useSearchInput) {
        searchRef.current?.focus();
      }
    }, [isOpen, useSearchInput]);

    useEffect(() => {
      if (!isOpen) return;
      document
        .getElementById(`${id}-option-${activeIndex}`)
        ?.scrollIntoView?.({ block: "nearest" });
    }, [activeIndex, id, isOpen]);

    const describedBy =
      [error && errorMessage && errorId, helpText && helpId]
        .filter(Boolean)
        .join(" ") || undefined;

    const borderClasses = error
      ? "border-btc-error hover:border-btc-error focus:ring-btc-error focus:border-btc-error"
      : "border-btc-border-default";

    function renderListboxOption({
      option,
      index,
    }: {
      option: SelectOption;
      index: number;
    }) {
      const isSelected = selectedValues.includes(option.value);
      return (
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events -- el teclado se gestiona en el combobox con aria-activedescendant
        <li
          key={option.value}
          id={`${id}-option-${index}`}
          role="option"
          aria-selected={isSelected}
          aria-disabled={option.disabled || undefined}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => selectOption(option)}
          onMouseEnter={() => setActiveIndex(index)}
          className={clsx(
            "flex w-full cursor-pointer items-center justify-between gap-btc-2 rounded-btc-sm px-btc-3 py-btc-2 text-left text-btc-body-s transition-btc-colors",
            option.disabled && "cursor-not-allowed opacity-50",
            index === activeIndex && !option.disabled && "bg-btc-raised",
            isSelected ? "text-btc-brand" : "text-btc-text-primary",
          )}
        >
          <span className="truncate">{option.label}</span>
          {isSelected && (
            <Icon name="check" category="action" size="xs" aria-hidden="true" />
          )}
        </li>
      );
    }

    return (
      <div ref={wrapperRef} className={clsx("relative w-full", className)}>
        {label && (
          <label
            id={labelDomId}
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

        {useCustomCombobox ? (
          <div className="relative">
            {isMultiple ? (
              <div
                ref={(node) => {
                  triggerRef.current = node;
                }}
                id={id}
                role="combobox"
                tabIndex={isDisabled ? -1 : 0}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                aria-controls={isOpen ? listboxId : undefined}
                aria-activedescendant={activeDescendant}
                aria-labelledby={label ? labelDomId : undefined}
                aria-describedby={describedBy}
                aria-invalid={error}
                aria-required={required || undefined}
                aria-disabled={isDisabled || undefined}
                onClick={toggleOpen}
                onKeyDown={handleTriggerKeyDown}
                className={clsx(
                  controlClasses,
                  borderClasses,
                  multipleSizeClasses[size],
                  "flex items-center gap-btc-2 text-left",
                  isDisabled && "opacity-50 cursor-not-allowed",
                )}
              >
                <span className="flex min-w-0 flex-1 flex-wrap items-center gap-btc-1">
                  {selectedOptions.length === 0 ? (
                    <span className="truncate text-btc-text-muted">
                      {placeholder}
                    </span>
                  ) : (
                    selectedOptions.map((option) => (
                      <span
                        key={option.value}
                        className="inline-flex max-w-full items-center gap-btc-1 rounded-btc-sm bg-btc-raised px-btc-2 py-btc-1 text-btc-caption text-btc-text-primary"
                      >
                        <span className="truncate">{option.label}</span>
                        <button
                          type="button"
                          onClick={(e) => removeValue(option.value, e)}
                          onMouseDown={(e) => e.preventDefault()}
                          className="inline-flex size-4 shrink-0 items-center justify-center rounded-btc-full text-btc-text-muted hover:bg-btc-border-default hover:text-btc-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-btc-border-focus"
                          aria-label={`Quitar ${option.label}`}
                        >
                          <Icon
                            name="close"
                            category="action"
                            size="xs"
                            aria-hidden="true"
                          />
                        </button>
                      </span>
                    ))
                  )}
                </span>

                <span className="flex shrink-0 items-center gap-btc-1">
                  {showClear && (
                    <button
                      type="button"
                      onClick={handleClear}
                      onMouseDown={(e) => e.preventDefault()}
                      className="inline-flex size-5 items-center justify-center rounded-btc-sm text-btc-text-muted hover:text-btc-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-btc-border-focus"
                      aria-label="Limpiar selección"
                    >
                      <Icon
                        name="close"
                        category="action"
                        size="xs"
                        aria-hidden="true"
                      />
                    </button>
                  )}
                  {loading ? (
                    <svg
                      className="animate-spin text-btc-text-muted"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden="true"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="3"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                  ) : (
                    <Icon
                      name="chevronDown"
                      category="nav"
                      size="sm"
                      aria-hidden="true"
                    />
                  )}
                </span>
              </div>
            ) : (
              <button
                ref={(node) => {
                  triggerRef.current = node;
                }}
                id={id}
                type="button"
                role="combobox"
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                aria-controls={isOpen ? listboxId : undefined}
                aria-activedescendant={activeDescendant}
                aria-labelledby={label ? labelDomId : undefined}
                aria-describedby={describedBy}
                aria-invalid={error}
                aria-required={required || undefined}
                disabled={isDisabled}
                onClick={toggleOpen}
                onKeyDown={handleTriggerKeyDown}
                className={clsx(
                  controlClasses,
                  borderClasses,
                  sizeClasses[size],
                  "flex items-center gap-btc-2 text-left",
                  showClear ? "pr-btc-12" : "pr-btc-8",
                  !selectedOption && "text-btc-text-muted",
                  isDisabled && "opacity-50 cursor-not-allowed",
                )}
              >
                <span className="flex-1 truncate">
                  {selectedOption ? selectedOption.label : placeholder}
                </span>
              </button>
            )}

            {!isMultiple && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-btc-3 pointer-events-none">
                {loading ? (
                  <svg
                    className="animate-spin text-btc-text-muted"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="3"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                ) : (
                  !showClear && (
                    <Icon
                      name="chevronDown"
                      category="nav"
                      size="sm"
                      aria-hidden="true"
                    />
                  )
                )}
              </div>
            )}

            {!isMultiple && showClear && (
              <button
                type="button"
                onClick={handleClear}
                onMouseDown={(e) => e.preventDefault()}
                className="absolute inset-y-0 right-btc-8 flex items-center px-btc-1 rounded-btc-sm text-btc-text-muted hover:text-btc-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-btc-border-focus"
                aria-label="Limpiar selección"
              >
                <Icon
                  name="close"
                  category="action"
                  size="xs"
                  aria-hidden="true"
                />
              </button>
            )}

            {/* Select nativo oculto: mantiene name/value para formularios */}
            <select
              ref={setSelectNode}
              name={name}
              value={isMultiple ? selectedValues : singleValue}
              onChange={handleNativeChange}
              disabled={isDisabled}
              required={required}
              multiple={isMultiple}
              tabIndex={-1}
              aria-hidden="true"
              role="presentation"
              className="sr-only"
            >
              {!isMultiple && placeholder && (
                <option value="">{placeholder}</option>
              )}
              {renderOptions(options)}
            </select>

            {isOpen && (
              <div className="absolute left-0 right-0 z-btc-dropdown mt-btc-1 overflow-hidden rounded-btc-md border border-btc-border-default bg-btc-surface shadow-btc-3 animate-zoom-in">
                {useSearchInput && (
                  <div className="border-b border-btc-border-subtle p-btc-2">
                    <input
                      ref={searchRef}
                      id={searchId}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setActiveIndex(0);
                      }}
                      onKeyDown={handleSearchKeyDown}
                      placeholder="Buscar..."
                      aria-label="Buscar opciones"
                      aria-controls={listboxId}
                      aria-activedescendant={activeDescendant}
                      className="w-full rounded-btc-sm border border-btc-border-default bg-btc-surface px-btc-2 py-btc-1 text-btc-control text-btc-text-primary placeholder:text-btc-text-muted focus:outline-none focus:ring-2 focus:ring-btc-border-focus focus:border-btc-border-focus"
                    />
                  </div>
                )}

                <ul
                  id={listboxId}
                  role="listbox"
                  aria-label={label ? `${label} opciones` : "Opciones"}
                  aria-multiselectable={isMultiple || undefined}
                  className="max-h-60 overflow-y-auto p-btc-1"
                >
                  {filteredOptions.length === 0 ? (
                    <li
                      role="presentation"
                      className="p-btc-4 text-center text-btc-body-s text-btc-text-muted"
                    >
                      {noResultsText}
                    </li>
                  ) : (
                    filteredGroups.map((group, groupIndex) => (
                      <li key={`group-${groupIndex}`} role="presentation">
                        {group.label && (
                          <div
                            role="presentation"
                            className="px-btc-3 pb-btc-1 pt-btc-2 text-btc-caption font-medium text-btc-text-muted"
                          >
                            {group.label}
                          </div>
                        )}
                        <ul role="presentation">
                          {group.options.map(renderListboxOption)}
                        </ul>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <div className="relative">
            <select
              ref={setSelectNode}
              id={id}
              name={name}
              value={singleValue}
              onChange={handleNativeChange}
              disabled={isDisabled}
              required={required}
              aria-labelledby={label ? labelDomId : undefined}
              aria-describedby={describedBy}
              aria-invalid={error}
              className={clsx(
                controlClasses,
                borderClasses,
                sizeClasses[size],
                "pr-btc-8",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                isDisabled && "opacity-50 cursor-not-allowed",
              )}
              {...rest}
            >
              {placeholder && (
                <option value="" disabled>
                  {placeholder}
                </option>
              )}
              {renderOptions(options)}
            </select>

            <div className="absolute inset-y-0 right-0 flex items-center pr-btc-3 pointer-events-none">
              {loading ? (
                <svg
                  className="animate-spin text-btc-text-muted"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="3"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              ) : (
                !showClear && (
                  <Icon
                    name="chevronDown"
                    category="nav"
                    size="sm"
                    aria-hidden="true"
                  />
                )
              )}
            </div>

            {showClear && (
              <button
                type="button"
                onClick={handleClear}
                onMouseDown={(e) => e.preventDefault()}
                className="absolute inset-y-0 right-btc-3 flex items-center px-btc-1 rounded-btc-sm text-btc-text-muted hover:text-btc-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-btc-border-focus"
                aria-label="Limpiar selección"
              >
                <Icon
                  name="close"
                  category="action"
                  size="xs"
                  aria-hidden="true"
                />
              </button>
            )}
          </div>
        )}

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

function renderOptions(options: SelectOption[] | SelectGroup[]) {
  return options.map((opt, index) => {
    if (isSelectGroup(opt)) {
      return (
        <optgroup key={`group-${index}`} label={opt.label}>
          {opt.options.map((o, i) => (
            <option
              key={`${opt.label}-${i}`}
              value={o.value}
              disabled={o.disabled}
            >
              {o.label}
            </option>
          ))}
        </optgroup>
      );
    }
    return (
      <option key={opt.value} value={opt.value} disabled={opt.disabled}>
        {opt.label}
      </option>
    );
  });
}

Select.displayName = "Select";

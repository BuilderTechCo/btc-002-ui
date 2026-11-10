// @buildertech/ui - Table Component
// Tabla accesible con: sort, selección, acciones, sticky header, responsive, empty/loading states
// Variantes: default, striped, bordered | Tamaños: sm, md, lg

import { type ReactNode } from "react";
import { clsx } from "../../lib/classnames";
import { Icon } from "../../lib/icon";
import { Skeleton } from "../skeleton";

export type TableVariant = "default" | "striped" | "bordered";
export type TableSize = "sm" | "md" | "lg";

export interface TableColumn<T = Record<string, unknown>> {
  key: string;
  header: string;
  accessor?: keyof T | ((row: T) => ReactNode);
  width?: string;
  minWidth?: string;
  align?: "left" | "center" | "right";
  sortable?: boolean;
  render?: (value: unknown, row: T, index: number) => ReactNode;
}

export interface TableProps<T = Record<string, unknown>> {
  /** Columnas de la tabla */
  columns: TableColumn<T>[];

  /** Datos a mostrar */
  data: T[];

  /** Clave única por fila (requerida para selección) */
  rowKey?: keyof T | ((row: T) => string) | "id";

  /** Variante visual */
  variant?: TableVariant;

  /** Tamaño */
  size?: TableSize;

  /** Permitir ordenación */
  sortable?: boolean;

  /** Columna ordenada actualmente */
  sortColumn?: string;

  /** Dirección de ordenación */
  sortDirection?: "asc" | "desc";

  /** Callback al ordenar */
  onSort?: (column: string, direction: "asc" | "desc") => void;

  /** Permitir selección de filas */
  selectable?: boolean;

  /** Filas seleccionadas */
  selectedRows?: string[];

  /** Callback al cambiar selección */
  onSelectionChange?: (selectedKeys: string[]) => void;

  /** Renderizar acciones por fila */
  renderActions?: (row: T, index: number) => ReactNode;

  /** Estado vacío */
  emptyState?: ReactNode;

  /** Estado de carga */
  loading?: boolean;

  /** Número de filas skeleton en loading */
  loadingRows?: number;

  /** Header fijo (sticky) */
  stickyHeader?: boolean;

  /** Responsive (scroll horizontal en mobile) */
  responsive?: boolean;

  /** Caption para accesibilidad */
  caption?: string;

  /** Clases adicionales */
  className?: string;
}

const variantClasses: Record<TableVariant, string> = {
  default: "",
  striped: "even:bg-btc-raised/50",
  bordered: "border-btc-border-default",
};

const sizeClasses: Record<TableSize, string> = {
  sm: "text-btc-caption",
  md: "text-btc-body-s",
  lg: "text-btc-body",
};

const cellPadding: Record<TableSize, string> = {
  sm: "px-btc-3 py-btc-2",
  md: "px-btc-4 py-btc-3",
  lg: "px-btc-4 py-btc-4",
};

export function Table<T = Record<string, unknown>>({
  columns,
  data,
  rowKey = "id",
  variant = "default",
  size = "md",
  sortable = false,
  sortColumn,
  sortDirection = "asc",
  onSort,
  selectable = false,
  selectedRows = [],
  onSelectionChange,
  renderActions,
  emptyState,
  loading = false,
  loadingRows = 5,
  stickyHeader = false,
  responsive = true,
  caption,
  className = "",
}: TableProps<T>) {
  const getRowKey = (row: T): string => {
    if (typeof rowKey === "function") return rowKey(row);
    return String(row[rowKey as keyof T]);
  };

  const isSelected = (row: T): boolean => selectedRows.includes(getRowKey(row));
  const isAllSelected = data.length > 0 && data.every(isSelected);
  const isIndeterminate = data.some(isSelected) && !isAllSelected;

  const handleSelectAll = () => {
    if (isAllSelected) {
      onSelectionChange?.([]);
    } else {
      onSelectionChange?.(data.map(getRowKey));
    }
  };

  const handleRowSelect = (row: T) => {
    const key = getRowKey(row);
    const newSelected = isSelected(row)
      ? selectedRows.filter((k) => k !== key)
      : [...selectedRows, key];
    onSelectionChange?.(newSelected);
  };

  const handleSort = (columnKey: string) => {
    if (!onSort) return;
    const newDirection =
      sortColumn === columnKey && sortDirection === "asc" ? "desc" : "asc";
    onSort(columnKey, newDirection);
  };

  if (loading) {
    return (
      <div
        className={clsx("overflow-x-auto", responsive && "w-full", className)}
      >
        <table className={clsx("w-full border-collapse", sizeClasses[size])}>
          <thead className={clsx(stickyHeader && "sticky top-0 z-btc-sticky")}>
            <tr className="border-b border-btc-border-default bg-btc-surface">
              {selectable && (
                <th className={clsx(cellPadding[size], "w-10 text-center")} />
              )}
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={clsx(
                    cellPadding[size],
                    "font-medium text-btc-text-primary",
                    "text-left",
                    sortable &&
                      col.sortable &&
                      "cursor-pointer select-none hover:bg-btc-raised",
                    col.align === "center" && "text-center",
                    col.align === "right" && "text-right",
                  )}
                  style={{ width: col.width, minWidth: col.minWidth }}
                >
                  {col.header}
                </th>
              ))}
              {renderActions && (
                <th className={clsx(cellPadding[size], "w-32 text-right")}>
                  Acciones
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: loadingRows }).map((_, i) => (
              <tr
                key={`skeleton-${i}`}
                className={clsx(
                  variantClasses[variant],
                  "border-b border-btc-border-subtle",
                )}
              >
                {selectable && (
                  <td className={clsx(cellPadding[size])}>
                    <Skeleton variant="rect" className="w-4 h-4 mx-auto" />
                  </td>
                )}
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={clsx(
                      cellPadding[size],
                      col.align === "center" && "text-center",
                      col.align === "right" && "text-right",
                    )}
                  >
                    <Skeleton variant="text" lines={1} className="w-24" />
                  </td>
                ))}
                {renderActions && (
                  <td className={clsx(cellPadding[size])}>
                    <Skeleton variant="text" lines={1} className="w-20" />
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div
        className={clsx("overflow-x-auto", responsive && "w-full", className)}
      >
        <table className={clsx("w-full border-collapse", sizeClasses[size])}>
          <thead className={clsx(stickyHeader && "sticky top-0 z-btc-sticky")}>
            <tr className="border-b border-btc-border-default bg-btc-surface">
              {selectable && <th className={clsx(cellPadding[size], "w-10")} />}
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={clsx(
                    cellPadding[size],
                    "font-medium text-btc-text-primary",
                  )}
                >
                  {col.header}
                </th>
              ))}
              {renderActions && (
                <th className={clsx(cellPadding[size])}>Acciones</th>
              )}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td
                colSpan={
                  columns.length +
                  (selectable ? 1 : 0) +
                  (renderActions ? 1 : 0)
                }
                className="p-btc-8 text-center text-btc-text-muted"
              >
                {emptyState ?? "Sin datos para mostrar"}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className={clsx("overflow-x-auto", responsive && "w-full", className)}>
      <table className={clsx("w-full border-collapse", sizeClasses[size])}>
        {caption && <caption className="sr-only">{caption}</caption>}
        <thead className={clsx(stickyHeader && "sticky top-0 z-btc-sticky")}>
          <tr className="border-b border-btc-border-default bg-btc-surface">
            {selectable && (
              <th className={clsx(cellPadding[size], "w-10 text-center")}>
                <input
                  type="checkbox"
                  ref={(el) => {
                    if (el) el.indeterminate = isIndeterminate;
                  }}
                  checked={isAllSelected}
                  onChange={handleSelectAll}
                  aria-label="Seleccionar todas las filas"
                  className="size-4 cursor-pointer rounded-btc-sm border-btc-border-default accent-btc-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-btc-border-focus"
                />
              </th>
            )}
            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                className={clsx(
                  cellPadding[size],
                  "font-medium text-btc-text-primary",
                  "text-left",
                  col.align === "center" && "text-center",
                  col.align === "right" && "text-right",
                )}
                style={{ width: col.width, minWidth: col.minWidth }}
                aria-sort={
                  sortable && col.sortable
                    ? sortColumn === col.key
                      ? sortDirection === "asc"
                        ? "ascending"
                        : "descending"
                      : "none"
                    : undefined
                }
              >
                {sortable && col.sortable ? (
                  <button
                    type="button"
                    onClick={() => handleSort(col.key)}
                    className={clsx(
                      "flex w-full cursor-pointer select-none items-center gap-btc-1 rounded-btc-sm text-left",
                      "hover:text-btc-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-btc-border-focus",
                    )}
                  >
                    {col.header}
                    {sortColumn === col.key && (
                      <Icon
                        name={
                          sortDirection === "asc" ? "chevronUp" : "chevronDown"
                        }
                        category="nav"
                        size="xs"
                        aria-hidden="true"
                      />
                    )}
                  </button>
                ) : (
                  <div className="flex items-center gap-btc-1">
                    {col.header}
                  </div>
                )}
              </th>
            ))}
            {renderActions && (
              <th className={clsx(cellPadding[size], "w-32 text-right")}>
                Acciones
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => {
            const key = getRowKey(row);
            const rowSelected = isSelected(row);

            return (
              <tr
                key={key}
                className={clsx(
                  variantClasses[variant],
                  "border-b border-btc-border-subtle",
                  "hover:bg-btc-raised/50 transition-btc-colors",
                  rowSelected && "bg-btc-brand/5",
                )}
              >
                {selectable && (
                  <td className={clsx(cellPadding[size], "text-center")}>
                    <input
                      type="checkbox"
                      checked={rowSelected}
                      onChange={() => handleRowSelect(row)}
                      onClick={(e) => e.stopPropagation()}
                      aria-label={`Seleccionar fila ${rowIndex + 1}`}
                      className="size-4 cursor-pointer rounded-btc-sm border-btc-border-default accent-btc-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-btc-border-focus"
                    />
                  </td>
                )}
                {columns.map((col) => {
                  let value: unknown;
                  if (col.accessor) {
                    if (typeof col.accessor === "function") {
                      value = col.accessor(row);
                    } else {
                      value = row[col.accessor];
                    }
                  }
                  return (
                    <td
                      key={col.key}
                      className={clsx(
                        cellPadding[size],
                        col.align === "center" && "text-center",
                        col.align === "right" && "text-right",
                      )}
                    >
                      {col.render
                        ? col.render(value, row, rowIndex)
                        : (value as ReactNode)}
                    </td>
                  );
                })}
                {renderActions && (
                  <td className={clsx(cellPadding[size], "text-right")}>
                    <div className="flex items-center justify-end gap-btc-1">
                      {renderActions(row, rowIndex)}
                    </div>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

Table.displayName = "Table";

/** Export types (ya exportados arriba) */

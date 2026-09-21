import type { ReactTable, Row, RowData } from "@tanstack/react-table"

import type { DataTableFeatures } from "./features"
import type { SelectionDescriptor } from "./types"

function toCsvValue(value: unknown): string {
  if (value == null) return ""
  const text = String(value)
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
}

/**
 * Client-mode export: `rows` are already-loaded `Row` objects, so this can
 * serialize them directly. Skips the `select` and `actions` display columns
 * data-table's own markup adds - every other visible column is exported
 * under its `meta.label` (falling back to the column id).
 */
export function rowsToCsv<TData extends RowData>(
  table: ReactTable<DataTableFeatures, TData>,
  rows: Row<DataTableFeatures, TData>[]
): string {
  const columns = table
    .getVisibleLeafColumns()
    .filter((column) => column.id !== "select" && column.id !== "actions")

  const header = columns
    .map((column) => toCsvValue(column.columnDef.meta?.label ?? column.id))
    .join(",")

  const lines = rows.map((row) =>
    columns.map((column) => toCsvValue(row.getValue(column.id))).join(",")
  )

  return [header, ...lines].join("\n")
}

export function downloadCsv(csv: string, filename = "export.csv") {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

/**
 * Server mode has no full filtered dataset on the client to serialize - the
 * app implements this to fetch and stream/download the matching rows itself,
 * given the same include/exclude selection descriptor bulk actions use.
 */
export type ServerCsvExportHandler = (
  selection: SelectionDescriptor
) => void | Promise<void>

"use client"

import * as React from "react"
import {
  functionalUpdate,
  useTable,
  type OnChangeFn,
  type RowData,
  type Updater,
} from "@tanstack/react-table"

import { dataTableFeatures } from "./features"
import type {
  ColumnFiltersState,
  DataTableColumnDef,
  DataTableMode,
  PaginationState,
  SortingState,
} from "./types"
import { useControllableState } from "./use-controllable-state"

export { dataTableFeatures }

const EMPTY_SORTING: SortingState = []
const EMPTY_FILTERS: ColumnFiltersState = []
const DEFAULT_PAGINATION: PaginationState = { pageIndex: 0, pageSize: 20 }

export type UseDataTableOptions<TData extends RowData> = {
  data: TData[]
  columns: DataTableColumnDef<TData>[]
  /**
   * `"server"` (default) trusts `data` as already sorted/filtered/paginated
   * and expects the `on*Change` callbacks to drive a refetch. `"client"`
   * lets TanStack Table do all three over the full `data` array.
   */
  mode?: DataTableMode
  /** Required in `"server"` mode - the total row count across all pages. */
  rowCount?: number
  getRowId?: (row: TData, index: number) => string

  sorting?: SortingState
  onSortingChange?: (sorting: SortingState) => void
  enableMultiSort?: boolean

  columnFilters?: ColumnFiltersState
  onColumnFiltersChange?: (filters: ColumnFiltersState) => void

  globalFilter?: string
  onGlobalFilterChange?: (value: string) => void

  pagination?: PaginationState
  onPaginationChange?: (pagination: PaginationState) => void

  columnVisibility?: Record<string, boolean>
  onColumnVisibilityChange?: (visibility: Record<string, boolean>) => void
}

/** Adapts a (value, setter) pair to TanStack's `Updater`-accepting `on*Change` shape. */
function toChangeHandler<T>(
  current: T,
  set: (next: T) => void
): OnChangeFn<T> {
  return (updater: Updater<T>) => set(functionalUpdate(updater, current))
}

export function useDataTable<TData extends RowData>({
  data,
  columns,
  mode = "server",
  rowCount,
  getRowId,
  sorting: sortingProp,
  onSortingChange,
  enableMultiSort = true,
  columnFilters: columnFiltersProp,
  onColumnFiltersChange,
  globalFilter: globalFilterProp,
  onGlobalFilterChange,
  pagination: paginationProp,
  onPaginationChange,
  columnVisibility: columnVisibilityProp,
  onColumnVisibilityChange,
}: UseDataTableOptions<TData>) {
  const [sorting, setSorting] = useControllableState(
    sortingProp,
    EMPTY_SORTING,
    onSortingChange
  )
  const [columnFilters, setColumnFilters] = useControllableState(
    columnFiltersProp,
    EMPTY_FILTERS,
    onColumnFiltersChange
  )
  const [globalFilter, setGlobalFilter] = useControllableState(
    globalFilterProp,
    "",
    onGlobalFilterChange
  )
  const [pagination, setPagination] = useControllableState(
    paginationProp,
    DEFAULT_PAGINATION,
    onPaginationChange
  )
  const [columnVisibility, setColumnVisibility] = useControllableState(
    columnVisibilityProp,
    {},
    onColumnVisibilityChange
  )

  const manual = mode === "server"

  const table = useTable({
    features: dataTableFeatures,
    data,
    columns,
    getRowId,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      pagination,
      columnVisibility,
    },
    onSortingChange: toChangeHandler(sorting, setSorting),
    onColumnFiltersChange: toChangeHandler(columnFilters, setColumnFilters),
    onGlobalFilterChange: toChangeHandler(globalFilter, setGlobalFilter),
    onPaginationChange: toChangeHandler(pagination, setPagination),
    onColumnVisibilityChange: toChangeHandler(
      columnVisibility,
      setColumnVisibility
    ),
    enableMultiSort,
    globalFilterFn: "includesString",
    manualSorting: manual,
    manualFiltering: manual,
    manualPagination: manual,
    rowCount: manual ? (rowCount ?? 0) : undefined,
  })

  return table
}

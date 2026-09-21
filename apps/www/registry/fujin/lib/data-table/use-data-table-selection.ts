"use client"

import * as React from "react"

import type { SelectionDescriptor } from "./types"

export type UseDataTableSelectionOptions = {
  /** Row ids currently loaded for this page, in display order. */
  pageRowIds: string[]
  value?: SelectionDescriptor
  onChange?: (selection: SelectionDescriptor) => void
}

const EMPTY_SELECTION: SelectionDescriptor = { type: "include", ids: [] }

/**
 * Shopify-style selection: an "include" set until "select all N" is chosen,
 * at which point it flips to "exclude" - every row matching the current
 * filters except whatever gets unchecked afterwards. `selectedCount` and
 * every helper here understand both shapes so callers never branch on
 * `selection.type` themselves.
 */
export function useDataTableSelection({
  pageRowIds,
  value,
  onChange,
}: UseDataTableSelectionOptions) {
  const [internal, setInternal] =
    React.useState<SelectionDescriptor>(EMPTY_SELECTION)
  const isControlled = value !== undefined
  const selection = isControlled ? value : internal

  const set = React.useCallback(
    (next: SelectionDescriptor) => {
      if (!isControlled) setInternal(next)
      onChange?.(next)
    },
    [isControlled, onChange]
  )

  const isRowSelected = React.useCallback(
    (rowId: string) =>
      selection.type === "include"
        ? selection.ids.includes(rowId)
        : !selection.ids.includes(rowId),
    [selection]
  )

  const selectedCount =
    selection.type === "include"
      ? selection.ids.length
      : Math.max(selection.total - selection.ids.length, 0)

  const isAllPageRowsSelected =
    pageRowIds.length > 0 && pageRowIds.every(isRowSelected)
  const isSomePageRowsSelected =
    !isAllPageRowsSelected && pageRowIds.some(isRowSelected)

  const toggleRow = React.useCallback(
    (rowId: string, checked: boolean) => {
      if (selection.type === "include") {
        const ids = checked
          ? [...new Set([...selection.ids, rowId])]
          : selection.ids.filter((id) => id !== rowId)
        set({ type: "include", ids })
      } else {
        const ids = checked
          ? selection.ids.filter((id) => id !== rowId)
          : [...new Set([...selection.ids, rowId])]
        set({ type: "exclude", ids, total: selection.total })
      }
    },
    [selection, set]
  )

  const togglePage = React.useCallback(
    (checked: boolean) => {
      if (selection.type === "include") {
        const ids = checked
          ? [...new Set([...selection.ids, ...pageRowIds])]
          : selection.ids.filter((id) => !pageRowIds.includes(id))
        set({ type: "include", ids })
      } else {
        const ids = checked
          ? selection.ids.filter((id) => !pageRowIds.includes(id))
          : [...new Set([...selection.ids, ...pageRowIds])]
        set({ type: "exclude", ids, total: selection.total })
      }
    },
    [selection, pageRowIds, set]
  )

  /** "Select all {total} items" - every row matching the filters, nothing excluded yet. */
  const selectAllMatching = React.useCallback(
    (total: number) => set({ type: "exclude", ids: [], total }),
    [set]
  )

  const clear = React.useCallback(
    () => set({ type: "include", ids: [] }),
    [set]
  )

  return {
    selection,
    selectedCount,
    isRowSelected,
    isAllPageRowsSelected,
    isSomePageRowsSelected,
    toggleRow,
    togglePage,
    selectAllMatching,
    clear,
  }
}

export type UseDataTableSelectionResult = ReturnType<
  typeof useDataTableSelection
>

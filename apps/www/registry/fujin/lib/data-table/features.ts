import {
  columnFacetingFeature,
  columnFilteringFeature,
  columnVisibilityFeature,
  createFacetedRowModel,
  createFacetedUniqueValues,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFn_arrIncludesSome,
  filterFn_inNumberRange,
  filterFn_includesString,
  filterFn_weakEquals,
  globalFilteringFeature,
  rowPaginationFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_datetime,
  tableFeatures,
} from "@tanstack/react-table"

/*
 * The one, fixed feature set every data-table instance registers. Row
 * selection is deliberately not a TanStack feature here - it is owned
 * entirely by `use-data-table-selection.ts`'s cross-page selection
 * descriptor, which TanStack's loaded-rows-only `RowSelectionState` can't
 * represent on its own. Pinning, resizing, reordering and grouping are v1
 * non-goals (see docs/data-table-plan.md) and are not registered.
 */
export const dataTableFeatures = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns: { alphanumeric: sortFn_alphanumeric, datetime: sortFn_datetime },
  columnFilteringFeature,
  filteredRowModel: createFilteredRowModel(),
  filterFns: {
    includesString: filterFn_includesString,
    weakEquals: filterFn_weakEquals,
    arrIncludesSome: filterFn_arrIncludesSome,
    inNumberRange: filterFn_inNumberRange,
  },
  globalFilteringFeature,
  columnFacetingFeature,
  facetedRowModel: createFacetedRowModel(),
  facetedUniqueValues: createFacetedUniqueValues(),
  rowPaginationFeature,
  paginatedRowModel: createPaginatedRowModel(),
  columnVisibilityFeature,
})

export type DataTableFeatures = typeof dataTableFeatures

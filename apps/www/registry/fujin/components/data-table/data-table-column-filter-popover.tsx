"use client"

import * as React from "react"

import type { FilterOption } from "@/registry/fujin/lib/data-table/types"
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
  CommandPopup,
  CommandTrigger,
} from "@/registry/fujin/ui/command"

export type DataTableColumnFilterPopoverProps = {
  label: string
  selectedValues: string[]
  onValuesChange: (values: string[]) => void
  open: boolean
  onOpenChange: (open: boolean) => void
  query: string
  onQueryChange: (query: string) => void
  options: FilterOption[]
  loading: boolean
  children: React.ReactNode
  triggerClassName?: string
}

/**
 * The reusable half of both entry points the plan calls for: the unified
 * search bar's value-picker step and a column header's click-to-filter
 * popover both render this, seeded with the same `getColumnOptions` and
 * writing to the same filter state - one filter, two ways to reach it.
 * Data fetching lives in the caller (`data-table-filter-pill`,
 * `data-table-column-header`) since each seeds `selectedValues` differently.
 */
function DataTableColumnFilterPopover({
  label,
  selectedValues,
  onValuesChange,
  open,
  onOpenChange,
  query,
  onQueryChange,
  options,
  loading,
  children,
  triggerClassName,
}: DataTableColumnFilterPopoverProps) {
  const selectedOptions: FilterOption[] = selectedValues.map(
    (value) =>
      options.find((option) => option.value === value) ?? {
        value,
        label: value,
      }
  )

  return (
    <Command
      items={options}
      multiple
      value={selectedOptions}
      isItemEqualToValue={(a: FilterOption, b: FilterOption) =>
        a.value === b.value
      }
      inputValue={query}
      onInputValueChange={onQueryChange}
      filter={() => true}
      open={open}
      onOpenChange={onOpenChange}
      onValueChange={(values: FilterOption[]) =>
        onValuesChange(values.map((option) => option.value))
      }
    >
      <CommandTrigger className={triggerClassName}>{children}</CommandTrigger>
      <CommandPopup>
        <CommandInput placeholder={`Filter by ${label}...`} />
        {loading ? (
          <div className="py-6 text-center text-sm text-muted-foreground">
            Loading...
          </div>
        ) : (
          <>
            <CommandEmpty>No matching values.</CommandEmpty>
            <CommandList>
              {(option: FilterOption) => (
                <CommandItem key={option.value} value={option}>
                  {option.label}
                  {option.count != null ? (
                    <span className="ml-auto text-xs text-muted-foreground">
                      {option.count}
                    </span>
                  ) : null}
                </CommandItem>
              )}
            </CommandList>
          </>
        )}
      </CommandPopup>
    </Command>
  )
}

/** Fetches a column's options whenever the popover is open and the query changes. */
function useColumnFilterOptions(
  columnId: string,
  query: string,
  open: boolean,
  getColumnOptions: (
    columnId: string,
    query?: string
  ) => Promise<FilterOption[]>
) {
  const [options, setOptions] = React.useState<FilterOption[]>([])
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    if (!open) return
    let cancelled = false
    setLoading(true)
    Promise.resolve(getColumnOptions(columnId, query))
      .then((result) => {
        if (!cancelled) setOptions(result)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [open, query, columnId, getColumnOptions])

  return { options, loading }
}

export { DataTableColumnFilterPopover, useColumnFilterOptions }

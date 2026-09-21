"use client"

import * as React from "react"
import { ChevronLeftIcon, ChevronRightIcon, SearchIcon } from "lucide-react"

import type { FilterableColumn } from "@/registry/fujin/lib/data-table/use-data-table-filters"
import type { FilterOption } from "@/registry/fujin/lib/data-table/types"
import { cn } from "@/registry/fujin/lib/utils"
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
  CommandPopup,
} from "@/registry/fujin/ui/command"

type PickerItem =
  | { kind: "column"; column: FilterableColumn }
  | { kind: "search"; query: string }

export type DataTableFilterComboboxProps = {
  /** Filterable columns that don't already have an active pill. */
  columns: FilterableColumn[]
  getColumnOptions: (columnId: string, query?: string) => Promise<FilterOption[]>
  setFilterValue: (columnId: string, value: string[]) => void
  onGlobalSearch: (query: string) => void
  className?: string
}

/**
 * The Shopify-style search bar: type to get column suggestions, pick one to
 * see its values, multi-select values to build a filter, or press Enter on
 * free text to run a plain search. This only ever creates a *new* filter -
 * editing an existing one happens on its pill (`data-table-filter-pill`).
 */
function DataTableFilterCombobox({
  columns,
  getColumnOptions,
  setFilterValue,
  onGlobalSearch,
  className,
}: DataTableFilterComboboxProps) {
  const [query, setQuery] = React.useState("")
  const [pickedColumnId, setPickedColumnId] = React.useState<string | null>(
    null
  )
  const [options, setOptions] = React.useState<FilterOption[]>([])
  const [loadingOptions, setLoadingOptions] = React.useState(false)

  const pickedColumn = columns.find((column) => column.id === pickedColumnId)

  React.useEffect(() => {
    if (!pickedColumnId) return
    let cancelled = false
    setLoadingOptions(true)
    Promise.resolve(getColumnOptions(pickedColumnId, query))
      .then((result) => {
        if (!cancelled) setOptions(result)
      })
      .finally(() => {
        if (!cancelled) setLoadingOptions(false)
      })
    return () => {
      cancelled = true
    }
  }, [pickedColumnId, query, getColumnOptions])

  const goBack = React.useCallback(() => {
    setPickedColumnId(null)
    setOptions([])
    setQuery("")
  }, [])

  const pickerItems = React.useMemo<PickerItem[]>(() => {
    const normalizedQuery = query.trim().toLowerCase()
    const matches = normalizedQuery
      ? columns.filter((column) =>
          column.label.toLowerCase().includes(normalizedQuery)
        )
      : columns
    const items: PickerItem[] = matches.map((column) => ({
      kind: "column",
      column,
    }))
    if (query.trim()) items.push({ kind: "search", query: query.trim() })
    return items
  }, [columns, query])

  if (pickedColumnId) {
    return (
      <Command
        key={pickedColumnId}
        items={options}
        multiple
        defaultValue={[]}
        isItemEqualToValue={(a: FilterOption, b: FilterOption) =>
          a.value === b.value
        }
        inputValue={query}
        onInputValueChange={setQuery}
        filter={() => true}
        onValueChange={(values: FilterOption[]) => {
          if (values.length > 0) {
            setFilterValue(
              pickedColumnId,
              values.map((option) => option.value)
            )
          }
        }}
        onOpenChange={(open) => {
          if (!open) goBack()
        }}
      >
        <div
          className={cn(
            "flex h-7 min-w-40 flex-1 items-center gap-1",
            className
          )}
        >
          <button
            type="button"
            aria-label="Back to filters"
            onClick={goBack}
            className="flex size-5 shrink-0 items-center justify-center rounded-xs text-muted-foreground outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ChevronLeftIcon className="size-4" />
          </button>
          <CommandInput
            bare
            placeholder={`Filter by ${pickedColumn?.label ?? ""}...`}
            onKeyDown={(event) => {
              if (event.key === "Backspace" && query === "") goBack()
            }}
          />
        </div>
        <CommandPopup>
          {loadingOptions ? (
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

  return (
    <Command
      items={pickerItems}
      inputValue={query}
      onInputValueChange={setQuery}
      filter={() => true}
      onValueChange={(item: PickerItem | null) => {
        if (!item) return
        if (item.kind === "search") {
          onGlobalSearch(item.query)
          setQuery("")
        } else {
          setPickedColumnId(item.column.id)
          setQuery("")
        }
      }}
    >
      <CommandInput
        bare
        placeholder="Search or filter..."
        className={cn("min-w-40 flex-1", className)}
      />
      <CommandPopup>
        <CommandEmpty>No results.</CommandEmpty>
        <CommandList>
          {(item: PickerItem) =>
            item.kind === "search" ? (
              <CommandItem key="__search__" value={item} showIndicator={false}>
                <SearchIcon className="opacity-60" />
                Search for &quot;{item.query}&quot;
              </CommandItem>
            ) : (
              <CommandItem
                key={item.column.id}
                value={item}
                showIndicator={false}
              >
                {item.column.label}
                <ChevronRightIcon className="ml-auto opacity-60" />
              </CommandItem>
            )
          }
        </CommandList>
      </CommandPopup>
    </Command>
  )
}

export { DataTableFilterCombobox }

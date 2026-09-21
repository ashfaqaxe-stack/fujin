import * as React from "react"

/**
 * Every piece of data-table state (sorting, filters, pagination, search,
 * column visibility) works both controlled (server mode - the app owns the
 * value and fetches on change) and uncontrolled (client mode - data-table
 * owns it). This is the one pattern behind all of them.
 */
export function useControllableState<T>(
  value: T | undefined,
  defaultValue: T,
  onChange?: (value: T) => void
): [T, (next: T) => void] {
  const [internal, setInternal] = React.useState(defaultValue)
  const isControlled = value !== undefined
  const current = isControlled ? value : internal

  const set = React.useCallback(
    (next: T) => {
      if (!isControlled) setInternal(next)
      onChange?.(next)
    },
    [isControlled, onChange]
  )

  return [current, set]
}

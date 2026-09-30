"use client"

import * as React from "react"
import { OTPField as OTPFieldPrimitive } from "@base-ui/react/otp-field"
import { MinusIcon } from "lucide-react"

import { cn } from "@/registry/fujin/lib/utils"

/*
 * Differences from shadcn/ui's InputOTP, all deliberate:
 * - Built on Base UI's OTPField: every slot is a real <input>, so there is no
 *   invisible overlay input, the caret is native, and full-code paste,
 *   `autocomplete="one-time-code"` and SMS autofill work out of the box.
 * - Slots are 40px (above the 24px WCAG 2.5.8 minimum) with a solid focus ring.
 * - `OTPFieldGroup` visually joins slots the way shadcn's InputOTPGroup does;
 *   slots outside a group render as separate boxes.
 */

type OTPFieldProps = OTPFieldPrimitive.Root.Props

function OTPField({ className, ...props }: OTPFieldProps) {
  return (
    <OTPFieldPrimitive.Root
      data-slot="otp-field"
      className={cn(
        "flex items-center gap-2 has-[:disabled]:opacity-50",
        className
      )}
      {...props}
    />
  )
}

function OTPFieldGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="otp-field-group"
      className={cn(
        "flex items-center",
        "[&>[data-slot=otp-field-input]]:rounded-none [&>[data-slot=otp-field-input]:not(:first-child)]:-ml-px",
        "[&>[data-slot=otp-field-input]:first-child]:rounded-l-md [&>[data-slot=otp-field-input]:last-child]:rounded-r-md",
        "[&>[data-slot=otp-field-input]:focus-visible]:z-10",
        className
      )}
      {...props}
    />
  )
}

type OTPFieldInputProps = OTPFieldPrimitive.Input.Props

function OTPFieldInput({ className, ...props }: OTPFieldInputProps) {
  return (
    <OTPFieldPrimitive.Input
      data-slot="otp-field-input"
      className={cn(
        "relative size-10 min-w-0 rounded-md border border-input bg-transparent p-0 text-center font-mono text-base font-medium text-foreground shadow-xs transition-[color,background-color,border-color,box-shadow] outline-none selection:bg-primary selection:text-primary-foreground disabled:cursor-not-allowed dark:bg-input/30",
        // Solid ring: meets the 3:1 non-text contrast requirement (WCAG 1.4.11).
        "focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring",
        "aria-invalid:border-destructive aria-invalid:focus-visible:ring-destructive data-[invalid]:border-destructive",
        className
      )}
      {...props}
    />
  )
}

function OTPFieldSeparator({
  className,
  children,
  ...props
}: OTPFieldPrimitive.Separator.Props) {
  return (
    <OTPFieldPrimitive.Separator
      data-slot="otp-field-separator"
      className={cn(
        "flex items-center text-muted-foreground [&_svg]:size-4",
        className
      )}
      {...props}
    >
      {children ?? <MinusIcon aria-hidden />}
    </OTPFieldPrimitive.Separator>
  )
}

export {
  OTPField,
  OTPFieldGroup,
  OTPFieldInput,
  OTPFieldSeparator,
  type OTPFieldProps,
  type OTPFieldInputProps,
}

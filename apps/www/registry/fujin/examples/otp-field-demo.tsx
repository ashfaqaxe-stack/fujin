"use client"

import * as React from "react"

import {
  OTPField,
  OTPFieldGroup,
  OTPFieldInput,
  OTPFieldSeparator,
} from "@/registry/fujin/ui/otp-field"

export default function OTPFieldDemo() {
  const id = React.useId()

  return (
    <div className="flex flex-col items-center gap-2">
      <label htmlFor={id} className="text-sm font-medium">
        Verification code
      </label>
      <OTPField id={id} length={6}>
        <OTPFieldGroup>
          <OTPFieldInput />
          <OTPFieldInput aria-label="Character 2 of 6" />
          <OTPFieldInput aria-label="Character 3 of 6" />
        </OTPFieldGroup>
        <OTPFieldSeparator />
        <OTPFieldGroup>
          <OTPFieldInput aria-label="Character 4 of 6" />
          <OTPFieldInput aria-label="Character 5 of 6" />
          <OTPFieldInput aria-label="Character 6 of 6" />
        </OTPFieldGroup>
      </OTPField>
    </div>
  )
}

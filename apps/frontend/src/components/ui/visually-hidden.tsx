import * as React from "react"
import { cn } from "@/lib/utils"

interface VisuallyHiddenProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode
}

export function VisuallyHidden({ className, children, ...props }: VisuallyHiddenProps) {
  return (
    <span
      className={cn(
        "sr-only",
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}

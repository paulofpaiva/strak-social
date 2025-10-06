import * as React from "react"
import { cn } from "@/lib/utils"

interface FloatingInputProps extends React.ComponentProps<"input"> {
  label: string
  hintRight?: React.ReactNode
}

export function FloatingInput({ className, label, hintRight, id, ...props }: FloatingInputProps) {
  const inputId = id || React.useId()

  return (
    <div className="relative">
      <input
        id={inputId}
        placeholder=" "
        className={cn(
          "peer h-10 w-full rounded-sm border border-input bg-transparent px-4 pt-10 pb-8 text-base md:text-base",
          "text-foreground placeholder:text-transparent focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] transition-[color,box-shadow] outline-none",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "dark:bg-input/30",
          className
        )}
        {...props}
      />
      <label
        htmlFor={inputId}
        className={cn(
          "pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-all",
          "peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base",
          "peer-focus:top-3 peer-focus:text-xs",
          "peer-not-placeholder-shown:top-4 peer-not-placeholder-shown:text-xs"
        )}
      >
        {label}
      </label>

      {hintRight && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {hintRight}
        </div>
      )}
    </div>
  )
}



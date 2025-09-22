import * as React from "react"
import { cn } from "@/lib/utils"

interface FloatingTextareaProps extends React.ComponentProps<"textarea"> {
  label: string
}

export function FloatingTextarea({ className, label, id, rows = 4, ...props }: FloatingTextareaProps) {
  const textareaId = id || React.useId()

  return (
    <div className="relative">
      <textarea
        id={textareaId}
        placeholder=" "
        rows={rows}
        className={cn(
          "peer w-full rounded-sm border border-input bg-transparent px-4 pt-6 pb-3 text-base md:text-base",
          "text-foreground placeholder:text-transparent focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] transition-[color,box-shadow] outline-none",
          "disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30 resize-none",
          className
        )}
        {...props}
      />
      <label
        htmlFor={textareaId}
        className={cn(
          "pointer-events-none absolute left-4 top-4 text-muted-foreground transition-all",
          "peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base",
          "peer-focus:top-3 peer-focus:translate-y-0 peer-focus:text-xs",
          "peer-not-placeholder-shown:top-3 peer-not-placeholder-shown:translate-y-0 peer-not-placeholder-shown:text-xs"
        )}
      >
        {label}
      </label>
    </div>
  )
}



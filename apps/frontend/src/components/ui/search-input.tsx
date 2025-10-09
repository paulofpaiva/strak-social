import * as React from "react"
import { cn } from "@/lib/utils"
import { Search } from "lucide-react"

interface SearchInputProps extends Omit<React.ComponentProps<"input">, 'onChange'> {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function SearchInput({ 
  className, 
  value, 
  onChange, 
  placeholder = "Search...",
  ...props 
}: SearchInputProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "w-full h-10 pl-10 pr-4 rounded-full border border-border bg-background",
          "text-foreground placeholder:text-muted-foreground",
          "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-primary",
          "hover:border-ring/50 transition-colors",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      />
    </div>
  )
}

import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-11 w-full min-w-0 rounded-lg border border-input bg-background px-3.5 py-2 text-base transition-[border-color,box-shadow,background-color] duration-200 outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-[15px] file:font-medium file:text-foreground placeholder:text-muted-foreground/75 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/20 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-muted/50 disabled:opacity-60 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/15 dark:bg-input/20 motion-reduce:transition-none",
        className
      )}
      {...props}
    />
  )
}

export { Input }

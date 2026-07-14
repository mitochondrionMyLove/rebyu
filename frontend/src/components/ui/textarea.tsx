import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-28 w-full rounded-lg border border-input bg-background px-3.5 py-3 text-base leading-relaxed transition-[border-color,box-shadow,background-color] duration-200 outline-none placeholder:text-muted-foreground/75 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/20 disabled:cursor-not-allowed disabled:bg-muted/50 disabled:opacity-60 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/15 dark:bg-input/20 motion-reduce:transition-none",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }

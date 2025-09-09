import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive active:scale-95 hover:shadow-md",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 hover:shadow-lg",
        destructive:
          "bg-destructive text-white shadow-sm hover:bg-destructive/90 hover:shadow-lg focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border-2 bg-background shadow-sm hover:bg-accent hover:text-accent-foreground hover:border-accent dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 hover:shadow-lg",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
        primary:
          "bg-red-500 text-white shadow-sm hover:bg-red-600 hover:shadow-lg focus-visible:ring-red-500/20",
        success:
          "bg-green-500 text-white shadow-sm hover:bg-green-600 hover:shadow-lg focus-visible:ring-green-500/20",
      },
      size: {
        xs: "h-8 px-2 text-xs gap-1 min-w-[32px] md:h-7 md:px-2",
        sm: "h-9 px-3 text-sm gap-1.5 min-w-[36px] md:h-8 md:px-2.5",
        default: "h-11 px-4 py-2 text-sm min-w-[44px] md:h-10 md:px-4 has-[>svg]:px-3",
        lg: "h-12 px-6 text-base gap-2 min-w-[48px] md:h-11 md:px-5 has-[>svg]:px-4",
        xl: "h-14 px-8 text-lg gap-3 min-w-[56px] md:h-12 md:px-6",
        icon: "size-11 min-w-[44px] min-h-[44px] md:size-10",
        "icon-sm": "size-9 min-w-[36px] min-h-[36px] md:size-8",
        "icon-lg": "size-12 min-w-[48px] min-h-[48px] md:size-11",
      },
      priority: {
        primary: "relative z-10",
        secondary: "relative z-5",
        tertiary: "relative z-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      priority: "secondary",
    },
  }
)

function Button({
  className,
  variant,
  size,
  priority,
  asChild = false,
  children,
  ...props
}) {
  const Comp = asChild ? Slot : "button"

  return (
    (<Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, priority, className }))}
      aria-label={props['aria-label'] || (typeof children === 'string' ? children : undefined)}
      {...props}>
      {children}
    </Comp>)
  );
}

export { Button, buttonVariants }

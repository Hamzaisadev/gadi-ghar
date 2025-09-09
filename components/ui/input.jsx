import * as React from "react";
import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";

const inputVariants = cva(
  "flex w-full min-w-0 rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-all outline-none file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
  {
    variants: {
      variant: {
        default:
          "border-input file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30",
        error:
          "border-destructive bg-destructive/5 text-destructive placeholder:text-destructive/60 focus-visible:ring-destructive/20",
        success:
          "border-green-500 bg-green-50 dark:bg-green-950/20 focus-visible:ring-green-500/20",
        warning:
          "border-amber-500 bg-amber-50 dark:bg-amber-950/20 focus-visible:ring-amber-500/20",
      },
      size: {
        default: "h-11 min-h-[44px]", // Mobile-first with 44px minimum touch target
        sm: "h-9 min-h-[36px] text-sm",
        lg: "h-12 min-h-[48px] text-base",
      },
      inputMode: {
        none: "",
        text: "",
        decimal: "[inputmode='decimal']",
        numeric: "[inputmode='numeric']",
        tel: "[inputmode='tel']",
        email: "[inputmode='email']",
        url: "[inputmode='url']",
        search: "[inputmode='search']",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      inputMode: "text",
    },
  }
);

const Input = React.forwardRef(
  (
    { className, type, variant, size, inputMode, error, success, ...props },
    ref
  ) => {
    // Determine variant based on validation state
    const computedVariant = React.useMemo(() => {
      if (error) return "error";
      if (success) return "success";
      return variant;
    }, [error, success, variant]);

    // Optimize input modes for mobile keyboards
    const computedInputMode = React.useMemo(() => {
      if (inputMode) return inputMode;

      switch (type) {
        case "email":
          return "email";
        case "tel":
          return "tel";
        case "number":
          return "numeric";
        case "url":
          return "url";
        case "search":
          return "search";
        default:
          return "text";
      }
    }, [type, inputMode]);

    return (
      <input
        type={type}
        ref={ref}
        data-slot="input"
        inputMode={computedInputMode}
        aria-invalid={!!error}
        className={cn(
          inputVariants({ variant: computedVariant, size }),
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input, inputVariants };

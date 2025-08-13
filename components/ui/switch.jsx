import * as React from "react";
import { cn } from "@/lib/utils";

// Simple Switch component styled for shadcn/ui-like design
export const Switch = React.forwardRef(
  ({ checked = false, onCheckedChange, className, ...props }, ref) => {
    return (
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        data-state={checked ? "checked" : "unchecked"}
        tabIndex={0}
        ref={ref}
        onClick={() => onCheckedChange && onCheckedChange(!checked)}
        className={cn(
          "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-red-500/60 focus:ring-offset-2",
          checked ? "bg-red-600" : "bg-gray-200",
          className
        )}
        {...props}
      >
        <span
          className={cn(
            "inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform",
            checked ? "translate-x-5" : "translate-x-1"
          )}
        />
      </button>
    );
  }
);

Switch.displayName = "Switch";

export default Switch;

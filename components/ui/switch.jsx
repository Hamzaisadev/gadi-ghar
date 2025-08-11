import * as React from "react";

// Simple Switch component styled for shadcn/ui-like design
export const Switch = React.forwardRef(({ checked, onCheckedChange, ...props }, ref) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      tabIndex={0}
      ref={ref}
      onClick={() => onCheckedChange && onCheckedChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary/60 focus:ring-offset-2 ${checked ? 'bg-primary' : 'bg-gray-200'}`}
      {...props}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-5' : 'translate-x-1'}`}
      />
    </button>
  );
});

Switch.displayName = "Switch";

export default Switch;

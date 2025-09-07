import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "skeleton rounded-md",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton }

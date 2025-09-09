import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] rounded-md",
        "animate-[shimmer_2s_ease-in-out_infinite]",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton }

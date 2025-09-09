import * as React from "react"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const alertVariants = cva(
  "relative w-full rounded-lg border px-4 py-3 text-sm grid has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 gap-y-0.5 items-start [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current transition-all duration-200",
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground border-border",
        destructive:
          "text-destructive bg-destructive/5 border-destructive/50 [&>svg]:text-destructive *:data-[slot=alert-description]:text-destructive/90",
        success:
          "text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-950/20 border-green-500/50 [&>svg]:text-green-600 dark:[&>svg]:text-green-400",
        warning:
          "text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 border-amber-500/50 [&>svg]:text-amber-600 dark:[&>svg]:text-amber-400",
        info:
          "text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/20 border-blue-500/50 [&>svg]:text-blue-600 dark:[&>svg]:text-blue-400",
      },
      size: {
        default: "px-4 py-3 text-sm",
        sm: "px-3 py-2 text-xs",
        lg: "px-6 py-4 text-base",
      },
      persistent: {
        true: "border-2 shadow-lg",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      persistent: false,
    },
  }
)

const Alert = React.forwardRef(({
  className,
  variant,
  size,
  persistent = false,
  dismissible = false,
  onDismiss,
  children,
  ...props
}, ref) => {
  const [isVisible, setIsVisible] = React.useState(true)

  const handleDismiss = React.useCallback(() => {
    setIsVisible(false)
    onDismiss?.()
  }, [onDismiss])

  if (!isVisible) return null

  return (
    <div
      ref={ref}
      data-slot="alert"
      role={variant === "destructive" ? "alert" : "status"}
      aria-live={variant === "destructive" ? "assertive" : "polite"}
      className={cn(alertVariants({ variant, size, persistent }), className)}
      {...props}
    >
      {children}
      {dismissible && (
        <button
          onClick={handleDismiss}
          className="absolute right-2 top-2 rounded-md p-1 hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 min-w-[44px] min-h-[44px] flex items-center justify-center"
          aria-label="Dismiss notification"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  )
})
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="alert-title"
    className={cn("col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight", className)}
    {...props}
  />
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="alert-description"
    className={cn(
      "text-muted-foreground col-start-2 grid justify-items-start gap-1 text-sm [&_p]:leading-relaxed",
      className
    )}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

// Inline Error Component for forms
const InlineError = React.forwardRef(({
  className,
  children,
  error,
  ...props
}, ref) => {
  if (!error && !children) return null

  return (
    <Alert
      ref={ref}
      variant="destructive"
      size="sm"
      persistent={true}
      className={cn("mt-2", className)}
      {...props}
    >
      <svg
        className="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <AlertDescription>
        {error || children}
      </AlertDescription>
    </Alert>
  )
})
InlineError.displayName = "InlineError"

// Success Message Component
const SuccessMessage = React.forwardRef(({
  className,
  children,
  message,
  ...props
}, ref) => {
  if (!message && !children) return null

  return (
    <Alert
      ref={ref}
      variant="success"
      size="default"
      persistent={true}
      className={cn("mt-4", className)}
      {...props}
    >
      <svg
        className="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 13l4 4L19 7"
        />
      </svg>
      <AlertDescription>
        {message || children}
      </AlertDescription>
    </Alert>
  )
})
SuccessMessage.displayName = "SuccessMessage"

// Warning Message Component
const WarningMessage = React.forwardRef(({
  className,
  children,
  message,
  ...props
}, ref) => {
  if (!message && !children) return null

  return (
    <Alert
      ref={ref}
      variant="warning"
      size="default"
      persistent={true}
      className={cn("mt-2", className)}
      {...props}
    >
      <svg
        className="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
        />
      </svg>
      <AlertDescription>
        {message || children}
      </AlertDescription>
    </Alert>
  )
})
WarningMessage.displayName = "WarningMessage"

export {
  Alert,
  AlertTitle,
  AlertDescription,
  InlineError,
  SuccessMessage,
  WarningMessage,
  alertVariants
}

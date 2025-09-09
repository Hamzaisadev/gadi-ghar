"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { cva } from "class-variance-authority"

// Form Field Context
const FormFieldContext = React.createContext({})

// Form Item Context  
const FormItemContext = React.createContext({})

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext)
  const itemContext = React.useContext(FormItemContext)
  const { getFieldState, formState } = fieldContext

  const fieldState = getFieldState(fieldContext.name, formState)

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>")
  }

  const { id } = itemContext

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  }
}

const Form = React.forwardRef(({ className, ...props }, ref) => (
  <form
    ref={ref}
    className={cn("space-y-6", className)}
    {...props}
  />
))
Form.displayName = "Form"

const FormField = ({
  ...props
}) => {
  return (
    <FormFieldContext.Provider value={props}>
      {props.render(props)}
    </FormFieldContext.Provider>
  )
}

const FormItem = React.forwardRef(({ className, ...props }, ref) => {
  const id = React.useId()

  return (
    <FormItemContext.Provider value={{ id }}>
      <div ref={ref} className={cn("space-y-2", className)} {...props} />
    </FormItemContext.Provider>
  )
})
FormItem.displayName = "FormItem"

const FormLabel = React.forwardRef(({ className, ...props }, ref) => {
  const { error, formItemId } = useFormField()

  return (
    <label
      ref={ref}
      className={cn(
        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        error && "text-destructive",
        className
      )}
      htmlFor={formItemId}
      {...props}
    />
  )
})
FormLabel.displayName = "FormLabel"

const FormControl = React.forwardRef(({ ...props }, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField()

  return (
    <div
      ref={ref}
      id={formItemId}
      aria-describedby={
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      {...props}
    />
  )
})
FormControl.displayName = "FormControl"

const FormDescription = React.forwardRef(({ className, ...props }, ref) => {
  const { formDescriptionId } = useFormField()

  return (
    <p
      ref={ref}
      id={formDescriptionId}
      className={cn("text-[0.8rem] text-muted-foreground", className)}
      {...props}
    />
  )
})
FormDescription.displayName = "FormDescription"

const formMessageVariants = cva(
  "text-[0.8rem] font-medium transition-all duration-200",
  {
    variants: {
      variant: {
        destructive: "text-destructive",
        success: "text-green-600 dark:text-green-400",
        warning: "text-amber-600 dark:text-amber-400",
      },
    },
    defaultVariants: {
      variant: "destructive",
    },
  }
)

const FormMessage = React.forwardRef(({ className, children, variant, ...props }, ref) => {
  const { error, formMessageId } = useFormField()
  const body = error ? String(error?.message) : children

  if (!body) {
    return null
  }

  return (
    <p
      ref={ref}
      id={formMessageId}
      className={cn(formMessageVariants({ variant }), className)}
      role={variant === "destructive" ? "alert" : "status"}
      aria-live="polite"
      {...props}
    >
      {body}
    </p>
  )
})
FormMessage.displayName = "FormMessage"

// Progress Indicator Component
const FormProgress = React.forwardRef(({ 
  className, 
  currentStep = 1, 
  totalSteps = 1, 
  steps = [],
  ...props 
}, ref) => {
  const progressPercentage = (currentStep / totalSteps) * 100

  return (
    <div ref={ref} className={cn("w-full space-y-2", className)} {...props}>
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>Step {currentStep} of {totalSteps}</span>
        <span>{Math.round(progressPercentage)}%</span>
      </div>
      
      <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
        <div
          className="bg-primary h-2 rounded-full transition-all duration-300 ease-in-out"
          style={{ width: `${progressPercentage}%` }}
          role="progressbar"
          aria-valuenow={currentStep}
          aria-valuemin={1}
          aria-valuemax={totalSteps}
          aria-label={`Form progress: ${currentStep} of ${totalSteps} steps completed`}
        />
      </div>
      
      {steps.length > 0 && (
        <div className="flex justify-between">
          {steps.map((step, index) => (
            <div
              key={step.id || index}
              className={cn(
                "flex flex-col items-center text-xs",
                index + 1 <= currentStep ? "text-primary" : "text-muted-foreground"
              )}
            >
              <div
                className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium mb-1",
                  index + 1 < currentStep
                    ? "bg-primary text-primary-foreground"
                    : index + 1 === currentStep
                    ? "bg-primary/20 text-primary border-2 border-primary"
                    : "bg-secondary text-muted-foreground"
                )}
              >
                {index + 1 < currentStep ? "✓" : index + 1}
              </div>
              <span className="text-center max-w-[80px] truncate">{step.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
})
FormProgress.displayName = "FormProgress"

// Success State Component
const FormSuccess = React.forwardRef(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center space-x-2 rounded-lg border border-green-200 bg-green-50 p-4 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-400",
      className
    )}
    role="alert"
    aria-live="polite"
    {...props}
  >
    <div className="flex-shrink-0">
      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
          clipRule="evenodd"
        />
      </svg>
    </div>
    <div className="flex-1">
      {children || "Form submitted successfully!"}
    </div>
  </div>
))
FormSuccess.displayName = "FormSuccess"

export {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormProgress,
  FormSuccess,
  useFormField,
}

'use client'

import { useEffect, useRef } from 'react'
import { AlertTriangle, RefreshCw, Home, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export default function Error({ error, reset }) {
  const hasReset = useRef(false)
  const hasLogged = useRef(false)

  useEffect(() => {
    if (!hasLogged.current && error) {
      hasLogged.current = true
      try {
        console.error('Route error:', error)
      } catch (logError) {
        // Prevent console.error from causing more issues
      }
    }
  }, [error])

  const handleTryAgain = () => {
    if (hasReset.current) {
      // If already tried reset, do hard reload
      window.location.reload()
      return
    }
    
    hasReset.current = true
    try {
      if (typeof reset === 'function') {
        reset()
      } else {
        window.location.reload()
      }
    } catch (e) {
      // If reset fails, do hard reload
      window.location.reload()
    }
  }

  const handleGoHome = () => {
    window.location.href = '/'
  }

  const handleGoBack = () => {
    if (typeof window !== 'undefined') {
      if (window.history.length > 1) {
        window.history.back()
      } else {
        window.location.href = '/'
      }
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center container-responsive">
      <div className="max-w-sm sm:max-w-md w-full">
        <Alert variant="destructive" className="mb-4 sm:mb-6">
          <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5" />
          <AlertTitle className="text-base sm:text-lg font-semibold">
            Oops! Something went wrong
          </AlertTitle>
          <AlertDescription className="mt-2 text-sm sm:text-base">
            We encountered an unexpected error. This might be a temporary issue.
          </AlertDescription>
        </Alert>

        <div className="space-y-3">
          <Button 
            onClick={handleTryAgain}
            className="w-full bg-car-red hover:bg-car-red-dark touch-target text-sm sm:text-base"
            size="default"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>

          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            <Button
              onClick={handleGoBack}
              variant="outline"
              size="default"
              className="touch-target text-xs sm:text-sm"
            >
              <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Go Back
            </Button>

            <Button
              onClick={handleGoHome}
              variant="outline"
              size="default"
              className="touch-target text-xs sm:text-sm"
            >
              <Home className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Home
            </Button>
          </div>
        </div>

        {process.env.NODE_ENV === 'development' && (
          <details className="mt-6 p-4 bg-gray-100 rounded-lg">
            <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
              Error Details (Development Mode)
            </summary>
            <div className="mt-3 text-xs text-gray-600">
              <div className="mb-2">
                <strong>Error:</strong> {error?.message || 'Unknown error'}
              </div>
              {error?.stack && (
                <div>
                  <strong>Stack Trace:</strong>
                  <pre className="mt-1 whitespace-pre-wrap text-xs bg-white p-2 rounded border overflow-auto max-h-32">
                    {error.stack}
                  </pre>
                </div>
              )}
            </div>
          </details>
        )}
      </div>
    </div>
  )
}

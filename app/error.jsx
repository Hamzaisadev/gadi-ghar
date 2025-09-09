'use client'

import { useEffect, useRef } from 'react'
import { AlertTriangle, RefreshCw, Home, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export default function Error({ error, reset }) {
  const hasReset = useRef(false)

  useEffect(() => {
    console.error('Route error:', error)
  }, [error])

  const handleTryAgain = () => {
    if (hasReset.current) return
    hasReset.current = true
    try {
      reset()
    } catch (e) {
      window.location.href = window.location.href
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
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-5 w-5" />
          <AlertTitle className="text-lg font-semibold">
            Oops! Something went wrong
          </AlertTitle>
          <AlertDescription className="mt-2">
            We encountered an unexpected error. This might be a temporary issue.
          </AlertDescription>
        </Alert>

        <div className="space-y-3">
          <Button 
            onClick={handleTryAgain}
            className="w-full bg-car-red hover:bg-car-red-dark"
            size="lg"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>

          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={handleGoBack}
              variant="outline"
              size="lg"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>

            <Button
              onClick={handleGoHome}
              variant="outline"
              size="lg"
            >
              <Home className="h-4 w-4 mr-2" />
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

'use client'

import { useRef } from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function GlobalError({ error, reset }) {
  const hasReset = useRef(false)
  const errorId = `global_error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  
  // Log error once per mount
  console.error('Global error:', error)
  
  const handleTryAgain = () => {
    if (hasReset.current) return
    hasReset.current = true
    try {
      reset()
    } catch (e) {
      // If reset fails, provide a manual fallback
      window.location.href = window.location.href
    }
  }
  
  const handleGoHome = () => {
    // Use hard navigation to avoid any stale state or HMR artifacts
    window.location.href = '/'
  }
  
  return (
    <html>
      <body>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="mb-6">
              <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Application Error
              </h1>
              <p className="text-gray-600 mb-4">
                We encountered a critical error. Please try refreshing the page or contact support if the problem persists.
              </p>
              <p className="text-sm text-gray-400 mb-4">
                Error ID: {errorId}
              </p>
            </div>

            <div className="space-y-3">
              <Button 
                onClick={handleTryAgain} 
                className="w-full bg-red-600 hover:bg-red-700 text-white"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
              
              <Button 
                onClick={handleGoHome}
                variant="outline" 
                className="w-full"
              >
                <Home className="h-4 w-4 mr-2" />
                Go to Homepage
              </Button>
            </div>

            {process.env.NODE_ENV === 'development' && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                  Show Technical Details (Development)
                </summary>
                <div className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-auto max-h-40">
                  <strong>Error:</strong> {error?.message || 'Unknown error'}
                  <br />
                  {error?.stack && (
                    <>
                      <strong>Stack:</strong>
                      <pre className="mt-1 whitespace-pre-wrap">{error.stack}</pre>
                    </>
                  )}
                </div>
              </details>
            )}
          </div>
        </div>
      </body>
    </html>
  )
}

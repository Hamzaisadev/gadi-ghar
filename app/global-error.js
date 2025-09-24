"use client";

import { useRef, useEffect } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export default function GlobalError({ error, reset }) {
  const hasReset = useRef(false);
  const hasLogged = useRef(false);
  const errorId = useRef(
    `global_error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  );

  // Log error once per mount with protection
  useEffect(() => {
    if (!hasLogged.current && error) {
      hasLogged.current = true;
      try {
        console.error("Global error:", error);
      } catch (logError) {
        // Prevent console.error from causing more issues
      }
    }
  }, [error]);

  const handleTryAgain = () => {
    if (hasReset.current) {
      // If already tried reset, do hard reload
      window.location.reload();
      return;
    }

    hasReset.current = true;
    try {
      if (typeof reset === "function") {
        reset();
      } else {
        window.location.reload();
      }
    } catch (e) {
      // If reset fails, do hard reload
      window.location.reload();
    }
  };

  const handleGoHome = () => {
    try {
      // Use hard navigation to avoid any stale state
      window.location.href = "/";
    } catch (e) {
      // Fallback if even navigation fails
      window.location.reload();
    }
  };

  return (
    <html>
      <body>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="mb-6">
              <div className="h-16 w-16 text-red-500 mx-auto mb-4 flex items-center justify-center">
                <AlertTriangle className="w-16 h-16" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Application Error
              </h1>
              <p className="text-gray-600 mb-4">
                We encountered a critical error. Please try refreshing the page
                or contact support if the problem persists.
              </p>
              <p className="text-sm text-gray-400 mb-4">
                Error ID: {errorId.current}
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleTryAgain}
                className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded flex items-center justify-center"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </button>

              <button
                onClick={handleGoHome}
                className="w-full border border-gray-300 hover:bg-gray-50 px-4 py-2 rounded flex items-center justify-center"
              >
                <Home className="h-4 w-4 mr-2" />
                Go to Homepage
              </button>
            </div>

            {process.env.NODE_ENV === "development" && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                  Show Technical Details (Development)
                </summary>
                <div className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-auto max-h-40">
                  <strong>Error:</strong> {error?.message || "Unknown error"}
                  <br />
                  {error?.stack && (
                    <>
                      <strong>Stack:</strong>
                      <pre className="mt-1 whitespace-pre-wrap">
                        {error.stack}
                      </pre>
                    </>
                  )}
                </div>
              </details>
            )}
          </div>
        </div>
      </body>
    </html>
  );
}

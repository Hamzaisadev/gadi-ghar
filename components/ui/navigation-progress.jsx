"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function NavigationProgress() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleStart = () => {
      setIsLoading(true);
    };

    const handleComplete = () => {
      setTimeout(() => setIsLoading(false), 300);
    };

    // Listen to router events if available
    // Note: Next.js 13+ with app directory doesn't have router events
    // This is a fallback for when we manually trigger loading states

    return () => {
      // Cleanup if needed
    };
  }, [router]);

  if (!isLoading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <div className="h-1 bg-gradient-to-r from-red-500 via-red-600 to-red-700 animate-pulse">
        <div className="h-full bg-gradient-to-r from-red-400 to-red-500 animate-[loading_2s_ease-in-out_infinite]" />
      </div>
    </div>
  );
}

// Hook for manually controlling navigation loading state
export function useNavigationLoading() {
  const [isLoading, setIsLoading] = useState(false);

  const startLoading = () => setIsLoading(true);
  const stopLoading = () => setIsLoading(false);

  return {
    isLoading,
    startLoading,
    stopLoading,
  };
}

// Loading overlay component for pages
export function LoadingOverlay({ isVisible = false, message = "Loading..." }) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          {/* Spinning loader */}
          <div className="w-12 h-12 border-4 border-red-200 border-t-red-600 rounded-full animate-spin" />
        </div>
        <p className="text-gray-600 font-medium">{message}</p>
      </div>
    </div>
  );
}

// Simple loading spinner component
export function LoadingSpinner({ size = "md", color = "red" }) {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-6 h-6 border-2",
    lg: "w-8 h-8 border-3",
    xl: "w-12 h-12 border-4",
  };

  const colorClasses = {
    red: "border-red-200 border-t-red-600",
    blue: "border-blue-200 border-t-blue-600",
    gray: "border-gray-200 border-t-gray-600",
    white: "border-white/20 border-t-white",
  };

  return (
    <div 
      className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-spin`}
    />
  );
}

// Inline loading text with dots animation
export function LoadingText({ text = "Loading", className = "" }) {
  return (
    <span className={`inline-flex items-center gap-1 ${className}`}>
      {text}
      <span className="inline-flex">
        <span className="animate-bounce delay-0">.</span>
        <span className="animate-bounce delay-100">.</span>
        <span className="animate-bounce delay-200">.</span>
      </span>
    </span>
  );
}

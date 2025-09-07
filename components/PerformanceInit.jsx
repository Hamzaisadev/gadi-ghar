'use client'

import { useEffect } from 'react'
import { initPerformanceOptimizations } from '@/lib/performance'

/**
 * Performance Initialization Component
 * 
 * This component initializes client-side performance optimizations including:
 * - Web Vitals monitoring
 * - Critical resource preloading
 * - Cache monitoring
 */
export default function PerformanceInit() {
  useEffect(() => {
    // Initialize performance optimizations
    initPerformanceOptimizations()
    
    // Service Worker registration for PWA
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('SW registered: ', registration)
        })
        .catch(registrationError => {
          console.log('SW registration failed: ', registrationError)
        })
    }

    // Prefetch critical pages
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(() => {
        // Prefetch commonly visited pages
        const criticalPages = ['/cars', '/about', '/contact']
        criticalPages.forEach(page => {
          const link = document.createElement('link')
          link.rel = 'prefetch'
          link.href = page
          document.head.appendChild(link)
        })
      })
    }

    // Monitor memory usage in development
    if (process.env.NODE_ENV === 'development' && 'memory' in performance) {
      const logMemoryUsage = () => {
        const memInfo = performance.memory
        console.log('Memory Usage:', {
          used: Math.round(memInfo.usedJSHeapSize / 1048576) + 'MB',
          total: Math.round(memInfo.totalJSHeapSize / 1048576) + 'MB',
          limit: Math.round(memInfo.jsHeapSizeLimit / 1048576) + 'MB'
        })
      }
      
      // Log memory usage every 60 seconds in development
      const memoryInterval = setInterval(logMemoryUsage, 60000)
      
      return () => clearInterval(memoryInterval)
    }
  }, [])

  return null // This component doesn't render anything
}

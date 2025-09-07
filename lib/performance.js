/**
 * Performance Optimization Utilities for Gadi-Ghar
 * Provides caching, optimization, and performance monitoring tools
 */

import { cache } from 'react'
import { unstable_cache } from 'next/cache'

/**
 * Cache configuration constants
 */
export const CACHE_TAGS = {
  CARS: 'cars',
  FEATURED_CARS: 'featured-cars',
  DEALERSHIPS: 'dealerships',
  USER_CARS: 'user-cars',
  SEARCH_RESULTS: 'search-results',
  FILTER_SUGGESTIONS: 'filter-suggestions'
}

export const CACHE_DURATIONS = {
  SHORT: 60, // 1 minute
  MEDIUM: 300, // 5 minutes  
  LONG: 3600, // 1 hour
  VERY_LONG: 86400 // 24 hours
}

/**
 * React Cache wrapper for deduplicating requests within a single render
 */
export const reactCache = (fn) => cache(fn)

/**
 * Next.js unstable_cache wrapper with better defaults
 */
export const nextCache = (
  fn,
  keys = [],
  options = {}
) => {
  const defaultOptions = {
    revalidate: CACHE_DURATIONS.MEDIUM,
    tags: []
  }
  
  return unstable_cache(fn, keys, { ...defaultOptions, ...options })
}

/**
 * Memory cache for frequently accessed data
 */
class MemoryCache {
  constructor(maxSize = 100) {
    this.cache = new Map()
    this.maxSize = maxSize
    this.hitCount = 0
    this.missCount = 0
  }

  get(key) {
    if (this.cache.has(key)) {
      this.hitCount++
      const item = this.cache.get(key)
      
      // Check if item has expired
      if (item.expiresAt && Date.now() > item.expiresAt) {
        this.cache.delete(key)
        this.missCount++
        return null
      }
      
      // Move to end (LRU)
      this.cache.delete(key)
      this.cache.set(key, item)
      return item.value
    }
    
    this.missCount++
    return null
  }

  set(key, value, ttlMs = 300000) { // Default 5 minutes
    // Remove oldest if at capacity
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value
      this.cache.delete(firstKey)
    }
    
    const item = {
      value,
      expiresAt: ttlMs > 0 ? Date.now() + ttlMs : null,
      createdAt: Date.now()
    }
    
    this.cache.set(key, item)
  }

  delete(key) {
    return this.cache.delete(key)
  }

  clear() {
    this.cache.clear()
    this.hitCount = 0
    this.missCount = 0
  }

  getStats() {
    const total = this.hitCount + this.missCount
    return {
      size: this.cache.size,
      hitCount: this.hitCount,
      missCount: this.missCount,
      hitRate: total > 0 ? (this.hitCount / total * 100).toFixed(2) + '%' : '0%'
    }
  }
}

// Global memory cache instance
export const memoryCache = new MemoryCache(200)

/**
 * Cached function decorator
 */
export function cachedFunction(options = {}) {
  return function(target, propertyKey, descriptor) {
    const originalMethod = descriptor.value
    const {
      keyGenerator = (...args) => JSON.stringify(args),
      ttl = CACHE_DURATIONS.MEDIUM * 1000, // Convert to milliseconds
      useMemoryCache = true,
      tags = []
    } = options

    descriptor.value = async function(...args) {
      const cacheKey = `${propertyKey}_${keyGenerator(...args)}`
      
      // Try memory cache first
      if (useMemoryCache) {
        const cached = memoryCache.get(cacheKey)
        if (cached !== null) {
          return cached
        }
      }
      
      // Execute original function
      const result = await originalMethod.apply(this, args)
      
      // Store in memory cache
      if (useMemoryCache) {
        memoryCache.set(cacheKey, result, ttl)
      }
      
      return result
    }
    
    return descriptor
  }
}

/**
 * Database query optimization utilities
 */
export const dbOptimizations = {
  /**
   * Optimized car search query with proper indexing hints
   */
  getOptimizedCarSearchQuery: (baseQuery) => ({
    ...baseQuery,
    // Add query hints for better performance
    select: {
      id: true,
      make: true,
      model: true,
      year: true,
      minPrice: true,
      maxPrice: true,
      mileage: true,
      color: true,
      fuelType: true,
      transmission: true,
      bodyType: true,
      seats: true,
      status: true,
      featured: true,
      images: true,
      createdAt: true,
      dealership: {
        select: {
          id: true,
          name: true,
          phone: true,
          address: true
        }
      }
    }
  }),

  /**
   * Batch database queries for better performance
   */
  batchQueries: async (queries) => {
    try {
      const results = await Promise.all(queries)
      return results
    } catch (error) {
      console.error('Batch query error:', error)
      throw error
    }
  },

  /**
   * Connection pooling optimization
   */
  optimizeConnection: (prisma) => {
    // Set connection pool settings
    prisma.$on('query', (e) => {
      if (process.env.NODE_ENV === 'development') {
        console.log('Query:', e.query)
        console.log('Duration:', e.duration + 'ms')
      }
    })
    
    return prisma
  }
}

/**
 * Bundle size optimization utilities
 */
export const bundleOptimizations = {
  /**
   * Dynamic imports for code splitting
   */
  lazyLoad: (importFn) => {
    return React.lazy(importFn)
  },

  /**
   * Preload critical components
   */
  preloadComponent: (importFn) => {
    if (typeof window !== 'undefined') {
      // Preload on browser idle
      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(() => importFn())
      } else {
        setTimeout(() => importFn(), 100)
      }
    }
  },

  /**
   * Tree shake unused utilities
   */
  createSelectiveImport: (modules) => {
    return Object.keys(modules).reduce((acc, key) => {
      if (modules[key]) {
        acc[key] = modules[key]
      }
      return acc
    }, {})
  }
}

/**
 * Performance monitoring utilities
 */
export const performanceMonitor = {
  /**
   * Measure function execution time
   */
  measureTime: (fn, label = 'Function') => {
    return async (...args) => {
      const startTime = performance.now()
      const result = await fn(...args)
      const endTime = performance.now()
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`${label} took ${(endTime - startTime).toFixed(2)}ms`)
      }
      
      return result
    }
  },

  /**
   * Monitor Core Web Vitals
   */
  initWebVitals: () => {
    if (typeof window !== 'undefined') {
      import('web-vitals').then(({ onCLS, onINP, onFCP, onLCP, onTTFB }) => {
        // Cumulative Layout Shift
        onCLS((metric) => {
          if (process.env.NODE_ENV === 'development') {
            console.log('CLS:', metric)
          }
        })
        
        // Interaction to Next Paint (replaces FID in v5)
        onINP((metric) => {
          if (process.env.NODE_ENV === 'development') {
            console.log('INP:', metric)
          }
        })
        
        // First Contentful Paint
        onFCP((metric) => {
          if (process.env.NODE_ENV === 'development') {
            console.log('FCP:', metric)
          }
        })
        
        // Largest Contentful Paint
        onLCP((metric) => {
          if (process.env.NODE_ENV === 'development') {
            console.log('LCP:', metric)
          }
        })
        
        // Time to First Byte
        onTTFB((metric) => {
          if (process.env.NODE_ENV === 'development') {
            console.log('TTFB:', metric)
          }
        })
      }).catch((error) => {
        console.warn('Failed to load web-vitals:', error)
      })
    }
  },

  /**
   * Image loading performance
   */
  trackImagePerformance: (src) => {
    if (typeof window !== 'undefined') {
      const img = new Image()
      const startTime = performance.now()
      
      img.onload = () => {
        const loadTime = performance.now() - startTime
        console.log(`Image ${src} loaded in ${loadTime.toFixed(2)}ms`)
      }
      
      img.onerror = () => {
        console.error(`Failed to load image: ${src}`)
      }
      
      img.src = src
    }
  }
}

/**
 * Cached API functions for common operations
 */
export const cachedApis = {
  /**
   * Get featured cars with caching
   */
  getFeaturedCars: nextCache(
    async (limit = 6) => {
      const { getFeaturedCars } = await import('@/app/actions/home')
      return getFeaturedCars(limit)
    },
    ['featured-cars'],
    {
      revalidate: CACHE_DURATIONS.MEDIUM,
      tags: [CACHE_TAGS.FEATURED_CARS, CACHE_TAGS.CARS]
    }
  ),

  /**
   * Get filter suggestions with caching
   */
  getFilterSuggestions: nextCache(
    async () => {
      const { getFilterSuggestions } = await import('@/lib/advanced-search')
      const result = await getFilterSuggestions()
      return result.data
    },
    ['filter-suggestions'],
    {
      revalidate: CACHE_DURATIONS.LONG,
      tags: [CACHE_TAGS.FILTER_SUGGESTIONS, CACHE_TAGS.CARS]
    }
  ),

  /**
   * Get car details with caching
   */
  getCarDetails: nextCache(
    async (carId) => {
      const { db } = await import('@/lib/prisma')
      const car = await db.car.findUnique({
        where: { id: carId },
        include: {
          dealership: {
            select: {
              id: true,
              name: true,
              phone: true,
              address: true,
              email: true
            }
          }
        }
      })
      return car
    },
    ['car-details'],
    {
      revalidate: CACHE_DURATIONS.MEDIUM,
      tags: [CACHE_TAGS.CARS]
    }
  )
}

/**
 * Cache invalidation utilities
 */
export const cacheInvalidation = {
  /**
   * Revalidate cache by tags
   */
  revalidateTags: async (tags) => {
    if (typeof revalidateTag !== 'undefined') {
      tags.forEach(tag => revalidateTag(tag))
    }
  },

  /**
   * Invalidate all car-related caches
   */
  invalidateCarCaches: async () => {
    memoryCache.clear()
    await cacheInvalidation.revalidateTags([
      CACHE_TAGS.CARS,
      CACHE_TAGS.FEATURED_CARS,
      CACHE_TAGS.SEARCH_RESULTS,
      CACHE_TAGS.FILTER_SUGGESTIONS
    ])
  },

  /**
   * Smart cache invalidation based on operations
   */
  invalidateByOperation: async (operation, entityType) => {
    const invalidationMap = {
      car: {
        create: [CACHE_TAGS.CARS, CACHE_TAGS.FEATURED_CARS, CACHE_TAGS.FILTER_SUGGESTIONS],
        update: [CACHE_TAGS.CARS, CACHE_TAGS.FEATURED_CARS],
        delete: [CACHE_TAGS.CARS, CACHE_TAGS.FEATURED_CARS, CACHE_TAGS.FILTER_SUGGESTIONS]
      },
      dealership: {
        create: [CACHE_TAGS.DEALERSHIPS],
        update: [CACHE_TAGS.DEALERSHIPS, CACHE_TAGS.CARS],
        delete: [CACHE_TAGS.DEALERSHIPS, CACHE_TAGS.CARS]
      }
    }

    const tags = invalidationMap[entityType]?.[operation] || []
    await cacheInvalidation.revalidateTags(tags)
  }
}

/**
 * Image optimization utilities
 */
export const imageOptimizations = {
  /**
   * Generate responsive image srcSet
   */
  generateSrcSet: (baseUrl, sizes = [400, 800, 1200]) => {
    return sizes.map(size => `${baseUrl}?w=${size} ${size}w`).join(', ')
  },

  /**
   * Optimize image loading priority
   */
  getImagePriority: (index, foldPosition = 2) => {
    return index < foldPosition
  },

  /**
   * Generate blur placeholder
   */
  generateBlurPlaceholder: (width = 10, height = 10) => {
    return `data:image/svg+xml;base64,${Buffer.from(
      `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f3f4f6"/>
      </svg>`
    ).toString('base64')}`
  }
}

/**
 * Initialize performance optimizations
 */
export const initPerformanceOptimizations = () => {
  if (typeof window !== 'undefined') {
    // Initialize Web Vitals monitoring
    performanceMonitor.initWebVitals()
    
    // Preload critical resources
    const criticalImages = ['/GariGharBlack.png']
    criticalImages.forEach(img => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'image'
      link.href = img
      document.head.appendChild(link)
    })
    
    // Log cache statistics in development
    if (process.env.NODE_ENV === 'development') {
      setInterval(() => {
        console.log('Memory Cache Stats:', memoryCache.getStats())
      }, 30000) // Every 30 seconds
    }
  }
}

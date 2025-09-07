'use client'

import Image from 'next/image'
import { useState, forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { ImageOff, Loader2 } from 'lucide-react'

/**
 * OptimizedImage Component
 * 
 * A high-performance image component optimized for car photos with:
 * - Automatic lazy loading
 * - Progressive loading with blur placeholder
 * - Error handling with fallback
 * - Responsive sizing
 * - Performance optimizations
 */
const OptimizedImage = forwardRef(({
  src,
  alt,
  width,
  height,
  className,
  containerClassName,
  priority = false,
  quality = 75,
  placeholder = 'blur',
  blurDataURL,
  fallbackSrc = '/placeholder-car.jpg', // You'll need to add this image
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  aspectRatio = 'aspect-[4/3]', // Common car photo aspect ratio
  loading = 'lazy',
  onLoadComplete,
  onError,
  showLoadingSpinner = true,
  objectFit = 'cover',
  ...props
}, ref) => {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [currentSrc, setCurrentSrc] = useState(src)

  // Generate a simple blur placeholder if none provided
  const defaultBlurDataURL = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWEREiMxUf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=='

  const handleLoad = (event) => {
    setIsLoading(false)
    onLoadComplete?.(event)
  }

  const handleError = () => {
    setHasError(true)
    setIsLoading(false)
    if (currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc)
    }
    onError?.()
  }

  const imageProps = {
    src: currentSrc,
    alt: alt || 'Car image',
    width,
    height,
    quality,
    priority,
    sizes,
    loading: priority ? 'eager' : loading,
    placeholder: placeholder === 'blur' ? 'blur' : 'empty',
    blurDataURL: blurDataURL || defaultBlurDataURL,
    onLoad: handleLoad,
    onError: handleError,
    className: cn(
      'transition-opacity duration-300',
      isLoading ? 'opacity-0' : 'opacity-100',
      objectFit === 'cover' && 'object-cover',
      objectFit === 'contain' && 'object-contain',
      objectFit === 'fill' && 'object-fill',
      className
    ),
    ...props
  }

  return (
    <div className={cn('relative overflow-hidden bg-gray-100', aspectRatio, containerClassName)}>
      {/* Loading Spinner */}
      {isLoading && showLoadingSpinner && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      )}

      {/* Error State */}
      {hasError && currentSrc === fallbackSrc && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 text-gray-400">
          <ImageOff className="h-12 w-12 mb-2" />
          <span className="text-sm">Image unavailable</span>
        </div>
      )}

      {/* Optimized Image */}
      {!hasError || currentSrc !== fallbackSrc ? (
        <Image
          ref={ref}
          {...imageProps}
          fill={!width || !height}
        />
      ) : null}

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
    </div>
  )
})

OptimizedImage.displayName = 'OptimizedImage'

export default OptimizedImage

/**
 * CarImageGallery Component
 * Optimized gallery component for car listings
 */
export const CarImageGallery = ({ 
  images = [], 
  alt = 'Car image', 
  className,
  aspectRatio = 'aspect-[4/3]',
  priority = false 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  if (!images.length) {
    return (
      <div className={cn('bg-gray-100 flex items-center justify-center', aspectRatio, className)}>
        <div className="text-center text-gray-400">
          <ImageOff className="h-12 w-12 mx-auto mb-2" />
          <span className="text-sm">No images available</span>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('relative group', className)}>
      {/* Main Image */}
      <OptimizedImage
        src={images[currentIndex]}
        alt={`${alt} - Image ${currentIndex + 1}`}
        aspectRatio={aspectRatio}
        priority={priority}
        className="w-full h-full"
      />

      {/* Image Counter */}
      {images.length > 1 && (
        <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
          {currentIndex + 1} / {images.length}
        </div>
      )}

      {/* Navigation Arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={() => setCurrentIndex(prev => prev === 0 ? images.length - 1 : prev - 1)}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
            aria-label="Previous image"
          >
            ←
          </button>
          <button
            onClick={() => setCurrentIndex(prev => prev === images.length - 1 ? 0 : prev + 1)}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
            aria-label="Next image"
          >
            →
          </button>
        </>
      )}

      {/* Thumbnail Navigation */}
      {images.length > 1 && images.length <= 6 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={cn(
                'w-2 h-2 rounded-full transition-colors',
                index === currentIndex ? 'bg-white' : 'bg-white/50'
              )}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

/**
 * CarThumbnail Component
 * Optimized thumbnail component for car listings
 */
export const CarThumbnail = ({ 
  src, 
  alt = 'Car thumbnail', 
  className,
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'w-16 h-12',
    md: 'w-24 h-18',
    lg: 'w-32 h-24',
    xl: 'w-40 h-30'
  }

  return (
    <OptimizedImage
      src={src}
      alt={alt}
      aspectRatio="aspect-[4/3]"
      className={cn(sizeClasses[size], 'rounded-md', className)}
      priority={false}
      quality={60} // Lower quality for thumbnails
      showLoadingSpinner={false}
    />
  )
}

"use client"

import * as React from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Button } from "./button"
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react"

const ImageGallery = React.forwardRef(({ 
  images = [], 
  className,
  initialIndex = 0,
  showThumbnails = true,
  autoplay = false,
  autoplayInterval = 5000,
  onImageChange,
  ...props 
}, ref) => {
  const [currentIndex, setCurrentIndex] = React.useState(initialIndex)
  const [isFullscreen, setIsFullscreen] = React.useState(false)
  const [touchStart, setTouchStart] = React.useState(null)
  const [touchEnd, setTouchEnd] = React.useState(null)
  const galleryRef = React.useRef(null)

  // Minimum swipe distance (in px) for a swipe to be registered
  const minSwipeDistance = 50

  const nextImage = React.useCallback(() => {
    const newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1
    setCurrentIndex(newIndex)
    onImageChange?.(newIndex)
  }, [currentIndex, images.length, onImageChange])

  const prevImage = React.useCallback(() => {
    const newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1
    setCurrentIndex(newIndex)
    onImageChange?.(newIndex)
  }, [currentIndex, images.length, onImageChange])

  const goToImage = React.useCallback((index) => {
    setCurrentIndex(index)
    onImageChange?.(index)
  }, [onImageChange])

  // Handle touch events for swipe navigation
  const onTouchStart = (e) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe) {
      nextImage()
    } else if (isRightSwipe) {
      prevImage()
    }
  }

  // Keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isFullscreen) return
      
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault()
          prevImage()
          break
        case 'ArrowRight':
          e.preventDefault()
          nextImage()
          break
        case 'Escape':
          e.preventDefault()
          setIsFullscreen(false)
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isFullscreen, prevImage, nextImage])

  // Autoplay functionality
  React.useEffect(() => {
    if (!autoplay || isFullscreen) return

    const interval = setInterval(nextImage, autoplayInterval)
    return () => clearInterval(interval)
  }, [autoplay, autoplayInterval, isFullscreen, nextImage])

  if (!images.length) return null

  const currentImage = images[currentIndex]

  return (
    <>
      <div
        ref={ref}
        className={cn("relative w-full", className)}
        {...props}
      >
        {/* Main image display */}
        <div
          ref={galleryRef}
          className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          role="img"
          aria-label={`Image ${currentIndex + 1} of ${images.length}${currentImage?.alt ? `: ${currentImage.alt}` : ''}`}
        >
          <Image
            src={currentImage?.src || currentImage}
            alt={currentImage?.alt || `Gallery image ${currentIndex + 1}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
            priority={currentIndex === 0}
          />
          
          {/* Navigation buttons - larger touch targets for mobile */}
          <Button
            variant="ghost"
            size="icon-lg"
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/20 text-white hover:bg-black/40 backdrop-blur-sm"
            onClick={prevImage}
            aria-label="Previous image"
          >
            <ChevronLeft size={24} />
          </Button>
          
          <Button
            variant="ghost"
            size="icon-lg"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/20 text-white hover:bg-black/40 backdrop-blur-sm"
            onClick={nextImage}
            aria-label="Next image"
          >
            <ChevronRight size={24} />
          </Button>

          {/* Fullscreen button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 bg-black/20 text-white hover:bg-black/40 backdrop-blur-sm"
            onClick={() => setIsFullscreen(true)}
            aria-label="View in fullscreen"
          >
            <ZoomIn size={20} />
          </Button>

          {/* Image counter */}
          <div className="absolute bottom-2 left-2 rounded bg-black/40 px-2 py-1 text-xs text-white backdrop-blur-sm">
            {currentIndex + 1} / {images.length}
          </div>
        </div>

        {/* Thumbnails */}
        {showThumbnails && images.length > 1 && (
          <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => goToImage(index)}
                className={cn(
                  "relative flex-shrink-0 overflow-hidden rounded border-2 transition-all min-w-[60px] min-h-[48px]",
                  index === currentIndex
                    ? "border-primary shadow-md"
                    : "border-transparent hover:border-muted-foreground"
                )}
                aria-label={`Go to image ${index + 1}`}
              >
                <Image
                  src={image?.src || image}
                  alt={image?.alt || `Thumbnail ${index + 1}`}
                  width={60}
                  height={48}
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}

        {/* Swipe indicators for mobile */}
        <div className="mt-2 flex justify-center gap-1 md:hidden">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToImage(index)}
              className={cn(
                "h-2 w-2 rounded-full transition-all min-w-[32px] min-h-[32px] flex items-center justify-center",
                index === currentIndex ? "bg-primary" : "bg-muted-foreground/30"
              )}
              aria-label={`Go to image ${index + 1}`}
            >
              <div 
                className={cn(
                  "h-2 w-2 rounded-full",
                  index === currentIndex ? "bg-primary-foreground" : "bg-muted-foreground"
                )}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Fullscreen modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
          <div className="relative max-h-screen max-w-screen-xl p-4">
            <Button
              variant="ghost"
              size="icon-lg"
              className="absolute -right-2 -top-2 bg-black/20 text-white hover:bg-black/40 backdrop-blur-sm z-10"
              onClick={() => setIsFullscreen(false)}
              aria-label="Close fullscreen"
            >
              <X size={24} />
            </Button>
            
            <div
              className="relative h-[80vh] w-full"
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              <Image
                src={currentImage?.src || currentImage}
                alt={currentImage?.alt || `Gallery image ${currentIndex + 1}`}
                fill
                className="object-contain"
                sizes="100vw"
              />
              
              <Button
                variant="ghost"
                size="icon-lg"
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/20 text-white hover:bg-black/40 backdrop-blur-sm"
                onClick={prevImage}
                aria-label="Previous image"
              >
                <ChevronLeft size={32} />
              </Button>
              
              <Button
                variant="ghost"
                size="icon-lg"
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/20 text-white hover:bg-black/40 backdrop-blur-sm"
                onClick={nextImage}
                aria-label="Next image"
              >
                <ChevronRight size={32} />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
})

ImageGallery.displayName = "ImageGallery"

export { ImageGallery }

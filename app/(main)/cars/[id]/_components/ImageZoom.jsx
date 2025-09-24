"use client";

import React, { useState, useRef } from "react";
import OptimizedImage from "@/components/ui/optimized-image";
import { ZoomIn } from "lucide-react";

const ImageZoom = ({ 
  src, 
  alt, 
  onImageClick, 
  className = "",
  zoomLevel = 1.1,
  showZoomIndicator = true 
}) => {
  const [isHovering, setIsHovering] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);
  const imageRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!containerRef.current || !imageLoaded) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setMousePosition({ x, y });
  };

  const getZoomStyle = () => {
    if (!isHovering || !containerRef.current) return {};
    
    const rect = containerRef.current.getBoundingClientRect();
    const xPercent = (mousePosition.x / rect.width) * 100;
    const yPercent = (mousePosition.y / rect.height) * 100;
    
    return {
      transform: `scale(${zoomLevel})`,
      transformOrigin: `${xPercent}% ${yPercent}%`,
      transition: isHovering ? 'none' : 'transform 0.3s ease-out',
    };
  };

  return (
    <div 
      ref={containerRef}
      className={`relative overflow-hidden cursor-zoom-in group ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={onImageClick}
    >
      <div style={getZoomStyle()} className="w-full h-full">
        <OptimizedImage
          ref={imageRef}
          src={src}
          alt={alt}
          priority={false}
          quality={100}
          aspectRatio="aspect-video"
          containerClassName="w-full h-full"
          className="transition-none"
          objectFit="cover"
          onLoadComplete={() => setImageLoaded(true)}
          showLoadingSpinner={true}
        />
      </div>
      
      {/* Zoom indicator */}
      {showZoomIndicator && (
        <div className={`absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-md text-sm flex items-center gap-2 transition-opacity duration-300 ${
          isHovering ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        }`}>
          <ZoomIn className="h-4 w-4" />
          Click to zoom
        </div>
      )}
    </div>
  );
};

export default ImageZoom;

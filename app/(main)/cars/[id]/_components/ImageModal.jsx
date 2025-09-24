"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogOverlay,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Button } from "@/components/ui/button";
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Download,
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
} from "lucide-react";

const ImageModal = ({
  isOpen,
  onClose,
  images = [],
  currentIndex = 0,
  onIndexChange,
  carName = "",
}) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const imageRef = useRef(null);
  const containerRef = useRef(null);

  // Reset zoom and position when image changes
  useEffect(() => {
    setZoomLevel(1);
    setPosition({ x: 0, y: 0 });
  }, [currentIndex, isOpen]);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e) => {
      if (!isOpen) return;

      switch (e.key) {
        case "Escape":
          onClose();
          break;
        case "ArrowLeft":
          if (currentIndex > 0) {
            onIndexChange(currentIndex - 1);
          }
          break;
        case "ArrowRight":
          if (currentIndex < images.length - 1) {
            onIndexChange(currentIndex + 1);
          }
          break;
        case "+":
        case "=":
          handleZoomIn();
          break;
        case "-":
          handleZoomOut();
          break;
        case "0":
          handleResetZoom();
          break;
      }
    },
    [isOpen, currentIndex, images.length, onIndexChange, onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.5, 5));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.5, 0.5));
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e) => {
    if (zoomLevel > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && zoomLevel > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Mouse wheel zoom
  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.2 : 0.2;
    setZoomLevel((prev) => Math.max(0.5, Math.min(5, prev + delta)));
  };

  const handleDownload = async () => {
    if (!images[currentIndex]) return;

    try {
      const response = await fetch(images[currentIndex]);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${carName}-${currentIndex + 1}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  if (!isOpen || !images.length) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        ref={containerRef}
        className="w-screen h-screen sm:max-w-[95vw] sm:max-h-[95vh] sm:w-[95vw] sm:h-[95vh] p-0 bg-black/95 border-0 rounded-none sm:rounded-lg overflow-hidden"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
      >
        <VisuallyHidden>
          <DialogTitle>
            {carName} - Image {currentIndex + 1} of {images.length}
          </DialogTitle>
        </VisuallyHidden>

        {/* Close button - highest z-index and most visible */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            console.log("Close button clicked");
            onClose();
          }}
          className="fixed top-6 right-6 z-[9999] bg-red-600 hover:bg-red-700 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-2xl border-2 border-white transition-all duration-200 hover:scale-110"
          style={{ zIndex: 9999 }}
        >
          <X className="h-8 w-8" />
        </button>

        {/* Controls */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 flex items-center gap-2 bg-black/70 rounded-lg p-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleZoomOut}
            disabled={zoomLevel <= 0.5}
            className="text-white hover:bg-white/20"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>

          <span className="text-white text-sm px-2 min-w-[60px] text-center">
            {Math.round(zoomLevel * 100)}%
          </span>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleZoomIn}
            disabled={zoomLevel >= 5}
            className="text-white hover:bg-white/20"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleResetZoom}
            className="text-white hover:bg-white/20"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleDownload}
            className="text-white hover:bg-white/20"
          >
            <Download className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={toggleFullscreen}
            className="text-white hover:bg-white/20"
          >
            {isFullscreen ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Navigation arrows */}
        {images.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="lg"
              onClick={() => onIndexChange(Math.max(0, currentIndex - 1))}
              disabled={currentIndex === 0}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-[90] text-white hover:bg-white/20 disabled:opacity-30 bg-black/50 rounded-full w-12 h-12"
            >
              <ChevronLeft className="h-8 w-8" />
            </Button>

            <Button
              variant="ghost"
              size="lg"
              onClick={() =>
                onIndexChange(Math.min(images.length - 1, currentIndex + 1))
              }
              disabled={currentIndex === images.length - 1}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-[90] text-white hover:bg-white/20 disabled:opacity-30 bg-black/50 rounded-full w-12 h-12"
            >
              <ChevronRight className="h-8 w-8" />
            </Button>
          </>
        )}

        {/* Image counter */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-[80] bg-black/70 text-white px-3 py-1 rounded-lg text-sm">
            {currentIndex + 1} / {images.length}
          </div>
        )}

        {/* Main image */}
        <div className="flex items-center justify-center h-full w-full p-4 z-10 relative">
          <div
            ref={imageRef}
            className={`transition-transform origin-center relative z-10 ${
              zoomLevel > 1 ? "cursor-grab" : "cursor-zoom-in"
            } ${isDragging ? "cursor-grabbing" : ""}`}
            style={{
              transform: `scale(${zoomLevel}) translate(${
                position.x / zoomLevel
              }px, ${position.y / zoomLevel}px)`,
            }}
            onMouseDown={handleMouseDown}
            onClick={zoomLevel === 1 ? handleZoomIn : undefined}
          >
            <img
              src={images[currentIndex]}
              alt={`${carName} - Image ${currentIndex + 1}`}
              className="object-contain select-none max-w-[80vw] max-h-[80vh]"
              style={{
                width: 'auto',
                height: 'auto'
              }}
              draggable={false}
            />
          </div>
        </div>

        {/* Keyboard shortcuts help */}
        <div className="absolute bottom-4 right-4 z-[80] bg-black/70 text-white text-xs rounded-lg p-2 opacity-70">
          <div>← → Navigate</div>
          <div>+ - Zoom</div>
          <div>0 Reset</div>
          <div>ESC Close</div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageModal;

"use client";

import React, { useEffect, useState } from "react";

import { Input } from "./ui/input";
import { Camera, Loader2, Search, Trash, Upload } from "lucide-react";
import { Button } from "./ui/button";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import useFetch from "@/hooks/use-fetch";
import { processImageSearch } from "@/app/actions/home";

const HomeSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isImageSearchActive, setIsImageSearchActive] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const [searchImage, setSearchImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);

  const router = useRouter();

  const {
    loading: isProcessing,
    fn: processImageSearchFn,
    data: processImageSearchData,
    error: processImageSearchError,
  } = useFetch(processImageSearch);

  // Load recent searches from localStorage
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("recentSearches") || "[]");
      if (Array.isArray(saved)) setRecentSearches(saved);
    } catch {}
  }, []);

  const saveRecentSearch = (term) => {
    try {
      const trimmed = term.trim();
      if (!trimmed) return;
      const next = [
        trimmed,
        ...recentSearches.filter((t) => t !== trimmed),
      ].slice(0, 5);
      setRecentSearches(next);
      localStorage.setItem("recentSearches", JSON.stringify(next));
    } catch {}
  };

  const handleTextSearch = async (e) => {
    e.preventDefault();
    if (searchTerm.trim().length < 2) {
      // inline hint + disable handles UX; no toast
      return;
    }
    saveRecentSearch(searchTerm);
    router.push(`/cars?search=${encodeURIComponent(searchTerm.trim())}`);
  };

  const handleImageSearch = async (e) => {
    e.preventDefault();
    if (!searchImage || !imagePreview) {
      // show inline helper instead of toast
      return;
    }

    const match = imagePreview.match(/^data:(.+);base64,(.+)$/);
    if (!match) {
      toast.error("Invalid image data. Please re-upload the photo.");
      return;
    }

    const [, mimeType, base64Data] = match;

    await processImageSearchFn({
      data: base64Data,
      type: mimeType,
      name: searchImage.name || "search-image",
    });
  };

  useEffect(() => {
    if (processImageSearchError) {
      toast.error(
        "failed to process image search " + processImageSearchError ||
          "Something went wrong"
      );
    }
  }, [processImageSearchError]);

  useEffect(() => {
    if (processImageSearchData) {
      if (processImageSearchData.success && processImageSearchData.data) {
        const { make, bodyType, color } = processImageSearchData.data || {};
        const params = new URLSearchParams();
        if (make) params.set("make", make);
        if (bodyType) params.set("bodyType", bodyType);
        if (color) params.set("color", color);
        const query = params.toString();
        if (query) {
          router.push(`/cars?${query}`);
        } else {
          toast.warning(
            "Couldn't confidently detect details. Showing all cars."
          );
          router.push(`/cars`);
        }
      } else if (processImageSearchData.success === false) {
        toast.error(
          processImageSearchData.error || "Failed to process image search"
        );
      }
    }
  }, [processImageSearchData, router]);
  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];

    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }

      setIsUploading(true);
      setSearchImage(file);

      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
        setIsUploading(false);
        toast.success("Image Uploaded successfully");
      };

      reader.onerror = () => {
        setIsUploading(false);
        toast.error("Failed to read the image");
      };

      reader.readAsDataURL(file);
    }
  };

  const { getRootProps, getInputProps, isDragActive, isDragReject, open } =
    useDropzone({
      onDrop,
      accept: {
        "image/*": [".jpg", ".jpeg", ".png"],
      },
      maxFiles: 1,
      // Allow clicking on the dropzone to open file dialog
    });

  return (
    <div className="bg-black/10 backdrop-blur-[20px] border-2 border-black/20 rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-xl w-full mx-auto mb-6 sm:mb-8">
      <form
        onSubmit={handleTextSearch}
        className="flex flex-col gap-3 sm:gap-4"
      >
        <Button
          type="button"
          onClick={() => {
            const next = !isImageSearchActive;
            setIsImageSearchActive(next);
            if (next && !searchImage) {
              // Open file dialog when enabling image search and no image selected
              open();
            }
          }}
          className="w-full bg-black/40 text-white backdrop-blur-sm font-bold text-sm cursor-pointer h-11 sm:h-12 px-3 sm:px-4 border-2 border-dashed border-gray-300 hover:border-black hover:bg-red-700 transition-colors touch-target"
        >
          <Camera className="w-5 h-5 sm:w-6 sm:h-6 mr-2 cursor-pointer" />
          <span className="hidden xs:inline">Upload Photo</span>
          <span className="xs:hidden">Photo</span>
        </Button>
        <div className="flex flex-col sm:flex-row gap-2 flex-1">
          <Input
            type="text"
            placeholder="Search by make, model..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 h-11 sm:h-12 text-base sm:text-lg text-red-700 placeholder:text-black/70 placeholder:text-sm sm:placeholder:text-base bg-white/80 backdrop-blur-sm border-2 border-white/50 focus-visible:ring-offset-0 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:border-red-500 px-3 sm:px-4"
          />
          <div className="flex gap-2">
            <Button
              type="submit"
              className="flex-1 sm:flex-none h-11 sm:h-12 px-4 sm:px-6 bg-red-600 hover:bg-red-700 text-white font-semibold text-sm touch-target"
              disabled={isProcessing || searchTerm.trim().length < 2}
              aria-busy={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin mr-2" />
                  <span className="hidden sm:inline">Processing...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 sm:w-5 sm:h-5 sm:mr-2" />
                  <span className="hidden xs:inline">Search</span>
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="secondary"
              className="h-11 sm:h-12 px-3 sm:px-4 touch-target text-sm"
              onClick={() => {
                setSearchTerm("");
                setSearchImage(null);
                setImagePreview("");
              }}
            >
              Clear
            </Button>
          </div>
        </div>
      </form>

      {/* Inline helpers */}
      <div className="mt-2 sm:mt-3 space-y-1">
        {searchTerm && searchTerm.trim().length < 2 && (
          <p className="text-xs sm:text-sm text-gray-300">
            Enter at least 2 characters to search.
          </p>
        )}
        {isImageSearchActive && !searchImage && (
          <p className="text-xs sm:text-sm text-gray-300">
            Tip: add a car photo to analyze make/type/color.
          </p>
        )}
        <p className="text-xs text-gray-400">Formats: .jpg, .png · max 5MB</p>
      </div>

      {isImageSearchActive && (
        <div className="mt-4">
          <form onSubmit={handleImageSearch}>
            <div
              {...getRootProps()}
              className="border-2 border-dashed border-red-500 rounded-3xl p-8 text-center min-h-56 cursor-pointer"
            >
              <input {...getInputProps()} />
              {imagePreview ? (
                <div>
                  <img
                    src={imagePreview}
                    alt="Image"
                    className="h-full object-contain mb-4"
                  />
                  <Button
                    variant="destructive"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSearchImage(null);
                      setImagePreview("");
                      toast.info("Image is cleared");
                    }}
                  >
                    <Trash />
                    Delete Image
                  </Button>
                  <Button
                    type="button"
                    className="ml-2"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      open();
                    }}
                  >
                    Replace
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <Upload className="h-12 w-12 text-gray-400 mb-2" />
                  <p className="text-gray-400 text-lg">
                    {isDragActive && !isDragReject
                      ? "Leave the file here to upload "
                      : "Drag and drop a car image or click to select "}
                  </p>
                  {isDragReject && (
                    <p className="text-red-500 mb-2">Invalid image type</p>
                  )}
                  <p className="text-white text-sm">
                    Supports : JPG, PNG (max 5MB)
                  </p>
                </div>
              )}
            </div>

            {imagePreview && (
              <Button
                type="submit"
                className="w-full mt-2"
                disabled={isUploading || isProcessing}
                aria-busy={isUploading || isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 size="5" className="animate-spin" />
                    Analyzing image...
                  </>
                ) : isUploading ? (
                  <>
                    <Loader2 size="5" className="animate-spin" />
                    Uploading...
                  </>
                ) : (
                  "Search with this Image"
                )}
              </Button>
            )}
          </form>
        </div>
      )}

      {/* Recent searches and quick filters */}
      {(recentSearches.length > 0 || true) && (
        <div className="mt-4 space-y-2">
          {recentSearches.length > 0 && (
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-xs text-gray-400 mr-1">Recent:</span>
              {recentSearches.map((term) => (
                <button
                  key={term}
                  className="px-2 py-1 text-xs rounded-full bg-white/10 hover:bg-white/20 text-white"
                  onClick={() => {
                    setSearchTerm(term);
                    router.push(`/cars?search=${encodeURIComponent(term)}`);
                  }}
                >
                  {term}
                </button>
              ))}
            </div>
          )}
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs text-gray-400 mr-1">Popular:</span>
            {["Honda", "Toyota", "SUV", "Sedan"].map((label) => (
              <button
                key={label}
                className="px-2 py-1 text-xs rounded-full bg-white/10 hover:bg-white/20 text-white"
                onClick={() => {
                  const next = searchTerm ? `${searchTerm} ${label}` : label;
                  setSearchTerm(next);
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeSearch;

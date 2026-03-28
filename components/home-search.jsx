"use client";

import React, { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Camera, Loader2, Search, Trash, Upload, Car, Sparkles, X } from "lucide-react";
import { Button } from "./ui/button";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import useFetch from "@/hooks/use-fetch";
import { processImageSearch } from "@/app/actions/home";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const HomeSearch = () => {

  const [activeTab, setActiveTab] = useState("text"); // 'text' or 'image'
  const [searchTerm, setSearchTerm] = useState("");
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

  // Load recent searches
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
      const next = [trimmed, ...recentSearches.filter((t) => t !== trimmed)].slice(0, 5);
      setRecentSearches(next);
      localStorage.setItem("recentSearches", JSON.stringify(next));
    } catch {}
  };

  const handleTextSearch = async (e) => {
    e.preventDefault();
    if (searchTerm.trim().length < 2) return;
    saveRecentSearch(searchTerm);
    router.push(`/cars?search=${encodeURIComponent(searchTerm.trim())}`);
  };

  const handleImageSearch = async (e) => {
    e.preventDefault();
    if (!searchImage || !imagePreview) return;

    const match = imagePreview.match(/^data:(.+);base64,(.+)$/);
    if (!match) {
      toast.error("Invalid image data. Please re-upload.");
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
      toast.error(processImageSearchError || "Something went wrong");
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
        router.push(query ? `/cars?${query}` : `/cars`);
      } else {
        toast.error(processImageSearchData.error || "Failed to process image search");
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
        toast.success("Image uploaded successfully");
      };
      reader.onerror = () => {
        setIsUploading(false);
        toast.error("Failed to read image");
      };
      reader.readAsDataURL(file);
    }
  };

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpg", ".jpeg", ".png"] },
    maxFiles: 1,
  });

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Premium Glass Container */}
      <div className="bg-white/10 dark:bg-black/40 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden transition-all duration-300 hover:shadow-red-900/20">
        
        {/* Tabs */}
        <div className="flex border-b border-white/10">
          <button
            onClick={() => setActiveTab("text")}
            className={cn(
              "flex-1 py-4 text-sm sm:text-base font-medium transition-all duration-300 flex items-center justify-center gap-2",
              activeTab === "text"
                ? "bg-white/10 text-white shadow-[inset_0_-2px_0_0_#ef4444]"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            )}
          >
            <Search className="w-4 h-4" />
             'Quick Search'
          </button>
          <button
            onClick={() => setActiveTab("image")}
            className={cn(
              "flex-1 py-4 text-sm sm:text-base font-medium transition-all duration-300 flex items-center justify-center gap-2",
              activeTab === "image"
                ? "bg-white/10 text-white shadow-[inset_0_-2px_0_0_#ef4444]"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            )}
          >
            <Sparkles className="w-4 h-4 text-yellow-400" />
          'AI Image Search'
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 sm:p-8">
          <AnimatePresence mode="wait">
            {activeTab === "text" ? (
              <motion.form
                key="text-search"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                onSubmit={handleTextSearch}
                className="flex flex-col gap-4"
              >
                <div className="relative group">
                  <Input
                    type="text"
                    placeholder="Search by make, model..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="h-14 pl-12 pr-4 bg-black/20 border-white/10 text-white placeholder:text-gray-400 rounded-xl focus-visible:ring-red-500 focus-visible:border-red-500 text-lg transition-all group-hover:bg-black/30"
                  />
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-hover:text-white transition-colors" />
                  {searchTerm && (
                    <button
                      type="button"
                      onClick={() => setSearchTerm("")}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={searchTerm.trim().length < 2}
                  className="h-12 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl font-semibold text-lg shadow-lg shadow-red-900/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  Search Cars
                </Button>

                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="text-xs text-gray-400 self-center mr-1">Recent:</span>
                    {recentSearches.map((term) => (
                      <button
                        key={term}
                        type="button"
                        onClick={() => {
                          setSearchTerm(term);
                          router.push(`/cars?search=${encodeURIComponent(term)}`);
                        }}
                        className="px-3 py-1 text-xs rounded-full bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/5 transition-colors"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                )}
              </motion.form>
            ) : (
              <motion.div
                key="image-search"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {!imagePreview ? (
                  <div
                    {...getRootProps()}
                    className={cn(
                      "border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 group",
                      isDragActive
                        ? "border-red-500 bg-red-500/10"
                        : "border-white/20 hover:border-white/40 hover:bg-white/5"
                    )}
                  >
                    <input {...getInputProps()} />
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Camera className="w-8 h-8 text-gray-400 group-hover:text-white transition-colors" />
                    </div>
                    <p className="text-lg font-medium text-white mb-2">
                      {isDragActive ? "Drop it here!" : "Upload Car Photo"}
                    </p>
                    <p className="text-sm text-gray-400">
                      Drag & drop or click to select. AI will detect make, model & color.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="relative rounded-2xl overflow-hidden border border-white/20 group">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-64 object-cover"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => open()}
                          className="gap-2"
                        >
                          <Upload className="w-4 h-4" /> Replace
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            setSearchImage(null);
                            setImagePreview("");
                          }}
                          className="gap-2"
                        >
                          <Trash className="w-4 h-4" /> Remove
                        </Button>
                      </div>
                    </div>
                    <Button
                      onClick={handleImageSearch}
                      disabled={isProcessing}
                      className="w-full h-12 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl font-semibold text-lg shadow-lg shadow-red-900/20 transition-all hover:scale-[1.02]"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin mr-2" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5 mr-2" />
                          Analyze & Search
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default HomeSearch;

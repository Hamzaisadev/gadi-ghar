"use client";

import React, { useState } from "react";

import { Input } from "./ui/input";
import { Camera, Loader2, Search, Trash, Upload } from "lucide-react";
import { Button } from "./ui/button";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const HomeSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isImageSearchActive, setIsImageSearchActive] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const [searchImage, setSearchImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const router = useRouter();

  const handleTextSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      toast.error("Please enter a search term");
      return;
    }

    router.push(`/cars?search=${encodeURIComponent(searchTerm)}`);
  };

  const handleImageSearch = async (e) => {
    e.preventDefault();
    if (!searchImage) {
      toast.error("Please upload an image first");
      return;
    }
  };

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

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop,
      accept: {
        "image/*": [".jpg", ".jpeg", ".png"],
      },
      maxFiles: 1,
    });

  return (
    <div className="bg-black/10 backdrop-blur-[20px] border-2 border-black/20 rounded-xl p-4 shadow-xl max-w-2xl mx-auto mb-8">
      <form onSubmit={handleTextSearch} className="flex flex-col sm:flex-row gap-3">
      
      <Button type="button" onClick={() => setIsImageSearchActive(!isImageSearchActive)} className=" bg-black/40 text-white backdrop-blur-sm font-bold text-sm cursor-pointer h-12 px-4 border-2 border-dashed border-gray-300 hover:border-black hover:bg-red-700 transition-colors whitespace-nowrap">
        <Camera className="  w-8 h-8 mr-2 cursor-pointer  " 
              
               />
               Upload Photo
          
          
          </Button>


          <div className="flex gap-2 flex-1">
       
          <Input
            type="text"
            placeholder="Search by make, model..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} 
            className="pl-6 pr-6 pb-2  h-12  leading-tight focus-visible:ring-offset-0 focus-visible:ring-0 focus-visible:ring-white-500 focus-visible:border-white bg-red-/10  text-red-700  backdrop-blur-[1px] placeholder:text-black  placeholder:text-lg !text-2xl  "
          />
        <Button type="submit" className=" h-12 px-6 bg-red-600 hover:bg-red-700 text-white font-semibold text-sm whitespace-nowrap ">
        <Search className=" left-3 w-5 h-5" />
            Search
          </Button>
          

        </div>
        

      
      </form>

      {isImageSearchActive && (
        <div className="mt-4">
          <form onSubmit={handleImageSearch}>
            <div className="border-2 border-dashed border-red-500 rounded-3xl p-6 text-center">
              {imagePreview ? (
                <div>
                  <img
                    src={imagePreview}
                    alt="Image"
                    className="h-full object-contain mb-4"
                  />
                  <Button
                    variant="destructive"
                    onClick={() => {
                      setSearchImage(null);
                      setImagePreview("");
                      toast.info("Image is cleared");
                    }}
                  >
                    <Trash />
                    Delete Image
                  </Button>
                </div>
              ) : (
                <div {...getRootProps()} className="cursor-pointer">
                  <input {...getInputProps()} />
                  <div className="flex flex-col items-center">
                    <Upload className="h-12 w-12 text-gray-400 mb-2" />
                    <p
                      className="text-gray-400
                     text-lg"
                    >
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
                </div>
              )}
            </div>

            {imagePreview && (
              <Button
                type="submit"
                className="w-full mt-2"
                disabled={isUploading}
              >
                {isUploading ? (
                  <>
                    <Loader2 size="5" className="animate-spin" />
                    Creating
                  </>
                ) : (
                  "Search with this Image"
                )}
              </Button>
            )}
          </form>
        </div>
      )}
    </div>
  );
};

export default HomeSearch;

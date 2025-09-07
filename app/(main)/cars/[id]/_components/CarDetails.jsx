"use client";

import { toggleSavedCar } from "@/app/actions/car-listing";
import ShareDialog from "@/components/shareDialog";
import { Button } from "@/components/ui/button";
import OptimizedImage from "@/components/ui/optimized-image";
import useFetch from "@/hooks/use-fetch";
import { useAuth } from "@clerk/nextjs";
import { disableInstantTransitions } from "framer-motion";
import { CarIcon, Heart, Share2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const CarDetails = ({ car, testDriveInfo }) => {
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const [isWishlisted, setIsWishlisted] = useState(car.wishlisted);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [carToShare, setCarToShare] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isSharing, setIsSharing] = useState(false);

  useEffect(() => {
    console.log("Current image index changed to:", currentImageIndex);
    console.log("Current image URL:", car.images?.[currentImageIndex]);
  }, [currentImageIndex, car.images]);

  const {
    loading: savingCar,
    fn: toggleSavedCarfn,
    data: toggleResult,
    error: toggleError,
  } = useFetch(toggleSavedCar);

  useEffect(() => {
    if (toggleResult?.success && toggleResult?.saved !== isWishlisted) {
      setIsWishlisted(toggleResult.saved);
      toast.success(toggleResult.message);
    }
  }, [toggleResult, isWishlisted]);

  useEffect(() => {
    if (toggleError) {
      toast.error("Failed to toggle saved car");
    }
  }, [toggleError]);

  const handleSaveCar = async (e) => {
    e.preventDefault();
    if (!isSignedIn) {
      toast.error("Please sign in to save a car");
      router.push("/sign-in");
      return;
    }

    if (savingCar) return;

    await toggleSavedCarfn(car.id);
  };

  const handleShare = async (car) => {
    if (isSharing) {
      return; // Prevent multiple concurrent share operations
    }

    setIsSharing(true);
    try {
      const shareUrl = `${window.location.origin}/cars/${car.id}`;
      if (navigator.share) {
        await navigator.share({
          title: `${car.make} ${car.model} - GadiGhar`,
          text: `Check out this ${car.make} ${car.model} ${car.year} on GadiGhar`,
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Link copied to clipboard!");
      }
    } catch (err) {
      if (err.name !== "AbortError") {
        console.error("Error sharing:", err);
        toast.error("Failed to share. Please try again.");
      }
    } finally {
      setIsSharing(false);
      setShareDialogOpen(false);
      setCarToShare(null);
    }
  };

  return (
    <div>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-7/12">
          <div className="aspect-video rounded-lg overflow-hidden relative mb-4">
            {car.images && car.images.length > 0 ? (
              <OptimizedImage
                key={`main-image-${currentImageIndex}`}
                src={car.images[currentImageIndex]}
                alt={car.make + " " + car.model}
                priority={false} // Lazy load car cards
                quality={100}
                aspectRatio="h-full"
              />
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center rounded-lg">
                <CarIcon className="h-16 w-16 text-gray-400" />
              </div>
            )}
          </div>
          {car.images && car.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {car.images.map((image, index) => {
                console.log(image, car.images);

                return (
                  <div
                    key={index}
                    className={`relative cursor-pointer rounded-md h-20 w-24 flex-shrink-0 transition ${
                      index === currentImageIndex
                        ? "border-2 border-red-600"
                        : "opacity-70 hover:opacity-100"
                    }`}
                    onClick={() => {
                      console.log(
                        "Clicked thumbnail:",
                        index,
                        "Current:",
                        currentImageIndex
                      );
                      setCurrentImageIndex(index);
                    }}
                  >
                    <OptimizedImage
                      src={image}
                      alt={car.make + " " + car.model}
                      priority={false} // Lazy load car cards
                      quality={80}
                      aspectRatio="h-full"
                    />
                  </div>
                );
              })}
            </div>
          )}

          <div>
            <Button
              variant="outline"
              className={`flex items-center gap-2 flex-1  ${
                isWishlisted ? "text-red-500" : ""
              }`}
              onClick={handleSaveCar}
              disabled={savingCar}
            >
              <Heart
                className={`h-5 w-5 ${isWishlisted ? "fill-red-500" : ""}`}
              />

              {isWishlisted ? "Saved" : "Save"}
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2 flex-1 "
              disabled={isSharing}
              onClick={(e) => {
                e.stopPropagation();
                if (!isSharing) {
                  setCarToShare(car);
                  setShareDialogOpen(true);
                }
              }}
            >
              <Share2 className="h-5 w-5" />
              {isSharing ? "Sharing..." : "Share"}
            </Button>
          </div>
        </div>
      </div>
      <ShareDialog
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
        carToShare={carToShare}
        onShare={handleShare}
      />
    </div>
  );
};

export default CarDetails;

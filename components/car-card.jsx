"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "./ui/card";
import OptimizedImage from "./ui/optimized-image";
import {
  CarIcon,
  Heart,
  Gauge,
  Fuel,
  Settings,
  Users,
  Building2,
} from "lucide-react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { Badge } from "./ui/badge";
import { formatPriceRange } from "./utils/FormatCurrency";
import useFetch from "@/hooks/use-fetch";
import { toggleSavedCar } from "@/app/actions/car-listing";
import { useAuth } from "@clerk/nextjs";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const CarCard = ({ car }) => {
  const [isSaved, setIsSaved] = useState(car.wishlisted);
  const [isNavigating, setIsNavigating] = useState(false);
  const router = useRouter();
  const { isSignedIn } = useAuth();

  const {
    loading: isToggling,
    fn: toggleSavedCarfn,
    data: toggleResult,
    error: toggleError,
  } = useFetch(toggleSavedCar);

  useEffect(() => {
    if (toggleResult?.success && toggleResult?.saved !== isSaved) {
      setIsSaved(toggleResult.saved);
      toast.success(toggleResult.message);
    }
  }, [toggleResult, isSaved]);

  useEffect(() => {
    if (toggleError) {
      toast.error("Failed to toggle saved car");
    }
  }, [toggleError]);

  
  const handleToggleClick = async (e) => {
    e.preventDefault();
    if (!isSignedIn) {
      toast.error("Please sign in to save a car");
      router.push("/sign-in");
      return;
    }

    if (isToggling) return;

    await toggleSavedCarfn(car.id);
  };

  const handleViewDetails = async () => {
    setIsNavigating(true);
    // Add a small delay for visual feedback
    await new Promise(resolve => setTimeout(resolve, 100));
    router.push(`/cars/${car.id}`);
  };

  return (
    <Card className="group overflow-hidden bg-white rounded-xl sm:rounded-2xl shadow-md sm:shadow-lg border border-gray-100 hover:shadow-xl sm:hover:shadow-2xl hover:shadow-red-600/10 hover:scale-[1.01] sm:hover:scale-[1.02] transition-all duration-300 cursor-pointer w-full max-w-sm sm:max-w-none mx-auto">
      {/* Image */}
      <div className="relative h-48 xs:h-52 sm:h-56 md:h-64 lg:h-72 overflow-hidden">
        {car.images?.length > 0 ? (
          <OptimizedImage
            src={car.images[0]}
            alt={`${car.make} ${car.model} - Car for sale`}
            containerClassName="h-full"
            className="transition-transform duration-700 ease-in-out group-hover:scale-110 group-hover:rotate-1"
            priority={false} // Lazy load car cards
            quality={80}
            aspectRatio="h-full"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center transition-all duration-700 group-hover:bg-gray-200">
            <CarIcon className="h-16 w-16 text-gray-400 transition-transform duration-700 group-hover:scale-110" />
          </div>
        )}
        
        {/* Overlay gradient for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Price bottom-left */}
        <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 bg-red-600/95 text-white px-2 py-1 sm:px-3 sm:py-1.5 rounded-md sm:rounded-lg font-semibold shadow-lg
          text-sm xs:text-base sm:text-lg md:text-xl">
          {formatPriceRange(car.minPrice || car.price, car.maxPrice)}
        </div>

        {/* Heart Button */}
        <button
          onClick={handleToggleClick}
          className={`absolute top-2 right-2 sm:top-3 sm:right-3 rounded-full p-1.5 sm:p-2 bg-white/90 backdrop-blur-md shadow-md transition transform hover:scale-110 touch-target-sm sm:touch-target
            ${isSaved ? "text-red-600" : "text-gray-700 hover:text-black"}`}
        >
          {isToggling ? (
            <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
          ) : (
            <Heart
              className={`transition ${
                isSaved ? "fill-current scale-110" : ""
              }`}
              size={20}
              className="w-4 h-4 sm:w-5 sm:h-5"
            />
          )}
        </button>
      </div>

      {/* Content */}
      <CardContent className="p-4 sm:p-5 md:p-6">
        {/* Title */}
        <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 line-clamp-2 sm:truncate">
          {car.make} {car.model}{" "}
          <span className="text-gray-500 font-medium text-sm sm:text-base">({car.year})</span>
        </h3>

        {/* Specs Grid */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3 text-sm sm:text-base md:text-lg text-gray-800 mb-4 sm:mb-5">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Settings size={16} className="text-red-600 sm:w-5 sm:h-5 flex-shrink-0" />
            <span className="font-medium truncate">{car.transmission}</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Fuel size={16} className="text-red-600 sm:w-5 sm:h-5 flex-shrink-0" />
            <span className="font-medium truncate">{car.fuelType}</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Gauge size={16} className="text-red-600 sm:w-5 sm:h-5 flex-shrink-0" />
            <span className="font-medium truncate">
              {car.mileage?.toLocaleString() || 0} mi
            </span>
          </div>
          {car.seats != null && (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Users size={16} className="text-red-600 sm:w-5 sm:h-5 flex-shrink-0" />
              <span className="font-medium truncate">{car.seats} seats</span>
            </div>
          )}
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3">
          <Badge className="bg-black text-white rounded-full px-2 py-0.5 sm:px-3 sm:py-1 text-xs sm:text-sm md:text-base font-medium">
            {car.bodyType}
          </Badge>
          <Badge className="bg-gray-200 text-gray-800 rounded-full px-2 py-0.5 sm:px-3 sm:py-1 text-xs sm:text-sm md:text-base font-medium">
            {car.color}
          </Badge>
        </div>

        {/* Dealership Info */}
        {car.dealership && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center gap-2 mb-1">
              <Building2 className="h-4 w-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                Dealership
              </span>
            </div>
            <div className="text-sm text-gray-600">
              <div className="font-medium">{car.dealership.name}</div>
              <div className="text-xs">{car.dealership.address}</div>
            </div>
          </div>
        )}

        {/* CTA */}
        <Button
          className="w-full bg-red-600 hover:bg-red-700 hover:scale-[1.01] sm:hover:scale-[1.02] transition-transform duration-300 text-white font-medium py-2.5 sm:py-3 rounded-md sm:rounded-lg text-sm sm:text-base md:text-lg touch-target"
          onClick={handleViewDetails}
          disabled={isNavigating}
        >
          {isNavigating ? (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm sm:text-base">Loading...</span>
            </div>
          ) : (
            "View Details"
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default CarCard;

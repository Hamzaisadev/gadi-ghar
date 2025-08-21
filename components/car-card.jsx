"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "./ui/card";
import Image from "next/image";
import { CarIcon, Heart, Gauge, Fuel, Settings, Users } from "lucide-react";
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

  return (
    <Card className="group overflow-hidden bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl hover:scale-[1.02] transition-transform duration-300">
      {/* Image */}
      <div className="relative h-64 md:h-72">
        {car.images?.length > 0 ? (
          <Image
            src={car.images[0]}
            alt={`${car.make} ${car.model}`}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <CarIcon className="h-16 w-16 text-gray-400" />
          </div>
        )}

        {/* Price bottom-left */}
        <div className="absolute bottom-3 left-3 bg-red-600/95 text-white px-4 py-1.5 rounded-lg text-lg md:text-xl font-semibold shadow-lg">
          {formatPriceRange(car.minPrice || car.price, car.maxPrice)}
        </div>

        {/* Heart Button */}
        <button
          onClick={handleToggleClick}
          className={`absolute top-3 right-3 rounded-full p-2 bg-white/90 backdrop-blur-md shadow-md transition transform hover:scale-110
            ${isSaved ? "text-red-600" : "text-gray-700 hover:text-black"}`}
        >
          {isToggling ? (
            <Loader2 className="h-4 w-4 animate-spin  " />
          ) : (
            <Heart
              className={`transition ${
                isSaved ? "fill-current scale-110" : ""
              }`}
              size={24}
            />
          )}
        </button>
      </div>

      {/* Content */}
      <CardContent className="p-6">
        {/* Title */}
        <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 truncate">
          {car.make} {car.model}{" "}
          <span className="text-gray-500 font-medium">({car.year})</span>
        </h3>

        {/* Specs Grid */}
        <div className="grid grid-cols-2 gap-3 text-base md:text-lg text-gray-800 mb-5">
          <div className="flex items-center gap-2">
            <Settings size={20} className="text-red-600" />
            <span className="font-medium">{car.transmission}</span>
          </div>
          <div className="flex items-center gap-2">
            <Fuel size={20} className="text-red-600" />
            <span className="font-medium">{car.fuelType}</span>
          </div>
          <div className="flex items-center gap-2">
            <Gauge size={20} className="text-red-600" />
            <span className="font-medium">
              {car.mileage.toLocaleString()} mi
            </span>
          </div>
          {car.seat != null && (
            <div className="flex items-center gap-2">
              <Users size={20} className="text-red-600" />
              <span className="font-medium">{car.seat} seats</span>
            </div>
          )}
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-5">
          <Badge className="bg-black text-white rounded-full px-3 py-1 text-sm md:text-base font-medium">
            {car.bodyType}
          </Badge>
          <Badge className="bg-gray-200 text-gray-800 rounded-full px-3 py-1 text-sm md:text-base font-medium">
            {car.color}
          </Badge>
        </div>

        {/* CTA */}
        <Button
          className="w-full bg-red-600 hover:bg-red-700 hover:scale-[1.02] transition-transform duration-300 text-white font-medium py-3 rounded-lg text-base md:text-lg"
          onClick={() => router.push(`/cars/${car.id}`)}
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  );
};

export default CarCard;

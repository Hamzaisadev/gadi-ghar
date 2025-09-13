"use client";

import { toggleSavedCar } from "@/app/actions/car-listing";
import ShareDialog from "@/components/shareDialog";
import { Button } from "@/components/ui/button";
import OptimizedImage from "@/components/ui/optimized-image";
import useFetch from "@/hooks/use-fetch";
import { useAuth } from "@clerk/nextjs";
import {
  CarIcon,
  Heart,
  Share2,
  Calendar,
  MessageSquare,
  Currency,
  Gauge,
  Fuel,
  Car,
  AlertCircle,
  LocateFixed,
  Phone,
  Mail,
  Building2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import EmiCalculator from "./emi-calculator";
import {
  formatCurrency,
  formatPriceRange,
} from "@/components/utils/FormatCurrency";
import { formatWorkingHours, formatDayName } from "@/lib/timeUtils";
import { format } from "date-fns";
import Breadcrumb from "@/components/ui/breadcrumb";

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

  const handleBookTestDrive = () => {
    if (!isSignedIn) {
      toast.error("Please sign in to book a test drive");
      router.push("/sign-in");
      return;
    }
    router.push(`/test-drive/${car.id}`);
  };

  return (
    <div>
      {/* Breadcrumb Navigation */}
      <Breadcrumb 
        items={[
          { label: "Home", href: "/" },
          { label: "Cars", href: "/cars" },
          { label: `${car.year} ${car.make} ${car.model}` }
        ]}
        className="mb-6 mx-4"
      />

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Image Gallery */}
        <div className="w-full lg:w-7/12">
          <div className="group aspect-video rounded-lg overflow-hidden relative mb-4 bg-gray-100 cursor-zoom-in">
            {car.images && car.images.length > 0 ? (
              <OptimizedImage
                key={`main-image-${currentImageIndex}`}
                src={car.images[currentImageIndex]}
                alt={car.make + " " + car.model}
                priority={false}
                quality={100}
                aspectRatio="h-full"
                className="transition-transform duration-700 ease-in-out group-hover:scale-110"
              />
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center rounded-lg transition-all duration-300 group-hover:bg-gray-200">
                <CarIcon className="h-16 w-16 text-gray-400 transition-transform duration-300 group-hover:scale-110" />
              </div>
            )}
            
            {/* Zoom indicator */}
            <div className="absolute top-4 right-4 bg-black/70 text-white px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              Click to zoom
            </div>
          </div>

          {/* Thumbnails */}
          {car.images && car.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {car.images.map((image, index) => {
                console.log(image, car.images);

                return (
                  <div
                    key={index}
                    className={`group relative cursor-pointer rounded-md h-20 w-24 flex-shrink-0 overflow-hidden transition-all duration-300 ${
                      index === currentImageIndex
                        ? "border-2 border-red-600 shadow-lg scale-105"
                        : "opacity-70 hover:opacity-100 hover:scale-105 hover:shadow-md border-2 border-transparent hover:border-red-300"
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
                      priority={false}
                      quality={80}
                      aspectRatio="h-full"
                      className="transition-transform duration-300 group-hover:scale-110"
                    />
                    
                    {/* Active indicator overlay */}
                    {index === currentImageIndex && (
                      <div className="absolute inset-0 bg-red-600/10 flex items-center justify-center">
                        <div className="w-3 h-3 bg-red-600 rounded-full shadow-lg"></div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex mt-4 gap-4">
            <Button
              variant={isWishlisted ? "default" : "outline"}
              className={`flex items-center gap-2 flex-1 transition-all duration-200 ${
                isWishlisted 
                  ? "bg-red-600 hover:bg-red-700 text-white border-red-600" 
                  : "border-red-600 text-red-600 hover:bg-red-50"
              }`}
              onClick={handleSaveCar}
              disabled={savingCar}
            >
              <Heart
                className={`h-5 w-5 ${isWishlisted ? "fill-white" : ""}`}
              />
              {isWishlisted ? "Saved" : "Save"}
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2 flex-1 border-red-600 text-red-600 hover:bg-red-50 transition-all duration-200"
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

        {/* Car Details */}
        <div className="w-full lg:w-5/12">
          <div className="flex items-center justify-between">
            <Badge className="mb-2 bg-red-600 hover:bg-red-700 text-white border-red-600">{car.bodyType}</Badge>
          </div>

          <h1 className="text-4xl font-bold mb-1">
            {car.year} {car.make} {car.model}
          </h1>

          <div className="text-2xl font-bold text-red-600">
            {formatPriceRange(car.minPrice || car.price, car.maxPrice)}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 my-6">
            <div className="flex items-center gap-2">
              <Gauge className="text-gray-500 h-5 w-5" />
              <span>{car.mileage?.toLocaleString() || 0} miles</span>
            </div>
            <div className="flex items-center gap-2">
              <Fuel className="text-gray-500 h-5 w-5" />
              <span>{car.fuelType}</span>
            </div>
            <div className="flex items-center gap-2">
              <Car className="text-gray-500 h-5 w-5" />
              <span>{car.transmission}</span>
            </div>
          </div>

          {/* EMI Calculator Card */}
          <Dialog>
            <DialogTrigger className="w-full text-start">
              <Card className="pt-5 hover:shadow-md transition-shadow cursor-pointer">
                <CardContent>
                  <div className="flex items-center gap-2 text-lg font-medium mb-2">
                    <Currency className="h-5 w-5 text-red-600" />
                    <h3>EMI Calculator</h3>
                  </div>
                  <div className="text-sm text-gray-600">
                    Estimated Monthly Payment:{" "}
                    <span className="font-bold text-gray-900">
                      {formatCurrency(((Number(car.minPrice) + Number(car.maxPrice)) / 2) / 60)}
                    </span>{" "}
                    for 60 months
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    *Based on $0 down payment and 8.5% interest rate
                  </div>
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Car Loan Calculator</DialogTitle>
              </DialogHeader>
              <EmiCalculator 
                price={(Number(car.minPrice) + Number(car.maxPrice)) / 2}
                minPrice={Number(car.minPrice)}
                maxPrice={Number(car.maxPrice)}
              />
            </DialogContent>
          </Dialog>

          {/* Request More Info */}
          <Card className="my-6">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-lg font-medium mb-2">
                <MessageSquare className="h-5 w-5 text-red-600" />
                <h3>Have Questions?</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Our representatives are available to answer all your queries
                about this vehicle.
              </p>
              <a href="mailto:help@gadighar.com">
                <Button variant="outline" className="w-full border-red-600 text-red-600 hover:bg-red-50 transition-all duration-200">
                  Request Info
                </Button>
              </a>
            </CardContent>
          </Card>

          {/* Status Alert */}
          {(car.status === "SOLD" || car.status === "UNAVAILABLE") && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle className="capitalize">
                This car is {car.status.toLowerCase()}
              </AlertTitle>
              <AlertDescription>Please check again later.</AlertDescription>
            </Alert>
          )}

          {/* Book Test Drive Button */}
          {car.status !== "SOLD" && car.status !== "UNAVAILABLE" && (
            <Button
              className="w-full py-6 text-lg bg-red-600 hover:bg-red-700 text-white border-red-600 shadow-lg hover:shadow-xl transition-all duration-200"
              onClick={handleBookTestDrive}
              disabled={testDriveInfo.userTestDrive}
            >
              <Calendar className="mr-2 h-5 w-5" />
              {testDriveInfo.userTestDrive
                ? `Booked for ${format(
                    new Date(testDriveInfo.userTestDrive.bookingDate),
                    "EEEE, MMMM d, yyyy"
                  )}`
                : "Book Test Drive"}
            </Button>
          )}
        </div>
      </div>

      {/* Details & Features Section */}
      <div className="mt-12 p-6 bg-white rounded-lg shadow-sm border-l-4 border-l-red-600">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-6 text-gray-900">Description</h3>
            <p className="whitespace-pre-line text-gray-700 leading-relaxed">
              {car.description}
            </p>
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-6 text-gray-900">Features</h3>
            <ul className="grid grid-cols-1 gap-2">
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 bg-red-600 rounded-full"></span>
                {car.transmission} Transmission
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 bg-red-600 rounded-full"></span>
                {car.fuelType} Engine
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 bg-red-600 rounded-full"></span>
                {car.bodyType} Body Style
              </li>
              {car.seats && (
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 bg-red-600 rounded-full"></span>
                  {car.seats} Seats
                </li>
              )}
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 bg-red-600 rounded-full"></span>
                {car.color} Exterior
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Specifications Section */}
      <div className="mt-8 p-6 bg-white rounded-lg shadow-sm border-l-4 border-l-red-600">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">Specifications</h2>
        <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-lg p-6 border border-red-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Make</span>
              <span className="font-medium">{car.make}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Model</span>
              <span className="font-medium">{car.model}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Year</span>
              <span className="font-medium">{car.year}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Body Type</span>
              <span className="font-medium">{car.bodyType}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Fuel Type</span>
              <span className="font-medium">{car.fuelType}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Transmission</span>
              <span className="font-medium">{car.transmission}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Mileage</span>
              <span className="font-medium">
                {car.mileage?.toLocaleString() || 0} miles
              </span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Color</span>
              <span className="font-medium">{car.color}</span>
            </div>
            {car.seats && (
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Seats</span>
                <span className="font-medium">{car.seats}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dealership Location Section */}
      <div className="mt-8 p-6 bg-white rounded-lg shadow-sm border-l-4 border-l-red-600">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Dealership Information</h2>
          {(car.dealership?.name || testDriveInfo.dealership?.name) && (
            <Button 
              variant="outline" 
              className="border-red-600 text-red-600 hover:bg-red-50"
              onClick={() => {
                const dealershipName = (car.dealership?.name || testDriveInfo.dealership?.name)
                  .toLowerCase()
                  .replace(/[^a-z0-9\s]/g, '')
                  .replace(/\s+/g, '-');
                router.push(`/profile/${dealershipName}`);
              }}
            >
              <Building2 className="h-4 w-4 mr-2" />
              View Dealership
            </Button>
          )}
        </div>
        <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-lg p-6 border border-red-200">
          <div className="flex flex-col md:flex-row gap-6 justify-between">
            {/* Dealership Logo and Info */}
            <div className="flex items-start gap-4">
              {/* Dealership Logo */}
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center border-2 border-red-300 shadow-sm">
                  {(car.dealership?.logo || testDriveInfo.dealership?.logo) ? (
                    <OptimizedImage
                      src={car.dealership?.logo || testDriveInfo.dealership?.logo}
                      alt={(car.dealership?.name || testDriveInfo.dealership?.name || "Dealership") + " logo"}
                      quality={90}
                      aspectRatio="w-full h-full object-contain"
                    />
                  ) : (
                    <Building2 className="h-8 w-8 text-red-600" />
                  )}
                </div>
              </div>
              
              {/* Dealership Details */}
              <div className="flex-1">
                <h4 className="font-semibold text-xl text-gray-900 mb-2">
                  {car.dealership?.name || testDriveInfo.dealership?.name || "Gadi Ghar"}
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-700">
                    <LocateFixed className="h-4 w-4 text-red-600" />
                    <span className="text-sm">
                      {car.dealership?.address || testDriveInfo.dealership?.address || "Address not available"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Phone className="h-4 w-4 text-red-600" />
                    <span className="text-sm">
                      {car.dealership?.phone || testDriveInfo.dealership?.phone || "Contact not available"}
                    </span>
                  </div>
                  {(car.dealership?.email || testDriveInfo.dealership?.email) && (
                    <div className="flex items-center gap-2 text-gray-700">
                      <Mail className="h-4 w-4 text-red-600" />
                      <span className="text-sm">
                        {car.dealership?.email || testDriveInfo.dealership?.email}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Working Hours */}
            <div className="md:w-1/2 lg:w-1/3">
              <h4 className="font-medium mb-2">Working Hours</h4>
              <div className="space-y-2">
                {testDriveInfo.dealership?.workingHours
                  ? testDriveInfo.dealership.workingHours
                      .sort((a, b) => {
                        const days = [
                          "MONDAY",
                          "TUESDAY",
                          "WEDNESDAY",
                          "THURSDAY",
                          "FRIDAY",
                          "SATURDAY",
                          "SUNDAY",
                        ];
                        return (
                          days.indexOf(a.dayOfWeek) - days.indexOf(b.dayOfWeek)
                        );
                      })
                      .map((day) => (
                        <div
                          key={day.dayOfWeek}
                          className="flex justify-between text-sm"
                        >
                          <span className="text-gray-600">
                            {formatDayName(day.dayOfWeek)}
                          </span>
                          <span>
                            {formatWorkingHours(day)}
                          </span>
                        </div>
                      ))
                  : // Default hours if none provided
                    [
                      "Monday",
                      "Tuesday",
                      "Wednesday",
                      "Thursday",
                      "Friday",
                      "Saturday",
                      "Sunday",
                    ].map((day, index) => (
                      <div key={day} className="flex justify-between text-sm">
                        <span className="text-gray-600">{day}</span>
                        <span>
                          {index < 5
                            ? "9:00 AM - 6:00 PM"
                            : index === 5
                            ? "10:00 AM - 4:00 PM"
                            : "Closed"}
                        </span>
                      </div>
                    ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Share Dialog */}
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

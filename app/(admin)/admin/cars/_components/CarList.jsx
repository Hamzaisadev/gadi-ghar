"use client";

import { deleteCars, getCars, updateCarStatus } from "@/app/actions/cars";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PageWrapper from "@/components/utils/pageWrapper";
import {
  Edit,
  Eye,
  Loader2,
  Plus,
  Search,
  Star,
  Trash2,
  Users,
  Fuel,
  Gauge,
  Share2,
  Calendar,
  Palette,
  Zap,
  Car,
  Copy,
  MessageSquare,
} from "lucide-react";
import { toast } from "sonner";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import useFetch from "@/hooks/use-fetch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPriceRange } from "@/components/utils/FormatCurrency";
import Image from "next/image";

// Loader overlay for image
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Badge } from "@/components/ui/badge";





const ShareDialog = ({ open, onOpenChange, carToShare, onShare }) => {
  if (!carToShare) return null;
  
  const shareUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/cars/${carToShare.id}`;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share {carToShare.make} {carToShare.model}</DialogTitle>
          <DialogDescription>
            Share this car listing with others
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="grid flex-1 gap-1.5">
              <Input
                id="share-link"
                value={shareUrl}
                readOnly
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Anyone with this link can view this car listing
              </p>
            </div>
            <Button
              type="button"
              size="icon"
              variant="outline"
              className="shrink-0"
              onClick={() => {
                navigator.clipboard.writeText(shareUrl);
                toast.success("Link copied to clipboard!");
              }}
            >
              <Copy className="h-4 w-4" />
              <span className="sr-only">Copy link</span>
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onShare(carToShare)}
            >
              <Share2 className="mr-2 h-4 w-4" />
              Share via...
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                window.open(`https://wa.me/?text=Check out this ${encodeURIComponent(carToShare.make + ' ' + carToShare.model)} on GadiGhar: ${shareUrl}`, '_blank');
              }}
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              WhatsApp
            </Button>
          </div>
        </div>
        
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
const ImageWithLoader = ({ src, alt, width, height, className }) => {
  const [loading, setLoading] = useState(true);
  return (
    <div className="relative w-full h-full">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/60 z-10">
          <svg
            className="animate-spin h-8 w-8 text-car-red"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8z"
            ></path>
          </svg>
        </div>
      )}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        onLoadingComplete={() => setLoading(false)}
        onLoad={() => setLoading(false)}
      />
    </div>
  );
};




const CarList = () => {
  const [search, setSearch] = useState("");
  const router = useRouter();

  // State for delete dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [carToShare, setCarToShare] = useState(null);
  const [carToDelete, setCarToDelete] = useState(null);

  // Per-card loading state
  const [loadingFeature, setLoadingFeature] = useState({}); // { [carId]: boolean }
  const [loadingStatus, setLoadingStatus] = useState({}); // { [carId]: boolean }

  // Local cars state for optimistic updates
  const [localCars, setLocalCars] = useState([]);

  const handleShare = async (car) => {
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
      if (err.name !== 'AbortError') {
        console.error('Error sharing:', err);
        toast.error("Failed to share. Please try again.");
      }
    } finally {
      setShareDialogOpen(false);
      setCarToShare(null);
    }
  };
  


  const {
    loading: loadingCars,
    fn: fetchCars,
    data: carsData,
    error: carsError,
  } = useFetch(getCars);

  const {
    loading: deletingCar,
    fn: deleteCarFn,
    data: deleteResult,
    error: deleteError,
  } = useFetch(deleteCars);

  const {
    loading: updatingCar,
    fn: updateCarStatusFn,
    data: updateResult,
    error: updateError,
  } = useFetch(updateCarStatus);

  // Sync localCars with fetched data
  useEffect(() => {
    if (carsData?.data) setLocalCars(carsData.data);
  }, [carsData]);

  // Local state for instant UI updates
  const [cars, setCars] = useState([]);

  // Initial fetch and refetch on search changes
  useEffect(() => {
    fetchCars(search);
  }, [search]);

  useEffect(() => {
    if (carsError) {
      // toast.error("Failed to load cars");
    }

    if (deleteError) {
      // toast.error("Failed to delete car");
    }

    if (updateError) {
      // toast.error("Failed to update car");
    }
  }, [carsError, deleteError, updateError]);

  // Handle successful operations
  useEffect(() => {
    if (deleteResult?.success) {
      // toast.success("Car deleted successfully");
      setDeleteDialogOpen(false);
      setCarToDelete(null);
    }
    if (updateResult?.success) {
      // toast.success("Car updated successfully");
    }
  }, [deleteResult, updateResult, search]);

  // Handle search submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchCars(search);
  };

  // Handle delete car (with loading state in dialog)
  const handleDeleteCar = async () => {
    if (!carToDelete) return;
    await deleteCarFn(carToDelete.id); // Show loading while waiting
    setDeleteDialogOpen(false);
    setCarToDelete(null);
    // Remove from UI after loading finishes (API call completes)
    setLocalCars((prev) => prev.filter((car) => car.id !== carToDelete.id));
    // Optionally, refetch for consistency
    // fetchCars(search);
  };

  // Optimistic toggle featured
  const handleToggleFeatured = async (car) => {
    setLoadingFeature((prev) => ({ ...prev, [car.id]: true }));
    try {
      await updateCarStatusFn(car.id, { featured: !car.featured });
      // Update local state after API call
      setLocalCars((prev) =>
        prev.map((c) =>
          c.id === car.id ? { ...c, featured: !car.featured } : c
        )
      );
    } catch (error) {
      // handle error, maybe show a toast
    }
    setLoadingFeature((prev) => ({ ...prev, [car.id]: false }));
  };

  // Optimistic status update
  const handleStatusUpdate = async (car, newStatus) => {
    setLoadingStatus((prev) => ({ ...prev, [car.id]: true }));
    try {
      await updateCarStatusFn(car.id, { status: newStatus.toUpperCase() });
      // Update local state after API call
      setLocalCars((prev) =>
        prev.map((c) =>
          c.id === car.id ? { ...c, status: newStatus.toUpperCase() } : c
        )
      );
    } catch (err) {
      toast.error("Failed to update car status");
    }
    setLoadingStatus((prev) => ({ ...prev, [car.id]: false }));
  };
  const getStatusBadge = (status) => {
    switch (status) {
      case "AVAILABLE":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Available
          </Badge>
        );
      case "UNAVAILABLE":
        return (
          <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
            Unavailable
          </Badge>
        );
      case "SOLD":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            Sold
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  // if (loadingCars) {
  //   return (
  //     <>
  //       <div className="space-y-6 p-6 bg-gradient-to-br from-background via-card to-car-gray-light/20">
  //         <div className="flex justify-between items-center">
  //           <div>
  //             <div className="h-10 w-64 bg-gradient-to-r from-car-gray-light to-muted rounded-lg animate-pulse mb-2"></div>
  //             <div className="h-6 w-48 bg-car-gray-light rounded-lg animate-pulse"></div>
  //           </div>
  //           <div className="h-12 w-36 bg-car-gray-light rounded-xl animate-pulse"></div>
  //         </div>

  //         {/* Search bar skeleton */}
  //         <div className="flex items-center space-x-4">
  //           <div className="relative flex-1 max-w-md">
  //             <div className="h-14 w-full bg-white border-2 border-car-gray-light rounded-xl animate-pulse shadow-md"></div>
  //           </div>
  //         </div>
  //       </div>

  //       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-6">
  //         {[...Array(6)].map((_, i) => (
  //           <Card
  //             key={i}
  //             className="border-2 border-car-gray-light overflow-hidden shadow-lg bg-gradient-to-br from-white to-card rounded-2xl"
  //           >
  //             {/* Featured badge skeleton */}
  //             <div className="absolute top-4 left-4 z-20">
  //               <div className="h-8 w-24 bg-car-gray-light rounded-full animate-pulse"></div>
  //             </div>

  //             {/* Status badge skeleton */}
  //             <div className="absolute top-4 right-4 z-20">
  //               <div className="h-8 w-20 bg-car-gray-light rounded-full animate-pulse"></div>
  //             </div>

  //             {/* Image skeleton */}
  //             <div className="aspect-video bg-gradient-to-br from-car-gray-light to-muted rounded-t-2xl animate-pulse flex items-center justify-center">
  //               <div className="text-6xl text-car-gray opacity-20">🚗</div>
  //             </div>

  //             <CardHeader className="pb-3 px-6 pt-6">
  //               <div className="space-y-3">
  //                 {/* Car name skeleton */}
  //                 <div className="h-8 w-3/4 bg-car-gray-light rounded-lg animate-pulse"></div>

  //                 {/* Year and color badges skeleton */}
  //                 <div className="flex items-center gap-4">
  //                   <div className="h-7 w-16 bg-car-gray-light rounded-full animate-pulse"></div>
  //                   <div className="h-7 w-20 bg-car-gray-light rounded-full animate-pulse"></div>
  //                 </div>

  //                 {/* VIN skeleton */}
  //                 <div className="h-6 w-32 bg-car-gray-light rounded-full animate-pulse"></div>
  //               </div>
  //             </CardHeader>

  //             <CardContent className="pt-0 px-6 pb-6">
  //               {/* Price and mileage skeleton */}
  //               <div className="flex items-center justify-between mb-4">
  //                 <div className="h-10 w-32 bg-gradient-to-r from-car-red/20 to-car-red-dark/20 rounded-lg animate-pulse"></div>
  //                 <div className="h-6 w-24 bg-car-gray-light rounded-lg animate-pulse"></div>
  //               </div>

  //               {/* Car details row skeleton */}
  //               <div className="flex items-center justify-between mb-6 p-4 bg-gradient-to-r from-car-gray-light to-muted rounded-xl">
  //                 <div className="flex items-center gap-2">
  //                   <div className="h-5 w-5 bg-car-red/30 rounded animate-pulse"></div>
  //                   <div className="h-5 w-16 bg-car-gray-light rounded animate-pulse"></div>
  //                 </div>
  //                 <div className="flex items-center gap-2">
  //                   <div className="h-5 w-5 bg-car-red/30 rounded animate-pulse"></div>
  //                   <div className="h-5 w-20 bg-car-gray-light rounded animate-pulse"></div>
  //                 </div>
  //               </div>

  //               {/* Action buttons skeleton */}
  //               <div className="grid grid-cols-2 gap-3">
  //                 <div className="h-10 bg-car-gray-light rounded-lg animate-pulse"></div>
  //                 <div className="h-10 bg-car-gray-light rounded-lg animate-pulse"></div>
  //                 <div className="h-10 bg-car-gray-light rounded-lg animate-pulse"></div>
  //                 <div className="h-10 bg-car-gray-light rounded-lg animate-pulse"></div>
  //               </div>
  //             </CardContent>
  //           </Card>
  //         ))}
  //       </div>
  //     </>
  //   );
  // }

  // if (carsError) {
  //   return (
  //     <div className="flex items-center justify-center min-h-[400px]">
  //       <div className="text-center">
  //         <p className="text-red-500 text-lg mb-4">Failed to load cars</p>
  //         <Button onClick={() => window.location.reload()}>Try Again</Button>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <>
      <div className="space-y-6 p-6 bg-gradient-to-br from-background via-card to-car-gray-light/20">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-car-red to-car-red-dark bg-clip-text text-transparent">
              Premium Cars
            </h1>
            <p className="text-car-gray text-lg">
              Manage your luxury car inventory
            </p>
          </div>
          <Button
            className="gap-2 bg-car-red hover:bg-car-red-dark text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 px-6 py-3 text-lg font-semibold"
            onClick={() => router.push("/admin/cars/create")}
          >
            <Plus className="h-5 w-5" />
            Add New Car
          </Button>
        </div>

        {/* Search bar */}
        <div className="flex items-center space-x-4">
          <div className="relative flex-1 max-w-md">
            <form onSubmit={handleSearchSubmit} className="flex w-full">
              <div className="relative flex-1 flex items-center justify-center">
                <Search className="absolute left-4  h-5 w-5 text-car-gray" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  type="search"
                  placeholder="Search premium cars..."
                  className="pl-12 pr-4 py-3 text-lg border-2 border-car-gray-light hover:border-car-red focus:border-car-red transition-colors duration-200 rounded-xl bg-white shadow-md"
                />
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-6">
        {localCars.map((car) => (
          <Card
            key={car.id}
            className="border-2 p-0 pb-6 border-car-gray-light overflow-hidden shadow-lg hover:shadow-2xl hover:border-car-red transition-all duration-300 group relative bg-gradient-to-br from-white to-card rounded-2xl transform hover:scale-105"
          >
            {/* Featured Badge */}

            {/* Car Image */}
            <div className="relative h-80 overflow-hidden">
              <ImageWithLoader
                width={600}
                height={600}
                src={car.images[0]}
                alt={`${car.make} ${car.model}`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

              {/* Floating badges */}
              <div className="absolute top-6 left-6">
                {car.featured && (
                  <div className="bg-gradient-to-r from-yellow-400 to-amber-500 text-yellow-900 text-sm font-bold px-4 py-2 rounded-full shadow-lg flex items-center gap-2 animate-float">
                    <Star className="h-4 w-4 fill-current" />
                    FEATURED
                  </div>
                )}
              </div>

              <div className="absolute top-6 right-6">
                {getStatusBadge(car.status)}
              </div>

              {/* Quick actions */}
              <div className="absolute bottom-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setCarToShare(car);
                    setShareDialogOpen(true);
                  }} 
                  className="p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
                  title="Share this car"
                >
                  <Share2 className="w-5 h-5 text-white" />
                </Button>
              </div>

              {/* Price overlay */}
              <div className="absolute bottom-6 left-6">
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-4 py-2 shadow-lg">
                  <div className="text-2xl font-bold text-red-600 font-playfair">
                    {formatPriceRange(car.minPrice || car.price, car.maxPrice)}
                  </div>
                </div>
              </div>
            </div>
            {/* Card Content */}
            <CardContent className="py-0 space-y-6">
              {/* Header */}
              <div className="space-y-3 flex justify-between ">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 font-playfair leading-tight">
                      {car.make}
                    </h3>
                    <p className="text-xl text-red-600 font-medium">
                      {car.model}
                    </p>
                  </div>
                </div>

                {/* Year and Color */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg">
                    <Calendar className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">
                      {car.year}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg">
                    <Palette className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">
                      {car.color}
                    </span>
                  </div>
                </div>
              </div>

              {/* Performance specs */}
              <div className="grid grid-cols-3 gap-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100/80 rounded-2xl">
                <div className="text-center">
                  <div className="flex items-center justify-center w-10 h-10 bg-red-100 rounded-full mx-auto mb-2">
                    <Fuel className="w-5 h-5 text-red-600" />
                  </div>
                  <div className="text-sm font-bold text-gray-900">
                    {car.fuelType}
                  </div>
                  <div className="text-xs text-gray-500">Fuel Type</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full mx-auto mb-2">
                    <Car className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="text-sm font-bold text-gray-900">
                    {car.bodyType}
                  </div>
                  <div className="text-xs text-gray-500">Body Type</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-full mx-auto mb-2">
                    <Users className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="text-sm font-bold text-gray-900">
                    {car.seats ? car.seats : "N/A"}
                  </div>
                  <div className="text-xs text-gray-500">Seats</div>
                </div>
              </div>

              {/* Additional details */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Mileage</span>
                    <span className="font-medium">{car.mileage} mi</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Transmission</span>
                    <span className="font-medium">{car.transmission}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-car-red text-car-red hover:bg-car-red hover:text-white transition-all duration-200 font-semibold"
                  title="View details"
                  onClick={() => router.push(`/admin/cars/${car.id}`)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View
                </Button>

                <Button
                  variant={car.featured ? "default" : "outline"}
                  size="lg"
                  className={
                    car.featured
                      ? "bg-yellow-400 text-yellow-900 hover:bg-yellow-300 border-2 border-yellow-500 font-semibold"
                      : "border-2 border-yellow-400 text-yellow-600 hover:bg-yellow-400 hover:text-yellow-900 font-semibold"
                  }
                  title={car.featured ? "Unfeature" : "Feature"}
                  onClick={() => handleToggleFeatured(car)}
                  disabled={!!loadingFeature[car.id]}
                >
                  {loadingFeature[car.id] ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      {car.featured ? "Unfeaturing..." : "Featuring..."}
                    </>
                  ) : (
                    <>
                      <Star
                        className={`h-4 w-4 mr-2 ${
                          car.featured ? "fill-yellow-600" : ""
                        }`}
                      />
                      {car.featured ? "Featured" : "Feature"}
                    </>
                  )}
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      asChild={false}
                      variant="outline"
                      size="md"
                      disabled={updatingCar || !!loadingStatus[car.id]}
                      className="border-2 border-car-gray text-car-gray hover:bg-car-gray hover:text-white font-semibold"
                    >
                      {loadingStatus[car.id] ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        "Status"
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-56 bg-white border-2 border-car-gray-light shadow-xl rounded-xl"
                  >
                    <DropdownMenuLabel className="text-car-black font-semibold">
                      Update Status
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuRadioGroup
                      value={car.status?.toUpperCase()}
                      onValueChange={(val) =>
                        handleStatusUpdate(
                          car,
                          val.charAt(0) + val.slice(1).toLowerCase()
                        )
                      }
                    >
                      <DropdownMenuRadioItem
                        value="AVAILABLE"
                        className="text-car-gray hover:bg-car-red hover:text-white"
                        onClick={() => handleStatusUpdate(car, "AVAILABLE")}
                        disabled={
                          car.status === "AVAILABLE" || !!loadingStatus[car.id]
                        }
                      >
                        <span className="flex items-center justify-between w-full">
                          <span>Available</span>
                          {car.status?.toUpperCase() === "AVAILABLE" && (
                            <span className="text-car-red">✔</span>
                          )}
                        </span>
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem
                        value="UNAVAILABLE"
                        className="text-car-gray hover:bg-car-red hover:text-white"
                        onClick={() => handleStatusUpdate(car, "UNAVAILABLE")}
                        disabled={
                          car.status === "UNAVAILABLE" ||
                          !!loadingStatus[car.id]
                        }
                      >
                        <span className="flex items-center justify-between w-full">
                          <span>Unavailable</span>
                          {car.status?.toUpperCase() === "UNAVAILABLE" && (
                            <span className="text-car-red">✔</span>
                          )}
                        </span>
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem
                        value="SOLD"
                        className="text-car-gray hover:bg-car-red hover:text-white"
                        onClick={() => handleStatusUpdate(car, "SOLD")}
                        disabled={
                          car.status === "SOLD" || !!loadingStatus[car.id]
                        }
                      >
                        <span className="flex items-center justify-between w-full">
                          <span>Sold</span>
                          {car.status?.toUpperCase() === "SOLD" && (
                            <span className="text-car-red">✔</span>
                          )}
                        </span>
                      </DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-red-500 text-red-600 hover:bg-red-500 hover:text-white transition-all duration-200 font-semibold"
                  title="Delete car"
                  onClick={() => {
                    setCarToDelete(car);
                    setDeleteDialogOpen(true);
                  }}
                  disabled={updatingCar}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="bg-white border-2 border-car-gray-light rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-car-black">
              Confirm Deletion
            </DialogTitle>
            <DialogDescription className="text-car-gray text-lg">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-car-red">
                {carToDelete?.make} {carToDelete?.model} ({carToDelete?.year})
              </span>
              ? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-3">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={updatingCar}
              className="border-2 border-car-gray text-car-gray hover:bg-car-gray hover:text-white"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteCar}
              disabled={deletingCar}
              className="bg-red-500 hover:bg-red-600 text-white border-2 border-red-500"
            >
              {deletingCar ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Car"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <ShareDialog 
        open={shareDialogOpen} 
        onOpenChange={setShareDialogOpen}
        carToShare={carToShare}
        onShare={handleShare}
      />
    </>
  );
};

export default CarList;

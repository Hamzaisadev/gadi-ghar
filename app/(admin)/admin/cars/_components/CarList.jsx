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
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import useFetch from "@/hooks/use-fetch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPriceRange } from "@/components/utils/FormatCurrency";
import Image from "next/image";
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
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

const CarList = () => {
  const [search, setSearch] = useState("");
  const router = useRouter();

  // State for delete dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [carToDelete, setCarToDelete] = useState(null);

  // Per-card loading state
  const [loadingFeature, setLoadingFeature] = useState({}); // { [carId]: boolean }
  const [loadingStatus, setLoadingStatus] = useState({}); // { [carId]: boolean }

  // Local cars state for optimistic updates
  const [localCars, setLocalCars] = useState([]);

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
      toast.error("Failed to load cars");
    }

    if (deleteError) {
      toast.error("Failed to delete car");
    }

    if (updateError) {
      toast.error("Failed to update car");
    }
  }, [carsError, deleteError, updateError]);

  // Handle successful operations
  useEffect(() => {
    if (deleteResult?.success) {
      toast.success("Car deleted successfully");
      setDeleteDialogOpen(false);
      setCarToDelete(null);
      fetchCars(search);
    }
    if (updateResult?.success) {
      toast.success("Car updated successfully");
      fetchCars(search);
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

    await deleteCarFn(carToDelete.id);
    setDeleteDialogOpen(false);
    setCarToDelete(null);
  };

  // Optimistic toggle featured
  const handleToggleFeatured = async (car) => {
    setLoadingFeature((prev) => ({ ...prev, [car.id]: true }));
    // Optimistically update UI
    setLocalCars((prev) =>
      prev.map((c) => (c.id === car.id ? { ...c, featured: !c.featured } : c))
    );
    try {
      await updateCarStatusFn(car.id, { featured: !car.featured });
      toast.success(car.featured ? "Car unfeatured" : "Car featured");
    } catch (error) {
      // Rollback
      setLocalCars((prev) =>
        prev.map((c) => (c.id === car.id ? { ...c, featured: car.featured } : c))
      );
      toast.error("Failed to update featured state");
    } finally {
      setLoadingFeature((prev) => ({ ...prev, [car.id]: false }));
    }
  };

  // Optimistic status update
  const handleStatusUpdate = async (car, newStatus) => {
    setLoadingStatus((prev) => ({ ...prev, [car.id]: true }));
    const oldStatus = car.status;
    setLocalCars((prev) =>
      prev.map((c) => (c.id === car.id ? { ...c, status: newStatus } : c))
    );
    try {
      await updateCarStatusFn(car.id, { status: newStatus });
      toast.success("Status updated");
    } catch (error) {
      setLocalCars((prev) =>
        prev.map((c) => (c.id === car.id ? { ...c, status: oldStatus } : c))
      );
      toast.error("Failed to update status");
    } finally {
      setLoadingStatus((prev) => ({ ...prev, [car.id]: false }));
    }
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
  if (loadingCars) {
    return (
      <>
        <div className="space-y-6 p-6 bg-gradient-to-br from-background via-card to-car-gray-light/20">
          <div className="flex justify-between items-center">
            <div>
              <div className="h-10 w-64 bg-gradient-to-r from-car-gray-light to-muted rounded-lg animate-pulse mb-2"></div>
              <div className="h-6 w-48 bg-car-gray-light rounded-lg animate-pulse"></div>
            </div>
            <div className="h-12 w-36 bg-car-gray-light rounded-xl animate-pulse"></div>
          </div>

          {/* Search bar skeleton */}
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-md">
              <div className="h-14 w-full bg-white border-2 border-car-gray-light rounded-xl animate-pulse shadow-md"></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-6">
          {[...Array(6)].map((_, i) => (
            <Card
              key={i}
              className="border-2 border-car-gray-light overflow-hidden shadow-lg bg-gradient-to-br from-white to-card rounded-2xl"
            >
              {/* Featured badge skeleton */}
              <div className="absolute top-4 left-4 z-20">
                <div className="h-8 w-24 bg-car-gray-light rounded-full animate-pulse"></div>
              </div>

              {/* Status badge skeleton */}
              <div className="absolute top-4 right-4 z-20">
                <div className="h-8 w-20 bg-car-gray-light rounded-full animate-pulse"></div>
              </div>

              {/* Image skeleton */}
              <div className="aspect-video bg-gradient-to-br from-car-gray-light to-muted rounded-t-2xl animate-pulse flex items-center justify-center">
                <div className="text-6xl text-car-gray opacity-20">🚗</div>
              </div>

              <CardHeader className="pb-3 px-6 pt-6">
                <div className="space-y-3">
                  {/* Car name skeleton */}
                  <div className="h-8 w-3/4 bg-car-gray-light rounded-lg animate-pulse"></div>

                  {/* Year and color badges skeleton */}
                  <div className="flex items-center gap-4">
                    <div className="h-7 w-16 bg-car-gray-light rounded-full animate-pulse"></div>
                    <div className="h-7 w-20 bg-car-gray-light rounded-full animate-pulse"></div>
                  </div>

                  {/* VIN skeleton */}
                  <div className="h-6 w-32 bg-car-gray-light rounded-full animate-pulse"></div>
                </div>
              </CardHeader>

              <CardContent className="pt-0 px-6 pb-6">
                {/* Price and mileage skeleton */}
                <div className="flex items-center justify-between mb-4">
                  <div className="h-10 w-32 bg-gradient-to-r from-car-red/20 to-car-red-dark/20 rounded-lg animate-pulse"></div>
                  <div className="h-6 w-24 bg-car-gray-light rounded-lg animate-pulse"></div>
                </div>

                {/* Car details row skeleton */}
                <div className="flex items-center justify-between mb-6 p-4 bg-gradient-to-r from-car-gray-light to-muted rounded-xl">
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-5 bg-car-red/30 rounded animate-pulse"></div>
                    <div className="h-5 w-16 bg-car-gray-light rounded animate-pulse"></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-5 bg-car-red/30 rounded animate-pulse"></div>
                    <div className="h-5 w-20 bg-car-gray-light rounded animate-pulse"></div>
                  </div>
                </div>

                {/* Action buttons skeleton */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="h-10 bg-car-gray-light rounded-lg animate-pulse"></div>
                  <div className="h-10 bg-car-gray-light rounded-lg animate-pulse"></div>
                  <div className="h-10 bg-car-gray-light rounded-lg animate-pulse"></div>
                  <div className="h-10 bg-car-gray-light rounded-lg animate-pulse"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </>
    );
  }

  if (carsError) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-4">Failed to load cars</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

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
              <div className="relative flex-1">
                <Search className="absolute left-4 top-3.5 h-5 w-5 text-car-gray" />
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
            className="border-2 border-car-gray-light overflow-hidden shadow-lg hover:shadow-2xl hover:border-car-red transition-all duration-300 group relative bg-gradient-to-br from-white to-card rounded-2xl transform hover:scale-105"
          >
            {/* Featured Badge */}
            <div className="absolute top-4 left-4 z-20">
              {car.featured ? (
                <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-car-black text-sm font-bold px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
                  <Star className="h-4 w-4 fill-yellow-600" />
                  FEATURED
                </div>
              ) : (
                <div className="bg-car-gray-light text-car-gray text-sm font-semibold px-4 py-2 rounded-full shadow-md">
                  Standard
                </div>
              )}
            </div>

            {/* Car Image */}
            <div className="relative aspect-video bg-gradient-to-br from-car-gray-light to-muted rounded-t-2xl flex items-center justify-center overflow-hidden">
              {car.images && car.images.length > 0 ? (
                <Image
                  width={500}
                  height={500}
                  src={car.images[0]}
                  alt={car.make + " " + (car.model || "")}
                  className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                />
              ) : (
                <span className="text-8xl text-car-gray opacity-30">🚗</span>
              )}

              {/* Status overlay */}
              <div className="absolute top-4 right-4">
                <span>{getStatusBadge(car.status)}</span>
              </div>
            </div>

            <CardHeader className="pb-3 px-6 pt-6">
              <div className="flex justify-between items-start">
                <CardTitle className="text-2xl font-bold flex flex-col gap-2">
                  <span className="text-car-black">
                    {car.make}{" "}
                    {car.model && (
                      <span className="text-car-red font-extrabold">
                        {car.model}
                      </span>
                    )}
                  </span>
                  <div className="flex items-center gap-4 text-base text-car-gray font-medium">
                    <span className="bg-car-gray-light px-3 py-1 rounded-full">
                      {car.year || "N/A"}
                    </span>
                    <span className="bg-car-gray-light px-3 py-1 rounded-full">
                      {car.color || "Color N/A"}
                    </span>
                  </div>
                  {car.vin && (
                    <span className="text-xs text-car-gray font-normal bg-car-gray-light px-3 py-1 rounded-full max-w-fit">
                      VIN: {car.vin}
                    </span>
                  )}
                </CardTitle>
              </div>
            </CardHeader>

            <CardContent className="pt-0 px-6 pb-6">
              {/* Price */}
              <div className="flex items-center justify-between mb-4">
                <div className="text-3xl font-black text-car-red">
                  {formatPriceRange(car.minPrice || car.price, car.maxPrice)}
                </div>
                <div className="flex items-center gap-2 text-car-gray font-semibold">
                  <Gauge className="h-5 w-5" />
                  <span>
                    {car.mileage ? `${car.mileage.toLocaleString()} mi` : "N/A"}
                  </span>
                </div>
              </div>

              {/* Car Details Row */}
              <div className="flex items-center justify-between mb-6 p-4 bg-gradient-to-r from-car-gray-light to-muted rounded-xl">
                <div className="flex items-center gap-2 text-car-gray">
                  <Users className="h-5 w-5 text-car-red" />
                  <span className="font-semibold">
                    {car.seats || car.seating || "N/A"}{" "}
                    {car.seats > 1 || !car.seats ? "Seats" : "Seat"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-car-gray">
                  <Fuel className="h-5 w-5 text-car-red" />
                  <span className="font-semibold capitalize">
                    {car.fuelType || car.fuel_type || car.engineType || "N/A"}
                  </span>
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
                        className={`h-4 w-4 mr-2 ${car.featured ? "fill-yellow-600" : ""}`}
                      />
                      {car.featured ? "Featured" : "Feature"}
                    </>
                  )}
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      disabled={updatingCar}
                      className="border-2 border-car-gray text-car-gray hover:bg-car-gray hover:text-white font-semibold"
                    >
                      Status
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
                        disabled={car.status === "AVAILABLE" || !!loadingStatus[car.id]}
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
                        disabled={car.status === "UNAVAILABLE" || !!loadingStatus[car.id]}
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
                        disabled={car.status === "SOLD" || !!loadingStatus[car.id]}
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
    </>
  );
};

export default CarList;

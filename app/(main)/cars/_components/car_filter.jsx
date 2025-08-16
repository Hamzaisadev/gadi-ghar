"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import CarFilterControls from "./CarFilterControl";

const CarFilters = ({ filters }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Simple, integer-only params with safe fallbacks
  const currentMake = searchParams.get("make") ?? "";
  const currentBodyType = searchParams.get("bodyType") ?? "";
  const currentFuelType = searchParams.get("fuelType") ?? "";
  const currentTransmission = searchParams.get("transmission") ?? "";
  const currentColor = searchParams.get("color") ?? "";

  const spMin = searchParams.get("minPrice");
  const spMax = searchParams.get("maxPrice");

  const defaultMin = filters.priceRange.min;
  const defaultMax = filters.priceRange.max;

  const parsedMin = spMin ? parseInt(spMin, 10) : defaultMin;
  const parsedMax = spMax ? parseInt(spMax, 10) : defaultMax;

  // Ensure min <= max
  const currentMinPrice = Math.min(parsedMin, parsedMax);
  const currentMaxPrice = Math.max(parsedMin, parsedMax);

  const currentSortBy = searchParams.get("sortBy") ?? "newest";

  // Local state
  const [make, setMake] = useState(currentMake);
  const [bodyType, setBodyType] = useState(currentBodyType);
  const [fuelType, setFuelType] = useState(currentFuelType);
  const [transmission, setTransmission] = useState(currentTransmission);
  const [priceRange, setPriceRange] = useState([
    currentMinPrice,
    currentMaxPrice,
  ]);
  const [sortBy, setSortBy] = useState(currentSortBy);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  useEffect(() => {
    setMake(currentMake);
    setBodyType(currentBodyType);
    setFuelType(currentFuelType);
    setTransmission(currentTransmission);
    setPriceRange([currentMinPrice, currentMaxPrice]);
    setSortBy(currentSortBy);
  }, [
    currentMake,
    currentBodyType,
    currentFuelType,
    currentTransmission,
    currentMinPrice,
    currentMaxPrice,
    currentSortBy,
  ]);

  // Tutorial-aligned counters/objects
  const activeFilterCount = [
    make,
    bodyType,
    fuelType,
    transmission,
    currentMinPrice > filters.priceRange.min ||
      currentMaxPrice < filters.priceRange.max,
  ].filter(Boolean).length;

  const currentFilters = {
    make,
    bodyType,
    fuelType,
    transmission,
    priceRange,
    priceRangeMin: filters.priceRange.min,
    priceRangeMax: filters.priceRange.max,
  };
    
  const handleFilterChange = (filterName, value) => {
        
      switch (filterName) {
        case "make":
          setMake(value);
          break;
        case "bodyType":
          setBodyType(value);
          break;
        case "fuelType":
          setFuelType(value);
          break;
        case "transmission":
          setTransmission(value);
          break;
        case "priceRange":
          setPriceRange(value);
          break;
        
         
      }
  }
  const  handleClearFilter = (filterName) => {
        handleFilterChange(filterName, "");
  }
    
   
  return (
    <div>
      {/* MobileFilters */}
      <div>
        <div className="flex items-center">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="mr-2 h-4 w-4" />
                <span>Filters</span>
                {activeFilterCount > 0 && (
                  <Badge className="ml-1 h-5 w-5 rounded-full p-0  flex items-center justify-center">
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-full sm:max-w-md overflow-y-auto"
            >
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <div>
                <CarFilterControls
                  filters={filters}
                  currentFilters={currentFilters}
                  onFilterChange={handleFilterChange}
                  onClearFilter={handleClearFilter}
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
};

export default CarFilters;

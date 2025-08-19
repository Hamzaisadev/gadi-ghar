"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import CarFilterControls from "./CarFilterControl";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  const [color, setColor] = useState(currentColor);
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
    setColor(currentColor);
    setPriceRange([currentMinPrice, currentMaxPrice]);
    setSortBy(currentSortBy);
  }, [
    currentMake,
    currentBodyType,
    currentFuelType,
    currentTransmission,
    currentColor,
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
    color,
    currentMinPrice > filters.priceRange.min ||
      currentMaxPrice < filters.priceRange.max,
  ].filter(Boolean).length;

  const currentFilters = {
    make,
    bodyType,
    fuelType,
    transmission,
    color,
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
      case "color":
        setColor(value);
        break;
      case "priceRange":
        setPriceRange(value);
        break;
    }
  };

  const handleClearFilter = (filterName) => {
    handleFilterChange(filterName, "");
  };

  const clearFilter = () => {
    setMake("");
    setBodyType("");
    setFuelType("");
    setTransmission("");
    setPriceRange([filters.priceRange.min, filters.priceRange.max]);
    setSortBy("newest");

    const params = new URLSearchParams();
    const search = searchParams.get("search");
    if (search) params.set("search", search);

    const query = params.toString();
    const url = query ? `${pathname}?${query}` : pathname;

    router.push(url);

    setIsSheetOpen(false);
  };

  const applyFilters = () => {
    const params = new URLSearchParams();

    if (make) params.set("make", make);
    if (bodyType) params.set("bodyType", bodyType);
    if (fuelType) params.set("fuelType", fuelType);
    if (transmission) params.set("transmission", transmission);
    if (
      priceRange[0] !== filters.priceRange.min ||
      priceRange[1] !== filters.priceRange.max
    ) {
      params.set("minPrice", priceRange[0].toString());
      params.set("maxPrice", priceRange[1].toString());
    }
    if (sortBy) params.set("sortBy", sortBy);

    const search = searchParams.get("search");
    const page = searchParams.get("page");

    if (search) params.set("search", search);

    if (page && page !== "1") params.set("page", page);
    const query = params.toString();
    const url = query ? `${pathname}?${query}` : pathname;

    router.push(url);

    setIsSheetOpen(false);
  };

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

              <SheetFooter className="flex sm:justify-between flex-row pt-2 border-t space-x-4 mt-auto">
                <Button
                  variant="outline"
                  onClick={clearFilter}
                  className="flex-1"
                >
                  Reset
                </Button>
                <Button
                  variant="default"
                  onClick={applyFilters}
                  className="flex-1"
                >
                  Show Results
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      {/* SortSelection */}
      <Select value={sortBy}
        onValueChange={(value) => {
        setSortBy(value)
        setTimeout(() => {applyFilters();}, 0);
      }}>
        <SelectTrigger className="w-[180px] lg:w-full">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          {[
           {value:"newest",label:"Newest First"},
           {value:"price-asc",label:"Price: Low to High"},
            { value: "price-desc", label: "Price: High to Low" },
           
          ].map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CarFilters;

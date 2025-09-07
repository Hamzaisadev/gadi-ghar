"use client";

import { getCars } from "@/app/actions/car-listing";
import useFetch from "@/hooks/use-fetch";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import CarListingsLoading from "./CarListingLoader";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, AlertTriangle } from "lucide-react";
import { getUserFriendlyMessage } from "@/lib/error-utils";
import { Link } from "next-view-transitions";
import { Button } from "@/components/ui/button";
import CarCard from "@/components/car-card";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const CarListings = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [currentPage, setCurrentPage] = useState(1);
  const limit = 8; // items per page

  // Extract filter values from searchParams - including advanced filters
  const search = searchParams.get("search") || "";
  const make = searchParams.get("make") || "";
  const bodyType = searchParams.get("bodyType") || "";
  const fuelType = searchParams.get("fuelType") || "";
  const transmission = searchParams.get("transmission") || "";
  const color = searchParams.get("color") || "";
  const dealershipId = searchParams.get("dealershipId") || "";
  const minPrice = searchParams.get("minPrice") || 0;
  const maxPrice = searchParams.get("maxPrice") || Number.MAX_SAFE_INTEGER;
  const minYear = searchParams.get("minYear") || 1990;
  const maxYear = searchParams.get("maxYear") || new Date().getFullYear();
  const minMileage = searchParams.get("minMileage") || 0;
  const maxMileage = searchParams.get("maxMileage") || 999999999;
  const seats = searchParams.get("seats") || null;
  const featured = searchParams.get("featured");
  const sortBy = searchParams.get("sortBy") || "newest";
  const page = parseInt(searchParams.get("page") || "1");

  const { loading, fn: fetchCars, data: result, error } = useFetch(getCars);

  useEffect(() => {
    fetchCars({
      search,
      make,
      bodyType,
      fuelType,
      transmission,
      color,
      dealershipId,
      minPrice,
      maxPrice,
      minYear,
      maxYear,
      minMileage,
      maxMileage,
      seats: seats ? parseInt(seats) : null,
      featured: featured === 'true' ? true : featured === 'false' ? false : null,
      sortBy,
      page,
      limit,
    });
  }, [
    search,
    make,
    bodyType,
    fuelType,
    transmission,
    color,
    dealershipId,
    minPrice,
    maxPrice,
    minYear,
    maxYear,
    minMileage,
    maxMileage,
    seats,
    featured,
    sortBy,
    page,
  ]);

  // Update URL when page changes
  useEffect(() => {
    if (currentPage !== page) {
      const params = new URLSearchParams(searchParams);
      params.set("page", currentPage.toString());
      router.push(`?${params.toString()}`);
    }
  }, [currentPage, router, searchParams, page]);

  // Handle pagination clicks
  const handlePageChange = (pageNum) => {
    setCurrentPage(pageNum);
  };

  // Generate pagination URL
  const getPaginationUrl = (pageNum) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNum.toString());
    return `?${params.toString()}`;
  };

  // Show loading state when data is being fetched
  if (loading) return <CarListingsLoading />;

  // Show error state if there's an error
  if (error) {
    const errorMessage = getUserFriendlyMessage(error);
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center text-center p-8">
        <Alert variant="destructive" className="max-w-md">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Unable to Load Cars</AlertTitle>
          <AlertDescription className="mb-4">
            {errorMessage || "We couldn't load the cars. Please try again later."}
          </AlertDescription>
        </Alert>
        <div className="flex gap-3 mt-4">
          <Button 
            variant="outline" 
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
          <Button 
            variant="ghost" 
            onClick={() => router.push('/cars')}
          >
            Clear Filters
          </Button>
        </div>
      </div>
    );
  }

  // Check if result exists and has success
  if (!result) {
    console.log('No result received');
    return null;
  }
  
  if (!result.success) {
    console.log('Result not successful:', result);
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center text-center p-8">
        <Alert variant="destructive" className="max-w-md">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Failed to Load Cars</AlertTitle>
          <AlertDescription>
            {result.error || "Unable to load car listings. Please try refreshing the page."}
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  
  // Ensure cars is always an array
  console.log('CarListings - Result received:', { 
    success: result.success,
    dataLength: result.data?.length,
    isArray: Array.isArray(result.data),
    pagination: result.pagination 
  });
  
  const cars = Array.isArray(result.data) ? result.data : [];
  const pagination = result.pagination || { pages: 0, total: 0 };

  if (cars.length === 0) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center text-center p-8 border rounded-lg bg-gray-50">
        <div className="bg-gray-100 p-4 rounded-full mb-4">
          <Info className="h-8 w-8 text-gray-500" />
        </div>
        <h3 className="text-lg font-medium mb-2">No cars found</h3>
        <p className="text-gray-500 mb-6 max-w-md">
          We couldn't find any cars matching your search criteria. Try adjusting
          your filters or search term.
        </p>
        <Button 
          variant="outline" 
          onClick={() => router.push('/cars')}
        >
          Clear all filters
        </Button>
      </div>
    );
  }

  const paginationItems = [];

  // Calculate which page numbers to show (first, last, and around current page)
  const visiblePageNumbers = [];
  const totalPages = pagination?.pages || 0;

  if (totalPages > 0) {
    // Always show page 1
    visiblePageNumbers.push(1);

    // Show pages around current page
    for (
      let i = Math.max(2, page - 1);
      i <= Math.min(totalPages - 1, page + 1);
      i++
    ) {
      visiblePageNumbers.push(i);
    }

    // Always show last page if there's more than 1 page
    if (totalPages > 1) {
      visiblePageNumbers.push(totalPages);
    }
  }

  // Sort and deduplicate
  const uniquePageNumbers = [...new Set(visiblePageNumbers)].sort(
    (a, b) => a - b
  );

  // Create pagination items with ellipses
  let lastPageNumber = 0;
  uniquePageNumbers.forEach((pageNumber) => {
    if (pageNumber - lastPageNumber > 1) {
      // Add ellipsis
      paginationItems.push(
        <PaginationItem key={`ellipsis-${pageNumber}`}>
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    paginationItems.push(
      <PaginationItem key={pageNumber}>
        <PaginationLink
          href={getPaginationUrl(pageNumber)}
          isActive={pageNumber === page}
          onClick={(e) => {
            e.preventDefault();
            handlePageChange(pageNumber);
          }}
        >
          {pageNumber}
        </PaginationLink>
      </PaginationItem>
    );

    lastPageNumber = pageNumber;
  });
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing <span className="font-medium">{(page - 1) * limit + 1}-{Math.min(page * limit, pagination.total)}</span> of <span className="font-medium">{pagination.total}</span> cars
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {cars.map((car) => (
          <CarCard key={car.id} car={car} />
        ))}
      </div>

      {pagination.pages > 1 && (
        <Pagination className="mt-10 justify-center">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href={getPaginationUrl(page - 1)}
                onClick={(e) => {
                  e.preventDefault();
                  if (page > 1) {
                    handlePageChange(page - 1);
                  }
                }}
                className={page <= 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>

            {paginationItems}

            <PaginationItem>
              <PaginationNext
                href={getPaginationUrl(page + 1)}
                onClick={(e) => {
                  e.preventDefault();
                  if (page < pagination.pages) {
                    handlePageChange(page + 1);
                  }
                }}
                className={
                  page >= pagination.pages
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default CarListings;

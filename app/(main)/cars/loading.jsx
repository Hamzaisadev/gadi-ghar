"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function Loading() {
  return (
    <section className="bg-background py-12 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-4xl mx-auto mb-8">
          {/* Title */}
          <div className="mb-6 py-5">
            <Skeleton className="h-16 lg:h-20 w-3/4 mx-auto bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse rounded-lg" />
          </div>
        </div>

        <div className="space-y-8">
          {/* Filters Bar */}
          <div className="w-full">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex flex-wrap gap-4">
                {/* Search Input */}
                <Skeleton className="h-12 w-64 bg-gray-200 animate-pulse rounded-md" />
                
                {/* Filter Dropdowns */}
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-32 bg-gray-200 animate-pulse rounded-md" />
                ))}
                
                {/* Price Range */}
                <Skeleton className="h-12 w-48 bg-gray-200 animate-pulse rounded-md" />
                
                {/* Search Button */}
                <Skeleton className="h-12 w-24 bg-red-200 animate-pulse rounded-md" />
              </div>
            </div>
          </div>
          
          {/* Car Listings */}
          <div className="w-full">
            {/* Results Header */}
            <div className="flex justify-between items-center mb-6">
              <Skeleton className="h-6 w-32 bg-gray-200 animate-pulse rounded-md" />
              <Skeleton className="h-10 w-40 bg-gray-200 animate-pulse rounded-md" />
            </div>
            
            {/* Car Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(12)].map((_, i) => (
                <CarCardSkeleton key={i} />
              ))}
            </div>
            
            {/* Pagination */}
            <div className="flex justify-center mt-12">
              <div className="flex gap-2">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-10 w-10 bg-gray-200 animate-pulse rounded-md" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CarCardSkeleton() {
  return (
    <Card className="overflow-hidden bg-white rounded-2xl shadow-lg border border-gray-100">
      {/* Image */}
      <div className="relative h-64 md:h-72">
        <Skeleton className="w-full h-full bg-gray-200 animate-pulse" />
        
        {/* Price bottom-left */}
        <div className="absolute bottom-3 left-3">
          <Skeleton className="h-8 w-24 bg-red-200 animate-pulse rounded-lg" />
        </div>
        
        {/* Heart Button */}
        <div className="absolute top-3 right-3">
          <Skeleton className="h-10 w-10 bg-white/90 animate-pulse rounded-full" />
        </div>
      </div>

      {/* Content */}
      <CardContent className="p-6">
        {/* Title */}
        <Skeleton className="h-6 w-3/4 mb-4 bg-gray-200 animate-pulse rounded-md" />

        {/* Specs Grid */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <Skeleton className="h-5 w-5 bg-gray-200 animate-pulse rounded-full" />
              <Skeleton className="h-4 w-16 bg-gray-200 animate-pulse rounded-md" />
            </div>
          ))}
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-3">
          <Skeleton className="h-6 w-20 bg-gray-200 animate-pulse rounded-full" />
          <Skeleton className="h-6 w-16 bg-gray-200 animate-pulse rounded-full" />
        </div>

        {/* Dealership Info */}
        <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center gap-2 mb-1">
            <Skeleton className="h-4 w-4 bg-gray-200 animate-pulse rounded-full" />
            <Skeleton className="h-4 w-20 bg-gray-200 animate-pulse rounded-md" />
          </div>
          <Skeleton className="h-4 w-32 mb-1 bg-gray-200 animate-pulse rounded-md" />
          <Skeleton className="h-3 w-24 bg-gray-200 animate-pulse rounded-md" />
        </div>

        {/* CTA Button */}
        <Skeleton className="w-full h-12 bg-red-200 animate-pulse rounded-lg" />
      </CardContent>
    </Card>
  );
}

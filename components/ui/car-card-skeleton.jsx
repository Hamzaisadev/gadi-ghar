"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function CarCardSkeleton() {
  return (
    <Card className="group overflow-hidden bg-white rounded-2xl shadow-lg border border-gray-100">
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
        <div className="grid grid-cols-2 gap-3 text-base md:text-lg text-gray-800 mb-5">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <Skeleton className="h-5 w-5 bg-red-200 animate-pulse rounded-full" />
              <Skeleton className="h-4 w-16 bg-gray-200 animate-pulse rounded-md" />
            </div>
          ))}
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-3">
          <Skeleton className="h-6 w-20 bg-black/10 animate-pulse rounded-full" />
          <Skeleton className="h-6 w-16 bg-gray-200 animate-pulse rounded-full" />
        </div>

        {/* Dealership Info */}
        <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center gap-2 mb-1">
            <Skeleton className="h-4 w-4 bg-gray-200 animate-pulse rounded-full" />
            <Skeleton className="h-4 w-20 bg-gray-200 animate-pulse rounded-md" />
          </div>
          <div className="space-y-1">
            <Skeleton className="h-4 w-32 bg-gray-200 animate-pulse rounded-md" />
            <Skeleton className="h-3 w-24 bg-gray-200 animate-pulse rounded-md" />
          </div>
        </div>

        {/* CTA Button */}
        <Skeleton className="w-full h-12 bg-red-200 animate-pulse rounded-lg" />
      </CardContent>
    </Card>
  );
}

// Export multiple skeleton components for different grid layouts
export function CarCardSkeletonGrid({ count = 12 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(count)].map((_, i) => (
        <CarCardSkeleton key={i} />
      ))}
    </div>
  );
}

// Compact version for smaller layouts
export function CarCardSkeletonCompact() {
  return (
    <Card className="group overflow-hidden bg-white rounded-lg shadow-md border border-gray-100">
      <div className="flex gap-4 p-4">
        {/* Image */}
        <div className="relative h-24 w-32 flex-shrink-0">
          <Skeleton className="w-full h-full bg-gray-200 animate-pulse rounded-md" />
        </div>
        
        {/* Content */}
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-3/4 bg-gray-200 animate-pulse rounded-md" />
          <Skeleton className="h-6 w-1/2 bg-red-200 animate-pulse rounded-md" />
          <div className="flex gap-2">
            <Skeleton className="h-4 w-16 bg-gray-200 animate-pulse rounded-md" />
            <Skeleton className="h-4 w-16 bg-gray-200 animate-pulse rounded-md" />
          </div>
        </div>
        
        {/* Action */}
        <div className="flex-shrink-0">
          <Skeleton className="h-10 w-24 bg-red-200 animate-pulse rounded-md" />
        </div>
      </div>
    </Card>
  );
}

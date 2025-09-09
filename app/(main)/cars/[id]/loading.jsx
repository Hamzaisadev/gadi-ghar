"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function Loading() {
  return (
    <div className="bg-background p-8 py-12 lg:py-32">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Image Gallery Skeleton */}
        <div className="w-full lg:w-7/12">
          {/* Main Image */}
          <div className="aspect-video rounded-lg overflow-hidden relative mb-4">
            <Skeleton className="w-full h-full bg-gray-200 animate-pulse" />
          </div>
          
          {/* Thumbnails */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {[...Array(4)].map((_, i) => (
              <Skeleton 
                key={i} 
                className="relative rounded-md h-20 w-24 flex-shrink-0 bg-gray-200 animate-pulse" 
              />
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex mt-4 gap-4">
            <Skeleton className="flex-1 h-12 bg-gray-200 animate-pulse rounded-md" />
            <Skeleton className="flex-1 h-12 bg-gray-200 animate-pulse rounded-md" />
          </div>
        </div>

        {/* Car Details Skeleton */}
        <div className="w-full lg:w-5/12">
          {/* Badge */}
          <Skeleton className="h-6 w-24 mb-4 bg-gray-200 animate-pulse rounded-full" />

          {/* Title */}
          <Skeleton className="h-12 w-full mb-2 bg-gray-200 animate-pulse rounded-md" />

          {/* Price */}
          <Skeleton className="h-8 w-48 mb-6 bg-gray-200 animate-pulse rounded-md" />

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 my-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <Skeleton className="h-5 w-5 bg-gray-200 animate-pulse rounded-full" />
                <Skeleton className="h-5 w-20 bg-gray-200 animate-pulse rounded-md" />
              </div>
            ))}
          </div>

          {/* EMI Calculator Card */}
          <Card className="pt-5">
            <CardContent>
              <div className="flex items-center gap-2 text-lg font-medium mb-2">
                <Skeleton className="h-5 w-5 bg-gray-200 animate-pulse rounded-full" />
                <Skeleton className="h-6 w-32 bg-gray-200 animate-pulse rounded-md" />
              </div>
              <Skeleton className="h-4 w-full mb-2 bg-gray-200 animate-pulse rounded-md" />
              <Skeleton className="h-3 w-3/4 bg-gray-200 animate-pulse rounded-md" />
            </CardContent>
          </Card>

          {/* Request More Info */}
          <Card className="my-6">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-lg font-medium mb-2">
                <Skeleton className="h-5 w-5 bg-gray-200 animate-pulse rounded-full" />
                <Skeleton className="h-6 w-32 bg-gray-200 animate-pulse rounded-md" />
              </div>
              <Skeleton className="h-4 w-full mb-3 bg-gray-200 animate-pulse rounded-md" />
              <Skeleton className="h-10 w-full bg-gray-200 animate-pulse rounded-md" />
            </CardContent>
          </Card>

          {/* Book Test Drive Button */}
          <Skeleton className="w-full h-16 bg-gray-200 animate-pulse rounded-md" />
        </div>
      </div>

      {/* Details & Features Section */}
      <div className="mt-12 p-6 bg-white rounded-lg shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <Skeleton className="h-8 w-32 mb-6 bg-gray-200 animate-pulse rounded-md" />
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-4 w-full bg-gray-200 animate-pulse rounded-md" />
              ))}
            </div>
          </div>
          <div>
            <Skeleton className="h-8 w-24 mb-6 bg-gray-200 animate-pulse rounded-md" />
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Skeleton className="h-2 w-2 bg-gray-200 animate-pulse rounded-full" />
                  <Skeleton className="h-4 w-40 bg-gray-200 animate-pulse rounded-md" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Specifications Section */}
      <div className="mt-8 p-6 bg-white rounded-lg shadow-sm">
        <Skeleton className="h-8 w-40 mb-6 bg-gray-200 animate-pulse rounded-md" />
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex justify-between py-2 border-b">
                <Skeleton className="h-4 w-20 bg-gray-200 animate-pulse rounded-md" />
                <Skeleton className="h-4 w-24 bg-gray-200 animate-pulse rounded-md" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Dealership Location Section */}
      <div className="mt-8 p-6 bg-white rounded-lg shadow-sm">
        <Skeleton className="h-8 w-48 mb-6 bg-gray-200 animate-pulse rounded-md" />
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex flex-col md:flex-row gap-6 justify-between">
            {/* Dealership Info */}
            <div className="flex items-start gap-3">
              <Skeleton className="h-5 w-5 bg-gray-200 animate-pulse rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-32 bg-gray-200 animate-pulse rounded-md" />
                <Skeleton className="h-4 w-48 bg-gray-200 animate-pulse rounded-md" />
                <Skeleton className="h-4 w-36 bg-gray-200 animate-pulse rounded-md" />
                <Skeleton className="h-4 w-40 bg-gray-200 animate-pulse rounded-md" />
              </div>
            </div>

            {/* Working Hours */}
            <div className="md:w-1/2 lg:w-1/3">
              <Skeleton className="h-5 w-32 mb-2 bg-gray-200 animate-pulse rounded-md" />
              <div className="space-y-2">
                {[...Array(7)].map((_, i) => (
                  <div key={i} className="flex justify-between">
                    <Skeleton className="h-4 w-16 bg-gray-200 animate-pulse rounded-md" />
                    <Skeleton className="h-4 w-24 bg-gray-200 animate-pulse rounded-md" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

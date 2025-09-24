"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  ExternalLink,
  Building2,
  Car,
  TrendingUp,
  Eye
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { PageSpinner } from "@/components/ui/loading-spinner";
import { getDealershipById, getDealershipStats } from "@/app/actions/dealership";
import { formatPriceWithCrore, formatPriceRange } from "@/components/utils/FormatCurrency";

export default function AdminDealershipPortalView() {
  const params = useParams();
  const dealershipId = params.dealershipId;

  const [dealership, setDealership] = useState(null);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDealershipData();
  }, [dealershipId]);

  const fetchDealershipData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch both dealership data and stats
      const [dealershipResult, statsResult] = await Promise.all([
        getDealershipById(dealershipId),
        getDealershipStats(dealershipId)
      ]);

      if (!dealershipResult.success) {
        throw new Error(
          dealershipResult.error || "Failed to fetch dealership data"
        );
      }

      if (!statsResult.success) {
        console.warn("Failed to fetch stats:", statsResult.error);
      }

      setDealership(dealershipResult.data);
      setStats(statsResult.success ? statsResult.data : null);
    } catch (error) {
      console.error("Error fetching dealership data:", error);
      setError(error.message);
      toast.error("Failed to load dealership data");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <PageSpinner text="Loading dealership portal..." />;
  }

  if (error || !dealership) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <Building2 className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Dealership Not Found
            </h2>
            <p className="text-gray-600 mb-4">
              {error || "The dealership you're looking for could not be found."}
            </p>
            <Button asChild>
              <Link href="/admin/dealerships">Back to Dealerships</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/dealerships">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dealerships
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {dealership.name} Portal
              </h1>
              <p className="text-gray-600">
                Admin view of dealership dashboard
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="default" className="bg-blue-100 text-blue-800">
              Admin View
            </Badge>
            <Button variant="outline" size="sm" asChild>
              <Link
                href={`/admin/dealership/${dealershipId}/manage`}
                target="_blank"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Manage Dealership
              </Link>
            </Button>
          </div>
        </div>

        {/* Dealership Info Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {dealership.logo && (
                  <img
                    src={dealership.logo}
                    alt="Dealership Logo"
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                )}
                <div>
                  <CardTitle className="text-2xl">{dealership.name}</CardTitle>
                  <CardDescription>
                    {dealership.description || "No description available"}
                  </CardDescription>
                </div>
              </div>
              <Badge variant="default" className="bg-green-100 text-green-800">
                Active
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Phone:</span>
                <p className="font-medium">{dealership.phone}</p>
              </div>
              <div>
                <span className="text-gray-600">Email:</span>
                <p className="font-medium">{dealership.email}</p>
              </div>
              <div>
                <span className="text-gray-600">Address:</span>
                <p className="font-medium">{dealership.address}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Car className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.totalCars}
                    </p>
                    <p className="text-gray-600">Total Cars</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.availableCars}
                    </p>
                    <p className="text-gray-600">Available</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <Car className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.soldCars}
                    </p>
                    <p className="text-gray-600">Sold</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatPriceWithCrore(Math.round(stats.avgPrice))}
                    </p>
                    <p className="text-gray-600">Avg Price</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Recent Cars */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>
                Recent Cars ({dealership.cars?.length || 0})
              </CardTitle>
              <Button variant="outline" size="sm" asChild>
                <Link
                  href={`/profile/${dealership.name.replace(/\s+/g, "-").toLowerCase()}`}
                  target="_blank"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Public Profile
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {dealership.cars && dealership.cars.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {dealership.cars.slice(0, 6).map((car) => (
                  <div
                    key={car.id}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-900">
                        {car.year} {car.make} {car.model}
                      </h3>
                      <Badge
                        variant={
                          car.status === "AVAILABLE" ? "default" : "secondary"
                        }
                        className={
                          car.status === "AVAILABLE"
                            ? "bg-green-100 text-green-800"
                            : ""
                        }
                      >
                        {car.status}
                      </Badge>
                    </div>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>Color: {car.color}</p>
                      <p>Mileage: {car.mileage?.toLocaleString()} km</p>
                      <p className="font-medium text-gray-900">
                        {car.minPrice || car.maxPrice
                          ? formatPriceRange(
                              car.minPrice || car.price,
                              car.maxPrice
                            )
                          : car.price
                            ? formatPriceWithCrore(car.price)
                            : "TBD"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Car className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No cars listed yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

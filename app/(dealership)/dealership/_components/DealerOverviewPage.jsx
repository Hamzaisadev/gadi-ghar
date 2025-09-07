"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Car, 
  Building2, 
  Users, 
  DollarSign, 
  Plus, 
  Eye, 
  TrendingUp,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Clock,
  Star,
  BarChart3,
  Activity,
  ChevronRight,
  Loader2
} from "lucide-react";
import { toast } from "sonner";
import { getDealershipData } from "@/app/actions/dealership";
import { getCarsByDealership } from "@/app/actions/cars";
import useFetch from "@/hooks/use-fetch";
import { formatPriceRange } from "@/components/utils/FormatCurrency";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function DealerOverviewPage() {
  const router = useRouter();
  const [dealership, setDealership] = useState(null);
  const [cars, setCars] = useState([]);

  // Fetch dealership data
  const {
    loading: loadingDealership,
    fn: fetchDealership,
    data: dealershipData,
  } = useFetch(getDealershipData);

  // Fetch cars data
  const {
    loading: loadingCars,
    fn: fetchCars,
    data: carsData,
  } = useFetch(() =>
    dealership ? getCarsByDealership(dealership.id) : Promise.resolve({ success: true, data: [] })
  );

  useEffect(() => {
    fetchDealership();
  }, []);

  useEffect(() => {
    if (dealershipData?.success) {
      setDealership(dealershipData.data);
    }
  }, [dealershipData]);

  useEffect(() => {
    if (dealership) {
      fetchCars();
    }
  }, [dealership]);

  useEffect(() => {
    if (carsData?.success) {
      setCars(carsData.data || []);
    }
  }, [carsData]);

  // Calculate stats
  const totalCars = cars.length;
  const availableCars = cars.filter(car => car.status === 'AVAILABLE').length;
  const soldCars = cars.filter(car => car.status === 'SOLD').length;
  const featuredCars = cars.filter(car => car.featured).length;
  const totalValue = cars.reduce((sum, car) => sum + (Number(car.maxPrice) || 0), 0);
  const avgPrice = totalCars > 0 ? totalValue / totalCars : 0;

  // Recent cars (last 5)
  const recentCars = cars
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  if (loadingDealership) {
    return (
      <div className="p-6">
        <div className="space-y-6">
          <div className="h-8 w-64 bg-gray-200 rounded animate-pulse"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!dealership) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6 text-red-600">
            Failed to load dealership information
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-car-red to-car-red-dark bg-clip-text text-transparent">
            Dashboard Overview
          </h1>
          <p className="text-car-gray text-lg mt-2">
            Welcome back, {dealership.name}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="outline" className="text-green-600 border-green-600">
            <Activity className="w-4 h-4 mr-1" />
            Active
          </Badge>
          <Button
            onClick={() => router.push("/dealership/cars/create")}
            className="bg-car-red hover:bg-car-red-dark text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Car
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cars</CardTitle>
            <Car className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{totalCars}</div>
            <p className="text-xs text-muted-foreground">
              {availableCars} available, {soldCars} sold
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              Rs {totalValue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Avg: Rs {avgPrice.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Featured Cars</CardTitle>
            <Star className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">{featuredCars}</div>
            <p className="text-xs text-muted-foreground">
              {totalCars > 0 ? Math.round((featuredCars / totalCars) * 100) : 0}% of inventory
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">{soldCars}</div>
            <p className="text-xs text-muted-foreground">
              Cars sold
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl">Recent Cars</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/dealership/cars")}
              >
                View All
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </CardHeader>
            <CardContent>
              {loadingCars ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex space-x-4">
                      <div className="w-16 h-16 bg-gray-200 rounded animate-pulse"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : recentCars.length > 0 ? (
                <div className="space-y-4">
                  {recentCars.map((car) => (
                    <div key={car.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                        {car.images?.[0] ? (
                          <Image
                            src={car.images[0]}
                            alt={`${car.make} ${car.model}`}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-200">
                            <Car className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">
                          {car.make} {car.model}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {car.year} • {formatPriceRange(car.minPrice, car.maxPrice)}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge
                            variant={car.status === 'AVAILABLE' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {car.status}
                          </Badge>
                          {car.featured && (
                            <Badge variant="outline" className="text-xs text-yellow-600 border-yellow-600">
                              <Star className="w-3 h-3 mr-1" />
                              Featured
                            </Badge>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push(`/cars/${car.id}`)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Car className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No cars added yet</p>
                  <Button
                    variant="outline"
                    className="mt-2"
                    onClick={() => router.push("/dealership/cars/create")}
                  >
                    Add Your First Car
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="h-20 flex-col space-y-2"
                  onClick={() => router.push("/dealership/cars/create")}
                >
                  <Plus className="w-6 h-6" />
                  <span>Add New Car</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex-col space-y-2"
                  onClick={() => router.push("/dealership/cars")}
                >
                  <Car className="w-6 h-6" />
                  <span>Manage Cars</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex-col space-y-2"
                  onClick={() => router.push("/dealership/settings")}
                >
                  <Building2 className="w-6 h-6" />
                  <span>Settings</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex-col space-y-2"
                  onClick={() => window.open(`/dealer/${dealership.id}`, '_blank')}
                >
                  <Eye className="w-6 h-6" />
                  <span>View Public Profile</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Dealership Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Dealership Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-sm">
                  <Building2 className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">{dealership.name}</span>
                </div>
                {dealership.address && (
                  <div className="flex items-center space-x-2 text-sm">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">{dealership.address}</span>
                  </div>
                )}
                {dealership.phone && (
                  <div className="flex items-center space-x-2 text-sm">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">{dealership.phone}</span>
                  </div>
                )}
                {dealership.email && (
                  <div className="flex items-center space-x-2 text-sm">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">{dealership.email}</span>
                  </div>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/dealership/settings")}
                className="w-full"
              >
                Update Information
              </Button>
            </CardContent>
          </Card>

          {/* Status Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Inventory Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Available</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 h-2 bg-gray-200 rounded-full">
                      <div 
                        className="h-2 bg-green-500 rounded-full" 
                        style={{ 
                          width: totalCars > 0 ? `${(availableCars / totalCars) * 100}%` : '0%' 
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{availableCars}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Sold</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 h-2 bg-gray-200 rounded-full">
                      <div 
                        className="h-2 bg-blue-500 rounded-full" 
                        style={{ 
                          width: totalCars > 0 ? `${(soldCars / totalCars) * 100}%` : '0%' 
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{soldCars}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Featured</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 h-2 bg-gray-200 rounded-full">
                      <div 
                        className="h-2 bg-yellow-500 rounded-full" 
                        style={{ 
                          width: totalCars > 0 ? `${(featuredCars / totalCars) * 100}%` : '0%' 
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{featuredCars}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Help & Support */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Need Help?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-gray-600">
                Having trouble managing your inventory? We're here to help!
              </p>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full">
                  <Phone className="w-4 h-4 mr-2" />
                  Contact Support
                </Button>
                <Button variant="outline" size="sm" className="w-full">
                  <Users className="w-4 h-4 mr-2" />
                  View Documentation
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

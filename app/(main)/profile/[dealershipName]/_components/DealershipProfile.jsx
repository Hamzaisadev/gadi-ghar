"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import OptimizedImage from "@/components/ui/optimized-image";
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Clock,
  Star,
  Car,
  TrendingUp,
  Users,
  Award,
  ChevronLeft,
  ArrowRight,
  Filter,
  Grid,
  List,
  Globe,
  Facebook,
  Twitter,
  Instagram,
  MessageCircle,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getDealershipCarsById, getDealershipStats } from "@/app/actions/dealership";
import useFetch from "@/hooks/use-fetch";
import { formatPriceRange } from "@/components/utils/FormatCurrency";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const DealershipProfile = ({ dealership }) => {
  const router = useRouter();
  const [cars, setCars] = useState([]);
  const [stats, setStats] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({});
  const [viewMode, setViewMode] = useState('grid');

  // Fetch dealership cars
  const {
    loading: loadingCars,
    fn: fetchCars,
    data: carsData,
  } = useFetch((page = 1, filterParams = {}) => 
    getDealershipCarsById(dealership.id, page, 12, filterParams)
  );

  // Fetch dealership stats
  const {
    loading: loadingStats,
    fn: fetchStats,
    data: statsData,
  } = useFetch(() => getDealershipStats(dealership.id));

  useEffect(() => {
    if (dealership?.id) {
      fetchCars(currentPage, filters);
      fetchStats();
    }
  }, [currentPage, filters, dealership?.id]);

  useEffect(() => {
    if (carsData?.success) {
      setCars(carsData.data.cars);
    }
  }, [carsData]);

  useEffect(() => {
    if (statsData?.success) {
      setStats(statsData.data);
    }
  }, [statsData]);

  const workingHours = dealership.workingHours || [];
  const today = new Date().getDay();
  const todayWorkingHour = workingHours.find(
    (wh) => {
      const dayMap = { 0: 'SUNDAY', 1: 'MONDAY', 2: 'TUESDAY', 3: 'WEDNESDAY', 4: 'THURSDAY', 5: 'FRIDAY', 6: 'SATURDAY' };
      return wh.dayOfWeek === dayMap[today];
    }
  );

  const isOpenNow = () => {
    if (!todayWorkingHour || !todayWorkingHour.isOpen) return false;
    const now = new Date();
    const currentTime = now.getHours() * 100 + now.getMinutes();
    const openTime = parseInt(todayWorkingHour.openTime.replace(':', ''));
    const closeTime = parseInt(todayWorkingHour.closeTime.replace(':', ''));
    return currentTime >= openTime && currentTime <= closeTime;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
        <Link href="/" className="hover:text-red-600 transition-colors">
          Home
        </Link>
        <ChevronLeft className="h-4 w-4 rotate-180" />
        <Link href="/dealerships" className="hover:text-red-600 transition-colors">
          Dealerships
        </Link>
        <ChevronLeft className="h-4 w-4 rotate-180" />
        <span className="text-gray-900 font-medium">{dealership.name}</span>
      </nav>

      {/* Header Section */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8">
          {/* Dealership Logo */}
          <div className="flex-shrink-0">
            <div className="w-24 h-24 lg:w-32 lg:h-32 bg-gradient-to-br from-red-50 to-red-100 rounded-2xl flex items-center justify-center border-2 border-red-200">
              {dealership.logo ? (
                <OptimizedImage
                  src={dealership.logo}
                  alt={dealership.name}
                  quality={90}
                  aspectRatio="w-full h-full object-contain"
                />
              ) : (
                <Building2 className="w-12 h-12 lg:w-16 lg:h-16 text-red-600" />
              )}
            </div>
          </div>

          {/* Dealership Info */}
          <div className="flex-1">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                  {dealership.name}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-red-600" />
                    <span>{dealership.address}</span>
                  </div>
                  {dealership.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-5 h-5 text-red-600" />
                      <a 
                        href={`tel:${dealership.phone}`}
                        className="hover:text-red-600 transition-colors"
                      >
                        {dealership.phone}
                      </a>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-red-600" />
                    <span className={`font-medium ${isOpenNow() ? 'text-green-600' : 'text-red-600'}`}>
                      {isOpenNow() ? 'Open Now' : 'Closed'}
                    </span>
                  </div>
                </div>
                {dealership.description && (
                  <p className="text-gray-700 max-w-2xl">{dealership.description}</p>
                )}
                
                {/* Social Media Links */}
                {(dealership.website || dealership.facebook || dealership.twitter || dealership.instagram || dealership.whatsapp) && (
                  <div className="flex flex-wrap items-center gap-3 mt-4">
                    {dealership.website && (
                      <a 
                        href={dealership.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-red-600 hover:text-red-700 transition-colors"
                      >
                        <Globe className="w-4 h-4" />
                        <span className="text-sm">Website</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    {dealership.facebook && (
                      <a 
                        href={dealership.facebook} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
                      >
                        <Facebook className="w-4 h-4" />
                        <span className="text-sm">Facebook</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    {dealership.twitter && (
                      <a 
                        href={dealership.twitter} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sky-600 hover:text-sky-700 transition-colors"
                      >
                        <Twitter className="w-4 h-4" />
                        <span className="text-sm">Twitter</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    {dealership.instagram && (
                      <a 
                        href={dealership.instagram} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-pink-600 hover:text-pink-700 transition-colors"
                      >
                        <Instagram className="w-4 h-4" />
                        <span className="text-sm">Instagram</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    {dealership.whatsapp && (
                      <a 
                        href={`https://wa.me/${dealership.whatsapp.replace(/[^0-9]/g, '')}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-green-600 hover:text-green-700 transition-colors"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span className="text-sm">WhatsApp</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                )}
              </div>

              {/* Contact Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                {dealership.phone && (
                  <Button 
                    className="bg-red-600 hover:bg-red-700 text-white"
                    onClick={() => window.open(`tel:${dealership.phone}`)}
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Call Now
                  </Button>
                )}
                {dealership.email && (
                  <Button 
                    variant="outline" 
                    className="border-red-600 text-red-600 hover:bg-red-50"
                    onClick={() => window.open(`mailto:${dealership.email}`)}
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Email
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      {!loadingStats && stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-l-4 border-l-red-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Cars</CardTitle>
              <Car className="h-5 w-5 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.totalCars || 0}</div>
              <p className="text-xs text-gray-500">
                {stats.availableCars || 0} available
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Years in Business</CardTitle>
              <Award className="h-5 w-5 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.yearsInBusiness || 0}+</div>
              <p className="text-xs text-gray-500">Years of experience</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Featured Cars</CardTitle>
              <Star className="h-5 w-5 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.featuredCars || 0}</div>
              <p className="text-xs text-gray-500">Premium selection</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Avg. Price</CardTitle>
              <TrendingUp className="h-5 w-5 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                Rs {Math.round(stats.avgPrice || 0).toLocaleString()}
              </div>
              <p className="text-xs text-gray-500">Average vehicle price</p>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content - Cars Listing */}
        <div className="lg:col-span-2">
          <Tabs value="inventory" className="w-full">
            <TabsList className="grid w-full grid-cols-1">
              <TabsTrigger value="inventory" className="flex items-center gap-2">
                <Car className="w-4 h-4" />
                Vehicle Inventory ({stats.totalCars || 0})
              </TabsTrigger>
            </TabsList>
            <TabsContent value="inventory" className="space-y-6">
              {/* View Controls */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className={viewMode === 'grid' ? 'bg-red-600 hover:bg-red-700' : ''}
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className={viewMode === 'list' ? 'bg-red-600 hover:bg-red-700' : ''}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </Button>
              </div>

              {/* Cars Grid/List */}
              {loadingCars ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <Card key={i} className="animate-pulse">
                      <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                      <CardContent className="p-4">
                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : cars.length > 0 ? (
                <div className={viewMode === 'grid' 
                  ? "grid grid-cols-1 md:grid-cols-2 gap-6" 
                  : "space-y-4"
                }>
                  {cars.map((car) => (
                    <Card 
                      key={car.id} 
                      className="group hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-red-500"
                      onClick={() => router.push(`/cars/${car.id}`)}
                    >
                      {viewMode === 'grid' ? (
                        <>
                          <div className="aspect-video overflow-hidden rounded-t-lg relative">
                            {car.images && car.images.length > 0 ? (
                              <OptimizedImage
                                src={car.images[0]}
                                alt={`${car.make} ${car.model}`}
                                priority={false}
                                quality={85}
                                aspectRatio="aspect-video"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                <Car className="h-12 w-12 text-gray-400" />
                              </div>
                            )}
                            {car.featured && (
                              <Badge className="absolute top-2 left-2 bg-red-600">
                                <Star className="w-3 h-3 mr-1" />
                                Featured
                              </Badge>
                            )}
                          </div>
                          <CardContent className="p-4">
                            <h3 className="font-semibold text-lg text-gray-900 mb-2">
                              {car.year} {car.make} {car.model}
                            </h3>
                            <div className="text-xl font-bold text-red-600 mb-2">
                              {formatPriceRange(car.minPrice, car.maxPrice)}
                            </div>
                            <div className="flex items-center justify-between text-sm text-gray-600">
                              <span>{car.mileage?.toLocaleString() || 0} miles</span>
                              <span>{car.fuelType}</span>
                              <span>{car.transmission}</span>
                            </div>
                          </CardContent>
                        </>
                      ) : (
                        <div className="flex items-center p-4 gap-4">
                          <div className="w-24 h-16 flex-shrink-0 rounded-lg overflow-hidden">
                            {car.images && car.images.length > 0 ? (
                              <OptimizedImage
                                src={car.images[0]}
                                alt={`${car.make} ${car.model}`}
                                priority={false}
                                quality={80}
                                aspectRatio="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                <Car className="h-6 w-6 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg text-gray-900">
                              {car.year} {car.make} {car.model}
                            </h3>
                            <div className="text-lg font-bold text-red-600">
                              {formatPriceRange(car.minPrice, car.maxPrice)}
                            </div>
                            <div className="text-sm text-gray-600">
                              {car.mileage?.toLocaleString() || 0} miles • {car.fuelType} • {car.transmission}
                            </div>
                          </div>
                          <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-red-600 transition-colors" />
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="p-12 text-center">
                  <Car className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No vehicles available</h3>
                  <p className="text-gray-600">This dealership currently has no vehicles in their inventory.</p>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Working Hours */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-red-600" />
                Working Hours
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {workingHours.length > 0 ? (
                  workingHours
                    .sort((a, b) => {
                      const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
                      return days.indexOf(a.dayOfWeek) - days.indexOf(b.dayOfWeek);
                    })
                    .map((day) => (
                      <div key={day.dayOfWeek} className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-900">
                          {day.dayOfWeek.charAt(0) + day.dayOfWeek.slice(1).toLowerCase()}
                        </span>
                        <span className="text-sm text-gray-600">
                          {day.isOpen ? `${day.openTime} - ${day.closeTime}` : 'Closed'}
                        </span>
                      </div>
                    ))
                ) : (
                  <div className="text-center text-gray-500">
                    <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>Working hours not available</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-red-600" />
                Get in Touch
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {dealership.email && (
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-red-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Email</p>
                    <a 
                      href={`mailto:${dealership.email}`}
                      className="text-sm text-red-600 hover:underline"
                    >
                      {dealership.email}
                    </a>
                  </div>
                </div>
              )}
              {dealership.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-red-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Phone</p>
                    <a 
                      href={`tel:${dealership.phone}`}
                      className="text-sm text-red-600 hover:underline"
                    >
                      {dealership.phone}
                    </a>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-red-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Address</p>
                  <p className="text-sm text-gray-600">{dealership.address}</p>
                </div>
              </div>
              
              {/* Social Media Section */}
              {(dealership.website || dealership.facebook || dealership.twitter || dealership.instagram || dealership.whatsapp) && (
                <>
                  <hr className="my-4" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 mb-3">Follow Us</p>
                    <div className="flex flex-wrap gap-3">
                      {dealership.website && (
                        <a 
                          href={dealership.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                          <Globe className="w-4 h-4 text-gray-700" />
                          <span className="text-sm text-gray-700">Website</span>
                        </a>
                      )}
                      {dealership.facebook && (
                        <a 
                          href={dealership.facebook} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-3 py-2 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                        >
                          <Facebook className="w-4 h-4 text-blue-600" />
                          <span className="text-sm text-blue-700">Facebook</span>
                        </a>
                      )}
                      {dealership.twitter && (
                        <a 
                          href={dealership.twitter} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-3 py-2 bg-sky-50 hover:bg-sky-100 rounded-lg transition-colors"
                        >
                          <Twitter className="w-4 h-4 text-sky-600" />
                          <span className="text-sm text-sky-700">Twitter</span>
                        </a>
                      )}
                      {dealership.instagram && (
                        <a 
                          href={dealership.instagram} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-3 py-2 bg-pink-50 hover:bg-pink-100 rounded-lg transition-colors"
                        >
                          <Instagram className="w-4 h-4 text-pink-600" />
                          <span className="text-sm text-pink-700">Instagram</span>
                        </a>
                      )}
                      {dealership.whatsapp && (
                        <a 
                          href={`https://wa.me/${dealership.whatsapp.replace(/[^0-9]/g, '')}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-3 py-2 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                        >
                          <MessageCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm text-green-700">WhatsApp</span>
                        </a>
                      )}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                className="w-full bg-red-600 hover:bg-red-700"
                onClick={() => window.open(`tel:${dealership.phone}`)}
                disabled={!dealership.phone}
              >
                <Phone className="w-4 h-4 mr-2" />
                Call Dealership
              </Button>
              <Button 
                variant="outline" 
                className="w-full border-red-600 text-red-600 hover:bg-red-50"
                onClick={() => window.open(`mailto:${dealership.email}`)}
                disabled={!dealership.email}
              >
                <Mail className="w-4 h-4 mr-2" />
                Send Email
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => window.open(`https://maps.google.com/maps?q=${encodeURIComponent(dealership.address)}`, '_blank')}
              >
                <MapPin className="w-4 h-4 mr-2" />
                Get Directions
              </Button>
              {dealership.whatsapp && (
                <Button 
                  className="w-full bg-green-600 hover:bg-green-700"
                  onClick={() => window.open(`https://wa.me/${dealership.whatsapp.replace(/[^0-9]/g, '')}`, '_blank')}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  WhatsApp Us
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DealershipProfile;

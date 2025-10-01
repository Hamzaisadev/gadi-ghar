"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  Car,
  User,
  Phone,
  Mail,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Filter,
  Eye,
  RefreshCw,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  getDealershipTestDriveBookings,
  updateTestDriveStatus,
} from "@/app/actions/test-drive";

const statusConfig = {
  PENDING: {
    color: "bg-yellow-500 hover:bg-yellow-600",
    icon: AlertTriangle,
    label: "Pending",
  },
  CONFIRMED: {
    color: "bg-green-500 hover:bg-green-600",
    icon: CheckCircle2,
    label: "Confirmed",
  },
  CANCELLED: {
    color: "bg-red-500 hover:bg-red-600",
    icon: XCircle,
    label: "Cancelled",
  },
  COMPLETED: {
    color: "bg-blue-500 hover:bg-blue-600",
    icon: CheckCircle2,
    label: "Completed",
  },
  NO_SHOW: {
    color: "bg-gray-500 hover:bg-gray-600",
    icon: XCircle,
    label: "No Show",
  },
};

export default function DealershipTestDrivesPage() {
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [bookingsError, setBookingsError] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Load bookings function
  const loadBookings = async () => {
    try {
      setLoadingBookings(true);
      setBookingsError(null);
      console.log('🚀 Fetching test drive bookings...');
      
      const result = await getDealershipTestDriveBookings();
      
      if (result?.success) {
        console.log('✅ Successfully loaded bookings:', result.data?.length || 0);
        setBookings(Array.isArray(result.data) ? result.data : []);
      } else {
        console.error('❌ Failed to load bookings:', result?.error);
        setBookingsError(result?.error || 'Failed to load test drive bookings');
        setBookings([]);
        
        // Only show toast for non-NO_DEALERSHIP_ASSOCIATED errors
        if (result?.error !== 'NO_DEALERSHIP_ASSOCIATED') {
          toast.error(result?.error || 'Failed to load test drive bookings');
        }
      }
    } catch (error) {
      console.error('❌ Error loading test drive bookings:', error);
      setBookingsError(error.message);
      setBookings([]);
      toast.error(`Failed to load test drives: ${error.message}`);
    } finally {
      setLoadingBookings(false);
    }
  };

  // Handle initial load
  useEffect(() => {
    loadBookings();
  }, []); // Remove the dependency array that was causing the loop

  // Handle status updates
  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      setUpdatingStatus(true);
      const result = await updateTestDriveStatus(bookingId, newStatus);
      
      if (result?.success) {
        toast.success('Booking status updated successfully');
        // Refresh the bookings list
        await loadBookings();
        setSelectedBooking(null);
      } else {
        throw new Error(result?.error || 'Failed to update booking status');
      }
    } catch (error) {
      console.error('❌ Error updating booking status:', error);
      toast.error(error.message || 'Failed to update booking status');
    } finally {
      setUpdatingStatus(false);
    }
  };


  const getStatusBadge = (status) => {
    const config = statusConfig[status] || statusConfig.PENDING;
    const Icon = config.icon;
    
    const badgeStyles = {
      'PENDING': 'bg-gradient-to-r from-yellow-500 to-amber-500 text-white shadow-sm',
      'CONFIRMED': 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-sm',
      'CANCELLED': 'bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-sm',
      'COMPLETED': 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-sm',
      'NO_SHOW': 'bg-gradient-to-r from-gray-500 to-slate-500 text-white shadow-sm',
    };
    
    return (
      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${badgeStyles[status] || badgeStyles.PENDING}`}>
        <Icon className="w-3 h-3 mr-1.5" />
        {config.label}
      </div>
    );
  };

  // Handle no dealership associated case
  if (bookingsError === 'NO_DEALERSHIP_ASSOCIATED') {
    return (
      <div className="bg-gradient-to-br from-slate-50 via-white to-blue-50/20 py-8">
        <div className="container mx-auto px-4 sm:px-6 py-8">
          <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-8 text-center">
              <div className="flex justify-center mb-6">
                <div className="bg-red-100 p-4 rounded-full">
                  <XCircle className="h-12 w-12 text-red-600" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">No Dealership Associated</h2>
              <p className="text-gray-600 mb-8">
                Your account is not currently associated with any dealership. 
                Please contact support to get access to the dealership dashboard.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild>
                  <a href="/contact" className="bg-blue-600 hover:bg-blue-700 text-white">
                    Contact Support
                  </a>
                </Button>
                <Button variant="outline" asChild>
                  <a href="/">
                    Return to Home
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-full">
      {/* Modern Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-red-500 to-red-600 p-3 rounded-xl shadow-lg">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Test Drive Management
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  Manage your customer test drive appointments
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={loadBookings}
                disabled={loadingBookings}
                className="border-gray-300 hover:border-red-300 hover:text-red-600"
              >
                {loadingBookings ? (
                  <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-2" />
                )}
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Modern Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Total Bookings Card */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-4 sm:p-6 border border-blue-200 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-center">
              <div className="bg-blue-500 p-2 sm:p-3 rounded-xl shadow-lg">
                <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-blue-700">Total Bookings</p>
                <p className="text-xl sm:text-2xl font-bold text-blue-900">{bookings.length}</p>
              </div>
            </div>
          </div>
          
          {Object.entries(statusConfig).map(([status, config]) => {
            const count = bookings.filter((b) => b.status === status).length;
            const Icon = config.icon;
            const percentage = bookings.length > 0 ? ((count / bookings.length) * 100).toFixed(0) : 0;
            
            // Color mapping for better design
            const colorMap = {
              'bg-yellow-500': 'from-yellow-50 to-yellow-100 border-yellow-200 text-yellow-700',
              'bg-green-500': 'from-green-50 to-green-100 border-green-200 text-green-700',
              'bg-red-500': 'from-red-50 to-red-100 border-red-200 text-red-700',
              'bg-blue-500': 'from-blue-50 to-blue-100 border-blue-200 text-blue-700',
              'bg-gray-500': 'from-gray-50 to-gray-100 border-gray-200 text-gray-700',
            };
            
            const gradientClass = colorMap[config.color] || 'from-gray-50 to-gray-100 border-gray-200 text-gray-700';
            const iconColorMap = {
              'bg-yellow-500': 'bg-yellow-500',
              'bg-green-500': 'bg-green-500',
              'bg-red-500': 'bg-red-500',
              'bg-blue-500': 'bg-blue-500',
              'bg-gray-500': 'bg-gray-500',
            };
            const iconBg = iconColorMap[config.color] || 'bg-gray-500';
            
            return (
              <div key={status} className={`bg-gradient-to-br ${gradientClass} rounded-2xl p-4 sm:p-6 border shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer`}
                   onClick={() => setSelectedStatus(status)}>
                <div className="flex items-center">
                  <div className={`${iconBg} p-2 sm:p-3 rounded-xl shadow-lg`}>
                    <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <div className="ml-3 sm:ml-4">
                    <p className="text-xs sm:text-sm font-medium opacity-80">
                      {config.label}
                    </p>
                    <p className="text-xl sm:text-2xl font-bold">{count}</p>
                    <p className="text-xs opacity-60">{percentage}% of total</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modern Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="bg-gray-100 p-2 rounded-lg">
                <Filter className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Filter Appointments</h3>
                <p className="text-sm text-gray-500">View appointments by status</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-full sm:w-48 border-gray-300 focus:border-red-300 focus:ring-red-200">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {Object.entries(statusConfig).map(([status, config]) => (
                    <SelectItem key={status} value={status}>
                      <div className="flex items-center space-x-2">
                        <config.icon className="w-4 h-4" />
                        <span>{config.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <div className="text-sm text-gray-500 text-center sm:text-left">
                {bookings.filter(b => selectedStatus === 'all' || b.status === selectedStatus).length} appointments
              </div>
            </div>
          </div>
        </div>

        {/* Modern Bookings List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-4 sm:px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-red-100 p-2 rounded-lg">
                  <Calendar className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Test Drive Appointments</h3>
                  <p className="text-sm text-gray-500">
                    {bookings.filter(b => selectedStatus === 'all' || b.status === selectedStatus).length} appointments found
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="p-4 sm:p-6">
            {loadingBookings ? (
              <div className="flex flex-col items-center justify-center h-64 space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                <p className="text-muted-foreground">Loading test drive bookings...</p>
              </div>
            ) : bookingsError ? (
              <div className="flex flex-col items-center justify-center h-64 space-y-4 p-4 text-center">
                <AlertTriangle className="h-12 w-12 text-destructive" />
                <h3 className="text-lg font-medium">
                  {bookingsError === 'NO_DEALERSHIP_ASSOCIATED' 
                    ? 'No Dealership Associated' 
                    : 'Failed to load test drives'}
                </h3>
                <p className="text-muted-foreground">
                  {bookingsError === 'NO_DEALERSHIP_ASSOCIATED'
                    ? 'Your account is not associated with any dealership. Please contact support for assistance.'
                    : bookingsError || 'An error occurred while loading test drive bookings.'}
                </p>
                {bookingsError !== 'NO_DEALERSHIP_ASSOCIATED' && (
                  <Button 
                    variant="outline" 
                    onClick={loadBookings}
                    disabled={loadingBookings}
                  >
                    {loadingBookings ? (
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <RefreshCw className="mr-2 h-4 w-4" />
                    )}
                    Retry
                  </Button>
                )}
              </div>
            ) : bookings.length === 0 ? (
              <div className="text-center py-16">
                <div className="bg-gray-100 p-6 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                  <Calendar className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {selectedStatus === "all" 
                    ? "No test drive bookings yet" 
                    : `No ${statusConfig[selectedStatus]?.label.toLowerCase() || selectedStatus.toLowerCase()} bookings`}
                </h3>
                <p className="text-gray-600 max-w-md mx-auto mb-6">
                  {selectedStatus === "all"
                    ? "When customers book test drives for your cars, they'll appear here. Start by adding some cars to your inventory."
                    : `No ${statusConfig[selectedStatus]?.label.toLowerCase() || selectedStatus.toLowerCase()} bookings found. Try selecting a different status or check back later.`}
                </p>
                {selectedStatus !== "all" ? (
                  <Button 
                    variant="outline" 
                    className="border-red-300 text-red-600 hover:bg-red-50"
                    onClick={() => setSelectedStatus("all")}
                  >
                    Show All Bookings
                  </Button>
                ) : (
                  <Button 
                    className="bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700"
                    onClick={() => window.location.href = '/dealership/cars/create'}
                  >
                    Add Your First Car
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                {bookings
                  .filter(booking => selectedStatus === 'all' || booking.status === selectedStatus)
                  .map((booking) => (
                  <div
                    key={booking.id}
                    className="group bg-gradient-to-r from-white via-gray-50 to-white rounded-xl border border-gray-200 hover:border-red-200 hover:shadow-lg transition-all duration-300 overflow-hidden"
                  >
                    <div className="p-4 sm:p-6">
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between space-y-4 lg:space-y-0">
                        <div className="flex items-start space-x-3 sm:space-x-4 flex-1">
                          {/* Car Icon */}
                          <div className="bg-gradient-to-br from-red-500 to-red-600 p-2 sm:p-3 rounded-xl shadow-lg flex-shrink-0">
                            <Car className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                          </div>
                          
                          {/* Main Content */}
                          <div className="flex-1 min-w-0">
                            {/* Car Info & Status */}
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 space-y-2 sm:space-y-0">
                              <div>
                                <h3 className="text-lg font-bold text-gray-900 group-hover:text-red-600 transition-colors">
                                  {booking.car.year} {booking.car.make} {booking.car.model}
                                </h3>
                                <p className="text-sm text-gray-500">
                                  {booking.car.color} • {booking.car.fuelType} • {booking.car.transmission}
                                </p>
                              </div>
                              {getStatusBadge(booking.status)}
                            </div>
                            
                            {/* Appointment Details */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4">
                              <div className="flex items-center space-x-2 sm:space-x-3 bg-blue-50 rounded-lg p-2 sm:p-3">
                                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                                <div>
                                  <p className="text-xs sm:text-sm font-medium text-blue-900">
                                    {format(new Date(booking.bookingDate), "MMM d, yyyy")}
                                  </p>
                                  <p className="text-xs text-blue-600">Appointment Date</p>
                                </div>
                              </div>
                              
                              <div className="flex items-center space-x-2 sm:space-x-3 bg-green-50 rounded-lg p-2 sm:p-3">
                                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                                <div>
                                  <p className="text-xs sm:text-sm font-medium text-green-900">
                                    {booking.startTime} - {booking.endTime}
                                  </p>
                                  <p className="text-xs text-green-600">Time Slot</p>
                                </div>
                              </div>
                              
                              <div className="flex items-center space-x-2 sm:space-x-3 bg-purple-50 rounded-lg p-2 sm:p-3 sm:col-span-2 lg:col-span-1">
                                <User className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                                <div className="min-w-0">
                                  <p className="text-xs sm:text-sm font-medium text-purple-900 truncate">
                                    {booking.customer.name || booking.customer.email}
                                  </p>
                                  <p className="text-xs text-purple-600">Customer</p>
                                </div>
                              </div>
                            </div>
                            
                            {/* Customer Notes */}
                            {booking.notes && (
                              <div className="bg-amber-50 border border-amber-200 rounded-lg p-2 sm:p-3 mb-4">
                                <p className="text-xs sm:text-sm text-amber-800">
                                  <span className="font-medium">Note:</span> {booking.notes}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* Action Button */}
                        <div className="w-full lg:w-auto lg:ml-4">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedBooking(booking)}
                                className="w-full lg:w-auto border-gray-300 hover:border-red-300 hover:text-red-600 hover:bg-red-50"
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                View Details
                              </Button>
                            </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                          <DialogHeader>
                            <DialogTitle>Test Drive Details</DialogTitle>
                            <DialogDescription>
                              Manage this test drive appointment
                            </DialogDescription>
                          </DialogHeader>

                          {selectedBooking && (
                            <div className="space-y-6">
                              {/* Car Details */}
                              <div className="space-y-2">
                                <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                                  Vehicle
                                </h4>
                                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                                  <Car className="w-8 h-8 text-primary" />
                                  <div>
                                    <p className="font-semibold">
                                      {selectedBooking.car.year}{" "}
                                      {selectedBooking.car.make}{" "}
                                      {selectedBooking.car.model}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                      {selectedBooking.car.color} •{" "}
                                      {selectedBooking.car.fuelType}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              {/* Appointment Details */}
                              <div className="space-y-2">
                                <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                                  Appointment
                                </h4>
                                <div className="grid grid-cols-2 gap-3">
                                  <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                                    <Calendar className="w-5 h-5 text-primary" />
                                    <div>
                                      <p className="font-medium">
                                        {format(
                                          new Date(selectedBooking.bookingDate),
                                          "MMM d, yyyy"
                                        )}
                                      </p>
                                      <p className="text-sm text-muted-foreground">
                                        Date
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                                    <Clock className="w-5 h-5 text-primary" />
                                    <div>
                                      <p className="font-medium">
                                        {selectedBooking.startTime} -{" "}
                                        {selectedBooking.endTime}
                                      </p>
                                      <p className="text-sm text-muted-foreground">
                                        Time
                                      </p>
                                    </div>
                                  </div>
                                </div>
                                <div className="p-3 bg-muted rounded-lg">
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">
                                      Status:
                                    </span>
                                    {getStatusBadge(selectedBooking.status)}
                                  </div>
                                </div>
                              </div>

                              {/* Customer Details */}
                              <div className="space-y-2">
                                <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                                  Customer Information
                                </h4>
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                                    <User className="w-5 h-5 text-primary" />
                                    <div>
                                      <p className="font-medium">
                                        {selectedBooking.customer.name ||
                                          "Name not provided"}
                                      </p>
                                      <p className="text-sm text-muted-foreground">
                                        Customer Name
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                                    <Mail className="w-5 h-5 text-primary" />
                                    <div>
                                      <p className="font-medium">
                                        {selectedBooking.customer.email}
                                      </p>
                                      <p className="text-sm text-muted-foreground">
                                        Email
                                      </p>
                                    </div>
                                  </div>
                                  {selectedBooking.customer.phone && (
                                    <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                                      <Phone className="w-5 h-5 text-primary" />
                                      <div>
                                        <p className="font-medium">
                                          {selectedBooking.customer.phone}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                          Phone
                                        </p>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Notes */}
                              {selectedBooking.notes && (
                                <div className="space-y-2">
                                  <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                                    Customer Notes
                                  </h4>
                                  <div className="p-3 bg-muted rounded-lg">
                                    <p className="text-sm">
                                      {selectedBooking.notes}
                                    </p>
                                  </div>
                                </div>
                              )}

                              {/* Status Update Buttons */}
                              <div className="space-y-3">
                                <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                                  Update Status
                                </h4>
                                <div className="grid grid-cols-2 gap-2">
                                  {selectedBooking.status !== "CONFIRMED" && (
                                    <Button
                                      onClick={() =>
                                        handleStatusUpdate(
                                          selectedBooking.id,
                                          "CONFIRMED"
                                        )
                                      }
                                      disabled={updatingStatus}
                                      className="bg-green-600 hover:bg-green-700"
                                    >
                                      <CheckCircle2 className="w-4 h-4 mr-2" />
                                      Confirm
                                    </Button>
                                  )}
                                  {selectedBooking.status !== "CANCELLED" && (
                                    <Button
                                      onClick={() =>
                                        handleStatusUpdate(
                                          selectedBooking.id,
                                          "CANCELLED"
                                        )
                                      }
                                      disabled={updatingStatus}
                                      variant="destructive"
                                    >
                                      <XCircle className="w-4 h-4 mr-2" />
                                      Cancel
                                    </Button>
                                  )}
                                  {selectedBooking.status !== "COMPLETED" && (
                                    <Button
                                      onClick={() =>
                                        handleStatusUpdate(
                                          selectedBooking.id,
                                          "COMPLETED"
                                        )
                                      }
                                      disabled={updatingStatus}
                                      className="bg-blue-600 hover:bg-blue-700"
                                    >
                                      <CheckCircle2 className="w-4 h-4 mr-2" />
                                      Complete
                                    </Button>
                                  )}
                                  {selectedBooking.status !== "NO_SHOW" && (
                                    <Button
                                      onClick={() =>
                                        handleStatusUpdate(
                                          selectedBooking.id,
                                          "NO_SHOW"
                                        )
                                      }
                                      disabled={updatingStatus}
                                      variant="secondary"
                                    >
                                      <XCircle className="w-4 h-4 mr-2" />
                                      No Show
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </div>
                </div>
                </div>
              </div>
              ))}
            </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

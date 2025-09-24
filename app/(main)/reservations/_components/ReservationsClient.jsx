"use client";

import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Calendar,
  Clock,
  Car,
  MapPin,
  Phone,
  Mail,
  Eye,
  XCircle,
  CheckCircle2,
  AlertTriangle,
  Filter,
  Search,
  CalendarDays,
  Building2,
  User,
  ExternalLink,
  Loader2,
  AlertCircle,
  CheckCircle,
  Timer,
  Ban,
  UserX,
} from "lucide-react";
import { format, parseISO, isPast, isToday, isTomorrow } from "date-fns";
import { toast } from "sonner";
import { cancelTestDrive } from "@/app/actions/test-drive";
import useFetch from "@/hooks/use-fetch";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { formatPriceWithCrore } from "@/components/utils/FormatCurrency";

// Status configuration with enhanced styling
const statusConfig = {
  PENDING: {
    color: "bg-amber-500",
    textColor: "text-amber-700",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    icon: Timer,
    label: "Pending",
    description: "Awaiting dealership confirmation",
  },
  CONFIRMED: {
    color: "bg-green-500",
    textColor: "text-green-700",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    icon: CheckCircle,
    label: "Confirmed",
    description: "Ready for your test drive",
  },
  CANCELLED: {
    color: "bg-red-500",
    textColor: "text-red-700",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    icon: Ban,
    label: "Cancelled",
    description: "Booking was cancelled",
  },
  COMPLETED: {
    color: "bg-blue-500",
    textColor: "text-blue-700",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    icon: CheckCircle2,
    label: "Completed",
    description: "Test drive completed",
  },
  NO_SHOW: {
    color: "bg-gray-500",
    textColor: "text-gray-700",
    bgColor: "bg-gray-50",
    borderColor: "border-gray-200",
    icon: UserX,
    label: "No Show",
    description: "Missed appointment",
  },
};

const ReservationCard = ({ booking, onCancel, onViewDetails }) => {
  const statusInfo = statusConfig[booking.status] || statusConfig.PENDING;
  const StatusIcon = statusInfo.icon;

  const bookingDate = new Date(booking.bookingDate);
  const isUpcomingDate = !isPast(bookingDate) && !isToday(bookingDate);
  const isTodayDate = isToday(bookingDate);
  const isTomorrowDate = isTomorrow(bookingDate);
  const isPastDate = isPast(bookingDate);

  const canCancel = ["PENDING", "CONFIRMED"].includes(booking.status) && !isPastDate;

  const getDateLabel = () => {
    if (isTodayDate) return "Today";
    if (isTomorrowDate) return "Tomorrow";
    if (isUpcomingDate) return "Upcoming";
    return isPastDate ? "Past" : "Today";
  };

  const getPriorityLevel = () => {
    if (isTodayDate) return "high";
    if (isTomorrowDate) return "medium";
    return "normal";
  };

  const priorityLevel = getPriorityLevel();

  return (
    <Card
      className={cn(
        "overflow-hidden transition-all duration-300 hover:shadow-xl border-l-4 group",
        statusInfo.borderColor,
        isTodayDate && "ring-2 ring-car-red/20 shadow-lg",
        isUpcomingDate && "bg-gradient-to-r from-blue-50/30 to-white",
        isPastDate && "opacity-90",
        priorityLevel === "high" && "border-l-car-red",
        priorityLevel === "medium" && "border-l-amber-400"
      )}
    >
      <CardContent className="p-4 lg:p-6">
        {/* Mobile-first responsive header */}
        <div className="space-y-4">
          {/* Status and Priority Indicator */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge className={cn("text-white font-semibold text-xs", statusInfo.color)}>
                <StatusIcon className="w-3 h-3 mr-1" />
                {statusInfo.label}
              </Badge>
              {isTodayDate && (
                <Badge className="bg-car-red text-white text-xs font-semibold">
                  TODAY
                </Badge>
              )}
              {isTomorrowDate && (
                <Badge className="bg-amber-500 text-white text-xs font-semibold">
                  TOMORROW
                </Badge>
              )}
            </div>
            <span className="text-xs text-slate-500 font-medium bg-slate-100 px-2 py-1 rounded-full">
              {getDateLabel()}
            </span>
          </div>

          {/* Car Information */}
          <div className="flex items-start gap-3">
            <div className="bg-car-red/10 p-3 rounded-xl group-hover:bg-car-red/15 transition-colors">
              <Car className="h-6 w-6 text-car-red" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg lg:text-xl font-bold text-slate-900 mb-1 leading-tight">
                {booking.car.year} {booking.car.make} {booking.car.model}
              </h3>
              <div className="flex flex-wrap items-center gap-1 text-xs text-slate-600 mb-2">
                <span className="bg-slate-100 px-2 py-1 rounded-full">{booking.car.color}</span>
                <span className="bg-slate-100 px-2 py-1 rounded-full">{booking.car.fuelType}</span>
                <span className="bg-slate-100 px-2 py-1 rounded-full">{booking.car.transmission}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Date and Time Info */}
        <div className="mb-4">
          <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl p-4 border border-slate-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="bg-car-red/10 p-2 rounded-lg">
                  <Calendar className="h-5 w-5 text-car-red" />
                </div>
                <div>
                  <div className="text-xs text-slate-500 uppercase tracking-wide font-medium mb-1">
                    Date
                  </div>
                  <div className="font-bold text-slate-900">
                    {format(bookingDate, "EEEE, MMM d, yyyy")}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="bg-car-red/10 p-2 rounded-lg">
                  <Clock className="h-5 w-5 text-car-red" />
                </div>
                <div>
                  <div className="text-xs text-slate-500 uppercase tracking-wide font-medium mb-1">
                    Time
                  </div>
                  <div className="font-bold text-slate-900">
                    {booking.startTime} - {booking.endTime}
                  </div>
                  <div className="text-xs text-slate-600 mt-1">
                    ~1 hour session
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Status Description */}
        <div
          className={cn(
            "p-3 rounded-xl mb-4 border",
            statusInfo.bgColor,
            statusInfo.borderColor
          )}
        >
          <div className="flex items-center gap-2">
            <StatusIcon className={cn("h-4 w-4", statusInfo.textColor)} />
            <span className={cn("text-sm font-medium", statusInfo.textColor)}>
              {statusInfo.description}
            </span>
          </div>
        </div>

        {/* Car Image and Price */}
        {booking.car.images && booking.car.images.length > 0 && (
          <div className="mb-4 relative overflow-hidden rounded-xl bg-gray-100 aspect-video w-full">
            <img
              src={booking.car.images[0]}
              alt={`${booking.car.year} ${booking.car.make} ${booking.car.model}`}
              className="w-full h-full object-contain p-2"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/placeholder-car.png';
              }}
            />
            <div className="absolute bottom-2 right-2 bg-black/80 text-white px-3 py-1 rounded-full text-sm font-semibold backdrop-blur-sm">
              {booking.car.price
                ? formatPriceWithCrore(booking.car.price)
                : "TBD"}
            </div>
          </div>
        )}

        {/* Notes */}
        {booking.notes && (
          <div className="mb-4 p-3 bg-blue-50 rounded-xl border border-blue-200">
            <div className="text-xs text-blue-600 uppercase tracking-wide font-medium mb-1">
              Your Notes
            </div>
            <p className="text-sm text-blue-900">{booking.notes}</p>
          </div>
        )}

        {/* Enhanced Action Buttons */}
        <div className="border-t border-slate-200 pt-4 mt-4">
          <div className="flex flex-col gap-3">
            {/* Primary Actions */}
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                onClick={() => onViewDetails(booking)}
                className="flex-1 bg-car-red hover:bg-car-red-dark text-white font-semibold"
              >
                <Eye className="w-4 h-4 mr-2" />
                View Full Details
              </Button>
              
              <Link href={`/cars/${booking.carId}`} className="flex-1">
                <Button variant="outline" className="w-full hover:bg-slate-50 border-2 font-semibold">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Car Listing
                </Button>
              </Link>
            </div>
            
            {/* Secondary Actions */}
            {canCancel && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 font-semibold"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Cancel Booking
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="sm:max-w-md">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                      <XCircle className="h-5 w-5 text-red-500" />
                      Cancel Test Drive?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-slate-600">
                      This will cancel your test drive for the{" "}
                      <span className="font-semibold">
                        {booking.car.year} {booking.car.make} {booking.car.model}
                      </span>
                      {" "}scheduled on {format(bookingDate, "MMM d, yyyy")} at {booking.startTime}.
                      <br /><br />
                      This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Keep Booking</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => onCancel(booking.id)}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Yes, Cancel Booking
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const ReservationDetailsDialog = ({ booking, isOpen, onClose }) => {
  if (!booking) return null;

  const statusInfo = statusConfig[booking.status] || statusConfig.PENDING;
  const StatusIcon = statusInfo.icon;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Car className="h-6 w-6 text-car-red" />
            Test Drive Details
          </DialogTitle>
          <DialogDescription>
            Complete information about your test drive booking
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status Badge */}
          <div className="flex items-center justify-center">
            <Badge
              className={cn(
                "text-white font-semibold px-6 py-2 text-lg",
                statusInfo.color
              )}
            >
              <StatusIcon className="w-5 h-5 mr-2" />
              {statusInfo.label}
            </Badge>
          </div>

          {/* Car Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="h-5 w-5 text-car-red" />
                Vehicle Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {booking.car.images && booking.car.images.length > 0 && (
                <div className="relative overflow-hidden rounded-xl">
                  <img
                    src={booking.car.images[0]}
                    alt={`${booking.car.year} ${booking.car.make} ${booking.car.model}`}
                    className="w-full h-48 object-cover"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-slate-500">Vehicle</div>
                  <div className="font-semibold text-lg">
                    {booking.car.year} {booking.car.make} {booking.car.model}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-slate-500">Price</div>
                  <div className="font-semibold text-lg text-car-red">
                    {booking.car.price
                      ? formatPriceWithCrore(booking.car.price)
                      : "TBD"}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-slate-500">Color</div>
                  <div className="font-semibold">{booking.car.color}</div>
                </div>
                <div>
                  <div className="text-sm text-slate-500">Fuel Type</div>
                  <div className="font-semibold">{booking.car.fuelType}</div>
                </div>
                <div>
                  <div className="text-sm text-slate-500">Transmission</div>
                  <div className="font-semibold">
                    {booking.car.transmission}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-slate-500">Mileage</div>
                  <div className="font-semibold">
                    {booking.car.mileage
                      ? `${booking.car.mileage.toLocaleString()} mi`
                      : "—"}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Appointment Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-car-red" />
                Appointment Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                  <Calendar className="h-6 w-6 text-car-red" />
                  <div>
                    <div className="text-sm text-slate-500">Date</div>
                    <div className="font-semibold">
                      {format(
                        new Date(booking.bookingDate),
                        "EEEE, MMMM d, yyyy"
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                  <Clock className="h-6 w-6 text-car-red" />
                  <div>
                    <div className="text-sm text-slate-500">Time</div>
                    <div className="font-semibold">
                      {booking.startTime} - {booking.endTime}
                    </div>
                  </div>
                </div>
              </div>

              <div
                className={cn(
                  "mt-4 p-4 rounded-xl border",
                  statusInfo.bgColor,
                  statusInfo.borderColor
                )}
              >
                <div className="flex items-center gap-2">
                  <StatusIcon className={cn("h-5 w-5", statusInfo.textColor)} />
                  <div>
                    <div className={cn("font-semibold", statusInfo.textColor)}>
                      {statusInfo.label}
                    </div>
                    <div className={cn("text-sm", statusInfo.textColor)}>
                      {statusInfo.description}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Booking Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-car-red" />
                Booking Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-slate-500">Booked On</div>
                  <div className="font-semibold">
                    {format(
                      new Date(booking.createdAt),
                      "MMM d, yyyy 'at' h:mm a"
                    )}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-slate-500">Last Updated</div>
                  <div className="font-semibold">
                    {format(
                      new Date(booking.updatedAt),
                      "MMM d, yyyy 'at' h:mm a"
                    )}
                  </div>
                </div>
              </div>

              {booking.notes && (
                <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <div className="text-sm text-blue-600 font-semibold mb-2">
                    Your Notes
                  </div>
                  <p className="text-blue-900">{booking.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href={`/cars/${booking.carId}`} className="flex-1">
              <Button variant="outline" className="w-full">
                <ExternalLink className="w-4 h-4 mr-2" />
                View Car Listing
              </Button>
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const EmptyState = () => (
  <Card className="text-center py-12">
    <CardContent>
      <div className="flex flex-col items-center space-y-4">
        <div className="bg-slate-100 p-4 rounded-full">
          <CalendarDays className="h-12 w-12 text-slate-400" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            No Test Drive Bookings
          </h3>
          <p className="text-slate-600 max-w-md">
            You haven't booked any test drives yet. Browse our car inventory and
            schedule your first test drive to experience your dream car.
          </p>
        </div>
        <Link href="/cars">
          <Button className="bg-car-red hover:bg-car-red-dark">
            <Car className="w-4 h-4 mr-2" />
            Browse Cars
          </Button>
        </Link>
      </div>
    </CardContent>
  </Card>
);

const ReservationsClient = ({ initialData, error }) => {
  const [reservations, setReservations] = useState(initialData || []);
  const [filteredReservations, setFilteredReservations] = useState(
    initialData || []
  );
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  // Filters
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  // Cancellation
  const {
    loading: cancelling,
    fn: cancelBooking,
    data: cancelResult,
    error: cancelError,
  } = useFetch(cancelTestDrive);

  // Handle filtering and sorting
  useMemo(() => {
    let filtered = [...reservations];

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (reservation) => reservation.status === statusFilter
      );
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (reservation) =>
          reservation.car.make.toLowerCase().includes(query) ||
          reservation.car.model.toLowerCase().includes(query) ||
          reservation.car.color.toLowerCase().includes(query)
      );
    }

    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "date":
          return new Date(b.bookingDate) - new Date(a.bookingDate);
        case "status":
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });

    setFilteredReservations(filtered);
  }, [reservations, statusFilter, searchQuery, sortBy]);

  // Handle cancellation success
  React.useEffect(() => {
    if (cancelResult?.success) {
      toast.success("Test drive booking cancelled successfully");
      // Remove cancelled booking from state
      setReservations((prev) =>
        prev.map((booking) =>
          booking.id === selectedReservation?.id
            ? { ...booking, status: "CANCELLED" }
            : booking
        )
      );
      setShowDetailsDialog(false);
      setSelectedReservation(null);
    }
  }, [cancelResult, selectedReservation]);

  // Handle cancellation error
  React.useEffect(() => {
    if (cancelError) {
      toast.error(cancelError.message || "Failed to cancel booking");
    }
  }, [cancelError]);

  const handleCancel = async (bookingId) => {
    await cancelBooking(bookingId);
  };

  const handleViewDetails = (booking) => {
    setSelectedReservation(booking);
    setShowDetailsDialog(true);
  };

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="flex items-center gap-4 p-6">
          <AlertCircle className="h-8 w-8 text-red-600" />
          <div>
            <h3 className="font-semibold text-red-900">
              Error Loading Reservations
            </h3>
            <p className="text-red-700">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Filters and Search */}
      {reservations.length > 0 && (
        <Card className="bg-white shadow-lg border border-slate-200/60">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-car-red" />
                Smart Filters
              </CardTitle>
              {(statusFilter !== "all" || searchQuery) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setStatusFilter("all");
                    setSearchQuery("");
                  }}
                  className="text-slate-500 hover:text-slate-700"
                >
                  Clear all
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Quick Filter Chips */}
            <div className="flex flex-wrap gap-2">
              {[
                { key: "all", label: "All", count: reservations.length },
                { key: "PENDING", label: "Pending", count: reservations.filter(r => r.status === "PENDING").length },
                { key: "CONFIRMED", label: "Confirmed", count: reservations.filter(r => r.status === "CONFIRMED").length },
                { key: "COMPLETED", label: "Completed", count: reservations.filter(r => r.status === "COMPLETED").length },
              ].filter(item => item.count > 0).map((item) => (
                <button
                  key={item.key}
                  onClick={() => setStatusFilter(item.key)}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border-2",
                    statusFilter === item.key
                      ? "bg-car-red text-white border-car-red shadow-lg"
                      : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200 hover:border-slate-300"
                  )}
                >
                  {item.label} ({item.count})
                </button>
              ))}
            </div>

            {/* Search and Advanced Filters */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Enhanced Search */}
              <div className="lg:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    placeholder="Search by car make, model, color, or booking details..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 border-2 hover:border-car-red/30 focus:border-car-red/50"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <XCircle className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Sort Options */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="border-2 hover:border-car-red/30 focus:border-car-red/50">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">📅 Newest First</SelectItem>
                  <SelectItem value="oldest">📅 Oldest First</SelectItem>
                  <SelectItem value="date">🗓️ By Test Drive Date</SelectItem>
                  <SelectItem value="status">🏷️ By Status</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Active Filters Summary */}
            {(searchQuery || statusFilter !== "all") && (
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <span>Active filters:</span>
                {searchQuery && (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    Search: "{searchQuery}"
                  </Badge>
                )}
                {statusFilter !== "all" && (
                  <Badge variant="secondary" className={cn("text-white", statusConfig[statusFilter]?.color)}>
                    Status: {statusConfig[statusFilter]?.label}
                  </Badge>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Results Summary */}
      {reservations.length > 0 && (
        <div className="flex items-center justify-between px-1">
          <div className="text-sm text-slate-600">
            Showing <span className="font-semibold text-slate-900">{filteredReservations.length}</span> of{" "}
            <span className="font-semibold text-slate-900">{reservations.length}</span> reservations
            {searchQuery && (
              <span className="ml-1">
                for "<span className="font-semibold text-car-red">{searchQuery}</span>"
              </span>
            )}
          </div>
          {filteredReservations.length > 0 && (
            <div className="text-sm text-slate-500">
              {filteredReservations.filter(r => ['PENDING', 'CONFIRMED'].includes(r.status)).length} active
            </div>
          )}
        </div>
      )}

      {/* Enhanced Reservations List */}
      {filteredReservations.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid gap-4 lg:gap-6">
          {/* Priority reservations (today/tomorrow) first */}
          {filteredReservations
            .filter(booking => {
              const bookingDate = new Date(booking.bookingDate);
              return isToday(bookingDate) || isTomorrow(bookingDate);
            })
            .map((booking) => (
              <ReservationCard
                key={booking.id}
                booking={booking}
                onCancel={handleCancel}
                onViewDetails={handleViewDetails}
              />
            ))}
          
          {/* Other reservations */}
          {filteredReservations
            .filter(booking => {
              const bookingDate = new Date(booking.bookingDate);
              return !isToday(bookingDate) && !isTomorrow(bookingDate);
            })
            .map((booking) => (
              <ReservationCard
                key={booking.id}
                booking={booking}
                onCancel={handleCancel}
                onViewDetails={handleViewDetails}
              />
            ))}
        </div>
      )}

      {/* Details Dialog */}
      <ReservationDetailsDialog
        booking={selectedReservation}
        isOpen={showDetailsDialog}
        onClose={() => {
          setShowDetailsDialog(false);
          setSelectedReservation(null);
        }}
      />
    </div>
  );
};

export default ReservationsClient;

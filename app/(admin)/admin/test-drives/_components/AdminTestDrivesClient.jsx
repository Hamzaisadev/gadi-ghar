"use client";

import React, { useState, useMemo, useEffect } from "react";
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
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Calendar,
  Clock,
  Car,
  User,
  Building2,
  Eye,
  MoreVertical,
  Filter,
  Search,
  Download,
  RefreshCw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Timer,
  Ban,
  UserX,
  Phone,
  Mail,
  MapPin,
  TrendingUp,
  PieChart,
  BarChart3,
  AlertCircle,
  Calendar as CalendarIcon,
  Users,
} from "lucide-react";
import { format, parseISO, isToday, isTomorrow, isPast } from "date-fns";
import { toast } from "sonner";
import {
  updateTestDriveStatus,
  getAllTestDriveBookings,
} from "@/app/actions/test-drive";
import useFetch from "@/hooks/use-fetch";
import { cn } from "@/lib/utils";
import { formatPriceWithCrore } from "@/components/utils/FormatCurrency";

// Enhanced status configuration for admin
const statusConfig = {
  PENDING: {
    color: "bg-amber-500",
    textColor: "text-amber-700",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    icon: Timer,
    label: "Pending",
    description: "Awaiting dealership confirmation",
    priority: 1,
  },
  CONFIRMED: {
    color: "bg-green-500",
    textColor: "text-green-700",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    icon: CheckCircle2,
    label: "Confirmed",
    description: "Confirmed by dealership",
    priority: 2,
  },
  CANCELLED: {
    color: "bg-red-500",
    textColor: "text-red-700",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    icon: Ban,
    label: "Cancelled",
    description: "Booking cancelled",
    priority: 4,
  },
  COMPLETED: {
    color: "bg-blue-500",
    textColor: "text-blue-700",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    icon: CheckCircle2,
    label: "Completed",
    description: "Test drive completed",
    priority: 5,
  },
  NO_SHOW: {
    color: "bg-gray-500",
    textColor: "text-gray-700",
    bgColor: "bg-gray-50",
    borderColor: "border-gray-200",
    icon: UserX,
    label: "No Show",
    description: "Customer didn't show up",
    priority: 3,
  },
};

const StatusBadge = ({ status, showIcon = true, size = "default" }) => {
  const statusInfo = statusConfig[status] || statusConfig.PENDING;
  const StatusIcon = statusInfo.icon;

  return (
    <Badge
      className={cn(
        "text-white font-semibold border-0",
        statusInfo.color,
        size === "sm" ? "text-xs px-2 py-1" : "px-3 py-1"
      )}
    >
      {showIcon && <StatusIcon className="w-3 h-3 mr-1" />}
      {statusInfo.label}
    </Badge>
  );
};

const BookingDetailsDialog = ({ booking, isOpen, onClose, onStatusUpdate }) => {
  if (!booking) return null;

  const [updating, setUpdating] = useState(false);

  const handleStatusUpdate = async (newStatus) => {
    setUpdating(true);
    try {
      await onStatusUpdate(booking.id, newStatus);
      toast.success(`Booking status updated to ${newStatus.toLowerCase()}`);
    } catch (error) {
      toast.error("Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Car className="h-6 w-6 text-blue-600" />
            Booking Details - {booking.car.year} {booking.car.make}{" "}
            {booking.car.model}
          </DialogTitle>
          <DialogDescription>
            Complete booking information and management actions
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Booking Info */}
          <div className="space-y-6">
            {/* Status and Priority */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Booking Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <StatusBadge status={booking.status} />
                  <span className="text-sm text-slate-500">
                    {isToday(new Date(booking.bookingDate))
                      ? "Today"
                      : isTomorrow(new Date(booking.bookingDate))
                        ? "Tomorrow"
                        : isPast(new Date(booking.bookingDate))
                          ? "Past"
                          : "Upcoming"}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="text-center p-3 bg-slate-50 rounded-lg">
                    <CalendarIcon className="h-5 w-5 text-slate-600 mx-auto mb-1" />
                    <div className="text-sm font-medium">
                      {format(new Date(booking.bookingDate), "MMM d, yyyy")}
                    </div>
                    <div className="text-xs text-slate-500">Date</div>
                  </div>
                  <div className="text-center p-3 bg-slate-50 rounded-lg">
                    <Clock className="h-5 w-5 text-slate-600 mx-auto mb-1" />
                    <div className="text-sm font-medium">
                      {booking.startTime} - {booking.endTime}
                    </div>
                    <div className="text-xs text-slate-500">Time</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-600" />
                  Customer Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <User className="h-5 w-5 text-slate-600" />
                  <div>
                    <div className="font-semibold">
                      {booking.customer.name || "Name not provided"}
                    </div>
                    <div className="text-sm text-slate-600">Customer Name</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <Mail className="h-5 w-5 text-slate-600" />
                  <div>
                    <div className="font-semibold">
                      {booking.customer.email}
                    </div>
                    <div className="text-sm text-slate-600">Email Address</div>
                  </div>
                </div>

                {booking.customer.phone && (
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <Phone className="h-5 w-5 text-slate-600" />
                    <div>
                      <div className="font-semibold">
                        {booking.customer.phone}
                      </div>
                      <div className="text-sm text-slate-600">Phone Number</div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Customer Notes */}
            {booking.notes && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Customer Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-blue-900">{booking.notes}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Car and Dealership Info */}
          <div className="space-y-6">
            {/* Vehicle Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="h-5 w-5 text-blue-600" />
                  Vehicle Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {booking.car.images && booking.car.images.length > 0 && (
                  <div className="relative overflow-hidden rounded-lg">
                    <img
                      src={booking.car.images[0]}
                      alt={`${booking.car.year} ${booking.car.make} ${booking.car.model}`}
                      className="w-full h-40 object-cover"
                    />
                    <div className="absolute bottom-2 left-2 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {booking.car.price
                        ? formatPriceWithCrore(booking.car.price)
                        : "TBD"}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <div className="text-slate-500">Make & Model</div>
                    <div className="font-semibold">
                      {booking.car.make} {booking.car.model}
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-500">Year</div>
                    <div className="font-semibold">{booking.car.year}</div>
                  </div>
                  <div>
                    <div className="text-slate-500">Color</div>
                    <div className="font-semibold">{booking.car.color}</div>
                  </div>
                  <div>
                    <div className="text-slate-500">Fuel Type</div>
                    <div className="font-semibold">{booking.car.fuelType}</div>
                  </div>
                  <div>
                    <div className="text-slate-500">Transmission</div>
                    <div className="font-semibold">
                      {booking.car.transmission}
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-500">Body Type</div>
                    <div className="font-semibold">{booking.car.bodyType}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Dealership Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-blue-600" />
                  Dealership Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                  <div className="font-bold text-lg text-slate-900 mb-2">
                    {booking.car.dealership?.name || "Unknown Dealership"}
                  </div>

                  {booking.car.dealership?.address && (
                    <div className="flex items-start gap-2 mb-2">
                      <MapPin className="h-4 w-4 text-slate-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-slate-700">
                        {booking.car.dealership.address}
                      </span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                    {booking.car.dealership?.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-slate-600" />
                        <span className="text-sm font-medium">
                          {booking.car.dealership.phone}
                        </span>
                      </div>
                    )}

                    {booking.car.dealership?.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-slate-600" />
                        <span className="text-sm text-slate-700">
                          {booking.car.dealership.email}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Admin Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Admin Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {booking.status !== "CONFIRMED" && (
                    <Button
                      onClick={() => handleStatusUpdate("CONFIRMED")}
                      disabled={updating}
                      className="bg-green-600 hover:bg-green-700"
                      size="sm"
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Confirm
                    </Button>
                  )}

                  {booking.status !== "CANCELLED" && (
                    <Button
                      onClick={() => handleStatusUpdate("CANCELLED")}
                      disabled={updating}
                      variant="destructive"
                      size="sm"
                    >
                      <Ban className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  )}

                  {booking.status !== "COMPLETED" && (
                    <Button
                      onClick={() => handleStatusUpdate("COMPLETED")}
                      disabled={updating}
                      className="bg-blue-600 hover:bg-blue-700"
                      size="sm"
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Complete
                    </Button>
                  )}

                  {booking.status !== "NO_SHOW" && (
                    <Button
                      onClick={() => handleStatusUpdate("NO_SHOW")}
                      disabled={updating}
                      variant="secondary"
                      size="sm"
                    >
                      <UserX className="w-4 h-4 mr-2" />
                      No Show
                    </Button>
                  )}
                </div>

                {updating && (
                  <div className="flex items-center justify-center mt-4 text-sm text-slate-600">
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Updating status...
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Booking Timeline */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Booking Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-slate-500">Created</div>
                <div className="font-semibold">
                  {format(
                    new Date(booking.createdAt),
                    "MMM d, yyyy 'at' h:mm a"
                  )}
                </div>
              </div>
              <div>
                <div className="text-slate-500">Last Updated</div>
                <div className="font-semibold">
                  {format(
                    new Date(booking.updatedAt),
                    "MMM d, yyyy 'at' h:mm a"
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

const BookingRow = ({ booking, onViewDetails, onStatusUpdate }) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleQuickStatusUpdate = async (newStatus) => {
    setIsUpdating(true);
    try {
      await onStatusUpdate(booking.id, newStatus);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <TableRow className="hover:bg-slate-50">
      <TableCell className="font-medium">
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 p-2 rounded-lg">
            <Car className="h-4 w-4 text-blue-600" />
          </div>
          <div>
            <div className="font-semibold">
              {booking.car.year} {booking.car.make} {booking.car.model}
            </div>
            <div className="text-sm text-slate-500">
              {booking.car.color} •{" "}
              {booking.car.price
                ? formatPriceWithCrore(booking.car.price)
                : "TBD"}
            </div>
          </div>
        </div>
      </TableCell>

      <TableCell>
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-slate-600" />
          <div>
            <div className="font-medium">{booking.customer.name || "N/A"}</div>
            <div className="text-sm text-slate-500">
              {booking.customer.email}
            </div>
          </div>
        </div>
      </TableCell>

      <TableCell>
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4 text-slate-600" />
          <span className="font-medium">
            {booking.car.dealership?.name || "Unknown"}
          </span>
        </div>
      </TableCell>

      <TableCell>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-slate-600" />
          <div>
            <div className="font-medium">
              {format(new Date(booking.bookingDate), "MMM d, yyyy")}
            </div>
            <div className="text-sm text-slate-500">
              {booking.startTime} - {booking.endTime}
            </div>
          </div>
        </div>
      </TableCell>

      <TableCell>
        <StatusBadge status={booking.status} size="sm" />
      </TableCell>

      <TableCell>
        <div className="text-sm text-slate-500">
          {format(new Date(booking.createdAt), "MMM d, yyyy")}
        </div>
      </TableCell>

      <TableCell>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewDetails(booking)}
          >
            <Eye className="h-4 w-4" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" disabled={isUpdating}>
                {isUpdating ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <MoreVertical className="h-4 w-4" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />

              {booking.status !== "CONFIRMED" && (
                <DropdownMenuItem
                  onClick={() => handleQuickStatusUpdate("CONFIRMED")}
                  className="text-green-600"
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Confirm
                </DropdownMenuItem>
              )}

              {booking.status !== "COMPLETED" && (
                <DropdownMenuItem
                  onClick={() => handleQuickStatusUpdate("COMPLETED")}
                  className="text-blue-600"
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Complete
                </DropdownMenuItem>
              )}

              {booking.status !== "CANCELLED" && (
                <DropdownMenuItem
                  onClick={() => handleQuickStatusUpdate("CANCELLED")}
                  className="text-red-600"
                >
                  <Ban className="w-4 h-4 mr-2" />
                  Cancel
                </DropdownMenuItem>
              )}

              {booking.status !== "NO_SHOW" && (
                <DropdownMenuItem
                  onClick={() => handleQuickStatusUpdate("NO_SHOW")}
                  className="text-gray-600"
                >
                  <UserX className="w-4 h-4 mr-2" />
                  No Show
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </TableCell>
    </TableRow>
  );
};

const AdminTestDrivesClient = ({
  initialBookings,
  dealerships,
  stats,
  error,
}) => {
  const [bookings, setBookings] = useState(initialBookings || []);
  const [filteredBookings, setFilteredBookings] = useState(
    initialBookings || []
  );
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  // Filters
  const [statusFilter, setStatusFilter] = useState("all");
  const [dealershipFilter, setDealershipFilter] = useState("all");
  const [dateRangeFilter, setDateRangeFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Status update
  const {
    loading: updating,
    fn: updateStatus,
    data: updateResult,
    error: updateError,
  } = useFetch(updateTestDriveStatus);

  // Refresh data
  const {
    loading: refreshing,
    fn: refreshData,
    data: refreshResult,
  } = useFetch(getAllTestDriveBookings);

  // Handle filtering and sorting
  useMemo(() => {
    let filtered = [...bookings];

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((booking) => booking.status === statusFilter);
    }

    // Dealership filter
    if (dealershipFilter !== "all") {
      filtered = filtered.filter(
        (booking) => booking.car.dealership?.id === dealershipFilter
      );
    }

    // Date range filter
    if (dateRangeFilter !== "all") {
      const now = new Date();
      const todayStart = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
      );

      switch (dateRangeFilter) {
        case "today":
          filtered = filtered.filter((booking) => {
            const bookingDate = new Date(booking.bookingDate);
            return (
              bookingDate >= todayStart &&
              bookingDate < new Date(todayStart.getTime() + 24 * 60 * 60 * 1000)
            );
          });
          break;
        case "week":
          const weekAgo = new Date(
            todayStart.getTime() - 7 * 24 * 60 * 60 * 1000
          );
          filtered = filtered.filter(
            (booking) => new Date(booking.bookingDate) >= weekAgo
          );
          break;
        case "month":
          const monthAgo = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate()
          );
          filtered = filtered.filter(
            (booking) => new Date(booking.bookingDate) >= monthAgo
          );
          break;
      }
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (booking) =>
          booking.car.make.toLowerCase().includes(query) ||
          booking.car.model.toLowerCase().includes(query) ||
          booking.customer.email.toLowerCase().includes(query) ||
          booking.customer.name?.toLowerCase().includes(query) ||
          booking.car.dealership?.name.toLowerCase().includes(query)
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
          return (
            (statusConfig[a.status]?.priority || 0) -
            (statusConfig[b.status]?.priority || 0)
          );
        case "customer":
          return (a.customer.name || a.customer.email).localeCompare(
            b.customer.name || b.customer.email
          );
        case "dealership":
          return (a.car.dealership?.name || "").localeCompare(
            b.car.dealership?.name || ""
          );
        default:
          return 0;
      }
    });

    setFilteredBookings(filtered);
    setCurrentPage(1); // Reset pagination when filtering
  }, [
    bookings,
    statusFilter,
    dealershipFilter,
    dateRangeFilter,
    searchQuery,
    sortBy,
  ]);

  // Handle status update success
  useEffect(() => {
    if (updateResult?.success) {
      toast.success("Booking status updated successfully");
      setBookings((prev) =>
        prev.map((booking) =>
          booking.id === selectedBooking?.id
            ? { ...booking, status: updateResult.data.status }
            : booking
        )
      );
    }
  }, [updateResult, selectedBooking]);

  // Handle status update error
  useEffect(() => {
    if (updateError) {
      toast.error(updateError.message || "Failed to update status");
    }
  }, [updateError]);

  // Handle refresh success
  useEffect(() => {
    if (refreshResult?.success) {
      setBookings(refreshResult.data);
      toast.success("Data refreshed successfully");
    }
  }, [refreshResult]);

  const handleStatusUpdate = async (bookingId, newStatus) => {
    await updateStatus(bookingId, newStatus);
  };

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setShowDetailsDialog(true);
  };

  const handleRefresh = async () => {
    await refreshData();
  };

  const handleExport = () => {
    const csvContent = [
      [
        "Car",
        "Customer",
        "Email",
        "Dealership",
        "Date",
        "Time",
        "Status",
        "Created",
      ],
      ...filteredBookings.map((booking) => [
        `${booking.car.year} ${booking.car.make} ${booking.car.model}`,
        booking.customer.name || "N/A",
        booking.customer.email,
        booking.car.dealership?.name || "Unknown",
        format(new Date(booking.bookingDate), "yyyy-MM-dd"),
        `${booking.startTime} - ${booking.endTime}`,
        booking.status,
        format(new Date(booking.createdAt), "yyyy-MM-dd HH:mm"),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `test-drive-bookings-${format(new Date(), "yyyy-MM-dd")}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);

    toast.success("Export completed successfully");
  };

  // Pagination
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const paginatedBookings = filteredBookings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="flex items-center gap-4 p-6">
          <AlertCircle className="h-8 w-8 text-red-600" />
          <div>
            <h3 className="font-semibold text-red-900">
              Error Loading Bookings
            </h3>
            <p className="text-red-700">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Analytics Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-blue-600" />
              Status Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(statusConfig).map(([status, config]) => {
                const count = bookings.filter(
                  (b) => b.status === status
                ).length;
                const percentage =
                  bookings.length > 0
                    ? ((count / bookings.length) * 100).toFixed(1)
                    : 0;
                const StatusIcon = config.icon;

                return (
                  <div
                    key={status}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <StatusIcon className={cn("h-4 w-4", config.textColor)} />
                      <span className="text-sm font-medium">
                        {config.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <div className="text-sm font-bold">{count}</div>
                        <div className="text-xs text-slate-500">
                          {percentage}%
                        </div>
                      </div>
                      <div className={cn("w-2 h-8 rounded", config.color)} />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {bookings
                .filter((booking) => {
                  const bookingDate = new Date(booking.createdAt);
                  const threeDaysAgo = new Date();
                  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
                  return bookingDate >= threeDaysAgo;
                })
                .slice(0, 5)
                .map((booking) => (
                  <div
                    key={booking.id}
                    className="flex items-center gap-3 p-2 bg-slate-50 rounded-lg"
                  >
                    <StatusBadge
                      status={booking.status}
                      size="sm"
                      showIcon={false}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">
                        {booking.car.make} {booking.car.model}
                      </div>
                      <div className="text-xs text-slate-500">
                        {format(new Date(booking.createdAt), "MMM d, h:mm a")}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Dealerships */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-blue-600" />
              Top Dealerships
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {dealerships
                .map((dealership) => ({
                  ...dealership,
                  bookingCount: bookings.filter(
                    (b) => b.car.dealership?.id === dealership.id
                  ).length,
                }))
                .sort((a, b) => b.bookingCount - a.bookingCount)
                .slice(0, 5)
                .map((dealership) => (
                  <div
                    key={dealership.id}
                    className="flex items-center justify-between p-2 bg-slate-50 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-slate-600" />
                      <span className="text-sm font-medium truncate">
                        {dealership.name}
                      </span>
                    </div>
                    <div className="text-sm font-bold text-blue-600">
                      {dealership.bookingCount}
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-blue-600" />
              Filters & Actions
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={refreshing}
              >
                {refreshing ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
              </Button>
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Search cars, customers, or dealerships..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {Object.entries(statusConfig).map(([status, config]) => (
                  <SelectItem key={status} value={status}>
                    {config.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Dealership Filter */}
            <Select
              value={dealershipFilter}
              onValueChange={setDealershipFilter}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Dealerships" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Dealerships</SelectItem>
                {dealerships.map((dealership) => (
                  <SelectItem key={dealership.id} value={dealership.id}>
                    {dealership.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Date Range Filter */}
            <Select value={dateRangeFilter} onValueChange={setDateRangeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Dates" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Dates</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="date">By Date</SelectItem>
                <SelectItem value="status">By Status</SelectItem>
                <SelectItem value="customer">By Customer</SelectItem>
                <SelectItem value="dealership">By Dealership</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-slate-600">
          Showing {paginatedBookings.length} of {filteredBookings.length}{" "}
          bookings
          {searchQuery && ` for "${searchQuery}"`}
        </div>
        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="text-sm text-slate-600">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </div>

      {/* Bookings Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Dealership</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedBookings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12">
                      <div className="flex flex-col items-center space-y-4">
                        <div className="bg-slate-100 p-4 rounded-full">
                          <Calendar className="h-12 w-12 text-slate-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-slate-900">
                            No bookings found
                          </h3>
                          <p className="text-slate-600">
                            Try adjusting your filters to see more results.
                          </p>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedBookings.map((booking) => (
                    <BookingRow
                      key={booking.id}
                      booking={booking}
                      onViewDetails={handleViewDetails}
                      onStatusUpdate={handleStatusUpdate}
                    />
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Booking Details Dialog */}
      <BookingDetailsDialog
        booking={selectedBooking}
        isOpen={showDetailsDialog}
        onClose={() => {
          setShowDetailsDialog(false);
          setSelectedBooking(null);
        }}
        onStatusUpdate={handleStatusUpdate}
      />
    </div>
  );
};

export default AdminTestDrivesClient;

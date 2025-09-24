"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Calendar, Clock, Car, User, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import { getDealershipTestDriveBookings, updateTestDriveStatus } from "@/app/actions/test-drive";
import { toast } from "sonner";

const statusConfig = {
  PENDING: {
    color: "bg-yellow-500 hover:bg-yellow-600",
    icon: AlertTriangle,
    label: "Pending",
  },
  CONFIRMED: {
    color: "bg-blue-500 hover:bg-blue-600",
    icon: CheckCircle2,
    label: "Confirmed",
  },
  COMPLETED: {
    color: "bg-green-500 hover:bg-green-600",
    icon: CheckCircle2,
    label: "Completed",
  },
  CANCELLED: {
    color: "bg-red-500 hover:bg-red-600",
    icon: XCircle,
    label: "Cancelled",
  },
};

export default function TestDrivesTabContent() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState("ALL");

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const result = await getDealershipTestDriveBookings();
      
      if (result.success) {
        setBookings(result.data);
      } else {
        throw new Error(result.error || "Failed to fetch test drive bookings");
      }
    } catch (error) {
      console.error("Error fetching test drive bookings:", error);
      toast.error("Failed to load test drive bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      const result = await updateTestDriveStatus(bookingId, newStatus);
      
      if (result.success) {
        toast.success("Test drive status updated successfully");
        fetchBookings(); // Refresh the list
      } else {
        throw new Error(result.error || "Failed to update status");
      }
    } catch (error) {
      console.error("Error updating test drive status:", error);
      toast.error(error.message || "Failed to update status");
    }
  };

  const filteredBookings = selectedStatus === "ALL" 
    ? bookings 
    : bookings.filter(booking => booking.status === selectedStatus);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Test Drive Bookings</h2>
        <div className="flex items-center space-x-2">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 border rounded-md text-sm"
          >
            <option value="ALL">All Status</option>
            {Object.entries(statusConfig).map(([key, { label }]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
          <Button onClick={fetchBookings} variant="outline" size="sm">
            Refresh
          </Button>
        </div>
      </div>

      {filteredBookings.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-gray-500">No test drive bookings found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => {
            const StatusIcon = statusConfig[booking.status]?.icon || AlertTriangle;
            const statusColor = statusConfig[booking.status]?.color || "bg-gray-500";
            
            return (
              <Card key={booking.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">
                        {booking.car.make} {booking.car.model}
                      </CardTitle>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <Calendar className="h-4 w-4 mr-1" />
                        {format(new Date(booking.bookingDate), "PPP")}
                        <span className="mx-2">•</span>
                        <Clock className="h-4 w-4 mr-1" />
                        {booking.startTime} - {booking.endTime}
                      </div>
                    </div>
                    <Badge className={`${statusColor} text-white`}>
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {statusConfig[booking.status]?.label || booking.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-sm text-gray-500 mb-1">Customer</h4>
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2 text-gray-400" />
                        <span>{booking.user.name}</span>
                      </div>
                      <div className="text-sm text-gray-600 mt-1 ml-6">
                        {booking.user.email}
                      </div>
                      <div className="text-sm text-gray-600 ml-6">
                        {booking.user.phone}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm text-gray-500 mb-1">Car Details</h4>
                      <div className="flex items-center">
                        <Car className="h-4 w-4 mr-2 text-gray-400" />
                        <span>{booking.car.year} {booking.car.make} {booking.car.model}</span>
                      </div>
                      <div className="text-sm text-gray-600 mt-1 ml-6">
                        {booking.car.color} • {booking.car.fuelType}
                      </div>
                      <div className="text-sm text-gray-600 ml-6">
                        {booking.car.transmission}
                      </div>
                    </div>
                  </div>
                  
                  {booking.notes && (
                    <div className="mt-4">
                      <h4 className="font-medium text-sm text-gray-500 mb-1">Notes</h4>
                      <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
                        {booking.notes}
                      </p>
                    </div>
                  )}

                  <div className="flex justify-end space-x-2 mt-4">
                    {booking.status === "PENDING" && (
                      <>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleStatusUpdate(booking.id, "CANCELLED")}
                        >
                          Cancel
                        </Button>
                        <Button 
                          size="sm"
                          onClick={() => handleStatusUpdate(booking.id, "CONFIRMED")}
                        >
                          Confirm
                        </Button>
                      </>
                    )}
                    {booking.status === "CONFIRMED" && (
                      <Button 
                        size="sm"
                        onClick={() => handleStatusUpdate(booking.id, "COMPLETED")}
                      >
                        Mark as Completed
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

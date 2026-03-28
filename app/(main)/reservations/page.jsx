export const dynamic = "force-dynamic";

import React from "react";
import { getUserTestDrives } from "@/app/actions/test-drive";
import ReservationsClient from "./_components/ReservationsClient";
import { CalendarCheck, Clock, Car, CheckCircle2, XCircle } from "lucide-react";

export const metadata = {
  title: "My Reservations | Gadi Ghar",
  description:
    "View and manage your test drive reservations. Track upcoming appointments, view booking history, and manage your test drive schedule with Gadi Ghar.",
  keywords:
    "test drive reservations, my bookings, appointment management, car test drive history, Gadi Ghar reservations",
};

const ReservationsPage = async () => {
  const result = await getUserTestDrives();
  const bookings = result.success ? result.data : [];
  
  // Count bookings by status
  const stats = {
    total: bookings.length,
    upcoming: bookings.filter((b) => {
      const date = new Date(b.bookingDate);
      return date >= new Date() && b.status !== "CANCELLED";
    }).length,
    completed: bookings.filter((b) => b.status === "COMPLETED").length,
    cancelled: bookings.filter((b) => b.status === "CANCELLED").length,
    active: bookings.filter((b) => ["PENDING", "CONFIRMED"].includes(b.status)).length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Header */}
      <div className="relative bg-gradient-to-r from-red-500 to-red-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>
        <div className="relative container mx-auto px-4 py-16 md:py-20 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="bg-white/20 p-4 rounded-2xl shadow-lg backdrop-blur-sm">
              <CalendarCheck className="h-8 w-8 md:h-10 md:w-10 text-white" />
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold drop-shadow-lg">
              My <span className="text-yellow-300">Reservations</span>
            </h1>
            <p className="text-base md:text-lg text-gray-100 max-w-2xl px-4">
              Keep track of your upcoming test drives, view history, and manage
              your schedule seamlessly.
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="container mx-auto px-4 -mt-8 md:-mt-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          <div className="bg-white p-4 md:p-6 rounded-2xl shadow-md hover:shadow-lg transition">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 md:p-3 rounded-xl">
                <CalendarCheck className="h-5 w-5 md:h-6 md:w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-600">Total</p>
                <p className="text-xl md:text-2xl font-bold text-gray-900">
                  {stats.total}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 md:p-6 rounded-2xl shadow-md hover:shadow-lg transition">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-2 md:p-3 rounded-xl">
                <Clock className="h-5 w-5 md:h-6 md:w-6 text-green-600" />
              </div>
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-600">Upcoming</p>
                <p className="text-xl md:text-2xl font-bold text-gray-900">
                  {stats.upcoming}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 md:p-6 rounded-2xl shadow-md hover:shadow-lg transition">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-100 p-2 md:p-3 rounded-xl">
                <CheckCircle2 className="h-5 w-5 md:h-6 md:w-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-600">Completed</p>
                <p className="text-xl md:text-2xl font-bold text-gray-900">
                  {stats.completed}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 md:p-6 rounded-2xl shadow-md hover:shadow-lg transition">
            <div className="flex items-center gap-3">
              <div className="bg-red-100 p-2 md:p-3 rounded-xl">
                <XCircle className="h-5 w-5 md:h-6 md:w-6 text-red-600" />
              </div>
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-600">Cancelled</p>
                <p className="text-xl md:text-2xl font-bold text-gray-900">
                  {stats.cancelled}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition">
            <div className="bg-blue-100 p-3 rounded-xl">
              <Car className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.active}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-md p-6 md:p-10">
          <ReservationsClient
            initialData={result.success ? result.data : []}
            error={result.success ? null : result.error}
          />
        </div>
      </div>
    </div>
  );
};

export default ReservationsPage;

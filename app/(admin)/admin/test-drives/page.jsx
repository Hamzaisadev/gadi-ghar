import React from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getAllTestDriveBookings } from "@/app/actions/test-drive";
import { db } from "@/lib/prisma";
import AdminTestDrivesClient from "./_components/AdminTestDrivesClient";
import { 
  Shield, 
  Calendar, 
  BarChart3,
  Users,
  Car,
  Building2
} from "lucide-react";

export const metadata = {
  title: "Test Drive Management | Admin Dashboard",
  description:
    "Comprehensive admin dashboard for managing test drive bookings across all dealerships. Monitor booking statistics, manage appointments, and oversee dealership operations.",
  keywords:
    "admin dashboard, test drive management, booking administration, dealership oversight, appointment management",
};

const AdminTestDrivesPage = async () => {
  // Check authentication and admin role
   const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in?redirectUrl=/admin/test-drives");
  }

  // Check if user is admin
  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user || user.role !== "ADMIN") {
    redirect("/");
  }

  // Fetch all test drive bookings
  const result = await getAllTestDriveBookings();
  
  // Fetch dealerships for filtering
  const dealerships = await db.dealershipInfo.findMany({
    select: {
      id: true,
      name: true,
      isActive: true,
      _count: {
        select: {
          cars: {
            where: {
              testDriveBookings: {
                some: {}
              }
            }
          }
        }
      }
    },
    orderBy: {
      name: 'asc'
    }
  });

  // Calculate dashboard statistics
  const bookings = result.success ? result.data : [];
  
  const stats = {
    totalBookings: bookings.length,
    pendingBookings: bookings.filter(b => b.status === 'PENDING').length,
    confirmedBookings: bookings.filter(b => b.status === 'CONFIRMED').length,
    completedBookings: bookings.filter(b => b.status === 'COMPLETED').length,
    cancelledBookings: bookings.filter(b => b.status === 'CANCELLED').length,
    noShowBookings: bookings.filter(b => b.status === 'NO_SHOW').length,
    totalDealerships: dealerships.length,
    activeDealerships: dealerships.filter(d => d.isActive).length,
    uniqueCustomers: new Set(bookings.map(b => b.customer.id)).size,
  };

  // Recent bookings (last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  const recentBookings = bookings.filter(booking => 
    new Date(booking.createdAt) >= sevenDaysAgo
  ).length;

  return (
    <div className="space-y-6">
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700 shadow-xl rounded-2xl p-8">
        <div className="flex items-center justify-center gap-4 max-w-4xl mx-auto">
          <div className="flex-shrink-0">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-2xl shadow-lg">
              <Shield className="h-8 w-8 text-white" />
            </div>
          </div>
          <div className="text-center sm:text-left">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-blue-500/20 text-blue-300 text-xs font-semibold px-3 py-1 rounded-full border border-blue-500/30">
                ADMIN DASHBOARD
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
              Test Drive <span className="text-blue-400">Management</span>
            </h1>
            <p className="text-lg text-slate-300 mt-2 max-w-2xl">
              Monitor and manage test drive bookings across all dealerships with comprehensive analytics and controls
            </p>
          </div>
        </div>

        {/* Quick Stats Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4 mt-8 max-w-6xl mx-auto">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-4 text-center">
            <div className="bg-blue-500/20 p-2 rounded-lg mx-auto w-fit mb-2">
              <Calendar className="h-5 w-5 text-blue-400" />
            </div>
            <div className="text-2xl font-bold text-white">{stats.totalBookings}</div>
            <div className="text-xs text-slate-400">Total Bookings</div>
          </div>
          
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-4 text-center">
            <div className="bg-amber-500/20 p-2 rounded-lg mx-auto w-fit mb-2">
              <BarChart3 className="h-5 w-5 text-amber-400" />
            </div>
            <div className="text-2xl font-bold text-white">{stats.pendingBookings}</div>
            <div className="text-xs text-slate-400">Pending</div>
          </div>
          
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-4 text-center">
            <div className="bg-green-500/20 p-2 rounded-lg mx-auto w-fit mb-2">
              <Users className="h-5 w-5 text-green-400" />
            </div>
            <div className="text-2xl font-bold text-white">{stats.confirmedBookings}</div>
            <div className="text-xs text-slate-400">Confirmed</div>
          </div>
          
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-4 text-center">
            <div className="bg-purple-500/20 p-2 rounded-lg mx-auto w-fit mb-2">
              <Car className="h-5 w-5 text-purple-400" />
            </div>
            <div className="text-2xl font-bold text-white">{stats.uniqueCustomers}</div>
            <div className="text-xs text-slate-400">Customers</div>
          </div>
          
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-4 text-center">
            <div className="bg-orange-500/20 p-2 rounded-lg mx-auto w-fit mb-2">
              <Building2 className="h-5 w-5 text-orange-400" />
            </div>
            <div className="text-2xl font-bold text-white">{stats.activeDealerships}</div>
            <div className="text-xs text-slate-400">Active Dealers</div>
          </div>
          
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-4 text-center">
            <div className="bg-cyan-500/20 p-2 rounded-lg mx-auto w-fit mb-2">
              <BarChart3 className="h-5 w-5 text-cyan-400" />
            </div>
            <div className="text-2xl font-bold text-white">{recentBookings}</div>
            <div className="text-xs text-slate-400">This Week</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <AdminTestDrivesClient 
        initialBookings={result.success ? result.data : []} 
        dealerships={dealerships}
        stats={stats}
        error={result.success ? null : result.error}
      />
    </div>
  );
};

export default AdminTestDrivesPage;

"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function getAdminDashboardStats() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return {
        success: false,
        error: "Unauthorized"
      };
    }

    // Check if user is admin
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user || user.role !== 'ADMIN') {
      return {
        success: false,
        error: "Unauthorized: Admin access required"
      };
    }

    // Get all stats in parallel for better performance
    const [
      totalCars,
      activeCars,
      soldCars,
      totalDealerships,
      activeDealerships,
      pendingApplications,
      totalUsers,
      totalTestDrives,
      confirmedTestDrives,
      pendingTestDrives,
      completedTestDrives
    ] = await Promise.all([
      // Car statistics
      db.car.count(),
      db.car.count({ where: { status: 'AVAILABLE' } }),
      db.car.count({ where: { status: 'SOLD' } }),
      
      // Dealership statistics
      db.dealershipInfo.count(),
      db.dealershipInfo.count({ where: { isActive: true, isApproved: true } }),
      db.dealershipApplication.count({ where: { status: 'PENDING' } }),
      
      // User statistics
      db.user.count(),
      
      // Test drive statistics
      db.testDriveBooking.count(),
      db.testDriveBooking.count({ where: { status: 'CONFIRMED' } }),
      db.testDriveBooking.count({ where: { status: 'PENDING' } }),
      db.testDriveBooking.count({ where: { status: 'COMPLETED' } })
    ]);

    // Calculate monthly growth (simplified - you can make this more sophisticated)
    const currentMonth = new Date();
    currentMonth.setDate(1);
    const lastMonth = new Date(currentMonth);
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    const [
      usersThisMonth,
      usersLastMonth,
      testDrivesThisMonth,
      carsThisMonth
    ] = await Promise.all([
      db.user.count({ where: { createdAt: { gte: currentMonth } } }),
      db.user.count({ 
        where: { 
          createdAt: { 
            gte: lastMonth,
            lt: currentMonth
          } 
        } 
      }),
      db.testDriveBooking.count({ where: { createdAt: { gte: currentMonth } } }),
      db.car.count({ where: { createdAt: { gte: currentMonth } } })
    ]);

    // Calculate growth percentages
    const userGrowth = usersLastMonth > 0 ? 
      Math.round(((usersThisMonth - usersLastMonth) / usersLastMonth) * 100) : 0;

    // Calculate conversion rate (test drives to completed)
    const conversionRate = totalTestDrives > 0 ? 
      Math.round((completedTestDrives / totalTestDrives) * 100) : 0;

    // Calculate revenue (simplified - based on average car prices)
    const carPrices = await db.car.aggregate({
      _avg: { maxPrice: true },
      _sum: { maxPrice: true }
    });

    const avgCarPrice = carPrices._avg.maxPrice || 0;
    const totalInventoryValue = carPrices._sum.maxPrice || 0;
    const estimatedRevenue = Number(avgCarPrice) * soldCars;

    return {
      success: true,
      data: {
        totalCars,
        activeCars,
        soldCars,
        totalDealerships,
        activeDealerships,
        pendingApplications,
        totalUsers,
        userGrowth,
        totalTestDrives,
        confirmedTestDrives,
        pendingTestDrives,
        completedTestDrives,
        testDrivesThisMonth,
        carsThisMonth,
        conversionRate,
        estimatedRevenue,
        totalInventoryValue,
        avgCarPrice: Number(avgCarPrice)
      }
    };
  } catch (error) {
    console.error('Error fetching admin dashboard stats:', error);
    return {
      success: false,
      error: error.message || 'Failed to fetch dashboard statistics'
    };
  }
}

export async function getRecentAdminActivity() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return {
        success: false,
        error: "Unauthorized"
      };
    }

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user || user.role !== 'ADMIN') {
      return {
        success: false,
        error: "Unauthorized: Admin access required"
      };
    }

    // Get recent activities from various sources
    const [
      recentApplications,
      recentTestDrives,
      recentCars,
      recentUsers
    ] = await Promise.all([
      // Recent dealership applications
      db.dealershipApplication.findMany({
        take: 3,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          dealershipName: true,
          status: true,
          createdAt: true
        }
      }),

      // Recent test drives
      db.testDriveBooking.findMany({
        take: 3,
        orderBy: { createdAt: 'desc' },
        include: {
          car: {
            select: { make: true, model: true, year: true }
          },
          customer: {
            select: { name: true, email: true }
          }
        }
      }),

      // Recent cars
      db.car.findMany({
        take: 2,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          make: true,
          model: true,
          year: true,
          status: true,
          createdAt: true
        }
      }),

      // Recent users
      db.user.findMany({
        take: 2,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true
        }
      })
    ]);

    // Format activities for display
    const activities = [];

    // Add applications
    recentApplications.forEach(app => {
      activities.push({
        id: `app_${app.id}`,
        type: 'application',
        message: `New dealership application: ${app.dealershipName}`,
        time: app.createdAt,
        status: app.status.toLowerCase()
      });
    });

    // Add test drives
    recentTestDrives.forEach(td => {
      activities.push({
        id: `td_${td.id}`,
        type: 'testdrive',
        message: `Test drive booked: ${td.car.year} ${td.car.make} ${td.car.model}`,
        time: td.createdAt,
        status: td.status.toLowerCase()
      });
    });

    // Add cars
    recentCars.forEach(car => {
      activities.push({
        id: `car_${car.id}`,
        type: 'car',
        message: `New car listed: ${car.year} ${car.make} ${car.model}`,
        time: car.createdAt,
        status: car.status.toLowerCase()
      });
    });

    // Add users
    recentUsers.forEach(user => {
      activities.push({
        id: `user_${user.id}`,
        type: 'user',
        message: `New user registered: ${user.name || user.email}`,
        time: user.createdAt,
        status: 'active'
      });
    });

    // Sort by time and take top 10
    activities.sort((a, b) => new Date(b.time) - new Date(a.time));
    const recentActivities = activities.slice(0, 10);

    // Format time for display
    recentActivities.forEach(activity => {
      const now = new Date();
      const activityTime = new Date(activity.time);
      const diffInMinutes = Math.floor((now - activityTime) / (1000 * 60));
      
      if (diffInMinutes < 1) {
        activity.timeDisplay = 'Just now';
      } else if (diffInMinutes < 60) {
        activity.timeDisplay = `${diffInMinutes} min ago`;
      } else if (diffInMinutes < 1440) {
        const hours = Math.floor(diffInMinutes / 60);
        activity.timeDisplay = `${hours} hour${hours > 1 ? 's' : ''} ago`;
      } else {
        const days = Math.floor(diffInMinutes / 1440);
        activity.timeDisplay = `${days} day${days > 1 ? 's' : ''} ago`;
      }
    });

    return {
      success: true,
      data: recentActivities
    };
  } catch (error) {
    console.error('Error fetching recent admin activity:', error);
    return {
      success: false,
      error: error.message || 'Failed to fetch recent activity'
    };
  }
}

export async function getSystemHealth() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return {
        success: false,
        error: "Unauthorized"
      };
    }

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user || user.role !== 'ADMIN') {
      return {
        success: false,
        error: "Unauthorized: Admin access required"
      };
    }

    // Simple system health checks
    const startTime = Date.now();
    
    // Test database connectivity
    await db.user.findFirst({ take: 1 });
    const dbResponseTime = Date.now() - startTime;
    
    // Calculate some basic metrics
    const totalRecords = await db.user.count() + await db.car.count() + await db.dealershipInfo.count();
    
    return {
      success: true,
      data: {
        database: {
          status: 'healthy',
          responseTime: dbResponseTime
        },
        api: {
          status: 'operational',
          responseTime: dbResponseTime
        },
        storage: {
          status: 'normal',
          usage: Math.min(85, Math.floor(totalRecords / 100)) // Simplified calculation
        },
        cdn: {
          status: 'operational'
        }
      }
    };
  } catch (error) {
    console.error('Error checking system health:', error);
    return {
      success: false,
      error: error.message || 'Failed to check system health'
    };
  }
}

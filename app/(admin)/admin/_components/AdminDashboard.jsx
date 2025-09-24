"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Car,
  Users,
  Building2,
  TrendingUp,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  BarChart3,
  Activity,
  Eye,
  Plus,
  Settings,
  FileText,
  UserCheck,
  ShoppingCart,
  Star,
  Zap
} from "lucide-react";
import Link from "next/link";
import { formatPriceWithCrore } from "@/components/utils/FormatCurrency";
import PageWrapper from "@/components/utils/pageWrapper";
import { toast } from "sonner";
import { getAdminDashboardStats, getRecentAdminActivity, getSystemHealth } from "@/app/actions/admin-analytics";
import useFetch from "@/hooks/use-fetch";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [systemHealth, setSystemHealth] = useState(null);
  
  // Fetch dashboard stats
  const {
    loading: loadingStats,
    fn: fetchStats,
    data: statsData,
    error: statsError
  } = useFetch(getAdminDashboardStats);

  // Fetch recent activity
  const {
    loading: loadingActivity,
    fn: fetchActivity,
    data: activityData,
    error: activityError
  } = useFetch(getRecentAdminActivity);

  // Fetch system health
  const {
    loading: loadingHealth,
    fn: fetchHealth,
    data: healthData,
    error: healthError
  } = useFetch(getSystemHealth);

  useEffect(() => {
    // Load all dashboard data
    fetchStats();
    fetchActivity();
    fetchHealth();
  }, []);

  useEffect(() => {
    if (statsData?.success) {
      setStats(statsData.data);
    } else if (statsData?.success === false) {
      toast.error(statsData.error || "Failed to load dashboard statistics");
    }
  }, [statsData]);

  useEffect(() => {
    if (healthData?.success) {
      setSystemHealth(healthData.data);
    } else if (healthData?.success === false) {
      toast.error(healthData.error || "Failed to load system health");
    }
  }, [healthData]);

  useEffect(() => {
    if (statsError) {
      toast.error("Failed to load dashboard data");
    }
  }, [statsError]);

  const recentActivity = activityData?.success ? activityData.data : [];
  const loading = loadingStats || loadingActivity || loadingHealth;

  const quickActions = [
    { icon: Plus, label: "Add Car", href: "/admin/cars/create", color: "bg-blue-500" },
    { icon: Building2, label: "Review Applications", href: "/admin/applications", color: "bg-orange-500" },
    { icon: Users, label: "Manage Users", href: "/admin/users", color: "bg-green-500" },
    { icon: Settings, label: "System Settings", href: "/admin/settings", color: "bg-purple-500" }
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case "application": return Building2;
      case "testdrive": return Calendar;
      case "car": return Car;
      case "user": return Users;
      case "sale": return DollarSign;
      default: return Activity;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending": return "bg-orange-100 text-orange-800";
      case "confirmed": case "active": return "bg-green-100 text-green-800";
      case "completed": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <PageWrapper className="p-6">
        <div className="space-y-6">
          <div className="h-8 w-64 bg-gray-200 rounded animate-pulse"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-car-red to-car-red-dark bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 text-lg mt-2">
            Welcome back! Here's what's happening with your platform.
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="outline" className="text-green-600 border-green-600">
            <Activity className="w-4 h-4 mr-1" />
            System Online
          </Badge>
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
            <div className="text-3xl font-bold text-blue-600">{stats?.totalCars?.toLocaleString() || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.activeCars || 0} active, {stats?.soldCars || 0} sold
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dealerships</CardTitle>
            <Building2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{stats?.totalDealerships || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.pendingApplications || 0} pending applications
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">{stats?.totalUsers?.toLocaleString() || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.userGrowth > 0 ? '+' : ''}{stats?.userGrowth || 0}% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Est. Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">
              {stats?.estimatedRevenue ? formatPriceWithCrore(stats.estimatedRevenue) : 'Rs 0'}
            </div>
            <p className="text-xs text-muted-foreground">
              From {stats?.soldCars || 0} sales
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Test Drives</CardTitle>
            <Calendar className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{stats?.totalTestDrives || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.testDrivesThisMonth || 0} this month
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">{stats?.pendingApplications || 0}</div>
            <p className="text-xs text-muted-foreground">
              Requires attention
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-600">{stats?.conversionRate || 0}%</div>
            <p className="text-xs text-muted-foreground">
              Test drive to completion
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-indigo-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
            <Zap className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-indigo-600">
              {stats?.totalInventoryValue ? formatPriceWithCrore(stats.totalInventoryValue) : 'Rs 0'}
            </div>
            <p className="text-xs text-muted-foreground">
              Total inventory
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Activity */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => {
                  const IconComponent = getActivityIcon(activity.type);
                  return (
                    <div key={activity.id} className="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="bg-gray-100 p-2 rounded-lg">
                        <IconComponent className="h-4 w-4 text-gray-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {activity.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {activity.timeDisplay}
                        </p>
                      </div>
                      <Badge className={getStatusColor(activity.status)}>
                        {activity.status}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {quickActions.map((action, index) => (
                  <Link key={index} href={action.href}>
                    <Button variant="outline" className="h-20 flex-col space-y-2 w-full hover:scale-105 transition-transform">
                      <div className={`${action.color} p-2 rounded-lg`}>
                        <action.icon className="h-6 w-6 text-white" />
                      </div>
                      <span className="text-sm">{action.label}</span>
                    </Button>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          
          {/* System Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">System Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Database</span>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${
                    systemHealth?.database?.status === 'healthy' ? 'bg-green-500' : 'bg-red-500'
                  }`}></div>
                  <span className={`text-sm font-medium ${
                    systemHealth?.database?.status === 'healthy' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {systemHealth?.database?.status === 'healthy' ? 'Healthy' : 'Error'}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">API Response</span>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${
                    (systemHealth?.api?.responseTime || 0) < 1000 ? 'bg-green-500' : 'bg-yellow-500'
                  }`}></div>
                  <span className={`text-sm font-medium ${
                    (systemHealth?.api?.responseTime || 0) < 1000 ? 'text-green-600' : 'text-yellow-600'
                  }`}>
                    {systemHealth?.api?.responseTime ? 
                      `${systemHealth.api.responseTime < 1000 ? 'Fast' : 'Slow'} (${systemHealth.api.responseTime}ms)` : 
                      'Unknown'
                    }
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Storage</span>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${
                    (systemHealth?.storage?.usage || 0) < 80 ? 'bg-green-500' : 'bg-yellow-500'
                  }`}></div>
                  <span className={`text-sm font-medium ${
                    (systemHealth?.storage?.usage || 0) < 80 ? 'text-green-600' : 'text-yellow-600'
                  }`}>
                    {systemHealth?.storage?.usage || 0}% Used
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">CDN</span>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${
                    systemHealth?.cdn?.status === 'operational' ? 'bg-green-500' : 'bg-red-500'
                  }`}></div>
                  <span className={`text-sm font-medium ${
                    systemHealth?.cdn?.status === 'operational' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {systemHealth?.cdn?.status === 'operational' ? 'Operational' : 'Down'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Performance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Page Load Speed</span>
                  <span className="font-medium">1.2s</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>User Satisfaction</span>
                  <span className="font-medium">4.8/5</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '96%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Search Success</span>
                  <span className="font-medium">92%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-orange-600" />
                    <span className="text-sm font-medium text-orange-800">
                      8 pending applications
                    </span>
                  </div>
                  <p className="text-xs text-orange-600 mt-1">
                    Requires review within 24 hours
                  </p>
                </div>
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Activity className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">
                      High traffic detected
                    </span>
                  </div>
                  <p className="text-xs text-blue-600 mt-1">
                    Consider scaling resources
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageWrapper>
  );
};

export default AdminDashboard;

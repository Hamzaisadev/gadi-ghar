"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Calendar,
  Car,
  Cog,
  LayoutDashboard,
  User,
  Building2,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const Sidebar = () => {
  const pathname = usePathname();

  const routes = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/admin",
    },
    {
      label: "Cars",
      icon: Car,
      href: "/admin/cars",
    },
    {
      label: "Dealerships",
      icon: Building2,
      href: "/admin/dealerships",
    },
    {
      label: "Test Drives",
      icon: Calendar,
      href: "/admin/test-drives",
    },
    {
      label: "Settings",
      icon: Cog,
      href: "/admin/settings",
    },
    // New: quick access to the user's own dealership portal
    {
      label: "Dealership Portal",
      icon: Building2,
      href: "/dealership",
    },
  ];

  const mobileRoutes = [
    ...routes,
    {
      label: "Profile",
      icon: User,
      href: "/admin/profile",
    },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex max-h-screen flex-col overflow-y-auto bg-background shadow-elegant border-r border-border">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl pt-10 font-bold text-foreground">
            Admin Dashboard
          </h2>
        </div>

        <nav className="flex-1 py-4">
          {routes.map((route) => {
            const isActive = pathname === route.href;
            return (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "flex min-h-[44px] items-center gap-x-3 text-sm font-medium px-6 mx-2 rounded-lg transition-all duration-200 group hover:translate-x-1 focus:outline-none focus:ring-2 focus:ring-red-500/50",
                  isActive
                    ? "bg-red-500 text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
                aria-label={`Navigate to ${route.label}`}
              >
                <route.icon
                  className={cn(
                    "h-5 w-5 transition-transform duration-200",
                    isActive
                      ? "text-primary-foreground"
                      : "group-hover:scale-110"
                  )}
                />
                {route.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border shadow-elegant">
        <div className="flex justify-around items-center h-16">
          {mobileRoutes.map((route) => {
            const isActive = pathname === route.href;
            return (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "flex flex-col items-center justify-center text-xs font-medium transition-all duration-200 py-2 px-2 rounded-lg min-w-0 flex-1 min-h-[48px] focus:outline-none focus:ring-2 focus:ring-red-500/50",
                  isActive
                    ? "text-primary-foreground bg-red-500 shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
                aria-label={`Navigate to ${route.label}`}
              >
                <route.icon
                  className={cn(
                    "h-5 w-5 mb-1 transition-all duration-200",
                    isActive
                      ? "text-primary scale-110"
                      : "group-hover:scale-105"
                  )}
                />
                <span className="truncate">{route.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Sidebar;

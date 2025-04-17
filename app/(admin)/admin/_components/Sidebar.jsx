"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SignedIn, UserButton, useUser } from "@clerk/nextjs";
import { Calendar, Car, Cog, LayoutDashboard, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const Sidebar = () => {
  const pathname = usePathname();
  const { user } = useUser();
  console.log(user);

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
      label: "Test Drives",
      icon: Calendar,
      href: "/admin/test-drives",
    },
    {
      label: "Settings",
      icon: Cog,
      href: "/admin/settings",
    },
  ];

  const mobileRoutes = [
    ...routes,
    {
      label: user?.firstName || "Profile",
      icon: User,
      image: user?.imageUrl,
      href: <UserButton />,
    },
  ];

  return (
    <>
      <div className="hidden md:flex h-full flex-col overflow-y-auto bg-white shadow-sm border-r-2">
        {routes.map((route) => {
          return (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex h-14 items-center gap-x-2 to-slate-500 text-sm font-medium pl-6 transition-all hover:text-slate-600 hover:bg-slate-100/50",
                pathname === route.href
                  ? "text-blue-700 bg-blue-100/50 hover:bg-blue-100 hover:text-blue-700"
                  : ""
              )}
            >
              <route.icon className="h-5 w-5" />
              {route.label}
            </Link>
          );
        })}
      </div>

      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t flex justify-around items-center h-16">
        {mobileRoutes.map((route) => {
          return (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex flex-col items-center text-slate-500 text-xs font-medium transition-all py-1 flex-1",
                pathname === route.href
                  ? "text-blue-700 bg-blue-100/50 hover:bg-blue-100 hover:text-blue-700"
                  : ""
              )}
            >
              {route.image && route.image.length > 0 ? (
                <Button variant="ghost" href={user.href}>
                  <UserButton />
                </Button>
              ) : (
                <route.icon className="h-5 w-5" />
              )}
              {route.label}
            </Link>
          );
        })}
      </div>
    </>
  );
};

export default Sidebar;

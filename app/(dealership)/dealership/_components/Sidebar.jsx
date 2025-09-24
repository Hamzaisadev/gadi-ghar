"use client";

import { cn } from "@/lib/utils";
import { Building2, Car, Settings, Users, LayoutDashboard, User, Calendar } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const DealershipSidebar = () => {
  const pathname = usePathname();

  const routes = [
    { label: "Overview", icon: LayoutDashboard, href: "/dealership" },
    { label: "Manage Cars", icon: Car, href: "/dealership/cars" },
    { label: "Test Drives", icon: Calendar, href: "/dealership/test-drives" },
    { label: "Profile", icon: User, href: "/dealership/profile" },
    { label: "Team", icon: Users, href: "/dealership/team" },
    { label: "Settings", icon: Settings, href: "/dealership/settings" },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex max-h-screen flex-col overflow-y-auto bg-background shadow-elegant border-r border-border w-64">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl pt-10 font-bold text-foreground">Dealership Admin</h2>
        </div>

        <nav className="flex-1 py-4">
          {routes.map((route) => {
            const isActive = pathname === route.href;
            return (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "flex h-12 items-center gap-x-3 text-sm font-medium px-6 mx-2 rounded-lg transition-all duration-200 group hover:translate-x-1",
                  isActive
                    ? "bg-red-500 text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <route.icon
                  className={cn(
                    "h-5 w-5 transition-transform duration-200",
                    isActive ? "text-primary-foreground" : "group-hover:scale-110"
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
          {routes.map((route) => {
            const isActive = pathname === route.href;
            return (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "flex flex-col items-center justify-center text-xs font-medium transition-all duration-200 py-2 px-3 rounded-lg min-w-0 flex-1",
                  isActive
                    ? "text-primary bg-red-500"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <route.icon
                  className={cn(
                    "h-5 w-5 mb-1 transition-all duration-200",
                    isActive ? "text-primary scale-110" : "group-hover:scale-105"
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

export default DealershipSidebar;


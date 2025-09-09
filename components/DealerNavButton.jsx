"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getDealershipUIState } from "@/app/actions/dealership-ui";
import { Car, Clock, CheckCircle, AlertCircle } from "lucide-react";

export default function DealerNavButton() {
  const [ui, setUi] = useState({ state: "NONE" });
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();

  const fetchUIState = async () => {
    setIsLoading(true);
    try {
      console.log('[DealerNavButton] Fetching dealership UI state...');
      const res = await getDealershipUIState();
      console.log('[DealerNavButton] Got response:', res);
      setUi(res || { state: "NONE" });
    } catch (error) {
      console.error('[DealerNavButton] Error fetching UI state:', error);
      setUi({ state: "NONE" });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch on mount
  useEffect(() => {
    fetchUIState();
  }, []);

  // Refetch when route changes (to catch status changes)
  useEffect(() => {
    // Small delay to allow any server-side changes to complete
    const timer = setTimeout(fetchUIState, 100);
    return () => clearTimeout(timer);
  }, [pathname]);

  if (!ui || ui.state === "NONE") return null;

  const iconMap = {
    BECOME: Car,
    CHECK_STATUS: Clock,
    MY_DEALERSHIP: CheckCircle,
  };
  const Icon = iconMap[ui.state] || AlertCircle;

  return (
    <Link href={ui.href}>
      <Button
        variant="outline"
        className={`bg-car-red border-car-red text-white hover:bg-car-red-dark ${
          isLoading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        title={ui.label}
        disabled={isLoading}
      >
        <Icon size={18} className={isLoading ? 'animate-spin' : ''} />
        <span className="hidden md:inline">{ui.label}</span>
      </Button>
    </Link>
  );
}


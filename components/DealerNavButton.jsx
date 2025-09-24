"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getDealershipUIState } from "@/app/actions/dealership-ui";
import { Car, Clock, CheckCircle, AlertCircle } from "lucide-react";

export default function DealerNavButton() {
  const [ui, setUi] = useState({ state: "NONE" });
  const [optimisticUi, setOptimisticUi] = useState(null); // Local state for instant updates
  const [isLoading, setIsLoading] = useState(false);
  const [lastFetchTime, setLastFetchTime] = useState(0); // Cache to avoid excessive fetches
  const pathname = usePathname();

  const fetchUIState = async (force = false) => {
    // Cache for 30 seconds to avoid excessive requests
    const now = Date.now();
    const cacheTimeout = 30 * 1000; // 30 seconds
    
    if (!force && (now - lastFetchTime) < cacheTimeout) {
      return; // Use cached state
    }

    setIsLoading(true);
    try {
      console.log('[DealerNavButton] Fetching dealership UI state...');
      const res = await getDealershipUIState();
      console.log('[DealerNavButton] Got response:', res);
      
      const newState = res || { state: "NONE" };
      setUi(newState);
      
      // If we had optimistic state, clear it since we have real data now
      if (optimisticUi) {
        setOptimisticUi(null);
      }
      
      setLastFetchTime(now);
    } catch (error) {
      console.error('[DealerNavButton] Error fetching UI state:', error);
      setUi({ state: "NONE" });
      setOptimisticUi(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to optimistically update the UI for instant feedback
  const setOptimisticState = (newState) => {
    setOptimisticUi(newState);
    // Fetch real state after a short delay
    setTimeout(() => fetchUIState(true), 1000);
  };

  // Fetch on mount
  useEffect(() => {
    fetchUIState();
  }, []);

  // Refetch when route changes (to catch status changes) but less frequently
  useEffect(() => {
    // Only refetch if we don't have recent data
    const timer = setTimeout(() => {
      if (Date.now() - lastFetchTime > 10000) { // 10 seconds
        fetchUIState();
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [pathname, lastFetchTime]);

  // Use optimistic state if available, otherwise use real state
  const currentUi = optimisticUi || ui;
  
  if (!currentUi || currentUi.state === "NONE") return null;

  const iconMap = {
    BECOME: Car,
    CHECK_STATUS: Clock,
    MY_DEALERSHIP: CheckCircle,
  };
  const Icon = iconMap[currentUi.state] || AlertCircle;

  const handleClick = (e) => {
    // For certain actions, provide optimistic feedback
    if (currentUi.state === 'BECOME') {
      // When user clicks "Become a Dealer", optimistically show "Check Status"
      setOptimisticState({
        state: 'CHECK_STATUS',
        label: 'Check Application Status',
        href: '/dealership-signup'
      });
    }
    // Don't prevent default - let the navigation happen
  };

  return (
    <Link href={currentUi.href}>
      <Button
        variant="outline"
        className={`bg-car-red border-car-red text-white hover:bg-car-red-dark ${
          isLoading ? 'opacity-50 cursor-not-allowed' : ''
        } ${
          optimisticUi ? 'transition-all duration-300' : ''
        }`}
        title={currentUi.label}
        disabled={isLoading}
        onClick={handleClick}
      >
        <Icon size={18} className={isLoading ? 'animate-spin' : ''} />
        <span className="hidden md:inline">{currentUi.label}</span>
      </Button>
    </Link>
  );
}


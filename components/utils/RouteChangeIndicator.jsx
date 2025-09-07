"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

export default function RouteChangeIndicator() {
  const pathname = usePathname();
  const [active, setActive] = useState(false);
  const timeoutRef = useRef(null);
  const prevPathRef = useRef(pathname);

  useEffect(() => {
    if (prevPathRef.current !== pathname) {
      prevPathRef.current = pathname;
      setActive(true);
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setActive(false), 750);
    }
    return () => clearTimeout(timeoutRef.current);
  }, [pathname]);

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed left-0 right-0 top-0 z-[999] h-[3px] transition-opacity duration-200 ${
        active ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="relative h-full w-full overflow-hidden">
        <div className="absolute left-0 top-0 h-full w-full -translate-x-full will-change-transform bg-gradient-to-r from-red-500 via-rose-400 to-orange-400 gg-animate-route-progress" />
      </div>
    </div>
  );
}


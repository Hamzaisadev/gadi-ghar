"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import MainFullScreenLoader from "./mainFullScreenLoader";

export default function InitialSplash({ minDuration = 4000, oncePerSession = true, onlyOnHome = true, excludePrefixes = ["/admin", "/dealership"] }) {
  const [show, setShow] = useState(false);
  const [fade, setFade] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Exclude certain routes entirely
    if (excludePrefixes.some((p) => pathname?.startsWith(p))) return;
    if (onlyOnHome && pathname !== "/") return;

    // Check session flag
    if (oncePerSession && typeof window !== "undefined") {
      const done = sessionStorage.getItem("gg_splash_done");
      if (done) return;
    }

    setShow(true);

    const t1 = setTimeout(() => {
      setFade(true);
      const t2 = setTimeout(() => {
        setShow(false);
        if (oncePerSession && typeof window !== "undefined") {
          sessionStorage.setItem("gg_splash_done", "1");
        }
      }, 300); // fade-out duration
      return () => clearTimeout(t2);
    }, minDuration);

    return () => clearTimeout(t1);
  }, [pathname, minDuration, oncePerSession, onlyOnHome, excludePrefixes]);

  if (!show) return null;

  return (
    <div className={`fixed inset-0 z-[9999] transition-opacity duration-300 ${fade ? "opacity-0" : "opacity-100"}`}>
      <MainFullScreenLoader />
    </div>
  );
}

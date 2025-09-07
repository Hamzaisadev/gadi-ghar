"use client";

import { Car, Gauge, Zap, Fuel, Settings, Activity } from "lucide-react";

export default function FullScreenLoader() {
  return (
    <div className="fixed inset-0 z-[1000] bg-gradient-to-br from-background via-background/95 to-sky-500/5 overflow-hidden">
      {/* Subtle grid */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_24px,rgba(255,255,255,.05)_25px,rgba(255,255,255,.05)_26px,transparent_27px,transparent_74px,rgba(255,255,255,.05)_75px,rgba(255,255,255,.05)_76px,transparent_77px,transparent),linear-gradient(transparent_24px,rgba(255,255,255,.05)_25px,rgba(255,255,255,.05)_26px,transparent_27px,transparent_74px,rgba(255,255,255,.05)_75px,rgba(255,255,255,.05)_76px,transparent_77px,transparent)] bg-[size:100px_100px]" />
      </div>

      {/* Headlight sweep */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 w-40 h-2 bg-gradient-to-r from-transparent via-amber-400/30 to-transparent -translate-y-1/2 animate-headlight-sweep" />
      </div>

      {/* Main */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-6">
        <div role="status" aria-live="polite" aria-label="Loading Gadi Ghar" className="relative flex flex-col items-center">
          {/* Logo */}
          <div className="text-center mb-10">
            <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-sky-400 to-rose-500 bg-clip-text text-transparent animate-neon-pulse select-none">
              GADI GHAR
            </h1>
            <div className="mt-2 flex items-center justify-center gap-2 select-none">
              <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
              <p className="text-xs md:text-sm font-medium text-gray-300 tracking-[0.3em] uppercase">
                Premium Car Marketplace
              </p>
              <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
            </div>
          </div>

          {/* Simple speedometer */}
          <div className="relative mb-8">
            <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-sky-500/10 to-rose-500/10 p-4 backdrop-blur-sm border border-gray-300/30">
              <div className="relative w-full h-full rounded-full bg-gradient-to-br from-background/60 to-background/20 border-2 border-gray-300/40">
                {[...Array(12)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-0.5 h-4 bg-gray-300/60 origin-bottom"
                    style={{ top: "10px", left: "50%", transform: `translateX(-50%) rotate(${i * 30}deg)`, transformOrigin: "50% 40px" }}
                  />
                ))}
                <div className="absolute top-1/2 left-1/2 w-0.5 h-8 bg-car-red origin-bottom -translate-x-1/2 -translate-y-full animate-speedometer" />
                <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-amber-400 rounded-full -translate-x-1/2 -translate-y-1/2 animate-pulse" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-amber-400/20 border border-amber-400/50 flex items-center justify-center">
                <Activity className="w-3 h-3 text-amber-400 animate-dashboard-blink" />
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-3">
              <Gauge className="w-5 h-5 text-amber-400 animate-spin" style={{ animationDuration: "2s" }} />
              <p className="text-base md:text-lg font-semibold bg-gradient-to-r from-sky-400 to-amber-400 bg-clip-text text-transparent">
                Accelerating Your Car Search
              </p>
              <Gauge className="w-5 h-5 text-amber-400 animate-spin" style={{ animationDuration: "2s", animationDelay: "1s" }} />
            </div>
            <p className="text-sm text-muted-foreground tracking-wide">
              Scanning inventory • Checking dealers • Optimizing matches
            </p>
            <div className="flex justify-center gap-1 mt-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-2 h-2 bg-amber-400 rounded-full animate-dashboard-blink" style={{ animationDelay: `${i * 0.2}s` }} />
              ))}
            </div>
          </div>

          {/* Particles */}
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="pointer-events-none absolute w-1 h-1 bg-amber-400/40 rounded-full animate-particle-fall"
              style={{
                opacity: 0.6,
                top: `${Math.random() * 20}px`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 4}s`,
                animationDuration: `${4 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}


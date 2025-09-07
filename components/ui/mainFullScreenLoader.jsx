"use client";

import { Car, Gauge, Zap, Fuel, Settings, Activity } from "lucide-react";

export default function MainFullScreenLoader() {
  return (
    <div className="fixed inset-0 z-[1000] bg-gradient-to-br from-background via-background/95 to-car-blue/5 overflow-hidden">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_24px,rgba(255,255,255,.05)_25px,rgba(255,255,255,.05)_26px,transparent_27px,transparent_74px,rgba(255,255,255,.05)_75px,rgba(255,255,255,.05)_76px,transparent_77px,transparent),linear-gradient(transparent_24px,rgba(255,255,255,.05)_25px,rgba(255,255,255,.05)_26px,transparent_27px,transparent_74px,rgba(255,255,255,.05)_75px,rgba(255,255,255,.05)_76px,transparent_77px,transparent)] bg-[size:100px_100px]" />
      </div>

      {/* Headlight Sweep Effect */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute top-1/2 w-32 h-2 bg-gradient-to-r from-transparent via-car-orange/30 to-transparent transform -translate-y-1/2 animate-headlight-sweep" />
      </div>

      {/* Road Environment */}
      <div className="absolute bottom-0 left-0 right-0 h-32">
        {/* Road Surface */}
        <div className="absolute bottom-0 w-full h-20 bg-gradient-to-t from-car-gray/20 to-transparent" />
        
        {/* Road Lines */}
        <div className="absolute bottom-10 left-0 right-0 h-1 overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-16 h-1 bg-chrome/60 animate-road-lines"
              style={{
                left: `${i * 80}px`,
                animationDelay: `${i * 0.2}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 min-h-screen flex items-center justify-center">
        <div 
          role="status" 
          aria-live="polite" 
          aria-label="Loading Gadi Ghar" 
          className="relative flex flex-col items-center"
        >
          {/* Neon Logo */}
          <div className="text-center mb-12 relative">
            {/* Logo Glow Effect */}
            <div className="absolute inset-0 blur-xl opacity-50">
              <h1 className="text-6xl font-black bg-gradient-to-r from-neon-blue to-neon-red bg-clip-text text-transparent">
                GADI GHAR
              </h1>
            </div>
            <h1 className="relative text-6xl font-black bg-gradient-to-r from-neon-blue to-neon-red bg-clip-text text-transparent animate-neon-pulse">
              GADI GHAR
            </h1>
            <div className="mt-2 flex items-center justify-center gap-2">
              <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-car-orange to-transparent" />
              <p className="text-sm font-medium text-chrome tracking-[0.3em] uppercase">
                Premium Car Marketplace
              </p>
              <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-car-orange to-transparent" />
            </div>
          </div>

          {/* Racing Car Animation */}
          <div className="relative w-80 h-32 mb-8">
            {/* Race Track */}
            <div className="absolute bottom-8 left-0 right-0 h-2 bg-gradient-to-r from-car-gray/30 via-car-gray/60 to-car-gray/30 rounded-full" />
            <div className="absolute bottom-9 left-0 right-0 h-0.5 bg-chrome/40" />
            
            {/* Smoke/Exhaust Effects */}
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="absolute bottom-12 w-4 h-4 bg-car-gray/20 rounded-full animate-smoke-rise"
                style={{
                  left: '40%',
                  animationDelay: `${i * 0.5}s`
                }}
              />
            ))}

            {/* Racing Car */}
            <div className="absolute bottom-10 animate-car-race">
              <div className="relative">
                {/* Car Body */}
                <div className="relative">
                  <Car className="w-16 h-16 text-car-red drop-shadow-2xl animate-engine-rev" />
                  {/* Headlights */}
                  <div className="absolute top-2 -left-2 w-2 h-1 bg-neon-blue rounded-full animate-dashboard-blink" />
                  <div className="absolute bottom-2 -left-2 w-2 h-1 bg-neon-red rounded-full animate-dashboard-blink" style={{ animationDelay: '0.5s' }} />
                </div>
                
                {/* Spinning Wheels */}
                <div className="absolute -bottom-2 left-2 w-3 h-3 border-2 border-car-gray rounded-full animate-wheel-fast-spin" />
                <div className="absolute -bottom-2 right-2 w-3 h-3 border-2 border-car-gray rounded-full animate-wheel-fast-spin" style={{ animationDelay: '0.1s' }} />
              </div>
            </div>
          </div>

          {/* Advanced Dashboard */}
          <div className="relative mb-8">
            {/* Speedometer Container */}
            <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-car-blue/20 to-car-red/20 p-4 backdrop-blur-sm border border-chrome/30">
              {/* Speedometer Dial */}
              <div className="relative w-full h-full rounded-full bg-gradient-to-br from-background/50 to-background/20 border-2 border-chrome/50">
                {/* Speed Marks */}
                {[...Array(12)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-0.5 h-4 bg-chrome/60 origin-bottom"
                    style={{
                      top: '10px',
                      left: '50%',
                      transform: `translateX(-50%) rotate(${i * 30}deg)`,
                      transformOrigin: '50% 40px'
                    }}
                  />
                ))}
                {/* Speed Needle */}
                <div className="absolute top-1/2 left-1/2 w-0.5 h-8 bg-car-red origin-bottom -translate-x-1/2 -translate-y-full animate-speedometer" />
                {/* Center Dot */}
                <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-car-orange rounded-full -translate-x-1/2 -translate-y-1/2 animate-pulse" />
              </div>
              
              {/* RPM Indicator */}
              <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-car-orange/20 border border-car-orange/50 flex items-center justify-center">
                <Activity className="w-3 h-3 text-car-orange animate-dashboard-blink" />
              </div>
            </div>

            {/* Dashboard Lights */}
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-neon-blue rounded-full animate-dashboard-blink" />
                <Fuel className="w-4 h-4 text-neon-blue/80" />
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-car-orange rounded-full animate-dashboard-blink" style={{ animationDelay: '0.3s' }} />
                <Settings className="w-4 h-4 text-car-orange/80 animate-spin" style={{ animationDuration: '3s' }} />
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-neon-red rounded-full animate-dashboard-blink" style={{ animationDelay: '0.6s' }} />
                <Zap className="w-4 h-4 text-neon-red/80" />
              </div>
            </div>
          </div>

          {/* Advanced Progress Bar */}
          <div className="w-96 mb-6">
            <div className="relative h-3 bg-background/20 rounded-full border border-chrome/30 overflow-hidden backdrop-blur-sm">
              {/* Multiple Progress Layers */}
              <div className="absolute inset-0 bg-gradient-to-r from-car-blue via-car-orange to-car-red opacity-30 animate-headlight-sweep" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-neon-blue/50 to-transparent animate-headlight-sweep" style={{ animationDelay: '1s' }} />
              
              {/* Progress Segments */}
              <div className="absolute inset-y-0 left-0 flex">
                {[...Array(20)].map((_, i) => (
                  <div
                    key={i}
                    className="w-4 h-full border-r border-background/20 bg-gradient-to-t from-car-blue/20 to-transparent animate-dashboard-blink"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Status Messages */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-3">
              <Gauge className="w-5 h-5 text-car-orange animate-spin" style={{ animationDuration: '2s' }} />
              <p className="text-lg font-semibold bg-gradient-to-r from-car-blue to-car-orange bg-clip-text text-transparent">
                Accelerating Your Car Search
              </p>
              <Gauge className="w-5 h-5 text-car-orange animate-spin" style={{ animationDuration: '2s', animationDelay: '1s' }} />
            </div>
            <p className="text-sm text-muted-foreground tracking-wide">
              Scanning premium inventory • Checking dealer networks • Optimizing matches
            </p>
            
            {/* Loading Dots */}
            <div className="flex justify-center gap-1 mt-4">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-2 bg-car-orange rounded-full animate-pulse"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
          </div>

          {/* Floating Particles */}
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-car-orange/40 rounded-full animate-particle-fall"
              style={{
                opacity: 0.6,
                top: `${Math.random() * 20}px`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${4 + Math.random() * 2}s`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${4 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}


     



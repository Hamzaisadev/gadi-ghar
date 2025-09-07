"use client";

import Image from "next/image";

export default function FullScreenLoader({ label = "Gadi Ghar" }) {
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_20%_20%,rgba(239,68,68,0.12),transparent_50%),radial-gradient(ellipse_at_80%_30%,rgba(59,130,246,0.12),transparent_50%),rgba(10,10,10,0.7)] backdrop-blur-md">
      {/* Ambient aurora glows */}
      <div className="absolute inset-0">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-gradient-to-tr from-red-500/30 to-rose-400/30 blur-3xl animate-pulse" />
        <div className="absolute -bottom-28 -right-16 h-72 w-72 rounded-full bg-gradient-to-tr from-blue-500/25 to-violet-500/25 blur-3xl animate-pulse [animation-duration:2.4s]" />
      </div>

      <div role="status" aria-live="polite" aria-label="Loading" className="relative flex flex-col items-center gap-6">
        {/* Modern double-ring spinner with logo center */}
        <div className="relative size-24">
          <div className="absolute inset-0 rounded-full border-4 border-white/10" />
          <div className="absolute inset-0 rounded-full border-4 border-t-transparent border-red-500 animate-spin" />
          <div className="absolute inset-2 rounded-full border-4 border-transparent border-l-rose-400 animate-[spin_1.6s_linear_infinite]" />
          <div className="absolute inset-4 rounded-full bg-gradient-to-br from-white/10 to-transparent backdrop-blur-sm" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Image src="/GariGharBlack.png" alt={label} width={64} height={64} className="opacity-95 invert" priority />
          </div>
        </div>
        <p className="text-sm tracking-wide text-white/70 bebas">Loading…</p>
      </div>
    </div>
  );
}


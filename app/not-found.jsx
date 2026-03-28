"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Car, MapPin, Navigation } from "lucide-react";
import { motion } from "framer-motion";

export default function NotFound() {

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-200 dark:from-gray-950 dark:to-gray-900 text-center px-4 overflow-hidden relative">
      
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-64 h-64 bg-red-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <motion.div
        initial={{ x: -100, opacity: 0, rotate: -10 }}
        animate={{ x: 0, opacity: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 60, duration: 1 }}
        className="relative z-10"
      >
        <div className="relative">
          <Car className="w-40 h-40 text-gray-800 dark:text-gray-200" strokeWidth={1.5} />
          <motion.div 
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -top-4 -right-4"
          >
            <div className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
              404
            </div>
          </motion.div>
        </div>
      </motion.div>
      
      <motion.h1 
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-6xl md:text-8xl font-black text-gray-900 dark:text-white mb-4 mt-8 tracking-tighter"
      >
        Lost?
      </motion.h1>
      
      <motion.h2 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-xl md:text-2xl font-medium text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto"
      >
        Looks like you've taken a wrong turn. This road leads to nowhere.
      </motion.h2>
      
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <Link href="/">
          <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl transition-all gap-2">
            <Navigation size={18} />
            Return Home
          </Button>
        </Link>
        <Link href="/cars">
          <Button size="lg" variant="outline" className="gap-2">
            <Car size={18} />
            Browse Cars
          </Button>
        </Link>
      </motion.div>

      {/* Road Animation */}
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gray-800 dark:bg-gray-950 flex items-center justify-center overflow-hidden">
        <div className="w-full h-2 bg-dashed border-t-2 border-dashed border-white/30 animate-road-lines"></div>
      </div>
    </div>
  );
}

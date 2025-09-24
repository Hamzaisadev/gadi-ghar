"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function MainFullScreenLoader() {
  const [loadingComplete, setLoadingComplete] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoadingComplete(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5, staggerChildren: 0.2 } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.5 } },
  };

  const carVariants = {
    hidden: { x: -100, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { type: "spring", stiffness: 120, damping: 10, duration: 0.8 } },
  };

  const pulseVariants = {
    animate: { scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6], transition: { duration: 2, repeat: Infinity, ease: "easeInOut" } },
  };

  const textVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 120, damping: 12, delay: 0.5 } },
  };

  const progressVariants = {
    initial: { width: "0%" },
    animate: { width: "100%", transition: { duration: 1.2, ease: "easeInOut" } },
  };

  if (loadingComplete) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "linear-gradient(135deg, hsl(var(--background)) 0%, hsl(var(--secondary)) 100%)" }}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {/* Background animated elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full opacity-10"
            style={{
              background: "hsl(var(--car-red))",
              width: `${Math.random() * 100 + 50}px`,
              height: `${Math.random() * 100 + 50}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 200 - 100],
              y: [0, Math.random() * 200 - 100],
              rotate: [0, 360],
              scale: [1, 1.5, 1],
            }}
            transition={{ duration: Math.random() * 10 + 5, repeat: Infinity, ease: "linear" }}
          />
        ))}
      </div>

      {/* Main loader content */}
      <div className="relative z-10 text-center">
        {/* Logo/Brand */}
        <motion.div variants={textVariants} className="mb-12">
          <h1
            className="text-6xl font-bold tracking-wider mb-2"
            style={{
              background: "linear-gradient(135deg, hsl(var(--car-red)) 0%, hsl(var(--car-red-light)) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              textShadow: "0 0 30px hsla(var(--car-red-light), 0.3)",
            }}
          >
            GADI GHAR
          </h1>
          <p className="text-lg text-muted-foreground font-medium tracking-wide">Premium Car Showroom</p>
        </motion.div>

        {/* Animated car icons */}
        <div className="flex justify-center items-center gap-8 mb-12">
          {[...Array(3)].map((_, index) => (
            <motion.div key={index} variants={carVariants} style={{ animationDelay: `${index * 0.3}s` }}>
              <motion.div variants={pulseVariants} animate="animate" className="relative">
                {/* Car body */}
                <motion.div
                  className="w-16 h-8 rounded-lg relative mx-auto mb-2"
                  style={{
                    background: "linear-gradient(135deg, hsl(var(--car-red)) 0%, hsl(var(--car-red-dark)) 100%)",
                    boxShadow: "0 8px 25px hsla(var(--car-red), 0.4)",
                  }}
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: index * 0.2 }}
                >
                  {/* Car windows */}
                  <div className="absolute top-1 left-2 right-2 h-3 bg-white/20 rounded-sm" />
                  {/* Car wheels */}
                  <motion.div className="absolute -bottom-1 left-1 w-3 h-3 rounded-full" style={{ background: "hsl(var(--foreground))" }} animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} />
                  <motion.div className="absolute -bottom-1 right-1 w-3 h-3 rounded-full" style={{ background: "hsl(var(--foreground))" }} animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} />
                </motion.div>
                {/* Speed lines */}
                <motion.div
                  className="absolute top-1/2 -left-8 w-6 h-0.5 rounded-full opacity-60"
                  style={{ background: "hsl(var(--car-red))" }}
                  animate={{ scaleX: [0, 1, 0], opacity: [0, 0.8, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: index * 0.2 }}
                />
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Loading progress */}
        <motion.div variants={textVariants} className="w-80 mx-auto">
          <div className="h-1 rounded-full mb-4 overflow-hidden" style={{ background: "hsl(var(--secondary))" }}>
            <motion.div
              className="h-full rounded-full"
              style={{
                background: "linear-gradient(90deg, hsl(var(--car-red)) 0%, hsl(var(--car-red-light)) 100%)",
                boxShadow: "0 0 10px hsl(var(--car-red-light))",
              }}
              variants={progressVariants}
              initial="initial"
              animate="animate"
            />
          </div>
        </motion.div>

        {/* Loading text */}
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="text-sm font-medium tracking-wide"
          style={{ color: "hsl(var(--muted-foreground))" }}
        >
          Initializing Your Premium Experience...
        </motion.div>

        {/* Rotating gear */}
        <motion.div className="absolute -top-16 -right-16 w-32 h-32 opacity-5" animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }}>
          <div className="w-full h-full rounded-full border-8 border-dashed" style={{ borderColor: "hsl(var(--car-red))" }} />
        </motion.div>
      </div>
    </motion.div>
  );
}

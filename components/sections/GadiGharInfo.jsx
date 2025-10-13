"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Check, Star, Shield, Car, Eye } from "lucide-react";
import { useEffect, useRef } from "react";
import { useMotionValue, animate, useInView } from "framer-motion";

// AnimatedNumber component using Framer Motion, animates only when inView is true
const AnimatedNumber = ({ value, duration = 2, inView }) => {
  const motionValue = useMotionValue(0);
  const nodeRef = useRef();

  useEffect(() => {
    if (inView) {
      const controls = animate(motionValue, value, { duration });
      return controls.stop;
    }
  }, [value, duration, motionValue, inView]);

  useEffect(() => {
    return motionValue.on("change", (latest) => {
      if (nodeRef.current) {
        nodeRef.current.textContent = Math.floor(latest);
      }
    });
  }, [motionValue]);

  return <span ref={nodeRef}>0</span>;
};

const GadiGharInfo = () => {
  const features = [
    "Pakistan's most trusted automotive marketplace serving customers nationwide with verified dealers and quality assurance.",
    "Revolutionary AI-powered car search and instant financing options from major Pakistani banks like HBL, UBL, and Meezan Bank.",
    "Upload any car photo to get instant details, market valuation, and find similar vehicles across Pakistan's inventory.",
  ];

  const stats = [
    {
      icon: Car,
      title: "Cars Listed",
      number: 2500,
      suffix: "+",
    },
    {
      icon: Star,
      title: "Happy Customers",
      number: 850,
      suffix: "+",
    },
    {
      icon: Eye,
      title: "Monthly Visitors",
      number: 25,
      suffix: "K+",
    },
    {
      icon: Shield,
      title: "Verified Dealers",
      number: 150,
      suffix: "+",
    },
  ];

  // For in-view animation
  const statsSectionRef = useRef(null);
  const isInView = useInView(statsSectionRef, { once: true, margin: "-100px" });

  return (
    <section className="py-16  bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 ">
        {/* Main Content Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Images Grid */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4 h-[400px] lg:h-[500px]">
              {/* Large image on the left */}
              <div className="row-span-2">
                <img
                  src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                  alt="Modern car exterior"
                  className="w-full h-full object-cover rounded-2xl shadow-lg"
                />
              </div>

              {/* Two smaller images on the right */}
              <div>
                <img
                  src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                  alt="Car interior"
                  className="w-full h-full object-cover rounded-2xl shadow-lg"
                />
              </div>
              <div>
                <img
                  src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                  alt="Car engine"
                  className="w-full h-full object-cover rounded-2xl shadow-lg"
                />
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute -top-4 -right-4 bg-red-600 text-white px-4 py-2 rounded-full font-semibold shadow-lg">
              Trusted Service
            </div>
          </div>

          {/* Content */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                Pakistan's Premier Car Marketplace
                <span className="block text-red-600">
                  Buy, Sell & Finance With Ease
                </span>
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                From Suzuki Alto to luxury imports, we connect Pakistani car
                buyers with verified sellers nationwide. Get instant financing,
                comprehensive insurance, and seamless documentation services.
              </p>
            </div>

            {/* Features List */}
            <div className="space-y-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                    <Check className="w-4 h-4 text-red-600" />
                  </div>
                  <p className="text-gray-700 leading-relaxed">{feature}</p>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <div className="pt-4">
              <Button className="bg-red-500 hover:bg-red-700 h-12 text-white px-8 py-3 text-lg font-semibold  shadow-lg hover:shadow-xl transition-all duration-300 group">
                Get Started
                <ArrowUpRight className="ml-2 w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Section */}
      </div>
      <div className="py-16 sm:py-20 ">
        <div className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 px-4 py-16 relative overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 right-20 w-40 h-40 bg-white rounded-full blur-2xl"></div>
            <div className="absolute bottom-10 left-20 w-32 h-32 bg-white rounded-full blur-2xl"></div>
          </div>

          <div
            ref={statsSectionRef}
            className="container mx-auto relative z-10"
          >
            <div className="text-center mb-12">
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Pakistan's Trusted Numbers
              </h3>
              <p className="text-xl text-red-100">
                Real statistics from across the country
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {stats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <div
                    key={index}
                    className="text-center group bg-white rounded-2xl p-6 md:p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0 shadow-xl"
                  >
                    <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-red-600 group-hover:scale-110 transition-all duration-300">
                      <IconComponent className="w-8 h-8 text-red-600 group-hover:text-white" />
                    </div>
                    <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-1">
                      <AnimatedNumber
                        value={stat.number}
                        duration={2}
                        inView={isInView}
                      />
                      {stat.suffix}
                    </h3>
                    <p className="text-lg md:text-xl text-gray-600 font-medium">
                      {stat.title}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GadiGharInfo;

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
    "Based in Karachi, Pakistan your trusted local car showroom app.",
    "AI-powered search for buyers and AI-assisted selling for car owners.",
    "Simply upload a photo to automatically fill in all your car’s details.",
  ];

  const stats = [
    {
      icon: Car,
      title: "Car Deals",
      number: 500,
      suffix: "+",
    },
    {
      icon: Star,
      title: "Dealer Reviews",
      number: 100,
      suffix: "+",
    },
    {
      icon: Eye,
      title: "Visitors Per Day",
      number: 1000,
      suffix: "+",
    },
    {
      icon: Shield,
      title: "Verified Dealers",
      number: 100,
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
                Get A Fair Price For Your Car
                <span className="block text-red-600">Sell To Us Today</span>
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                We are committed to providing our customers with exceptional
                service, competitive pricing, and a wide range of automotive
                solutions.
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
        <div ref={statsSectionRef} className="border-t border-gray-200 pt-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div
                  key={index}
                  className="text-center group hover:bg-white hover:shadow-lg rounded-xl p-6 transition-all duration-300"
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-red-600 transition-colors duration-300">
                    <IconComponent className="w-6 h-6 text-red-600 group-hover:text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-1 flex items-center justify-center gap-1">
                    <AnimatedNumber
                      value={stat.number}
                      duration={2}
                      inView={isInView}
                    />
                    {stat.suffix}
                  </h3>
                  <p className="text-lg text-gray-600">{stat.title}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default GadiGharInfo;

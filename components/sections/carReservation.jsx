import React from "react";
import { Button } from "@/components/ui/button";
import { Calendar, CheckCircle, Clock, Star } from "lucide-react";

const CarReservation = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className=" mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
            <div className="lg:col-span-3 order-1 lg:order-1">
              <div className="inline-block mb-4">
                <span className="bg-red-100 text-red-600 px-4 py-2 rounded-full text-sm font-semibold tracking-wide uppercase">
                  Exclusive Access
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
                Your Dream Ride, <span className="text-red-600">Reserved.</span>
              </h2>
              <p className="text-gray-600 text-xl mb-6 leading-relaxed">
                Lock in your slot before the rush. Use our easy reservation
                system to schedule a personal viewing or test drive of your
                favorite show car.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="flex items-start space-x-3">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Calendar className="text-red-600" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-black mb-1">
                      Flexible Scheduling
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Choose your preferred date and time slot
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="text-red-600" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-black mb-1">
                      Priority Access
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Skip the lines with guaranteed viewing
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Star className="text-red-600" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-black mb-1">
                      Expert Guidance
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Get detailed insights from car specialists
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="text-red-600" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-black mb-1">
                      No-Hassle Experience
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Just show up & your ride is ready to explore
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 font-semibold transform hover:scale-105 transition-all duration-300 h-12">
                  Reserve Now
                </Button>
                <Button
                  variant="outline"
                  className="border-red-600 text-red-600 hover:bg-red-50 px-8 py-4  font-semibold transition-all duration-300 h-12"
                >
                  View Schedule
                </Button>
              </div>
            </div>
            <div className="lg:col-span-2 order-2 lg:order-2">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1544636331-e26879cd4d9b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80"
                  alt="Luxury Car"
                  className="w-full h-auto rounded-2xl shadow-2xl object-cover"
                />
                <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg p-4 border border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                      <Calendar className="text-red-600" size={16} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">
                        Next Available
                      </p>
                      <p className="font-semibold text-black">
                        Tomorrow, 2:00 PM
                      </p>
                    </div>
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 bg-red-600 text-white rounded-full px-3 py-2 text-sm font-semibold shadow-lg">
                  Limited Slots
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CarReservation;

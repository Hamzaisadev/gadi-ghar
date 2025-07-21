import React from "react";
import { Scan, Camera, Zap, Target } from "lucide-react";

const AICarMatching = () => {
  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 right-10 w-32 h-32 bg-red-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-40 h-40 bg-black rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 right-1/3 w-60 h-60 bg-red-300 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
            <div className="lg:col-span-2 order-1 lg:order-1">
              <div className="inline-block mb-4">
                <span className="bg-red-100 text-red-600 px-4 py-2 rounded-full text-sm font-semibold tracking-wide uppercase">
                  Smart Technology
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
                🔍 Let AI Match Your{" "}
                <span className="text-red-600">Dream Car.</span>
              </h2>
              <p className="text-gray-600 text-xl mb-6 leading-relaxed">
                Upload a photo or type the name — our smart system finds the
                closest matches instantly. It's fast, easy, and surprisingly
                accurate.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="flex items-start space-x-3">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Camera className="text-red-600" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-black mb-1">
                      Photo Recognition
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Upload any car image for instant identification
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Zap className="text-red-600" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-black mb-1">
                      Lightning Fast
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Get results in under 3 seconds
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Target className="text-red-600" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-black mb-1">
                      Precise Matching
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Advanced AI identifies make, model, and year
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Scan className="text-red-600" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-black mb-1">
                      Smart Suggestions
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Find similar cars and better alternatives
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                    <Scan className="text-red-600" size={16} />
                  </div>
                  <p className="font-semibold text-black">
                    Powered by Advanced Machine Learning
                  </p>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Our AI has been trained on millions of car images and
                  constantly learns from our extensive database to deliver the
                  most accurate matches in the industry.
                </p>
              </div>
            </div>

            <div className="lg:col-span-3 order-2 lg:order-2">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                  alt="AI Car Scanning Technology"
                  className="w-full h-auto rounded-2xl shadow-2xl object-cover"
                />
                {/* AI scanning overlay effect */}
                <div className="absolute inset-0 rounded-2xl">
                  <div className="absolute top-4 left-4 w-16 h-16 border-2 border-red-500 rounded-lg opacity-80">
                    <div className="absolute top-1 left-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  </div>
                  <div className="absolute top-1/3 right-6 w-12 h-12 border-2 border-red-500 rounded-lg opacity-80">
                    <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse delay-300"></div>
                  </div>
                  <div className="absolute bottom-8 left-1/3 w-20 h-20 border-2 border-red-500 rounded-lg opacity-80">
                    <div className="absolute bottom-1 left-1 w-2 h-2 bg-red-500 rounded-full animate-pulse delay-700"></div>
                  </div>
                </div>

                {/* AI confidence badge */}
                <div className="absolute -top-4 -left-4 bg-red-600 text-white rounded-xl shadow-lg p-3 border border-gray-100">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                      <Scan className="text-white" size={14} />
                    </div>
                    <div>
                      <p className="text-xs text-red-100 uppercase tracking-wide">
                        AI Match
                      </p>
                      <p className="font-semibold text-white text-sm">
                        98% Accurate
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AICarMatching;

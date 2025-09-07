"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, Car, Users, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function DealershipSignupSection() {
  return (
    <section className="py-12 sm:py-16 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Become a Dealership Partner
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Join our network of trusted dealerships and start selling cars with Gadi Ghar. 
            Reach thousands of potential buyers and grow your business.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12">
          <Card className="text-center p-4 sm:p-6 border-2 border-gray-200 hover:border-car-red transition-all duration-300">
            <CardContent className="p-3 sm:p-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-car-red/10 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Building2 className="w-6 h-6 sm:w-8 sm:h-8 text-car-red" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Professional Platform</h3>
              <p className="text-sm sm:text-base text-gray-600">
                Access our professional car listing platform with advanced features and analytics.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center p-4 sm:p-6 border-2 border-gray-200 hover:border-car-red transition-all duration-300">
            <CardContent className="p-3 sm:p-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-car-red/10 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Users className="w-6 h-6 sm:w-8 sm:h-8 text-car-red" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Wide Customer Base</h3>
              <p className="text-sm sm:text-base text-gray-600">
                Reach thousands of potential buyers actively looking for cars in your area.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center p-4 sm:p-6 border-2 border-gray-200 hover:border-car-red transition-all duration-300">
            <CardContent className="p-3 sm:p-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-car-red/10 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-car-red" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Business Growth</h3>
              <p className="text-sm sm:text-base text-gray-600">
                Expand your business with our proven marketplace and marketing tools.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Link href="/dealership-signup">
            <Button className="bg-car-red hover:bg-car-red-dark text-white text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 w-full sm:w-auto">
              <Car className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Apply Now
            </Button>
          </Link>
          <p className="text-gray-500 mt-4 text-sm">
            Application process takes only 5 minutes • No upfront fees
          </p>
        </div>
      </div>
    </section>
  );
}

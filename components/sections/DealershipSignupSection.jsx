"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, Car, Users, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function DealershipSignupSection() {
  return (
    <section className="py-16 sm:py-20 bg-gradient-to-br from-red-600 via-red-700 to-red-800 relative overflow-hidden">
      {/* Modern background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 -right-20 w-80 h-80 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 -left-20 w-60 h-60 bg-white rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
            Become a Dealership Partner
          </h2>
          <p className="text-xl sm:text-2xl text-red-100 max-w-4xl mx-auto leading-relaxed">
            Join Pakistan's leading automotive marketplace and reach thousands of verified car buyers across the country.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
          <Card className="text-center p-6 sm:p-8 bg-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
            <CardContent className="p-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Building2 className="w-8 h-8 sm:w-10 sm:h-10 text-red-600" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Professional Platform</h3>
              <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                Advanced car listing platform with AI-powered features, analytics, and nationwide reach across Pakistan.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center p-6 sm:p-8 bg-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
            <CardContent className="p-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 sm:w-10 sm:h-10 text-red-600" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Verified Buyers</h3>
              <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                Connect with thousands of verified car buyers across Karachi, Lahore, Islamabad, and beyond.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center p-6 sm:p-8 bg-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
            <CardContent className="p-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="w-8 h-8 sm:w-10 sm:h-10 text-red-600" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Business Growth</h3>
              <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                Grow your dealership with proven marketing tools, financing partnerships, and premium listings.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Link href="/dealership-signup">
            <Button className="bg-white text-red-700 hover:bg-red-50 text-xl font-bold px-12 py-6 rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 border-2 border-white/20">
              <Car className="w-6 h-6 mr-3" />
              Start Your Partnership Today
            </Button>
          </Link>
          <p className="text-red-100 mt-6 text-lg font-medium">
            ✓ Quick 5-minute application • ✓ No upfront fees • ✓ Instant approval
          </p>
        </div>
      </div>
    </section>
  );
}

import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";

const BuySellCard = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8  mx-auto">
          {/* Buy Card */}
          <div className="relative overflow-hidden rounded-3xl bg-buy-card p-8 md:p-12 lg:p-16 min-h-[400px] flex flex-col justify-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-white  ">
                Looking to Buy a Car
              </h2>
              <p className="text-lg md:text-xl text-[#E6E6E6] font-medium  text-shad">
                Count on us for top-notch service <br /> and a wide selection.
              </p>
              <Button className="h-14 w-44 text-lg bg-[#C62828] hover:bg-[#E53935] text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105">
                Find a Car <ArrowUpRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Sell Card */}
          <div className="relative overflow-hidden rounded-3xl bg-sell-card p-8 md:p-12 lg:p-16 min-h-[400px] flex flex-col justify-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-white ">
                Want to Sell Your Car?
              </h2>
              <p className="text-lg md:text-xl text-[#F5F5F5] font-medium max-w-md">
                Get the best deal with our trusted, <br /> hassle-free process.
              </p>
              <Button className="h-14 w-44 text-lg bg-white hover:bg-gray-100 text-red-800 font-semibold rounded-xl transition-all duration-300 hover:scale-105">
                Sell Now <ArrowUpRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BuySellCard;

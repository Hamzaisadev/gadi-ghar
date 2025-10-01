import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import { ArrowUpRight } from "lucide-react";

import CarCard from "../car-card";
import { getFeaturedCars } from "@/app/actions/home";

const FeaturedCars = async () => {
  const cars = await getFeaturedCars();

  if (cars?.isLoading) {
    return (
      <div className="flex justify-center items-center section-spacing text-responsive-base font-medium text-gray-600">
        Loading featured cars...
      </div>
    );
  }

  if (cars?.error) {
    return (
      <div className="flex justify-center items-center section-spacing text-responsive-base font-medium text-red-600">
        Error: {cars?.error}
      </div>
    );
  }
  return (
    <section className="section-spacing bg-white">
      <div className="container-responsive mx-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8 md:mb-10 gap-4 sm:gap-6">
          <h2 className="text-responsive-xl font-bold tracking-tight text-gray-900 text-center sm:text-left">
            Featured Cars
          </h2>

          <Button
            variant="ghost"
            className="flex items-center text-responsive-sm font-medium hover:text-red-600 transition touch-target mx-auto sm:mx-0"
            asChild
          >
            <Link href="/cars" className="flex items-center gap-2">
              View all
              <ArrowUpRight className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
            </Link>
          </Button>
        </div>

        <div className="grid-responsive-1-2-3 gap-4 sm:gap-6 md:gap-8">
          {cars?.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCars;

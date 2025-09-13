import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import { ArrowUpRight } from "lucide-react";

import CarCard from "../car-card";
import { getLatestSuv } from "@/app/actions/home";

const LatestSuv = async () => {
  const cars = await getLatestSuv();

  if (cars?.isLoading) {
    return (
      <div className="flex justify-center items-center py-20 text-lg font-medium text-gray-600">
        Loading SUVs...
      </div>
    );
  }

  if (cars?.error) {
    return (
      <div className="flex justify-center items-center py-20 text-lg font-medium text-red-600">
        Error: {cars?.error}
      </div>
    );
  }
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-10 gap-6">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
            Latest SUVs in Pakistan
          </h2>

          <Button
            variant="ghost"
            className="flex items-center text-lg font-medium hover:text-red-600 transition"
            asChild
          >
            <Link href="/cars" className="flex items-center gap-2">
              View all
              <ArrowUpRight className="h-6 w-6 md:h-7 md:w-7" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {cars?.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default LatestSuv;

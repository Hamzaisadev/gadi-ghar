import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import { ArrowUpRight } from "lucide-react";
import { featuredCars } from "@/lib/data";
import CarCard from "../car-card";

const FeaturedCars = () => {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Featured Cars</h2>
          <Button variant="ghost" className="flex items-center" asChild>
            <Link href="/cars">
              View all <ArrowUpRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredCars.map((car) => {
            return <CarCard key={car.id} car={car} />;
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCars;

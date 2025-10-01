import { carMakes } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import { ArrowUpRight } from "lucide-react";

const BrowseByMake = () => {
  return (
    <section className="section-spacing bg-gray-50">
      <div className="container-responsive mx-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8 md:mb-10 gap-4 sm:gap-6">
          <h2 className="text-responsive-xl font-bold tracking-tight text-gray-900 text-center sm:text-left">
            Browse by Make
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

        <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-6">
          {carMakes.map((make) => {
            return (
              <Link
                key={make.name}
                href={`/cars?make=${make.name}`}
                className="bg-white rounded-lg shadow-sm hover:shadow-md p-3 sm:p-4 text-center transition cursor-pointer touch-target group"
              >
                <div className="h-12 sm:h-14 md:h-16 w-auto mx-auto mb-2 sm:mb-3 relative group-hover:scale-105 transition-transform">
                  <Image
                    src={make.image}
                    alt={make.name}
                    fill
                    style={{ objectFit: "contain" }}
                    sizes="(max-width: 640px) 120px, (max-width: 768px) 140px, 160px"
                  />
                </div>
                <h3 className="text-xs sm:text-sm md:text-base font-medium text-gray-800 truncate">{make.name}</h3>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default BrowseByMake;

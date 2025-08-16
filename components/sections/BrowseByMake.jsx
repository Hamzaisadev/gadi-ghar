import { carMakes } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import { ArrowUpRight } from "lucide-react";

const BrowseByMake = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-10 gap-6">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
            Browse by Make
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

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {carMakes.map((make) => {
            return (
              <Link
                key={make.name}
                href={`/cars?make=${make.name}`}
                className="bg-white rounded-lg shadow p-4 text-center hover:shadow-md transition cursor-pointer"
              >
                <div className="h-16 w-auto mx-auto m-2 relative">
                  <Image
                    src={make.image}
                    alt={make.name}
                    fill
                    style={{ objectFit: "contain" }}
                  />
                </div>
                <h3 className="font-medium">{make.name}</h3>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default BrowseByMake;

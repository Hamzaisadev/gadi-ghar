import React from "react";
import { Button } from "../ui/button";
import { bodyTypes } from "@/lib/data";
import Link from "next/link";
import { ArrowUpRight, ChevronRight } from "lucide-react";
import Image from "next/image";

const BrowseByType = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-10 gap-6">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
            Browse by Body Type
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {bodyTypes.map((type) => {
            return (
              <Link
                key={type.name}
                href={`/cars?bodyType=${type.name}`}
                className="relative group cursor-pointer"
              >
                <div className="overflow-hidden rounded-lg flex justify-center h-40 mb-4 relative shadow hover:shadow-md transition">
                  <Image
                    src={type.image}
                    alt={type.name}
                    fill
                    className="object-cover group-hover:scale-105 transition duration-300"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent rounded-lg flex items-end">
                  <h3 className="text-white text-xl font-bold pl-4 pb-4">
                    {type.name}
                  </h3>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default BrowseByType;

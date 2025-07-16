import { carMakes } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import { ArrowUpRight } from "lucide-react";

const BrowseByMake = () => {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Browse by Make</h2>
          <Button variant="ghost" className="flex items-center" asChild>
            <Link href="/cars">
              View all <ArrowUpRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
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

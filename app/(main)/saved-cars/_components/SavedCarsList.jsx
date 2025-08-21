import CarCard from "@/components/car-card";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import Link from "next/link";
import React from "react";

const SavedCarsList = ({ initialData }) => {
  if (!initialData?.data || initialData?.data?.length === 0) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center text-center p-8 border rounded-lg bg-gray-500">
        <div className="bg-gray-200 p-4 rounded-full mb-4">
          <Heart className="h-8 w-8 text-car-red " />
        </div>
        <h3 className="text-2xl font-bold mb-2">No saved cars found</h3>
        <p className="text-gray-500 mb-4">You have not saved any cars yet.</p>
        <Button className="bg-car-red hover:bg-car-red-dark text-white">
          <Link href="/cars">Explore Cars</Link>
        </Button>
      </div>
    );
  }
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {initialData?.data.map((car) => (
          <CarCard key={car.id} car={{ ...car, wishlisted: true }} />
        ))}
      </div>
    </div>
  );
};

export default SavedCarsList;

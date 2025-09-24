import React from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import SavedCarsList from "./_components/SavedCarsList";
import { getSavedCars } from "@/app/actions/car-listing";
const SavedCarsPage = async () => {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in?redirect=/saved-cars");
    }
    
    const savedCarsResult = await getSavedCars();
  return (
    <div className="container mx-auto px-4 pt-32 pb-12 lg:pt-40 lg:pb-32">
      <h1 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-car-red to-car-red-dark bg-clip-text text-transparent mb-6 py-5">
        Saved Cars
          </h1>
          <SavedCarsList initialData={savedCarsResult}/>
    </div>
  );
};

export default SavedCarsPage;

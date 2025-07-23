import React from "react";
import AddCarForm from "./_components/AddCarForm";
import PageWrapper from "@/components/utils/pageWrapper";
import { Car } from "lucide-react";

export const metadata = {
  title: "Add Car | Gadi Ghar Admin",
  description: "Add a new car to the Gadi Ghar inventory",
};

const AddCarPage = () => {
  return (
    <PageWrapper className="p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-r from-red-700 via-red-600 to-red-500 shadow-lg">
              <Car className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-6xl font-bold bg-gradient-to-r from-red-700 via-red-600 to-red-500 bg-clip-text text-transparent">
              Add New Vehicle
            </h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Expand your inventory with our intelligent car management system.
            Choose between manual entry or AI-powered extraction for
            lightning-fast data input.
          </p>
        </div>
      </div>
      <AddCarForm />
    </PageWrapper>
  );
};

export default AddCarPage;

import React from "react";
import CarList from "./_components/CarList";
import PageWrapper from "@/components/utils/pageWrapper";

export const metadata = {
  title: "Cars | Gadi Ghar Admin",
  description: "Manage and view all cars in the Gadi Ghar inventory",
};

const CarsPage = () => {
  return (
    <PageWrapper className="p-6">
      <CarList />
    </PageWrapper>
  );
};

export default CarsPage;

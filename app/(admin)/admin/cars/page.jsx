import React from "react";
import CarList from "./_components/CarList";
import AddCarForm from "./_components/AddCarForm";

export const metadata = {
  title: "Cars | Gadi Ghar Admin",
  description: "Manage and view all cars in the Gadi Ghar inventory",
};

const CarsPage = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Cars Managment</h1>
      <AddCarForm />
    </div>
  );
};

export default CarsPage;

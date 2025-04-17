import React from "react";

export const metadata = {
  title: "Add Car | Gadi Ghar Admin",
  description: "Add a new car to the Gadi Ghar inventory",
};

const AddCarPage = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Add New Car</h1>
      <CarList />
    </div>
  );
};

export default AddCarPage;

import React from "react";
import { getCarById } from "@/app/actions/car-listing";
import NotFoundPage from "@/app/not-found";
import CarDetails from "./_components/CarDetails";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const result = await getCarById(id);

  if (!result.success) {
    return {
      title: "Car not found",
      description: "Car not found",
    };
  }

  const car = result.data;

  return {
    title: `${car.year} ${car.make} ${car.model} | Gadi Ghar`,
    description: car.description.substring(0, 150),
    openGraph: {
      images: car.images?.[0] ? [car.images[0]] : "/screenshot-desktop.png",
    },
  };
}

const CarPage = async ({ params }) => {
  const { id } = await params;
  const result = await getCarById(id);
  if (!result.success) {
    return <NotFoundPage />;
  }

  return (
    <div className="bg-background p-8 py-12 lg:py-32">
      <CarDetails car={result.data} testDriveInfo={result.data.testDriveInfo} />
    </div>
  );
};

export default CarPage;

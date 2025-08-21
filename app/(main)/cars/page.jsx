import { getCarFilters } from "@/app/actions/car-listing";

import CarFilters from "./_components/car_filter";
import CarListings from "./_components/car_listing";

export const metadata = {
  title: "Cars | Gadi Ghar",
  description: "Browse our collection of cars",
};

const CarPage = async () => {
  const filterData = await getCarFilters();
  return (
    <section className="bg-background py-12 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-car-red to-car-red-dark bg-clip-text text-transparent mb-6 py-5">
            Browse Our Cars
          </h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-80 flex-shrink-0">
            {" "}
            {/*filters*/}
            <CarFilters filters={filterData.data} />
          </div>
          <div className="flex-1">
            {/* listing */}
            <CarListings />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CarPage;

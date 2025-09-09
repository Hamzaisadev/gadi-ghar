import { getCarFilters } from "@/app/actions/car-listing";

import AdvancedCarFilters from "./_components/AdvancedCarFilters";
import CarListings from "./_components/car_listing";


export const metadata = {
  title: "Cars | Gadi Ghar",
  description: "Browse our collection of cars",
};

const CarPage = async () => {
  const filterData = await getCarFilters();
  
  if (!filterData?.success || !filterData?.data) {
    return (
      <section className="bg-background py-12 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-car-red to-car-red-dark bg-clip-text text-transparent mb-6 py-5">
              Browse Our Cars
            </h1>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md mx-auto">
              <p className="text-red-600">Failed to load search filters.</p>
              <p className="text-red-500 text-sm mt-2">Please refresh the page or try again later.</p>
            </div>
          </div>
          
          {/* Still show car listings without advanced filters */}
          <div className="mt-8">
            <CarListings />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-background py-12 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-4xl mx-auto mb-8">
          <h1 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-car-red to-car-red-dark bg-clip-text text-transparent mb-6 py-5">
            Browse Our Cars
          </h1>
        </div>

        <div className="space-y-8">
          {/* Filters Bar */}
          <div className="w-full">
            <AdvancedCarFilters filterData={filterData.data} />
          </div>
          
          {/* Car Listings */}
          <div className="w-full">
            <CarListings filterData={filterData.data} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CarPage;

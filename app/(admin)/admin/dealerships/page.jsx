import PageWrapper from "@/components/utils/pageWrapper";
import DealershipManagement from "./_components/DealershipManagement";

export const metadata = {
  title: "Dealerships | Gadi Ghar Admin",
  description: "Manage all dealerships in the Gadi Ghar system",
};

const DealershipsPage = () => {
  return (
    <PageWrapper className="space-y-6 p-6 min-h-screen pb-24">
      <div>
        <h1 className="text-4xl m-2 font-bold bg-gradient-to-r from-car-red to-car-red-dark bg-clip-text text-transparent">
          Dealership Management
        </h1>
        <p className="text-car-gray text-lg">
          Manage all your dealerships and their working hours
        </p>
      </div>
      <DealershipManagement />
    </PageWrapper>
  );
};

export default DealershipsPage;

import PageWrapper from "@/components/utils/pageWrapper";
import DealershipApplications from "./_components/DealershipApplications";

export const metadata = {
  title: "Dealership Applications | Gadi Ghar Admin",
  description: "Review and manage dealership applications",
};

const ApplicationsPage = () => {
  return (
    <PageWrapper className="space-y-6 p-6 min-h-screen pb-24">
      <div>
        <h1 className="text-4xl m-2 font-bold bg-gradient-to-r from-car-red to-car-red-dark bg-clip-text text-transparent">
          Dealership Applications
        </h1>
        <p className="text-car-gray text-lg">
          Review and manage dealership partnership applications
        </p>
      </div>
      <DealershipApplications />
    </PageWrapper>
  );
};

export default ApplicationsPage;

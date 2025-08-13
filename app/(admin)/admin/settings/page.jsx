import PageWrapper from "@/components/utils/pageWrapper";
import SettingFormPage from "./_components/Setting-FormPage";

export const metadata = {
  title: "Settings | Gadi Ghar Admin",
  description: "Manage and view all cars in the Gadi Ghar inventory",
};

const SettingsPage = () => {
  return (
    <PageWrapper className="space-y-6 p-6 min-h-screen pb-24">
      <div>
        <h1 className="text-4xl m-2 font-bold bg-gradient-to-r from-car-red to-car-red-dark bg-clip-text text-transparent">
          Settings
        </h1>
        <p className="text-car-gray text-lg">Manage your settings</p>
      </div>
      <SettingFormPage />
    </PageWrapper>
  );
};

export default SettingsPage;

import React from "react";
import { auth } from "@clerk/nextjs/server";
import TestDriveForm from "./_components/test_drive_form";
import { CalendarIcon } from "lucide-react";
import { getCarById } from "@/app/actions/car-listing";

export const metadata = {
  title: "Book Test Drive | Gadi Ghar",
  description:
    "Experience the thrill of driving a new car on a test drive. Our test drives are designed to give you a feel for the car's performance and handling.",
  keywords:
    "test drive, car test drive, car driving experience, Gadi Ghar, test drive experience",
};

const TestDrive = async ({ params }) => {
  const { userId } = auth();
  const { id } = await params;
  const result = await getCarById(id);

  if (!result.success) {
    return <NotFoundPage />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100/50">
      {/* Header Section with proper navbar spacing */}
      <div className="bg-white border-b border-slate-200/60 shadow-sm pt-20 md:pt-24">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center gap-4 max-w-3xl mx-auto">
            <div className="flex-shrink-0">
              <div className="bg-gradient-to-br from-car-red to-car-red-dark p-4 rounded-2xl shadow-lg">
                <CalendarIcon className="h-8 w-8 text-white" />
              </div>
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                Book Your
                <span className="text-car-red"> Test Drive</span>
              </h1>
              <p className="text-lg text-gray-600 mt-2 max-w-md">
                Experience the thrill of driving your dream car with our premium test drive service
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 lg:py-12">
        <TestDriveForm
          car={result.data}
          testDriveInfo={result.data.testDriveInfo}
        />
      </div>
    </div>
  );
};

export default TestDrive;

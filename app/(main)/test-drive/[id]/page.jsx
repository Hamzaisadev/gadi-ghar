import React from "react";
import { auth } from "@clerk/nextjs/server";

export const metadata = {
  title: "Book Test Drive | Gadi Ghar",
  description:
    "Experience the thrill of driving a new car on a test drive. Our test drives are designed to give you a feel for the car's performance and handling.",
  keywords:
    "test drive, car test drive, car driving experience, Gadi Ghar, test drive experience",
};

const TestDrive = ({ params }) => {
  const { userId } = auth();

  return (
    <section className="bg-background py-12 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-4xl mx-auto mb-8">
          <h1 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-car-red to-car-red-dark bg-clip-text text-transparent mb-6 py-5">
            Book a Test Drive
          </h1>
        </div>
      </div>
    </section>
  );
};

export default TestDrive;

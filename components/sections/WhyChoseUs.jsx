import { Car, Calendar, Shield, CheckCircle, Users, Clock } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import { SignedOut } from "@clerk/nextjs";

const WhyChooseUs = () => {
  const features = [
    {
      icon: Car,
      title: "Nationwide Coverage",
      description:
        "From Karachi to Lahore, Islamabad to Faisalabad - access Pakistan's largest verified car inventory across all major cities.",
      gradient: "from-red-500 to-red-600",
    },
    {
      icon: Calendar,
      title: "Instant Test Drives",
      description:
        "Book test drives online and get confirmed within 2 hours. Available across all Pakistani cities with flexible timings.",
      gradient: "from-red-600 to-red-700",
    },
    {
      icon: Shield,
      title: "Pakistani Bank Financing",
      description:
        "Instant auto loan approvals from HBL, UBL, Meezan Bank, and Bank Alfalah with competitive rates tailored for Pakistan.",
      gradient: "from-red-700 to-red-800",
    },
    {
      icon: CheckCircle,
      title: "Complete Documentation",
      description:
        "Full assistance with registration, transfer, and Excise & Taxation procedures across all provinces of Pakistan.",
      gradient: "from-red-500 to-red-700",
    },
    {
      icon: Users,
      title: "Multilingual Support",
      description:
        "Expert support team fluent in Urdu, English, and regional languages to serve all Pakistani customers efficiently.",
      gradient: "from-red-600 to-red-800",
    },
    {
      icon: Clock,
      title: "AI-Powered Matching",
      description:
        "Upload any car image and instantly find similar vehicles, get market prices, and connect with verified Pakistani dealers.",
      gradient: "from-red-700 to-red-900",
    },
  ];

  return (
    <>
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-32 h-32 bg-red-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-black rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-red-300 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Header Section */}
          <div className="text-center mb-16">
            <div className="inline-block mb-4">
              <span className="bg-red-100 text-red-600 px-4 py-2 rounded-full text-sm font-semibold tracking-wide uppercase">
                Why Choose Us
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-6 leading-tight">
              Why Choose{" "}
              <span className="text-red-600 relative">
                Gadi Ghar
                <div className="absolute bottom-0 left-0 w-full h-1 bg-red-600 rounded-full transform scale-x-0 animate-[scale-x_1s_ease-out_0.5s_forwards] origin-left"></div>
              </span>
            </h2>
            <p className="text-gray-600 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
              Pakistan's most trusted automotive platform with nationwide coverage, local expertise, and comprehensive services tailored for Pakistani car buyers
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
              >
                {/* Card background gradient on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>

                {/* Icon container */}
                <div className="relative z-10 mb-6">
                  <div
                    className={`bg-gradient-to-r ${feature.gradient} text-white rounded-2xl w-16 h-16 flex items-center justify-center mx-auto transform group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                  >
                    <feature.icon className="h-8 w-8" />
                  </div>
                </div>

                {/* Content */}
                <div className="relative z-10 text-center">
                  <h3 className="text-xl font-bold mb-4 text-black group-hover:text-red-600 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                    {feature.description}
                  </p>
                </div>

                {/* Decorative corner element */}
                <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-red-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA Section */}
      <div className="my{/* Bottom CTA Section */}-16 text-center ">
        <div className="bg-gradient-to-r from-red-600 to-red-700 text-white rounded-2xl p-8 md:p-12 shadow-2xl">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Find Your Dream Car?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied customers who found their perfect
              vehicle through our platform.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/cars">View All Cars</Link>
              </Button>
              <SignedOut>
                <Button size="lg" asChild>
                  <Link href="/sign-up">Sign Up Now</Link>
                </Button>
              </SignedOut>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default WhyChooseUs;

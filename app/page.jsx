import BrowseByMake from "@/components/sections/BrowseByMake";
import BrowseByType from "@/components/sections/BrowseByType";
import FeaturedCars from "@/components/sections/FeaturedCars";
import GadiGharInfo from "@/components/sections/GadiGharInfo";
import HeroSection from "@/components/sections/HeroSection";
import WhyChooseUs from "@/components/sections/WhyChoseUs";

import PageWrapper from "@/components/utils/pageWrapper";

import ContactSec from "@/components/sections/ContactSec";
import CarReservation from "@/components/sections/carReservation";
import AICarMatching from "@/components/sections/AICarMatching";
import BestHonda from "@/components/sections/bestHonda";
import LatestSuv from "@/components/sections/latestSuv";
import ElectricCarsSection from "@/components/sections/ElectricCarsSection";

export default function Home() {
  return (
    <PageWrapper>
      <div className="bg-white flex flex-col">
        <HeroSection />
        <FeaturedCars />
        <AICarMatching />
        <BestHonda />
        <BrowseByType />
        <GadiGharInfo />
        <LatestSuv />
        <CarReservation />
        <ElectricCarsSection />
        <BrowseByMake />
        <WhyChooseUs />
        <ContactSec />
      </div>
    </PageWrapper>
  );
}

import CarCard from "@/components/car-card";
import BrowseByMake from "@/components/sections/BrowseByMake";
import BrowseByType from "@/components/sections/BrowseByType";
import BuySellCard from "@/components/sections/Buy&SellCard";
import FeaturedCars from "@/components/sections/FeaturedCars";
import GadiGharInfo from "@/components/sections/GadiGharInfo";
import HeroSection from "@/components/sections/HeroSection";
import WhyChooseUs from "@/components/sections/WhyChoseUs";

import PageWrapper from "@/components/utils/pageWrapper";

import ContactSec from "@/components/sections/ContactSec";
import CarReservation from "@/components/sections/carReservation";
import AICarMatching from "@/components/sections/AICarMatching";

export default function Home() {
  return (
    <PageWrapper>
      <div className="bg-white flex flex-col">
        <HeroSection />
        <AICarMatching />
        <BrowseByType />
        <GadiGharInfo />
        <BuySellCard />
        <FeaturedCars />
        <CarReservation />
        <BrowseByMake />
        <WhyChooseUs />
        <ContactSec />
      </div>
    </PageWrapper>
  );
}

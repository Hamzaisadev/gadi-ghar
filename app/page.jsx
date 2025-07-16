import CarCard from "@/components/car-card";
import BrowseByMake from "@/components/sections/BrowseByMake";
import BrowseByType from "@/components/sections/BrowseByType";
import BuySellCard from "@/components/sections/Buy&SellCard";
import FeaturedCars from "@/components/sections/FeaturedCars";
import GadiGharInfo from "@/components/sections/GadiGharInfo";
import HeroSection from "@/components/sections/HeroSection";
import Reviews from "@/components/sections/Reviews";
import WhyChooseUs from "@/components/sections/WhyChoseUs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import PageWrapper from "@/components/utils/pageWrapper";
import { bodyTypes, carMakes, faqItems, featuredCars } from "@/lib/data";
import { SignedOut } from "@clerk/nextjs";

import { Calendar, Car, ChevronRight, Shield } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import ContactPage from "./(main)/contact/page";
import ContactSec from "@/components/sections/ContactSec";

export default function Home() {
  return (
    <PageWrapper>
      <div className="bg-white flex flex-col">
        <HeroSection />
        <BrowseByType />
        <GadiGharInfo />
        <BuySellCard />
        <FeaturedCars />
        <Reviews />
        <BrowseByMake />
        <WhyChooseUs />
        <ContactSec />

        

       

       

      </div>
    </PageWrapper>
  );
}

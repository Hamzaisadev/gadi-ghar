import React from "react";
import HomeSearch from "../home-search";

const HeroSection = () => {
  return (
    <section className="relative section-spacing-lg bg-one min-h-[100vh] sm:min-h-[90vh] md:min-h-[850px] flex items-center">
      <div className="container-responsive mx-auto text-center w-full">
        <div className="max-w-7xl mx-auto">
          {/* Main heading with responsive typography */}
          <h1 className="bebas text-red-700 font-bold drop-shadow-[0_8px_30px_rgba(0,0,0,0.25)] mb-2 sm:mb-4
            text-[60px] leading-[70px] tracking-[6px]
            xs:text-[70px] xs:leading-[80px] xs:tracking-[7px]
            sm:text-[90px] sm:leading-[100px] sm:tracking-[8px]
            md:text-[120px] md:leading-[130px] md:tracking-[9px]
            lg:text-[140px] lg:leading-[150px] lg:tracking-[10px]
            xl:text-[160px] xl:leading-[170px] xl:tracking-[12px]">
            Gadi Ghar 
          </h1>
          
          {/* Subtitle with responsive typography */}
          <h2 className="bebas text-red-800 font-bold drop-shadow-[0_8px_30px_rgba(0,0,0,0.30)] mb-4 sm:mb-6 md:mb-8
            text-[18px] leading-[24px] tracking-[2px]
            xs:text-[24px] xs:leading-[30px] xs:tracking-[3px]
            sm:text-[35px] sm:leading-[42px] sm:tracking-[4px]
            md:text-[48px] md:leading-[56px] md:tracking-[5px]
            lg:text-[60px] lg:leading-[70px] lg:tracking-[6px]
            xl:text-[75px] xl:leading-[85px] xl:tracking-[7px]">
             <span className="text-white">Knows What You're Looking For</span>
          </h2>
          
          {/* Description with responsive text */}
          <p className="text-white mb-6 sm:mb-8 md:mb-10 mx-auto max-w-sm sm:max-w-md md:max-w-2xl lg:max-w-3xl
            text-sm leading-5 px-4
            xs:text-base xs:leading-6
            sm:text-lg sm:leading-7 sm:px-0
            md:text-xl md:leading-8
            lg:text-2xl lg:leading-9">
            Upload a photo or search by name – we'll match you with your dream car.
          </p>
        </div>
        
        {/* Search component with responsive container */}
        <div className="max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-5xl mx-auto px-4 sm:px-0">
          <HomeSearch />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

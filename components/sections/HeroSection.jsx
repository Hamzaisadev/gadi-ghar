import React from "react";
import HomeSearch from "../home-search";

const HeroSection = () => {
  return (
    <section className="relative py-16 md:py-28 bg-one min-h-[850px]">
      <div className=" mx-auto text-center">
        <div className="">
       
          <h1 className="leading-[150px] tracking-[10px] bebas text-[80px] sm:text-[130px] md:text-[150px] lg:text-[160px] pt-10 md:pt-10 lg:pt-10 text-red-700 font-bold drop-shadow-[0_8px_30px_rgba(0,0,0,0.25)]">
            Gadi Ghar 
          </h1>
          <h1 className="tracking-[5px] leading-[100px] bebas text-[25px] sm:text-[50px] md:text-[60px] lg:text-[75px] my-0 text-red-800 font-bold drop-shadow-[0_8px_30px_rgba(0,0,0,0.30)]">
             <span className="text-white"> Knows What You’re Looking For </span> {" "}
          </h1>
          <p className="text-[15px] sm:text-[17px] md:text-[15px] lg:text-[20px] text-white my-8 max-w-2xl mx-auto">
            Upload a photo or search by name we’ll match you with your dream
            car.
          </p>
        </div>
        <div className="max-w-5xl mx-auto ">
          <HomeSearch />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

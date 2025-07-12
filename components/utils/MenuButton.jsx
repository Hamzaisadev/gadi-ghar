import React from "react";
import { motion } from "framer-motion";
import { Clock, CrossIcon, Menu, PanelTopCloseIcon, X } from "lucide-react";
import { Button } from "../ui/button";

export default function MenuButton({ isActive, toggleMenu }) {
  return (
    <>
      <div
        className=" hidden md:block
     top-0 right-0 w-[100px] h-[35px] cursor-pointer rounded-md overflow-hidden"
      >
        <motion.div
          className="relative w-full h-full"
          animate={{ top: isActive ? "-100%" : "0%" }}
          transition={{
            duration: 0.5,
            type: "tween",
            ease: [0.76, 0, 0.24, 1],
          }}
          style={{ position: "relative" }}
        >
          <div
            className="w-full h-full flex justify-center items-center bg-white text-white hover:[&_p:nth-of-type(1)]:-translate-y-full hover:[&_p:nth-of-type(1)]:opacity-0 hover:[&_p:nth-of-type(2)]:opacity-100 hover:[&_div.perspectiveText]:rotate-x-90 transition-all duration-[750ms] ease-[cubic-bezier(0.76,0,0.24,1)]"
            onClick={toggleMenu}
          >
            <Menu className="text-black px-1"  />
            <PerspectiveText label="Menu" />
          </div>
          <div
            className="w-full h-full flex items-center justify-center bg-black hover:[&_p:nth-of-type(1)]:-translate-y-full hover:[&_p:nth-of-type(1)]:opacity-0 hover:[&_p:nth-of-type(2)]:opacity-100 hover:[&_div.perspectiveText]:rotate-x-90 transition-all duration-[750ms] ease-[cubic-bezier(0.76,0,0.24,1)]"
            onClick={toggleMenu}
          >
            <X className="text-white px-1"/>
            <PerspectiveText label="Close" textColor="text-white" />
          </div>
        </motion.div>
      </div>
      <div className="block md:hidden">
        <motion.div
          className="relative w-full h-full"
          animate={{ top: isActive ? "-100%" : "0%" }}
          transition={{
            duration: 0.5,
            type: "tween",
            ease: [0.76, 0, 0.24, 1],
          }}
          style={{ position: "relative" }}
        >
          <Button variant="ghost" onClick={toggleMenu} className='px-1'>
            {!isActive ? <Menu /> : <X />}
          </Button>
        </motion.div>
      </div>
    </>
  );
}

function PerspectiveText({ label, textColor = "text-black" }) {
  return (
    <div className="perspectiveText flex flex-col justify-center items-center w-[50%] h-full transition-transform duration-[750ms] ease-[cubic-bezier(0.76,0,0.24,1)]">
      <Button
        variant="ghost"
        className={` transition-all duration-[750ms] ease-[cubic-bezier(0.76,0,0.24,1)] pointer-events-none ${textColor} px-0`}
      >
        {label}
      </Button>
      <Button
        variant="ghost"
        className={` absolute opacity-0 transform rotate-x-[-90deg] translate-y-[9px] transition-all duration-[750ms] ease-[cubic-bezier(0.76,0,0.24,1)] pointer-events-none ${textColor}`}
      >
        <span>{label}</span>
      </Button>
    </div>
  );
}

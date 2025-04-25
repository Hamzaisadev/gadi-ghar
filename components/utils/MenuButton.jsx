import React from "react";
import { motion } from "framer-motion";

export default function MenuButton({ isActive, toggleMenu }) {
  return (
    <div
      className="
     top-0 right-0 w-[100px] h-[35px] cursor-pointer rounded-md overflow-hidden"
    >
      <motion.div
        className="relative w-full h-full"
        animate={{ top: isActive ? "-100%" : "0%" }}
        transition={{ duration: 0.5, type: "tween", ease: [0.76, 0, 0.24, 1] }}
        style={{ position: "relative" }}
      >
        <div
          className="w-full h-full flex bg-white text-white hover:[&_p:nth-of-type(1)]:-translate-y-full hover:[&_p:nth-of-type(1)]:opacity-0 hover:[&_p:nth-of-type(2)]:opacity-100 hover:[&_div.perspectiveText]:rotate-x-90 transition-all duration-[750ms] ease-[cubic-bezier(0.76,0,0.24,1)]"
          onClick={toggleMenu}
        >
          <PerspectiveText label="Menu" />
        </div>
        <div
          className="w-full h-full flex bg-black hover:[&_p:nth-of-type(1)]:-translate-y-full hover:[&_p:nth-of-type(1)]:opacity-0 hover:[&_p:nth-of-type(2)]:opacity-100 hover:[&_div.perspectiveText]:rotate-x-90 transition-all duration-[750ms] ease-[cubic-bezier(0.76,0,0.24,1)]"
          onClick={toggleMenu}
        >
          <PerspectiveText label="Close" textColor="text-lime-200" />
        </div>
      </motion.div>
    </div>
  );
}

function PerspectiveText({ label, textColor = "text-black" }) {
  return (
    <div className="perspectiveText flex flex-col justify-center items-center w-full h-full transition-transform duration-[750ms] ease-[cubic-bezier(0.76,0,0.24,1)]">
      <p
        className={`uppercase transition-all duration-[750ms] ease-[cubic-bezier(0.76,0,0.24,1)] pointer-events-none ${textColor}`}
      >
        {label}
      </p>
      <p
        className={`uppercase absolute opacity-0 transform rotate-x-[-90deg] translate-y-[9px] transition-all duration-[750ms] ease-[cubic-bezier(0.76,0,0.24,1)] pointer-events-none ${textColor}`}
      >
        <span>{label}</span>
      </p>
    </div>
  );
}

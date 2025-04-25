"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import MenuNavbar from "./MenuNavbar/MenuNavbar";
import MenuButton from "./MenuButton";

const menuVariants = {
  open: {
    width: "480px",
    height: "600px",
    top: "-25px",
    right: "-25px",
    transition: { duration: 0.75, type: "tween", ease: [0.76, 0, 0.24, 1] },
    opacity: 1,
    pointerEvents: "auto",
  },
  closed: {
    width: "100px",
    height: "40px",
    top: "0px",
    right: "0px",
    transition: {
      duration: 0.75,
      delay: 0.35,
      type: "tween",
      ease: [0.76, 0, 0.24, 1],
    },
    opacity: 0,
    pointerEvents: "none",
  },
};

const NavbarMenu = () => {
  const [isActive, setIsActive] = useState(false);
  return (
    <div className="relative">
      <motion.div
        className="bg-[#c9fd74] rounded-[25px] absolute z-40"
        variants={menuVariants}
        animate={isActive ? "open" : "closed"}
        initial="closed"
        style={{ overflow: "hidden" }}
      >
        <AnimatePresence>{isActive && <MenuNavbar />}</AnimatePresence>
      </motion.div>
      <div className="relative z-50">
        <MenuButton
          isActive={isActive}
          toggleMenu={() => {
            setIsActive(!isActive);
          }}
        />
      </div>
    </div>
  );
};

export default NavbarMenu;

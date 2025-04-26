"use client";
import { useEffect, useRef, useState } from "react";
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
const mobMenuVariants = {
  open: {
    width: "400px",
    height: "600px",
    top: "-25px",
    right: "-105px",
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

  const lastScrollY = useRef(0);

  useEffect(() => {
    lastScrollY.current = window.scrollY;

    const menuClose = () => {
      const currentScrollY = window.scrollY;
      console.log("Scroll event fired", {
        currentScrollY,
        lastScrollY: lastScrollY.current,
      });
      if (currentScrollY > lastScrollY.current) {
        console.log("Scrolling down - closing menu");
        setIsActive(false);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", menuClose, { passive: true });
    return () => window.removeEventListener("scroll", menuClose);
  }, []);

  return (
    <div className="relative">
      <motion.div
        className="bg-[#f5f3f3] rounded-[25px] absolute z-40"
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
const MobNavbarMenu = () => {
  const [isActive, setIsActive] = useState(false);

  const lastScrollY = useRef(0);

  useEffect(() => {
    lastScrollY.current = window.scrollY;

    const menuClose = () => {
      const currentScrollY = window.scrollY;
      console.log("Scroll event fired", {
        currentScrollY,
        lastScrollY: lastScrollY.current,
      });
      if (currentScrollY > lastScrollY.current) {
        console.log("Scrolling down - closing menu");
        setIsActive(false);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", menuClose, { passive: true });
    return () => window.removeEventListener("scroll", menuClose);
  }, []);

  return (
    <div className="relative">
      <motion.div
        className="bg-[#f5f3f3] rounded-[25px] absolute z-40"
        variants={mobMenuVariants}
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

export { NavbarMenu, MobNavbarMenu };

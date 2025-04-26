"use client";

import React from "react";
import { footerLinks, links } from "./navbarData";
import TransitionLink from "../TransitionLink";
import { perspective, slideIn } from "./navbarAnim";
import { motion } from "framer-motion";
import Link from "next/link";

const MenuNavbar = () => {
  return (
    <div className="flex flex-col justify-between h-full pt-[100px] pr-[40px] pb-[50px] pl-[40px]">
      <div className="flex flex-col gap-[10px]">
        {links.map((link, i) => {
          const { title, href } = link;
          return (
            <div key={`b_${i}`} className="perspective-custom">
              <motion.div
                custom={i}
                variants={perspective}
                initial="initial"
                animate="enter"
                exit="exit"
              >
                <TransitionLink href={href}>
                  <span className="no-underline text-black text-[46px]">
                    {title}
                  </span>
                </TransitionLink>
              </motion.div>
            </div>
          );
        })}
      </div>
      <motion.div className="flex flex-wrap gap-6">
        {footerLinks.map((link, i) => {
          const { icon, href } = link;
          return (
            <motion.div
              variants={slideIn}
              custom={i}
              initial="initial"
              animate="enter"
              exit="exit"
              key={`f_${i}`}
            >
              <Link href={href}>
                <span className="">
                  {React.cloneElement(icon, { size: 30, color: "black" })}
                </span>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default MenuNavbar;

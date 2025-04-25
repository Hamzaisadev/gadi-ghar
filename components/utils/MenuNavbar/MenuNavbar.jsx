"use client";

import React from "react";
import TransactionLink from "../TransitionLink";
import { links } from "./navbarData";
import TransitionLink from "../TransitionLink";
import { perspective } from "./navbarAnim";
import { motion } from "framer-motion";

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
    </div>
  );
};

export default MenuNavbar;

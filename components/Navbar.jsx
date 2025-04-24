"use client";

import {
  AuthenticateWithRedirectCallback,
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/nextjs";
import { ArrowLeft, CarFront, Heart, Layout, Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import TransactionLink from "./utils/TransactionLink";

const Navbar = ({ user, isAdminPage = false }) => {
  // true = navbar visible; false = navbar hidden
  const [isVisible, setIsVisible] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // hold the last scroll position to detect direction
  const lastScrollY = useRef(0);

  useEffect(() => {
    // initialize lastScrollY on mount
    lastScrollY.current = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < lastScrollY.current) {
        // scrolled up → show
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY.current) {
        // scrolled down → hide
        setIsVisible(false);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isAdmin = user?.role === "ADMIN";

  return (
    <nav
      className={`
        fixed top-0 left-0 w-full z-50
        transform transition-transform duration-300
        py-4 md:py-5               ← add some vertical padding!
        ${isVisible ? "translate-y-0" : "-translate-y-full"}
      `}
    >
      <div
        className=" bg-white container mx-auto py-4 rounded-xl
       px-4 md:px-8"
      >
        <div className="flex justify-between items-center">
          <Link href={isAdminPage ? "/admin" : "/"} className="flex">
            <Image
              src={"/GariGharBlack.png"}
              alt="Gadi Ghar Logo"
              width={100}
              height={60}
              className="md:w-full w-44 object-contain"
            />
            {isAdminPage && (
              <span className="text-xs font-extralight">admin</span>
            )}
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            <TransactionLink href="/cars" className="nav-link font-medium">
              Cars
            </TransactionLink>
            <TransactionLink href="/blogs" className="nav-link font-medium">
              Blog
            </TransactionLink>
            <TransactionLink href="/about" className="nav-link font-medium">
              About
            </TransactionLink>

            <TransactionLink href="/contact" className="nav-link font-medium">
              Contact
            </TransactionLink>
            <Button className="btn-primary">Book Test Drive</Button>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-gray-700 focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu size={24} />
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 bg-white rounded-lg shadow-lg animate-in fade-in">
            <div className="flex flex-col space-y-4 pt-2 pb-3 px-4">
              <Link href="#" className="nav-link font-medium py-2">
                Home
              </Link>
              <Link href="#featured" className="nav-link font-medium py-2">
                Featured Cars
              </Link>
              <Link href="#about" className="nav-link font-medium py-2">
                About
              </Link>
              <Link href="#services" className="nav-link font-medium py-2">
                Services
              </Link>
              <Link href="#contact" className="nav-link font-medium py-2">
                Contact
              </Link>
              <Button className="btn-primary w-full">Book Test Drive</Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

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
import TransitionLink from "./utils/TransitionLink";
import MenuButton from "./utils/MenuButton";
import PageWrapper from "./utils/pageWrapper";
import NavbarMenu from "./utils/Menu";

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
    <PageWrapper>
      <nav
        className={`
        fixed top-0 left-0 w-full z-50
        transform transition-transform duration-300
        py-4 md:py-5               ← add some vertical padding!
        ${
          isVisible
            ? "translate-y-0 "
            : "-translate-y-full animate-pulse selection:"
        }
      `}
      >
        <div
          className=" shadow-[0px_-1px_17px_-1px_rgba(134,_118,_120,_0.61)] bg-white container mx-auto py-4 rounded-xl
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

            <div></div>

            {/* Desktop */}
            <div className="hidden md:flex items-center space-x-8">
              {isAdminPage ? (
                <>
                  <TransitionLink href="/">
                    <Button variant="outline">
                      <ArrowLeft size={18} />
                      <span>Back to app</span>
                    </Button>
                  </TransitionLink>
                </>
              ) : (
                <SignedIn>
                  {!isAdmin && (
                    <TransitionLink
                      href="/reservations"
                      className="text-gray-600 hover:text-blue-600 flex items-center gap-2"
                    >
                      <Button variant="outline">
                        <CarFront size={18} />
                        <span className="hidden md:inline">
                          My Reservations
                        </span>
                      </Button>
                    </TransitionLink>
                  )}
                  <TransitionLink href="/saved-cars">
                    <Button>
                      <Heart size={18} />
                      <span className="hidden md:inline">Saved Cars</span>
                    </Button>
                  </TransitionLink>

                  <NavbarMenu />
                  {isAdmin && (
                    <TransitionLink href="/admin">
                      <Button
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        <Layout size={18} />
                        <span className="hidden md:inline">Admin Portal</span>
                      </Button>
                    </TransitionLink>
                  )}
                </SignedIn>
              )}

              <SignedOut>
                <MenuButton />
                {!isAdminPage && (
                  <SignInButton forceRedirectUrl="/">
                    <Button variant="outline">Login</Button>
                  </SignInButton>
                )}
              </SignedOut>

              <SignedIn>
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "w-10 md:block hidden h-10",
                    },
                  }}
                />
              </SignedIn>
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
    </PageWrapper>
  );
};

export default Navbar;

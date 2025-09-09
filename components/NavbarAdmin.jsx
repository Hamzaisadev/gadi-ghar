"use client";

import {
  AuthenticateWithRedirectCallback,
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/nextjs";
import {
  ArrowLeft,
  CarFront,
  Heart,
  Layout,
  LogIn,
  Menu,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import TransitionLink from "./utils/TransitionLink";
import MenuButton from "./utils/MenuButton";
import PageWrapper from "./utils/pageWrapper";
import { NavbarMenu, MobNavbarMenu } from "./utils/Menu";

const NavbarAdmin = ({ user, isAdminPage = false }) => {
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
        transform transition-transform duration-1000
        py-4 md:py-5               ← add some vertical padding!
        ${
          isVisible
            ? "translate-y-0 "
            : "-translate-y-full animate-pulse selection:"
        }
      `}
      >
        <div
          className="  bg-black/10 backdrop-blur-[15px] border-neutral-400/20 container mx-auto py-4 rounded-xl
       px-4 md:px-8"
        >
          <div className="flex justify-between items-center">
            <Link href={isAdminPage ? "/admin" : "/"} className="flex">
              <Image
                src={"/GariGharBlack.png"}
                alt="Gadi Ghar Logo"
                width={100}
                height={60}
                className="md:w-44 w-36 object-contain"
                style={{ height: "auto" }}
              />
              {isAdminPage && (
                <span className="text-xs font-extralight">admin</span>
              )}
            </Link>

            {/* Desktop */}
            <div className="hidden md:flex items-center space-x-4">
              {isAdminPage ? (
                <>
                  <TransitionLink href="/">
                    <Button 
                      variant="outline" 
                      size="default"
                      priority="primary"
                      aria-label="Back to main application"
                    >
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
                      className="flex items-center"
                    >
                      <Button 
                        variant="outline" 
                        size="default"
                        priority="secondary"
                        aria-label="View my car reservations"
                      >
                        <CarFront size={18} />
                        <span className="hidden md:inline">
                          My Reservations
                        </span>
                      </Button>
                    </TransitionLink>
                  )}
                  <TransitionLink href="/saved-cars">
                    <Button 
                      variant="primary" 
                      size="default"
                      priority="primary"
                      aria-label="View saved cars"
                    >
                      <Heart size={18} />
                      <span className="hidden md:inline">Saved Cars</span>
                    </Button>
                  </TransitionLink>

                  <NavbarMenu />
                  {isAdmin && (
                    <TransitionLink href="/admin">
                      <Button
                        variant="secondary"
                        size="default"
                        priority="primary"
                        className="flex items-center gap-2"
                        aria-label="Access admin portal"
                      >
                        <Layout size={18} />
                        <span className="hidden md:inline">Admin Portal</span>
                      </Button>
                    </TransitionLink>
                  )}
                </SignedIn>
              )}

              <SignedOut>
                <NavbarMenu />
                {!isAdminPage && (
                  <SignInButton forceRedirectUrl="/">
                    <Button
                      variant="primary"
                      size="default"
                      priority="primary"
                      aria-label="Sign in to your account"
                    >
                      <User size={18} /> 
                      <span className="hidden sm:inline">Login</span>
                    </Button>
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
            <div className="md:hidden flex animate-in fade-in gap-x-2 items-center">
              {isAdminPage ? (
                <>
                  <TransitionLink href="/">
                    <Button 
                      variant="outline" 
                      size="default"
                      priority="primary"
                      aria-label="Back to main application"
                    >
                      <ArrowLeft size={18} />
                      <span className="sr-only sm:not-sr-only">Back</span>
                    </Button>
                  </TransitionLink>
                </>
              ) : (
                <SignedIn>
                  {!isAdmin && (
                    <TransitionLink
                      href="/reservations"
                      className="flex items-center"
                    >
                      <Button 
                        variant="outline" 
                        size="default"
                        priority="secondary"
                        aria-label="View my car reservations"
                      >
                        <CarFront size={18} />
                        <span className="sr-only">
                          My Reservations
                        </span>
                      </Button>
                    </TransitionLink>
                  )}
                  <TransitionLink href="/saved-cars">
                    <Button 
                      variant="primary" 
                      size="default"
                      priority="primary"
                      aria-label="View saved cars"
                    >
                      <Heart size={18} />
                      <span className="sr-only">Saved Cars</span>
                    </Button>
                  </TransitionLink>
                  <MobNavbarMenu />
                  {isAdmin && (
                    <TransitionLink href="/admin">
                      <Button
                        variant="secondary"
                        size="default"
                        priority="primary"
                        className="flex items-center gap-2"
                        aria-label="Access admin portal"
                      >
                        <Layout size={18} />
                        <span className="sr-only">Admin Portal</span>
                      </Button>
                    </TransitionLink>
                  )}
                </SignedIn>
              )}

              <SignedOut>
                <MobNavbarMenu />
                {!isAdminPage && (
                  <SignInButton forceRedirectUrl="/">
                    <Button
                      variant="outline"
                      className="bg-red-600 border-none text-white"
                    >
                      Login
                    </Button>
                  </SignInButton>
                )}
              </SignedOut>

              <SignedIn>
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "w-8 md:block  h-8",
                    },
                  }}
                />
              </SignedIn>
            </div>
          </div>
        </div>
      </nav>
    </PageWrapper>
  );
};

export default NavbarAdmin;

"use client";

import {
  AuthenticateWithRedirectCallback,
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  ClerkLoading,
} from "@clerk/nextjs";
import {
  ArrowLeft,
  Car,
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
import { usePathname } from "next/navigation";
import { checkUserApplicationStatus } from "@/app/actions/dealership";
import DealerButton from "./DealerButton";
import Notification from "./ui/notification";

const Navbar = ({ user, isAdminPage: isAdminPageProp = false }) => {
  // true = navbar visible; false = navbar hidden
  const [isVisible, setIsVisible] = useState(true); // Set to true to always show navbar
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showDealerButton, setShowDealerButton] = useState(true);
  const [applicationStatus, setApplicationStatus] = useState(null);
  const [previousStatus, setPreviousStatus] = useState(null);
  const [notification, setNotification] = useState({ isVisible: false, type: "info", title: "", message: "" });

  // hold the last scroll position to detect direction
  const lastScrollY = useRef(0);

  const pathname = usePathname();
  const isAdminPage = isAdminPageProp || pathname.startsWith("/admin");
  const isWishlistedPage =
    isAdminPageProp || pathname.startsWith("/saved-cars");
  const isReservationPage =
    isAdminPageProp || pathname.startsWith("/reservations");

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

  // Check if user has already applied for dealership
  useEffect(() => {
    const checkDealerStatus = async () => {
      if (user) {
        try {
          const result = await checkUserApplicationStatus();
          if (result.success) {
            const newStatus = result.data.status;
            setApplicationStatus(newStatus);
            
            // Check if status changed and show notification
            if (previousStatus && previousStatus !== newStatus) {
              showStatusChangeNotification(previousStatus, newStatus);
            }
            
            setPreviousStatus(newStatus);
            // Show button for all users except admins
            setShowDealerButton(true);
          }
        } catch (error) {
          console.error('Error checking dealer status:', error);
        }
      }
    };

    checkDealerStatus();
    
    // Set up polling every 30 seconds
    const interval = setInterval(checkDealerStatus, 30000);
    
    return () => clearInterval(interval);
  }, [user, previousStatus]);

  const showStatusChangeNotification = (oldStatus, newStatus) => {
    let type = "info";
    let title = "Application Status Updated";
    let message = "";

    switch (newStatus) {
      case "APPROVED":
        type = "success";
        message = "🎉 Your dealership application has been approved!";
        break;
      case "REJECTED":
        type = "error";
        message = "Your dealership application has been rejected.";
        break;
      case "REQUIRES_CHANGES":
        type = "warning";
        message = "Your application needs changes before approval.";
        break;
      case "UNDER_REVIEW":
        type = "pending";
        message = "Your application is now under review.";
        break;
      default:
        message = `Application status changed from ${oldStatus} to ${newStatus}`;
    }

    setNotification({
      isVisible: true,
      type,
      title,
      message
    });
  };

  const isAdmin = user?.role === "ADMIN";
  const isDealershipAdmin = user?.role === "DEALERSHIP_ADMIN";
  
  // Temporary fallback for testing - remove this later
  // if (!user) {
  //   console.debug('Navbar: No user found, showing login button only');
  // }
  

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
                    <Button variant="outline">
                      <ArrowLeft size={18} />
                      <span>Back to app</span>
                    </Button>
                  </TransitionLink>
                </>
              ) : (
                <>
                  <ClerkLoading>
                    {user ? (
                      <>
                        {(!isAdmin && !isDealershipAdmin) && (
                          <>
                            <TransitionLink
                              href={isReservationPage ? "/cars" : "/reservations"}
                            >
                              <Button variant="outline">
                                <CarFront size={18} />
                                <span className="hidden md:inline">
                                  {isReservationPage ? "Browse Cars" : "My Reservations"}
                                </span>
                              </Button>
                            </TransitionLink>
                            {showDealerButton && (
                              <DealerButton applicationStatus={applicationStatus} />
                            )}
                          </>
                        )}
                        <TransitionLink
                          href={isWishlistedPage ? "/cars" : "/saved-cars"}
                        >
                          <Button>
                            <Heart size={18} />
                            <span className="hidden md:inline">
                              {isWishlistedPage ? "Browse Cars" : "Saved Cars"}
                            </span>
                          </Button>
                        </TransitionLink>
                        <NavbarMenu />
                        {(isAdmin || isDealershipAdmin) && (
                          <TransitionLink href={isDealershipAdmin ? "/dealership" : "/admin"}>
                            <Button
                              variant="outline"
                              className="flex items-center gap-2"
                            >
                              <Layout size={18} />
                              <span className="hidden md:inline">
                                {isDealershipAdmin ? "Dealership Portal" : "Admin Portal"}
                              </span>
                            </Button>
                          </TransitionLink>
                        )}
                      </>
                    ) : (
                      <>
                        <NavbarMenu />
                        {!isAdminPage && (
                          <SignInButton forceRedirectUrl="/">
                            <Button
                              variant="outline"
                              className="bg-red-600 border-none text-white"
                            >
                              <User /> Login
                            </Button>
                          </SignInButton>
                        )}
                      </>
                    )}
                  </ClerkLoading>

                  <SignedIn>
                  {(!isAdmin && !isDealershipAdmin) && (
                    <>
                      <TransitionLink
                        href={isReservationPage ? "/cars" : "/reservations"}
                      >
                        <Button variant="outline">
                          <CarFront size={18} />
                          <span className="hidden md:inline">
                            {isReservationPage
                              ? "Browse Cars"
                              : "My Reservations"}
                          </span>
                        </Button>
                      </TransitionLink>
                      
                      {showDealerButton && (
                        <DealerButton applicationStatus={applicationStatus} />
                      )}
                    </>
                  )}
                  <TransitionLink
                    href={isWishlistedPage ? "/cars" : "/saved-cars"}
                  >
                    <Button>
                      <Heart size={18} />
                      <span className="hidden md:inline">
                        {isWishlistedPage ? "Browse Cars" : "Saved Cars"}
                      </span>
                    </Button>
                  </TransitionLink>

                  <NavbarMenu />
                  {(isAdmin || isDealershipAdmin) && (
                    <TransitionLink href={isDealershipAdmin ? "/dealership" : "/admin"}>
                      <Button
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        <Layout size={18} />
                        <span className="hidden md:inline">
                          {isDealershipAdmin ? "Dealership Portal" : "Admin Portal"}
                        </span>
                      </Button>
                    </TransitionLink>
                  )}
                </SignedIn>
                </>
              )}

              <SignedOut>
                <NavbarMenu />
                {!isAdminPage && (
                  <SignInButton forceRedirectUrl="/">
                    <Button
                      variant="outline"
                      className="bg-red-600 border-none text-white"
                    >
                      {" "}
                      <User /> Login
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
            <div className="md:hidden flex  animate-in fade-in gap-x-3">
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
                <>
                  <ClerkLoading>
                    {user ? (
                      <>
                        {(!isAdmin && !isDealershipAdmin) && (
                          <>
                            <TransitionLink
                              href={isReservationPage ? "/cars" : "/reservations"}
                              className="text-gray-600 hover:text-car-red flex items-center gap-2"
                            >
                              <Button variant="outline">
                                <CarFront size={18} />
                                <span className="hidden md:inline">
                                  {isReservationPage ? "Browse Cars" : "My Reservations"}
                                </span>
                              </Button>
                            </TransitionLink>
                            {showDealerButton && (
                              <DealerButton applicationStatus={applicationStatus} />
                            )}
                          </>
                        )}
                        <TransitionLink href={isWishlistedPage ? "/cars" : "/saved-cars"}>
                          <Button>
                            <Heart size={18} />
                            <span className="hidden md:inline">{isWishlistedPage ? "Browse Cars" : "Saved Cars"}</span>
                          </Button>
                        </TransitionLink>
                        <MobNavbarMenu />
                        {(isAdmin || isDealershipAdmin) && (
                          <TransitionLink href={isDealershipAdmin ? "/dealership" : "/admin"}>
                            <Button
                              variant="outline"
                              className="flex items-center gap-2"
                            >
                              <Layout size={18} />
                              <span className="hidden md:inline">{isDealershipAdmin ? "Dealership Portal" : "Admin Portal"}</span>
                            </Button>
                          </TransitionLink>
                        )}
                      </>
                    ) : (
                      <>
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
                      </>
                    )}
                  </ClerkLoading>

                  <SignedIn>
                  {(!isAdmin && !isDealershipAdmin) && (
                    <>
                      <TransitionLink
                        href={isReservationPage ? "/cars" : "/reservations"}
                        className="text-gray-600 hover:text-car-red flex items-center gap-2"
                      >
                        <Button variant="outline">
                          <CarFront size={18} />
                          <span className="hidden md:inline">
                            {isReservationPage ? "Browse Cars" : "My Reservations"}
                          </span>
                        </Button>
                      </TransitionLink>
                      
                      {showDealerButton && (
                        <DealerButton applicationStatus={applicationStatus} />
                      )}
                    </>
                  )}
                  <TransitionLink href={isWishlistedPage ? "/cars" : "/saved-cars"}>
                    <Button>
                      <Heart size={18} />
                      <span className="hidden md:inline">{isWishlistedPage ? "Browse Cars" : "Saved Cars"}</span>
                    </Button>
                  </TransitionLink>
                  <MobNavbarMenu />
                  {(isAdmin || isDealershipAdmin) && (
                    <TransitionLink href={isDealershipAdmin ? "/dealership" : "/admin"}>
                      <Button
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        <Layout size={18} />
                        <span className="hidden md:inline">
                          {isDealershipAdmin ? "Dealership Portal" : "Admin Portal"}
                        </span>
                      </Button>
                    </TransitionLink>
                  )}
                </SignedIn>
                </>
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
      <Notification
        isVisible={notification.isVisible}
        type={notification.type}
        title={notification.title}
        message={notification.message}
      />
    </PageWrapper>
  );
};

export default Navbar;

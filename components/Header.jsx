import { SignedIn, UserButton } from "@clerk/nextjs";
import { ArrowLeft, CarFront, Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";

const Header = async ({ isAdminPage = false }) => {
  const isAdmin = false;
  return (
    <header className=" fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b ">
      <nav className="mx-auto px-4 py-4 flex items-center justify-between">
        <Link href={isAdminPage ? "/admin" : "/"}>
          <Image
            src={"/GariGharBlack.png"}
            alt="Gadi Ghar Logo"
            width={250}
            height={200}
            className=" w-auto object-contain"
          />
          {isAdminPage && (
            <span className="text-xs font-extralight">admin</span>
          )}
        </Link>

        <div className="flex items-center space-x-4">
          {isAdminPage ? (
            <Link href={"/"}>
              <Button variant="outline" className="flex items-center gap-2">
                <ArrowLeft size={18} />
                <span>Back To App</span>
              </Button>
            </Link>
          ) : (
            <SignedIn>
              <Link href={"/saved-cars"}>
                <Button>
                  <Heart size={18} />
                  <span className="hidden md:inline">Saved Cars</span>
                </Button>
              </Link>
              {!isAdmin ? (
                <Link href={"/reservations"}>
                  <Button variant="outline">
                    <CarFront size={18} />
                    <span className="hidden md:inline">My Reservations</span>
                  </Button>
                </Link>
              ) : (
                <Link href={"/reservations"}>
                  <Button variant="outline">
                    <CarFront size={18} />
                    <span className="hidden md:inline">My Reservations</span>
                  </Button>
                </Link>
              )}
              <UserButton />
            </SignedIn>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;

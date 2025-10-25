"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (

    <header className="pt-4 sm:pb-px pb-5 bg-white/80 sticky top-0 z-40 w-full backdrop-blur-xl">
      <div className="w-full max-w-5xl px-4 mx-auto flex items-center justify-between">
        <div className="sm:hidden flex items-center">
          <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
            {isMobileMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 20 20" aria-hidden="true" className="h-6 w-6" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path></svg>
            )}
          </Button>
        </div>
        <Link className="flex items-center justify-center" href="/#home">
          <img className="h-6 sm:h-8 md:h-10 w-auto" src="/logo-macatiw-ebrgy-dark.png" alt="Macatiw eBarangay" />
        </Link>
        <img className="h-12 sm:hidden" src="/bagong-pilipinas-dark-048a8bc3.png" alt="Bagong Pilipinas" />
        <div className="flex-col md:flex-row items-center space-x-0 md:space-x-10 hidden md:flex">
          <div className="space-y-4 md:space-y-0 md:space-x-6 flex-col md:flex-row px-4 md:px-0 mb-8 md:mb-0 justify-between sm:hidden flex">
            <Link href="/#home" className="font-semibold active">
              Home
            </Link>
            <Link href="/#features" className="font-semibold active">
              Features
            </Link>
            <Link href="/#contact" className="font-semibold active">
              Contact Us
            </Link>
            <Link href="/privacy-policy" className="font-semibold active">
              Privacy Policy
            </Link>
            <Link href="/terms-of-use" className="font-semibold active">
              Terms of Use
            </Link>
          </div>
          <div className="flex items-center space-x-4 justify-center mt-5">
            <Link href="/auth/register" className="font-semibold text-[#4098FF] transition underline underline-offset-4 active">
              Register as a resident.
            </Link>
            <span className="text-slate-300">
              |
            </span>
            <Link href="/auth/login" className="font-semibold! text-primary-base hover:text-primary-dark! active">
              Login
            </Link>

          </div>
          <img className="sm:h-14 h-8 hidden sm:block" src="/bagong-pilipinas-dark-048a8bc3.png" alt="Bagong Pilipinas" />
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="sm:hidden bg-white border-t border-slate-100 mt-4">
          <div className="w-full max-w-5xl px-4 mx-auto flex flex-col space-y-4 py-4">


            <Link href="/#home" className="font-semibold active" onClick={toggleMobileMenu}>
              Home
            </Link>
            <Link href="/#features" className="font-semibold active" onClick={toggleMobileMenu}>
              Features
            </Link>
            <Link href="/#contact" className="font-semibold active" onClick={toggleMobileMenu}>
              Contact Us
            </Link>
            <Link href="/privacy-policy" className="font-semibold active" onClick={toggleMobileMenu}>
              Privacy Policy
            </Link>
            <Link href="/terms-of-use" className="font-semibold active" onClick={toggleMobileMenu}>
              Terms of Use
            </Link>

            <div className="flex items-center space-x-4 justify-center mt-5">
              <Link href="/auth/register" className="font-semibold text-[#4098FF] transition underline underline-offset-4 active">
                Register as a resident.
              </Link>
              <span className="text-slate-300">
                |
              </span>
              <Link href="/auth/login" className="font-semibold! text-primary-base hover:text-primary-dark! active">
                Login
              </Link>
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-5xl px-4 mx-auto sm:block hidden">
        <div className="flex py-1 border-t border-slate-100 border-y mt-4 mb-1">
          <Link href="/#home" className="flex-1 rounded py-2 text-center text-slate-900 transition-all duration-150 hover:bg-primary/10 hover:backdrop-blur-xl font-semibold">
            Home
          </Link>
          <Link href="/#features" className="flex-1 rounded py-2 text-center text-slate-900 transition-all duration-150 hover:bg-primary/10 hover:backdrop-blur-xl font-semibold">
            Features
          </Link>
          <Link href="/#contact" className="flex-1 rounded py-2 text-center text-slate-900 transition-all duration-150 hover:bg-primary/10 hover:backdrop-blur-xl font-semibold">
            Contact Us
          </Link>
          <Link href="/privacy-policy" className="flex-1 rounded py-2 text-center text-slate-900 transition-all duration-150 hover:bg-primary/10 hover:backdrop-blur-xl font-semibold">
            Privacy Policy
          </Link>
          <Link href="/terms-of-use" className="flex-1 rounded py-2 text-center text-slate-900 transition-all duration-150 hover:bg-primary/10 hover:backdrop-blur-xl font-semibold">
            Terms of Use
          </Link>

        </div>
      </div>
    </header>

  );
}

export default Header;
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

// Using a standard function so we can pass the logout action or just use an API route/form.
// To keep things simple and compatible with server actions without passing them down, 
// we will just use a standard link or form submission that hits a logout route, or pass the logoutAction as a prop.
export default function MobileHeader({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="md:hidden bg-navy text-white shadow-sm shrink-0 sticky top-0 z-50">
      <div className="flex items-center justify-between px-5 py-4">
        <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-90" onClick={() => setIsOpen(false)}>
          <span className="flex h-8 w-8 items-center justify-center rounded-sm bg-white shadow-sm shrink-0">
            <Image src="/logo.png" alt="AMS Civil Construction" width={28} height={28} className="h-5 w-5" />
          </span>
          <span>
            <span className="block font-display text-base leading-tight tracking-tight font-semibold whitespace-nowrap">
              AMS Civil Construction
            </span>
            <span className="block text-[10px] leading-tight text-orange mt-0.5">
              Billing &amp; Quotations
            </span>
          </span>
        </Link>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 -mr-2 text-white/80 hover:text-white transition-colors focus:outline-none"
          aria-label="Toggle menu"
        >
          {isOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full bg-navy border-t border-white/10 shadow-xl z-50">
          <nav className="flex flex-col px-5 py-3">
            <Link 
              href="/" 
              className="py-3 text-base font-medium hover:text-orange transition-colors border-b border-white/5 last:border-0"
              onClick={() => setIsOpen(false)}
            >
              Dashboard
            </Link>
            <Link 
              href="/quotations" 
              className="py-3 text-base font-medium hover:text-orange transition-colors border-b border-white/5 last:border-0"
              onClick={() => setIsOpen(false)}
            >
              Quotations
            </Link>
            <Link 
              href="/bills" 
              className="py-3 text-base font-medium hover:text-orange transition-colors border-b border-white/5 last:border-0"
              onClick={() => setIsOpen(false)}
            >
              Bills
            </Link>
            <Link 
              href="/projects" 
              className="py-3 text-base font-medium hover:text-orange transition-colors border-b border-white/5 last:border-0"
              onClick={() => setIsOpen(false)}
            >
              Projects & Ledgers
            </Link>
            <Link 
              href="/measurements" 
              className="py-3 text-base font-medium text-orange transition-colors border-b border-white/5 last:border-0"
              onClick={() => setIsOpen(false)}
            >
              Measurements
            </Link>
          </nav>
          
          <div className="bg-navy-light/50 px-5 py-4 border-t border-white/10">
            {/* We render the logout button passed as children from the server component */}
            {children}
          </div>
        </div>
      )}
      <div className="h-[3px] bg-gradient-to-r from-orange to-orange-light relative z-50" />
    </header>
  );
}

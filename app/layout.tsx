import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import Link from "next/link";
import Image from "next/image";
import "./globals.css";

import { getSession } from "@/lib/auth";
import { logoutAction } from "@/app/login/actions";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

import MobileHeader from "@/components/MobileHeader";

export const metadata: Metadata = {
  title: "AMS Civil Construction — Billing",
  description: "Create and share quotations & bills for AMS Civil Construction.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  return (
    <html lang="en">
      <body className={`min-h-screen ${inter.variable} ${playfair.variable} font-sans text-navy bg-[#F8F9FA]`}>
        {session ? (
          <div className="flex min-h-screen flex-col md:flex-row">
            {/* Mobile Header (Hidden on Desktop) */}
            <MobileHeader>
              <form action={logoutAction}>
                <button 
                  type="submit" 
                  className="flex w-full items-center justify-center gap-2 rounded-md bg-white/10 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/20"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </form>
            </MobileHeader>

            {/* Desktop Sidebar (Hidden on Mobile) */}
            <aside className="hidden md:flex w-64 flex-col bg-navy text-white shrink-0 shadow-xl z-10">
              <div className="p-6">
                <Link href="/" className="flex items-center gap-3 transition-opacity hover:opacity-90">
                  <span className="flex h-10 w-10 items-center justify-center rounded-sm bg-white shadow-sm shrink-0">
                    <Image src="/logo.png" alt="AMS Civil Construction" width={28} height={28} className="h-7 w-7" />
                  </span>
                  <div>
                    <span className="block font-display text-lg leading-tight tracking-tight font-semibold">
                      AMS Civil Construction
                    </span>
                    <span className="block text-[10px] leading-tight text-orange mt-1">
                      Billing &amp; Quotations
                    </span>
                  </div>
                </Link>
              </div>
              <div className="h-[2px] bg-gradient-to-r from-orange to-orange-light mx-6 opacity-80" />
              
              <nav className="flex-1 mt-8 px-4 flex flex-col gap-2">
                <Link href="/" className="flex items-center px-4 py-3 rounded-lg hover:bg-white/10 transition-colors font-medium">
                  <svg className="w-5 h-5 mr-3 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                  Dashboard
                </Link>
                <Link href="/quotations" className="flex items-center px-4 py-3 rounded-lg hover:bg-white/10 transition-colors font-medium">
                  <svg className="w-5 h-5 mr-3 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  Quotations
                </Link>
                <Link href="/bills" className="flex items-center px-4 py-3 rounded-lg hover:bg-white/10 transition-colors font-medium">
                  <svg className="w-5 h-5 mr-3 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
                  Bills
                </Link>
                <Link href="/projects" className="flex items-center px-4 py-3 rounded-lg hover:bg-white/10 transition-colors font-medium text-orange">
                  <svg className="w-5 h-5 mr-3 opacity-90" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                  Projects & Ledgers
                </Link>
              </nav>

              <div className="p-4 mt-auto border-t border-white/10">
                <form action={logoutAction}>
                  <button type="submit" className="flex w-full items-center px-4 py-3 rounded-lg hover:bg-white/10 transition-colors text-white/70 hover:text-white font-medium">
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                    Logout
                  </button>
                </form>
              </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
              <div className="mx-auto w-full max-w-5xl px-5 py-8 flex-1">
                {children}
              </div>
              <footer className="mx-auto w-full max-w-5xl px-5 pb-10 pt-4 text-center text-xs text-navy/50">
                &copy; {new Date().getFullYear()} AMS Civil Construction &middot; Mumbai, Maharashtra
              </footer>
            </main>
          </div>
        ) : (
          <main className="mx-auto max-w-5xl px-5 py-8 min-h-screen">{children}</main>
        )}
      </body>
    </html>
  );
}

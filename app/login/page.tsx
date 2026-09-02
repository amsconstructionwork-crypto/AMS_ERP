"use client";

import { useState } from "react";
import { login } from "./actions";
import Image from "next/image";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsPending(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    const result = await login(formData);
    if (result?.error) {
      setError(result.error);
      setIsPending(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-white md:bg-[#f8f9fa]">
      {/* Left side - Branding (Hidden on mobile) */}
      <div className="hidden md:flex md:w-1/2 lg:w-3/5 bg-navy flex-col justify-between p-12 relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
          <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-gradient-to-tr from-orange to-transparent blur-3xl"></div>
          <div className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-gradient-to-bl from-white to-transparent blur-3xl"></div>
        </div>
        
        <div className="relative z-10 flex flex-col h-full justify-center items-center text-center">
          <div className="bg-white/10 p-8 rounded-3xl backdrop-blur-sm border border-white/10 shadow-2xl">
            <Image src="/logo.png" alt="AMS Civil Construction" width={220} height={90} className="object-contain brightness-0 invert" priority />
          </div>
          <h2 className="mt-12 text-3xl lg:text-4xl font-display font-bold text-white tracking-wide">
            Enterprise Management
          </h2>
          <p className="mt-4 text-white/70 text-lg max-w-md mx-auto">
            Securely manage your billing, quotations, and projects from a single platform.
          </p>
        </div>
        
        <div className="relative z-10 text-white/50 text-sm">
          &copy; {new Date().getFullYear()} AMS Civil Construction. All rights reserved.
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="flex w-full md:w-1/2 lg:w-2/5 flex-col justify-center items-center p-6 sm:p-12 relative">
        <div className="w-full max-w-md bg-white md:bg-transparent rounded-2xl md:rounded-none p-8 md:p-0 shadow-2xl md:shadow-none border border-navy/5 md:border-none">
          
          {/* Mobile Logo */}
          <div className="md:hidden mb-8 flex justify-center">
            <Image src="/logo.png" alt="AMS Civil Construction" width={180} height={70} className="object-contain" priority />
          </div>

          <div className="mb-8 text-center md:text-left">
            <h1 className="font-display text-3xl font-bold tracking-tight text-navy">Welcome Back</h1>
            <p className="mt-2 text-sm text-navy/60">Please sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-navy/90">Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-navy/40">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  type="text"
                  name="username"
                  required
                  className="w-full rounded-xl border border-navy/20 bg-navy/5 pl-10 pr-4 py-3 text-sm text-navy outline-none transition-all focus:bg-white focus:border-orange focus:ring-2 focus:ring-orange/20"
                  placeholder="Enter your username"
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-navy/90">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-navy/40">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  className="w-full rounded-xl border border-navy/20 bg-navy/5 pl-10 pr-10 py-3 text-sm text-navy outline-none transition-all focus:bg-white focus:border-orange focus:ring-2 focus:ring-orange/20"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-navy/40 hover:text-orange transition-colors focus:outline-none"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600 border border-red-100 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="mt-4 flex w-full items-center justify-center rounded-xl bg-orange py-3.5 text-base font-bold text-white shadow-lg shadow-orange/20 transition-all hover:bg-orange/90 hover:shadow-orange/40 hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0"
            >
              {isPending ? (
                <>
                  <svg className="mr-2 h-5 w-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

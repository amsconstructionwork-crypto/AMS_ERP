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
    <div className="flex min-h-[80vh] items-center justify-center">
      <div className="w-full max-w-md rounded-lg border border-navy/10 bg-white p-8 shadow-xl shadow-navy/5">
        <div className="mb-8 flex flex-col items-center justify-center text-center">
          <div className="mb-6 flex items-center justify-center">
            <Image src="/logo.png" alt="AMS Civil Construction" width={180} height={70} className="object-contain" priority />
          </div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-navy">Welcome Back</h1>
          <p className="mt-1 text-sm text-navy/60">Sign in to manage billing & quotations</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-navy/80">Username</label>
            <input
              type="text"
              name="username"
              required
              className="w-full rounded-md border border-navy/20 px-3 py-2 text-sm outline-none transition-colors focus:border-orange focus:ring-1 focus:ring-orange"
              placeholder="Enter your username"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-navy/80">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                className="w-full rounded-md border border-navy/20 pl-3 pr-10 py-2 text-sm outline-none transition-colors focus:border-orange focus:ring-1 focus:ring-orange"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-navy/40 hover:text-navy/70"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="mt-2 flex w-full items-center justify-center rounded-md bg-orange py-2.5 text-sm font-medium text-white transition-colors hover:bg-orange/90 disabled:opacity-70"
          >
            {isPending ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}

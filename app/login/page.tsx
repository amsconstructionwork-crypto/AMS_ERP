"use client";

import { useState } from "react";
import { login } from "./actions";
import Image from "next/image";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

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
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-navy shadow-inner">
            <Image src="/logo.png" alt="AMS Civil Construction" width={32} height={32} className="brightness-0 invert" />
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
            <input
              type="password"
              name="password"
              required
              className="w-full rounded-md border border-navy/20 px-3 py-2 text-sm outline-none transition-colors focus:border-orange focus:ring-1 focus:ring-orange"
              placeholder="••••••••"
            />
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

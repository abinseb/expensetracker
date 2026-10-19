"use client";

import { useActionState } from "react";
import { loginAction, type AuthState } from "@/src/lib/actions/auth-actions";
import Link from "next/link";

export default function LoginPage() {
  const [state, action, pending] = useActionState<AuthState, FormData>(
    loginAction,
    undefined
  );

  return (
    <div className="flex flex-1 items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 mb-4">
            <span className="text-2xl">💰</span>
          </div>
          <h1 className="text-2xl font-bold gradient-text">ExpenseTracker</h1>
          <p className="text-zinc-400 mt-1 text-sm">Sign in to manage your finances</p>
        </div>

        {/* Card */}
        <div className="glass-card p-8 glow animate-fade-in">
          <form action={action} className="space-y-5">
            {state?.message && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {state.message}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-1.5">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                className="form-input"
                required
              />
              {state?.errors?.email && (
                <p className="text-red-400 text-xs mt-1">{state.errors.email[0]}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-zinc-300 mb-1.5">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                className="form-input"
                required
              />
              {state?.errors?.password && (
                <p className="text-red-400 text-xs mt-1">{state.errors.password[0]}</p>
              )}
            </div>

            <button type="submit" disabled={pending} className="btn-primary w-full py-3">
              {pending ? (
                <span className="animate-pulse">Signing in...</span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <p className="text-center text-zinc-400 text-sm mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-indigo-400 hover:text-indigo-300 font-medium">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function SignInClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isAuthenticated, role } = useAuth();

  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const nextUrl = searchParams.get("next") || "/products";

  useEffect(() => {
    if (!isAuthenticated) return;

    if (role === "admin") {
      router.replace("/admin/dashboard");
    } else {
      router.replace(nextUrl);
    }
  }, [isAuthenticated, role, nextUrl, router]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await login({ usernameOrEmail, password });

      let redirectTo = nextUrl || "/products";

      if (res?.role === "admin") {
        redirectTo = "/admin/dashboard";
      }

      router.replace(redirectTo);
    } catch (err) {
      setError(err?.message || "Failed to sign in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 font-playfair overflow-hidden">

      {/* Background Video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="fixed top-0 left-0 w-full h-full object-cover -z-10"
      >
        <source src="./signin.mp4" type="video/mp4" />
      </video>

      {/* Optional Overlay */}
      <div className="fixed inset-0 bg-black/30 -z-10"></div>

      {/* Signin Card */}
      <div className="relative w-full max-w-md p-6 sm:p-8 rounded-2xl shadow-xl">

        <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-center text-white">
          Sign in
        </h1>

        {error && (
          <div className="mb-4 p-3 border border-red-200 bg-red-50 text-red-700 rounded text-sm">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">

          {/* Username or Email */}
          <div>
            <label className="block text-sm font-semibold mb-1 text-white">
              Username or Email
            </label>
            <input
              value={usernameOrEmail}
              onChange={(e) => setUsernameOrEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white/90 focus:outline-none focus:ring-2 focus:ring-white"
              autoComplete="username"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold mb-1 text-white">
              Password
            </label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white/90 focus:outline-none focus:ring-2 focus:ring-white"
              autoComplete="current-password"
              required
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-lg transition hover:opacity-90 disabled:opacity-60 mt-4"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>

        </form>

        {/* Register Link */}
        <p className="mt-6 text-sm text-white text-center">
          Don&apos;t have an account?{" "}
          <Link className="underline text-white" href="/register">
            Create one
          </Link>
        </p>

      </div>
    </div>
  );
}
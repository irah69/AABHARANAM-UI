"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 9) {
      setPasswordError("Password must be at least 9 characters long.");
      setError("");
      return;
    }

    setPasswordError("");
    setError("");
    setLoading(true);

    try {
      await register({ username, email, password });
      router.replace("/signin");
    } catch (err) {
      setError(err?.message || "Failed to register.");
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

      {/* Register Card */}
      <div className="relative w-full max-w-md p-6 sm:p-8 rounded-2xl shadow-xl">

        <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-center text-white">
          Create account
        </h1>

        {error && (
          <div className="mb-4 p-3 border border-red-200 bg-red-50 text-red-700 rounded text-sm">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">

          {/* Username */}
          <div>
            <label className="block text-sm font-semibold mb-1 text-white">
              Username
            </label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white/90 focus:outline-none focus:ring-2 focus:ring-white"
              autoComplete="username"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold mb-1 text-white">
              Email
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white/90 focus:outline-none focus:ring-2 focus:ring-white"
              autoComplete="email"
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
              onChange={(e) => {
                const value = e.target.value;
                setPassword(value);
                if (value.length > 0 && value.length < 9) {
                  setPasswordError("Password must be at least 9 characters long.");
                } else {
                  setPasswordError("");
                }
              }}
              type="password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white/90 focus:outline-none focus:ring-2 focus:ring-white"
              autoComplete="new-password"
              required
            />

            {passwordError && (
              <p className="text-white text-sm mt-1">
                {passwordError}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || password.length < 9}
            className="w-full bg-black text-white py-3 rounded-lg transition  mt-4"
          >
            {loading ? "Creating..." : "Create account"}
          </button>

        </form>

        <p className="mt-6 text-sm text-white text-center">
          Already have an account?{" "}
          <Link className="underline text-white" href="/signin">
            Sign in
          </Link>
        </p>

      </div>
    </div>
  );
}
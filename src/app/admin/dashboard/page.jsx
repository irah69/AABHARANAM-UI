"use client";
import Link from "next/link";

import React from "react";
import ContactUsMsgs from "@/components/ContactUsMsgs";
import AnalyticsDashboard from "@/components/ui/analytics-dashboard";
import { Button } from "@/components/ui/button";
import RequireAdmin from "@/components/RequireAdmin";
import { useAuth } from "@/context/AuthContext";
import { adminApi } from "@/lib/apiClient";
import { useQuery } from "@tanstack/react-query";
import Heading from "@/components/Heading";
import AdminHeading from "@/components/ui/AdminHeading";

export default function AdminDashboard() {
  const { accessToken } = useAuth();
  const dashboardQuery = useQuery({
    queryKey: ["adminDashboard"],
    enabled: Boolean(accessToken),
    queryFn: ({ signal }) => adminApi.getDashboard(accessToken, signal),
  });

  const contactusQuery = useQuery({
    queryKey: ["adminContactUs"],
    enabled: Boolean(accessToken),
    queryFn: async ({ signal }) => {
      const res = await fetch("https://murgan-backend-1.onrender.com/api/admin/contactus", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        signal,
      });
      if (!res.ok) throw new Error("Failed to fetch contact messages");
      return res.json();
    },
  });

  return (
    <RequireAdmin>
      <div className="min-h-screen w-full bg-white text-black flex flex-col items-center">
        <div className="w-full max-w-7xl px-4 py-10">
          <AnalyticsDashboard />
         {/*  <AdminHeading title="Admin Dashboard" subtitle="Overview of key metrics and contact messages" />
 */}

          <div className="mt-20 border border-gray-200 rounded-lg p-5">

             <div className="mt-16 mb-16 flex justify-center gap-10">
            <Button asChild variant="outline" className="px-6 py-3 text-base font-semibold">
              {/* Use Next.js Link for client-side navigation */}
              <Link href="/admin/products">Manage products</Link>
            </Button>
            <Button asChild variant="outline" className="px-6 py-3 text-base font-semibold">
              {/* Use Next.js Link for client-side navigation */}
              <Link href="/admin/categories">Manage categories</Link>
            </Button>
            <Button asChild variant="outline" className="px-6 py-3 text-base font-semibold">
              {/* Use Next.js Link for client-side navigation */}
              <Link href="/admin/users">View users</Link>
            </Button>
          </div>
            <div className="flex items-center justify-between gap-4 mb-3">
              <h2 className="text-lg font-semibold">Backend dashboard (live)</h2>
              <button
                onClick={() => dashboardQuery.refetch()}
                className="px-4 py-2 border border-gray-300 rounded"
              >
                Refresh
              </button>
            </div>
            {dashboardQuery.isLoading ? (
              <div className="text-gray-600">Loading…</div>
            ) : dashboardQuery.isError ? (
              <div className="text-red-700">
                Failed to load: {dashboardQuery.error?.message || "Error"}
              </div>
            ) : (
              <pre className="text-xs overflow-auto bg-gray-50 p-4 rounded">
                {JSON.stringify(dashboardQuery.data, null, 2)}
              </pre>
            )}
            <ContactUsMsgs contactusQuery={contactusQuery} />
          </div>
        </div>
      </div>
    </RequireAdmin>
  );
}

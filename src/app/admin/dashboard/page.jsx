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
    queryFn: ({ signal }) => adminApi.getContactUs(accessToken, signal),
  });

  return (
    <RequireAdmin>
      <div className="min-h-screen w-full bg-white text-black">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">

          {/* Analytics */}
          <div className="w-full overflow-x-hidden">
            <AnalyticsDashboard />
          </div>

          {/* Nav Buttons */}
          <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4">
            <Button
              asChild
              variant="outline"
              className="w-full sm:w-auto px-6 py-3 text-sm sm:text-base font-semibold"
            >
              <Link href="/admin/products">Manage products</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="w-full sm:w-auto px-6 py-3 text-sm sm:text-base font-semibold"
            >
              <Link href="/admin/categories">Manage categories</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="w-full sm:w-auto px-6 py-3 text-sm sm:text-base font-semibold"
            >
              <Link href="/admin/users">View users</Link>
            </Button>
          </div>

          {/* Backend Dashboard Card */}
          <div className="mt-8 sm:mt-10 border border-gray-200 rounded-lg p-4 sm:p-6">
            <div className="flex items-center justify-between gap-3 mb-4">
              <h2 className="text-base sm:text-lg font-semibold">
                Backend dashboard (live)
              </h2>
              <button
                onClick={() => dashboardQuery.refetch()}
                className="shrink-0 px-3 py-1.5 sm:px-4 sm:py-2 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors"
              >
                Refresh
              </button>
            </div>

            {dashboardQuery.isLoading ? (
              <div className="text-gray-600 text-sm">Loading…</div>
            ) : dashboardQuery.isError ? (
              <div className="text-red-700 text-sm">
                Failed to load: {dashboardQuery.error?.message || "Error"}
              </div>
            ) : (
              <pre className="text-xs overflow-auto bg-gray-50 p-3 sm:p-4 rounded max-w-full">
                {JSON.stringify(dashboardQuery.data, null, 2)}
              </pre>
            )}

            {/* Contact Us Messages */}
            <div className="mt-6">
              <ContactUsMsgs contactusQuery={contactusQuery} />
            </div>
          </div>

        </div>
      </div>
    </RequireAdmin>
  );
}
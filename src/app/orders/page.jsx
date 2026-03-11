"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Package } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { userApi } from "@/lib/apiClient";
import { normalizePage } from "@/lib/pagination";

export default function OrdersPage() {

  const { isAuthenticated, isHydrated, accessToken } = useAuth();
  const [page, setPage] = useState(0);
  const size = 10;

  const ordersQuery = useQuery({
    queryKey: ["orders", { page, size }],
    enabled: isAuthenticated,
    queryFn: ({ signal }) =>
      userApi.getOrders({ token: accessToken, page, size }, signal),
  });

  const pageData = useMemo(() => {
    const raw = ordersQuery.data?.data ?? ordersQuery.data;
    return normalizePage(raw);
  }, [ordersQuery.data]);

  if (!isHydrated) return null;

  /* NOT LOGGED IN */

  if (!isAuthenticated) {
    return (
      <section className="py-28 px-6 text-center">

        <div className="text-6xl mb-6">📦</div>

        <h1 className="text-4xl font-semibold mb-4">
          Sign in to view your orders
        </h1>

        <p className="text-gray-500 text-lg mb-10">
          Your past purchases will appear here once you sign in.
        </p>

        <Link
          href="/signin?next=/orders"
          className="inline-flex items-center justify-center px-8 py-3 bg-black text-white rounded-lg hover:bg-gray-900"
        >
          Sign in
        </Link>

      </section>
    );
  }

  return (

    <section className="bg-white py-10 md:py-16">

      <div className="mx-auto max-w-4xl px-4">

        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-8">
          Orders
        </h1>

        {/* LOADING */}

        {ordersQuery.isLoading ? (

          <div className="flex items-center justify-center min-h-[40vh]">
            <p className="text-gray-500">Loading orders...</p>
          </div>

        ) : ordersQuery.isError ? (

          <div className="text-center py-20">

            <p className="text-gray-600 mb-4">
              Failed to load orders
            </p>

            <button
              onClick={() => ordersQuery.refetch()}
              className="font-medium hover:underline"
            >
              Try again →
            </button>

          </div>

        ) : pageData.items.length === 0 ? (

          /* EMPTY STATE */

          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">

            <Package size={44} className="text-gray-400 mb-4" />

            <h2 className="text-3xl font-light mb-3">
              No orders yet
            </h2>

            <p className="text-gray-500 mb-8">
              Looks like you haven't placed any orders yet.
            </p>

            <Link
              href="/products"
              className="text-lg font-medium hover:underline"
            >
              Browse products →
            </Link>

          </div>

        ) : (

          /* ORDERS LIST */

          <div className="space-y-6">

            {pageData.items.map((order) => (

              <div
                key={order.id}
                className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm"
              >

                {/* ORDER HEADER */}

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b">

                  <div>

                    <div className="font-semibold text-lg text-gray-900">
                      Order #{order.id}
                    </div>

                    <div className="text-sm text-gray-500 mt-1">
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleString()
                        : ""}
                    </div>

                  </div>

                  <div className="sm:text-right">

                    <div className="text-sm text-gray-500">
                      {order.status || "Processing"}
                    </div>

                    {typeof order.total === "number" && (
                      <div className="font-semibold text-lg text-gray-900">
                        ₹{order.total}
                      </div>
                    )}

                  </div>

                </div>


                {/* ORDER ITEMS */}

                {Array.isArray(order.items) && order.items.length > 0 && (

                  <div className="divide-y divide-gray-100">

                    {order.items.map((it, idx) => {

                      const product = it.product || {};
                      const name = product.name || `Product #${it.productId}`;

                      let image = "";

                      if (
                        Array.isArray(product.imageUrlss) &&
                        product.imageUrlss.length > 0
                      ) {
                        image = product.imageUrlss[0];
                      } else if (Array.isArray(product.imageUrls)) {
                        image = product.imageUrls[0];
                      } else if (typeof product.imageUrls === "string" && product.imageUrls.includes(",")) {
                        image = product.imageUrls.split(",").map(url => url.trim()).filter(url => url.length > 0)[0];
                      } else {
                        image = product.imageUrls || product.image;
                      }

                      const price = it.unitPrice ?? 0;
                      const qty = it.quantity ?? 0;

                      return (

                        <div
                          key={idx}
                          className="flex items-center gap-4 py-4"
                        >

                          <img
                            src={image}
                            alt={name}
                            className="w-16 h-16 object-cover rounded-md bg-gray-100 flex-shrink-0"
                          />

                          <div className="flex-1 min-w-0">

                            <div className="font-medium text-gray-900 truncate">
                              {name}
                            </div>

                            <div className="text-sm text-gray-500">
                              Qty: {qty}
                            </div>

                          </div>

                          <div className="text-sm font-semibold text-gray-800">
                            ₹{price * qty}
                          </div>

                        </div>

                      );

                    })}

                  </div>

                )}

              </div>

            ))}

          </div>

        )}

      </div>

    </section>

  );
}
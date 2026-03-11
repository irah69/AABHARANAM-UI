"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const router = useRouter();
  const { isAuthenticated, isHydrated } = useAuth();

  const {
    cartItems,
    isLoading,
    error,
    setQuantity,
    removeItem,
    getTotalPrice,
    getTotalItems,
    isMutating,
  } = useCart();

  const [localError, setLocalError] = useState("");

  const items = useMemo(() => cartItems || [], [cartItems]);

  if (!isHydrated) return null;

  // ---------- NOT SIGNED IN ----------
  if (!isAuthenticated) {
return ( <section className="py-28 px-6">


  {/* Message */}
  <div className="text-center max-w-lg mx-auto mb-24">

    <div className="text-6xl mb-8">🛒</div>

    <h1 className="text-4xl font-semibold mb-4">
      Sign in to view your cart
    </h1>

    <p className="text-gray-500 text-lg mb-10">
      Your saved items and checkout details will appear here once you sign in.
    </p>

    <div className="flex items-center justify-center gap-8 mt-8">

      <Link
        href="/signin?next=/cart"
        className="inline-flex items-center justify-center px-8 py-3 min-w-[120px] bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-900 transition"
      >
        Sign in
      </Link>

      <Link
        href="/products"
        className="text-gray-600 text-sm font-medium hover:text-black transition"
      >
        Browse products →
      </Link>

    </div>

  </div>

  {/* Recommended products */}
  <div className="mt-24 w-full max-w-6xl mx-auto">

    <h2 className="text-2xl font-semibold text-center mb-12">
      Popular right now
    </h2>

    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">

      <Link
        href="/products"
        className="group block rounded-xl overflow-hidden bg-white hover:shadow-lg transition duration-300"
      >
        <img
          src="/saree.png"
          className="w-full aspect-[4/5] object-cover group-hover:scale-105 transition duration-300"
        />
        <p className="text-sm font-medium mt-3 text-gray-800">
          Elegant Saree
        </p>
      </Link>

      <Link
        href="/products"
        className="group block rounded-xl overflow-hidden bg-white hover:shadow-lg transition duration-300"
      >
        <img
          src="/saree.png"
          className="w-full aspect-[4/5] object-cover group-hover:scale-105 transition duration-300"
        />
        <p className="text-sm font-medium mt-3 text-gray-800">
          Party Dress
        </p>
      </Link>

      <Link
        href="/products"
        className="group block rounded-xl overflow-hidden bg-white hover:shadow-lg transition duration-300"
      >
        <img
          src="/saree.png"
          className="w-full aspect-[4/5] object-cover group-hover:scale-105 transition duration-300"
        />
        <p className="text-sm font-medium mt-3 text-gray-800">
          Summer Outfit
        </p>
      </Link>

      <Link
        href="/products"
        className="group block rounded-xl overflow-hidden bg-white hover:shadow-lg transition duration-300"
      >
        <img
          src="/saree.png"
          className="w-full aspect-[4/5] object-cover group-hover:scale-105 transition duration-300"
        />
        <p className="text-sm font-medium mt-3 text-gray-800">
          Traditional Wear
        </p>
      </Link>

    </div>

  </div>

</section>

);
}


  // ---------- CART PAGE ----------
  return (
    <section className="bg-white py-8 antialiased md:py-16">
      <div className="mx-auto max-w-screen-xl px-4">

        <h2 className="text-xl font-semibold text-gray-900 sm:text-2xl">
          Shopping Cart
        </h2>

        {(localError || error) && (
          <div className="mt-4 p-3 border border-red-200 bg-red-50 text-red-700 rounded">
            {localError || error?.message}
          </div>
        )}

        {isLoading ? (
          <p className="mt-6 text-gray-500">Loading cart...</p>
        ) : items.length === 0 ? (

          // ---------- EMPTY CART ----------
          <div className="flex flex-col items-center justify-center min-h-[60vh] pt-40 text-center">

            <div className="text-6xl mb-6">
              🛍️
            </div>

            <h2 className="text-3xl md:text-4xl font-light tracking-tight mb-3">
              Your cart is empty
            </h2>

            <p className="text-gray-500 text-base md:text-lg mb-8">
              Let’s find something you’ll love.
            </p>

            <Link
              href="/products"
              className="mt-4 text-lg font-medium text-black hover:underline"
            >
              Browse products →
            </Link>

          </div>

        ) : (

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">

            {/* CART ITEMS */}
            <div className="lg:col-span-2 space-y-4">

              {items.map((item) => {
                const product = item.product || item;
                const productId = item.productId ?? product.id;
                const qty = item.quantity ?? 0;
                const imageSrc =
                  product.imageUrl || product.image || "/saree.png";
                const name = product.name || `Product #${productId}`;
                const price = product.price ?? 0;
                const lineTotal = price * qty;

                return (
                  <div
                    key={productId}
                    className="border border-gray-200 rounded-lg p-4 flex gap-4"
                  >

                    <img
                      src={imageSrc}
                      alt={name}
                      className="w-24 h-24 object-cover rounded bg-gray-100"
                    />

                    <div className="flex-1">

                      <div className="flex items-start justify-between gap-4">

                        <div>
                          <div className="font-semibold">{name}</div>
                          <div className="text-sm text-gray-600">₹{price}</div>
                        </div>

                        <button
                          onClick={async () => {
                            setLocalError("");
                            try {
                              await removeItem(productId);
                            } catch (e) {
                              setLocalError(
                                e?.message || "Failed to remove item."
                              );
                            }
                          }}
                          className="text-sm underline text-gray-700"
                        >
                          Remove
                        </button>

                      </div>

                      {/* Quantity */}
                      <div className="mt-3 flex items-center gap-3">

                        <button
                          onClick={() =>
                            setQuantity(productId, Math.max(0, qty - 1))
                          }
                          className="px-3 py-2 border border-gray-300 rounded"
                        >
                          −
                        </button>

                        <input
                          value={qty}
                          onChange={(e) => {
                            const next = Number(e.target.value);
                            if (!Number.isFinite(next)) return;

                            setQuantity(productId, next);
                          }}
                          className="w-16 text-center px-2 py-2 border border-gray-300 rounded"
                          inputMode="numeric"
                        />

                        <button
                          onClick={() =>
                            setQuantity(productId, qty + 1)
                          }
                          className="px-3 py-2 border border-gray-300 rounded"
                        >
                          +
                        </button>

                        <div className="ml-auto text-sm text-gray-700">
                          Line total:{" "}
                          <span className="font-semibold">
                            ₹{lineTotal}
                          </span>
                        </div>

                      </div>

                    </div>

                  </div>
                );
              })}

            </div>

            {/* SUMMARY */}
            <div className="border border-gray-200 rounded-lg p-5 h-fit">

              <h2 className="text-lg font-semibold mb-3">
                Summary
              </h2>

              <div className="flex justify-between text-sm text-gray-700 mb-2">
                <span>Items</span>
                <span>{getTotalItems()}</span>
              </div>

              <div className="flex justify-between text-sm text-gray-700 mb-4">
                <span>Total</span>
                <span className="font-semibold">
                  ₹{getTotalPrice()}
                </span>
              </div>

              <button
                disabled={items.length === 0 || isMutating}
                onClick={() => router.push("/checkout")}
                className="w-full py-3 bg-black text-white rounded-lg disabled:opacity-60"
              >
                Checkout
              </button>

            </div>

          </div>

        )}

      </div>
    </section>
  );
}
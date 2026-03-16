'use client';

import React, { useState, useMemo } from "react";
import AddToCartButton from "@/components/AddToCartButton";

export default function ProductDetailsContent({ product }) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-400 text-lg">
        <p>No product found.</p>
      </div>
    );
  }

  const discountPercent = useMemo(() => {
    const base = Number(product.id) || 0;
    return (base % 40) + 10;
  }, [product.id]);

  const originalPrice = useMemo(
    () => Math.floor(product.price * (1 + discountPercent / 100)),
    [product.price, discountPercent]
  );

  const images = Array.isArray(product.imageUrlss)
    ? product.imageUrlss
    : Array.isArray(product.imageUrls)
      ? product.imageUrls
      : typeof product.imageUrls === "string"
        ? product.imageUrls.split(",").map((u) => u.trim()).filter(Boolean)
        : [];

  const averageRating = 4.3;

  return (
    /* Root: full width, no horizontal overflow, light gradient bg */
    <div className="w-full max-w-full overflow-x-hidden bg-gradient-to-br from-white to-gray-50 min-h-screen px-3 py-5 sm:px-5 sm:py-8 md:px-6 md:py-10">

      {/* ── Card wrapper ── */}
      <div className="w-full max-w-6xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">

        {/* Two-column on md+, single-column on mobile */}
        <div className="flex flex-col md:flex-row">

          {/* ════════════ LEFT – Images ════════════ */}
          <div className="w-full md:w-[45%] flex-shrink-0 p-4 sm:p-6 flex flex-col gap-4">

            {/* Main image */}
            <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-gray-100 shadow">
              {/* Shiny overlay */}
              <div className="absolute inset-x-0 top-0 h-1/5 bg-gradient-to-b from-white/60 to-transparent pointer-events-none z-10 rounded-t-xl" />

              {images[selectedImageIndex] ? (
                <img
                  src={images[selectedImageIndex]}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">
                  No image
                </div>
              )}

              {product.stockQuantity === 0 && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-20">
                  <span className="text-white text-xl font-semibold tracking-wide">Out of Stock</span>
                </div>
              )}

            </div>

            {/* Thumbnails – 4 per row, wrap safely */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImageIndex(i)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200 bg-gray-100
                      ${selectedImageIndex === i
                        ? "border-red-400 shadow shadow-red-100"
                        : "border-transparent hover:border-gray-300 hover:-translate-y-0.5"
                      }`}
                  >
                    <img src={img} alt={`View ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ════════════ RIGHT – Details ════════════ */}
          <div className="w-full md:flex-1 min-w-0 p-4 sm:p-6 flex flex-col gap-5 md:border-l border-gray-100">

            {/* Product header */}
            <div className="border-b border-gray-100 pb-4">
              <span className="inline-block bg-gradient-to-r from-red-400 to-orange-600 text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-2">
                Featured
              </span>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 leading-snug break-words mb-1">
                {product.name}
              </h1>
              <p className="text-sm text-gray-500 font-medium">
                by {product.category?.name || "Store"}
              </p>
            </div>

            {/* Price box */}
            <div className="bg-gradient-to-br from-orange-50 to-orange-100/40 rounded-xl p-4">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="text-2xl sm:text-3xl font-extrabold text-red-500">
                  ₹{product.price.toLocaleString()}
                </span>
                <span className="text-base text-gray-400 line-through">
                  ₹{originalPrice.toLocaleString()}
                </span>
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md">
                  {discountPercent}% OFF
                </span>
              </div>
              <p className="text-xs text-gray-500">inclusive of all taxes</p>
            </div>

            {/* Stock status */}
            <div className="flex items-center gap-2 flex-wrap">
              {product.stockQuantity > 0 ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
                  <span className="text-sm font-semibold text-green-600">In Stock</span>
                  <span className="text-xs text-gray-400">· Only {product.stockQuantity} left</span>
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
                  <span className="text-sm font-semibold text-red-500">Out of Stock</span>
                </>
              )}
            </div>

            {/* Quantity + Add to Cart */}
            <div className="bg-gray-50 rounded-xl border border-gray-100 p-4 flex flex-col gap-4">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-sm font-semibold text-gray-700 whitespace-nowrap">Quantity:</span>
                <div className="flex items-center border-2 border-gray-200 rounded-lg overflow-hidden bg-white">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="w-10 h-10 flex items-center justify-center text-lg font-bold text-gray-700
                      hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    −
                  </button>
                  <span className="min-w-[36px] text-center font-semibold text-gray-800 text-sm px-1">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    disabled={quantity >= product.stockQuantity}
                    className="w-10 h-10 flex items-center justify-center text-lg font-bold text-gray-700
                      hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* AddToCart fills full width on mobile */}
              <div className="w-full">
                <AddToCartButton productId={product.id} />
              </div>
            </div>

            {/* Description */}
            <div className="bg-gray-50/80 rounded-xl p-4">
              <h3 className="text-xs font-bold text-gray-700 uppercase tracking-widest mb-3 border-b border-gray-200 pb-2">
                Description
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed break-words whitespace-pre-line">
                {product.description}
              </p>
            </div>

            {/* Specifications */}
            <div className="border-t border-gray-100 pt-4">
              <h3 className="text-xs font-bold text-gray-700 uppercase tracking-widest mb-3">
                Specifications
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Category", value: product.category?.name || "N/A" },
                  { label: "Stock",    value: `${product.stockQuantity} units` },
                  { label: "Discount", value: `${discountPercent}% OFF` },
                  { label: "Rating",   value: `${averageRating}/5` },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    className="bg-gray-50 border border-gray-100 rounded-lg p-3 flex flex-col gap-1"
                  >
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      {label}
                    </span>
                    <span className="text-sm font-semibold text-gray-800 break-words">{value}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>{/* end RIGHT */}
        </div>{/* end flex row */}
      </div>{/* end card */}
    </div>
  );
}
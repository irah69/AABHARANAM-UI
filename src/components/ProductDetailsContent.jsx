'use client';

import React, { useState, useMemo } from "react";
import { ratingsApi } from "@/lib/apiClient";
import AddToCartButton from "@/components/AddToCartButton";

export default function ProductDetailsContent({ product }) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");
  const [averageRating, setAverageRating] = useState(product.averageRating || 0);
  const [ratingsCount, setRatingsCount] = useState(product.ratingsCount || 0);

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



  // Handler for submitting a rating
  async function handleRatingSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError("");
    setSubmitSuccess("");
    try {
      // TODO: Replace with actual token from auth context if needed
      const token = localStorage.getItem("murgan_access_token") || "";
      const res = await ratingsApi.rateProduct(product.id, {
        rating,
        description: review,
        token,
      });
      setSubmitSuccess("Thank you for your review!");
      setRating(0);
      setReview("");
      // Optionally update average rating and count if returned
      if (res && res.averageRating) setAverageRating(res.averageRating);
      if (res && res.ratingsCount) setRatingsCount(res.ratingsCount);
    } catch (err) {
      setSubmitError(err?.message || "Failed to submit rating.");
    } finally {
      setSubmitting(false);
    }
  }

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

            {/* Ratings & Review Section */}
            <div className="border-t border-gray-100 pt-4">
              <h3 className="text-xs font-bold text-gray-700 uppercase tracking-widest mb-3">
                Ratings & Reviews
              </h3>
              <div className="mb-3 flex items-center gap-2">
                <span className="text-lg font-bold text-yellow-500">★</span>
                <span className="text-base font-semibold text-gray-800">{averageRating ? averageRating.toFixed(1) : "No ratings yet"}</span>
                {ratingsCount > 0 && (
                  <span className="text-xs text-gray-500">({ratingsCount} rating{ratingsCount > 1 ? "s" : ""})</span>
                )}
              </div>
              <form className="flex flex-col gap-2 mt-2" onSubmit={handleRatingSubmit}>
                <label className="text-sm font-semibold text-gray-700">Your Rating:</label>
                <div className="flex gap-1 mb-1">
                  {[1,2,3,4,5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      className={`text-2xl ${rating >= star ? "text-yellow-400" : "text-gray-300"}`}
                      onClick={() => setRating(star)}
                      aria-label={`Rate ${star}`}
                    >★</button>
                  ))}
                </div>
                <textarea
                  className="border rounded p-2 text-sm min-h-[60px]"
                  placeholder="Write your review..."
                  value={review}
                  onChange={e => setReview(e.target.value)}
                  required
                  disabled={submitting}
                />
                <button
                  type="submit"
                  className="bg-red-500 text-white px-4 py-2 rounded font-semibold mt-1 disabled:opacity-60"
                  disabled={submitting || !rating || !review.trim()}
                >
                  {submitting ? "Submitting..." : "Submit Review"}
                </button>
                {submitError && <div className="text-red-600 text-xs mt-1">{submitError}</div>}
                {submitSuccess && <div className="text-green-600 text-xs mt-1">{submitSuccess}</div>}
              </form>
            </div>

          </div>{/* end RIGHT */}
        </div>{/* end flex row */}
      </div>{/* end card */}
    </div>
  );
}
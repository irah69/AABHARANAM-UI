'use client';

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { ratingsApi } from "@/lib/apiClient";
import AddToCartButton from "@/components/AddToCartButton";

export default function ProductDetailsContent({ product }) {
  const { accessToken, isAuthenticated } = useAuth();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");
  const [averageRating, setAverageRating] = useState(0);
  const [ratingsCount, setRatingsCount] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-400 text-lg">
        <p>No product found.</p>
      </div>
    );
  }

  const fetchReviews = useCallback(async () => {
    setReviewsLoading(true);
    try {
      const data = await ratingsApi.getProductRatings(product.id);
      const list = Array.isArray(data) ? data : [];
      setReviews(list);
      if (list.length > 0) {
        const avg = list.reduce((sum, r) => sum + r.rating, 0) / list.length;
        setAverageRating(avg);
        setRatingsCount(list.length);
      } else {
        setAverageRating(0);
        setRatingsCount(0);
      }
    } catch {
      setReviews([]);
    } finally {
      setReviewsLoading(false);
    }
  }, [product.id]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const discount = typeof product.discount === 'number' ? product.discount : Number(product.discount) || 0;
  const finalPrice = product.price && discount > 0 ? (product.price - (product.price * discount / 100)) : product.price;

  const images = Array.isArray(product.imageUrls)
    ? product.imageUrls
    : typeof product.imageUrls === "string"
      ? product.imageUrls.split(",").map((u) => u.trim()).filter(Boolean)
      : [];

  async function handleRatingSubmit(e) {
    e.preventDefault();
    if (!isAuthenticated || !accessToken) {
      setSubmitError("You must be signed in to rate products.");
      setSubmitting(false);
      return;
    }
    setSubmitting(true);
    setSubmitError("");
    setSubmitSuccess("");
    try {
      await ratingsApi.rateProduct(
        product.id,
        { rating, description: review },
        accessToken
      );
      setSubmitSuccess("Thank you for your review!");
      setRating(0);
      setReview("");
      await fetchReviews();
    } catch (err) {
      setSubmitError(err?.message || "Failed to submit rating.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="w-full max-w-full overflow-x-hidden bg-gradient-to-br from-white to-gray-50 min-h-screen px-3 py-5 sm:px-5 sm:py-8 md:px-6 md:py-10">
      <div className="w-full max-w-6xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">

        {/* ── Top section: two-column on md+ ── */}
        <div className="flex flex-col md:flex-row">

          {/* ════════════ LEFT – Images ════════════ */}
          <div className="w-full md:w-[45%] flex-shrink-0 p-4 sm:p-6 flex flex-col gap-4">

            {/* Main image — aspect-[3/4] + object-contain, no white glow overlay */}
            <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden bg-gray-100 shadow">
              {images[selectedImageIndex] ? (
                <img
                  src={images[selectedImageIndex]}
                  alt={product.name}
                  className="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">No image</div>
              )}
              {product.stockQuantity === 0 && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-20">
                  <span className="text-white text-xl font-semibold tracking-wide">Out of Stock</span>
                </div>
              )}
            </div>

            {/* Thumbnails */}
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
                    <img src={img} alt={`View ${i + 1}`} className="w-full h-full object-contain" />
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
                  ₹{finalPrice.toLocaleString()}
                </span>
                {discount > 0 && (
                  <>
                    <span className="text-base text-gray-400 line-through">
                      ₹{product.price.toLocaleString()}
                    </span>
                    <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md">
                      {discount}% OFF
                    </span>
                  </>
                )}
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
                  >−</button>
                  <span className="min-w-[36px] text-center font-semibold text-gray-800 text-sm px-1">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    disabled={quantity >= product.stockQuantity}
                    className="w-10 h-10 flex items-center justify-center text-lg font-bold text-gray-700
                      hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >+</button>
                </div>
              </div>
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

          </div>{/* end RIGHT */}
        </div>{/* end top two-column */}

        {/* ════════════ REVIEWS – Full width below both columns ════════════ */}
        <div className="border-t border-gray-100 p-4 sm:p-6 flex flex-col gap-5">
          <h3 className="text-xs font-bold text-gray-700 uppercase tracking-widest">Reviews</h3>

          {/* Average rating summary */}
          <div className="flex items-center gap-2">
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} className={`text-xl ${averageRating >= star ? "text-yellow-400" : "text-gray-300"}`}>★</span>
              ))}
            </div>
            <span className="text-base font-semibold text-gray-800">
              {averageRating ? averageRating.toFixed(1) : "No ratings yet"}
            </span>
            {ratingsCount > 0 && (
              <span className="text-xs text-gray-500">({ratingsCount} rating{ratingsCount > 1 ? "s" : ""})</span>
            )}
          </div>

          {/* Two-column on md+: form left, reviews list right */}
          <div className="flex flex-col md:flex-row gap-6">

            {/* Submit form */}
            <form
              className="flex flex-col gap-3 bg-gray-50 rounded-xl p-4 w-full md:w-[45%] flex-shrink-0 self-start"
              onSubmit={handleRatingSubmit}
            >
              <label className="text-sm font-semibold text-gray-700">Your Rating:</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    className={`text-2xl transition-colors ${rating >= star ? "text-yellow-400" : "text-gray-300"}`}
                    onClick={() => setRating(star)}
                    aria-label={`Rate ${star}`}
                  >★</button>
                ))}
              </div>
              <textarea
                className="border rounded-lg p-2 text-sm min-h-[100px] resize-none focus:outline-none focus:ring-2 focus:ring-red-200"
                placeholder="Write your review..."
                value={review}
                onChange={e => setReview(e.target.value)}
                required
                disabled={submitting}
              />
              <button
                type="submit"
                className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold disabled:opacity-60 hover:bg-red-600 transition-colors"
                disabled={submitting || !rating || !review.trim()}
              >
                {submitting ? "Submitting..." : "Submit Review"}
              </button>
              {submitError && <p className="text-red-600 text-xs">{submitError}</p>}
              {submitSuccess && <p className="text-green-600 text-xs">{submitSuccess}</p>}
            </form>

            {/* Reviews list */}
            <div className="flex flex-col gap-3 w-full">
              {reviewsLoading ? (
                <p className="text-sm text-gray-400 text-center py-6">Loading reviews...</p>
              ) : reviews.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-6">No reviews yet. Be the first to review!</p>
              ) : (
                reviews.map((r) => (
                  <div key={r.id} className="bg-gray-50 rounded-xl p-3 sm:p-4 flex flex-col gap-1 border border-gray-100">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span key={star} className={`text-base ${r.rating >= star ? "text-yellow-400" : "text-gray-300"}`}>★</span>
                        ))}
                      </div>
                      {r.createdAt && (
                        <span className="text-xs text-gray-400">
                          {new Date(r.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric", month: "short", year: "numeric"
                          })}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed break-words">{r.description}</p>
                  </div>
                ))
              )}
            </div>

          </div>
        </div>{/* end Reviews full width */}

      </div>{/* end card */}
    </div>
  );
}
'use client';

import React, { useState ,useMemo  } from "react";
import AddToCartButton from "@/components/AddToCartButton";
import "../styles/ProductDetailsContent.css";

export default function ProductDetailsContent({ product }) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  if (!product) {
    return (
      <div className="product-details-error">
        <p>No product found.</p>
      </div>
    );
  }

  // compute a deterministic discount based on product id to avoid SSR/client mismatch
  const discountPercent = useMemo(() => {
    // simple pseudo-random: take id mod range
    const base = Number(product.id) || 0;
    return (base % 40) + 10; // yields 10-49%
  }, [product.id]);

  const originalPrice = useMemo(
    () => Math.floor(product.price * (1 + discountPercent / 100)),
    [product.price, discountPercent]
  );

  // fixed delivery date relative to now (should be same on server/client because it's calculated during render)
  const deliveryDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 5);
    return d;
  }, []);

  // Support multiple image URLs separated by comma
  const images = Array.isArray(product.imageUrlss)
    ? product.imageUrlss
    : Array.isArray(product.imageUrls)
      ? product.imageUrls
      : (typeof product.imageUrls === "string"
        ? product.imageUrls.split(",").map(url => url.trim()).filter(Boolean)
        : []);

  // Mock reviews data
  const reviews = [
    {
      id: 1,
      author: "Raj Kumar",
      rating: 5,
      title: "Excellent quality!",
      text: "Great product, fast delivery. Highly recommended!",
      helpful: 245,
      date: "2 months ago",
    },
    {
      id: 2,
      author: "Priya Singh",
      rating: 4,
      title: "Good value for money",
      text: "Good quality but took some time to arrive.",
      helpful: 128,
      date: "1 month ago",
    },
    {
      id: 3,
      author: "Amit Patel",
      rating: 5,
      title: "Perfect fit!",
      text: "Exactly as described. Worth every penny.",
      helpful: 98,
      date: "3 weeks ago",
    },
  ];

  const averageRating = 4.3;
  const totalReviews = 1248;

  return (
    <div className="product-details-container">
      <div className="product-details-wrapper">
        {/* LEFT SECTION - IMAGES */}
        <div className="product-details-left">
          {/* Main Image */}
          <div className="product-main-image-container">
            <div className="product-main-image">
              <img
                src={images[selectedImageIndex]}
                alt={product.name}
                className="main-product-img"
              />
              {product.stockQuantity === 0 && (
                <div className="stock-overlay">Out of Stock</div>
              )}
            </div>

            {/* Wishlist Button */}
            <button
              className={`wishlist-btn ${isWishlisted ? "active" : ""}`}
              onClick={() => setIsWishlisted(!isWishlisted)}
              aria-label="Add to wishlist"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill={isWishlisted ? "currentColor" : "none"}
                stroke="currentColor"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </button>
          </div>

          {/* Thumbnail Images */}
          <div className="product-thumbnails">
            {images.map((img, index) => (
              <div
                key={index}
                className={`thumbnail ${selectedImageIndex === index ? "active" : ""}`}
                onClick={() => setSelectedImageIndex(index)}
              >
                <img src={img} alt={`Product view ${index + 1}`} />
              </div>
            ))}
          </div>

        </div>

        {/* RIGHT SECTION - DETAILS */}
        <div className="product-details-right">
          {/* Product Header */}
          <div className="product-header">
            <span className="text-black">Featured</span>
            <h1 className="product-title">{product.name}</h1>
            <p className="product-seller">by {product.category?.name || "Store"}</p>
          </div>

          {/* Rating Section */}
{/*           <div className="rating-section">
            <div className="rating-box">
              <span className="rating-value">{averageRating}</span>
              <div className="stars">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`star ${i < Math.floor(averageRating) ? "filled" : ""}`}
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                  </svg>
                ))}
              </div>
            </div>
            <p className="rating-count">{totalReviews.toLocaleString()} reviews</p>
          </div> */}

          {/* Price & Discount Section */}
<div className=" bg-white text-black p-4 rounded-lg shadow-md ">
  <div className="price-container  flex items-center gap-3 mb-2">
    <span className="current-price text-2xl text-black font-bold">₹{product.price.toLocaleString()}</span>
    <span className="original-price line-through text-gray-500">₹{originalPrice.toLocaleString()}</span>
    <span className="discount-badge bg-black text-white text-xs font-semibold px-2 py-1 rounded">
      {discountPercent}% OFF
    </span>
  </div>
  <p className="inclusive-price text-sm text-gray-700">inclusive of all taxes</p>
</div>

          {/* Offers Section */}
         {/*  <div className="offers-section">
            <h3 className="section-title">Available Offers</h3>
            <div className="offer-item">
              <span className="offer-icon">🎁</span>
              <div>
                <p className="offer-text">
                  <strong>Bank Offer:</strong> Get 10% off on ICICI Bank credit card
                </p>
              </div>
            </div>
            <div className="offer-item">
              <span className="offer-icon">🚚</span>
              <div>
                <p className="offer-text">
                  <strong>Free delivery:</strong> On this order
                </p>
              </div>
            </div>
            <div className="offer-item">
              <span className="offer-icon">🔄</span>
              <div>
                <p className="offer-text">
                  <strong>Easy Returns:</strong> Return within 14 days of delivery
                </p>
              </div>
            </div>
          </div>
 */}
          {/* Stock & Delivery */}
{/*           <div className="delivery-section">
            <div className="stock-info">
              <p className={`stock-text ${product.stockQuantity > 0 ? "in-stock" : "out-of-stock"}`}>
                {product.stockQuantity > 0 ? "✓ In Stock" : "✗ Out of Stock"}
              </p>
              <p className="stock-count">
                {product.stockQuantity > 0
                  ? `Only ${product.stockQuantity} item(s) left`
                  : "Not available"}
              </p>
            </div>

            <div className="delivery-info">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              <div>
                <p className="delivery-date">
                  Delivery by {deliveryDate.toLocaleDateString("en-IN", {
                    weekday: "long",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
                <p className="delivery-detail">12 PM - 4 PM (Next delivery)</p>
              </div>
            </div>
          </div> */}

          {/* Quantity & Actions */}
          <div className="quantity-actions">
            <div className="quantity-selector">
              <label className="quantity-label">Quantity:</label>
              <div className="quantity-control">
                <button
                  className="qty-btn"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  −
                </button>
                <span className="qty-value">{quantity}</span>
                <button
                  className="qty-btn"
                  onClick={() => setQuantity(quantity + 1)}
                  disabled={quantity >= product.stockQuantity}
                >
                  +
                </button>
              </div>
            </div>

            <div className="action-buttons">
              <AddToCartButton productId={product.id} />
             {/*  <button className="btn-buy-now">Buy Now</button> */}
            </div>
          </div>

          {/* Product Details */}
          <div className="product-description">
            <h3 className="section-title">Description</h3>
            <p className="description-text">{product.description}</p>
          </div>

          {/* Specifications */}
          <div className="specifications">
            <h3 className="section-title">Specifications</h3>
            <div className="spec-grid">
              <div className="spec-item">
                <span className="spec-label">Category</span>
                <span className="spec-value">{product.category?.name || "N/A"}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Stock</span>
                <span className="spec-value">{product.stockQuantity} units</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Discount</span>
                <span className="spec-value">{discountPercent}% OFF</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Rating</span>
                <span className="spec-value">{averageRating}/5</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* REVIEWS SECTION */}

    </div>
  );
}

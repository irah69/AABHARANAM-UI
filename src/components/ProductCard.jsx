'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export default function ProductCard({ product }) {
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || '');
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || '');
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  const stock = product.stockQuantity ?? product.stock ?? 0;
  // Use only the first image URL if multiple are provided, separated by commas
  const imageSrc = Array.isArray(product.imageUrls)
    ? product.imageUrls[0]
    : (typeof product.imageUrls === 'string'
      ? product.imageUrls.split(',').map(url => url.trim()).filter(url => url.length > 0)[0]
      : '/saree2.png');
  const categoryName = product.category?.name || product.categoryName || product.category || '';
  const originalPrice = product.originalPrice;
  const discount =
    typeof originalPrice === 'number' && originalPrice > product.price
      ? Math.round(((originalPrice - product.price) / originalPrice) * 100)
      : 0;

  const handleAddToCart = () => {
    addToCart(product.id, quantity);
    setShowQuickAdd(false);
    setQuantity(1);
  };

  return (
    <div className="pg-product-card bg-white border border-[#e8e8e8] overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
      {/* Image Container */}
      <Link href={`/products/${product.id}`} className="pg-product-card-image-wrapper relative overflow-hidden bg-[#f5f5f5] h-64 flex items-center justify-center group">
        <img
          src={imageSrc}
          alt={product.name}
          className="pg-product-card-image w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {discount > 0 && (
          <div className="pg-product-card-badge absolute top-4 right-4 bg-black text-white px-2 py-1 text-xs font-semibold">
            -{discount}%
          </div>
        )}
        {product.stock < 10 && product.stock > 0 && (
          <div className="absolute bottom-4 left-4 bg-black text-white px-2 py-1 text-xs font-semibold">
            Only {product.stock} Left!
          </div>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
            <span className="text-white text-sm font-light">Out of Stock</span>
          </div>
        )}
      </Link>

      {/* Content Container */}
      <div className="pg-product-card-content p-4 flex-grow flex flex-col">
        {/* Category */}
        <p className="text-xs text-gray-500 mb-2 tracking-wide">
          {typeof product.category === 'object' && product.category !== null ? product.category.name : product.category}
        </p>

        {/* Product Name */}
        <Link href={`/products/${product.id}`} className="hover:text-gray-600 transition">
          <h3 className="font-light text-gray-900 mb-2 line-clamp-2 text-sm">{product.name}</h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center mb-3">
          <div className="flex text-[#d4a574]">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="text-xs">
                {i < Math.floor(product.rating) ? '★' : '☆'}
              </span>
            ))}
          </div>
          <span className="text-xs text-gray-600 ml-2">({product.reviews})</span>
        </div>

        {/* Price */}
        <div className="mb-4">
          <div className="flex items-center gap-2">
            <span className="text-base font-semibold text-gray-900">₹{product.price.toLocaleString()}</span>
            {product.originalPrice > product.price && (
              <span className="text-xs text-gray-500 line-through">
                ₹{product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
        </div>

        {/* Stock Status */}


        {/* Buttons */}
        <div className="mt-auto space-y-2">
          {product.stock > 0 && (
            <>
              <button
                onClick={handleAddToCart}
                className="w-full bg-black text-white py-2 px-3 text-sm font-light hover:bg-gray-900 transition"
              >
                Add to Cart
              </button>
              <button
                onClick={() => setShowQuickAdd(!showQuickAdd)}
                className="w-full border border-black text-black py-2 px-3 text-sm font-light hover:bg-black hover:text-white transition"
                style={{ marginTop: '8px' }}
              >
                {showQuickAdd ? 'Cancel' : 'Quick Add'}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Quick Add Section */}
      {showQuickAdd && product.stock > 0 && (
        <div className="border-t border-[#e8e8e8] p-4 bg-[#f5f5f5] space-y-3">
          {product.colors && product.colors.length > 0 && (
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-2">COLOR</label>
              <select
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                className="w-full border border-black px-2 py-2 text-sm bg-white"
              >
                {product.colors.map((color) => (
                  <option key={color} value={color}>
                    {color}
                  </option>
                ))}
              </select>
            </div>
          )}

          {product.sizes && product.sizes.length > 0 && (
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-2">SIZE</label>
              <select
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="w-full border border-black px-2 py-2 text-sm bg-white"
              >
                {product.sizes.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-2">QUANTITY</label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="border border-black px-2 py-2 hover:bg-black hover:text-white text-sm"
              >
                −
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-12 text-center border border-black py-2 text-sm"
                min="1"
                max={product.stock}
              />
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="border border-black px-2 py-2 hover:bg-black hover:text-white text-sm"
              >
                +
              </button>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            className="w-full bg-black text-white py-2 font-light hover:bg-gray-900 transition text-sm"
          >
            Add to Cart
          </button>
        </div>
      )}
    </div>
  );
}


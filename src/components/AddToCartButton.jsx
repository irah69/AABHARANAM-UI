"use client";
import { useCart } from "@/context/CartContext";
import { useState } from "react";

export default function AddToCartButton({ productId }) {
  const { addToCart, isMutating } = useCart();
  const [added, setAdded] = useState(false);

  const handleClick = async () => {
    const addedToCart = await addToCart(productId, 1);
    if (!addedToCart) return;
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <button
      onClick={handleClick}
      disabled={isMutating}
      className="w-full bg-black text-white py-2 mt-4 font-light hover:bg-gray-900 transition text-sm rounded"
    >
      {added ? "Added!" : isMutating ? "Adding..." : "Add to Cart"}
    </button>
  );
}

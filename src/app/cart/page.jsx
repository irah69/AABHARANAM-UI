"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

const styles = `
  @import url("https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800;900&display=swap");

  .cart-root {
    font-family: 'Playfair Display', serif;
    background: #fff;
    min-height: 100vh;
    color: #111;
  }

  /* ── UNAUTHENTICATED ── */
  .cart-unauth {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 80vh;
    padding: 48px 24px;
    text-align: center;
  }

  .cart-unauth-icon {
    font-size: 2.8rem;
    margin-bottom: 24px;
    opacity: 0.5;
  }

  .cart-unauth h1 {
    font-size: clamp(1.6rem, 6vw, 2.4rem);
    font-weight: 800;
    letter-spacing: -0.02em;
    line-height: 1.1;
    margin: 0 0 12px;
  }

  .cart-unauth p {
    font-size: 0.9rem;
    color: #999;
    margin: 0 0 32px;
    max-width: 320px;
    font-weight: 400;
    line-height: 1.6;
  }

  .cart-unauth-actions {
    display: flex;
    align-items: center;
    gap: 24px;
    flex-wrap: wrap;
    justify-content: center;
  }

  .btn-primary {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 12px 32px;
    background: #111;
    color: #fff;
    font-family: 'Playfair Display', serif;
    font-size: 0.82rem;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    text-decoration: none;
    border: none;
    cursor: pointer;
    transition: background 0.15s;
  }

  .btn-primary:hover { background: #333; }
  .btn-primary:disabled { opacity: 0.45; cursor: not-allowed; }

  .btn-ghost {
    font-family: 'Playfair Display', serif;
    font-size: 0.82rem;
    color: #888;
    text-decoration: none;
    letter-spacing: 0.06em;
    transition: color 0.15s;
    background: none;
    border: none;
    cursor: pointer;
  }

  .btn-ghost:hover { color: #111; }

  /* ── POPULAR GRID ── */
  .popular-section {
    border-top: 1px solid #e8e8e8;
    padding: 48px 24px;
    max-width: 860px;
    margin: 0 auto;
  }

  .popular-label {
    font-size: 0.72rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #bbb;
    margin-bottom: 20px;
    text-align: center;
  }

  .popular-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  @media (min-width: 600px) {
    .popular-grid { grid-template-columns: repeat(4, 1fr); }
  }

  .popular-card {
    display: block;
    text-decoration: none;
    color: #111;
  }

  .popular-card img {
    width: 100%;
    aspect-ratio: 4/5;
    object-fit: cover;
    display: block;
    background: #f5f5f5;
    transition: opacity 0.2s;
  }

  .popular-card:hover img { opacity: 0.88; }

  .popular-card p {
    font-size: 0.8rem;
    font-weight: 500;
    margin: 8px 0 0;
    letter-spacing: 0.02em;
  }

  /* ── HEADER ── */
  .cart-header {
    padding: 40px 20px 20px;
    border-bottom: 1.5px solid #111;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    max-width: 960px;
    margin: 0 auto;
  }

  .cart-title {
    font-size: clamp(1.8rem, 7vw, 3rem);
    font-weight: 800;
    letter-spacing: -0.02em;
    line-height: 1;
    margin: 0;
  }

  .cart-item-count {
    font-size: 0.75rem;
    color: #999;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    padding-bottom: 4px;
  }

  /* ── BODY ── */
  .cart-body {
    max-width: 960px;
    margin: 0 auto;
    padding: 0 20px 80px;
  }

  /* ── EMPTY ── */
  .cart-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 50vh;
    text-align: center;
    gap: 8px;
  }

  .cart-empty-icon { font-size: 2.4rem; opacity: 0.3; margin-bottom: 12px; }

  .cart-empty h2 {
    font-size: clamp(1.3rem, 5vw, 1.9rem);
    font-weight: 700;
    margin: 0 0 6px;
    letter-spacing: -0.01em;
  }

  .cart-empty p {
    font-size: 0.82rem;
    color: #bbb;
    margin: 0 0 20px;
    font-weight: 400;
  }

  /* ── LAYOUT ── */
  .cart-layout {
    display: grid;
    grid-template-columns: 1fr;
    gap: 0;
    margin-top: 0;
  }

  @media (min-width: 900px) {
    .cart-layout {
      grid-template-columns: 1fr 320px;
      gap: 48px;
      align-items: start;
    }
  }

  /* ── ITEM ── */
  .cart-item {
    display: grid;
    grid-template-columns: 88px 1fr;
    gap: 16px;
    padding: 20px 0;
    border-bottom: 1px solid #ebebeb;
    align-items: start;
  }

  .cart-item-img {
    width: 88px;
    height: 110px;
    object-fit: cover;
    background: #f5f5f5;
    display: block;
  }

  .cart-item-info { flex: 1; min-width: 0; }

  .cart-item-name {
    font-size: 0.95rem;
    font-weight: 700;
    margin: 0 0 4px;
    letter-spacing: -0.005em;
    line-height: 1.3;
  }

  .cart-item-price {
    font-size: 0.8rem;
    color: #888;
    margin: 0 0 14px;
    font-weight: 400;
  }

  .cart-item-controls {
    display: flex;
    align-items: center;
    gap: 0;
    border: 1px solid #ddd;
    width: fit-content;
  }

  .qty-btn {
    width: 34px;
    height: 34px;
    background: #fff;
    border: none;
    font-size: 1rem;
    cursor: pointer;
    font-family: 'Playfair Display', serif;
    color: #111;
    transition: background 0.12s;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .qty-btn:hover { background: #f5f5f5; }

  .qty-input {
    width: 40px;
    height: 34px;
    border: none;
    border-left: 1px solid #ddd;
    border-right: 1px solid #ddd;
    text-align: center;
    font-family: 'Playfair Display', serif;
    font-size: 0.88rem;
    font-weight: 600;
    color: #111;
    background: #fff;
    outline: none;
    -moz-appearance: textfield;
  }

  .qty-input::-webkit-inner-spin-button,
  .qty-input::-webkit-outer-spin-button { -webkit-appearance: none; }

  .cart-item-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 12px;
  }

  .line-total {
    font-size: 0.82rem;
    font-weight: 700;
    color: #111;
  }

  .remove-btn {
    font-family: 'Playfair Display', serif;
    font-size: 0.72rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #bbb;
    background: none;
    border: none;
    cursor: pointer;
    text-decoration: none;
    transition: color 0.15s;
    padding: 0;
  }

  .remove-btn:hover { color: #111; }

  /* ── SUMMARY ── */
  .cart-summary {
    padding: 24px 0;
    border-top: 1.5px solid #111;
  }

  @media (min-width: 900px) {
    .cart-summary {
      border: 1.5px solid #111;
      padding: 28px;
      position: sticky;
      top: 24px;
    }
  }

  .summary-title {
    font-size: 0.72rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #bbb;
    margin: 0 0 20px;
  }

  .summary-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.85rem;
    color: #666;
    margin-bottom: 10px;
  }

  .summary-row.total {
    font-size: 1.1rem;
    font-weight: 800;
    color: #111;
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid #ebebeb;
    letter-spacing: -0.01em;
  }

  .checkout-btn {
    width: 100%;
    margin-top: 24px;
    padding: 15px;
    background: #111;
    color: #fff;
    font-family: 'Playfair Display', serif;
    font-size: 0.82rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    border: none;
    cursor: pointer;
    transition: background 0.15s;
  }

  .checkout-btn:hover:not(:disabled) { background: #333; }
  .checkout-btn:disabled { opacity: 0.4; cursor: not-allowed; }

  /* ── ERROR ── */
  .cart-error {
    margin: 16px 0;
    padding: 12px 16px;
    border-left: 3px solid #111;
    background: #fafafa;
    font-size: 0.82rem;
    color: #555;
  }

  /* ── LOADING ── */
  .cart-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 50vh;
    gap: 14px;
  }

  .loading-bar {
    height: 1.5px;
    background: #111;
    animation: pulse 1.1s ease-in-out infinite alternate;
  }

  @keyframes pulse {
    from { width: 24px; opacity: 0.2; }
    to   { width: 64px; opacity: 1; }
  }

  .loading-text {
    font-size: 0.72rem;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: #bbb;
  }
`;

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

  /* ── NOT SIGNED IN ── */
  if (!isAuthenticated) {
    return (
      <>
        <style>{styles}</style>
        <div className="cart-root">
          <div className="cart-unauth">
            <div className="cart-unauth-icon">◻</div>
            <h1>Sign in to view your cart</h1>
            <p>Your saved items and checkout details will appear here once you sign in.</p>
            <div className="cart-unauth-actions">
              <Link href="/signin?next=/cart" className="btn-primary">
                Sign in
              </Link>
              <Link href="/products" className="btn-ghost">
                Browse products →
              </Link>
            </div>
          </div>

          <div className="popular-section">
            <p className="popular-label">Popular right now</p>
            <div className="popular-grid">
              {["Elegant Saree", "Party Dress", "Summer Outfit", "Traditional Wear"].map((name) => (
                <Link key={name} href="/products" className="popular-card">
                  <img src="/saree.png" alt={name} />
                  <p>{name}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  }

  /* ── CART PAGE ── */
  return (
    <>
      <style>{styles}</style>
      <div className="cart-root">
        <div className="cart-header">
          <h1 className="cart-title">Cart</h1>
          {!isLoading && items.length > 0 && (
            <span className="cart-item-count">{getTotalItems()} item{getTotalItems() !== 1 ? "s" : ""}</span>
          )}
        </div>

        <div className="cart-body">
          {(localError || error) && (
            <div className="cart-error">{localError || error?.message}</div>
          )}

          {isLoading ? (
            <div className="cart-loading">
              <div className="loading-bar" />
              <span className="loading-text">Loading</span>
            </div>
          ) : items.length === 0 ? (
            /* ── EMPTY ── */
            <div className="cart-empty">
              <div className="cart-empty-icon">◻</div>
              <h2>Your cart is empty</h2>
              <p>Let's find something you'll love.</p>
              <Link href="/products" className="btn-primary" style={{ marginTop: "8px" }}>
                Browse products
              </Link>
            </div>
          ) : (
            <div className="cart-layout">
              {/* ── ITEMS ── */}
              <div>
                {items.map((item) => {
                  const product = item.product || item;
                  const productId = item.productId ?? product.id;
                  const qty = item.quantity ?? 0;
                  const imageSrc = product.imageUrls || product.image || "/saree.png";
                  const name = product.name || `Product #${productId}`;
                  const price = product.price ?? 0;
                  const lineTotal = price * qty;

                  return (
                    <div key={productId} className="cart-item">
                      <img src={imageSrc} alt={name} className="cart-item-img" />

                      <div className="cart-item-info">
                        <p className="cart-item-name">{name}</p>
                        <p className="cart-item-price">₹{price} each</p>

                        <div className="cart-item-controls">
                          <button
                            className="qty-btn"
                            onClick={() => setQuantity(productId, Math.max(0, qty - 1))}
                          >−</button>
                          <input
                            className="qty-input"
                            value={qty}
                            inputMode="numeric"
                            onChange={(e) => {
                              const next = Number(e.target.value);
                              if (Number.isFinite(next)) setQuantity(productId, next);
                            }}
                          />
                          <button
                            className="qty-btn"
                            onClick={() => setQuantity(productId, qty + 1)}
                          >+</button>
                        </div>

                        <div className="cart-item-footer">
                          <span className="line-total">₹{lineTotal.toLocaleString("en-IN")}</span>
                          <button
                            className="remove-btn"
                            onClick={async () => {
                              setLocalError("");
                              try { await removeItem(productId); }
                              catch (e) { setLocalError(e?.message || "Failed to remove item."); }
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* ── SUMMARY ── */}
              <div className="cart-summary">
                <p className="summary-title">Order summary</p>
                <div className="summary-row">
                  <span>Items</span>
                  <span>{getTotalItems()}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping</span>
                  <span style={{ color: "#111", fontSize: "0.78rem", letterSpacing: "0.04em" }}>
                    Calculated at checkout
                  </span>
                </div>
                <div className="summary-row total">
                  <span>Total</span>
                  <span>₹{Number(getTotalPrice()).toLocaleString("en-IN")}</span>
                </div>
                <button
                  className="checkout-btn"
                  disabled={items.length === 0 || isMutating}
                  onClick={() => router.push("/checkout")}
                >
                  Proceed to checkout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
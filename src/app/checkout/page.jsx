"use client";
import { paymentApi } from "@/lib/apiClient";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

import { useCart } from "@/context/CartContext";

const styles = `
  @import url("https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800;900&display=swap");

  *, *::before, *::after { box-sizing: border-box; }

  .co-root {
    font-family: 'Playfair Display', serif;
    background: #fff;
    min-height: 100vh;
    color: #111;
  }

  .co-header {
    padding: 40px 20px 20px;
    border-bottom: 1.5px solid #111;
    max-width: 680px;
    margin: 0 auto;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 12px;
    flex-wrap: wrap;
  }

  .co-title {
    font-size: clamp(1.8rem, 7vw, 3rem);
    font-weight: 800;
    letter-spacing: -0.02em;
    line-height: 1;
    margin: 0;
  }

  .co-back {
    font-size: 0.72rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #bbb;
    text-decoration: none;
    padding-bottom: 4px;
    transition: color 0.15s;
  }
  .co-back:hover { color: #111; }

  .co-body {
    max-width: 680px;
    margin: 0 auto;
    padding: 0 20px 80px;
  }

  /* order meta strip */
  .co-meta {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 18px 0 0;
    font-size: 0.75rem;
    color: #999;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    border-bottom: 1px solid #ebebeb;
    padding-bottom: 18px;
    margin-bottom: 28px;
  }
  .co-meta strong { color: #111; font-weight: 700; }

  /* section labels */
  .co-section {
    font-size: 0.65rem;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: #bbb;
    display: block;
    margin: 0 0 14px;
  }
  .co-section.mt { margin-top: 28px; }

  .co-group { margin-bottom: 14px; }

  .co-label {
    display: block;
    font-size: 0.65rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #999;
    margin-bottom: 6px;
  }

  .co-input,
  .co-textarea {
    display: block;
    width: 100%;
    padding: 13px 14px;
    border: 1px solid #ddd;
    border-radius: 0;
    font-family: 'Playfair Display', serif;
    font-size: 0.92rem;
    color: #111;
    background: #fff;
    outline: none;
    transition: border-color 0.15s;
    -webkit-appearance: none;
    appearance: none;
  }
  .co-input:focus, .co-textarea:focus { border-color: #111; }
  .co-input::placeholder, .co-textarea::placeholder { color: #ccc; font-weight: 400; }

  .co-textarea {
    min-height: 120px;
    resize: vertical;
    line-height: 1.7;
  }

  .co-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }
  @media (max-width: 480px) { .co-row { grid-template-columns: 1fr; } }

  /* cod note */
  .co-cod {
    margin-top: 20px;
    padding: 14px 16px;
    border: 1px solid #ebebeb;
    background: #fafafa;
    display: flex;
    align-items: flex-start;
    gap: 10px;
  }
  .co-cod-dot {
    width: 7px; height: 7px;
    border-radius: 50%;
    background: #ccc;
    flex-shrink: 0;
    margin-top: 5px;
  }
  .co-cod p {
    font-size: 0.78rem;
    color: #888;
    margin: 0;
    line-height: 1.6;
    font-weight: 400;
  }

  /* submit button */
  .co-btn {
    width: 100%;
    margin-top: 24px;
    padding: 15px 20px;
    background: #111;
    color: #fff;
    font-family: 'Playfair Display', serif;
    font-size: 0.78rem;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    border: none;
    cursor: pointer;
    transition: background 0.15s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
  }
  .co-btn:hover:not(:disabled) { background: #2a2a2a; }
  .co-btn:disabled { opacity: 0.4; cursor: not-allowed; }
  .co-btn-amt { opacity: 0.55; font-weight: 400; font-size: 0.75rem; }

  /* error */
  .co-error {
    margin: 0 0 20px;
    padding: 12px 16px;
    border-left: 2px solid #111;
    background: #fafafa;
    font-size: 0.8rem;
    color: #555;
  }

  /* unauthenticated */
  .co-unauth {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 60vh;
    text-align: center;
    padding: 40px 24px;
    gap: 10px;
  }
  .co-unauth h1 {
    font-size: clamp(1.5rem, 5vw, 2.2rem);
    font-weight: 800;
    letter-spacing: -0.02em;
    margin: 0 0 8px;
  }
  .co-unauth p {
    font-size: 0.85rem;
    color: #999;
    margin: 0 0 24px;
    font-weight: 400;
  }

  /* success */
  .co-success {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 70vh;
    padding: 40px 24px;
    text-align: center;
    gap: 10px;
  }
  .co-success-mark {
    width: 52px; height: 52px;
    border: 1.5px solid #111;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.3rem;
    margin-bottom: 20px;
  }
  .co-success h2 {
    font-size: clamp(1.4rem, 5vw, 2rem);
    font-weight: 800;
    letter-spacing: -0.02em;
    margin: 0 0 8px;
  }
  .co-success p {
    font-size: 0.85rem;
    color: #999;
    margin: 0 0 28px;
    max-width: 320px;
    font-weight: 400;
    line-height: 1.6;
  }
  .co-success-btns {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
    justify-content: center;
  }

  .co-btn-solid {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 13px 28px;
    background: #111;
    color: #fff;
    font-family: 'Playfair Display', serif;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    text-decoration: none;
    border: none;
    cursor: pointer;
    transition: background 0.15s;
  }
  .co-btn-solid:hover { background: #333; }

  .co-btn-outline {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 13px 28px;
    background: #fff;
    color: #111;
    font-family: 'Playfair Display', serif;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    text-decoration: none;
    border: 1px solid #ddd;
    cursor: pointer;
    transition: border-color 0.15s;
  }
  .co-btn-outline:hover { border-color: #111; }
`;

export default function CheckoutPage() {
  const router = useRouter();
  const { isAuthenticated, isHydrated, accessToken } = useAuth();
  const { cartItems, checkout, isMutating, getTotalPrice } = useCart();

  const [shippingAddress, setShippingAddress] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null);

  if (!isHydrated) return null;

  /* ── NOT SIGNED IN ── */
  if (!isAuthenticated) {
    return (
      <>
        <style>{styles}</style>
        <div className="co-root">
          <div className="co-unauth">
            <h1>Sign in to checkout</h1>
            <p>Please sign in to complete your purchase.</p>
            <Link href="/signin?next=/checkout" className="co-btn-solid">
              Sign in
            </Link>
          </div>
        </div>
      </>
    );
  }
/* global Razorpay */
const onSubmit = async (e) => {
  e.preventDefault();

  setError("");
  console.log("Shipping Address:", shippingAddress);
console.log("Type:", typeof shippingAddress);
  try {
    
    const order = await paymentApi.createOrder(
  {
    shippingAddress,
  },
  accessToken
);

    const options = {
      key: "rzp_test_T6kaciGdYOYzsp", // replace with your Key ID

      amount: order.amount,

      currency: order.currency,

      order_id: order.id,

      name: "AABHARANAM",

      description: "Order Payment",

      handler: async function (response) {

  try {

    await paymentApi.verifyPayment(
      {
        razorpayOrderId: response.razorpay_order_id,
        razorpayPaymentId: response.razorpay_payment_id,
        razorpaySignature: response.razorpay_signature,
        shippingAddress,
      },
      accessToken
    );

    alert("Payment Successful!");

    setSuccess(true);

  } catch (err) {

    console.error(err);

    alert("Payment verification failed.");

  }

},
      prefill: {
        name: "",
        email: "",
        contact: "",
      },

      theme: {
        color: "#111111",
      },
    };

    const razorpay = new window.Razorpay(options);

    razorpay.open();

  } catch (err) {

    console.error(err);

    setError(err.message || "Unable to create payment.");

  }
};

  /* ── SUCCESS ── */
  if (success) {
    return (
      <>
        <style>{styles}</style>
        <div className="co-root">
          <div className="co-success">
            <div className="co-success-mark">✓</div>
            <h2>Order confirmed</h2>
            <p>Your order was placed successfully. You can view your order history on the orders page.</p>
            <div className="co-success-btns">
              <button onClick={() => router.replace("/orders")} className="co-btn-solid">
                View orders
              </button>
              <button onClick={() => router.replace("/products")} className="co-btn-outline">
                Continue shopping
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  /* ── CHECKOUT FORM ── */
  return (
    <>
      <style>{styles}</style>
      <div className="co-root">
        <div className="co-header">
          <h1 className="co-title">Checkout</h1>
          <Link href="/cart" className="co-back">← Back to cart</Link>
        </div>

        <div className="co-body">
          <div className="co-meta">
            <span>{cartItems.length} item{cartItems.length !== 1 ? "s" : ""}</span>
            <span>·</span>
            <strong>₹{Number(getTotalPrice()).toLocaleString("en-IN")}</strong>
          </div>

          {error && <div className="co-error">{error}</div>}

          <form onSubmit={onSubmit}>
            <span className="co-section">Shipping address</span>

            <div className="co-group">
              <label className="co-label">Full address</label>
              <textarea
                className="co-textarea"
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                placeholder="House no, street, city, state, pincode…"
                required
              />
            </div>

            <div className="co-cod">
              <div className="co-cod-dot" />
              <p>Payment is collected on delivery. No card details required.</p>
            </div>

            <button
              type="submit"
              className="co-btn"
              disabled={isMutating || cartItems.length === 0}
            >
              {isMutating ? "Placing order…" : "Place order"}
              {!isMutating && (
                <span className="co-btn-amt">
                  · ₹{Number(getTotalPrice()).toLocaleString("en-IN")}
                </span>
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
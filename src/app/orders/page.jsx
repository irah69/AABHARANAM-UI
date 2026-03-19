"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Package, ChevronRight, ShoppingBag, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { userApi } from "@/lib/apiClient";
import { normalizePage } from "@/lib/pagination";

/* ─── STATUS BADGE ──────────────────────────────────────────────────── */
const statusStyles = {
  delivered:  { bg: "#f0faf3", color: "#1a7a3a", dot: "#2da44e" },
  shipped:    { bg: "#fff8e7", color: "#8a5a00", dot: "#f0a500" },
  processing: { bg: "#f0f4ff", color: "#2d4db0", dot: "#4361ee" },
  cancelled:  { bg: "#fff0f0", color: "#b02d2d", dot: "#e03131" },
  default:    { bg: "#f5f5f5", color: "#555",    dot: "#aaa"    },
};

function StatusBadge({ status }) {
  const key = (status || "").toLowerCase();
  const s = statusStyles[key] || statusStyles.default;
  const label = status || "Processing";
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: "6px",
      padding: "4px 10px", borderRadius: "2px",
      background: s.bg, color: s.color,
      fontSize: "0.7rem", fontWeight: 700,
      letterSpacing: "0.08em", textTransform: "uppercase",
      fontFamily: "'DM Sans', sans-serif",
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.dot, flexShrink: 0 }} />
      {label}
    </span>
  );
}

/* ─── SKELETON LOADER ───────────────────────────────────────────────── */
function OrderSkeleton() {
  return (
    <div style={{ border: "1px solid #ebebeb", borderRadius: "4px", overflow: "hidden", background: "#fff" }}>
      <div style={{ padding: "20px 24px", borderBottom: "1px solid #f0f0f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={skBar(120, 14)} />
          <div style={{ ...skBar(80, 11), marginTop: 8 }} />
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={skBar(60, 14)} />
          <div style={{ ...skBar(90, 12), marginTop: 8 }} />
        </div>
      </div>
      {[1, 2].map(i => (
        <div key={i} style={{ display: "flex", gap: 16, padding: "18px 24px", borderBottom: "1px solid #f5f5f5" }}>
          <div style={{ width: 72, height: 90, background: "#f0f0f0", borderRadius: "3px", flexShrink: 0, animation: "pulse 1.5s ease-in-out infinite" }} />
          <div style={{ flex: 1 }}>
            <div style={skBar(200, 13)} />
            <div style={{ ...skBar(80, 11), marginTop: 8 }} />
          </div>
          <div style={skBar(60, 13)} />
        </div>
      ))}
    </div>
  );
}
const skBar = (w, h) => ({
  width: w, height: h, borderRadius: 3,
  background: "linear-gradient(90deg,#f0f0f0 25%,#e0e0e0 50%,#f0f0f0 75%)",
  backgroundSize: "200% 100%",
  animation: "pulse 1.5s ease-in-out infinite",
});

/* ─── MAIN PAGE ─────────────────────────────────────────────────────── */
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

  /* ── NOT LOGGED IN ──────────────────────────────────────────────── */
  if (!isAuthenticated) {
    return (
      <>
        <style>{globalStyles}</style>
        <section style={{
          minHeight: "80vh", display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          background: "#fff", padding: "48px 20px", textAlign: "center",
        }}>
          <div style={{
            width: 80, height: 80, background: "#f5f5f5", borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            marginBottom: 28,
          }}>
            <ShoppingBag size={36} color="#111" strokeWidth={1.4} />
          </div>

          <p style={{ fontSize: "0.7rem", letterSpacing: "0.18em", color: "#999", textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif", marginBottom: 12 }}>
            Your Orders
          </p>

          <h1 style={{
            fontSize: "clamp(1.6rem, 5vw, 2.2rem)", fontWeight: 700,
            fontFamily: "'Playfair Display', serif", color: "#111",
            lineHeight: 1.15, margin: "0 0 14px",
          }}>
            Sign in to see your<br />order history
          </h1>

          <p style={{
            fontSize: "0.88rem", color: "#888", lineHeight: 1.8,
            maxWidth: 280, margin: "0 0 36px",
            fontFamily: "'DM Sans', sans-serif",
          }}>
            Track, return or buy the things you love.
          </p>

          <Link href="/signin?next=/orders" style={{
            display: "inline-flex", alignItems: "center", gap: 10,
            background: "#111", color: "#fff",
            padding: "14px 40px", borderRadius: "3px",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "0.78rem", fontWeight: 700,
            letterSpacing: "0.12em", textTransform: "uppercase",
            textDecoration: "none", transition: "background 0.2s",
          }}
          onMouseEnter={e => e.currentTarget.style.background = "#333"}
          onMouseLeave={e => e.currentTarget.style.background = "#111"}
          >
            Sign In <ArrowRight size={14} />
          </Link>
        </section>
      </>
    );
  }

  /* ── AUTHENTICATED ─────────────────────────────────────────────── */
  return (
    <>
      <style>{globalStyles}</style>
      <div style={{ background: "#fafafa", minHeight: "100vh" }}>

        {/* TOP NAV BREADCRUMB */}
        <div style={{ background: "#fff", borderBottom: "1px solid #ebebeb", padding: "12px 0" }}>
          <div style={container}>
            <nav style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.72rem", color: "#888", fontFamily: "'DM Sans', sans-serif" }}>
              <Link href="/" style={{ color: "#888", textDecoration: "none" }}>Home</Link>
              <ChevronRight size={12} />
              <span style={{ color: "#111", fontWeight: 600 }}>My Orders</span>
            </nav>
          </div>
        </div>

        <div style={{ ...container, paddingTop: 32, paddingBottom: 64 }}>

          {/* PAGE HEADER */}
          <div style={{ marginBottom: 28 }}>
            <h1 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(1.5rem, 4vw, 2rem)",
              fontWeight: 700, color: "#111", margin: 0, lineHeight: 1.2,
            }}>
              My Orders
            </h1>
            {!ordersQuery.isLoading && pageData.items.length > 0 && (
              <p style={{ margin: "6px 0 0", fontSize: "0.82rem", color: "#888", fontFamily: "'DM Sans', sans-serif" }}>
                {pageData.items.length} order{pageData.items.length !== 1 ? "s" : ""} found
              </p>
            )}
          </div>

          {/* LOADING */}
          {ordersQuery.isLoading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[1, 2].map(i => <OrderSkeleton key={i} />)}
            </div>
          ) : ordersQuery.isError ? (

            /* ERROR */
            <div style={{
              background: "#fff", border: "1px solid #ebebeb", borderRadius: "4px",
              padding: "60px 24px", textAlign: "center",
            }}>
              <div style={{
                width: 56, height: 56, background: "#fff0f0", borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 20px",
              }}>
                <Package size={24} color="#e03131" />
              </div>
              <p style={{ fontFamily: "'DM Sans', sans-serif", color: "#555", fontSize: "0.9rem", margin: "0 0 16px" }}>
                Something went wrong. Please try again.
              </p>
              <button
                onClick={() => ordersQuery.refetch()}
                style={{
                  background: "#111", color: "#fff", border: "none",
                  padding: "11px 28px", borderRadius: "3px", cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif", fontSize: "0.78rem",
                  fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
                }}
              >
                Retry
              </button>
            </div>

          ) : pageData.items.length === 0 ? (

            /* EMPTY */
            <div style={{
              background: "#fff", border: "1px solid #ebebeb", borderRadius: "4px",
              display: "flex", flexDirection: "column", alignItems: "center",
              justifyContent: "center", minHeight: "55vh", padding: "60px 24px",
              textAlign: "center",
            }}>
              <div style={{
                width: 100, height: 100, background: "#f5f5f5", borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                marginBottom: 28,
              }}>
                <Package size={44} color="#bbb" strokeWidth={1.3} />
              </div>

              <p style={{ fontSize: "0.7rem", letterSpacing: "0.18em", color: "#aaa", textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif", marginBottom: 12 }}>
                Nothing here yet
              </p>

              <h2 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(1.3rem, 4vw, 1.8rem)",
                fontWeight: 700, color: "#111",
                margin: "0 0 12px", lineHeight: 1.2,
              }}>
                You haven't placed<br />any orders yet
              </h2>

              <p style={{ fontSize: "0.85rem", color: "#999", margin: "0 0 36px", fontFamily: "'DM Sans', sans-serif" }}>
                Explore our collection and find something you love.
              </p>

              <Link href="/products" style={{
                display: "inline-flex", alignItems: "center", gap: 10,
                background: "#111", color: "#fff",
                padding: "13px 36px", borderRadius: "3px",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.78rem", fontWeight: 700,
                letterSpacing: "0.12em", textTransform: "uppercase",
                textDecoration: "none",
              }}>
                Shop Now <ArrowRight size={14} />
              </Link>
            </div>

          ) : (

            /* ORDER LIST */
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {pageData.items.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}

              {/* PAGINATION */}
              {(pageData.totalPages > 1) && (
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 12, marginTop: 24 }}>
                  <button
                    onClick={() => setPage(p => Math.max(0, p - 1))}
                    disabled={page === 0}
                    style={paginationBtn(page === 0)}
                  >
                    ← Prev
                  </button>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.82rem", color: "#666" }}>
                    Page {page + 1} of {pageData.totalPages}
                  </span>
                  <button
                    onClick={() => setPage(p => Math.min(pageData.totalPages - 1, p + 1))}
                    disabled={page >= pageData.totalPages - 1}
                    style={paginationBtn(page >= pageData.totalPages - 1)}
                  >
                    Next →
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

/* ─── ORDER CARD ─────────────────────────────────────────────────────── */
function OrderCard({ order }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{
        background: "#fff",
        border: `1px solid ${hovered ? "#ccc" : "#ebebeb"}`,
        borderRadius: "4px",
        overflow: "hidden",
        transition: "border-color 0.2s, box-shadow 0.2s",
        boxShadow: hovered ? "0 4px 20px rgba(0,0,0,0.07)" : "none",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* ORDER HEADER */}
      <div style={{
        padding: "16px 20px",
        borderBottom: "1px solid #f0f0f0",
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        background: "#fafafa",
      }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "20px 40px" }}>
          <div>
            <p style={metaLabel}>Order ID</p>
            <p style={metaValue}>#{order.id}</p>
          </div>
          {order.createdAt && (
            <div>
              <p style={metaLabel}>Placed On</p>
              <p style={metaValue}>{new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
            </div>
          )}
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 12 }}>
          <StatusBadge status={order.status} />
          {typeof order.total === "number" && (
            <span style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 800, fontSize: "1rem", color: "#111",
            }}>
              ₹{order.total.toLocaleString("en-IN")}
            </span>
          )}
        </div>
      </div>

      {/* ORDER ITEMS */}
      {Array.isArray(order.items) && order.items.length > 0 && (
        <div>
          {order.items.map((it, idx) => (
            <OrderItem key={idx} item={it} isLast={idx === order.items.length - 1} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── ORDER ITEM ROW ─────────────────────────────────────────────────── */
function OrderItem({ item: it, isLast }) {
  const [hovered, setHovered] = useState(false);
  const product = it.product || {};
  const name = product.name || `Product #${it.productId}`;

  let image = "/logo.png";
  const imageUrlsSource = product.imageUrls ?? it.imageUrls;
  let urls = [];
  if (Array.isArray(imageUrlsSource)) {
    urls = imageUrlsSource.filter(u => typeof u === "string" && u.trim());
  } else if (typeof imageUrlsSource === "string") {
    urls = imageUrlsSource.split(",").map(u => u.trim()).filter(Boolean);
  }
  if (urls[0]) image = urls[0];

  const price = it.unitPrice ?? 0;
  const qty = it.quantity ?? 0;

  return (
    <Link
      href={`/products/${it.productId ?? product.id}`}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        padding: "16px 20px",
        borderBottom: isLast ? "none" : "1px solid #f5f5f5",
        textDecoration: "none",
        color: "inherit",
        background: hovered ? "#fafafa" : "#fff",
        transition: "background 0.15s",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* IMAGE */}
      <div style={{
        width: 72, height: 90,
        borderRadius: "3px",
        overflow: "hidden",
        flexShrink: 0,
        background: "#f5f5f5",
        border: "1px solid #ebebeb",
      }}>
        <img
          src={image}
          alt={name}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          onError={e => { e.currentTarget.src = "/logo.png"; }}
        />
      </div>

      {/* INFO */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 600, fontSize: "0.88rem",
          color: "#111", margin: "0 0 5px",
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        }}>
          {name}
        </p>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.78rem", color: "#888", margin: 0 }}>
          Qty: {qty}
          {price > 0 && <> &nbsp;·&nbsp; ₹{price.toLocaleString("en-IN")} each</>}
        </p>
      </div>

      {/* TOTAL + ARROW */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
        <span style={{
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 700, fontSize: "0.9rem", color: "#111",
        }}>
          ₹{(price * qty).toLocaleString("en-IN")}
        </span>
        <ChevronRight size={16} color="#bbb" />
      </div>
    </Link>
  );
}

/* ─── SHARED STYLES ─────────────────────────────────────────────────── */
const container = {
  maxWidth: 960,
  margin: "0 auto",
  padding: "0 16px",
};

const metaLabel = {
  fontFamily: "'DM Sans', sans-serif",
  fontSize: "0.68rem", color: "#aaa",
  textTransform: "uppercase", letterSpacing: "0.1em",
  margin: "0 0 3px",
};

const metaValue = {
  fontFamily: "'DM Sans', sans-serif",
  fontSize: "0.83rem", color: "#333",
  fontWeight: 600, margin: 0,
};

const paginationBtn = (disabled) => ({
  fontFamily: "'DM Sans', sans-serif",
  fontSize: "0.78rem", fontWeight: 700,
  letterSpacing: "0.08em", textTransform: "uppercase",
  padding: "10px 20px", borderRadius: "3px",
  border: "1.5px solid #111",
  background: disabled ? "#f5f5f5" : "#111",
  color: disabled ? "#bbb" : "#fff",
  cursor: disabled ? "not-allowed" : "pointer",
  opacity: disabled ? 0.5 : 1,
  transition: "all 0.2s",
});

const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@400;500;600;700;800&display=swap');

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }

  * { box-sizing: border-box; }

  @media (max-width: 480px) {
    /* Tighter order header on small phones */
    .order-header-meta { gap: 12px 24px !important; }
  }
`;
"use client";

import React, { useEffect, useRef, useState } from "react";

const STATUS_OPTIONS = [
  { value: "PENDING",    label: "Pending",    cls: "pending" },
  { value: "PAID",       label: "Paid",       cls: "paid" },
  { value: "PROCESSING", label: "Processing", cls: "processing" },
  { value: "SHIPPED",    label: "Shipped",    cls: "shipped" },
  { value: "DELIVERED",  label: "Delivered",  cls: "delivered" },
  { value: "CANCELLED",  label: "Cancelled",  cls: "cancelled" },
  { value: "ISSUE",      label: "Issue",      cls: "issue" },
];

const styles = `
  @import url("https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800;900&display=swap");

  .orders-root {
    font-family: 'Playfair Display', serif;
    background: #fff;
    min-height: 100vh;
    color: #111;
  }

  .orders-header {
    padding: 48px 24px 24px;
    border-bottom: 1.5px solid #111;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 12px;
    flex-wrap: wrap;
  }

  .orders-title {
    font-size: clamp(2rem, 7vw, 3.5rem);
    font-weight: 800;
    letter-spacing: -0.02em;
    line-height: 1;
    margin: 0;
  }

  .orders-count {
    font-size: 0.78rem;
    font-weight: 400;
    color: #999;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    padding-bottom: 6px;
  }

  .orders-list {
    padding: 0 24px 80px;
    max-width: 860px;
    margin: 0 auto;
  }

  .order-card {
    border-bottom: 1px solid #e8e8e8;
    padding: 24px 0;
  }

  .order-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 12px;
    cursor: pointer;
  }

  .order-left { flex: 1; min-width: 0; }

  .order-id-row {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 5px;
  }

  .order-id {
    font-size: clamp(1rem, 3.5vw, 1.2rem);
    font-weight: 700;
    letter-spacing: -0.01em;
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .order-meta {
    font-size: 0.75rem;
    color: #999;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    margin: 0;
    line-height: 1.8;
  }

  .order-right {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 8px;
    flex-shrink: 0;
  }

  /* ── Status Dropdown ── */
  .status-dropdown-wrap {
    position: relative;
  }

  .status-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 10px 4px 12px;
    font-family: 'Playfair Display', serif;
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    white-space: nowrap;
    cursor: pointer;
    border: none;
    outline: none;
    transition: opacity 0.15s;
    user-select: none;
  }

  .status-btn:disabled { opacity: 0.55; cursor: not-allowed; }

  .status-btn .caret {
    width: 6px;
    height: 6px;
    border-right: 1.5px solid currentColor;
    border-bottom: 1.5px solid currentColor;
    transform: rotate(45deg);
    transition: transform 0.18s;
    flex-shrink: 0;
    margin-top: -2px;
  }

  .status-btn.open .caret { transform: rotate(-135deg); margin-top: 2px; }

  .status-menu {
    position: absolute;
    top: calc(100% + 6px);
    right: 0;
    z-index: 99;
    background: #fff;
    border: 1.5px solid #111;
    min-width: 148px;
    box-shadow: 4px 4px 0 #111;
    animation: menuIn 0.14s ease;
  }

  @keyframes menuIn {
    from { opacity: 0; transform: translateY(-4px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .status-option {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 9px 14px;
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    cursor: pointer;
    transition: background 0.1s;
    border: none;
    background: transparent;
    width: 100%;
    text-align: left;
    font-family: 'Playfair Display', serif;
  }

  .status-option:hover { background: #f5f5f5; }
  .status-option.active { background: #111; color: #fff; }
  .status-option.active .dot { background: #fff; }

  .dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  /* dot colours */
  .dot-pending    { background: #888; }
  .dot-paid       { background: #2d7a2d; }
  .dot-processing { background: #b07d00; }
  .dot-shipped    { background: #1a5eb8; }
  .dot-delivered  { background: #111; }
  .dot-cancelled  { background: #ccc; }
  .dot-issue      { background: #c0392b; }

  /* btn colours */
  .btn-delivered  { background: #111; color: #fff; }
  .btn-paid       { background: #2d7a2d; color: #fff; }
  .btn-pending    { border: 1px solid #111; background: #fff; color: #111; }
  .btn-processing { border: 1px solid #b07d00; background: #fffbf0; color: #b07d00; }
  .btn-shipped    { border: 1px solid #1a5eb8; background: #f0f5ff; color: #1a5eb8; }
  .btn-cancelled  { border: 1px solid #ddd; background: #fff; color: #bbb; }
  .btn-issue      { background: #c0392b; color: #fff; }

  /* saving spinner */
  .saving-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: currentColor;
    animation: blink 0.7s ease-in-out infinite alternate;
    flex-shrink: 0;
  }

  @keyframes blink { from { opacity: 0.2; } to { opacity: 1; } }

  /* expand */
  .chevron {
    width: 9px;
    height: 9px;
    border-right: 1.5px solid #111;
    border-bottom: 1.5px solid #111;
    display: inline-block;
    transform: rotate(45deg);
    transition: transform 0.2s ease;
    flex-shrink: 0;
    margin-top: 2px;
  }

  .chevron.open { transform: rotate(-135deg); margin-top: 6px; }

  .order-expand {
    margin-top: 18px;
    padding-top: 16px;
    border-top: 1px solid #f0f0f0;
    animation: expandIn 0.18s ease;
  }

  @keyframes expandIn {
    from { opacity: 0; transform: translateY(-4px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .items-label {
    font-size: 0.68rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #bbb;
    margin-bottom: 10px;
  }

  .order-item-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 9px 0;
    border-bottom: 1px solid #f5f5f5;
    gap: 8px;
  }

  .order-item-row:last-child { border-bottom: none; }

  .item-name {
    font-size: 0.92rem;
    font-weight: 500;
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .item-qty {
    font-size: 0.72rem;
    color: #999;
    letter-spacing: 0.06em;
    white-space: nowrap;
    flex-shrink: 0;
  }

  .order-customer {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 14px;
    padding-top: 14px;
    border-top: 1px solid #f0f0f0;
    font-size: 0.82rem;
    color: #666;
  }

  .avatar {
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: #111;
    color: #fff;
    font-size: 0.6rem;
    font-weight: 800;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    letter-spacing: 0;
  }

  /* error toast */
  .status-error {
    font-size: 0.68rem;
    color: #c0392b;
    letter-spacing: 0.06em;
    margin-top: 4px;
    text-align: right;
  }

  /* Loading */
  .loading-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 70vh;
    gap: 14px;
    font-family: 'Playfair Display', serif;
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

  .center-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 50vh;
    gap: 8px;
    font-family: 'Playfair Display', serif;
    text-align: center;
    padding: 24px;
  }

  .center-wrap .big { font-size: clamp(1.1rem,4vw,1.4rem); font-weight: 700; color: #111; }
  .center-wrap .small { font-size: 0.78rem; color: #ccc; letter-spacing: 0.06em; }

  @media (max-width: 480px) {
    .orders-header { padding: 28px 16px 18px; }
    .orders-list   { padding: 0 16px 60px; }
  }
`;

function formatDate(d) {
  if (!d) return "—";
  try {
    return new Date(d).toLocaleDateString("en-IN", {
      day: "numeric", month: "short", year: "numeric",
    });
  } catch { return d; }
}

function normaliseStatus(raw) {
  if (!raw) return "PENDING";
  const up = raw.toUpperCase();
  return STATUS_OPTIONS.find((o) => o.value === up)?.value ?? "PENDING";
}

/* ── Status Dropdown ── */
function StatusDropdown({ orderId, initial, token }) {
  const [current, setCurrent] = useState(normaliseStatus(initial));
  const [open, setOpen]       = useState(false);
  const [saving, setSaving]   = useState(false);
  const [err, setErr]         = useState(null);
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const choose = async (value) => {
    setOpen(false);
    if (value === current) return;
    setSaving(true);
    setErr(null);
    try {
      const { adminApi } = await import("@/lib/apiClient");
      await adminApi.updateOrderStatus(token, orderId, value);
      setCurrent(value);
    } catch (e) {
      setErr(e.message || "Failed to update");
    } finally {
      setSaving(false);
    }
  };

  const opt = STATUS_OPTIONS.find((o) => o.value === current) ?? STATUS_OPTIONS[0];

  return (
    <div ref={ref} className="status-dropdown-wrap">
      <button
        className={`status-btn btn-${opt.cls} ${open ? "open" : ""}`}
        onClick={(e) => { e.stopPropagation(); if (!saving) setOpen((v) => !v); }}
        disabled={saving}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {saving ? <span className="saving-dot" /> : <span className={`dot dot-${opt.cls}`} />}
        {saving ? "Saving…" : opt.label}
        {!saving && <span className="caret" />}
      </button>

      {err && <p className="status-error">{err}</p>}

      {open && (
        <div className="status-menu" role="listbox">
          {STATUS_OPTIONS.map((o) => (
            <button
              key={o.value}
              role="option"
              aria-selected={o.value === current}
              className={`status-option ${o.value === current ? "active" : ""}`}
              onClick={(e) => { e.stopPropagation(); choose(o.value); }}
            >
              <span className={`dot dot-${o.cls}`} />
              {o.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Order Card ── */
function OrderCard({ order, token }) {
  const [open, setOpen] = useState(false);
  const avatar = (order.user?.name || order.user?.email || "?").charAt(0).toUpperCase();

  return (
    <div className="order-card">
      <div className="order-top" onClick={() => setOpen((o) => !o)}>
        <div className="order-left">
          <div className="order-id-row">
            <p className="order-id">Order #{order.id}</p>
            <span className={`chevron ${open ? "open" : ""}`} />
          </div>
          <p className="order-meta">
            {formatDate(order.createdAt)}
            {order.total != null && (
              <>&nbsp;·&nbsp;₹{Number(order.total).toLocaleString("en-IN")}</>
            )}
          </p>
        </div>

        <div className="order-right" onClick={(e) => e.stopPropagation()}>
          <StatusDropdown
            orderId={order.id}
            initial={order.status}
            token={token}
          />
        </div>
      </div>

      {open && (
        <div className="order-expand" onClick={(e) => e.stopPropagation()}>
          <p className="items-label">Items</p>
          {(order.items || []).length === 0 ? (
            <p style={{ fontSize: "0.82rem", color: "#ccc" }}>No items found</p>
          ) : (
            (order.items || []).map((item) => (
              <div className="order-item-row" key={item.id ?? item.productId}>
                <span className="item-name">
                  {item.product?.name || `Product #${item.productId}`}
                </span>
                <span className="item-qty">× {item.quantity}</span>
              </div>
            ))
          )}

          {order.user && (
            <div className="order-customer">
              <span className="avatar">{avatar}</span>
              {order.user.name || order.user.email || "Unknown customer"}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Page ── */
export default function AdminOrderPage() {
  const [orders, setOrders]   = useState([]);
  const [token, setToken]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    const t = localStorage.getItem("token");
    setToken(t);
    import("@/lib/apiClient").then(({ adminApi }) => {
      adminApi.getOrders({ token: t }, undefined)
        .then((data) => { setOrders(data || []); setLoading(false); })
        .catch((err) => { setError(err.message); setLoading(false); });
    });
  }, []);

  if (loading) {
    return (
      <>
        <style>{styles}</style>
        <div className="orders-root">
          <div className="loading-wrap">
            <div className="loading-bar" />
            <span className="loading-text">Loading</span>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <style>{styles}</style>
        <div className="orders-root">
          <div className="center-wrap">
            <span className="big">Could not load orders</span>
            <span className="small">{error}</span>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <div className="orders-root">
        <div className="orders-header">
          <h1 className="orders-title">Orders</h1>
          <span className="orders-count">{orders.length} total</span>
        </div>

        <div className="orders-list">
          {orders.length === 0 ? (
            <div className="center-wrap" style={{ minHeight: "40vh" }}>
              <span className="big">No orders yet</span>
              <span className="small">Orders will appear here once placed</span>
            </div>
          ) : (
            orders.map((order) => (
              <OrderCard key={order.id} order={order} token={token} />
            ))
          )}
        </div>
      </div>
    </>
  );
}
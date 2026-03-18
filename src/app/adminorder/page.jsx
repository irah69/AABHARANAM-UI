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
  *, *::before, *::after { box-sizing: border-box; }

  .orders-root {
    font-family: 'Playfair Display', serif;
    background: #fff;
    min-height: 100vh;
    color: #111;
  }

  /* Header */
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
    color: #999;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    padding-bottom: 6px;
  }

  /* List */
  .orders-list {
    padding: 0 24px 80px;
    max-width: 860px;
    margin: 0 auto;
  }

  /* Card */
  .order-card { border-bottom: 1px solid #e8e8e8; }

  .order-summary {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 20px 0;
    cursor: pointer;
    user-select: none;
  }

  /* Left: id + name */
  .order-left {
    display: flex;
    align-items: center;
    gap: 14px;
    min-width: 0;
    flex: 1;
  }

  .order-id {
    font-size: 1rem;
    font-weight: 800;
    letter-spacing: -0.01em;
    margin: 0;
    white-space: nowrap;
    flex-shrink: 0;
    color: #bbb;
  }

  .order-name {
    font-size: 0.92rem;
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #111;
  }

  /* Right: dropdown + chevron */
  .order-controls {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
  }

  .chevron {
    width: 8px; height: 8px;
    border-right: 1.5px solid #bbb;
    border-bottom: 1.5px solid #bbb;
    transform: rotate(45deg);
    transition: transform 0.2s, border-color 0.2s;
    flex-shrink: 0;
    margin-top: -2px;
    cursor: pointer;
  }
  .chevron.open { transform: rotate(-135deg); margin-top: 4px; border-color: #111; }

  /* Expanded panel */
  .order-panel {
    padding: 0 0 24px;
    animation: panelIn 0.18s ease;
  }
  @keyframes panelIn {
    from { opacity: 0; transform: translateY(-6px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .panel-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1px;
    background: #e8e8e8;
    border: 1px solid #e8e8e8;
  }
  .panel-section { background: #fff; padding: 18px 20px; }
  .panel-section.full { grid-column: 1 / -1; }

  .section-label {
    font-size: 0.62rem;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #bbb;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    gap: 7px;
  }
  .section-label::after { content: ''; flex: 1; height: 1px; background: #f0f0f0; }

  /* Customer section */
  .customer-row { display: flex; align-items: center; gap: 12px; }
  .avatar-lg {
    width: 38px; height: 38px;
    border-radius: 50%;
    background: #111; color: #fff;
    font-size: 0.9rem; font-weight: 800;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .customer-info { min-width: 0; }
  .customer-name {
    font-size: 0.85rem; font-weight: 700;
    margin: 0 0 2px;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .customer-email {
    font-size: 0.72rem; color: #999;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }

  /* Payment section */
  .amount-row {
    display: flex; justify-content: space-between; align-items: baseline;
    gap: 12px; padding: 5px 0;
    border-bottom: 1px solid #f5f5f5;
  }
  .amount-row:last-child { border-bottom: none; }
  .amount-label { font-size: 0.68rem; color: #888; text-transform: uppercase; letter-spacing: 0.07em; }
  .amount-value { font-size: 0.92rem; font-weight: 700; }
  .amount-value.total { font-size: 1.05rem; }

  /* Items table */
  .items-table { width: 100%; border-collapse: collapse; }
  .items-table th {
    font-size: 0.6rem; letter-spacing: 0.15em; text-transform: uppercase;
    color: #bbb; font-weight: 400; padding: 0 0 10px;
    text-align: left; border-bottom: 1px solid #f0f0f0;
  }
  .items-table th:last-child { text-align: right; }
  .items-table td {
    padding: 10px 0; font-size: 0.82rem;
    border-bottom: 1px solid #f8f8f8; vertical-align: middle;
  }
  .items-table tr:last-child td { border-bottom: none; }
  .items-table td:last-child { text-align: right; }
  .item-cell { display: flex; align-items: center; gap: 10px; }
  .item-thumb {
    width: 32px; height: 32px;
    background: #f5f5f5; border: 1px solid #eee;
    display: flex; align-items: center; justify-content: center;
    font-size: 0.55rem; color: #ccc; font-weight: 700; flex-shrink: 0;
  }
  .item-name { font-weight: 600; }
  .item-sub  { font-size: 0.65rem; color: #bbb; margin-top: 1px; }
  .no-items {
    font-size: 0.78rem; color: #ccc; padding: 12px 0;
    text-align: center; letter-spacing: 0.06em; text-transform: uppercase;
  }

  /* Timeline */
  .date-entry { display: flex; flex-direction: column; gap: 2px; }
  .date-lbl { font-size: 0.62rem; color: #bbb; text-transform: uppercase; letter-spacing: 0.1em; }
  .date-val  { font-size: 0.85rem; font-weight: 600; }
  .date-time { font-size: 0.68rem; color: #aaa; }

  /* Status Dropdown */
  .status-dropdown-wrap { position: relative; }

  .status-btn {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 5px 10px 5px 11px;
    font-family: 'Playfair Display', serif;
    font-size: 0.65rem; font-weight: 700;
    letter-spacing: 0.12em; text-transform: uppercase;
    white-space: nowrap; cursor: pointer;
    border: none; outline: none;
    transition: opacity 0.15s; user-select: none;
  }
  .status-btn:disabled { opacity: 0.55; cursor: not-allowed; }
  .status-btn .caret {
    width: 5px; height: 5px;
    border-right: 1.5px solid currentColor;
    border-bottom: 1.5px solid currentColor;
    transform: rotate(45deg);
    transition: transform 0.18s;
    flex-shrink: 0; margin-top: -2px;
  }
  .status-btn.open .caret { transform: rotate(-135deg); margin-top: 2px; }

  .status-menu {
    position: absolute; top: calc(100% + 6px); right: 0; z-index: 99;
    background: #fff; border: 1.5px solid #111;
    min-width: 152px; box-shadow: 4px 4px 0 #111;
    animation: menuIn 0.14s ease;
  }
  @keyframes menuIn {
    from { opacity: 0; transform: translateY(-4px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .status-option {
    display: flex; align-items: center; gap: 9px;
    padding: 9px 14px;
    font-size: 0.7rem; font-weight: 600;
    letter-spacing: 0.1em; text-transform: uppercase;
    cursor: pointer; border: none; background: transparent;
    width: 100%; text-align: left;
    font-family: 'Playfair Display', serif;
    transition: background 0.1s;
  }
  .status-option:hover { background: #f5f5f5; }
  .status-option.active { background: #111; color: #fff; }
  .status-option.active .dot { background: #fff !important; }

  .dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
  .dot-pending    { background: #888; }
  .dot-paid       { background: #2d7a2d; }
  .dot-processing { background: #b07d00; }
  .dot-shipped    { background: #1a5eb8; }
  .dot-delivered  { background: #111; }
  .dot-cancelled  { background: #ccc; }
  .dot-issue      { background: #c0392b; }

  .btn-delivered  { background: #111; color: #fff; }
  .btn-paid       { background: #2d7a2d; color: #fff; }
  .btn-pending    { border: 1px solid #111; background: #fff; color: #111; }
  .btn-processing { border: 1px solid #b07d00; background: #fffbf0; color: #b07d00; }
  .btn-shipped    { border: 1px solid #1a5eb8; background: #f0f5ff; color: #1a5eb8; }
  .btn-cancelled  { border: 1px solid #ddd; background: #fff; color: #bbb; }
  .btn-issue      { background: #c0392b; color: #fff; }

  .saving-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: currentColor;
    animation: blink 0.7s ease-in-out infinite alternate;
  }
  @keyframes blink { from { opacity: 0.2; } to { opacity: 1; } }
  .status-error { font-size: 0.65rem; color: #c0392b; margin-top: 4px; text-align: right; }

  /* Loading / Error */
  .loading-wrap {
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    min-height: 70vh; gap: 14px;
    font-family: 'Playfair Display', serif;
  }
  .loading-bar {
    height: 1.5px; background: #111;
    animation: pulse 1.1s ease-in-out infinite alternate;
  }
  @keyframes pulse {
    from { width: 24px; opacity: 0.2; }
    to   { width: 64px; opacity: 1; }
  }
  .loading-text { font-size: 0.72rem; letter-spacing: 0.16em; text-transform: uppercase; color: #bbb; }

  .center-wrap {
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    min-height: 50vh; gap: 8px;
    font-family: 'Playfair Display', serif;
    text-align: center; padding: 24px;
  }
  .center-wrap .big   { font-size: clamp(1.1rem,4vw,1.4rem); font-weight: 700; color: #111; }
  .center-wrap .small { font-size: 0.78rem; color: #ccc; letter-spacing: 0.06em; }

  @media (max-width: 600px) {
    .orders-header { padding: 28px 16px 18px; }
    .orders-list   { padding: 0 16px 60px; }
    .panel-grid    { grid-template-columns: 1fr; }
  }
`;

/* ── Helpers ── */
function formatDate(d) {
  if (!d) return { date: "—", time: "" };
  try {
    const dt = new Date(d);
    return {
      date: dt.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
      time: dt.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
    };
  } catch { return { date: d, time: "" }; }
}

function formatAmount(n) {
  if (n == null) return "—";
  return "₹" + Number(n).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function normaliseStatus(raw) {
  if (!raw) return "PENDING";
  const up = raw.toUpperCase();
  return STATUS_OPTIONS.find((o) => o.value === up)?.value ?? "PENDING";
}

function avatarChar(email) { return (email || "?").charAt(0).toUpperCase(); }

// Derive a readable display name from an email address
function emailToName(email) {
  if (!email) return "Unknown";
  const local = email.split("@")[0];
  const cleaned = local.replace(/[._\-+]/g, " ").replace(/\d+/g, "").trim();
  const words = cleaned.split(" ").filter(Boolean);
  if (words.length === 0) return email;
  return words.map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ");
}

/* ── Status Dropdown ── */
function StatusDropdown({ orderId, initial, token }) {
  const [current, setCurrent] = useState(normaliseStatus(initial));
  const [open, setOpen]       = useState(false);
  const [saving, setSaving]   = useState(false);
  const [err, setErr]         = useState(null);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [open]);

  const choose = async (value) => {
    setOpen(false);
    if (value === current) return;
    setSaving(true); setErr(null);
    try {
      const { adminApi } = await import("@/lib/apiClient");
      await adminApi.updateOrderStatus(token, orderId, value);
      setCurrent(value);
    } catch (e) {
      setErr(e.message || "Update failed");
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
      >
        {saving
          ? <><span className="saving-dot" /> Saving…</>
          : <><span className={`dot dot-${opt.cls}`} />{opt.label}<span className="caret" /></>
        }
      </button>
      {err && <p className="status-error">{err}</p>}
      {open && (
        <div className="status-menu">
          {STATUS_OPTIONS.map((o) => (
            <button
              key={o.value}
              className={`status-option ${o.value === current ? "active" : ""}`}
              onClick={(e) => { e.stopPropagation(); choose(o.value); }}
            >
              <span className={`dot dot-${o.cls}`} />{o.label}
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
  const { date, time }  = formatDate(order.createdAt);
  const name            = emailToName(order.customerEmail);

  return (
    <div className="order-card">

      {/* ── Summary row: only order number, customer name, status ── */}
      <div className="order-summary" onClick={() => setOpen((o) => !o)}>

        <div className="order-left">
          <p className="order-id">#{order.id}</p>
          <span className="order-name">{name}</span>
        </div>

        <div className="order-controls" onClick={(e) => e.stopPropagation()}>
          <StatusDropdown orderId={order.id} initial={order.status} token={token} />
          <span
            className={`chevron ${open ? "open" : ""}`}
            onClick={(e) => { e.stopPropagation(); setOpen((o) => !o); }}
          />
        </div>
      </div>

      {/* ── Expanded panel ── */}
      {open && (
        <div className="order-panel" onClick={(e) => e.stopPropagation()}>
          <div className="panel-grid">

            {/* Customer */}
            <div className="panel-section">
              <p className="section-label">Customer</p>
              <div className="customer-row">
                <div className="avatar-lg">{avatarChar(order.customerEmail)}</div>
                <div className="customer-info">
                  <p className="customer-name">{name}</p>
                  <p className="customer-email">{order.customerEmail}</p>
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="panel-section">
              <p className="section-label">Payment</p>
              <div className="amount-row">
                <span className="amount-label">Order Total</span>
                <span className="amount-value total">{formatAmount(order.total)}</span>
              </div>
              <div className="amount-row">
                <span className="amount-label">Order ID</span>
                <span className="amount-value">#{order.id}</span>
              </div>
            </div>

            {/* Items */}
            <div className="panel-section full">
              <p className="section-label">Items</p>
              {!order.items || order.items.length === 0 ? (
                <p className="no-items">No item details available</p>
              ) : (
                <table className="items-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Qty</th>
                      <th>Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item) => (
                      <tr key={item.id ?? item.productId}>
                        <td>
                          <div className="item-cell">
                            <div className="item-thumb">IMG</div>
                            <div>
                              <div className="item-name">{item.product?.name || `Product #${item.productId}`}</div>
                              <div className="item-sub">ID: {item.productId}</div>
                            </div>
                          </div>
                        </td>
                        <td>× {item.quantity}</td>
                        <td>{item.price != null ? formatAmount(item.price * item.quantity) : "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Timeline */}
            <div className="panel-section full">
              <p className="section-label">Timeline</p>
              <div className="date-entry">
                <span className="date-lbl">Placed on</span>
                <span className="date-val">{date}</span>
                <span className="date-time">{time}</span>
              </div>
            </div>

          </div>
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
        .then((data) => { setOrders(Array.isArray(data) ? data : []); setLoading(false); })
        .catch((err) => { setError(err.message); setLoading(false); });
    });
  }, []);

  if (loading) return (
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

  if (error) return (
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
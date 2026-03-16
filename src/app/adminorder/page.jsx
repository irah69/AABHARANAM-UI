"use client";

import React, { useEffect, useState } from "react";

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
    cursor: pointer;
    transition: padding 0.15s, background 0.15s;
  }

  .order-card:hover {
    background: #fafafa;
    margin: 0 -24px;
    padding-left: 24px;
    padding-right: 24px;
  }

  .order-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 12px;
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

  .order-status {
    display: inline-block;
    padding: 4px 12px;
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    white-space: nowrap;
  }

  .order-status.delivered  { background: #111; color: #fff; }
  .order-status.pending    { border: 1px solid #111; background: #fff; color: #111; }
  .order-status.processing { border: 1px solid #bbb; background: #f5f5f5; color: #555; }
  .order-status.cancelled  { border: 1px solid #ddd; background: #fff; color: #bbb; }

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

  /* Error / Empty */
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

  /* Mobile */
  @media (max-width: 480px) {
    .orders-header { padding: 28px 16px 18px; }
    .orders-list   { padding: 0 16px 60px; }
    .order-card:hover {
      margin: 0 -16px;
      padding-left: 16px;
      padding-right: 16px;
    }
  }
`;

function statusClass(status) {
  if (!status) return "pending";
  const s = status.toLowerCase();
  if (s.includes("deliver") || s.includes("complet")) return "delivered";
  if (s.includes("cancel")) return "cancelled";
  if (s.includes("process") || s.includes("ship")) return "processing";
  return "pending";
}

function formatDate(d) {
  if (!d) return "—";
  try {
    return new Date(d).toLocaleDateString("en-IN", {
      day: "numeric", month: "short", year: "numeric",
    });
  } catch { return d; }
}

function OrderCard({ order }) {
  const [open, setOpen] = useState(false);
  const sc = statusClass(order.status);
  const avatar = (order.user?.name || order.user?.email || "?").charAt(0).toUpperCase();

  return (
    <div className="order-card" onClick={() => setOpen((o) => !o)}>
      <div className="order-top">
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
        <div className="order-right">
          <span className={`order-status ${sc}`}>{order.status || "Pending"}</span>
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

export default function AdminOrderPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    import("@/lib/apiClient").then(({ adminApi }) => {
      adminApi.getOrders({ token }, undefined)
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
              <OrderCard key={order.id} order={order} />
            ))
          )}
        </div>
      </div>
    </>
  );
}
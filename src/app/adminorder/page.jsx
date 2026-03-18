"use client";

import React, { useEffect, useState } from "react";
import { adminApi } from "@/lib/apiClient";
import { useAuth } from "@/context/AuthContext";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusUpdating, setStatusUpdating] = useState({});
  const { accessToken } = useAuth();

  useEffect(() => {
    setLoading(true);
    adminApi
      .getOrders({ token: accessToken })
      .then(data => {
        // handle both array and { orders: [] } shape
        setOrders(Array.isArray(data) ? data : data.orders || []);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || "Failed to fetch orders.");
        setLoading(false);
      });
  }, [accessToken]);

  const statusOptions = ["PENDING", "PAID", "ISSUE", "OUT OF STOCK", "CANCELLED"];

  const handleStatusUpdate = async (orderId, newStatus) => {
    setStatusUpdating(prev => ({ ...prev, [orderId]: true }));
    try {
      await adminApi.updateOrderStatus(accessToken, orderId, newStatus);
      setOrders(prev =>
        prev.map(order =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      alert(err?.message || "Failed to update status.");
    } finally {
      setStatusUpdating(prev => ({ ...prev, [orderId]: false }));
    }
  };

  if (loading) return <div className="p-6">Loading orders...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <section className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Orders ({orders.length})</h1>

      {orders.length === 0 ? (
        <div>No orders found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="border px-3 py-2">Order ID</th>
                <th className="border px-3 py-2">Customer</th>
                <th className="border px-3 py-2">Date</th>
                <th className="border px-3 py-2">Total</th>
                <th className="border px-3 py-2">Items</th>
                <th className="border px-3 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="border px-3 py-2 font-mono">#{order.id}</td>

                  {/* Customer — use whatever field your API returns */}
                  <td className="border px-3 py-2">
                    {order.user?.name || order.user?.email || order.customerEmail || "—"}
                  </td>

                  <td className="border px-3 py-2">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>

                  <td className="border px-3 py-2">₹{order.total}</td>

                  {/* Items */}
                  <td className="border px-3 py-2">
                    {order.items?.length > 0 ? (
                      <ul className="list-disc ml-3 space-y-0.5">
                        {order.items.map(item => (
                          <li key={item.id}>
                            {item.product?.name || `Product #${item.productId}`} ×{item.quantity}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-gray-400 text-xs">
                        No items (add <code>include: items</code> in backend)
                      </span>
                    )}
                  </td>

                  {/* ✅ Status dropdown — always visible, no accordion needed */}
                  <td className="border px-3 py-2">
                    <select
                      value={order.status}
                      onChange={e => handleStatusUpdate(order.id, e.target.value)}
                      disabled={statusUpdating[order.id]}
                      className="border rounded px-2 py-1 text-sm bg-white disabled:opacity-50 cursor-pointer"
                    >
                      {statusOptions.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                    {statusUpdating[order.id] && (
                      <span className="text-xs text-gray-400 ml-1">saving…</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
"use client";

import React, { useEffect, useState } from "react";
import { apiRequest } from "@/lib/apiClient";
import { useAuth } from "@/context/AuthContext";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusUpdating, setStatusUpdating] = useState({});
  const { accessToken } = useAuth();

  useEffect(() => {
    setLoading(true);
    apiRequest("/admin/orders", { query: { page } })
      .then(data => {
        setOrders(data.orders || []);
        setTotalPages(data.totalPages || 1);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || "Failed to fetch orders.");
        setLoading(false);
      });
  }, [page]);

  const statusOptions = ["PENDING", "PAID", "ISSUE", "OUT OF STOCK", "CANCELLED"];

  const handleStatusUpdate = async (orderId, newStatus) => {
    setStatusUpdating((prev) => ({ ...prev, [orderId]: true }));
    try {
      // ✅ Fixed: use apiRequest instead of undefined adminApi
      const res = await apiRequest(`/admin/orders/${orderId}/status`, {
        method: "PATCH",
        body: { status: newStatus },
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setOrders((prevOrders) =>
        prevOrders.map(order =>
          order.id === orderId ? { ...order, status: res.status || newStatus } : order
        )
      );
    } catch (err) {
      alert(err?.message || "Failed to update status.");
    } finally {
      setStatusUpdating((prev) => ({ ...prev, [orderId]: false }));
    }
  };

  if (loading) return <div>Loading orders...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <section className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Orders</h1>
      {orders.length === 0 ? (
        <div>No orders found.</div>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <div key={order.id} className="border rounded p-4">
              <div className="font-semibold">Order #{order.id}</div>

              {/* ✅ Safely show user info */}
              <div>User: {order.user?.name || order.user?.email || order.customerEmail || "Unknown"}</div>
              <div>Date: {new Date(order.createdAt).toLocaleString()}</div>
              <div>Total: ₹{order.total}</div>

              {/* ✅ Status dropdown now always renders */}
              <div className="flex items-center gap-2 mt-2">
                <span>Status:</span>
                <select
                  value={order.status}
                  onChange={e => handleStatusUpdate(order.id, e.target.value)}
                  disabled={statusUpdating[order.id]}
                  className="border rounded px-2 py-1"
                >
                  {statusOptions.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                {statusUpdating[order.id] && (
                  <span className="text-sm text-gray-500">Updating…</span>
                )}
              </div>

              {/* ✅ Safely handle missing items array */}
              <div className="mt-2">
                <div className="font-medium">Items:</div>
                {order.items && order.items.length > 0 ? (
                  <ul className="ml-4 list-disc">
                    {order.items.map(item => (
                      <li key={item.id}>
                        {item.product?.name || `Product #${item.productId}`} (Qty: {item.quantity})
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-sm text-gray-500 ml-4">
                    No items data — ensure your API includes `items` with `product` in the response.
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="mt-6 flex gap-2">
        <button
          disabled={page <= 1}
          onClick={() => setPage(page - 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >Prev</button>
        <span>Page {page} of {totalPages}</span>
        <button
          disabled={page >= totalPages}
          onClick={() => setPage(page + 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >Next</button>
      </div>
    </section>
  );
}
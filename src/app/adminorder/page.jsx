"use client";

import React, { useEffect, useState } from "react";

export default function AdminOrderPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setLoading(true);
    fetch(`https://murgan-backend-1.onrender.com/api/admin/orders?page=${page}`)
      .then(res => res.json())
      .then(data => {
        setOrders(data.orders || []);
        setTotalPages(data.totalPages || 1);
        setLoading(false);
      })
      .catch(err => {
        setError("Failed to fetch orders.");
        setLoading(false);
      });
  }, [page]);

  if (loading) return <div>Loading orders...</div>;
  if (error) return <div>{error}</div>;

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
              <div>User: {order.user?.name || order.user?.email || "Unknown"}</div>
              <div>Date: {order.createdAt}</div>
              <div>Status: {order.status}</div>
              <div className="mt-2">
                <div className="font-medium">Items:</div>
                <ul className="ml-4 list-disc">
                  {order.items.map(item => (
                    <li key={item.id}>
                      {item.product?.name || `Product #${item.productId}`} (Qty: {item.quantity})
                    </li>
                  ))}
                </ul>
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
        >
          Prev
        </button>
        <span>Page {page} of {totalPages}</span>
        <button
          disabled={page >= totalPages}
          onClick={() => setPage(page + 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </section>
  );
}

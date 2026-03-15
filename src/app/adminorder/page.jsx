"use client";

import React, { useEffect, useState } from "react";

export default function AdminOrderPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    const token = localStorage.getItem("token");

    fetch("https://murgan-backend-1.onrender.com/api/admin/orders", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setOrders(data || []);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch orders: " + err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading orders...</div>;
  if (error) return <div>{error}</div>;

  return (
    <section className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Orders</h1>
      {orders.length === 0 ? (
        <div>No orders found.</div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="border rounded p-4">
              <div className="font-semibold">Order #{order.id}</div>
              <div>User: {order.user?.name || order.user?.email || "Unknown"}</div>
              <div>Date: {order.createdAt}</div>
              <div>Status: {order.status}</div>
              <div className="mt-2">
                <div className="font-medium">Items:</div>
                <ul className="ml-4 list-disc">
                  {(order.items || []).map((item) => (
                    <li key={item.id}>
                      {item.product?.name || `Product #${item.productId}`} (Qty:{" "}
                      {item.quantity})
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
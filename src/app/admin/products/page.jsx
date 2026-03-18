"use client";

import React, { useMemo, useState } from "react";
import RequireAdmin from "@/components/RequireAdmin";
import { useAuth } from "@/context/AuthContext";
import { adminApi, publicApi } from "@/lib/apiClient";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { normalizePage } from "@/lib/pagination";

export default function AdminProductsPage() {
  const queryClient = useQueryClient();
  const { accessToken } = useAuth();

  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const size = 20;

  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    discount: "",
    stockQuantity: "",
    imageUrls: "",
    categoryId: "",
  });
  const [error, setError] = useState("");

  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: ({ signal }) => publicApi.getCategories(signal),
  });

  const categories = useMemo(() => {
    const raw = categoriesQuery.data?.data ?? categoriesQuery.data;
    return Array.isArray(raw) ? raw : [];
  }, [categoriesQuery.data]);

  const productsQuery = useQuery({
    queryKey: ["products", { page, size, search }],
    queryFn: ({ signal }) => {
      if (search && search.trim() !== "") {
        return publicApi.searchProducts({ q: search, page, size, sort: "createdAt,desc" }, signal);
      }
      return publicApi.getProducts({ page, size, sort: "createdAt,desc" }, signal);
    },
    placeholderData: (prev) => prev,
  });

  const pageData = useMemo(
    () => normalizePage(productsQuery.data?.data ?? productsQuery.data),
    [productsQuery.data]
  );

  const createMutation = useMutation({
    mutationFn: (body) => adminApi.createProduct(accessToken, body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["products"] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, body }) => adminApi.updateProduct(accessToken, id, body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["products"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => adminApi.deleteProduct(accessToken, id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["products"] }),
  });

  const resetForm = () => {
    setEditingId(null);
    setForm({
      name: "",
      description: "",
      price: "",
      discount: "",
      stockQuantity: "",
      imageUrls: "",
      categoryId: "",
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const discountValue = form.discount === "" ? 0 : Number(form.discount);
    if (isNaN(discountValue) || discountValue < 0 || discountValue > 100) {
      setError("Discount must be a number between 0 and 100.");
      return;
    }

    const imageUrlsArray = Array.isArray(form.imageUrls)
      ? form.imageUrls
      : form.imageUrls
          .split(",")
          .map((url) => url.trim())
          .filter((url) => url.length > 0);

    const payload = {
      name: form.name,
      description: form.description,
      price: Number(form.price),
      discount: discountValue,
      stockQuantity: Number(form.stockQuantity),
      imageUrls: imageUrlsArray,
      categoryId: Number(form.categoryId),
    };

    try {
      if (editingId)
        await updateMutation.mutateAsync({ id: editingId, body: payload });
      else await createMutation.mutateAsync(payload);
      resetForm();
    } catch (err) {
      setError(err?.message || "Failed to save product.");
    }
  };

  return (
    <RequireAdmin>
      <div className="min-h-screen w-full bg-white text-black">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">

          <h1 className="text-2xl sm:text-3xl font-light mb-6 sm:mb-8">Products</h1>

          {error && (
            <div className="mb-4 p-3 border border-red-200 bg-red-50 text-red-700 rounded text-sm">
              {error}
            </div>
          )}

          {/* Create / Edit Form */}
          <form
            onSubmit={onSubmit}
            className="border border-gray-200 rounded-lg p-4 sm:p-5 mb-8 space-y-3 w-full"
          >
            <div className="font-semibold text-sm sm:text-base">
              {editingId ? `Edit product #${editingId}` : "Create product"}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold mb-1">Name</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full px-3 py-2.5 sm:px-4 sm:py-3 border border-gray-300 rounded-lg text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Category</label>
                <select
                  value={form.categoryId}
                  onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value }))}
                  className="w-full px-3 py-2.5 sm:px-4 sm:py-3 border border-gray-300 rounded-lg bg-white text-sm"
                  required
                >
                  <option value="">Select category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Price</label>
                <input
                  value={form.price}
                  onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                  className="w-full px-3 py-2.5 sm:px-4 sm:py-3 border border-gray-300 rounded-lg text-sm"
                  inputMode="decimal"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Discount (%)</label>
                <input
                  value={form.discount}
                  onChange={(e) => setForm((f) => ({ ...f, discount: e.target.value }))}
                  className="w-full px-3 py-2.5 sm:px-4 sm:py-3 border border-gray-300 rounded-lg text-sm"
                  inputMode="decimal"
                  min="0"
                  max="100"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Stock quantity</label>
                <input
                  value={form.stockQuantity}
                  onChange={(e) => setForm((f) => ({ ...f, stockQuantity: e.target.value }))}
                  className="w-full px-3 py-2.5 sm:px-4 sm:py-3 border border-gray-300 rounded-lg text-sm"
                  inputMode="numeric"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold mb-1">
                  Image URLs (comma separated)
                </label>
                <input
                  value={form.imageUrls}
                  onChange={(e) => setForm((f) => ({ ...f, imageUrls: e.target.value }))}
                  placeholder="https://img1.jpg, https://img2.jpg"
                  className="w-full px-3 py-2.5 sm:px-4 sm:py-3 border border-gray-300 rounded-lg text-sm"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold mb-1">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  className="w-full px-3 py-2.5 sm:px-4 sm:py-3 border border-gray-300 rounded-lg text-sm"
                  rows={3}
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-1">
              <button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
                className="flex-1 sm:flex-none px-5 py-2.5 bg-black text-white rounded-lg disabled:opacity-60 text-sm font-medium"
              >
                Save
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 sm:flex-none px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-medium"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          {/* Search bar */}
          <div className="mb-4 w-full flex items-center gap-2">
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(0);
              }}
              placeholder="Search products..."
              className="flex-1 px-3 py-2.5 sm:px-4 sm:py-3 border border-gray-300 rounded-lg text-sm"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="shrink-0 px-3 py-2.5 border border-gray-300 rounded-lg text-sm"
              >
                Clear
              </button>
            )}
          </div>

          {/* Products Table */}
          {productsQuery.isLoading ? (
            <div className="text-gray-600 text-sm">Loading…</div>
          ) : (
            <>
              <div className="w-full overflow-x-auto border border-gray-200 rounded-lg">
                <table className="min-w-[700px] w-full text-sm">
                  <thead className="bg-gray-50 text-gray-700">
                    <tr>
                      <th className="text-left p-3 whitespace-nowrap">ID</th>
                      <th className="text-left p-3 whitespace-nowrap">Name</th>
                      <th className="text-left p-3 whitespace-nowrap">Price</th>
                      <th className="text-left p-3 whitespace-nowrap">Discount</th>
                      <th className="text-left p-3 whitespace-nowrap">Final Price</th>
                      <th className="text-left p-3 whitespace-nowrap">Stock</th>
                      <th className="text-left p-3 whitespace-nowrap">Category</th>
                      <th className="text-left p-3 whitespace-nowrap">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pageData.items.map((p) => {
                      const discount =
                        typeof p.discount === "number"
                          ? p.discount
                          : Number(p.discount) || 0;
                      const finalPrice =
                        p.price && discount > 0
                          ? p.price - (p.price * discount) / 100
                          : p.price;
                      return (
                        <tr key={p.id} className="border-t border-gray-200 hover:bg-gray-50">
                          <td className="p-3 text-gray-500">{p.id}</td>
                          <td className="p-3 max-w-[160px] truncate">{p.name}</td>
                          <td className="p-3 whitespace-nowrap">₹{p.price}</td>
                          <td className="p-3 whitespace-nowrap">
                            {discount > 0 ? `${discount}%` : "—"}
                          </td>
                          <td className="p-3 whitespace-nowrap">₹{finalPrice}</td>
                          <td className="p-3">{p.stockQuantity ?? "—"}</td>
                          <td className="p-3 whitespace-nowrap">
                            {p.category?.name || p.categoryName || p.categoryId || "—"}
                          </td>
                          <td className="p-3">
                            <div className="flex gap-3">
                              <button
                                onClick={() => {
                                  setEditingId(p.id);
                                  setForm({
                                    name: p.name || "",
                                    description: p.description || "",
                                    price: String(p.price ?? ""),
                                    discount:
                                      typeof p.discount === "number"
                                        ? String(p.discount)
                                        : p.discount || "",
                                    stockQuantity: String(p.stockQuantity ?? ""),
                                    imageUrls: Array.isArray(p.imageUrls)
                                      ? p.imageUrls.join(", ")
                                      : typeof p.imageUrls === "string"
                                      ? p.imageUrls
                                      : "",
                                    categoryId: String(
                                      p.categoryId ?? p.category?.id ?? ""
                                    ),
                                  });
                                  window.scrollTo({ top: 0, behavior: "smooth" });
                                }}
                                className="underline text-blue-700 whitespace-nowrap"
                              >
                                Edit
                              </button>
                              <button
                                onClick={async () => {
                                  setError("");
                                  try {
                                    await deleteMutation.mutateAsync(p.id);
                                  } catch (err) {
                                    setError(err?.message || "Failed to delete product.");
                                  }
                                }}
                                className="underline text-red-700 whitespace-nowrap"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex justify-center items-center gap-3 sm:gap-4 mt-4 text-sm">
                <button
                  type="button"
                  className="px-3 py-2 sm:px-4 border border-gray-300 rounded-lg disabled:opacity-50"
                  disabled={page === 0}
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                >
                  Previous
                </button>
                <span className="text-gray-600">
                  Page {page + 1} of {pageData.totalPages}
                </span>
                <button
                  type="button"
                  className="px-3 py-2 sm:px-4 border border-gray-300 rounded-lg disabled:opacity-50"
                  disabled={page + 1 >= pageData.totalPages}
                  onClick={() => setPage((p) => (p + 1 < pageData.totalPages ? p + 1 : p))}
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </RequireAdmin>
  );
}
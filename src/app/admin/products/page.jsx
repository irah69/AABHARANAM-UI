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
  const size = 20;

  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stockQuantity: "",
    imageUrls: "",
    categoryId: "",
    discount: "",
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
    queryKey: ["products", { page, size }],
    queryFn: ({ signal }) =>
      publicApi.getProducts({ page, size, sort: "createdAt,desc" }, signal),
    placeholderData: (prev) => prev,
  });

  const pageData = useMemo(
    () => normalizePage(productsQuery.data?.data ?? productsQuery.data),
    [productsQuery.data]
  );

  const createMutation = useMutation({
    mutationFn: (body) => adminApi.createProduct(accessToken, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, body }) => adminApi.updateProduct(accessToken, id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => adminApi.deleteProduct(accessToken, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Safe conversion: string or array to array
    const imageUrlsArray = Array.isArray(form.imageUrls)
      ? form.imageUrls
      : form.imageUrls
          .split(",")
          .map((url) => url.trim())
          .filter((url) => url.length > 0);

    // Validate discount
    const discountValue = Number(form.discount);
    if (isNaN(discountValue) || discountValue < 0) {
      setError("Discount must be a number 0 or greater.");
      return;
    }

    const payload = {
      name: form.name,
      description: form.description,
      price: Number(form.price),
      stockQuantity: Number(form.stockQuantity),
      imageUrls: imageUrlsArray,
      categoryId: Number(form.categoryId),
      discount: discountValue,
    };

    try {
      if (editingId)
        await updateMutation.mutateAsync({ id: editingId, body: payload });
      else await createMutation.mutateAsync(payload);

      setEditingId(null);
      setForm({
        name: "",
        description: "",
        price: "",
        stockQuantity: "",
        imageUrls: "",
        categoryId: "",
        discount: "",
      });
    } catch (err) {
      setError(err?.message || "Failed to save product.");
    }
  };

  return (
    <RequireAdmin>
      <div className="container-custom py-12 flex flex-col items-center">
        <h1 className="text-3xl font-light mb-8">Products</h1>

        {error && (
          <div className="mb-4 p-3 border border-red-200 bg-red-50 text-red-700 rounded">
            {error}
          </div>
        )}

        <form
          onSubmit={onSubmit}
          className="border border-gray-200 rounded-lg p-5 mb-8 space-y-3"
        >
          <div className="font-semibold">
            {editingId ? `Edit product #${editingId}` : "Create product"}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-semibold mb-1">Discount (%)</label>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={form.discount}
                            onChange={(e) =>
                              setForm((f) => ({ ...f, discount: e.target.value }))
                            }
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                            placeholder="0"
                            required
                          />
                        </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Name</label>
              <input
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">
                Category
              </label>
              <select
                value={form.categoryId}
                onChange={(e) =>
                  setForm((f) => ({ ...f, categoryId: e.target.value }))
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white"
                required
              >
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">Price</label>
              <input
                value={form.price}
                onChange={(e) =>
                  setForm((f) => ({ ...f, price: e.target.value }))
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                inputMode="decimal"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">
                Stock quantity
              </label>
              <input
                value={form.stockQuantity}
                onChange={(e) =>
                  setForm((f) => ({ ...f, stockQuantity: e.target.value }))
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                inputMode="numeric"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold mb-1">
                Image URLs (comma separated)
              </label>
              <input
                value={form.imageUrls}
                onChange={(e) =>
                  setForm((f) => ({ ...f, imageUrls: e.target.value }))
                }
                placeholder="https://img1.jpg, https://img2.jpg"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold mb-1">
                Description
              </label>
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                rows={3}
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
              className="px-5 py-3 bg-black text-white rounded-lg disabled:opacity-60"
            >
              Save
            </button>

            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setForm({
                    name: "",
                    description: "",
                    price: "",
                    stockQuantity: "",
                    imageUrls: "",
                    categoryId: "",
                  });
                }}
                className="px-5 py-3 border border-gray-300 rounded-lg"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {productsQuery.isLoading ? (
          <div className="text-gray-600">Loading…</div>
        ) : (
          <div className="overflow-auto border border-gray-200 rounded-lg">
            <table className="min-w-[1000px] w-full text-sm">
              <thead className="bg-gray-50 text-gray-700">
                <tr>
                  <th className="text-left p-3">ID</th>
                  <th className="text-left p-3">Name</th>
                  <th className="text-left p-3">Price</th>
                  <th className="text-left p-3">Discount (%)</th>
                  <th className="text-left p-3">Stock</th>
                  <th className="text-left p-3">Category</th>
                  <th className="text-left p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pageData.items.map((p) => (
                  <tr key={p.id} className="border-t border-gray-200">
                    <td className="p-3">{p.id}</td>
                    <td className="p-3">{p.name}</td>
                    <td className="p-3">₹{p.price}</td>
                    <td className="p-3">{p.discount ?? 0}</td>
                    <td className="p-3">{p.stockQuantity ?? "—"}</td>
                    <td className="p-3">
                      {p.category?.name ||
                        p.categoryName ||
                        p.categoryId ||
                        "—"}
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
                              stockQuantity: String(p.stockQuantity ?? ""),
                              imageUrls: Array.isArray(p.imageUrls)
                                ? p.imageUrls.join(", ")
                                : (typeof p.imageUrls === "string" ? p.imageUrls : ""),
                              categoryId: String(p.categoryId ?? p.category?.id ?? ""),
                              discount: typeof p.discount !== "undefined" ? String(p.discount) : "",
                            });
                          }}
                          className="underline"
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
                          className="underline text-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </RequireAdmin>
  );
}
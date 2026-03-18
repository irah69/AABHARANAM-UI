"use client";

import React, { useMemo, useState } from "react";
import RequireAdmin from "@/components/RequireAdmin";
import { useAuth } from "@/context/AuthContext";
import { adminApi, publicApi } from "@/lib/apiClient";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export default function AdminCategoriesPage() {
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(0);
    const size = 20;
  const queryClient = useQueryClient();
  const { accessToken } = useAuth();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  const categoriesQuery = useQuery({
    queryKey: ["categories", { page, size, search }],
    queryFn: ({ signal }) => {
      if (search && search.trim() !== "") {
        return publicApi.getCategories({ q: search, page, size }, signal);
      }
      return publicApi.getCategories({ page, size }, signal);
    },
    placeholderData: (prev) => prev,
  });

  // Normalize page data for pagination
  const pageData = useMemo(() => {
    const raw = categoriesQuery.data?.data ?? categoriesQuery.data;
    if (raw && typeof raw === "object" && raw.items && raw.totalPages) return raw;
    return {
      items: Array.isArray(raw) ? raw : [],
      totalPages: 1,
      totalItems: Array.isArray(raw) ? raw.length : 0,
    };
  }, [categoriesQuery.data]);

  const createMutation = useMutation({
    mutationFn: (body) => adminApi.createCategory(accessToken, body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["categories"] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, body }) => adminApi.updateCategory(accessToken, id, body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["categories"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => adminApi.deleteCategory(accessToken, id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["categories"] }),
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (editingId) {
        await updateMutation.mutateAsync({ id: editingId, body: { name, description } });
      } else {
        await createMutation.mutateAsync({ name, description });
      }
      setName("");
      setDescription("");
      setEditingId(null);
    } catch (err) {
      setError(err?.message || "Failed to save category.");
    }
  };

  return (
    <RequireAdmin>
      <div className="container-custom py-12">
        <h1 className="text-3xl font-light mb-8">Categories</h1>

        {error && (
          <div className="mb-4 p-3 border border-red-200 bg-red-50 text-red-700 rounded">{error}</div>
        )}

        <form onSubmit={onSubmit} className="border border-gray-200 rounded-lg p-5 mb-8 space-y-3">
          <div className="font-semibold">{editingId ? `Edit category #${editingId}` : "Create category"}</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold mb-1">Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Description</label>
              <input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
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
                  setName("");
                  setDescription("");
                }}
                className="px-5 py-3 border border-gray-300 rounded-lg"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {categoriesQuery.isError && (
          <div className="mb-4 p-3 border border-red-200 bg-red-50 text-red-700 rounded">
            Failed to load categories. {categoriesQuery.error?.message ? `(${categoriesQuery.error.message})` : ""}
          </div>
        )}

        {/* Search bar */}
        <div className="mb-4 w-full max-w-2xl flex items-center gap-2">
          <input
            type="text"
            value={search}
            onChange={e => {
              setSearch(e.target.value);
              setPage(0);
            }}
            placeholder="Search categories by name, description, etc."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="px-3 py-2 border border-gray-300 rounded-lg"
            >
              Clear
            </button>
          )}
        </div>

        {categoriesQuery.isLoading ? (
          <div className="text-gray-600">Loading…</div>
        ) : (
          <>
            <div className="overflow-auto border border-gray-200 rounded-lg">
              <table className="min-w-[800px] w-full text-sm">
                <thead className="bg-gray-50 text-gray-700">
                  <tr>
                    <th className="text-left p-3">ID</th>
                    <th className="text-left p-3">Name</th>
                    <th className="text-left p-3">Description</th>
                    <th className="text-left p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pageData.items.map((c) => (
                    <tr key={c.id} className="border-t border-gray-200">
                      <td className="p-3">{c.id}</td>
                      <td className="p-3">{c.name}</td>
                      <td className="p-3">{c.description || "—"}</td>
                      <td className="p-3">
                        <div className="flex gap-3">
                          <button
                            onClick={() => {
                              setEditingId(c.id);
                              setName(c.name || "");
                              setDescription(c.description || "");
                            }}
                            className="underline"
                          >
                            Edit
                          </button>
                          <button
                            onClick={async () => {
                              setError("");
                              try {
                                await deleteMutation.mutateAsync(c.id);
                              } catch (err) {
                                setError(err?.message || "Failed to delete category.");
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
            {/* Pagination controls */}
            <div className="flex justify-center items-center gap-4 mt-4">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50"
                disabled={page === 0}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
              >
                Previous
              </button>
              <span>
                Page {page + 1} of {pageData.totalPages}
              </span>
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50"
                disabled={page + 1 >= pageData.totalPages}
                onClick={() => setPage((p) => (p + 1 < pageData.totalPages ? p + 1 : p))}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </RequireAdmin>
  );
}


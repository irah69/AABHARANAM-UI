"use client";

import React, { useMemo, useState } from "react";
import RequireAdmin from "@/components/RequireAdmin";
import { useAuth } from "@/context/AuthContext";
import { adminApi, publicApi } from "@/lib/apiClient";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Search, X, Pencil, Trash2, Plus, Tag, RotateCcw, ChevronRight } from "lucide-react";

/* ─── GLOBAL STYLES ─────────────────────────────────────────────────── */
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@400;500;600;700;800&display=swap');
  * { box-sizing: border-box; }
  input::placeholder, textarea::placeholder { color: #ccc !important; }
`;

/* ─── FIELD COMPONENT ────────────────────────────────────────────────── */
function Field({ label, required, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: "0.72rem", fontWeight: 700,
        letterSpacing: "0.1em", textTransform: "uppercase",
        color: "#555", display: "flex", alignItems: "center", gap: 4,
      }}>
        {label}
        {required && <span style={{ color: "#e03131" }}>*</span>}
      </label>
      {children}
    </div>
  );
}

function Input({ value, onChange, placeholder, required }) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      style={{
        width: "100%", padding: "11px 14px",
        border: `1.5px solid ${focused ? "#111" : "#ddd"}`,
        borderRadius: "4px", fontSize: "0.88rem",
        fontFamily: "'DM Sans', sans-serif", color: "#111",
        background: "#fff", outline: "none",
        transition: "border-color 0.18s, box-shadow 0.18s",
        boxShadow: focused ? "0 0 0 3px rgba(0,0,0,0.06)" : "none",
        boxSizing: "border-box",
      }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    />
  );
}

/* ─── TABLE ROW ──────────────────────────────────────────────────────── */
function CategoryRow({ c, isLast, onEdit, onDelete }) {
  const [hovered, setHovered] = useState(false);
  return (
    <tr
      style={{
        borderBottom: isLast ? "none" : "1px solid #f5f5f5",
        background: hovered ? "#fafafa" : "#fff",
        transition: "background 0.12s",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <td style={td}><span style={{ color: "#bbb", fontFamily: "'DM Sans', sans-serif", fontSize: "0.8rem" }}>#{c.id}</span></td>
      <td style={td}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 28, height: 28, borderRadius: "50%",
            background: "#f5f5f5",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}>
            <Tag size={12} color="#888" />
          </div>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "0.85rem", color: "#111" }}>
            {c.name}
          </span>
        </div>
      </td>
      <td style={td}>
        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.82rem", color: "#888" }}>
          {c.description || <span style={{ color: "#ddd" }}>—</span>}
        </span>
      </td>
      <td style={td}>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={onEdit}
            style={{
              display: "flex", alignItems: "center", gap: 5,
              padding: "5px 12px", borderRadius: "3px",
              border: "1.5px solid #ddd", background: "#fff",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.72rem", fontWeight: 700,
              letterSpacing: "0.06em", color: "#333",
              cursor: "pointer", whiteSpace: "nowrap",
              transition: "all 0.15s",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#111"; e.currentTarget.style.background = "#111"; e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "#ddd"; e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = "#333"; }}
          >
            <Pencil size={11} /> Edit
          </button>
          <button
            onClick={onDelete}
            style={{
              display: "flex", alignItems: "center", gap: 5,
              padding: "5px 12px", borderRadius: "3px",
              border: "1.5px solid #ffc9c9", background: "#fff0f0",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.72rem", fontWeight: 700,
              letterSpacing: "0.06em", color: "#c92a2a",
              cursor: "pointer", whiteSpace: "nowrap",
              transition: "all 0.15s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "#e03131"; e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "#e03131"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#fff0f0"; e.currentTarget.style.color = "#c92a2a"; e.currentTarget.style.borderColor = "#ffc9c9"; }}
          >
            <Trash2 size={11} /> Delete
          </button>
        </div>
      </td>
    </tr>
  );
}

const td = {
  padding: "13px 14px",
  verticalAlign: "middle",
};

/* ─── SKELETON ───────────────────────────────────────────────────────── */
function TableSkeleton() {
  return [1, 2, 3, 4].map(i => (
    <tr key={i} style={{ borderBottom: "1px solid #f5f5f5" }}>
      {[60, 160, 220, 100].map((w, j) => (
        <td key={j} style={td}>
          <div style={{
            width: w, height: 13, borderRadius: 3,
            background: "linear-gradient(90deg,#f0f0f0 25%,#e4e4e4 50%,#f0f0f0 75%)",
            backgroundSize: "400px 100%",
            animation: "shimmer 1.4s ease-in-out infinite",
          }} />
        </td>
      ))}
    </tr>
  ));
}

/* ─── MAIN PAGE ──────────────────────────────────────────────────────── */
export default function AdminCategoriesPage() {
  const [search, setSearch] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [page, setPage] = useState(0);
  const size = 20;

  const queryClient = useQueryClient();
  const { accessToken } = useAuth();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  /* ── DATA ─────────────────────────────────────────────────────────── */
  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: ({ signal }) => publicApi.getCategories(signal),
    placeholderData: (prev) => prev,
  });

  // Normalize + client-side search/pagination since backend returns plain array
  const pageData = useMemo(() => {
    const raw = categoriesQuery.data?.data ?? categoriesQuery.data;
    let items = Array.isArray(raw) ? raw : [];

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      items = items.filter(
        c =>
          (c.name || "").toLowerCase().includes(q) ||
          (c.description || "").toLowerCase().includes(q)
      );
    }

    const totalItems = items.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / size));
    const paged = items.slice(page * size, page * size + size);

    return { items: paged, totalItems, totalPages };
  }, [categoriesQuery.data, search, page, size]);

  /* ── MUTATIONS ────────────────────────────────────────────────────── */
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

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setDescription("");
    setError("");
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (editingId) {
        await updateMutation.mutateAsync({ id: editingId, body: { name, description } });
      } else {
        await createMutation.mutateAsync({ name, description });
      }
      resetForm();
    } catch (err) {
      setError(err?.message || "Failed to save category.");
    }
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <RequireAdmin>
      <style>{globalStyles}
        {`@keyframes shimmer { 0%{background-position:-400px 0} 100%{background-position:400px 0} }`}
      </style>

      <div style={{ minHeight: "100vh", background: "#f7f7f7" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 20px 80px" }}>

          {/* ── PAGE HEADER ─────────────────────────────────────────── */}
          <div style={{ marginBottom: 32 }}>
            <p style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: "0.68rem",
              letterSpacing: "0.18em", color: "#bbb",
              textTransform: "uppercase", margin: "0 0 6px",
            }}>
              Admin Panel
            </p>
            <h1 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(1.6rem, 4vw, 2.2rem)",
              fontWeight: 800, color: "#111", margin: 0,
            }}>
              Categories
            </h1>
            {!categoriesQuery.isLoading && (
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.78rem", color: "#aaa", margin: "6px 0 0" }}>
                {pageData.totalItems} {pageData.totalItems === 1 ? "category" : "categories"} total
              </p>
            )}
          </div>

          {/* ── ERROR BANNER ────────────────────────────────────────── */}
          {error && (
            <div style={{
              marginBottom: 20, padding: "12px 16px",
              background: "#fff0f0", border: "1px solid #ffc9c9",
              borderRadius: "4px", borderLeft: "3px solid #e03131",
              display: "flex", alignItems: "center", justifyContent: "space-between",
              fontFamily: "'DM Sans', sans-serif", fontSize: "0.84rem", color: "#c92a2a",
            }}>
              {error}
              <button onClick={() => setError("")} style={{ background: "none", border: "none", cursor: "pointer", color: "#c92a2a", padding: 0 }}>
                <X size={14} />
              </button>
            </div>
          )}

          {categoriesQuery.isError && (
            <div style={{
              marginBottom: 20, padding: "12px 16px",
              background: "#fff0f0", border: "1px solid #ffc9c9",
              borderRadius: "4px", borderLeft: "3px solid #e03131",
              fontFamily: "'DM Sans', sans-serif", fontSize: "0.84rem", color: "#c92a2a",
            }}>
              Failed to load categories.{" "}
              {categoriesQuery.error?.message && `(${categoriesQuery.error.message})`}
            </div>
          )}

          {/* ── FORM CARD ────────────────────────────────────────────── */}
          <div style={{
            background: "#fff", border: "1px solid #e8e8e8",
            borderRadius: "6px", marginBottom: 24, overflow: "hidden",
          }}>
            {/* Form header */}
            <div style={{
              padding: "16px 24px", borderBottom: "1px solid #f0f0f0",
              background: editingId ? "#fffbf0" : "#fff",
              display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                  width: 30, height: 30, borderRadius: "50%",
                  background: editingId ? "#fff3cd" : "#111",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {editingId
                    ? <Pencil size={13} color="#8a5a00" />
                    : <Plus size={14} color="#fff" />
                  }
                </div>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "0.88rem", color: "#111" }}>
                  {editingId ? `Editing Category #${editingId}` : "Create New Category"}
                </span>
              </div>
              {editingId && (
                <button onClick={resetForm} style={{
                  display: "flex", alignItems: "center", gap: 6,
                  fontFamily: "'DM Sans', sans-serif", fontSize: "0.75rem",
                  fontWeight: 700, color: "#888",
                  background: "none", border: "1px solid #ddd",
                  borderRadius: "4px", padding: "5px 12px", cursor: "pointer",
                }}>
                  <RotateCcw size={11} /> Discard
                </button>
              )}
            </div>

            {/* Form body */}
            <form onSubmit={onSubmit} style={{ padding: "24px" }}>
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: "20px 24px",
                marginBottom: 20,
              }}>
                <Field label="Category Name" required>
                  <Input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Men's Clothing"
                    required
                  />
                </Field>

                <Field label="Description">
                  <Input
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Short description (optional)"
                  />
                </Field>
              </div>

              {/* Actions */}
              <div style={{
                display: "flex", gap: 12, flexWrap: "wrap",
                paddingTop: 16, borderTop: "1px solid #f0f0f0",
              }}>
                <button
                  type="submit"
                  disabled={isSaving}
                  style={{
                    display: "flex", alignItems: "center", gap: 8,
                    padding: "12px 28px",
                    background: isSaving ? "#555" : "#111",
                    color: "#fff", border: "none",
                    borderRadius: "4px", cursor: isSaving ? "not-allowed" : "pointer",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "0.78rem", fontWeight: 700,
                    letterSpacing: "0.1em", textTransform: "uppercase",
                    opacity: isSaving ? 0.7 : 1,
                    transition: "background 0.2s",
                  }}
                >
                  {isSaving ? "Saving…" : editingId ? "Update Category" : "Create Category"}
                </button>

                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    style={{
                      padding: "12px 24px",
                      background: "#fff", color: "#555",
                      border: "1.5px solid #ddd", borderRadius: "4px",
                      cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                      fontSize: "0.78rem", fontWeight: 600,
                    }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* ── SEARCH ──────────────────────────────────────────────── */}
          <div style={{ marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              flex: 1, display: "flex", alignItems: "center", gap: 10,
              padding: "10px 14px",
              background: "#fff",
              border: `1.5px solid ${searchFocused ? "#111" : "#ddd"}`,
              borderRadius: "4px",
              boxShadow: searchFocused ? "0 0 0 3px rgba(0,0,0,0.06)" : "none",
              transition: "border-color 0.18s, box-shadow 0.18s",
            }}>
              <Search size={15} color="#aaa" style={{ flexShrink: 0 }} />
              <input
                type="text"
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(0); }}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                placeholder="Search categories by name or description…"
                style={{
                  flex: 1, border: "none", outline: "none",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.88rem", color: "#111",
                  background: "transparent",
                }}
              />
              {search && (
                <button
                  type="button"
                  onClick={() => { setSearch(""); setPage(0); }}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "#aaa", padding: 0, display: "flex" }}
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          {/* ── TABLE ────────────────────────────────────────────────── */}
          <div style={{
            background: "#fff", border: "1px solid #e8e8e8",
            borderRadius: "6px", overflow: "hidden",
          }}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", minWidth: 560, borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#fafafa", borderBottom: "1px solid #ebebeb" }}>
                    {["ID", "Name", "Description", "Actions"].map(h => (
                      <th key={h} style={{
                        padding: "11px 14px", textAlign: "left",
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: "0.68rem", fontWeight: 700,
                        letterSpacing: "0.1em", textTransform: "uppercase",
                        color: "#888", whiteSpace: "nowrap",
                      }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {categoriesQuery.isLoading ? (
                    <TableSkeleton />
                  ) : pageData.items.length === 0 ? (
                    <tr>
                      <td colSpan={4} style={{
                        padding: "48px 24px", textAlign: "center",
                        fontFamily: "'DM Sans', sans-serif", color: "#bbb", fontSize: "0.88rem",
                      }}>
                        {search ? `No categories matching "${search}".` : "No categories yet."}
                      </td>
                    </tr>
                  ) : (
                    pageData.items.map((c, i) => (
                      <CategoryRow
                        key={c.id}
                        c={c}
                        isLast={i === pageData.items.length - 1}
                        onEdit={() => {
                          setEditingId(c.id);
                          setName(c.name || "");
                          setDescription(c.description || "");
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        onDelete={async () => {
                          setError("");
                          try { await deleteMutation.mutateAsync(c.id); }
                          catch (err) { setError(err?.message || "Failed to delete category."); }
                        }}
                      />
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── PAGINATION ───────────────────────────────────────────── */}
          {pageData.totalPages > 1 && (
            <div style={{
              display: "flex", justifyContent: "center", alignItems: "center",
              gap: 12, marginTop: 20,
            }}>
              <button
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0}
                style={paginationBtn(page === 0)}
              >
                ← Previous
              </button>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.82rem", color: "#666" }}>
                Page {page + 1} of {pageData.totalPages}
              </span>
              <button
                onClick={() => setPage(p => p + 1 < pageData.totalPages ? p + 1 : p)}
                disabled={page + 1 >= pageData.totalPages}
                style={paginationBtn(page + 1 >= pageData.totalPages)}
              >
                Next →
              </button>
            </div>
          )}

        </div>
      </div>
    </RequireAdmin>
  );
}

const paginationBtn = (disabled) => ({
  fontFamily: "'DM Sans', sans-serif",
  fontSize: "0.75rem", fontWeight: 700,
  letterSpacing: "0.08em", textTransform: "uppercase",
  padding: "10px 20px", borderRadius: "4px",
  border: "1.5px solid #111",
  background: disabled ? "#f5f5f5" : "#111",
  color: disabled ? "#bbb" : "#fff",
  cursor: disabled ? "not-allowed" : "pointer",
  opacity: disabled ? 0.5 : 1,
  transition: "all 0.18s",
});
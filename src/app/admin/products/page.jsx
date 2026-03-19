"use client";

import React, { useMemo, useState } from "react";
import RequireAdmin from "@/components/RequireAdmin";
import { useAuth } from "@/context/AuthContext";
import { adminApi, publicApi } from "@/lib/apiClient";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { normalizePage } from "@/lib/pagination";
import { Search, X, Pencil, Trash2, Plus, Tag, Package, RotateCcw } from "lucide-react";

/* ─── FIELD COMPONENT ────────────────────────────────────────────────── */
function Field({ label, hint, required, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: "0.72rem", fontWeight: 700,
        letterSpacing: "0.1em", textTransform: "uppercase",
        color: "#555", display: "flex", alignItems: "center", gap: 4,
      }}>
        {label}
        {required && <span style={{ color: "#e03131", fontSize: "0.9em" }}>*</span>}
      </label>
      {children}
      {hint && <span style={{ fontSize: "0.72rem", color: "#aaa", fontFamily: "'DM Sans', sans-serif" }}>{hint}</span>}
    </div>
  );
}

const inputStyle = (focused) => ({
  width: "100%",
  padding: "11px 14px",
  border: `1.5px solid ${focused ? "#111" : "#ddd"}`,
  borderRadius: "4px",
  fontSize: "0.88rem",
  fontFamily: "'DM Sans', sans-serif",
  color: "#111",
  background: "#fff",
  outline: "none",
  transition: "border-color 0.18s, box-shadow 0.18s",
  boxShadow: focused ? "0 0 0 3px rgba(0,0,0,0.06)" : "none",
  boxSizing: "border-box",
});

function Input({ value, onChange, placeholder, required, type = "text", inputMode, min, max }) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      inputMode={inputMode}
      min={min}
      max={max}
      style={inputStyle(focused)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    />
  );
}

function Select({ value, onChange, required, children }) {
  const [focused, setFocused] = useState(false);
  return (
    <select
      value={value}
      onChange={onChange}
      required={required}
      style={{ ...inputStyle(focused), appearance: "none", backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2.5'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center", paddingRight: 36 }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    >
      {children}
    </select>
  );
}

function Textarea({ value, onChange, rows = 3 }) {
  const [focused, setFocused] = useState(false);
  return (
    <textarea
      value={value}
      onChange={onChange}
      rows={rows}
      style={{ ...inputStyle(focused), resize: "vertical", minHeight: 90, lineHeight: 1.6 }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    />
  );
}

/* ─── MAIN PAGE ─────────────────────────────────────────────────────── */
export default function AdminProductsPage() {
  const queryClient = useQueryClient();
  const { accessToken } = useAuth();

  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const size = 20;

  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    name: "", description: "", price: "", discount: "",
    stockQuantity: "", imageUrls: "", categoryId: "",
  });
  const [error, setError] = useState("");

  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: ({ signal }) => publicApi.getCategories({}, signal),
  });

  const categories = useMemo(() => {
    const raw = categoriesQuery.data?.data ?? categoriesQuery.data;
    return Array.isArray(raw) ? raw : [];
  }, [categoriesQuery.data]);

  const productsQuery = useQuery({
    queryKey: ["products", { page, size, search }],
    queryFn: ({ signal }) => {
      if (search.trim())
        return publicApi.searchProducts({ q: search, page, size, sort: "createdAt,desc" }, signal);
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
    setForm({ name: "", description: "", price: "", discount: "", stockQuantity: "", imageUrls: "", categoryId: "" });
    setError("");
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const discountValue = form.discount === "" ? 0 : Number(form.discount);
    if (isNaN(discountValue) || discountValue < 0 || discountValue > 100) {
      setError("Discount must be between 0 and 100.");
      return;
    }
    const imageUrlsArray = Array.isArray(form.imageUrls)
      ? form.imageUrls
      : form.imageUrls.split(",").map(u => u.trim()).filter(Boolean);
    const payload = {
      name: form.name, description: form.description,
      price: Number(form.price), discount: discountValue,
      stockQuantity: Number(form.stockQuantity),
      imageUrls: imageUrlsArray, categoryId: Number(form.categoryId),
    };
    try {
      if (editingId) await updateMutation.mutateAsync({ id: editingId, body: payload });
      else await createMutation.mutateAsync(payload);
      resetForm();
    } catch (err) {
      setError(err?.message || "Failed to save product.");
    }
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <RequireAdmin>
      <style>{globalStyles}</style>
      <div style={{ minHeight: "100vh", background: "#f7f7f7" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 20px 80px" }}>

          {/* PAGE HEADER */}
          <div style={{ marginBottom: 32, display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <div>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.68rem", letterSpacing: "0.18em", color: "#aaa", textTransform: "uppercase", margin: "0 0 6px" }}>
                Admin Panel
              </p>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.6rem, 4vw, 2.2rem)", fontWeight: 700, color: "#111", margin: 0 }}>
                Products
              </h1>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "'DM Sans', sans-serif", fontSize: "0.78rem", color: "#888" }}>
              <Package size={14} />
              {!productsQuery.isLoading && `${pageData.items.length} items`}
            </div>
          </div>

          {/* ERROR BANNER */}
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

          {/* ── FORM CARD ───────────────────────────────────────────── */}
          <div style={{
            background: "#fff", border: "1px solid #e8e8e8",
            borderRadius: "6px", marginBottom: 24,
            overflow: "hidden",
          }}>
            {/* Form header */}
            <div style={{
              padding: "18px 24px", borderBottom: "1px solid #f0f0f0",
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
                  {editingId ? `Editing Product #${editingId}` : "Create New Product"}
                </span>
              </div>
              {editingId && (
                <button onClick={resetForm} style={{
                  display: "flex", alignItems: "center", gap: 6,
                  fontFamily: "'DM Sans', sans-serif", fontSize: "0.75rem",
                  color: "#888", background: "none", border: "1px solid #ddd",
                  borderRadius: "4px", padding: "5px 12px", cursor: "pointer",
                }}>
                  <RotateCcw size={11} /> Discard
                </button>
              )}
            </div>

            {/* Form body */}
            <form onSubmit={onSubmit} style={{ padding: "28px 24px 24px" }}>
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: "20px 24px",
                marginBottom: 20,
              }}>

                <Field label="Product Name" required>
                  <Input
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="e.g. Classic White Shirt"
                    required
                  />
                </Field>

                <Field label="Category" required>
                  <Select
                    value={form.categoryId}
                    onChange={e => setForm(f => ({ ...f, categoryId: e.target.value }))}
                    required
                  >
                    <option value="">Select a category…</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </Select>
                </Field>

                <Field label="Price (₹)" required>
                  <Input
                    value={form.price}
                    onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                    placeholder="e.g. 1499"
                    inputMode="decimal"
                    required
                  />
                </Field>

                <Field label="Discount (%)" hint="Leave blank for 0%">
                  <Input
                    value={form.discount}
                    onChange={e => setForm(f => ({ ...f, discount: e.target.value }))}
                    placeholder="0 – 100"
                    inputMode="decimal"
                    min="0"
                    max="100"
                  />
                </Field>

                <Field label="Stock Quantity" required>
                  <Input
                    value={form.stockQuantity}
                    onChange={e => setForm(f => ({ ...f, stockQuantity: e.target.value }))}
                    placeholder="e.g. 50"
                    inputMode="numeric"
                    required
                  />
                </Field>

                <Field label="Image URLs" hint="Comma-separated. First image shown as thumbnail.">
                  <Input
                    value={form.imageUrls}
                    onChange={e => setForm(f => ({ ...f, imageUrls: e.target.value }))}
                    placeholder="https://img1.jpg, https://img2.jpg"
                  />
                </Field>

                <div style={{ gridColumn: "1 / -1" }}>
                  <Field label="Description">
                    <Textarea
                      value={form.description}
                      onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                      rows={3}
                    />
                  </Field>
                </div>
              </div>

              {/* Form actions */}
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
                    transition: "background 0.2s",
                    opacity: isSaving ? 0.7 : 1,
                  }}
                >
                  {isSaving
                    ? "Saving…"
                    : editingId ? "Update Product" : "Create Product"
                  }
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
                      letterSpacing: "0.06em",
                    }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* ── SEARCH ──────────────────────────────────────────────── */}
          <div style={{
            marginBottom: 16,
            display: "flex", alignItems: "center", gap: 10,
          }}>
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
                placeholder="Search products by name…"
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
                  onClick={() => setSearch("")}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "#aaa", padding: 0, display: "flex" }}
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          {/* ── TABLE ────────────────────────────────────────────────── */}
          {productsQuery.isLoading ? (
            <div style={{
              background: "#fff", border: "1px solid #e8e8e8", borderRadius: "6px",
              padding: "48px 24px", textAlign: "center",
              fontFamily: "'DM Sans', sans-serif", color: "#aaa", fontSize: "0.88rem",
            }}>
              Loading products…
            </div>
          ) : (
            <>
              <div style={{
                background: "#fff",
                border: "1px solid #e8e8e8",
                borderRadius: "6px",
                overflow: "hidden",
              }}>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", minWidth: 680, borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ background: "#fafafa", borderBottom: "1px solid #ebebeb" }}>
                        {["ID", "Name", "Price", "Discount", "Final Price", "Stock", "Category", "Actions"].map(h => (
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
                      {pageData.items.length === 0 ? (
                        <tr>
                          <td colSpan={8} style={{
                            padding: "48px 24px", textAlign: "center",
                            fontFamily: "'DM Sans', sans-serif", color: "#bbb", fontSize: "0.88rem",
                          }}>
                            No products found.
                          </td>
                        </tr>
                      ) : pageData.items.map((p, i) => {
                        const discount = typeof p.discount === "number" ? p.discount : Number(p.discount) || 0;
                        const finalPrice = p.price && discount > 0 ? p.price - (p.price * discount) / 100 : p.price;

                        return (
                          <TableRow
                            key={p.id}
                            p={p}
                            discount={discount}
                            finalPrice={finalPrice}
                            isLast={i === pageData.items.length - 1}
                            onEdit={() => {
                              setEditingId(p.id);
                              setForm({
                                name: p.name || "",
                                description: p.description || "",
                                price: String(p.price ?? ""),
                                discount: typeof p.discount === "number" ? String(p.discount) : p.discount || "",
                                stockQuantity: String(p.stockQuantity ?? ""),
                                imageUrls: Array.isArray(p.imageUrls) ? p.imageUrls.join(", ") : typeof p.imageUrls === "string" ? p.imageUrls : "",
                                categoryId: String(p.categoryId ?? p.category?.id ?? ""),
                              });
                              window.scrollTo({ top: 0, behavior: "smooth" });
                            }}
                            onDelete={async () => {
                              setError("");
                              try { await deleteMutation.mutateAsync(p.id); }
                              catch (err) { setError(err?.message || "Failed to delete product."); }
                            }}
                          />
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* PAGINATION */}
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
            </>
          )}
        </div>
      </div>
    </RequireAdmin>
  );
}

/* ─── TABLE ROW ──────────────────────────────────────────────────────── */
function TableRow({ p, discount, finalPrice, isLast, onEdit, onDelete }) {
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
      <td style={tdStyle}><span style={{ color: "#bbb", fontFamily: "'DM Sans', sans-serif", fontSize: "0.8rem" }}>#{p.id}</span></td>
      <td style={{ ...tdStyle, maxWidth: 180 }}>
        <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "0.85rem", color: "#111", display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {p.name}
        </span>
      </td>
      <td style={tdStyle}><span style={numStyle}>₹{p.price?.toLocaleString("en-IN")}</span></td>
      <td style={tdStyle}>
        {discount > 0
          ? <span style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "#f0faf3", color: "#1a7a3a", padding: "3px 8px", borderRadius: "2px", fontSize: "0.72rem", fontWeight: 700, fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.06em" }}>
              <Tag size={10} /> {discount}% OFF
            </span>
          : <span style={{ color: "#ccc", fontFamily: "'DM Sans', sans-serif", fontSize: "0.82rem" }}>—</span>
        }
      </td>
      <td style={tdStyle}><span style={{ ...numStyle, fontWeight: 700 }}>₹{finalPrice?.toLocaleString("en-IN")}</span></td>
      <td style={tdStyle}>
        <span style={{
          ...numStyle,
          color: (p.stockQuantity ?? 0) < 5 ? "#e03131" : "#111",
          fontWeight: (p.stockQuantity ?? 0) < 5 ? 700 : 400,
        }}>
          {p.stockQuantity ?? "—"}
        </span>
      </td>
      <td style={tdStyle}>
        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.82rem", color: "#666" }}>
          {p.category?.name || p.categoryName || p.categoryId || "—"}
        </span>
      </td>
      <td style={tdStyle}>
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
              transition: "border-color 0.15s, background 0.15s",
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
              transition: "background 0.15s",
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

/* ─── SHARED STYLES ─────────────────────────────────────────────────── */
const tdStyle = {
  padding: "13px 14px",
  verticalAlign: "middle",
};

const numStyle = {
  fontFamily: "'DM Sans', sans-serif",
  fontSize: "0.85rem",
  color: "#111",
};

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

const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@400;500;600;700;800&display=swap');
  * { box-sizing: border-box; }
  input::placeholder, textarea::placeholder { color: #ccc !important; }
  input[type=number]::-webkit-inner-spin-button,
  input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
`;
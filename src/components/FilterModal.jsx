"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, SlidersHorizontal } from "lucide-react";

const TABS = [
  { key: "category", label: "Categories" },
  { key: "price",    label: "Price"      },
  { key: "sort",     label: "Sort By"    },
  { key: "stock",    label: "Availability" },
];

// ─── design tokens ───────────────────────────────────────────────────────────
const TOKEN = {
  gold:       "#B8964E",
  goldLight:  "#D4AF6E",
  ivory:      "#FAF7F2",
  parchment:  "#F0E9DF",
  rose:       "#E8DDD0",
  charcoal:   "#1A1A1A",
  muted:      "#6B6156",
  white:      "#FFFFFF",
  border:     "#DDD3C7",
};

// ─── tiny style helpers ───────────────────────────────────────────────────────
const styles = {
  overlay: {
    position: "fixed", inset: 0, background: "rgba(15,10,5,0.55)", zIndex: 40,
  },
  drawer: {
    position: "fixed", right: 0, top: 0, height: "100%",
    width: "100%", maxWidth: 440,
    background: TOKEN.white, zIndex: 50,
    display: "flex", fontFamily: "'Georgia', serif",
    boxShadow: "-8px 0 40px rgba(0,0,0,0.18)",
    borderRadius: "16px 0 0 16px",
    overflow: "hidden",
  },

  // ── left sidebar ──
  sidebar: {
    width: "38%", background: TOKEN.ivory,
    borderRight: `1px solid ${TOKEN.border}`,
    display: "flex", flexDirection: "column",
  },
  tabBtn: (active) => ({
    width: "100%", textAlign: "left",
    padding: "18px 16px",
    fontSize: 13,
    fontWeight: active ? 800 : 500,
    fontFamily: "'Georgia', serif",
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    borderBottom: `1px solid ${TOKEN.border}`,
    borderLeft: active ? `4px solid ${TOKEN.gold}` : "4px solid transparent",
    background: active ? TOKEN.white : "transparent",
    color: active ? TOKEN.charcoal : TOKEN.muted,
    cursor: "pointer",
    transition: "all 0.2s ease",
    outline: "none",
  }),

  // ── right panel ──
  right: {
    flex: 1, display: "flex", flexDirection: "column",
  },
  header: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "20px 22px",
    borderBottom: `1px solid ${TOKEN.border}`,
    background: TOKEN.white,
  },
  headerLeft: {
    display: "flex", alignItems: "center", gap: 10,
  },
  headerTitle: {
    fontSize: 20, fontWeight: 700, color: TOKEN.charcoal,
    fontFamily: "'Georgia', serif", letterSpacing: "0.02em",
    margin: 0,
  },
  headerIcon: {
    color: TOKEN.gold,
  },
  closeBtn: {
    cursor: "pointer", color: TOKEN.muted, padding: 4, border: "none",
    background: "transparent",
    borderRadius: 6,
    transition: "color 0.2s",
    display: "flex", alignItems: "center",
  },
  body: {
    flex: 1, overflowY: "auto", padding: "24px 22px",
  },

  // ── radio / option row ──
  optionRow: (checked) => ({
    display: "flex", alignItems: "center", gap: 14,
    padding: "12px 16px",
    borderRadius: 10,
    background: checked ? TOKEN.parchment : "transparent",
    border: checked ? `1.5px solid ${TOKEN.gold}` : `1.5px solid transparent`,
    cursor: "pointer",
    marginBottom: 8,
    transition: "all 0.18s ease",
  }),
  radioOuter: (checked) => ({
    width: 18, height: 18, borderRadius: "50%", flexShrink: 0,
    border: `2px solid ${checked ? TOKEN.gold : TOKEN.border}`,
    display: "flex", alignItems: "center", justifyContent: "center",
    transition: "border-color 0.18s",
  }),
  radioDot: {
    width: 9, height: 9, borderRadius: "50%",
    background: TOKEN.gold,
  },
  optionLabel: (checked) => ({
    fontSize: 14, fontWeight: checked ? 700 : 500,
    color: checked ? TOKEN.charcoal : TOKEN.muted,
    letterSpacing: "0.03em",
    fontFamily: "'Georgia', serif",
    cursor: "pointer",
  }),

  // ── price inputs ──
  priceInput: {
    width: "100%",
    padding: "13px 16px",
    border: `1.5px solid ${TOKEN.border}`,
    borderRadius: 10,
    fontSize: 14,
    fontFamily: "'Georgia', serif",
    color: TOKEN.charcoal,
    background: TOKEN.ivory,
    outline: "none",
    boxSizing: "border-box",
    marginBottom: 12,
    transition: "border-color 0.2s",
  },
  priceLabel: {
    fontSize: 11, fontWeight: 700, letterSpacing: "0.1em",
    textTransform: "uppercase", color: TOKEN.muted,
    display: "block", marginBottom: 6,
    fontFamily: "sans-serif",
  },

  // ── toggle ──
  toggleRow: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "16px 18px",
    borderRadius: 12,
    border: `1.5px solid ${TOKEN.border}`,
    background: TOKEN.ivory,
  },
  toggleLabel: {
    fontSize: 14, fontWeight: 600, color: TOKEN.charcoal,
    fontFamily: "'Georgia', serif", letterSpacing: "0.03em",
  },
  toggleTrack: (on) => ({
    width: 46, height: 26, borderRadius: 13,
    background: on ? TOKEN.gold : TOKEN.border,
    position: "relative", cursor: "pointer",
    transition: "background 0.25s",
    flexShrink: 0,
  }),
  toggleThumb: (on) => ({
    position: "absolute", top: 3,
    left: on ? 23 : 3,
    width: 20, height: 20, borderRadius: "50%",
    background: TOKEN.white,
    boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
    transition: "left 0.25s",
  }),

  // ── footer buttons ──
  footer: {
    display: "flex", borderTop: `1px solid ${TOKEN.border}`,
  },
  clearBtn: {
    flex: 1, padding: "18px 0",
    background: "transparent",
    border: "none", cursor: "pointer",
    fontSize: 13, fontWeight: 700, letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: TOKEN.muted,
    fontFamily: "sans-serif",
    transition: "color 0.2s",
    borderRight: `1px solid ${TOKEN.border}`,
  },
  applyBtn: {
    flex: 1, padding: "18px 0",
    background: TOKEN.charcoal,
    border: "none", cursor: "pointer",
    fontSize: 13, fontWeight: 700, letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: TOKEN.white,
    fontFamily: "sans-serif",
    transition: "background 0.2s",
  },
};

// ─── sub-components ───────────────────────────────────────────────────────────

function RadioOption({ checked, onChange, label }) {
  return (
    <div style={styles.optionRow(checked)} onClick={onChange}>
      <div style={styles.radioOuter(checked)}>
        {checked && <div style={styles.radioDot} />}
      </div>
      <span style={styles.optionLabel(checked)}>{label}</span>
    </div>
  );
}

function PriceInput({ label, value, onChange, placeholder }) {
  return (
    <div>
      <span style={styles.priceLabel}>{label}</span>
      <input
        type="number"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={styles.priceInput}
        onFocus={(e) => (e.target.style.borderColor = TOKEN.gold)}
        onBlur={(e) => (e.target.style.borderColor = TOKEN.border)}
      />
    </div>
  );
}

function Toggle({ checked, onChange }) {
  return (
    <div style={styles.toggleTrack(checked)} onClick={onChange}>
      <div style={styles.toggleThumb(checked)} />
    </div>
  );
}

// ─── main component ───────────────────────────────────────────────────────────

export default function FilterModal({
  isOpen, onClose,
  sort, onSortChange,
  categoryId, onCategoryChange,
  minPrice, onMinPriceChange,
  maxPrice, onMaxPriceChange,
  inStock, onInStockChange,
  categories = [],
  onClearFilters,
}) {
  const [activeTab, setActiveTab] = useState("category");
  const [draftSort,      setDraftSort]      = useState(sort ?? "createdAt,desc");
  const [draftCategory,  setDraftCategory]  = useState(categoryId ?? "");
  const [draftMinPrice,  setDraftMinPrice]  = useState(minPrice ?? "");
  const [draftMaxPrice,  setDraftMaxPrice]  = useState(maxPrice ?? "");
  const [draftInStock,   setDraftInStock]   = useState(inStock ?? false);

  useEffect(() => {
    if (isOpen) {
      setDraftSort(sort ?? "createdAt,desc");
      setDraftCategory(categoryId ?? "");
      setDraftMinPrice(minPrice ?? "");
      setDraftMaxPrice(maxPrice ?? "");
      setDraftInStock(inStock ?? false);
    }
  }, [isOpen]);

  function handleApply() {
    onSortChange?.(draftSort);
    onCategoryChange?.(draftCategory);
    onMinPriceChange?.(draftMinPrice);
    onMaxPriceChange?.(draftMaxPrice);
    onInStockChange?.(draftInStock);
    onClose();
  }

  function handleClear() {
    setDraftSort("createdAt,desc");
    setDraftCategory("");
    setDraftMinPrice("");
    setDraftMaxPrice("");
    setDraftInStock(false);
    onClearFilters?.();
  }

  const SORT_OPTIONS = [
    { value: "price,asc",       label: "Price — Low to High" },
    { value: "price,desc",      label: "Price — High to Low" },
    { value: "rating,desc",     label: "Customer Rating"     },
    { value: "discount,desc",   label: "Best Discount"       },
    { value: "createdAt,desc",  label: "Newest Arrivals"     },
    { value: "popularity,desc", label: "Most Popular"        },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* overlay */}
          <motion.div
            style={styles.overlay}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* drawer */}
          <motion.div
            style={styles.drawer}
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 240 }}
          >

            {/* ── LEFT SIDEBAR ── */}
            <div style={styles.sidebar}>
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  style={styles.tabBtn(activeTab === tab.key)}
                  onClick={() => setActiveTab(tab.key)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* ── RIGHT PANEL ── */}
            <div style={styles.right}>

              {/* header */}
              <div style={styles.header}>
                <div style={styles.headerLeft}>
                  <SlidersHorizontal size={18} style={styles.headerIcon} />
                  <h2 style={styles.headerTitle}>Refine</h2>
                </div>
                <button style={styles.closeBtn} onClick={onClose}>
                  <X size={20} />
                </button>
              </div>

              {/* body */}
              <div style={styles.body}>

                {/* CATEGORY */}
                {activeTab === "category" && (
                  <>
                    <RadioOption
                      checked={draftCategory === ""}
                      onChange={() => setDraftCategory("")}
                      label="All Collections"
                    />
                    {categories.map((cat) => (
                      <RadioOption
                        key={cat.id}
                        checked={String(draftCategory) === String(cat.id)}
                        onChange={() => setDraftCategory(cat.id)}
                        label={cat.name}
                      />
                    ))}
                  </>
                )}

                {/* PRICE */}
                {activeTab === "price" && (
                  <>
                    <PriceInput
                      label="Minimum Price (₹)"
                      placeholder="e.g. 500"
                      value={draftMinPrice}
                      onChange={setDraftMinPrice}
                    />
                    <PriceInput
                      label="Maximum Price (₹)"
                      placeholder="e.g. 50,000"
                      value={draftMaxPrice}
                      onChange={setDraftMaxPrice}
                    />
                  </>
                )}

                {/* SORT */}
                {activeTab === "sort" && (
                  <>
                    {SORT_OPTIONS.map((opt) => (
                      <RadioOption
                        key={opt.value}
                        checked={draftSort === opt.value}
                        onChange={() => setDraftSort(opt.value)}
                        label={opt.label}
                      />
                    ))}
                  </>
                )}

                {/* AVAILABILITY */}
                {activeTab === "stock" && (
                  <div style={styles.toggleRow}>
                    <span style={styles.toggleLabel}>In Stock Only</span>
                    <Toggle
                      checked={draftInStock}
                      onChange={() => setDraftInStock(!draftInStock)}
                    />
                  </div>
                )}

              </div>

              {/* footer */}
              <div style={styles.footer}>
                <button
                  style={styles.clearBtn}
                  onClick={handleClear}
                  onMouseEnter={(e) => (e.target.style.color = TOKEN.charcoal)}
                  onMouseLeave={(e) => (e.target.style.color = TOKEN.muted)}
                >
                  Clear All
                </button>
                <button
                  style={styles.applyBtn}
                  onClick={handleApply}
                  onMouseEnter={(e) => (e.target.style.background = TOKEN.gold)}
                  onMouseLeave={(e) => (e.target.style.background = TOKEN.charcoal)}
                >
                  Apply Filters
                </button>
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
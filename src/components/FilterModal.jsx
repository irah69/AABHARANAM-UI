"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Tag, IndianRupee, Package, ArrowUpDown } from "lucide-react";

const DUMMY_CATEGORIES = [
  { id: 1,  name: "Banarasi Silk" },
  { id: 2,  name: "Kanjivaram" },
  { id: 3,  name: "Chanderi" },
  { id: 4,  name: "Tussar Silk" },
  { id: 5,  name: "Georgette" },
  { id: 6,  name: "Chiffon" },
  { id: 7,  name: "Cotton" },
  { id: 8,  name: "Linen" },
  { id: 9,  name: "Patola" },
  { id: 10, name: "Bandhani" },
];

const SORT_OPTIONS = [
  { value: "createdAt,desc", label: "Newest First" },
  { value: "createdAt,asc",  label: "Oldest First" },
  { value: "price,asc",      label: "Price: Low → High" },
  { value: "price,desc",     label: "Price: High → Low" },
  { value: "name,asc",       label: "Name: A → Z" },
  { value: "name,desc",      label: "Name: Z → A" },
];

const PRICE_PRESETS = [
  { label: "Under ₹2k",  min: "",      max: "2000"  },
  { label: "₹2k – ₹5k",  min: "2000",  max: "5000"  },
  { label: "₹5k – ₹10k", min: "5000",  max: "10000" },
  { label: "Above ₹10k", min: "10000", max: ""       },
];

function Divider() {
  return <div className="h-px bg-gray-100 my-1" />;
}

function SectionLabel({ icon: Icon, label }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <Icon size={14} strokeWidth={2.5} className="text-black flex-shrink-0" />
      <span className="text-[11px] font-black uppercase tracking-widest text-black">
        {label}
      </span>
    </div>
  );
}

export default function FilterModal({
  isOpen,
  onClose,
  sort,
  onSortChange,
  categoryId,
  onCategoryChange,
  minPrice,
  onMinPriceChange,
  maxPrice,
  onMaxPriceChange,
  inStock,
  onInStockChange,
  categories: externalCategories,
  onClearFilters,
}) {
  const [draftSort,     setDraftSort]     = useState(sort       ?? "createdAt,desc");
  const [draftCategory, setDraftCategory] = useState(categoryId ?? "");
  const [draftMinPrice, setDraftMinPrice] = useState(minPrice   ?? "");
  const [draftMaxPrice, setDraftMaxPrice] = useState(maxPrice   ?? "");
  const [draftInStock,  setDraftInStock]  = useState(inStock    ?? false);

  useEffect(() => {
    if (isOpen) {
      setDraftSort(sort       ?? "createdAt,desc");
      setDraftCategory(categoryId ?? "");
      setDraftMinPrice(minPrice   ?? "");
      setDraftMaxPrice(maxPrice   ?? "");
      setDraftInStock(inStock    ?? false);
    }
  }, [isOpen]);

  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const categories =
    Array.isArray(externalCategories) && externalCategories.length > 0
      ? externalCategories
      : DUMMY_CATEGORIES;

  const activeCount = [draftCategory, draftMinPrice, draftMaxPrice, draftInStock].filter(Boolean).length;

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
    onClose();
  }

  const isPresetActive = (p) =>
    draftMinPrice === p.min && draftMaxPrice === p.max && (p.min !== "" || p.max !== "");

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/40 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Drawer — slides in from RIGHT */}
          <motion.aside
            className="fixed right-0 top-0 h-full w-full max-w-[400px] bg-white z-50 flex flex-col shadow-2xl rounded-l-2xl overflow-hidden"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 340, damping: 36 }}
          >

            {/* ── Header ── */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <SlidersHorizontal size={18} strokeWidth={2.5} className="text-black" />
                <h2 className="text-lg font-bold text-black tracking-tight">Filters & Sort</h2>
                {activeCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="bg-black text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
                  >
                    {activeCount}
                  </motion.span>
                )}
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              >
                <X size={16} strokeWidth={2.5} className="text-black" />
              </button>
            </div>

            {/* ── Scrollable body ── */}
            <div className="flex-1 overflow-y-auto">

              {/* SORT BY */}
              <div className="px-6 py-6">
                <SectionLabel icon={ArrowUpDown} label="Sort By" />
                <div className="grid grid-cols-2 gap-2">
                  {SORT_OPTIONS.map((opt) => {
                    const active = draftSort === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setDraftSort(opt.value)}
                        className={`
                          flex items-center gap-2 px-3 py-2.5 rounded-lg border text-xs font-medium text-left transition-all duration-150
                          ${active
                            ? "bg-black text-white border-black"
                            : "bg-white text-gray-600 border-gray-200 hover:border-gray-400 hover:text-black"}
                        `}
                      >
                        <span className={`
                          w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all
                          ${active ? "border-white" : "border-gray-300"}
                        `}>
                          {active && <span className="w-1.5 h-1.5 rounded-full bg-white block" />}
                        </span>
                        <span className="leading-snug">{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <Divider />

              {/* CATEGORY */}
              <div className="px-6 py-6">
                <SectionLabel icon={Tag} label="Category" />
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setDraftCategory("")}
                    className={`
                      px-3 py-1.5 rounded-full border text-xs font-medium transition-all duration-150
                      ${draftCategory === ""
                        ? "bg-black text-white border-black"
                        : "bg-white text-gray-600 border-gray-300 hover:border-gray-500 hover:text-black"}
                    `}
                  >
                    All
                  </button>
                  {categories.map((cat) => {
                    const active = String(draftCategory) === String(cat.id);
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setDraftCategory(active ? "" : String(cat.id))}
                        className={`
                          px-3 py-1.5 rounded-full border text-xs font-medium transition-all duration-150
                          ${active
                            ? "bg-black text-white border-black"
                            : "bg-white text-gray-600 border-gray-300 hover:border-gray-500 hover:text-black"}
                        `}
                      >
                        {cat.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              <Divider />

              {/* PRICE RANGE */}
              <div className="px-6 py-6">
                <SectionLabel icon={IndianRupee} label="Price Range" />

                {/* Min / Max inputs */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex-1 relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs select-none">₹</span>
                    <input
                      type="number"
                      min={0}
                      value={draftMinPrice}
                      onChange={(e) => setDraftMinPrice(e.target.value)}
                      placeholder="Min"
                      className="w-full pl-6 pr-3 py-2 border border-gray-200 rounded-lg text-xs text-black placeholder-gray-400 focus:outline-none focus:border-black transition-colors bg-white"
                    />
                  </div>
                  <span className="text-gray-300 text-sm flex-shrink-0">—</span>
                  <div className="flex-1 relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs select-none">₹</span>
                    <input
                      type="number"
                      min={0}
                      value={draftMaxPrice}
                      onChange={(e) => setDraftMaxPrice(e.target.value)}
                      placeholder="Max"
                      className="w-full pl-6 pr-3 py-2 border border-gray-200 rounded-lg text-xs text-black placeholder-gray-400 focus:outline-none focus:border-black transition-colors bg-white"
                    />
                  </div>
                </div>

                {/* Preset chips */}
                <div className="grid grid-cols-2 gap-2">
                  {PRICE_PRESETS.map((p) => {
                    const active = isPresetActive(p);
                    return (
                      <button
                        key={p.label}
                        type="button"
                        onClick={() => {
                          if (active) {
                            setDraftMinPrice("");
                            setDraftMaxPrice("");
                          } else {
                            setDraftMinPrice(p.min);
                            setDraftMaxPrice(p.max);
                          }
                        }}
                        className={`
                          py-2 rounded-lg border text-xs font-medium transition-all duration-150
                          ${active
                            ? "bg-black text-white border-black"
                            : "bg-white text-gray-600 border-gray-200 hover:border-gray-400 hover:text-black"}
                        `}
                      >
                        {p.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <Divider />

              {/* AVAILABILITY */}
              <div className="px-6 py-6">
                <SectionLabel icon={Package} label="Availability" />
                <button
                  type="button"
                  onClick={() => setDraftInStock((v) => !v)}
                  className={`
                    w-full flex items-center justify-between px-4 py-3.5 rounded-lg border transition-all duration-200
                    ${draftInStock
                      ? "bg-black border-black"
                      : "bg-white border-gray-200 hover:border-gray-400"}
                  `}
                >
                  <div className="text-left">
                    <p className={`text-sm font-semibold ${draftInStock ? "text-white" : "text-black"}`}>
                      In Stock Only
                    </p>
                    <p className={`text-xs mt-0.5 ${draftInStock ? "text-gray-300" : "text-gray-400"}`}>
                      Show only available items
                    </p>
                  </div>

                  {/* Toggle */}
                  <div className={`
                    relative w-10 h-5 rounded-full flex-shrink-0 transition-colors duration-200
                    ${draftInStock ? "bg-white" : "bg-gray-200"}
                  `}>
                    <motion.div
                      className={`absolute top-[2px] w-4 h-4 rounded-full shadow-sm
                        ${draftInStock ? "bg-black" : "bg-white border border-gray-300"}`}
                      animate={{ left: draftInStock ? "22px" : "2px" }}
                      transition={{ type: "spring", stiffness: 500, damping: 32 }}
                    />
                  </div>
                </button>
              </div>

            </div>

            {/* ── Footer ── */}
            <div className="px-6 py-4 border-t border-gray-100 bg-white flex gap-3">
              <button
                type="button"
                onClick={handleClear}
                className="flex-1 py-2.5 rounded-lg border border-gray-300 text-sm font-semibold text-black hover:bg-gray-50 hover:border-black transition-all"
              >
                Clear All
              </button>
              <button
                type="button"
                onClick={handleApply}
                className="flex-1 py-2.5 rounded-lg bg-black text-white text-sm font-bold hover:bg-gray-900 transition-all"
              >
                Apply Filters
              </button>
            </div>

          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
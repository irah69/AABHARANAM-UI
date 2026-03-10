"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, SlidersHorizontal, Tag, IndianRupee, Package, ArrowUpDown } from "lucide-react";

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
  return <div className="h-px bg-gray-100 mx-6" />;
}

function SectionLabel({ icon: Icon, label }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <Icon size={13} strokeWidth={2.5} className="text-black" />
      <span className="text-[10px] font-black uppercase tracking-[0.18em] text-black">
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

          {/* Drawer */}
          <motion.aside
            className="fixed right-0 top-0 h-full w-full max-w-[440px] bg-white z-50 flex flex-col rounded-l-2xl"
            style={{ boxShadow: "-4px 0 32px rgba(0,0,0,0.10)" }}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 340, damping: 36 }}
          >

            {/* ── Header ── */}
            <div className="flex items-center justify-between px-10 py-7 border-b border-gray-200 rounded-tl-2xl">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-bold text-black tracking-tight">Filters & Sort</h2>
                {activeCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="bg-black text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center"
                  >
                    {activeCount}
                  </motion.span>
                )}
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              >
                <X size={18} strokeWidth={2.5} className="text-black" />
              </button>
            </div>

            {/* ── Scrollable body ── */}
            <div className="flex-1 overflow-y-auto px-10 py-8 space-y-10">

              {/* SORT BY */}
              <div>
                <SectionLabel icon={ArrowUpDown} label="Sort By" />
                <div className="grid grid-cols-2 gap-4">
                  {SORT_OPTIONS.map((opt) => {
                    const active = draftSort === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setDraftSort(opt.value)}
                        className={`
                          flex items-center gap-2 px-3 py-3 rounded-lg border text-sm font-medium text-left transition-all duration-150
                          ${active
                            ? "bg-black text-white border-black"
                            : "bg-white text-gray-600 border-gray-200 hover:border-gray-400 hover:text-black"}
                        `}
                      >
                        {/* Radio dot */}
                        <span className={`
                          w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all
                          ${active ? "border-white" : "border-gray-300"}
                        `}>
                          {active && <span className="w-[7px] h-[7px] rounded-full bg-white block" />}
                        </span>
                        <span className="leading-snug">{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <Divider />

              {/* CATEGORY */}
              <div>
                <SectionLabel icon={Tag} label="Category" />
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => setDraftCategory("")}
                    className={`
                      px-4 py-2 rounded-full border text-sm font-medium transition-all duration-150
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
                          px-4 py-2 rounded-full border text-sm font-medium transition-all duration-150
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
              <div>
                <SectionLabel icon={IndianRupee} label="Price Range" />

                {/* Min / Max inputs */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex-1 relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm select-none">₹</span>
                    <input
                      type="number"
                      min={0}
                      value={draftMinPrice}
                      onChange={(e) => setDraftMinPrice(e.target.value)}
                      placeholder="Min"
                      className="w-full pl-7 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm text-black placeholder-gray-400 focus:outline-none focus:border-black transition-colors bg-white"
                    />
                  </div>
                  <span className="text-gray-300 text-base flex-shrink-0">—</span>
                  <div className="flex-1 relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm select-none">₹</span>
                    <input
                      type="number"
                      min={0}
                      value={draftMaxPrice}
                      onChange={(e) => setDraftMaxPrice(e.target.value)}
                      placeholder="Max"
                      className="w-full pl-7 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm text-black placeholder-gray-400 focus:outline-none focus:border-black transition-colors bg-white"
                    />
                  </div>
                </div>

                {/* Preset chips */}
                <div className="grid grid-cols-2 gap-3">
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
                          py-2.5 rounded-lg border text-sm font-medium transition-all duration-150
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
              <div>
                <SectionLabel icon={Package} label="Availability" />
                <button
                  type="button"
                  onClick={() => setDraftInStock((v) => !v)}
                  className={`
                    w-full flex items-center justify-between px-6 py-4 rounded-lg border transition-all duration-200
                    ${draftInStock
                      ? "bg-black border-black"
                      : "bg-white border-gray-200 hover:border-gray-400"}
                  `}
                >
                  <div className="text-left">
                    <p className={`text-base font-semibold ${draftInStock ? "text-white" : "text-black"}`}>
                      In Stock Only
                    </p>
                    <p className={`text-sm mt-1 ${draftInStock ? "text-gray-300" : "text-gray-400"}`}>
                      Show only available items
                    </p>
                  </div>

                  {/* Toggle */}
                  <div className={`
                    relative w-11 h-6 rounded-full flex-shrink-0 transition-colors duration-200
                    ${draftInStock ? "bg-white" : "bg-gray-200"}
                  `}>
                    <motion.div
                      className={`absolute top-[2px] w-5 h-5 rounded-full shadow-sm
                        ${draftInStock ? "bg-black" : "bg-white border border-gray-300"}`}
                      animate={{ left: draftInStock ? "22px" : "2px" }}
                      transition={{ type: "spring", stiffness: 500, damping: 32 }}
                    />
                  </div>
                </button>
              </div>

            </div>

            {/* ── Footer ── */}
            <div className="px-10 py-6 border-t border-gray-200 bg-white flex gap-4 rounded-bl-2xl">
              <button
                type="button"
                onClick={handleClear}
                className="flex-1 py-3 rounded-lg border border-gray-300 text-base font-semibold text-black hover:bg-gray-50 hover:border-black transition-all"
              >
                Clear All
              </button>
              <button
                type="button"
                onClick={handleApply}
                className="flex-1 py-3 rounded-lg bg-black text-white text-base font-bold hover:bg-gray-900 transition-all"
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
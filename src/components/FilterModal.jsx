"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const TABS = [
  { key: "category", label: "Categories" },
  { key: "price", label: "Price" },
  { key: "sort", label: "Sort" },
  { key: "stock", label: "Availability" },
];

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
  categories = [],
  onClearFilters,
}) {
  const [activeTab, setActiveTab] = useState("category");

  const [draftSort, setDraftSort] = useState(sort ?? "createdAt,desc");
  const [draftCategory, setDraftCategory] = useState(categoryId ?? "");
  const [draftMinPrice, setDraftMinPrice] = useState(minPrice ?? "");
  const [draftMaxPrice, setDraftMaxPrice] = useState(maxPrice ?? "");
  const [draftInStock, setDraftInStock] = useState(inStock ?? false);

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

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/40 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="fixed right-0 top-0 h-full w-full max-w-[420px] bg-white z-50 flex"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
          >

            {/* LEFT */}
            <div className="w-[38%] bg-gray-50 border-r">
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`w-full text-left px-4 py-4 text-sm font-semibold border-b ${
                    activeTab === tab.key
                      ? "bg-white text-black border-l-4 border-black"
                      : "text-gray-500"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* RIGHT */}
            <div className="flex-1 flex flex-col">

              <div className="flex items-center justify-between px-5 py-4 border-b">
                <h2 className="text-lg font-bold">Filters</h2>
                <X onClick={onClose} className="cursor-pointer" />
              </div>

              <div className="flex-1 overflow-y-auto p-5">

                {/* CATEGORY */}
                {activeTab === "category" && (
                  <div className="space-y-3">
                    <label className="flex items-center gap-3">
                      <input
                        type="radio"
                        checked={draftCategory === ""}
                        onChange={() => setDraftCategory("")}
                      />
                      <span>All</span>
                    </label>

                    {categories.map((cat) => (
                      <label key={cat.id} className="flex items-center gap-3">
                        <input
                          type="radio"
                          checked={String(draftCategory) === String(cat.id)}
                          onChange={() => setDraftCategory(cat.id)}
                        />
                        <span>{cat.name}</span>
                      </label>
                    ))}
                  </div>
                )}

                {/* PRICE */}
                {activeTab === "price" && (
                  <div className="space-y-4">
                    <input
                      type="number"
                      placeholder="Min Price"
                      value={draftMinPrice}
                      onChange={(e) => setDraftMinPrice(e.target.value)}
                      className="w-full border p-2 rounded"
                    />
                    <input
                      type="number"
                      placeholder="Max Price"
                      value={draftMaxPrice}
                      onChange={(e) => setDraftMaxPrice(e.target.value)}
                      className="w-full border p-2 rounded"
                    />
                  </div>
                )}

                {/* SORT */}
                {activeTab === "sort" && (
                  <div className="space-y-3">
                    {[
                      { value: "price,asc", label: "Price: Low to High" },
                      { value: "price,desc", label: "Price: High to Low" },
                      { value: "rating,desc", label: "Customer Rating" },
                      { value: "discount,desc", label: "Better Discount" },
                      { value: "createdAt,desc", label: "Newest First" },
                      { value: "popularity,desc", label: "Popularity" },
                    ].map((opt) => (
                      <label key={opt.value} className="flex items-center gap-3">
                        <input
                          type="radio"
                          checked={draftSort === opt.value}
                          onChange={() => setDraftSort(opt.value)}
                        />
                        <span>{opt.label}</span>
                      </label>
                    ))}
                  </div>
                )}

                {/* STOCK */}
                {activeTab === "stock" && (
                  <div className="flex items-center justify-between">
                    <span>In Stock Only</span>
                    <input
                      type="checkbox"
                      checked={draftInStock}
                      onChange={() => setDraftInStock(!draftInStock)}
                    />
                  </div>
                )}

              </div>

              <div className="flex border-t">
                <button onClick={handleClear} className="flex-1 py-4">
                  CLEAR
                </button>
                <button
                  onClick={handleApply}
                  className="flex-1 py-4 bg-black text-white"
                >
                  APPLY
                </button>
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
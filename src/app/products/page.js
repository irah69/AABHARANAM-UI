"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Sliders } from "lucide-react";
import ProductGrid from "@/components/ProductGrid";
import { ProductsMinimalistHero } from "@/components/ui/products-minimalist-hero";
import FilterModal from "@/components/FilterModal";
import { useQuery } from "@tanstack/react-query";
import { publicApi } from "@/lib/apiClient";
import { normalizePage } from "@/lib/pagination";
import Recommendations from "@/components/Recommendations";
function useDebouncedValue(value, delayMs) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(t);
  }, [value, delayMs]);
  return debounced;
}

export default function ProductsPage() {
  const [page, setPage]             = useState(0);
  const [size]                      = useState(12);
  const [sort, setSort]             = useState("createdAt,desc");
  const [categoryId, setCategoryId] = useState("");
  const [q, setQ]                   = useState("");
  const [minPrice, setMinPrice]     = useState("");
  const [maxPrice, setMaxPrice]     = useState("");
  const [inStock, setInStock]       = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const debouncedQ = useDebouncedValue(q, 300);

  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: ({ signal }) => publicApi.getCategories(signal),
  });

  const categories = useMemo(() => {
    const raw = categoriesQuery.data?.data ?? categoriesQuery.data;
    return Array.isArray(raw) ? raw : [];
  }, [categoriesQuery.data]);
  const selectedCategory = useMemo(() => {
  return categories.find(
    (cat) => String(cat.id) === String(categoryId)
  );
}, [categories, categoryId]);
  const useSearchEndpoint =
    Boolean(categoryId) ||
    Boolean(debouncedQ) ||
    Boolean(minPrice) ||
    Boolean(maxPrice) ||
    Boolean(inStock);

  const productsQuery = useQuery({
    queryKey: [
      useSearchEndpoint ? "productsSearch" : "products",
      { page, size, sort, categoryId, q: debouncedQ, minPrice, maxPrice, inStock },
    ],
    queryFn: ({ signal }) => {
      if (useSearchEndpoint) {
        return publicApi.searchProducts(
          {
            categoryId: categoryId ? Number(categoryId) : undefined,
            q: debouncedQ || undefined,
            minPrice: minPrice ? Number(minPrice) : undefined,
            maxPrice: maxPrice ? Number(maxPrice) : undefined,
            inStock: inStock ? true : undefined,
            page,
            size,
            sort,
          },
          signal
        );
      }
      return publicApi.getProducts({ page, size, sort }, signal);
    },
    placeholderData: (prev) => prev,
  });

  const pageData = useMemo(() => {
    const raw = productsQuery.data?.data ?? productsQuery.data;
    return normalizePage(raw);
  }, [productsQuery.data]);

  const products = Array.isArray(pageData.items)
    ? pageData.items
    : pageData.items
    ? [pageData.items]
    : [];

  const activeFilterCount = [categoryId, minPrice, maxPrice, inStock].filter(Boolean).length;

  return (
    <>
      {/* ── HERO ── */}
      <ProductsMinimalistHero
        logoText="mnmlst."
        mainText="Where Elegance Becomes an Heirloom"
        Tagline="Discover timeless fashion that transcends trends and generations."
        imageSrc="./productssaree.png"
        imageAlt="Minimalist fashion collection showcase"
        overlayText={{ part1: "Quality", part2: "Curated." }}
        locationText="Worldwide Shipping Available"
      />
       <Recommendations
    categories={categories}
    onCategorySelect={(id) => {
        setCategoryId(String(id));
        setPage(0);
    }}
/>
      {/* ── Heading ── */}
      <div className="flex flex-col items-start px-4 sm:px-6 md:px-0 mt-6 mb-3">
        <motion.h2
  key={selectedCategory?.id || "all-products"}
  initial={{ opacity: 0, y: 8 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.25 }}
  className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight"
>
  {selectedCategory?.name || "All Products"}
</motion.h2>
        <div className="mt-2 w-12 h-[2px] bg-[#d4a574]" />
      </div>

      {/* ── Search + Filter row ── */}
      <motion.div
        className="flex flex-row items-center gap-3 mb-8 px-4 sm:px-6 md:px-0"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Search — takes most of the row */}
        <div className="flex-1 min-w-0">
          <input
            value={q}
            onChange={(e) => { setQ(e.target.value); setPage(0); }}
            placeholder="Search products..."
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-full focus:outline-none focus:border-[#d4a574] transition-all text-sm"
          />
        </div>

        {/* Filter button — compact pill */}
        <div className="flex-shrink-0">
          <motion.button
            onClick={() => setIsFilterOpen(true)}
            className="relative flex items-center gap-1.5 px-4 py-3 bg-black text-white rounded-full font-medium text-sm transition-all hover:shadow-lg whitespace-nowrap"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
          >
            <Sliders size={16} />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <motion.span
                className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              >
                {activeFilterCount}
              </motion.span>
            )}
          </motion.button>
        </div>
      </motion.div>

      {/* ── Error ── */}
      {productsQuery.isError && (
        <div className="mx-4 sm:mx-6 md:mx-0 mt-2 p-4 border border-red-200 bg-red-50 text-red-700 rounded">
          Failed to load products.{" "}
          {productsQuery.error?.message ? `(${productsQuery.error.message})` : ""}
        </div>
      )}

      {/* ── Product Grid ── */}
      <div className="mt-4">
        <ProductGrid
          products={products}
          loading={productsQuery.isLoading || productsQuery.isFetching}
        />
      </div>

      {/* ── Pagination ── */}
      {pageData.totalPages > 1 && (
        <div className="flex items-center justify-between mt-10 px-4 sm:px-6 md:px-0">
          <button
            disabled={page <= 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            className="px-4 py-2 border border-gray-300 rounded-full text-sm disabled:opacity-50 hover:border-gray-400 transition-all"
          >
            Previous
          </button>
          <div className="text-sm text-gray-600">
            Page <span className="font-semibold">{page + 1}</span> of{" "}
            <span className="font-semibold">{pageData.totalPages}</span>
          </div>
          <button
            disabled={page + 1 >= pageData.totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 border border-gray-300 rounded-full text-sm disabled:opacity-50 hover:border-gray-400 transition-all"
          >
            Next
          </button>
        </div>
      )}

      {/* ── Filter Modal ── */}
      <FilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        sort={sort}
        onSortChange={(v) => { setSort(v); setPage(0); }}
        categoryId={categoryId}
        onCategoryChange={(v) => { setCategoryId(v); setPage(0); }}
        minPrice={minPrice}
        onMinPriceChange={setMinPrice}
        maxPrice={maxPrice}
        onMaxPriceChange={setMaxPrice}
        inStock={inStock}
        onInStockChange={setInStock}
        categories={categories}
        onClearFilters={() => {
          setCategoryId("");
          setMinPrice("");
          setMaxPrice("");
          setInStock(false);
          setSort("createdAt,desc");
          setPage(0);
        }}
      />
    </>
  );
}
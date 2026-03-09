"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sliders, X, ChevronDown, Facebook, Instagram, Twitter, Linkedin } from "lucide-react";
import ProductGrid from "@/components/ProductGrid";
import { ProductsMinimalistHero } from "@/components/ui/products-minimalist-hero";
import FilterModal from "@/components/FilterModal";
import { useQuery } from "@tanstack/react-query";
import { publicApi } from "@/lib/apiClient";
import { normalizePage } from "@/lib/pagination";

function useDebouncedValue(value, delayMs) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(t);
  }, [value, delayMs]);
  return debounced;
}

export default function ProductsPage() {
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(12);
  const [sort, setSort] = useState("createdAt,desc");
  const [categoryId, setCategoryId] = useState("");
  const [q, setQ] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [inStock, setInStock] = useState(false);
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

  const products = Array.isArray(pageData.items) ? pageData.items : (pageData.items ? [pageData.items] : []);

  return (
    <>
      {/* ================= HERO ================= */}
      <ProductsMinimalistHero
        logoText="mnmlst."
        navLinks={[
          { label: 'HOME', href: '/' },
          { label: 'PRODUCTS', href: '/products' },
          { label: 'ABOUT US', href: '/about' },
          { label: 'CONTACT', href: '/contact' },
        ]}
        mainText="Discover our curated collection of premium minimalist products. Each item is carefully selected for quality, design, and timeless appeal."
        imageSrc="https://ik.imagekit.io/fpxbgsota/image%2013.png?updatedAt=1753531863793"
        imageAlt="Minimalist fashion collection showcase"
        overlayText={{
          part1: 'Quality',
          part2: 'Curated.',
        }}
        socialLinks={[
          { icon: Facebook, href: '#' },
          { icon: Instagram, href: '#' },
          { icon: Twitter, href: '#' },
          { icon: Linkedin, href: '#' },
        ]}
        locationText="Worldwide Shipping Available"
      />

      <div className="container-custom py-8">
        {/* Header Section with Search, Sort, and Filter Button */}
        <motion.div 
          className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Search Bar */}
          <div className="flex-1 w-full">
            <label className="block text-xs font-semibold text-gray-700 mb-2">Search</label>
            <input
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setPage(0);
              }}
              placeholder="Search products..."
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#d4a574] transition-all"
            />
          </div>

          {/* Controls */}
          <div className="flex gap-3 w-full md:w-auto">
            {/* Sort Dropdown */}
            <motion.select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                setPage(0);
              }}
              className="min-w-[180px] px-3 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#d4a574] transition-all bg-white font-medium text-gray-700"
              whileHover={{ borderColor: '#d4a574' }}
            >
              <option value="createdAt,desc">Newest</option>
              <option value="createdAt,asc">Oldest</option>
              <option value="price,asc">Price: Low → High</option>
              <option value="price,desc">Price: High → Low</option>
              <option value="name,asc">Name: A → Z</option>
              <option value="name,desc">Name: Z → A</option>
            </motion.select>

            {/* Filter Button */}
            <motion.button
              onClick={() => setIsFilterOpen(true)}
              className="relative flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-[#d4a574] to-[#e8b4a8] text-white rounded-lg font-semibold transition-all hover:shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Sliders size={20} />
              <span className="hidden sm:inline">Filters</span>
              
              {/* Badge for active filters */}
              {(categoryId || minPrice || maxPrice || inStock) && (
                <motion.span
                  className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                >
                  {[categoryId && 1, minPrice && 1, maxPrice && 1, inStock && 1].filter(Boolean).length}
                </motion.span>
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* Status */}
        {productsQuery.isError && (
          <div className="mt-6 p-4 border border-red-200 bg-red-50 text-red-700 rounded">
            Failed to load products. {productsQuery.error?.message ? `(${productsQuery.error.message})` : ""}
          </div>
        )}

        <div className="mt-8">
          <ProductGrid products={products} loading={productsQuery.isLoading || productsQuery.isFetching} />
        </div>

        {/* Pagination */}
        {pageData.totalPages > 1 && (
          <div className="flex items-center justify-between mt-10">
            <button
              disabled={page <= 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              className="px-4 py-2 border border-gray-300 rounded disabled:opacity-50"
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
              className="px-4 py-2 border border-gray-300 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Filter Modal Popup */}
      <FilterModal 
        isOpen={isFilterOpen} 
        onClose={() => setIsFilterOpen(false)}
        categoryId={categoryId}
        onCategoryChange={setCategoryId}
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
          setPage(0);
        }}
      />
    </>
  );
}
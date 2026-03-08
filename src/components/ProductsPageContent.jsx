'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Sliders } from 'lucide-react';
import ProductGrid from '@/components/ProductGrid';
import FilterModal from '@/components/FilterModal';
import { categories, priceRanges, ratingFilters } from '@/data/products';
import { getProductsFromStorage } from '@/utils/storageHelpers';

export default function ProductsPageContent({ initialProducts }) {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState(initialProducts);
  const [loading, setLoading] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Filter states
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get('category') || 'All Products'
  );
  const [selectedPriceRange, setSelectedPriceRange] = useState(null);
  const [selectedRating, setSelectedRating] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedFabric, setSelectedFabric] = useState(null);
  const [selectedOccasion, setSelectedOccasion] = useState(null);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [sortBy, setSortBy] = useState('relevance');

  // Load products from localStorage on mount
  useEffect(() => {
    const storedProducts = getProductsFromStorage(initialProducts);
    setProducts(storedProducts);
    setLoading(false);
  }, [initialProducts]);

  // Filter products
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Category filter
    if (selectedCategory && selectedCategory !== 'All Products') {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query)
      );
    }

    // Price filter
    if (selectedPriceRange) {
      filtered = filtered.filter(
        (p) => p.price >= selectedPriceRange.min && p.price <= selectedPriceRange.max
      );
    }

    // Rating filter
    if (selectedRating) {
      filtered = filtered.filter((p) => p.rating >= selectedRating);
    }

    // Sort
    if (sortBy === 'price-asc') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'newest') {
      filtered.sort((a, b) => b.id - a.id);
    }

    return filtered;
  }, [products, selectedCategory, selectedPriceRange, selectedRating, selectedSize, selectedColor, selectedFabric, selectedOccasion, searchQuery, sortBy]);

  const handleClearFilters = () => {
    setSelectedCategory('All Products');
    setSelectedPriceRange(null);
    setSelectedRating(null);
    setSelectedSize(null);
    setSelectedColor(null);
    setSelectedFabric(null);
    setSelectedOccasion(null);
    setSearchQuery('');
  };

  // Count active filters
  const activeFiltersCount = [
    selectedCategory !== 'All Products' && 1,
    selectedPriceRange && 1,
    selectedRating && 1,
    selectedSize && 1,
    selectedColor && 1,
    selectedFabric && 1,
    selectedOccasion && 1,
  ].filter(Boolean).length;

  return (
    <div className="w-full py-12 bg-gradient-to-b from-white to-gray-50">
      <div className="container-custom">
        {/* Header Section */}
        <motion.div 
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <h2 className="text-3xl md:text-4xl font-light mb-2 text-gray-900">Our Collection</h2>
            <p className="text-gray-600 text-sm">
              Showing {filteredProducts.length} of {products.length} products
            </p>
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            {/* Sort Dropdown */}
            <motion.select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="flex-1 md:flex-none px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#d4a574] transition-all bg-white font-medium text-gray-700"
              whileHover={{ borderColor: '#d4a574' }}
            >
              <option value="relevance">Relevance</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Newest</option>
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
              {activeFiltersCount > 0 && (
                <motion.span
                  className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                >
                  {activeFiltersCount}
                </motion.span>
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* Search Bar */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#d4a574] transition-all bg-white"
          />
        </motion.div>

        {/* Products Grid or Empty State */}
        {filteredProducts.length > 0 ? (
          <ProductGrid products={filteredProducts} loading={loading} />
        ) : (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-6xl mb-4 opacity-30">🔍</div>
            <p className="text-gray-600 text-lg font-medium mb-2">No products found</p>
            <p className="text-gray-500 mb-6">Try adjusting your filters or search terms</p>
            <motion.button
              onClick={handleClearFilters}
              className="px-6 py-2 bg-[#d4a574] text-white rounded-lg font-semibold hover:bg-[#c0945f] transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Clear Filters
            </motion.button>
          </motion.div>
        )}
      </div>

      {/* Filter Modal */}
      <FilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedPriceRange={selectedPriceRange}
        onPriceChange={setSelectedPriceRange}
        selectedRating={selectedRating}
        onRatingChange={setSelectedRating}
        selectedSize={selectedSize}
        onSizeChange={setSelectedSize}
        selectedColor={selectedColor}
        onColorChange={setSelectedColor}
        selectedFabric={selectedFabric}
        onFabricChange={setSelectedFabric}
        selectedOccasion={selectedOccasion}
        onOccasionChange={setSelectedOccasion}
        onClearFilters={handleClearFilters}
      />
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronDown } from 'lucide-react';
import '../styles/product-filter-modal.css';

export default function FilterModal({
  isOpen,
  onClose,
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
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    price: true,
    inStock: true,
  });

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const modalVariants = {
    hidden: { x: '100%', opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      },
    },
    exit: {
      x: '100%',
      opacity: 0,
      transition: { duration: 0.3 },
    },
  };

  const contentVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  const sectionVariants = {
    hidden: { height: 0, opacity: 0, overflow: 'hidden' },
    visible: {
      height: 'auto',
      opacity: 1,
      overflow: 'visible',
      transition: { duration: 0.3 },
    },
  };

  const activeFilterCount = [
    categoryId && 1,
    minPrice && 1,
    maxPrice && 1,
    inStock && 1,
  ].filter(Boolean).length;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="product-filter-modal-backdrop"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="product-filter-modal"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <motion.div className="product-filter-modal-header" variants={itemVariants}>
              <div className="product-filter-modal-title">
                <h2>Filters</h2>
                {activeFilterCount > 0 && (
                  <span className="product-filter-count-badge">{activeFilterCount}</span>
                )}
              </div>
              <motion.button
                className="product-filter-close-btn"
                onClick={onClose}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.95 }}
              >
                <X size={24} />
              </motion.button>
            </motion.div>

            {/* Content */}
            <motion.div
              className="product-filter-modal-content"
              variants={contentVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Category Filter */}
              {categories.length > 0 && (
                <FilterSection
                  title="Category"
                  section="category"
                  isExpanded={expandedSections.category}
                  onToggle={toggleSection}
                  variants={sectionVariants}
                  itemVariants={itemVariants}
                >
                  <div className="product-filter-options">
                    <motion.label
                      className="product-filter-radio-label"
                      whileHover={{ x: 5 }}
                      variants={itemVariants}
                    >
                      <input
                        type="radio"
                        name="category"
                        value=""
                        checked={!categoryId}
                        onChange={(e) => onCategoryChange(e.target.value)}
                        className="product-filter-radio"
                      />
                      <span className="product-filter-label-text">All Categories</span>
                    </motion.label>
                    {categories.map((cat) => (
                      <motion.label
                        key={cat.id}
                        className="product-filter-radio-label"
                        whileHover={{ x: 5 }}
                        variants={itemVariants}
                      >
                        <input
                          type="radio"
                          name="category"
                          value={cat.id}
                          checked={categoryId === String(cat.id)}
                          onChange={(e) => onCategoryChange(e.target.value)}
                          className="product-filter-radio"
                        />
                        <span className="product-filter-label-text">{cat.name}</span>
                      </motion.label>
                    ))}
                  </div>
                </FilterSection>
              )}

              {/* Price Filter */}
              <FilterSection
                title="Price Range"
                section="price"
                isExpanded={expandedSections.price}
                onToggle={toggleSection}
                variants={sectionVariants}
                itemVariants={itemVariants}
              >
                <div className="product-filter-price-inputs">
                  <div className="product-filter-price-input-group">
                    <label className="product-filter-price-label">Min Price</label>
                    <input
                      type="number"
                      value={minPrice}
                      onChange={(e) => onMinPriceChange(e.target.value)}
                      placeholder="₹0"
                      className="product-filter-price-input"
                    />
                  </div>
                  <div className="product-filter-price-input-group">
                    <label className="product-filter-price-label">Max Price</label>
                    <input
                      type="number"
                      value={maxPrice}
                      onChange={(e) => onMaxPriceChange(e.target.value)}
                      placeholder="₹9999"
                      className="product-filter-price-input"
                    />
                  </div>
                </div>
              </FilterSection>

              {/* In Stock Filter */}
              <FilterSection
                title="Stock"
                section="inStock"
                isExpanded={expandedSections.inStock}
                onToggle={toggleSection}
                variants={sectionVariants}
                itemVariants={itemVariants}
              >
                <div className="product-filter-checkbox-container">
                  <motion.label
                    className="product-filter-checkbox-label"
                    whileHover={{ x: 5 }}
                    variants={itemVariants}
                  >
                    <input
                      type="checkbox"
                      checked={inStock}
                      onChange={(e) => onInStockChange(e.target.checked)}
                      className="product-filter-checkbox"
                    />
                    <span className="product-filter-label-text">In Stock Only</span>
                  </motion.label>
                </div>
              </FilterSection>
            </motion.div>

            {/* Footer */}
            <motion.div className="product-filter-modal-footer" variants={itemVariants}>
              <motion.button
                className="product-filter-clear-btn"
                onClick={onClearFilters}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Clear All
              </motion.button>
              <motion.button
                className="product-filter-apply-btn"
                onClick={onClose}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Apply Filters
              </motion.button>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function FilterSection({
  title,
  section,
  isExpanded,
  onToggle,
  variants,
  itemVariants,
  children,
}) {
  return (
    <motion.div className="product-filter-section" variants={itemVariants}>
      <motion.button
        className="product-filter-section-header"
        onClick={() => onToggle(section)}
        whileHover={{ backgroundColor: 'rgba(212, 165, 116, 0.05)' }}
      >
        <span className="product-filter-section-title">{title}</span>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown size={20} />
        </motion.div>
      </motion.button>

      <motion.div
        initial={false}
        animate={isExpanded ? 'visible' : 'hidden'}
        variants={variants}
      >
        <motion.div className="product-filter-section-content" variants={itemVariants}>
          {children}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

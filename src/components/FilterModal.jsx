'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronDown } from 'lucide-react';
import {
  categories,
  priceRanges,
  ratingFilters,
  sizes,
  colors,
  fabrics,
  occasions,
} from '@/data/products';
import '../styles/filter-modal.css';

export default function FilterModal({
  isOpen,
  onClose,
  selectedCategory,
  onCategoryChange,
  selectedPriceRange,
  onPriceChange,
  selectedRating,
  onRatingChange,
  selectedSize,
  onSizeChange,
  selectedColor,
  onColorChange,
  selectedFabric,
  onFabricChange,
  selectedOccasion,
  onOccasionChange,
  onClearFilters,
}) {
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    size: true,
    price: true,
    color: true,
    fabric: true,
    occasion: true,
    rating: true,
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

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="filter-modal-backdrop"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="filter-modal"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Header */}
            <motion.div className="filter-modal-header" variants={itemVariants}>
              <div className="filter-modal-title">
                <h2>Filters</h2>
                <p className="filter-count">
                  {[selectedCategory !== 'All Products' && 'Category',
                    selectedPriceRange && 'Price',
                    selectedSize && 'Size',
                    selectedColor && 'Color',
                    selectedFabric && 'Fabric',
                    selectedOccasion && 'Occasion',
                    selectedRating && 'Rating']
                    .filter(Boolean).length > 0
                    ? `${[selectedCategory !== 'All Products' && 'Category',
                        selectedPriceRange && 'Price',
                        selectedSize && 'Size',
                        selectedColor && 'Color',
                        selectedFabric && 'Fabric',
                        selectedOccasion && 'Occasion',
                        selectedRating && 'Rating']
                        .filter(Boolean).length} filters applied`
                    : 'No filters applied'}
                </p>
              </div>
              <motion.button
                className="filter-close-btn"
                onClick={onClose}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.95 }}
              >
                <X size={24} />
              </motion.button>
            </motion.div>

            {/* Content */}
            <motion.div
              className="filter-modal-content"
              variants={contentVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Category Filter */}
              <FilterSection
                title="Category"
                section="category"
                isExpanded={expandedSections.category}
                onToggle={toggleSection}
                variants={sectionVariants}
                itemVariants={itemVariants}
              >
                <div className="filter-options">
                  {categories.map((cat) => (
                    <motion.label
                      key={cat}
                      className="filter-checkbox-label"
                      whileHover={{ x: 5 }}
                      variants={itemVariants}
                    >
                      <input
                        type="radio"
                        name="category"
                        value={cat}
                        checked={selectedCategory === cat}
                        onChange={(e) => onCategoryChange(e.target.value)}
                        className="filter-radio"
                      />
                      <span className="filter-label-text">{cat}</span>
                    </motion.label>
                  ))}
                </div>
              </FilterSection>

              {/* Size Filter */}
              <FilterSection
                title="Size"
                section="size"
                isExpanded={expandedSections.size}
                onToggle={toggleSection}
                variants={sectionVariants}
                itemVariants={itemVariants}
              >
                <div className="filter-size-grid">
                  {sizes.map((size) => (
                    <motion.button
                      key={size}
                      className={`filter-size-btn ${selectedSize === size ? 'active' : ''}`}
                      onClick={() => onSizeChange(selectedSize === size ? null : size)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      variants={itemVariants}
                    >
                      {size}
                    </motion.button>
                  ))}
                </div>
              </FilterSection>

              {/* Price Filter */}
              <FilterSection
                title="Price"
                section="price"
                isExpanded={expandedSections.price}
                onToggle={toggleSection}
                variants={sectionVariants}
                itemVariants={itemVariants}
              >
                <div className="filter-options">
                  {priceRanges.map((range) => (
                    <motion.label
                      key={range.label}
                      className="filter-checkbox-label"
                      whileHover={{ x: 5 }}
                      variants={itemVariants}
                    >
                      <input
                        type="checkbox"
                        checked={selectedPriceRange?.label === range.label}
                        onChange={() =>
                          onPriceChange(selectedPriceRange?.label === range.label ? null : range)
                        }
                        className="filter-checkbox"
                      />
                      <span className="filter-label-text">{range.label}</span>
                    </motion.label>
                  ))}
                </div>
              </FilterSection>

              {/* Color Filter */}
              <FilterSection
                title="Color"
                section="color"
                isExpanded={expandedSections.color}
                onToggle={toggleSection}
                variants={sectionVariants}
                itemVariants={itemVariants}
              >
                <div className="filter-color-grid">
                  {colors.map((color) => (
                    <motion.button
                      key={color.name}
                      className={`filter-color-btn ${selectedColor === color.name ? 'active' : ''}`}
                      style={{ backgroundColor: color.hex }}
                      onClick={() => onColorChange(selectedColor === color.name ? null : color.name)}
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.9 }}
                      title={color.name}
                      variants={itemVariants}
                    >
                      {selectedColor === color.name && (
                        <motion.div
                          className="color-checkmark"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                        >
                          ✓
                        </motion.div>
                      )}
                    </motion.button>
                  ))}
                </div>
              </FilterSection>

              {/* Fabric Filter */}
              <FilterSection
                title="Fabric"
                section="fabric"
                isExpanded={expandedSections.fabric}
                onToggle={toggleSection}
                variants={sectionVariants}
                itemVariants={itemVariants}
              >
                <div className="filter-options">
                  {fabrics.map((fabric) => (
                    <motion.label
                      key={fabric}
                      className="filter-checkbox-label"
                      whileHover={{ x: 5 }}
                      variants={itemVariants}
                    >
                      <input
                        type="checkbox"
                        checked={selectedFabric === fabric}
                        onChange={() => onFabricChange(selectedFabric === fabric ? null : fabric)}
                        className="filter-checkbox"
                      />
                      <span className="filter-label-text">{fabric}</span>
                    </motion.label>
                  ))}
                </div>
              </FilterSection>

              {/* Occasion Filter */}
              <FilterSection
                title="Occasion"
                section="occasion"
                isExpanded={expandedSections.occasion}
                onToggle={toggleSection}
                variants={sectionVariants}
                itemVariants={itemVariants}
              >
                <div className="filter-options">
                  {occasions.map((occasion) => (
                    <motion.label
                      key={occasion}
                      className="filter-checkbox-label"
                      whileHover={{ x: 5 }}
                      variants={itemVariants}
                    >
                      <input
                        type="checkbox"
                        checked={selectedOccasion === occasion}
                        onChange={() =>
                          onOccasionChange(selectedOccasion === occasion ? null : occasion)
                        }
                        className="filter-checkbox"
                      />
                      <span className="filter-label-text">{occasion}</span>
                    </motion.label>
                  ))}
                </div>
              </FilterSection>

              {/* Rating Filter */}
              <FilterSection
                title="Rating"
                section="rating"
                isExpanded={expandedSections.rating}
                onToggle={toggleSection}
                variants={sectionVariants}
                itemVariants={itemVariants}
              >
                <div className="filter-options">
                  {ratingFilters.map((filter) => (
                    <motion.label
                      key={filter.value}
                      className="filter-checkbox-label"
                      whileHover={{ x: 5 }}
                      variants={itemVariants}
                    >
                      <input
                        type="checkbox"
                        checked={selectedRating === filter.value}
                        onChange={() =>
                          onRatingChange(selectedRating === filter.value ? null : filter.value)
                        }
                        className="filter-checkbox"
                      />
                      <span className="filter-label-text">{filter.label}</span>
                    </motion.label>
                  ))}
                </div>
              </FilterSection>
            </motion.div>

            {/* Footer */}
            <motion.div className="filter-modal-footer" variants={itemVariants}>
              <motion.button
                className="filter-clear-btn"
                onClick={onClearFilters}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Clear All
              </motion.button>
              <motion.button
                className="filter-apply-btn"
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
  children,
  variants,
  itemVariants,
}) {
  return (
    <motion.div className="filter-section" variants={itemVariants}>
      <motion.button
        className="filter-section-header"
        onClick={() => onToggle(section)}
        whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.02)' }}
      >
        <h3 className="filter-section-title">{title}</h3>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown size={20} />
        </motion.div>
      </motion.button>

      <motion.div
        variants={variants}
        initial="hidden"
        animate={isExpanded ? 'visible' : 'hidden'}
        className="filter-section-content"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
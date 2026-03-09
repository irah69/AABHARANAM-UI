'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import '@/styles/products-minimalist-hero.css';

export const ProductsMinimalistHero = ({
  logoText = 'mnmlst.',
  navLinks = [],
  mainText = '',
  imageSrc = '',
  imageAlt = '',
  overlayText = { part1: 'Quality', part2: 'Curated.' },
  socialLinks = [],
  locationText = '',
}) => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const containerVariants = {
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
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 1, ease: 'easeOut' },
    },
  };

  return (
    <motion.div
      className="products-hero-container"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={containerVariants}
    >
      {/* Hero Content */}
      <div className="products-hero-content">
        {/* Left Content */}
        <motion.div className="products-hero-left" variants={itemVariants}>
          {/* Main Description */}
          <motion.p className="products-hero-description" variants={itemVariants}>
            {mainText}
          </motion.p>

          {/* CTA Button */}
          <motion.a href="#products" className="products-hero-cta-btn" variants={itemVariants}>
            <span>Explore Collection</span>
            <ChevronDown size={20} />
          </motion.a>
        </motion.div>

        {/* Right Content - Image with Circle Background */}
        <motion.div className="products-hero-right" variants={imageVariants}>
          <div className="products-hero-circle-bg"></div>
          <motion.img
            src={imageSrc}
            alt={imageAlt}
            className="products-hero-image"
            animate={{ y: scrollY * 0.05 }}
            transition={{ type: 'spring', stiffness: 100, damping: 30 }}
          />

          {/* Overlay Text */}
          <div className="products-hero-overlay-text">
            <motion.div
              className="overlay-line overlay-line-1"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
            >
              {overlayText.part1}
            </motion.div>
            <motion.div
              className="overlay-line overlay-line-2"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              viewport={{ once: true }}
            >
              {overlayText.part2}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ProductsMinimalistHero;

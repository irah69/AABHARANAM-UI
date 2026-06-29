"use client";
import { useState, useEffect, useRef } from "react";
import {
  Award,
  Zap,
  Phone,
  Mail,
  MapPin,
  Heart,
  Lightbulb,
  Shield,
  Globe,
  ArrowRight,
  Gem,
  Star,
  Sparkles,
} from "lucide-react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import "../styles/about-page.css";

// ─── Dynamic Year Helpers ──────────────────────────────────────────────────────
const FOUNDING_YEAR = new Date().getFullYear() - 1; // Always 1 year ago
const CURRENT_YEAR = new Date().getFullYear();
const YEARS_IN_BUSINESS = CURRENT_YEAR - FOUNDING_YEAR; // Grows each year

export default function AboutUs() {
  const containerRef = useRef(null);
  const heroRef = useRef(null);
  const valuesRef = useRef(null);
  const statsRef = useRef(null);
  const ctaRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, 50]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0.8]);

  const heroInView = useInView(heroRef, { once: false, amount: 0.3 });
  const valuesInView = useInView(valuesRef, { once: false, amount: 0.2 });
  const statsInView = useInView(statsRef, { once: false, amount: 0.3 });
  const ctaInView = useInView(ctaRef, { once: false, amount: 0.3 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.7, ease: "easeOut" },
    },
  };

  const slideInLeft = {
    hidden: { x: -60, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.8, ease: "easeOut" } },
  };

  const slideInRight = {
    hidden: { x: 60, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.8, ease: "easeOut" } },
  };

  const scaleIn = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { duration: 0.8, ease: "easeOut" } },
  };

  const values = [
    {
      icon: <Gem className="w-8 h-8" />,
      title: "Purity",
      description:
        "Every piece is crafted from certified one gram gold, guaranteed hallmarked and authentic.",
    },
    {
      icon: <Lightbulb className="w-8 h-8" />,
      title: "Artistry",
      description:
        "Our artisans blend traditional Hyderabadi craft with contemporary design sensibility.",
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Trust",
      description:
        "Transparent pricing, no hidden charges — jewellery you can gift with full confidence.",
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Accessibility",
      description:
        "Temple-gold look at everyday prices, so elegance is never out of reach.",
    },
  ];

  // Stats auto-update with YEARS_IN_BUSINESS
  const stats = [
    { number: `${YEARS_IN_BUSINESS}+`, label: "Years of Craftsmanship" },
    { number: "5K+", label: "Happy Customers" },
    { number: "300+", label: "Jewellery Designs" },
  
  ];

  // Timeline: founding year is always dynamic
  const timeline = [
    {
      year: `${FOUNDING_YEAR}`,
      title: "Founded",
      desc: "Aabharanam Jewels was born with a vision — real gold aesthetics at one-gram prices.",
    },
    {
      year: `${FOUNDING_YEAR}`,
      title: "First Collection",
      desc: "Launched our signature temple-gold collection featuring 50+ handcrafted designs.",
    },
    {
      year: `${CURRENT_YEAR}`,
      title: "Online Launch",
      desc: "Expanded to pan-India delivery, bringing Hyderabadi gold craftsmanship to your doorstep.",
    },
    {
      year: `${CURRENT_YEAR}`,
      title: "Growing Strong",
      desc: `Serving 5,000+ customers and adding new designs every month in ${CURRENT_YEAR}.`,
    },
  ];

  return (
    <div ref={containerRef} className="about-container">
      {/* Hero Section */}
      <motion.section
        ref={heroRef}
        className="hero-section"
        style={{ y: heroY, opacity: heroOpacity }}
        initial="hidden"
        animate={heroInView ? "visible" : "hidden"}
        variants={containerVariants}
      >
        <div className="hero-content-wrapper">
          {/* Left Block */}
          <motion.div className="hero-left" variants={slideInLeft}>
            <motion.div className="company-header" variants={itemVariants}>
              <h1 className="company-name">AABHARANAM</h1>
              <motion.div
                className="accent-line"
                initial={{ width: 0 }}
                animate={heroInView ? { width: "60px" } : { width: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              />
            </motion.div>

            <motion.p className="company-tagline" variants={itemVariants}>
              One Gram Gold · Timeless Elegance
            </motion.p>

            <motion.p className="company-description" variants={itemVariants}>
              Welcome to Aabharanam Jewels — where the grandeur of pure gold meets the
              accessibility of everyday wear. Founded in {FOUNDING_YEAR}, we craft
              exquisite one gram gold jewellery that carries the soul of traditional
              Hyderabadi craftsmanship, designed for the modern Indian woman.
            </motion.p>

            <motion.div className="contact-info" variants={containerVariants}>
              <motion.div
                className="contact-item"
                variants={itemVariants}
                whileHover={{ x: 10 }}
              >
                <Phone className="contact-icon" />
                <div>
                  <h4>Call Us</h4>
                  <p>+91 6281022771</p>
                </div>
              </motion.div>

              <motion.div
                className="contact-item"
                variants={itemVariants}
                whileHover={{ x: 10 }}
              >
                <Mail className="contact-icon" />
                <div>
                  <h4>Email</h4>
                  <p>hello@aabharanamjewels.com</p>
                </div>
              </motion.div>

              <motion.div
                className="contact-item"
                variants={itemVariants}
                whileHover={{ x: 10 }}
              >
                <MapPin className="contact-icon" />
                <div>
                  <h4>Location</h4>
                  <p>Patelguda,Hyderabad, Telangana</p>
                </div>
              </motion.div>
            </motion.div>

          </motion.div>

          {/* Right Block - Logo */}
          <motion.div className="hero-right" variants={slideInRight}>
            <motion.div
              className="image-circle-container"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                className="circle-image-wrapper"
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                style={{
    boxShadow: "0 20px 50px rgba(0, 0, 0, 0.35)",

    borderRadius: "50%",
  }}
              >
                <img
                  src="./logo.png"
                  alt="Aabharanam Jewels"
                  className="circle-image"
                />
              </motion.div>


            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Values Section */}
      <motion.section
        ref={valuesRef}
        className="values-section"
        initial="hidden"
        animate={valuesInView ? "visible" : "hidden"}
        variants={containerVariants}
      >
        <motion.div className="section-header" variants={itemVariants}>
          <h2>Our Core Values</h2>
          <p>The promise behind every piece we make</p>
        </motion.div>

        <motion.div className="values-grid" variants={containerVariants}>
          {values.map((value, index) => (
            <motion.div
              key={index}
              className="value-card"
              variants={scaleIn}
              whileHover={{ y: -10, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="value-icon"
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
              >
                {value.icon}
              </motion.div>
              <h3>{value.title}</h3>
              <p>{value.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* Stats Section */}
      <motion.section
        ref={statsRef}
        className="stats-section"
        initial="hidden"
        animate={statsInView ? "visible" : "hidden"}
        variants={containerVariants}
      >
        <div className="stats-background" />
        <motion.div className="section-header" variants={itemVariants}>
          <h2>By The Numbers</h2>
          <p>A young brand growing with every order</p>
        </motion.div>

        <motion.div className="stats-grid" variants={containerVariants}>
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="stat-card"
              variants={itemVariants}
              whileHover={{ scale: 1.08 }}
            >
              <motion.div
                className="stat-number"
                initial={{ opacity: 0, y: 20 }}
                animate={
                  statsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                }
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                {stat.number}
              </motion.div>
              <div className="stat-label">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* Timeline Section */}
      <motion.section
        className="timeline-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.2 }}
        variants={containerVariants}
      >
        <motion.div className="section-header" variants={itemVariants}>
          <h2>Our Journey</h2>
          <p>From a single dream to thousands of smiles</p>
        </motion.div>

        <motion.div className="timeline" variants={containerVariants}>
          {timeline.map((item, index) => (
            <motion.div
              key={index}
              className="timeline-item"
              variants={itemVariants}
            >
              <motion.div
                className="timeline-dot"
                whileHover={{ scale: 1.3 }}
                whileTap={{ scale: 0.9 }}
              />
              <div className="timeline-content">
                <h4>{item.year}</h4>
                <h5>{item.title}</h5>
                <p>{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        ref={ctaRef}
        className="cta-section"
        initial="hidden"
        animate={ctaInView ? "visible" : "hidden"}
        variants={containerVariants}
      >
        <motion.div className="cta-content" variants={itemVariants}>
          <h2>Wear Gold. Every Day.</h2>
          <p>
            Join thousands of women who've discovered the joy of lightweight, affordable
            gold jewellery — crafted with love at Aabharanam Jewels.
          </p>

        </motion.div>

        <motion.div
          className="cta-bg-element element-1"
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, linear: true }}
        />
        <motion.div
          className="cta-bg-element element-2"
          animate={{ rotate: -360 }}
          transition={{ duration: 40, repeat: Infinity, linear: true }}
        />
      </motion.section>
    </div>
  );
}
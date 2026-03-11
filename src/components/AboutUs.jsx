"use client";
import { useState, useEffect, useRef } from "react";
import {
  Building2,
  Award,
  Users,
  Zap,
  TrendingUp,
  Phone,
  Mail,
  MapPin,
  Heart,
  Lightbulb,
  Shield,
  Globe,
  ArrowRight,
} from "lucide-react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import "../styles/about-page.css";

export default function AboutUs() {
  const [imageUrls, setimageUrls] = useState(
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&h=600&fit=crop"
  );
  const containerRef = useRef(null);
  const heroRef = useRef(null);
  const valuesRef = useRef(null);
  const teamRef = useRef(null);
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
  const teamInView = useInView(teamRef, { once: false, amount: 0.2 });
  const statsInView = useInView(statsRef, { once: false, amount: 0.3 });
  const ctaInView = useInView(ctaRef, { once: false, amount: 0.3 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
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
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const slideInRight = {
    hidden: { x: 60, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const scaleIn = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const values = [
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Quality",
      description: "We deliver premium products crafted with meticulous attention to detail",
    },
    {
      icon: <Lightbulb className="w-8 h-8" />,
      title: "Innovation",
      description: "Constantly evolving our collections with latest trends and designs",
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Trust",
      description: "Building lasting relationships through transparency and reliability",
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Sustainability",
      description: "Committed to ethical practices and sustainable sourcing",
    },
  ];



  const stats = [
    { number: "15+", label: "Years in Fashion" },
    { number: "50K+", label: "Happy Customers" },
    { number: "200+", label: "Premium Collections" },
    { number: "100+", label: "Cities Served" },
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
          {/* Left Block - Company Info */}
          <motion.div
            className="hero-left"
            variants={slideInLeft}
          >
            <motion.div
              className="company-header"
              variants={itemVariants}
            >
              <h1 className="company-name">MURGAN</h1>
              <motion.div
                className="accent-line"
                initial={{ width: 0 }}
                animate={heroInView ? { width: "60px" } : { width: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              />
            </motion.div>

            <motion.p
              className="company-tagline"
              variants={itemVariants}
            >
              Wardrobe Essentials Reimagined
            </motion.p>

            <motion.p
              className="company-description"
              variants={itemVariants}
            >
              Welcome to Murgan Wardrobe, where elegance meets accessibility. Since our establishment, we've been on a mission to transform how you dress, feel, and express yourself. We believe that everyone deserves to wear confidence.
            </motion.p>

            <motion.div
              className="contact-info"
              variants={containerVariants}
            >
              <motion.div
                className="contact-item"
                variants={itemVariants}
                whileHover={{ x: 10 }}
              >
                <Phone className="contact-icon" />
                <div>
                  <h4>Call Us</h4>
                  <p>+1 (555) 123-4567</p>
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
                  <p>hello@Murgan.com</p>
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
                  <p>New York, NY 10001</p>
                </div>
              </motion.div>
            </motion.div>

            <motion.button
              className="cta-button"
              variants={itemVariants}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 20px 40px rgba(0, 0, 0, 0.2)",
              }}
              whileTap={{ scale: 0.95 }}
            >
              Explore Collections
              <ArrowRight className="button-icon" />
            </motion.button>
          </motion.div>

          {/* Right Block - Circle Image */}
          <motion.div
            className="hero-right"
            variants={slideInRight}
          >
            <motion.div
              className="image-circle-container"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                className="circle-image-wrapper"
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <img
                  src="./logo1.png"
                  alt="Murgan Wardrobe"
                  className="circle-image"
                />
              </motion.div>

              {/* Animated Background Elements */}
              <motion.div
                className="animated-circle circle-1"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, linear: true }}
              />
              <motion.div
                className="animated-circle circle-2"
                animate={{ rotate: -360 }}
                transition={{ duration: 25, repeat: Infinity, linear: true }}
              />

              {/* Floating Elements */}
              <motion.div
                className="floating-element element-1"
                animate={{ y: [0, -30, 0], x: [0, 15, 0] }}
                transition={{ duration: 5, repeat: Infinity }}
              >
                <Heart className="w-6 h-6" />
              </motion.div>
              <motion.div
                className="floating-element element-2"
                animate={{ y: [0, 30, 0], x: [0, -15, 0] }}
                transition={{ duration: 6, repeat: Infinity, delay: 1 }}
              >
                <Zap className="w-6 h-6" />
              </motion.div>
              <motion.div
                className="floating-element element-3"
                animate={{ y: [0, -25, 0] }}
                transition={{ duration: 7, repeat: Infinity, delay: 2 }}
              >
                <Lightbulb className="w-6 h-6" />
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
          <p>What drives us every single day</p>
        </motion.div>

        <motion.div
          className="values-grid"
          variants={containerVariants}
        >
          {values.map((value, index) => (
            <motion.div
              key={index}
              className="value-card"
              variants={scaleIn}
              whileHover={{
                y: -10,
                boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
              }}
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
          <p>Growing together with our community</p>
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
                animate={statsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                {stat.number}
              </motion.div>
              <div className="stat-label">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* Team Section */}
     

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
          <p>From passion to profession</p>
        </motion.div>

        <motion.div className="timeline" variants={containerVariants}>
          {[
            { year: "2009", title: "Founded", desc: "Murgan Wardrobe was born with a simple vision" },
            { year: "2012", title: "First Store", desc: "Opened our flagship store in New York" },
            { year: "2016", title: "Online Launch", desc: "Expanded to digital marketplace" },
            { year: "2020", title: "Global Reach", desc: "Now serving customers in 100+ cities" },
            { year: "2024", title: "Innovation Hub", desc: "Launched AI-powered personal styling" },
          ].map((item, index) => (
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
          <h2>Ready to Discover Your Style?</h2>
          <p>
            Join thousands of fashion enthusiasts who've transformed their wardrobe with Murgan
          </p>
          <motion.button
            className="cta-button-large"
            whileHover={{
              scale: 1.08,
              boxShadow: "0 30px 60px rgba(0, 0, 0, 0.2)",
            }}
            whileTap={{ scale: 0.95 }}
          >
            Start Shopping Now
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </motion.div>

        {/* Animated Background Elements */}
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

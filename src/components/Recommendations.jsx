"use client";

import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState, useEffect, useCallback } from "react";

const img = [
  {
    category: "Gold Rings",
    image: "https://rukmini1.flixcart.com/image/1500/1500/xif0q/ring/2/e/v/free-size-1-kardo-2-cc-gold-ring-for-women-ring-miral-original-imahgfy9phjxg4jf.jpeg?q=70",
  },
  {
    category: "Necklace",
    image: "https://rubans.in/cdn/shop/files/rubans-22k-gold-plated-multi-strand-necklace-set-with-leaf-motifs-and-matching-drop-earrings-for-womens-girls-necklaces-necklace-sets-chains-mangalsutra-1151182527.jpg?v=1755711149&width=610",
  },
  {
    category: "Vaddanam",
    image: "https://cdn.shopify.com/s/files/1/0507/9865/7726/files/09-500x500_480x480.jpg?v=1657689073",
  },
  {
    category: "Choker",
    image: "https://www.sonalfashion.com/cdn/shop/files/rn-image_picker_lib_temp_da3b1249-92f3-4ada-a856-fd6ee414cc00_600x_crop_center.jpg?v=1725628380",
  },
  {
    category: "Earrings",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqrQdiEOM0duFs92WBFHLoXDSoI3bzkz34vSaZDi_W5Ghc0GNGiGZ9t6uH&s=10",
  },
  {
    category: "Bangles",
    image: "https://rubans.in/cdn/shop/files/rubans-stylish-set-of-2-18k-gold-plated-ruby-studded-geru-polish-finish-traditional-bangles-bangles-bracelets-1150834743_1800x1800.jpg?v=1776255079",
  },
  {
    category: "Hathphool",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxYZX4vfjH_H7jo9Cc9yH6a5NVpxFivlY0d-uadtquoQoWINnWXdzaM66d&s=10",
  },
  {
    category: "Armlet",
    image: "https://rubans.in/cdn/shop/files/RE16HH410856-Model-1.jpg?v=1768903527&width=610",
  },
  {
    category: "Nose Ring",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfwyteZAUthC7OonUakYDaEchhvxUQIOCLDh1qjDQHj3MqWBkWnEJJsKI&s=10",
  },
  {
    category: "Anklets",
    image: "https://rubans.in/cdn/shop/files/22k-gold-plated-linked-chain-anklet-timeless-elegance-for-your-ankles-accessories-35492903944366.jpg?v=1755720850",
  },
];

export default function Recommendations({ categories = [], onCategorySelect }) {
  const router = useRouter();
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // ── Check scroll position ──────────────────────────────────────────────────
  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [checkScroll, categories]);

  // ── Scroll by one "page" width ─────────────────────────────────────────────
  const scroll = (dir) => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.75;
    el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  const handleCategoryClick = (categoryId) => {
    onCategorySelect?.(String(categoryId));
    router.replace(`/products?category=${categoryId}`, { scroll: false });
  };

  // ── Arrow button component ─────────────────────────────────────────────────
  const ArrowBtn = ({ dir, visible }) => (
    <AnimatePresence>
      {visible && (
        <motion.button
          key={dir}
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.7 }}
          transition={{ duration: 0.2 }}
          onClick={() => scroll(dir)}
          aria-label={dir === "left" ? "Scroll left" : "Scroll right"}
          className={`
            absolute top-1/2 -translate-y-1/2 z-10
            ${dir === "left" ? "-left-4 md:-left-5" : "-right-4 md:-right-5"}
            flex items-center justify-center
            w-9 h-9 md:w-11 md:h-11
            rounded-full
            bg-white shadow-lg border border-amber-100
            text-amber-700
            hover:bg-amber-50 hover:scale-110
            active:scale-95
            transition-transform duration-150
            focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400
          `}
          style={{
            boxShadow: "0 4px 20px rgba(180,130,40,0.18), 0 1px 4px rgba(0,0,0,0.08)",
          }}
        >
          {dir === "left" ? (
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2.2} />
          ) : (
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2.2} />
          )}
        </motion.button>
      )}
    </AnimatePresence>
  );

  return (
    <section className="w-full bg-white py-14 md:py-20">
      <div className="max-w-7xl mx-auto px-4 md:px-6">

        {/* Heading */}
        <div className="text-center mb-10 md:mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900">
            Shop by Category
          </h2>
          <p className="text-gray-500 mt-3 text-sm sm:text-base">
            Explore our premium one gram gold jewellery collections.
          </p>
        </div>

        {/* Scroll track + arrows */}
        <div className="relative">
          <ArrowBtn dir="left" visible={canScrollLeft} />
          <ArrowBtn dir="right" visible={canScrollRight} />

          {/* Fade edge masks */}
          {canScrollLeft && (
            <div
              className="absolute left-0 top-0 h-full w-10 z-[5] pointer-events-none"
              style={{
                background: "linear-gradient(to right, rgba(255,255,255,0.9), transparent)",
              }}
            />
          )}
          {canScrollRight && (
            <div
              className="absolute right-0 top-0 h-full w-10 z-[5] pointer-events-none"
              style={{
                background: "linear-gradient(to left, rgba(255,255,255,0.9), transparent)",
              }}
            />
          )}

          {/* Scrollable row */}
          <div
            ref={scrollRef}
            className="flex gap-4 sm:gap-5 md:gap-6 overflow-x-auto pb-3 px-1"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {categories.map((category) => {
              const match = img.find(
                (item) =>
                  item.category.toLowerCase() === category.name.toLowerCase()
              );
              const image = match?.image || "/logo.png";

              return (
                <motion.div
                  key={category.id}
                  whileHover={{ y: -6, scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.22 }}
                  onClick={() => handleCategoryClick(category.id)}
                  className="group cursor-pointer flex-shrink-0"
                  style={{
                    // Responsive card width: 2.5 on mobile, 3 on sm, 4 on md+
                    width: "clamp(120px, 28vw, 208px)",
                  }}
                >
                  {/* Square image */}
                  <div className="aspect-square overflow-hidden rounded-xl sm:rounded-2xl bg-amber-50 shadow-md">
                    <img
                      src={image}
                      alt={category.name}
                      className="w-full h-full object-cover transition duration-500 group-hover:scale-110"
                      onError={(e) => {
                        e.currentTarget.src = "/logo.png";
                      }}
                    />
                  </div>

                  {/* Label */}
                  <h3 className="mt-3 text-center font-semibold text-sm sm:text-base md:text-lg text-gray-900 leading-tight">
                    {category.name}
                  </h3>
                </motion.div>
              );
            })}
          </div>
        </div>

      </div>

      <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
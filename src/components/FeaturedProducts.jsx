"use client";

import { motion } from "framer-motion";

const texts = [
  {
    title: "Timeless Elegance",
    description:
      "Crafted with precision to celebrate every tradition and every occasion.",
    direction: "right",
  },
  {
    title: "Designed for You",
    description:
      "Every collection reflects elegance, craftsmanship, and modern style.",
    direction: "left",
  },
  {
    title: "Luxury in Every Detail",
    description:
      "Experience premium quality with designs made to last generations.",
    direction: "right",
  },
  {
    title: "Made with Passion",
    description:
      "Jewellery that tells stories and creates unforgettable memories.",
    direction: "left",
  },
];

export default function FeaturedProducts() {
  return (
    <section className="bg-white">
      {texts.map((item, index) => (
        <div
          key={index}
          className={`h-screen flex items-center px-6 md:px-16 lg:px-24 ${
            item.direction === "left"
              ? "justify-start"
              : "justify-end"
          }`}
        >
          <motion.div
            initial={{
              opacity: 0,
              x: item.direction === "left" ? -120 : 120,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
              amount: 0.3,
            }}
            transition={{
              duration: 0.9,
              ease: [0.22, 1, 0.36, 1],
            }}
            className={`
              w-full
              md:w-[55%]
              lg:w-[45%]
              ${
                item.direction === "left"
                  ? "text-left"
                  : "text-right"
              }
            `}
          >
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-light leading-tight">
              {item.title}
            </h2>

            <p className="mt-6 text-base md:text-lg lg:text-xl leading-8 text-gray-600">
              {item.description}
            </p>
          </motion.div>
        </div>
      ))}
    </section>
  );
}
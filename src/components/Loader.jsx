"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const MLoader = ({ onComplete, size = 280, duration = 4 }) => {
  const [isExiting, setIsExiting] = useState(false);
  const [dimension, setDimension] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    setDimension({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);

      setTimeout(() => {
        onComplete?.();
      }, 1000);
    }, duration * 1000);

    return () => clearTimeout(timer);
  }, [duration, onComplete]);

  const initialPath = `M0 0 L${dimension.width} 0 L${dimension.width} ${
    dimension.height
  } Q${dimension.width / 2} ${dimension.height + 300} 0 ${
    dimension.height
  } L0 0`;

  const targetPath = `M0 0 L${dimension.width} 0 L${dimension.width} ${
    dimension.height
  } Q${dimension.width / 2} ${dimension.height} 0 ${
    dimension.height
  } L0 0`;

  const curve = {
    initial: {
      d: initialPath,
      transition: {
        duration: 0.7,
        ease: [0.76, 0, 0.24, 1],
      },
    },
    exit: {
      d: targetPath,
      transition: {
        duration: 0.7,
        ease: [0.76, 0, 0.24, 1],
        delay: 0.3,
      },
    },
  };

  const slideUp = {
    initial: {
      top: 0,
    },
    exit: {
      top: "-100vh",
      transition: {
        duration: 0.8,
        ease: [0.76, 0, 0.24, 1],
        delay: 0.2,
      },
    },
  };

  return (
    <motion.div
      variants={slideUp}
      initial="initial"
      animate={isExiting ? "exit" : "initial"}
      className="fixed inset-0 z-[99999999999] flex items-center justify-center bg-white overflow-hidden"
    >
      {dimension.width > 0 && (
        <>
          <div className="relative z-20 flex flex-col items-center justify-center">
            {/* Reveal Dot */}

            {/* Glow */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: [0.5, 1.4, 1],
                opacity: [0, 0.3, 0],
              }}
              transition={{
                duration: 1.2,
                delay: 0.1,
              }}
              className="absolute w-40 h-40 rounded-full border border-amber-300"
            />

            {/* Logo */}
           {/* Logo */}
<motion.div
  initial={{
    opacity: 0,
    scale: 0.2,
    y: 20,
  }}
  animate={{
    opacity: 1,
    scale: 1,
    y: 0,
  }}
  transition={{
    delay: 0.2,
    duration: 0.9,
    ease: [0.22, 1, 0.36, 1],
  }}
  className="relative"
>
  <Image
    src="/logo.png"
    alt="Aabharanam Jewels"
    width={1000}
    height={1000}
    priority
    className="
      object-contain
      w-[30vw]
      min-w-[180px]
      max-w-[500px]
      h-auto
    "
  />
</motion.div>

            {/* Floating Motion */}
            <motion.div
              animate={{
                y: [-5, 5, -5],
              }}
              transition={{
                repeat: Infinity,
                duration: 3,
                ease: "easeInOut",
              }}
              className="absolute inset-0"
            />
          </div>

          <svg className="absolute top-0 w-full h-[calc(100%+300px)]">
            <motion.path
              variants={curve}
              initial="initial"
              animate={isExiting ? "exit" : "initial"}
              fill="#ffffff"
            />
          </svg>
        </>
      )}
    </motion.div>
  );
};

export default MLoader;
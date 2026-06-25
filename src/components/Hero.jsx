"use client";
import "../styles/Hero.css";
export default function Hero() {
  return (
    <section className="relative w-full h-screen min-h-screen overflow-hidden bg-black flex items-center justify-center">

      {/* Background Video */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        loading="lazy"
      >
        <source src="/hero.mp4" type="video/mp4" />
      </video>

      {/* Overlay (optional, subtle) */}
      <div className="absolute inset-0 bg-black/20"></div>

      {/* FLOWING TEXT */}
      <div className="hero-marquee-wrapper">
        <div className="hero-marquee-text">
         Crafted to Shine. Designed to Be Remembered.
        </div>
      </div>

    </section>
  );
}
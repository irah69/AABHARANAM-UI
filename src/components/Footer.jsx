"use client";

import { FacebookIcon, InstagramIcon, LinkedinIcon, TwitterIcon, Mail, Phone, MapPin } from "lucide-react";
import Link from "next/link";
import "../styles/footer.css";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: "Shop",
      links: [
        { href: "/products", label: "All Collections" },
        { href: "/products?sort=newest", label: "New Arrivals" },
      ],
    },
    {
      title: "Support",
      links: [
        { href: "/contact", label: "Contact Us" },
        { href: "/", label: "Size Guide" },
        { href: "/contact", label: "Bulk Orders" },
      ],
    },
    {
      title: "About",
      links: [
        { href: "/", label: "Our Story" },
        { href: "/", label: "Sustainability" },
        { href: "/", label: "Press" },
        { href: "/", label: "Careers" },
        { href: "/", label: "Blog" },
        { href: "/", label: "Gift Cards" },
      ],
    },
    {
      title: "Legal",
      links: [
        { href: "/", label: "Terms & Conditions" },
        { href: "/", label: "Privacy Policy" },
        { href: "/", label: "Cookie Policy" },
        { href: "/", label: "Refund Policy" },
        { href: "/", label: "Accessibility" },
        { href: "/", label: "Contact" },
      ],
    },
  ];

  const socialLinks = [
    { icon: FacebookIcon, href: "#" },
    { icon: InstagramIcon, href: "#" },
    { icon: TwitterIcon, href: "#" },
    { icon: LinkedinIcon, href: "#" },
  ];

  return (
    <footer className="bg-gray-50 pt-24 pb-6">
      <div className="max-w-7xl mx-auto px-4 md:px-6">

        {/* TOP SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16 mb-12">

          {/* BRAND */}
          <div className="text-left">

            <div className="flex items-center mb-8">
              <span className="text-xl font-semibold tracking-[0.2em] text-black">
                MURGAN
              </span>
            </div>

            <p className="text-gray-600 leading-relaxed mb-8 text-sm md:text-base">
              Premium women&apos;s dresses crafted with elegance and quality.
              Discover timeless styles for every occasion.
            </p>

            <div className="flex space-x-4">
              {socialLinks.map(({ icon: Icon, href }, idx) => (
                <a
                  key={idx}
                  href={href}
                  className="w-10 h-10 rounded-xl bg-white border border-black/10 flex items-center justify-center text-gray-600 hover:text-black hover:scale-110 hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>

          </div>

          {/* SHOP */}
          <div className="text-left">
            <h4 className="text-lg font-semibold tracking-tight mb-6 text-black">
              {footerLinks[0].title}
            </h4>

            <ul className="space-y-2">
              {footerLinks[0].links.map((link, idx) => (
                <li key={idx}>
                  <Link
                    href={link.href}
                    className="relative text-gray-600 hover:text-black text-sm after:absolute after:left-0 after:-bottom-1 after:h-[1px] after:w-0 after:bg-black after:transition-all after:duration-300 hover:after:w-full"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* SUPPORT */}
          <div className="text-left">
            <h4 className="text-lg font-semibold tracking-tight mb-6 text-black">
              {footerLinks[1].title}
            </h4>

            <ul className="space-y-2">
              {footerLinks[1].links.map((link, idx) => (
                <li key={idx}>
                  <Link
                    href={link.href}
                    className="relative text-gray-600 hover:text-black text-sm after:absolute after:left-0 after:-bottom-1 after:h-[1px] after:w-0 after:bg-black after:transition-all after:duration-300 hover:after:w-full"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CONTACT */}
          <div className="text-left">
            <h4 className="text-lg font-semibold tracking-tight mb-6 text-black">
              Contact
            </h4>

            <ul className="space-y-4">

              <li className="text-gray-600 flex items-center text-sm">
                <MapPin className="w-5 h-5 mr-2 text-gray-400" />
                <span>New Delhi, India</span>
              </li>

              <li>
                <a
                  href="mailto:support@murgan.com"
                  className="relative text-gray-600 hover:text-black text-sm flex items-center after:absolute after:left-7 after:-bottom-1 after:h-[1px] after:w-0 after:bg-black after:transition-all after:duration-300 hover:after:w-[60%]"
                >
                  <Mail className="w-5 h-5 mr-2 text-gray-400" />
                  support@murgan.com
                </a>
              </li>

              <li>
                <a
                  href="tel:+919876543210"
                  className="relative text-gray-600 hover:text-black text-sm flex items-center after:absolute after:left-7 after:-bottom-1 after:h-[1px] after:w-0 after:bg-black after:transition-all after:duration-300 hover:after:w-[60%]"
                >
                  <Phone className="w-5 h-5 mr-2 text-gray-400" />
                  +91 98765 43210
                </a>
              </li>

            </ul>
          </div>

        </div>

        {/* BOTTOM COPYRIGHT */}
        <div className="mt-12 pt-8 border-t border-gray-100 text-center">
          <p className="text-gray-600 text-sm">
            © {currentYear} MURGAN. All rights reserved. | Crafted with care. Designed for you.
          </p>
        </div>

      </div>
    </footer>
  );
}
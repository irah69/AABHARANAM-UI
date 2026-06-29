"use client";

import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Menu, MoveRight, X } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";

import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

/* ─── Playfair Display ─── */
const playfairStyle = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800;900&display=swap');
  .pf { font-family: 'Playfair Display', serif; }
  .glass-btn {
    font-family: 'Playfair Display', serif;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 7px 18px;
    font-size: 0.82rem;
    font-weight: 700;
    color: #1a1a1a;
    background: rgba(255,255,255,0.38);
    backdrop-filter: blur(14px) saturate(160%);
    -webkit-backdrop-filter: blur(14px) saturate(160%);
    border: 1px solid rgba(255,255,255,0.62);
    border-radius: 5px;
    box-shadow: 0 10px 10px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.7);
    cursor: pointer;
    white-space: nowrap;
    transition: background 0.18s ease, box-shadow 0.18s ease, transform 0.12s ease;
    text-decoration: none;
  }
  .glass-btn:hover {
    background: rgba(255,255,255,0.55);
    box-shadow: 0 4px 16px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,0.8);
    transform: translateY(-1px);
  }
  .glass-btn:active {
    transform: translateY(0px);
    box-shadow: 0 1px 4px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.6);
  }
  .glass-btn-full { width: 100%; }
`;

/* ─── Native glass button — no shadcn, no CVA conflicts ─── */
const GlassBtn = ({ children, onClick, className = "" }) => (
    <button onClick={onClick} className={`glass-btn ${className}`}>
        {children}
    </button>
);

function Header1() {
    const navigationItems = [
        { title: "Home", href: "/" },
        { title: "Company", href: "/about" },
        { title: "Contact", href: "/contact" },
    ];

    const [isOpen, setOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const { isAuthenticated, logout, isAdmin } = useAuth();
    const { getTotalItems } = useCart();
    const cartCount = isAuthenticated ? getTotalItems() : 0;

    useEffect(() => {
        const onScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    /* ── Mobile nav item ── */
    const MobileNavItem = ({ item }) => {
        const [open, setOpen] = useState(false);

        if (item.href) {
            return (
                <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="pf flex justify-between items-center text-lg font-semibold text-[#1a1a1a]"
                >
                    {item.title}
                    <MoveRight className="w-4 h-4" />
                </Link>
            );
        }

        return (
            <div className="flex flex-col">
                <button
                    onClick={() => setOpen(!open)}
                    className="pf flex justify-between items-center text-lg font-semibold text-[#1a1a1a]"
                >
                    {item.title}
                    <MoveRight className={`w-4 h-4 transition-transform ${open ? "rotate-90" : ""}`} />
                </button>
                {open && (
                    <div className="pl-4 mt-2 flex flex-col gap-2 bg-white rounded shadow">
                        {item.items?.map((sub, i) => (
                            <Link
                                key={i}
                                href={sub.href}
                                onClick={() => setOpen(false)}
                                className="pf text-base font-medium text-neutral-500"
                            >
                                {sub.title}
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <>
            {/* inject Playfair once */}
            <style>{playfairStyle}</style>

            <header
                className={`w-full z-40 sticky top-0 left-0 bg-white transition-all duration-300 ${
                    isScrolled ? "shadow-md" : ""
                }`}
            >
                {/*
                  ── 3-col grid: [nav] [logo] [actions]
                     Logo sits in the middle column → always perfectly centred
                     regardless of how many buttons are on the right.
                */}
                <div
                    className={`max-w-screen-xl mx-auto px-4 grid grid-cols-3 items-center transition-all duration-300 ${
                        isScrolled ? "h-14" : "h-20"
                    }`}
                >
                    {/* ── col 1: Desktop nav ── */}
                    <div className="hidden lg:flex items-center gap-2">
                        <NavigationMenu>
                            <NavigationMenuList className="flex gap-2">
                                {navigationItems.map((item) => (
                                    <NavigationMenuItem key={item.title}>
                                        {item.href ? (
                                            <NavigationMenuLink asChild>
                                                <Link href={item.href}>
                                                    <button
                                                        className={`pf font-bold text-[#1a1a1a] hover:text-neutral-500 transition-colors px-3 py-1 rounded ${
                                                            isScrolled ? "text-sm" : "text-base"
                                                        }`}
                                                    >
                                                        {item.title}
                                                    </button>
                                                </Link>
                                            </NavigationMenuLink>
                                        ) : (
                                            <>
                                                <NavigationMenuTrigger
                                                    className={`pf font-bold text-[#1a1a1a] ${
                                                        isScrolled ? "text-sm" : "text-base"
                                                    }`}
                                                >
                                                    {item.title}
                                                </NavigationMenuTrigger>
                                                <NavigationMenuContent className="!w-[420px] p-4">
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div>
                                                            <p className="pf text-lg font-bold text-[#1a1a1a]">
                                                                {item.title}
                                                            </p>
                                                            <p className="pf text-sm text-neutral-500 mt-1">
                                                                {item.description}
                                                            </p>
                                                        </div>
                                                        <div className="flex flex-col justify-end text-sm">
                                                            {item.items?.map((sub) => (
                                                                <NavigationMenuLink
                                                                    key={sub.title}
                                                                    href={sub.href}
                                                                    className="pf flex justify-between items-center hover:bg-neutral-100 py-2 px-4 rounded text-[#1a1a1a] font-semibold"
                                                                >
                                                                    <span>{sub.title}</span>
                                                                    <MoveRight className="w-4 h-4 text-neutral-400" />
                                                                </NavigationMenuLink>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </NavigationMenuContent>
                                            </>
                                        )}
                                    </NavigationMenuItem>
                                ))}
                            </NavigationMenuList>
                        </NavigationMenu>
                    </div>

                    {/* ── col 2: Logo — always centred ── */}
                    <div className="flex justify-center">
                        <Link href="/">
                            <span
                                className={`pf font-black tracking-tight text-[#1a1a1a] select-none transition-all duration-300 ${
                                    isScrolled ? "text-xl" : "text-2xl"
                                }`}
                            >
                                AABHARANAM
                            </span>
                        </Link>
                    </div>

                    {/* ── col 3: Desktop right actions ── */}
                    <div className="hidden lg:flex justify-end items-center gap-2">
                        {!isAdmin && (
                            <Link href="/cart">
                                <GlassBtn>Cart{cartCount ? ` (${cartCount})` : ""}</GlassBtn>
                            </Link>
                        )}

                        {isAuthenticated && (
                            <Link href={isAdmin ? "/adminorder" : "/orders"}>
                                <GlassBtn>Orders</GlassBtn>
                            </Link>
                        )}

                        {isAdmin && (
                            <Link href="/admin/dashboard">
                                <GlassBtn>Admin</GlassBtn>
                            </Link>
                        )}

                        {isAuthenticated ? (
                            <GlassBtn onClick={logout}>Logout</GlassBtn>
                        ) : (
                            <Link href="/signin">
                                <GlassBtn>Sign in</GlassBtn>
                            </Link>
                        )}

                        {!isAdmin && (
                            <GlassBtn
                                onClick={() =>
                                    window.open("https://maps.app.goo.gl/DN2ZC2LyiMQiPtveA", "_blank")
                                }
                            >
                                Get Directions
                            </GlassBtn>
                        )}
                    </div>

                    {/* ── Mobile: hamburger (only visible on small screens) ── */}
                    <div className="flex lg:hidden col-start-3 justify-end">
                        <button
                            onClick={() => setOpen(!isOpen)}
                            className="p-2 rounded hover:bg-neutral-100 transition-colors"
                            aria-label="Toggle menu"
                        >
                            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                {/* ── Mobile drawer ── */}
                {isOpen && (
                    <div className="lg:hidden absolute top-full left-0 w-full bg-white border-t shadow-lg z-50">
                        <div className="max-w-screen-xl mx-auto px-4 py-5 flex flex-col gap-5">
                            {/* Nav links */}
                            {navigationItems.map((item, i) => (
                                <MobileNavItem key={i} item={item} />
                            ))}

                            {/* Divider */}
                            <div className="border-t border-neutral-100" />

                            {/* Action buttons */}
                            <div className="flex flex-col gap-3">
                                {!isAdmin && (
                                    <Link href="/cart" onClick={() => setOpen(false)}>
                                        <GlassBtn className="glass-btn-full">
                                            Cart{cartCount ? ` (${cartCount})` : ""}
                                        </GlassBtn>
                                    </Link>
                                )}

                                {isAuthenticated && (
                                    <Link
                                        href={isAdmin ? "/adminorder" : "/orders"}
                                        onClick={() => setOpen(false)}
                                    >
                                        <GlassBtn className="glass-btn-full">Orders</GlassBtn>
                                    </Link>
                                )}

                                {isAdmin && (
                                    <Link href="/admin/dashboard" onClick={() => setOpen(false)}>
                                        <GlassBtn className="glass-btn-full">Admin</GlassBtn>
                                    </Link>
                                )}

                                {isAuthenticated ? (
                                    <GlassBtn
                                        className="glass-btn-full"
                                        onClick={() => { logout(); setOpen(false); }}
                                    >
                                        Logout
                                    </GlassBtn>
                                ) : (
                                    <Link href="/signin" onClick={() => setOpen(false)}>
                                        <GlassBtn className="glass-btn-full">Sign in</GlassBtn>
                                    </Link>
                                )}

                                {!isAdmin && (
                                    <GlassBtn
                                        className="glass-btn-full"
                                        onClick={() => {
                                            window.open("https://maps.app.goo.gl/DN2ZC2LyiMQiPtveA", "_blank");
                                            setOpen(false);
                                        }}
                                    >
                                        Get Directions
                                    </GlassBtn>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </header>
        </>
    );
}

export { Header1 };
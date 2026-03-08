"use client";

import { Button } from "@/components/ui/button";
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

import "../../styles/header.css";

function Header1() {
    const navigationItems = [
        {
            title: "Home",
            href: "/",
            description: "",
        },
       
        {
            title: "Products",
            href: "/products",
            description: "",
        },
        {
            title: "Company",
            href: "/about",
            description: "Managing a small business today is already tough.",
        },
    ];

    const [isOpen, setOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const { isAuthenticated, logout, isAdmin } = useAuth();
    const { getTotalItems } = useCart();
    const cartCount = isAuthenticated ? getTotalItems() : 0;

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // ✅ Mobile Dropdown Component
    const MobileNavItem = ({ item }) => {
        const [openDropdown, setOpenDropdown] = useState(false);

        if (item.href) {
            return (
                <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex justify-between items-center text-lg font-semibold text-black"
                >
                    {item.title}
                    <MoveRight className="w-4 h-4" />
                </Link>
            );
        }

        return (
            <div className="flex flex-col">
                <button
                    onClick={() => setOpenDropdown(!openDropdown)}
                    className="flex justify-between items-center text-lg font-semibold text-black"
                >
                    {item.title}
                    <MoveRight
                        className={`w-4 h-4 transition-transform ${
                            openDropdown ? "rotate-90" : ""
                        }`}
                    />
                </button>

                {openDropdown && (
                    <div className="pl-4 mt-2 flex flex-col gap-2 bg-white rounded shadow">
                        {item.items?.map((subItem, idx) => (
                            <Link
                                key={idx}
                                href={subItem.href}
                                onClick={() => setOpen(false)}
                                className="text-base font-medium text-muted-foreground"
                            >
                                {subItem.title}
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <header
            className={`w-full z-40 sticky top-0 left-0 bg-white transition-all duration-300 ${
                isScrolled ? "shadow-md" : "" 
            }`}
        >
            <div
                className={`container relative mx-auto flex gap-4 flex-row lg:grid lg:grid-cols-3 items-center transition-all duration-300 ${
                    isScrolled ? "min-h-14 py-1" : "min-h-20 py-4"
                }`}
            >
                {/* Desktop Navigation */}
                <div className="justify-start items-center gap-4 lg:flex hidden flex-row">
                    <NavigationMenu>
                        <NavigationMenuList className="flex gap-4">
                            {navigationItems.map((item) => (
                                <NavigationMenuItem key={item.title}>
                                    {item.href ? (
                                        <NavigationMenuLink asChild>
                                            <Link href={item.href}>
                                                <Button
                                                    variant="ghost"
                                                    className={`font-bold text-black transition-all duration-300 ${
                                                        isScrolled
                                                            ? "text-sm"
                                                            : "text-base"
                                                    }`}
                                                >
                                                    {item.title}
                                                </Button>
                                            </Link>
                                        </NavigationMenuLink>
                                    ) : (
                                        <>
                                            <NavigationMenuTrigger
                                                className={`font-bold text-black transition-all duration-300 ${
                                                    isScrolled
                                                        ? "text-sm"
                                                        : "text-base"
                                                }`}
                                            >
                                                {item.title}
                                            </NavigationMenuTrigger>
                                            <NavigationMenuContent className="!w-[450px] p-4">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="flex flex-col justify-between">
                                                        <div>
                                                            <p className="text-lg font-bold text-black">
                                                                {item.title}
                                                            </p>
                                                            <p className="text-muted-foreground text-sm">
                                                                {item.description}
                                                            </p>
                                                        </div>
{/*                                                         <Button
                                                            size="sm"
                                                            className="mt-10"
                                                        >
                                                            Book a call today
                                                        </Button> */}
                                                    </div>

                                                    <div className="flex flex-col text-sm justify-end">
                                                        {item.items?.map(
                                                            (subItem) => (
                                                                <NavigationMenuLink
                                                                    key={
                                                                        subItem.title
                                                                    }
                                                                    href={
                                                                        subItem.href
                                                                    }
                                                                    className="flex justify-between items-center hover:bg-muted py-2 px-4 rounded text-black font-semibold"
                                                                >
                                                                    <span>
                                                                        {
                                                                            subItem.title
                                                                        }
                                                                    </span>
                                                                    <MoveRight className="w-4 h-4 text-muted-foreground" />
                                                                </NavigationMenuLink>
                                                            )
                                                        )}
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

                {/* Logo */}
                <div className="flex lg:justify-center">
                    <Link href="/">
                        <span
                            className={`font-black text-black transition-all duration-300 ${
                                isScrolled ? "text-lg" : "text-2xl"
                            }`}
                        >
                            MURGAN
                        </span>
                    </Link>
                </div>

                {/* Right Buttons */}
                <div className="hidden lg:flex justify-end w-full gap-4">


                    <div className="border-r hidden md:inline"></div>

                    {!isAdmin && (
                        <Link href="/cart">
                            <Button className="font-bold text-black !bg-white/30 backdrop-blur-md border border-white/40 hover:!bg-white/40 shadow-lg rounded-full">
                                Cart {cartCount ? `(${cartCount})` : ""}
                            </Button>
                        </Link>
                    )}

                    {isAuthenticated && (
                        <Link href="/orders">
                            <Button className="font-bold text-black !bg-white/30 backdrop-blur-md border border-white/40 hover:!bg-white/40 shadow-lg rounded-full">
                                Orders
                            </Button>
                        </Link>
                    )}

                    {isAdmin && (
                        <Link href="/admin/dashboard">
                            <Button className="font-bold text-black !bg-white/30 backdrop-blur-md border border-white/40 hover:!bg-white/40 shadow-lg rounded-full">
                                Admin
                            </Button>
                        </Link>
                    )}

                    {isAuthenticated ? (
                        <Button
                            className="font-bold text-black !bg-white/30 backdrop-blur-md border border-white/40 hover:!bg-white/40 shadow-lg rounded-full"
                            onClick={logout}
                        >
                            Logout
                        </Button>
                    ) : (
                        <Link href="/signin">
                            <Button className="font-bold text-black !bg-white/30 backdrop-blur-md border border-white/40 hover:!bg-white/40 shadow-lg rounded-full">
                                Sign in
                            </Button>
                        </Link>
                    )}

{!isAdmin && (
        <Button
            className="font-bold text-black !bg-white/30 backdrop-blur-md border border-white/40 hover:!bg-white/40 shadow-lg rounded-full"
            onClick={() => {
                window.open(
                    "https://maps.app.goo.gl/DN2ZC2LyiMQiPtveA",
                    "_blank"
                );
            }}
        >
            Get Directions
        </Button>
)}
                </div>

                {/* Mobile Menu */}
                <div className="flex w-12 shrink lg:hidden items-end justify-end">
                    <Button variant="ghost" onClick={() => setOpen(!isOpen)}>
                        {isOpen ? (
                            <X className="w-5 h-5" />
                        ) : (
                            <Menu className="w-5 h-5" />
                        )}
                    </Button>

                    {isOpen && (
                        <div className="absolute top-20 left-0 border-t flex flex-col w-full bg-white shadow-lg py-4 container gap-6">
                            {navigationItems.map((item, index) => (
                                <MobileNavItem
                                    key={index}
                                    item={item}
                                />
                            ))}
                            {/* Mobile Sign in and Get started buttons */}
                            <div className="flex flex-col gap-3 mt-4">
                                <Link href="/cart" onClick={() => setOpen(false)}>
                                    <Button className="w-full font-bold text-black !bg-white/30 backdrop-blur-md border border-white/40 hover:!bg-white/40 shadow-lg rounded-full">
                                        Cart {cartCount ? `(${cartCount})` : ""}
                                    </Button>
                                </Link>
                                {isAuthenticated ? (
                                    <>
                                        <Link href="/orders" onClick={() => setOpen(false)}>
                                            <Button className="w-full font-bold text-black !bg-white/30 backdrop-blur-md border border-white/40 hover:!bg-white/40 shadow-lg rounded-full">
                                                Orders
                                            </Button>
                                        </Link>
                                        {isAdmin && (
                                            <Link href="/admin/dashboard" onClick={() => setOpen(false)}>
                                                <Button className="w-full font-bold text-black !bg-white/30 backdrop-blur-md border border-white/40 hover:!bg-white/40 shadow-lg rounded-full">
                                                    Admin
                                                </Button>
                                            </Link>
                                        )}
                                        <Button
                                            className="w-full font-bold text-black !bg-white/30 backdrop-blur-md border border-white/40 hover:!bg-white/40 shadow-lg rounded-full"
                                            onClick={() => {
                                                logout();
                                                setOpen(false);
                                            }}
                                        >
                                            Logout
                                        </Button>
                                    </>
                                ) : (
                                    <Link href="/signin" onClick={() => setOpen(false)}>
                                        <Button className="w-full font-bold text-black !bg-white/30 backdrop-blur-md border border-white/40 hover:!bg-white/40 shadow-lg rounded-full">
                                            Sign in
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}

export { Header1 };
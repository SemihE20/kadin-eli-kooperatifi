"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { NAV_ITEMS } from "@/lib/constants";
import { useCartStore } from "@/store/cart";
import MobileMenu from "./MobileMenu";
import CartDrawer from "../cart/CartDrawer";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { getTotalItems, toggleCart, isOpen: cartOpen } = useCartStore();
  const totalItems = getTotalItems();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`
          fixed top-0 left-0 right-0 z-50 transition-all duration-300
          ${
            scrolled
              ? "glass shadow-soft py-2"
              : "bg-transparent py-4"
          }
        `}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-3 group"
              id="header-logo"
            >
              <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden ring-2 ring-primary-200 group-hover:ring-primary-400 transition-all duration-300">
                <Image
                  src="/logo.jpeg"
                  alt="Gözler Kadıneli Kooperatifi"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-sm font-bold text-primary-800 leading-tight">
                  Gözler
                </h1>
                <p className="text-[10px] text-primary-600 font-medium tracking-wide uppercase">
                  Kadıneli Kooperatifi
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1" id="main-nav">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-4 py-2 text-sm font-medium text-foreground/80 hover:text-primary-700 rounded-lg hover:bg-primary-50 transition-all duration-200"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Cart Button */}
              <button
                onClick={toggleCart}
                className="relative p-2.5 rounded-xl text-foreground/70 hover:text-primary-700 hover:bg-primary-50 transition-all duration-200 cursor-pointer"
                aria-label="Sepet"
                id="cart-button"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-primary-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-scale-in">
                    {totalItems}
                  </span>
                )}
              </button>

              {/* User Menu */}
              <Link
                href="/giris"
                className="p-2.5 rounded-xl text-foreground/70 hover:text-primary-700 hover:bg-primary-50 transition-all duration-200"
                aria-label="Giriş Yap"
                id="login-button"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="md:hidden p-2.5 rounded-xl text-foreground/70 hover:text-primary-700 hover:bg-primary-50 transition-all duration-200 cursor-pointer"
                aria-label="Menü"
                id="mobile-menu-button"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      {/* Cart Drawer */}
      <CartDrawer isOpen={cartOpen} onClose={() => useCartStore.getState().closeCart()} />
    </>
  );
}

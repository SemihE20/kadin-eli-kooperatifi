"use client";

import { useEffect } from "react";
import Link from "next/link";
import { NAV_ITEMS } from "@/lib/constants";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] md:hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-earth-900/40 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Menu Panel */}
      <div className="absolute right-0 top-0 bottom-0 w-[280px] bg-cream-50 shadow-elevated animate-slide-in-right texture-paper">
        {/* Close Button */}
        <div className="flex items-center justify-between p-4 border-b border-earth-200">
          <span className="font-heading text-sm font-semibold text-primary-800">Menü</span>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-muted hover:text-foreground hover:bg-earth-100 transition-colors cursor-pointer"
            aria-label="Menüyü kapat"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="p-4 flex flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-foreground/80 hover:text-primary-700 hover:bg-cream-200 rounded-xl transition-all duration-200"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Auth Section */}
        <div className="p-4 border-t border-earth-200 mt-auto">
          <Link
            href="/giris"
            onClick={onClose}
            className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-primary-700 text-white text-sm font-medium rounded-xl hover:bg-primary-800 transition-colors"
          >
            <svg
              className="w-4 h-4"
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
            Giriş Yap
          </Link>
        </div>
      </div>
    </div>
  );
}

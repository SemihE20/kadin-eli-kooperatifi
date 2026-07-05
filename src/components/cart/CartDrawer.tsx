"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useCartStore } from "@/store/cart";
import { formatPrice, calculateShipping } from "@/lib/utils";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/constants";
import CartItem from "./CartItem";
import { getPrimaryImage } from "@/lib/utils";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, getSubtotal, clearCart } = useCartStore();
  const subtotal = getSubtotal();
  const shipping = calculateShipping(subtotal);
  const total = subtotal + shipping;

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
    <div className="fixed inset-0 z-[70]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-earth-50 shadow-elevated animate-slide-in-right flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-white">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-primary-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <h2 className="text-lg font-semibold text-foreground">Sepetim</h2>
            <span className="text-xs text-muted">({items.length} ürün)</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-muted hover:text-foreground hover:bg-earth-50 transition-colors cursor-pointer"
            aria-label="Sepeti kapat"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="w-20 h-20 bg-earth-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-10 h-10 text-earth-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-foreground mb-1">Sepetiniz boş</p>
              <p className="text-xs text-muted mb-6">Hemen alışverişe başlayın!</p>
              <Link
                href="/urunler"
                onClick={onClose}
                className="px-5 py-2.5 bg-primary-700 text-white text-sm font-medium rounded-xl hover:bg-primary-800 transition-colors"
              >
                Ürünlere Göz At
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {items.map((item) => (
                <CartItem
                  key={item.product.id}
                  productId={item.product.id}
                  name={item.product.name}
                  price={item.product.price}
                  quantity={item.quantity}
                  imageUrl={getPrimaryImage(item.product.images)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-border bg-white p-4">
            {/* Free shipping progress */}
            {subtotal < FREE_SHIPPING_THRESHOLD && (
              <div className="mb-4 p-3 bg-primary-50 rounded-xl">
                <p className="text-xs text-primary-700 font-medium mb-1.5">
                  🚚 Ücretsiz kargoya{" "}
                  <span className="font-bold">
                    {formatPrice(FREE_SHIPPING_THRESHOLD - subtotal)}
                  </span>{" "}
                  kaldı!
                </p>
                <div className="w-full h-1.5 bg-primary-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary-500 rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100)}%`,
                    }}
                  />
                </div>
              </div>
            )}

            {/* Summary */}
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted">Ara Toplam</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted">Kargo</span>
                <span className={`font-medium ${shipping === 0 ? "text-primary-600" : ""}`}>
                  {shipping === 0 ? "Ücretsiz" : formatPrice(shipping)}
                </span>
              </div>
              <div className="flex justify-between text-base font-semibold pt-2 border-t border-border">
                <span>Toplam</span>
                <span className="text-primary-700">{formatPrice(total)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2">
              <Link
                href="/sepet"
                onClick={onClose}
                className="flex items-center justify-center gap-2 w-full py-3 bg-primary-700 text-white text-sm font-medium rounded-xl hover:bg-primary-800 transition-colors"
              >
                Sepete Git
              </Link>
              <button
                onClick={clearCart}
                className="text-xs text-muted hover:text-red-500 transition-colors py-1 cursor-pointer"
              >
                Sepeti Temizle
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

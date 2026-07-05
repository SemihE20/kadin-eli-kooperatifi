"use client";

import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";

interface CartItemProps {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

export default function CartItem({
  productId,
  name,
  price,
  quantity,
  imageUrl,
}: CartItemProps) {
  const { updateQuantity, removeItem } = useCartStore();

  return (
    <div className="flex gap-3 p-3 bg-white rounded-xl border border-border group hover:shadow-soft transition-all duration-200">
      {/* Image */}
      <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-earth-100 shrink-0">
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="object-cover"
        />
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-foreground truncate">{name}</h4>
        <p className="text-sm font-semibold text-primary-700 mt-0.5">
          {formatPrice(price)}
        </p>

        {/* Quantity Controls */}
        <div className="flex items-center gap-2 mt-2">
          <div className="flex items-center border border-border rounded-lg overflow-hidden">
            <button
              onClick={() => updateQuantity(productId, quantity - 1)}
              className="w-7 h-7 flex items-center justify-center text-muted hover:text-foreground hover:bg-earth-50 transition-colors cursor-pointer"
              aria-label="Adet azalt"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            <span className="w-8 text-center text-xs font-medium">{quantity}</span>
            <button
              onClick={() => updateQuantity(productId, quantity + 1)}
              className="w-7 h-7 flex items-center justify-center text-muted hover:text-foreground hover:bg-earth-50 transition-colors cursor-pointer"
              aria-label="Adet artır"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>

          <span className="text-xs text-muted ml-auto">
            {formatPrice(price * quantity)}
          </span>
        </div>
      </div>

      {/* Remove Button */}
      <button
        onClick={() => removeItem(productId)}
        className="self-start p-1 text-muted hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
        aria-label="Ürünü kaldır"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

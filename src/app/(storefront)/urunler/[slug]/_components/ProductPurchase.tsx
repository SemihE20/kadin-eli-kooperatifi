"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { useCartStore } from "@/store/cart";
import type { Product } from "@/types";

export default function ProductPurchase({ product }: { product: Product }) {
  const { addItem, openCart } = useCartStore();
  const [quantity, setQuantity] = useState(1);
  const isOutOfStock = product.stock_quantity <= 0;

  function handleAddToCart() {
    for (let i = 0; i < quantity; i++) addItem(product);
    openCart();
  }

  return (
    <>
      <div className="mb-6">
        {isOutOfStock ? (
          <Badge variant="danger">Stokta Yok</Badge>
        ) : product.stock_quantity <= 5 ? (
          <Badge variant="warning">Son {product.stock_quantity} adet!</Badge>
        ) : (
          <Badge variant="success">Stokta Mevcut</Badge>
        )}
      </div>

      {!isOutOfStock && (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-8">
          <div className="flex items-center justify-center border border-earth-200 rounded-xl overflow-hidden w-fit">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-10 h-10 flex items-center justify-center text-muted hover:text-foreground hover:bg-cream-100 transition-colors cursor-pointer"
            >
              −
            </button>
            <span className="w-12 text-center text-sm font-medium">{quantity}</span>
            <button
              onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
              className="w-10 h-10 flex items-center justify-center text-muted hover:text-foreground hover:bg-cream-100 transition-colors cursor-pointer"
            >
              +
            </button>
          </div>
          <Button size="lg" onClick={handleAddToCart} className="flex-1">
            Sepete Ekle
          </Button>
        </div>
      )}
    </>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { formatPrice, calculateDiscount, getPrimaryImage } from "@/lib/utils";
import { useCartStore } from "@/store/cart";
import Badge from "@/components/ui/Badge";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem, openCart } = useCartStore();
  const discount = calculateDiscount(product.price, product.compare_at_price);
  const imageUrl = getPrimaryImage(product.images);
  const isOutOfStock = product.stock_quantity <= 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isOutOfStock) {
      addItem(product);
      openCart();
    }
  };

  return (
    <Link
      href={`/urunler/${product.slug}`}
      className="group block"
      id={`product-${product.slug}`}
    >
      <div className="bg-card rounded-2xl overflow-hidden border border-border hover:border-primary-200 hover:shadow-card transition-all duration-300">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-earth-100">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {discount && (
              <Badge variant="discount" size="sm">
                %{discount} İndirim
              </Badge>
            )}
            {isOutOfStock && (
              <Badge variant="danger" size="sm">
                Tükendi
              </Badge>
            )}
            {product.is_featured && !isOutOfStock && !discount && (
              <Badge variant="success" size="sm">
                ⭐ Öne Çıkan
              </Badge>
            )}
          </div>

          {/* Quick Add Button */}
          {!isOutOfStock && (
            <button
              onClick={handleAddToCart}
              className="absolute bottom-3 right-3 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-xl shadow-md flex items-center justify-center text-primary-700 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:bg-primary-700 hover:text-white cursor-pointer"
              aria-label="Sepete ekle"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          {product.category && (
            <p className="text-[11px] text-muted font-medium uppercase tracking-wider mb-1">
              {product.category.name}
            </p>
          )}
          <h3 className="text-sm font-semibold text-foreground group-hover:text-primary-700 transition-colors line-clamp-2 mb-2">
            {product.name}
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-base font-bold text-primary-700">
              {formatPrice(product.price)}
            </span>
            {product.compare_at_price && product.compare_at_price > product.price && (
              <span className="text-xs text-muted line-through">
                {formatPrice(product.compare_at_price)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

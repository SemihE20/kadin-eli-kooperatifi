import ProductGrid from "@/components/product/ProductGrid";
import Link from "next/link";
import type { Product } from "@/types";

interface FeaturedProductsProps {
  products: Product[];
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  return (
    <section className="py-20 bg-cream-50 texture-linen" id="featured-products">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <span className="inline-block text-xs font-semibold text-primary-600 uppercase tracking-widest mb-2">
              Öne Çıkanlar
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
              En Beğenilen Ürünler
            </h2>
          </div>
          <Link
            href="/urunler"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-700 hover:text-primary-800 transition-colors group"
          >
            Tümünü Gör
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        {/* Products */}
        <ProductGrid products={products} columns={4} />
      </div>
    </section>
  );
}

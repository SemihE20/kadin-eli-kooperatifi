"use client";

import ProductGrid from "@/components/product/ProductGrid";
import Link from "next/link";
import type { Product } from "@/types";

// Demo products for initial showcase
const DEMO_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Doğal Çam Balı (850g)",
    slug: "dogal-cam-bali",
    description: "Uludağ eteklerinden toplanan saf çam balı",
    price: 450,
    compare_at_price: 520,
    category_id: "1",
    stock_quantity: 25,
    is_active: true,
    is_featured: true,
    weight: 850,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: { id: "1", name: "Gıda Ürünleri", slug: "gida", description: null, image_url: null, sort_order: 1, created_at: "" },
    images: [{ id: "1", product_id: "1", image_url: "/images/placeholder.jpg", alt_text: "Çam Balı", sort_order: 0, is_primary: true }],
  },
  {
    id: "2",
    name: "El Örgüsü Yün Şal",
    slug: "el-orgusu-yun-sal",
    description: "Doğal boyalı yünden el örgüsü şal",
    price: 320,
    compare_at_price: null,
    category_id: "2",
    stock_quantity: 10,
    is_active: true,
    is_featured: true,
    weight: 200,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: { id: "2", name: "El İşi Ürünler", slug: "el-isi", description: null, image_url: null, sort_order: 2, created_at: "" },
    images: [{ id: "2", product_id: "2", image_url: "/images/placeholder.jpg", alt_text: "Yün Şal", sort_order: 0, is_primary: true }],
  },
  {
    id: "3",
    name: "Lavanta Sabunu (3'lü Set)",
    slug: "lavanta-sabunu-set",
    description: "El yapımı doğal lavanta sabunu seti",
    price: 180,
    compare_at_price: 220,
    category_id: "3",
    stock_quantity: 30,
    is_active: true,
    is_featured: true,
    weight: 300,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: { id: "3", name: "Doğal Ürünler", slug: "dogal-urunler", description: null, image_url: null, sort_order: 3, created_at: "" },
    images: [{ id: "3", product_id: "3", image_url: "/images/placeholder.jpg", alt_text: "Lavanta Sabunu", sort_order: 0, is_primary: true }],
  },
  {
    id: "4",
    name: "Doğal Kurutulmuş Çiçek Buketi",
    slug: "kurutulmus-cicek-buketi",
    description: "Ev dekorasyonu için doğal kurutulmuş çiçek buketi",
    price: 250,
    compare_at_price: null,
    category_id: "4",
    stock_quantity: 8,
    is_active: true,
    is_featured: true,
    weight: 150,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: { id: "4", name: "Hediyelik Ürünler", slug: "hediyelik", description: null, image_url: null, sort_order: 4, created_at: "" },
    images: [{ id: "4", product_id: "4", image_url: "/images/placeholder.jpg", alt_text: "Çiçek Buketi", sort_order: 0, is_primary: true }],
  },
];

export default function FeaturedProducts() {
  return (
    <section className="py-20 bg-white" id="featured-products">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <span className="inline-block text-xs font-semibold text-primary-600 uppercase tracking-widest mb-2">
              Öne Çıkanlar
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
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
        <ProductGrid products={DEMO_PRODUCTS} columns={4} />
      </div>
    </section>
  );
}

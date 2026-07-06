"use client";

import { useState, useMemo } from "react";
import PageHeader from "@/components/layout/PageHeader";
import ProductGrid from "@/components/product/ProductGrid";
import type { Product } from "@/types";

const DEMO_PRODUCTS: Product[] = [
  {
    id: "1", name: "Doğal Çam Balı (850g)", slug: "dogal-cam-bali",
    description: "Uludağ eteklerinden toplanan saf çam balı. Hiçbir katkı maddesi içermez.",
    price: 450, compare_at_price: 520, category_id: "1", category: "gida",
    stock_quantity: 25, is_active: true, is_featured: true, is_seasonal: false,
    season_info: null, usage_info: "Kahvaltıda veya çaylara tatlandırıcı olarak kullanılır.", storage_info: "Serin ve kuru yerde saklayın.",
    weight: 850, image_url: "/images/placeholder.jpg", created_by: null,
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    category_rel: { id: "1", name: "Gıda Ürünleri", slug: "gida", description: null, image_url: null, sort_order: 1, created_at: "" },
    images: [{ id: "1", product_id: "1", image_url: "/images/placeholder.jpg", alt_text: "Çam Balı", sort_order: 0, is_primary: true }],
  },
  {
    id: "2", name: "Kekik Yağı (50ml)", slug: "kekik-yagi",
    description: "Doğal kekik yağı. Soğuk sıkım yöntemiyle elde edilmiştir.",
    price: 120, compare_at_price: null, category_id: "2", category: "bitki",
    stock_quantity: 40, is_active: true, is_featured: true, is_seasonal: false,
    season_info: null, usage_info: "Yemeklere aromaterapi amaçlı kullanılır.", storage_info: "Serin ve karanlık ortamda saklayın.",
    weight: 60, image_url: "/images/placeholder.jpg", created_by: null,
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    category_rel: { id: "2", name: "Tıbbi Bitkiler", slug: "bitki", description: null, image_url: null, sort_order: 2, created_at: "" },
    images: [{ id: "2", product_id: "2", image_url: "/images/placeholder.jpg", alt_text: "Kekik Yağı", sort_order: 0, is_primary: true }],
  },
  {
    id: "3", name: "Lavanta Sabunu (3'lü Set)", slug: "lavanta-sabunu-set",
    description: "El yapımı doğal lavanta sabunu seti. Cildinize doğanın armağanı.",
    price: 180, compare_at_price: 220, category_id: "3", category: "bitki",
    stock_quantity: 30, is_active: true, is_featured: false, is_seasonal: false,
    season_info: null, usage_info: null, storage_info: null,
    weight: 300, image_url: "/images/placeholder.jpg", created_by: null,
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    category_rel: { id: "3", name: "Tıbbi Bitkiler", slug: "bitki", description: null, image_url: null, sort_order: 2, created_at: "" },
    images: [{ id: "3", product_id: "3", image_url: "/images/placeholder.jpg", alt_text: "Lavanta Sabunu", sort_order: 0, is_primary: true }],
  },
  {
    id: "4", name: "Ev Yapımı Domates Sosu (720ml)", slug: "ev-yapimi-domates-sosu",
    description: "Taze domateslerden hazırlanan katkısız domates sosu.",
    price: 120, compare_at_price: null, category_id: "1", category: "gida",
    stock_quantity: 50, is_active: true, is_featured: false, is_seasonal: true,
    season_info: "Ağustos - Ekim", usage_info: "Makarna, pizza ve yemeklerde kullanılır.", storage_info: "Açıldıktan sonra buzdolabında saklayın.",
    weight: 720, image_url: "/images/placeholder.jpg", created_by: null,
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    category_rel: { id: "1", name: "Gıda Ürünleri", slug: "gida", description: null, image_url: null, sort_order: 1, created_at: "" },
    images: [{ id: "4", product_id: "4", image_url: "/images/placeholder.jpg", alt_text: "Domates Sosu", sort_order: 0, is_primary: true }],
  },
  {
    id: "5", name: "Zeytin Fidanı", slug: "zeytin-fidani",
    description: "3 yaşında, sertifikalı zeytin fidanı. Gemlik çeşidi.",
    price: 250, compare_at_price: null, category_id: "5", category: "fidan",
    stock_quantity: 15, is_active: true, is_featured: true, is_seasonal: true,
    season_info: "Şubat - Nisan", usage_info: "Bahçe veya tarla dikimi için uygundur.", storage_info: "Dikim zamanına kadar köklerini nemli tutun.",
    weight: 2000, image_url: "/images/placeholder.jpg", created_by: null,
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    category_rel: { id: "5", name: "Fidan & Tohum", slug: "fidan", description: null, image_url: null, sort_order: 3, created_at: "" },
    images: [{ id: "5", product_id: "5", image_url: "/images/placeholder.jpg", alt_text: "Zeytin Fidanı", sort_order: 0, is_primary: true }],
  },
  {
    id: "6", name: "Defne Yaprağı (100g)", slug: "defne-yapragi",
    description: "El toplama doğal defne yaprağı. Yemek ve çay yapımında kullanılır.",
    price: 45, compare_at_price: null, category_id: "2", category: "bitki",
    stock_quantity: 60, is_active: true, is_featured: false, is_seasonal: false,
    season_info: null, usage_info: "Yemeklerde baharat, çay yapımında kullanılır.", storage_info: "Kuru ve serin ortamda saklayın.",
    weight: 100, image_url: "/images/placeholder.jpg", created_by: null,
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    category_rel: { id: "2", name: "Tıbbi Bitkiler", slug: "bitki", description: null, image_url: null, sort_order: 2, created_at: "" },
    images: [{ id: "6", product_id: "6", image_url: "/images/placeholder.jpg", alt_text: "Defne Yaprağı", sort_order: 0, is_primary: true }],
  },
  {
    id: "7", name: "Ev Yapımı Erişte (500g)", slug: "ev-yapimi-eriste",
    description: "Geleneksel yöntemlerle hazırlanan ev yapımı erişte.",
    price: 85, compare_at_price: null, category_id: "1", category: "gida",
    stock_quantity: 35, is_active: true, is_featured: false, is_seasonal: false,
    season_info: null, usage_info: null, storage_info: "Kuru ve serin yerde saklayın.",
    weight: 500, image_url: "/images/placeholder.jpg", created_by: null,
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    category_rel: { id: "1", name: "Gıda Ürünleri", slug: "gida", description: null, image_url: null, sort_order: 1, created_at: "" },
    images: [{ id: "7", product_id: "7", image_url: "/images/placeholder.jpg", alt_text: "Erişte", sort_order: 0, is_primary: true }],
  },
  {
    id: "8", name: "Limon Fidanı", slug: "limon-fidani",
    description: "Meyer limon fidanı. Saksıda da yetişebilir.",
    price: 180, compare_at_price: 220, category_id: "5", category: "fidan",
    stock_quantity: 8, is_active: true, is_featured: false, is_seasonal: true,
    season_info: "Mart - Mayıs", usage_info: "Saksı veya bahçeye dikilir.", storage_info: "Dondan koruyun.",
    weight: 1500, image_url: "/images/placeholder.jpg", created_by: null,
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    category_rel: { id: "5", name: "Fidan & Tohum", slug: "fidan", description: null, image_url: null, sort_order: 3, created_at: "" },
    images: [{ id: "8", product_id: "8", image_url: "/images/placeholder.jpg", alt_text: "Limon Fidanı", sort_order: 0, is_primary: true }],
  },
];

const CATEGORY_FILTERS = [
  { label: "Tümü", value: "all" },
  { label: "🌿 Tıbbi Bitkiler", value: "bitki" },
  { label: "🫙 Gıda Ürünleri", value: "gida" },
  { label: "🌱 Fidan & Tohum", value: "fidan" },
];

export default function ProductsPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = useMemo(() => {
    return DEMO_PRODUCTS.filter((product) => {
      const matchesCategory = activeCategory === "all" || product.category === activeCategory;
      const matchesSearch =
        searchQuery === "" ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <>
      <PageHeader
        title="Ürünlerimiz"
        description="El emeği ile üretilen doğal ve sağlıklı ürünlerimizi keşfedin."
        breadcrumbs={[
          { label: "Ana Sayfa", href: "/" },
          { label: "Ürünler" },
        ]}
      />

      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 p-4 bg-card rounded-2xl border border-earth-200">
            {/* Categories */}
            <div className="flex flex-wrap items-center gap-2">
              {CATEGORY_FILTERS.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setActiveCategory(cat.value)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                    activeCategory === cat.value
                      ? "bg-primary-700 text-white"
                      : "text-muted hover:text-foreground hover:bg-cream-100"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-64">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Ürün ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-earth-200 bg-white placeholder:text-muted hover:border-earth-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Result count */}
          <p className="text-xs text-muted mb-4">{filteredProducts.length} ürün bulundu</p>

          {/* Product Grid */}
          <ProductGrid products={filteredProducts} columns={4} />
        </div>
      </section>
    </>
  );
}

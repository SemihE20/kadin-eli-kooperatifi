"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import ProductGrid from "@/components/product/ProductGrid";
import { formatPrice, isInSeasonNow } from "@/lib/utils";
import type { Product } from "@/types";

interface ProductsClientProps {
  products: Product[];
}

const CATEGORY_FILTERS = [
  { label: "Tümü", value: "all" },
  { label: "🌿 Tıbbi Bitkiler", value: "bitki" },
  { label: "🫙 Gıda Ürünleri", value: "gida" },
  { label: "🌱 Fidan & Tohum", value: "fidan" },
];

const SEASON_FILTERS = [
  { label: "Tümü", value: "all" },
  { label: "🌸 Mevsimlik Ürünler", value: "seasonal" },
  { label: "🌱 Bu Ay Ekime Uygun", value: "in-season" },
] as const;

type SeasonFilter = (typeof SEASON_FILTERS)[number]["value"];

export default function ProductsClient({ products }: ProductsClientProps) {
  const searchParams = useSearchParams();
  const categoryFromUrl = searchParams.get("kategori");

  const [activeCategory, setActiveCategory] = useState(categoryFromUrl || "all");
  const [searchQuery, setSearchQuery] = useState("");
  const [seasonFilter, setSeasonFilter] = useState<SeasonFilter>("all");
  const [minPriceInput, setMinPriceInput] = useState("");
  const [maxPriceInput, setMaxPriceInput] = useState("");
  const [showFilters, setShowFilters] = useState(Boolean(categoryFromUrl));

  const priceBounds = useMemo(() => {
    if (products.length === 0) return { min: 0, max: 1000 };
    const prices = products.map((p) => p.price);
    return { min: Math.floor(Math.min(...prices)), max: Math.ceil(Math.max(...prices)) };
  }, [products]);

  const minPrice = minPriceInput === "" ? priceBounds.min : Number(minPriceInput);
  const maxPrice = maxPriceInput === "" ? priceBounds.max : Number(maxPriceInput);

  const filtersActive =
    activeCategory !== "all" || searchQuery !== "" || seasonFilter !== "all" ||
    minPriceInput !== "" || maxPriceInput !== "";

  const activeFilterCount =
    (activeCategory !== "all" ? 1 : 0) +
    (seasonFilter !== "all" ? 1 : 0) +
    (minPriceInput !== "" || maxPriceInput !== "" ? 1 : 0);

  function resetFilters() {
    setActiveCategory("all");
    setSearchQuery("");
    setSeasonFilter("all");
    setMinPriceInput("");
    setMaxPriceInput("");
  }

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return products.filter((product) => {
      const matchesCategory = activeCategory === "all" || product.category === activeCategory;
      const matchesSearch =
        q === "" ||
        product.name.toLowerCase().includes(q) ||
        (product.description ?? "").toLowerCase().includes(q);
      const matchesPrice = product.price >= minPrice && product.price <= maxPrice;
      const matchesSeason =
        seasonFilter === "all" ||
        (seasonFilter === "seasonal" && product.is_seasonal) ||
        (seasonFilter === "in-season" && isInSeasonNow(product.season_info));
      return matchesCategory && matchesSearch && matchesPrice && matchesSeason;
    });
  }, [products, activeCategory, searchQuery, minPrice, maxPrice, seasonFilter]);

  return (
    <>
      {/* Filter Bar */}
      <div className="mb-8 p-4 bg-card rounded-2xl border border-earth-200">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          {/* Search */}
          <div className="relative flex-1">
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

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters((v) => !v)}
            aria-expanded={showFilters}
            className={`relative flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border transition-colors cursor-pointer shrink-0 ${
              showFilters
                ? "bg-primary-700 text-white border-primary-700"
                : "bg-white text-foreground border-earth-200 hover:border-earth-300"
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3.792 2.938A49.069 49.069 0 0112 2.25c2.797 0 5.54.236 8.209.688a1.857 1.857 0 011.541 1.836v1.044a3 3 0 01-.879 2.121l-6.182 6.182a1.5 1.5 0 00-.439 1.061v2.927a3 3 0 01-1.658 2.684l-1.757.878A.75.75 0 019.75 21v-6.828a1.5 1.5 0 00-.44-1.06L3.13 6.929a3 3 0 01-.879-2.121V3.764c0-.897.64-1.683 1.541-1.836z"
              />
            </svg>
            Filtrele
            {activeFilterCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* Collapsible Filters */}
        <div
          className={`grid transition-all duration-300 ease-in-out ${
            showFilters ? "grid-rows-[1fr] opacity-100 mt-4" : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            <div className="flex flex-col gap-4 pt-4 border-t border-earth-100">
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

              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                {/* Price Range */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted shrink-0">Fiyat:</span>
                  <input
                    type="number"
                    inputMode="numeric"
                    min={priceBounds.min}
                    max={priceBounds.max}
                    placeholder={String(priceBounds.min)}
                    value={minPriceInput}
                    onChange={(e) => setMinPriceInput(e.target.value)}
                    className="w-20 sm:w-24 px-2 py-1.5 text-xs rounded-lg border border-earth-200 bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none"
                  />
                  <span className="text-xs text-muted">—</span>
                  <input
                    type="number"
                    inputMode="numeric"
                    min={priceBounds.min}
                    max={priceBounds.max}
                    placeholder={String(priceBounds.max)}
                    value={maxPriceInput}
                    onChange={(e) => setMaxPriceInput(e.target.value)}
                    className="w-20 sm:w-24 px-2 py-1.5 text-xs rounded-lg border border-earth-200 bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none"
                  />
                  <span className="text-[11px] text-muted hidden sm:inline">
                    ({formatPrice(priceBounds.min)} – {formatPrice(priceBounds.max)})
                  </span>
                </div>

                {/* Seasonality */}
                <div className="flex flex-wrap items-center gap-2 sm:ml-2">
                  {SEASON_FILTERS.map((s) => (
                    <button
                      key={s.value}
                      onClick={() => setSeasonFilter(s.value)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                        seasonFilter === s.value
                          ? "bg-primary-700 text-white"
                          : "text-muted hover:text-foreground hover:bg-cream-100"
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>

                {filtersActive && (
                  <button
                    onClick={resetFilters}
                    className="text-xs text-primary-700 font-medium hover:text-primary-800 cursor-pointer sm:ml-auto"
                  >
                    Filtreleri Sıfırla ✕
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Result count */}
      <p className="text-xs text-muted mb-4">{filteredProducts.length} ürün bulundu</p>

      {/* Product Grid */}
      <ProductGrid products={filteredProducts} columns={4} />
    </>
  );
}

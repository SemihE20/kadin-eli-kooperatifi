import type { Metadata } from "next";
import Link from "next/link";
import ProductGrid from "@/components/product/ProductGrid";
import type { Product } from "@/types";

export const metadata: Metadata = {
  title: "Ürünler",
  description: "Gözler Kadıneli Kooperatifi el yapımı ürünleri. Doğal gıda, el işi, doğal ürünler ve hediyelik çeşitleri.",
};

// Demo products - will be replaced with Supabase query
const DEMO_PRODUCTS: Product[] = [
  {
    id: "1", name: "Doğal Çam Balı (850g)", slug: "dogal-cam-bali",
    description: "Uludağ eteklerinden toplanan saf çam balı. Hiçbir katkı maddesi içermez.",
    price: 450, compare_at_price: 520, category_id: "1", stock_quantity: 25,
    is_active: true, is_featured: true, weight: 850,
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    category: { id: "1", name: "Gıda Ürünleri", slug: "gida", description: null, image_url: null, sort_order: 1, created_at: "" },
    images: [{ id: "1", product_id: "1", image_url: "/images/placeholder.jpg", alt_text: "Çam Balı", sort_order: 0, is_primary: true }],
  },
  {
    id: "2", name: "El Örgüsü Yün Şal", slug: "el-orgusu-yun-sal",
    description: "Doğal boyalı yünden el örgüsü şal. Her biri benzersiz desenlere sahiptir.",
    price: 320, compare_at_price: null, category_id: "2", stock_quantity: 10,
    is_active: true, is_featured: true, weight: 200,
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    category: { id: "2", name: "El İşi Ürünler", slug: "el-isi", description: null, image_url: null, sort_order: 2, created_at: "" },
    images: [{ id: "2", product_id: "2", image_url: "/images/placeholder.jpg", alt_text: "Yün Şal", sort_order: 0, is_primary: true }],
  },
  {
    id: "3", name: "Lavanta Sabunu (3'lü Set)", slug: "lavanta-sabunu-set",
    description: "El yapımı doğal lavanta sabunu seti. Cildinize doğanın armağanı.",
    price: 180, compare_at_price: 220, category_id: "3", stock_quantity: 30,
    is_active: true, is_featured: false, weight: 300,
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    category: { id: "3", name: "Doğal Ürünler", slug: "dogal-urunler", description: null, image_url: null, sort_order: 3, created_at: "" },
    images: [{ id: "3", product_id: "3", image_url: "/images/placeholder.jpg", alt_text: "Lavanta Sabunu", sort_order: 0, is_primary: true }],
  },
  {
    id: "4", name: "Doğal Kurutulmuş Çiçek Buketi", slug: "kurutulmus-cicek-buketi",
    description: "Ev dekorasyonu için doğal kurutulmuş çiçek buketi.",
    price: 250, compare_at_price: null, category_id: "4", stock_quantity: 8,
    is_active: true, is_featured: true, weight: 150,
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    category: { id: "4", name: "Hediyelik Ürünler", slug: "hediyelik", description: null, image_url: null, sort_order: 4, created_at: "" },
    images: [{ id: "4", product_id: "4", image_url: "/images/placeholder.jpg", alt_text: "Çiçek Buketi", sort_order: 0, is_primary: true }],
  },
  {
    id: "5", name: "Ev Yapımı Domates Sosu (720ml)", slug: "ev-yapimi-domates-sosu",
    description: "Taze domateslerden hazırlanan katkısız domates sosu.",
    price: 120, compare_at_price: null, category_id: "1", stock_quantity: 50,
    is_active: true, is_featured: false, weight: 720,
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    category: { id: "1", name: "Gıda Ürünleri", slug: "gida", description: null, image_url: null, sort_order: 1, created_at: "" },
    images: [{ id: "5", product_id: "5", image_url: "/images/placeholder.jpg", alt_text: "Domates Sosu", sort_order: 0, is_primary: true }],
  },
  {
    id: "6", name: "El Yapımı Seramik Kase", slug: "el-yapimi-seramik-kase",
    description: "El yapımı dekoratif seramik kase. Mutfağınıza şıklık katın.",
    price: 280, compare_at_price: 350, category_id: "2", stock_quantity: 5,
    is_active: true, is_featured: false, weight: 400,
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    category: { id: "2", name: "El İşi Ürünler", slug: "el-isi", description: null, image_url: null, sort_order: 2, created_at: "" },
    images: [{ id: "6", product_id: "6", image_url: "/images/placeholder.jpg", alt_text: "Seramik Kase", sort_order: 0, is_primary: true }],
  },
  {
    id: "7", name: "Balmumu Mum Seti", slug: "balmumu-mum-seti",
    description: "Doğal balmumundan üretilmiş dekoratif mum seti.",
    price: 195, compare_at_price: null, category_id: "4", stock_quantity: 15,
    is_active: true, is_featured: false, weight: 250,
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    category: { id: "4", name: "Hediyelik Ürünler", slug: "hediyelik", description: null, image_url: null, sort_order: 4, created_at: "" },
    images: [{ id: "7", product_id: "7", image_url: "/images/placeholder.jpg", alt_text: "Balmumu Mum", sort_order: 0, is_primary: true }],
  },
  {
    id: "8", name: "Defne Yaprağı Sabunu", slug: "defne-yapragi-sabunu",
    description: "Geleneksel yöntemlerle üretilen doğal defne yaprağı sabunu.",
    price: 85, compare_at_price: null, category_id: "3", stock_quantity: 40,
    is_active: true, is_featured: false, weight: 150,
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    category: { id: "3", name: "Doğal Ürünler", slug: "dogal-urunler", description: null, image_url: null, sort_order: 3, created_at: "" },
    images: [{ id: "8", product_id: "8", image_url: "/images/placeholder.jpg", alt_text: "Defne Sabunu", sort_order: 0, is_primary: true }],
  },
];

export default function ProductsPage() {
  return (
    <>
      {/* Page Header */}
      <section className="pt-28 pb-10 gradient-hero relative">
        <div className="absolute inset-0 pattern-dots opacity-10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-primary-200 mb-4">
            <Link href="/" className="hover:text-white transition-colors">Ana Sayfa</Link>
            <span>/</span>
            <span className="text-white">Ürünler</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Ürünlerimiz</h1>
          <p className="text-sm text-primary-100/80 max-w-lg">
            El emeği ile üretilen doğal ve sağlıklı ürünlerimizi keşfedin.
          </p>
        </div>
        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 40" className="w-full h-[30px] fill-background" preserveAspectRatio="none">
            <path d="M0,20 C480,40 960,0 1440,25 L1440,40 L0,40 Z" />
          </svg>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8 p-4 bg-white rounded-2xl border border-border">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium text-muted mr-1">Kategori:</span>
              {["Tümü", "Gıda", "El İşi", "Doğal Ürünler", "Hediyelik"].map((cat) => (
                <button
                  key={cat}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                    cat === "Tümü"
                      ? "bg-primary-700 text-white"
                      : "text-muted hover:text-foreground hover:bg-earth-50"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted">{DEMO_PRODUCTS.length} ürün</span>
            </div>
          </div>

          {/* Product Grid */}
          <ProductGrid products={DEMO_PRODUCTS} columns={4} />
        </div>
      </section>
    </>
  );
}

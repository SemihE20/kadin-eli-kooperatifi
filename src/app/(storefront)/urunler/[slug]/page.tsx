"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import PageHeader from "@/components/layout/PageHeader";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { useCartStore } from "@/store/cart";
import { formatPrice, calculateDiscount } from "@/lib/utils";
import type { Product } from "@/types";

// Demo product data — will be replaced with Supabase query
const DEMO_PRODUCTS: Record<string, Product> = {
  "dogal-cam-bali": {
    id: "1", name: "Doğal Çam Balı (850g)", slug: "dogal-cam-bali",
    description: "Uludağ eteklerinden toplanan saf çam balı. Hiçbir katkı maddesi içermez. Kooperatifimizin en çok tercih edilen ürünlerinden biri olan çam balımız, doğal ortamında arılar tarafından üretilmiş ve hiçbir işlemden geçirilmeden sizlere ulaştırılmaktadır.\n\nÇam balı, antioksidan özellikleriyle bilinir ve bağışıklık sistemini destekler. Kahvaltılarda, tatlılarda veya sıcak içeceklerin içinde doğal tatlandırıcı olarak kullanılabilir.",
    price: 450, compare_at_price: 520, category_id: "1", category: "gida",
    stock_quantity: 25, is_active: true, is_featured: true, is_seasonal: false,
    season_info: null, usage_info: "Kahvaltıda ekmek üzerine sürerek, çaylara tatlandırıcı olarak veya tatlı yapımında kullanılabilir. Günde 1-2 yemek kaşığı tüketim önerilir.", storage_info: "Oda sıcaklığında, doğrudan güneş ışığından uzak, kuru bir yerde saklayın. Buzdolabına koymayın, kristalleşebilir.",
    weight: 850, image_url: "/images/placeholder.jpg", created_by: null,
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    category_rel: { id: "1", name: "Gıda Ürünleri", slug: "gida", description: null, image_url: null, sort_order: 1, created_at: "" },
    images: [
      { id: "1", product_id: "1", image_url: "/images/placeholder.jpg", alt_text: "Çam Balı - Önden", sort_order: 0, is_primary: true },
      { id: "1b", product_id: "1", image_url: "/images/placeholder.jpg", alt_text: "Çam Balı - Yandan", sort_order: 1, is_primary: false },
    ],
  },
};

const DEMO_REVIEWS = [
  { id: "r1", user: "Ayşe Y.", rating: 5, comment: "Harika bir bal! Doğallığı hemen hissediliyor. Teşekkürler kooperatifimize.", date: "2024-03-15" },
  { id: "r2", user: "Mehmet K.", rating: 4, comment: "Çok lezzetli, kıvamı mükemmel. Sadece ambalajı biraz daha sağlam olabilirdi.", date: "2024-02-20" },
  { id: "r3", user: "Fatma S.", rating: 5, comment: "Yıllardır aradığım doğal bal. Katkısız olduğu tadından belli. Herkese tavsiye ederim.", date: "2024-01-10" },
];

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const product = DEMO_PRODUCTS[slug];
  const { addItem, openCart } = useCartStore();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"description" | "usage" | "storage">("description");

  if (!product) {
    return (
      <>
        <PageHeader title="Ürün Bulunamadı" breadcrumbs={[{ label: "Ana Sayfa", href: "/" }, { label: "Ürünler", href: "/urunler" }, { label: "Bulunamadı" }]} />
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 bg-earth-100 rounded-full flex items-center justify-center mb-4">
            <span className="text-3xl">🔍</span>
          </div>
          <h2 className="font-heading text-lg font-semibold text-foreground mb-2">Ürün bulunamadı</h2>
          <p className="text-sm text-muted mb-6">Aradığınız ürün mevcut değil veya kaldırılmış olabilir.</p>
          <Link href="/urunler"><Button>Ürünlere Dön</Button></Link>
        </div>
      </>
    );
  }

  const discount = calculateDiscount(product.price, product.compare_at_price);
  const isOutOfStock = product.stock_quantity <= 0;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(product);
    }
    openCart();
  };

  return (
    <>
      <PageHeader
        title={product.name}
        breadcrumbs={[
          { label: "Ana Sayfa", href: "/" },
          { label: "Ürünler", href: "/urunler" },
          { label: product.name },
        ]}
      />

      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Image */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-cream-100 border border-earth-200">
              <Image
                src={product.image_url || "/images/placeholder.jpg"}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
              {discount && (
                <div className="absolute top-4 left-4">
                  <Badge variant="discount">%{discount} İndirim</Badge>
                </div>
              )}
              {product.is_seasonal && (
                <div className="absolute top-4 right-4">
                  <Badge variant="warning">🌸 Mevsimlik</Badge>
                </div>
              )}
            </div>

            {/* Info */}
            <div>
              {product.category_rel && (
                <span className="inline-block text-xs font-medium text-primary-600 uppercase tracking-wider mb-2">
                  {product.category_rel.name}
                </span>
              )}

              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground mb-4">
                {product.name}
              </h2>

              {/* Price */}
              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl font-bold text-primary-700">
                  {formatPrice(product.price)}
                </span>
                {product.compare_at_price && product.compare_at_price > product.price && (
                  <span className="text-base text-muted line-through">
                    {formatPrice(product.compare_at_price)}
                  </span>
                )}
              </div>

              {/* Season Info */}
              {product.is_seasonal && product.season_info && (
                <div className="mb-4 p-3 bg-cream-100 rounded-xl border border-earth-200">
                  <p className="text-xs font-medium text-earth-700">
                    🗓️ Mevsim: <span className="font-bold">{product.season_info}</span>
                  </p>
                </div>
              )}

              {/* Stock */}
              <div className="mb-6">
                {isOutOfStock ? (
                  <Badge variant="danger">Stokta Yok</Badge>
                ) : product.stock_quantity <= 5 ? (
                  <Badge variant="warning">Son {product.stock_quantity} adet!</Badge>
                ) : (
                  <Badge variant="success">Stokta Mevcut</Badge>
                )}
              </div>

              {/* Quantity & Add to Cart */}
              {!isOutOfStock && (
                <div className="flex items-center gap-4 mb-8">
                  <div className="flex items-center border border-earth-200 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 flex items-center justify-center text-muted hover:text-foreground hover:bg-cream-100 transition-colors cursor-pointer"
                    >−</button>
                    <span className="w-12 text-center text-sm font-medium">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                      className="w-10 h-10 flex items-center justify-center text-muted hover:text-foreground hover:bg-cream-100 transition-colors cursor-pointer"
                    >+</button>
                  </div>
                  <Button size="lg" onClick={handleAddToCart} className="flex-1">
                    Sepete Ekle
                  </Button>
                </div>
              )}

              {/* Tabs */}
              <div className="border-b border-earth-200 mb-4">
                <div className="flex gap-6">
                  {[
                    { key: "description" as const, label: "Açıklama" },
                    { key: "usage" as const, label: "Kullanım" },
                    { key: "storage" as const, label: "Saklama" },
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={`pb-3 text-sm font-medium transition-colors cursor-pointer ${
                        activeTab === tab.key
                          ? "text-primary-700 border-b-2 border-primary-700"
                          : "text-muted hover:text-foreground"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="text-sm text-muted leading-relaxed whitespace-pre-line">
                {activeTab === "description" && (product.description || "Açıklama bulunmuyor.")}
                {activeTab === "usage" && (product.usage_info || "Kullanım bilgisi bulunmuyor.")}
                {activeTab === "storage" && (product.storage_info || "Saklama bilgisi bulunmuyor.")}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-10 bg-cream-50 texture-paper">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="font-heading text-xl font-bold text-foreground mb-6">
            Müşteri Yorumları ({DEMO_REVIEWS.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {DEMO_REVIEWS.map((review) => (
              <div key={review.id} className="bg-card p-5 rounded-2xl border border-earth-200">
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className={`w-4 h-4 ${i < review.rating ? "text-amber-400" : "text-earth-200"}`} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-sm text-muted leading-relaxed mb-3">{review.comment}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-foreground">{review.user}</span>
                  <span className="text-[11px] text-muted">{review.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

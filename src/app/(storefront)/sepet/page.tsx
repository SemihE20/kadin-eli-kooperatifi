"use client";

import Link from "next/link";
import Image from "next/image";
import PageHeader from "@/components/layout/PageHeader";
import { useCartStore } from "@/store/cart";
import { formatPrice, calculateShipping, getPrimaryImage } from "@/lib/utils";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/constants";
import Button from "@/components/ui/Button";

export default function CartPage() {
  const { items, getSubtotal, updateQuantity, removeItem, clearCart } = useCartStore();
  const subtotal = getSubtotal();
  const shipping = calculateShipping(subtotal);
  const total = subtotal + shipping;

  return (
    <>
      <PageHeader
        title="Alışveriş Sepeti"
        breadcrumbs={[
          { label: "Ana Sayfa", href: "/" },
          { label: "Sepet" },
        ]}
      />

      {/* Cart Content */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-24 h-24 bg-earth-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-12 h-12 text-earth-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h2 className="font-heading text-lg font-semibold text-foreground mb-2">Sepetiniz boş</h2>
              <p className="text-sm text-muted mb-6">Hemen alışverişe başlayın!</p>
              <Link href="/urunler">
                <Button>Ürünlere Göz At</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {/* Table Header */}
                <div className="hidden sm:grid grid-cols-12 gap-4 px-4 py-2 text-xs font-medium text-muted uppercase tracking-wider">
                  <div className="col-span-6">Ürün</div>
                  <div className="col-span-2 text-center">Fiyat</div>
                  <div className="col-span-2 text-center">Adet</div>
                  <div className="col-span-2 text-right">Toplam</div>
                </div>

                {items.map((item) => (
                  <div
                    key={item.product.id}
                    className="grid grid-cols-12 gap-4 items-center p-4 bg-white rounded-xl border border-border hover:shadow-soft transition-all"
                  >
                    {/* Product Info */}
                    <div className="col-span-12 sm:col-span-6 flex items-center gap-4">
                      <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-earth-100 shrink-0">
                        <Image
                          src={getPrimaryImage(item.product.images)}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <Link href={`/urunler/${item.product.slug}`} className="text-sm font-medium text-foreground hover:text-primary-700 transition-colors line-clamp-2">
                          {item.product.name}
                        </Link>
                        {item.product.category_rel?.name && (
                          <p className="text-[11px] text-muted mt-0.5">{item.product.category_rel.name}</p>
                        )}
                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="text-xs text-red-500 hover:text-red-600 mt-1 sm:hidden cursor-pointer"
                        >
                          Kaldır
                        </button>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="hidden sm:flex col-span-2 justify-center">
                      <span className="text-sm font-medium">{formatPrice(item.product.price)}</span>
                    </div>

                    {/* Quantity */}
                    <div className="col-span-6 sm:col-span-2 flex justify-center">
                      <div className="flex items-center border border-border rounded-lg overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center text-muted hover:text-foreground hover:bg-earth-50 transition-colors cursor-pointer"
                        >
                          −
                        </button>
                        <span className="w-10 text-center text-sm font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center text-muted hover:text-foreground hover:bg-earth-50 transition-colors cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Total */}
                    <div className="col-span-6 sm:col-span-2 flex items-center justify-end gap-2">
                      <span className="text-sm font-semibold text-primary-700">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="hidden sm:flex p-1.5 text-muted hover:text-red-500 transition-colors cursor-pointer"
                        aria-label="Kaldır"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}

                {/* Clear Cart */}
                <div className="flex justify-end">
                  <button
                    onClick={clearCart}
                    className="text-xs text-muted hover:text-red-500 transition-colors cursor-pointer"
                  >
                    Sepeti Temizle
                  </button>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 bg-white rounded-2xl border border-border p-6">
                  <h3 className="font-heading text-base font-semibold text-foreground mb-4">Sipariş Özeti</h3>

                  {/* Free shipping progress */}
                  {subtotal < FREE_SHIPPING_THRESHOLD && (
                    <div className="mb-4 p-3 bg-primary-50 rounded-xl">
                      <p className="text-xs text-primary-700 font-medium mb-1.5">
                        🚚 Ücretsiz kargoya{" "}
                        <span className="font-bold">{formatPrice(FREE_SHIPPING_THRESHOLD - subtotal)}</span> kaldı!
                      </p>
                      <div className="w-full h-1.5 bg-primary-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary-500 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-3 mb-6">
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
                    <div className="border-t border-border pt-3 flex justify-between text-base font-semibold">
                      <span>Toplam</span>
                      <span className="text-primary-700">{formatPrice(total)}</span>
                    </div>
                  </div>

                  <Link href="/siparis">
                    <Button fullWidth size="lg">
                      Siparişi Tamamla
                    </Button>
                  </Link>

                  <Link
                    href="/urunler"
                    className="block text-center text-xs text-muted hover:text-primary-700 transition-colors mt-3"
                  >
                    Alışverişe Devam Et
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

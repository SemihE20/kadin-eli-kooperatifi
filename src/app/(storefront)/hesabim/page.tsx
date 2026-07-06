"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import PageHeader from "@/components/layout/PageHeader";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Badge from "@/components/ui/Badge";
import { formatPrice, formatDate } from "@/lib/utils";
import type { OrderStatus } from "@/types";

type AccountTab = "profil" | "siparisler" | "favoriler" | "sifre";

const DEMO_ORDERS = [
  {
    id: "o1",
    order_number: "GK250615-1234",
    date: "2025-06-15T10:30:00Z",
    status: "teslim_edildi" as OrderStatus,
    total: 625,
    items: [
      { name: "Doğal Çam Balı (850g)", quantity: 1, price: 450 },
      { name: "Kekik Yağı (50ml)", quantity: 1, price: 120 },
      { name: "Defne Yaprağı (100g)", quantity: 1, price: 55 },
    ],
  },
  {
    id: "o2",
    order_number: "GK250520-5678",
    date: "2025-05-20T14:00:00Z",
    status: "kargoda" as OrderStatus,
    total: 330,
    items: [
      { name: "Lavanta Sabunu (3'lü Set)", quantity: 1, price: 180 },
      { name: "Ev Yapımı Erişte (500g)", quantity: 1, price: 85 },
      { name: "Defne Yaprağı (100g)", quantity: 1, price: 45 },
    ],
  },
  {
    id: "o3",
    order_number: "GK250410-9012",
    date: "2025-04-10T09:15:00Z",
    status: "teslim_edildi" as OrderStatus,
    total: 250,
    items: [
      { name: "Zeytin Fidanı", quantity: 1, price: 250 },
    ],
  },
];

const DEMO_FAVORITES = [
  { id: "1", name: "Doğal Çam Balı (850g)", price: 450, slug: "dogal-cam-bali", image: "/images/placeholder.jpg" },
  { id: "3", name: "Lavanta Sabunu (3'lü Set)", price: 180, slug: "lavanta-sabunu-set", image: "/images/placeholder.jpg" },
  { id: "5", name: "Zeytin Fidanı", price: 250, slug: "zeytin-fidani", image: "/images/placeholder.jpg" },
];

const STATUS_CONFIG: Record<OrderStatus, { label: string; variant: "success" | "warning" | "danger" | "default" | "discount" }> = {
  beklemede: { label: "Beklemede", variant: "warning" },
  onaylandi: { label: "Onaylandı", variant: "default" },
  kargoda: { label: "Kargoda", variant: "warning" },
  teslim_edildi: { label: "Teslim Edildi", variant: "success" },
  iptal: { label: "İptal Edildi", variant: "danger" },
};

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState<AccountTab>("profil");
  const [profileForm, setProfileForm] = useState({
    fullName: "Ayşe Yılmaz",
    email: "ayse@ornek.com",
    phone: "05551234567",
    city: "Bursa",
    district: "Mudanya",
    address: "Gözler Mahallesi, Örnek Sok. No:12",
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  };

  const TABS: { key: AccountTab; label: string; icon: string }[] = [
    { key: "profil", label: "Profilim", icon: "👤" },
    { key: "siparisler", label: "Siparişlerim", icon: "📦" },
    { key: "favoriler", label: "Favorilerim", icon: "❤️" },
    { key: "sifre", label: "Şifre", icon: "🔒" },
  ];

  return (
    <>
      <PageHeader
        title="Hesabım"
        description="Profil bilgilerinizi ve siparişlerinizi yönetin."
        breadcrumbs={[
          { label: "Ana Sayfa", href: "/" },
          { label: "Hesabım" },
        ]}
      />

      <section className="py-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <aside className="lg:col-span-1">
              <div className="bg-card rounded-2xl border border-earth-200 p-5 mb-4">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-3">
                    <span className="text-2xl">👤</span>
                  </div>
                  <p className="font-heading text-sm font-bold text-foreground">{profileForm.fullName}</p>
                  <p className="text-xs text-muted mt-0.5">{profileForm.email}</p>
                </div>
              </div>

              <nav className="bg-card rounded-2xl border border-earth-200 overflow-hidden">
                {TABS.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors cursor-pointer text-left ${
                      activeTab === tab.key
                        ? "bg-primary-50 text-primary-700 font-medium border-l-2 border-primary-700"
                        : "text-muted hover:text-foreground hover:bg-cream-50"
                    }`}
                  >
                    <span>{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
                <button className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors cursor-pointer text-left border-t border-earth-200">
                  <span>🚪</span>
                  Çıkış Yap
                </button>
              </nav>
            </aside>

            {/* Content */}
            <div className="lg:col-span-3">
              {/* Profile Tab */}
              {activeTab === "profil" && (
                <div className="bg-card rounded-2xl border border-earth-200 p-6">
                  <h2 className="font-heading text-lg font-bold text-foreground mb-6">Profil Bilgileri</h2>
                  <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input label="Ad Soyad" name="fullName" value={profileForm.fullName} onChange={handleProfileChange} />
                      <Input label="E-posta" name="email" type="email" value={profileForm.email} onChange={handleProfileChange} />
                      <Input label="Telefon" name="phone" type="tel" value={profileForm.phone} onChange={handleProfileChange} />
                      <Input label="İl" name="city" value={profileForm.city} onChange={handleProfileChange} />
                      <Input label="İlçe" name="district" value={profileForm.district} onChange={handleProfileChange} />
                      <div className="sm:col-span-2">
                        <label className="text-sm font-medium text-foreground block mb-1.5">Adres</label>
                        <textarea
                          name="address"
                          rows={2}
                          value={profileForm.address}
                          onChange={handleProfileChange}
                          className="w-full px-4 py-2.5 rounded-xl border border-earth-200 text-sm bg-white placeholder:text-muted hover:border-primary-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-all resize-none"
                        />
                      </div>
                    </div>
                    <div className="pt-2">
                      <Button type="submit">Kaydet</Button>
                    </div>
                  </form>
                </div>
              )}

              {/* Orders Tab */}
              {activeTab === "siparisler" && (
                <div className="space-y-4">
                  <h2 className="font-heading text-lg font-bold text-foreground">Sipariş Geçmişim</h2>
                  {DEMO_ORDERS.map((order) => (
                    <div key={order.id} className="bg-card rounded-2xl border border-earth-200 overflow-hidden">
                      <div
                        className="flex items-center justify-between p-5 cursor-pointer hover:bg-cream-50 transition-colors"
                        onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                      >
                        <div className="flex items-center gap-4">
                          <div>
                            <p className="text-sm font-semibold text-foreground">{order.order_number}</p>
                            <p className="text-xs text-muted">{formatDate(order.date)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant={STATUS_CONFIG[order.status].variant}>
                            {STATUS_CONFIG[order.status].label}
                          </Badge>
                          <span className="text-sm font-bold text-primary-700">{formatPrice(order.total)}</span>
                          <svg
                            className={`w-4 h-4 text-muted transition-transform ${expandedOrder === order.id ? "rotate-180" : ""}`}
                            fill="none" stroke="currentColor" viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>

                      {expandedOrder === order.id && (
                        <div className="border-t border-earth-200 p-5">
                          <div className="space-y-2">
                            {order.items.map((item, i) => (
                              <div key={i} className="flex justify-between text-sm">
                                <span className="text-muted">{item.name} × {item.quantity}</span>
                                <span className="font-medium">{formatPrice(item.price)}</span>
                              </div>
                            ))}
                          </div>
                          <div className="border-t border-earth-100 mt-3 pt-3 flex justify-between text-sm font-bold">
                            <span>Toplam</span>
                            <span className="text-primary-700">{formatPrice(order.total)}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Favorites Tab */}
              {activeTab === "favoriler" && (
                <div>
                  <h2 className="font-heading text-lg font-bold text-foreground mb-6">Favorilerim</h2>
                  {DEMO_FAVORITES.length === 0 ? (
                    <div className="text-center py-12 bg-card rounded-2xl border border-earth-200">
                      <span className="text-4xl mb-3 block">❤️</span>
                      <p className="text-sm text-muted">Henüz favori ürününüz yok.</p>
                      <Link href="/urunler" className="text-xs text-primary-700 font-medium hover:underline mt-2 block">Ürünleri Keşfet →</Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {DEMO_FAVORITES.map((fav) => (
                        <Link key={fav.id} href={`/urunler/${fav.slug}`} className="group bg-card rounded-2xl border border-earth-200 overflow-hidden hover:shadow-card transition-all">
                          <div className="relative h-36 bg-cream-100">
                            <Image src={fav.image} alt={fav.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                          </div>
                          <div className="p-3">
                            <p className="text-sm font-medium text-foreground line-clamp-2 mb-1">{fav.name}</p>
                            <p className="text-sm font-bold text-primary-700">{formatPrice(fav.price)}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Password Tab */}
              {activeTab === "sifre" && (
                <div className="bg-card rounded-2xl border border-earth-200 p-6">
                  <h2 className="font-heading text-lg font-bold text-foreground mb-6">Şifre Değiştir</h2>
                  <form className="space-y-4 max-w-sm" onSubmit={(e) => e.preventDefault()}>
                    <Input
                      label="Mevcut Şifre"
                      name="currentPassword"
                      type="password"
                      placeholder="••••••••"
                      value={passwordForm.currentPassword}
                      onChange={handlePasswordChange}
                    />
                    <Input
                      label="Yeni Şifre"
                      name="newPassword"
                      type="password"
                      placeholder="En az 6 karakter"
                      value={passwordForm.newPassword}
                      onChange={handlePasswordChange}
                    />
                    <Input
                      label="Yeni Şifre Tekrar"
                      name="confirmPassword"
                      type="password"
                      placeholder="Yeni şifrenizi tekrar girin"
                      value={passwordForm.confirmPassword}
                      onChange={handlePasswordChange}
                    />
                    <div className="pt-2">
                      <Button type="submit">Şifremi Güncelle</Button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

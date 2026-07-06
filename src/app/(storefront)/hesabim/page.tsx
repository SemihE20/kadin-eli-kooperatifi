"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import PageHeader from "@/components/layout/PageHeader";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Badge from "@/components/ui/Badge";
import { createClient } from "@/lib/supabase/client";
import { formatPrice, formatDate } from "@/lib/utils";
import type { OrderStatus } from "@/types";

type AccountTab = "profil" | "siparisler" | "favoriler" | "sifre";

interface OrderRow {
  id: string;
  order_number: string;
  status: OrderStatus;
  total: number;
  created_at: string;
  items: { quantity: number; unit_price: number; product: { name: string } | null }[];
}

const STATUS_CONFIG: Record<OrderStatus, { label: string; variant: "success" | "warning" | "danger" | "default" | "discount" }> = {
  beklemede: { label: "Beklemede", variant: "warning" },
  onaylandi: { label: "Onaylandı", variant: "default" },
  kargoda: { label: "Kargoda", variant: "warning" },
  teslim_edildi: { label: "Teslim Edildi", variant: "success" },
  iptal: { label: "İptal Edildi", variant: "danger" },
};

export default function AccountPage() {
  const router = useRouter();
  const supabase = createClient();

  const [activeTab, setActiveTab] = useState<AccountTab>("profil");
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [profileForm, setProfileForm] = useState({
    fullName: "",
    phone: "",
    city: "",
    district: "",
    address: "",
  });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState<string | null>(null);

  const [passwordForm, setPasswordForm] = useState({ newPassword: "", confirmPassword: "" });
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const fetchAccount = useCallback(async () => {
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    setUserId(user.id);
    setEmail(user.email ?? "");

    const [{ data: profile }, { data: orderData }] = await Promise.all([
      supabase.from("profiles").select("full_name, phone, address").eq("id", user.id).single(),
      supabase
        .from("orders")
        .select("id, order_number, status, total, created_at, items:order_items(quantity, unit_price, product:products(name))")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false }),
    ]);

    setProfileForm({
      fullName: profile?.full_name ?? "",
      phone: profile?.phone ?? "",
      city: profile?.address?.city ?? "",
      district: profile?.address?.district ?? "",
      address: profile?.address?.address ?? "",
    });
    setOrders((orderData as unknown as OrderRow[]) ?? []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchAccount();
  }, [fetchAccount]);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  };

  async function handleProfileSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!userId) return;
    setProfileSaving(true);
    setProfileMessage(null);

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: profileForm.fullName,
        phone: profileForm.phone,
        address: {
          full_name: profileForm.fullName,
          phone: profileForm.phone,
          city: profileForm.city,
          district: profileForm.district,
          address: profileForm.address,
        },
      })
      .eq("id", userId);

    setProfileMessage(error ? error.message : "Profil bilgileriniz güncellendi.");
    setProfileSaving(false);
  }

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPasswordError(null);
    setPasswordMessage(null);

    if (passwordForm.newPassword.length < 6) {
      setPasswordError("Şifre en az 6 karakter olmalı.");
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("Şifreler eşleşmiyor.");
      return;
    }

    setPasswordSaving(true);
    const { error } = await supabase.auth.updateUser({ password: passwordForm.newPassword });

    if (error) {
      setPasswordError(error.message);
    } else {
      setPasswordMessage("Şifreniz güncellendi.");
      setPasswordForm({ newPassword: "", confirmPassword: "" });
    }
    setPasswordSaving(false);
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

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
                  <p className="font-heading text-sm font-bold text-foreground">
                    {profileForm.fullName || "—"}
                  </p>
                  <p className="text-xs text-muted mt-0.5">{email}</p>
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
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors cursor-pointer text-left border-t border-earth-200"
                >
                  <span>🚪</span>
                  Çıkış Yap
                </button>
              </nav>
            </aside>

            {/* Content */}
            <div className="lg:col-span-3">
              {loading ? (
                <div className="bg-card rounded-2xl border border-earth-200 p-6 text-center text-sm text-muted">
                  Yükleniyor...
                </div>
              ) : (
                <>
                  {/* Profile Tab */}
                  {activeTab === "profil" && (
                    <div className="bg-card rounded-2xl border border-earth-200 p-6">
                      <h2 className="font-heading text-lg font-bold text-foreground mb-6">Profil Bilgileri</h2>
                      <form className="space-y-4" onSubmit={handleProfileSubmit}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <Input label="Ad Soyad" name="fullName" value={profileForm.fullName} onChange={handleProfileChange} />
                          <Input label="E-posta" name="email" type="email" value={email} disabled helperText="E-posta adresi değiştirilemez." />
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
                        {profileMessage && (
                          <p className="text-xs text-primary-700 bg-primary-50 rounded-xl px-3 py-2">{profileMessage}</p>
                        )}
                        <div className="pt-2">
                          <Button type="submit" isLoading={profileSaving}>Kaydet</Button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Orders Tab */}
                  {activeTab === "siparisler" && (
                    <div className="space-y-4">
                      <h2 className="font-heading text-lg font-bold text-foreground">Sipariş Geçmişim</h2>
                      {orders.length === 0 ? (
                        <div className="text-center py-12 bg-card rounded-2xl border border-earth-200">
                          <span className="text-4xl mb-3 block">📦</span>
                          <p className="text-sm text-muted">Henüz siparişiniz yok.</p>
                          <Link href="/urunler" className="text-xs text-primary-700 font-medium hover:underline mt-2 block">Ürünleri Keşfet →</Link>
                        </div>
                      ) : (
                        orders.map((order) => (
                          <div key={order.id} className="bg-card rounded-2xl border border-earth-200 overflow-hidden">
                            <div
                              className="flex items-center justify-between p-5 cursor-pointer hover:bg-cream-50 transition-colors"
                              onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                            >
                              <div className="flex items-center gap-4">
                                <div>
                                  <p className="text-sm font-semibold text-foreground">{order.order_number}</p>
                                  <p className="text-xs text-muted">{formatDate(order.created_at)}</p>
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
                                      <span className="text-muted">
                                        {item.product?.name ?? "Ürün"} × {item.quantity}
                                      </span>
                                      <span className="font-medium">{formatPrice(item.unit_price * item.quantity)}</span>
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
                        ))
                      )}
                    </div>
                  )}

                  {/* Favorites Tab */}
                  {activeTab === "favoriler" && (
                    <div>
                      <h2 className="font-heading text-lg font-bold text-foreground mb-6">Favorilerim</h2>
                      <div className="text-center py-12 bg-card rounded-2xl border border-earth-200">
                        <span className="text-4xl mb-3 block">❤️</span>
                        <p className="text-sm text-muted">Henüz favori ürününüz yok.</p>
                        <Link href="/urunler" className="text-xs text-primary-700 font-medium hover:underline mt-2 block">Ürünleri Keşfet →</Link>
                      </div>
                    </div>
                  )}

                  {/* Password Tab */}
                  {activeTab === "sifre" && (
                    <div className="bg-card rounded-2xl border border-earth-200 p-6">
                      <h2 className="font-heading text-lg font-bold text-foreground mb-6">Şifre Değiştir</h2>
                      <form className="space-y-4 max-w-sm" onSubmit={handlePasswordSubmit}>
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
                        {passwordError && (
                          <p className="text-xs text-red-600 bg-red-50 rounded-xl px-3 py-2">{passwordError}</p>
                        )}
                        {passwordMessage && (
                          <p className="text-xs text-primary-700 bg-primary-50 rounded-xl px-3 py-2">{passwordMessage}</p>
                        )}
                        <div className="pt-2">
                          <Button type="submit" isLoading={passwordSaving}>Şifremi Güncelle</Button>
                        </div>
                      </form>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

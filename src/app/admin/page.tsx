"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { formatPrice } from "@/lib/utils";

interface RecentOrder {
  id: string;
  order_number: string;
  total: number;
  status: string;
  created_at: string;
  shipping_address: { full_name?: string } | null;
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  beklemede: { label: "Beklemede", color: "bg-amber-100 text-amber-700" },
  onaylandi: { label: "Onaylandı", color: "bg-blue-100 text-blue-700" },
  kargoda: { label: "Kargoda", color: "bg-purple-100 text-purple-700" },
  teslim_edildi: { label: "Teslim Edildi", color: "bg-green-100 text-green-700" },
  iptal: { label: "İptal", color: "bg-red-100 text-red-700" },
};

const QUICK_LINKS = [
  { href: "/admin/urunler", label: "Yeni Ürün Ekle", icon: "➕", color: "bg-green-50 hover:bg-green-100 text-green-700 border-green-200" },
  { href: "/admin/siparisler", label: "Bekleyen Siparişler", icon: "⏳", color: "bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-200" },
  { href: "/admin/kullanicilar", label: "Kullanıcı Listesi", icon: "👥", color: "bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200" },
  { href: "/", label: "Mağazayı Görüntüle", icon: "🏪", color: "bg-primary-50 hover:bg-primary-100 text-primary-700 border-primary-200" },
];

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [orderCount, setOrderCount] = useState(0);
  const [monthlyRevenue, setMonthlyRevenue] = useState(0);
  const [activeProductCount, setActiveProductCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [newOrdersThisMonth, setNewOrdersThisMonth] = useState(0);
  const [newUsersThisMonth, setNewUsersThisMonth] = useState(0);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);

  const supabase = createClient();

  const fetchDashboard = useCallback(async () => {
    setLoading(true);

    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);
    const monthStartIso = monthStart.toISOString();

    const [
      { count: orders },
      { count: activeProducts },
      { count: users },
      { count: newUsers },
      { data: monthOrders },
      { data: recent },
    ] = await Promise.all([
      supabase.from("orders").select("*", { count: "exact", head: true }),
      supabase.from("products").select("*", { count: "exact", head: true }).eq("is_active", true),
      supabase.from("profiles").select("*", { count: "exact", head: true }),
      supabase.from("profiles").select("*", { count: "exact", head: true }).gte("created_at", monthStartIso),
      supabase.from("orders").select("total").gte("created_at", monthStartIso),
      supabase
        .from("orders")
        .select("id, order_number, total, status, created_at, shipping_address")
        .order("created_at", { ascending: false })
        .limit(5),
    ]);

    setOrderCount(orders ?? 0);
    setActiveProductCount(activeProducts ?? 0);
    setUserCount(users ?? 0);
    setNewUsersThisMonth(newUsers ?? 0);
    setNewOrdersThisMonth(monthOrders?.length ?? 0);
    setMonthlyRevenue((monthOrders ?? []).reduce((sum, o) => sum + Number(o.total), 0));
    setRecentOrders((recent as RecentOrder[]) ?? []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const STATS = [
    { label: "Toplam Sipariş", value: String(orderCount), icon: "📦", href: "/admin/siparisler" },
    { label: "Aylık Gelir", value: formatPrice(monthlyRevenue), icon: "💰", href: "/admin/siparisler" },
    { label: "Aktif Ürün", value: String(activeProductCount), icon: "🌿", href: "/admin/urunler" },
    { label: "Kayıtlı Kullanıcı", value: String(userCount), icon: "👥", href: "/admin/kullanicilar" },
  ];

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-0.5">Merhaba! İşte bugünkü özet.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{stat.icon}</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-0.5">{loading ? "…" : stat.value}</p>
            <p className="text-xs text-gray-500 group-hover:text-primary-600 transition-colors">{stat.label}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200">
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <h2 className="text-base font-bold text-gray-900">Son Siparişler</h2>
            <Link href="/admin/siparisler" className="text-xs text-primary-700 font-medium hover:underline">
              Tümünü Gör →
            </Link>
          </div>
          <div className="overflow-x-auto">
            {loading ? (
              <div className="text-center py-12 text-gray-400">
                <p className="text-sm">Yükleniyor...</p>
              </div>
            ) : recentOrders.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <p className="text-sm">Henüz sipariş yok.</p>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="text-xs text-gray-500 uppercase tracking-wider border-b border-gray-100">
                    <th className="px-5 py-3 text-left font-medium">Sipariş No</th>
                    <th className="px-5 py-3 text-left font-medium">Müşteri</th>
                    <th className="px-5 py-3 text-left font-medium">Tarih</th>
                    <th className="px-5 py-3 text-left font-medium">Durum</th>
                    <th className="px-5 py-3 text-right font-medium">Tutar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3 text-sm font-mono text-gray-700">{order.order_number}</td>
                      <td className="px-5 py-3 text-sm text-gray-700">
                        {order.shipping_address?.full_name ?? "—"}
                      </td>
                      <td className="px-5 py-3 text-xs text-gray-500">
                        {new Date(order.created_at).toLocaleDateString("tr-TR")}
                      </td>
                      <td className="px-5 py-3">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_LABELS[order.status]?.color ?? "bg-gray-100 text-gray-600"}`}>
                          {STATUS_LABELS[order.status]?.label ?? order.status}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-sm font-semibold text-right text-primary-700">
                        {formatPrice(order.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <h2 className="text-base font-bold text-gray-900 mb-4">Hızlı Erişim</h2>
          <div className="space-y-2">
            {QUICK_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-sm font-medium ${link.color}`}
              >
                <span>{link.icon}</span>
                {link.label}
              </Link>
            ))}
          </div>

          <div className="mt-6 p-4 bg-primary-50 rounded-xl border border-primary-200">
            <p className="text-xs font-bold text-primary-800 mb-1">📊 Bu Ay</p>
            <p className="text-xs text-primary-700 leading-relaxed">
              {loading
                ? "Yükleniyor..."
                : `${newOrdersThisMonth} yeni sipariş, ${newUsersThisMonth} yeni kullanıcı kayıt oldu.`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

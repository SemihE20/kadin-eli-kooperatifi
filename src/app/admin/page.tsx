import Link from "next/link";
import { formatPrice } from "@/lib/utils";

const STATS = [
  { label: "Toplam Sipariş", value: "47", icon: "📦", change: "+12%", href: "/admin/siparisler" },
  { label: "Aylık Gelir", value: formatPrice(12450), icon: "💰", change: "+8%", href: "/admin/siparisler" },
  { label: "Aktif Ürün", value: "24", icon: "🌿", change: "+3", href: "/admin/urunler" },
  { label: "Kayıtlı Kullanıcı", value: "138", icon: "👥", change: "+21", href: "/admin/kullanicilar" },
];

const RECENT_ORDERS = [
  { id: "o1", number: "GK250706-0042", customer: "Ayşe Yılmaz", total: 625, status: "beklemede", date: "2025-07-06" },
  { id: "o2", number: "GK250705-0041", customer: "Mehmet Kaya", total: 180, status: "onaylandi", date: "2025-07-05" },
  { id: "o3", number: "GK250704-0040", customer: "Fatma Şahin", total: 950, status: "kargoda", date: "2025-07-04" },
  { id: "o4", number: "GK250703-0039", customer: "Ali Demir", total: 250, status: "teslim_edildi", date: "2025-07-03" },
  { id: "o5", number: "GK250702-0038", customer: "Zeynep Çelik", total: 340, status: "teslim_edildi", date: "2025-07-02" },
];

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
              <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                {stat.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-0.5">{stat.value}</p>
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
                {RECENT_ORDERS.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3 text-sm font-mono text-gray-700">{order.number}</td>
                    <td className="px-5 py-3 text-sm text-gray-700">{order.customer}</td>
                    <td className="px-5 py-3 text-xs text-gray-500">{order.date}</td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_LABELS[order.status].color}`}>
                        {STATUS_LABELS[order.status].label}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-sm font-semibold text-right text-primary-700">
                      {formatPrice(order.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
              15 yeni sipariş, 3 yeni kullanıcı kayıt oldu. En çok satan ürün: Doğal Çam Balı.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

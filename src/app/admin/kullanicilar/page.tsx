import { formatDate } from "@/lib/utils";

const DEMO_USERS = [
  { id: "u1", name: "Ayşe Yılmaz", email: "ayse@ornek.com", phone: "05551234567", city: "Bursa", role: "customer", orders: 3, joinedAt: "2025-01-15T00:00:00Z" },
  { id: "u2", name: "Mehmet Kaya", email: "mehmet@ornek.com", phone: "05557654321", city: "İstanbul", role: "customer", orders: 1, joinedAt: "2025-02-20T00:00:00Z" },
  { id: "u3", name: "Fatma Şahin", email: "fatma@ornek.com", phone: "05559876543", city: "İzmir", role: "customer", orders: 5, joinedAt: "2024-11-10T00:00:00Z" },
  { id: "u4", name: "Ali Demir", email: "ali@ornek.com", phone: "05552345678", city: "Ankara", role: "customer", orders: 2, joinedAt: "2025-03-05T00:00:00Z" },
  { id: "u5", name: "Zeynep Çelik", email: "zeynep@ornek.com", phone: "05553456789", city: "Bursa", role: "customer", orders: 4, joinedAt: "2024-12-01T00:00:00Z" },
  { id: "u6", name: "Admin Kullanıcı", email: "admin@gozlerkooperatif.com", phone: "05550000001", city: "Bursa", role: "admin", orders: 0, joinedAt: "2024-01-01T00:00:00Z" },
  { id: "u7", name: "Hasan Özkan", email: "hasan@ornek.com", phone: "05554567890", city: "İstanbul", role: "customer", orders: 1, joinedAt: "2025-04-18T00:00:00Z" },
  { id: "u8", name: "Elif Koca", email: "elif@ornek.com", phone: "05555678901", city: "Bursa", role: "customer", orders: 7, joinedAt: "2024-09-30T00:00:00Z" },
];

export default function AdminUsersPage() {
  const customers = DEMO_USERS.filter((u) => u.role === "customer");
  const admins = DEMO_USERS.filter((u) => u.role === "admin");

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Kullanıcılar</h1>
        <p className="text-sm text-gray-500">{customers.length} müşteri, {admins.length} admin</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Toplam Kullanıcı", value: DEMO_USERS.length, icon: "👥" },
          { label: "Bu Ay Yeni", value: 3, icon: "🆕" },
          { label: "Ortalama Sipariş", value: (customers.reduce((acc, u) => acc + u.orders, 0) / customers.length).toFixed(1), icon: "📦" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl border border-gray-200 p-4 flex items-center gap-4">
            <span className="text-2xl">{stat.icon}</span>
            <div>
              <p className="text-xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="text-xs text-gray-500 uppercase tracking-wider bg-gray-50 border-b border-gray-100">
              <th className="px-5 py-3 text-left font-medium">Kullanıcı</th>
              <th className="px-5 py-3 text-left font-medium">Telefon</th>
              <th className="px-5 py-3 text-left font-medium">Şehir</th>
              <th className="px-5 py-3 text-center font-medium">Sipariş</th>
              <th className="px-5 py-3 text-center font-medium">Rol</th>
              <th className="px-5 py-3 text-left font-medium">Kayıt Tarihi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {DEMO_USERS.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-xs font-bold text-primary-700 shrink-0">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-400">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-sm text-gray-500">{user.phone}</td>
                <td className="px-5 py-4 text-sm text-gray-500">{user.city}</td>
                <td className="px-5 py-4 text-center">
                  <span className="text-sm font-semibold text-gray-700">{user.orders}</span>
                </td>
                <td className="px-5 py-4 text-center">
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                    user.role === "admin"
                      ? "bg-primary-100 text-primary-700"
                      : "bg-gray-100 text-gray-600"
                  }`}>
                    {user.role === "admin" ? "Admin" : "Müşteri"}
                  </span>
                </td>
                <td className="px-5 py-4 text-xs text-gray-500">
                  {formatDate(user.joinedAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { formatDate } from "@/lib/utils";
import type { UserRole } from "@/types";

interface AdminUser {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  role: UserRole;
  created_at: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [orderCounts, setOrderCounts] = useState<Record<string, number>>({});
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const supabase = createClient();

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);

    const [usersRes, ordersRes, authRes] = await Promise.all([
      fetch("/api/admin/users").then((r) => r.json()),
      supabase.from("orders").select("user_id"),
      supabase.auth.getUser(),
    ]);

    if (usersRes.error) {
      setError(usersRes.error);
      setLoading(false);
      return;
    }

    const counts: Record<string, number> = {};
    for (const row of ordersRes.data ?? []) {
      if (!row.user_id) continue;
      counts[row.user_id] = (counts[row.user_id] ?? 0) + 1;
    }

    setUsers(usersRes.users ?? []);
    setOrderCounts(counts);
    setCurrentUserId(authRes.data.user?.id ?? null);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  async function handleRoleChange(targetUser: AdminUser, newRole: UserRole) {
    if (targetUser.id === currentUserId) return;
    const label = newRole === "admin" ? "admin yapmak" : "müşteriye çevirmek";
    if (!confirm(`"${targetUser.full_name || targetUser.email}" kullanıcısını ${label} istediğinize emin misiniz?`)) {
      return;
    }

    setUpdatingId(targetUser.id);
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ role: newRole })
      .eq("id", targetUser.id);

    if (updateError) {
      alert(updateError.message);
    } else {
      setUsers((prev) =>
        prev.map((u) => (u.id === targetUser.id ? { ...u, role: newRole } : u))
      );
    }
    setUpdatingId(null);
  }

  const customers = users.filter((u) => u.role === "customer");
  const admins = users.filter((u) => u.role === "admin");
  const avgOrders = customers.length
    ? (customers.reduce((acc, u) => acc + (orderCounts[u.id] ?? 0), 0) / customers.length).toFixed(1)
    : "0.0";

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Kullanıcılar</h1>
        <p className="text-sm text-gray-500">{customers.length} müşteri, {admins.length} admin</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Toplam Kullanıcı", value: users.length, icon: "👥" },
          { label: "Admin Sayısı", value: admins.length, icon: "🛡️" },
          { label: "Ortalama Sipariş", value: avgOrders, icon: "📦" },
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
        {loading ? (
          <div className="text-center py-12 text-gray-400">
            <p className="text-sm">Yükleniyor...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-500">
            <p className="text-sm">{error}</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="text-xs text-gray-500 uppercase tracking-wider bg-gray-50 border-b border-gray-100">
                <th className="px-5 py-3 text-left font-medium">Kullanıcı</th>
                <th className="px-5 py-3 text-left font-medium">Telefon</th>
                <th className="px-5 py-3 text-center font-medium">Sipariş</th>
                <th className="px-5 py-3 text-center font-medium">Rol</th>
                <th className="px-5 py-3 text-left font-medium">Kayıt Tarihi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-xs font-bold text-primary-700 shrink-0">
                        {(user.full_name || user.email).charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {user.full_name || "—"}
                          {user.id === currentUserId && (
                            <span className="ml-1.5 text-[10px] text-primary-600 font-normal">(Siz)</span>
                          )}
                        </p>
                        <p className="text-xs text-gray-400">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-500">{user.phone || "—"}</td>
                  <td className="px-5 py-4 text-center">
                    <span className="text-sm font-semibold text-gray-700">{orderCounts[user.id] ?? 0}</span>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <select
                      value={user.role}
                      disabled={user.id === currentUserId || updatingId === user.id}
                      onChange={(e) => handleRoleChange(user, e.target.value as UserRole)}
                      className={`text-xs font-medium px-2 py-1 rounded-lg border-0 cursor-pointer focus:ring-2 focus:ring-primary-400/20 focus:outline-none transition-opacity disabled:cursor-not-allowed disabled:opacity-60 ${
                        user.role === "admin"
                          ? "bg-primary-100 text-primary-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      <option value="customer">Müşteri</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="px-5 py-4 text-xs text-gray-500">
                    {formatDate(user.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {!loading && !error && users.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <p className="text-sm">Kullanıcı bulunamadı.</p>
          </div>
        )}
      </div>
    </div>
  );
}

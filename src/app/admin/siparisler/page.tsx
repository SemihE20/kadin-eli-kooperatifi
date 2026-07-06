"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { formatPrice } from "@/lib/utils";
import type { OrderStatus } from "@/types";

interface AdminOrder {
  id: string;
  order_number: string;
  user_id: string | null;
  status: OrderStatus;
  subtotal: number;
  shipping_cost: number;
  total: number;
  shipping_address: {
    full_name: string;
    phone: string;
    city: string;
    district: string;
    address: string;
  };
  payment_method: string;
  notes: string | null;
  created_at: string;
}

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string }> = {
  beklemede:    { label: "Beklemede",    color: "bg-amber-100 text-amber-700" },
  onaylandi:   { label: "Onaylandı",    color: "bg-blue-100 text-blue-700" },
  kargoda:     { label: "Kargoda",      color: "bg-purple-100 text-purple-700" },
  teslim_edildi: { label: "Teslim Edildi", color: "bg-green-100 text-green-700" },
  iptal:       { label: "İptal",        color: "bg-red-100 text-red-700" },
};

const STATUS_OPTIONS: OrderStatus[] = [
  "beklemede", "onaylandi", "kargoda", "teslim_edildi", "iptal",
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<"all" | OrderStatus>("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const supabase = createClient();

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
    setOrders((data as AdminOrder[]) ?? []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const filtered =
    statusFilter === "all"
      ? orders
      : orders.filter((o) => o.status === statusFilter);

  async function handleStatusChange(orderId: string, newStatus: OrderStatus) {
    setUpdatingId(orderId);
    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", orderId);

    if (!error) {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
    }
    setUpdatingId(null);
  }

  const countByStatus = (status: OrderStatus) =>
    orders.filter((o) => o.status === status).length;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Siparişler</h1>
        <p className="text-sm text-gray-500">{orders.length} toplam sipariş</p>
      </div>

      {/* Status Filter */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setStatusFilter("all")}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
              statusFilter === "all"
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Tümü ({orders.length})
          </button>
          {STATUS_OPTIONS.map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                statusFilter === status
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {STATUS_CONFIG[status].label} ({countByStatus(status)})
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="text-center py-12 text-gray-400">
            <p className="text-sm">Yükleniyor...</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="text-xs text-gray-500 uppercase tracking-wider bg-gray-50 border-b border-gray-100">
                <th className="px-5 py-3 text-left font-medium">Sipariş No</th>
                <th className="px-5 py-3 text-left font-medium">Müşteri</th>
                <th className="px-5 py-3 text-left font-medium">Şehir</th>
                <th className="px-5 py-3 text-left font-medium">Tarih</th>
                <th className="px-5 py-3 text-left font-medium">Ödeme</th>
                <th className="px-5 py-3 text-right font-medium">Tutar</th>
                <th className="px-5 py-3 text-center font-medium">Durum</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4 text-sm font-mono text-gray-700">
                    {order.order_number}
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-sm font-medium text-gray-900">
                      {order.shipping_address?.full_name ?? "—"}
                    </p>
                    <p className="text-xs text-gray-400">
                      {order.shipping_address?.phone ?? ""}
                    </p>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-500">
                    {order.shipping_address?.city ?? "—"}
                  </td>
                  <td className="px-5 py-4 text-xs text-gray-500">
                    {new Date(order.created_at).toLocaleDateString("tr-TR")}
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-xs text-gray-500">
                      {order.payment_method === "havale_eft" ? "💳 Havale/EFT" : "🚪 Kapıda Ödeme"}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm font-semibold text-right text-primary-700">
                    {formatPrice(order.total)}
                  </td>
                  <td className="px-5 py-4 text-center">
                    <select
                      value={order.status}
                      disabled={updatingId === order.id}
                      onChange={(e) =>
                        handleStatusChange(order.id, e.target.value as OrderStatus)
                      }
                      className={`text-xs font-medium px-2 py-1 rounded-lg border-0 cursor-pointer focus:ring-2 focus:ring-primary-400/20 focus:outline-none transition-opacity ${
                        STATUS_CONFIG[order.status].color
                      } ${updatingId === order.id ? "opacity-50" : ""}`}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {STATUS_CONFIG[s].label}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <p className="text-sm">Bu filtrede sipariş bulunamadı.</p>
          </div>
        )}
      </div>
    </div>
  );
}

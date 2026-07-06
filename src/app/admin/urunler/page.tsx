"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types";

type ProductForm = {
  name: string;
  slug: string;
  description: string;
  price: string;
  compare_at_price: string;
  category: string;
  stock_quantity: string;
  is_active: boolean;
  is_featured: boolean;
  image_url: string;
};

const EMPTY_FORM: ProductForm = {
  name: "", slug: "", description: "", price: "",
  compare_at_price: "", category: "gida", stock_quantity: "0",
  is_active: true, is_featured: false, image_url: "",
};

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s")
    .replace(/ı/g, "i").replace(/ö/g, "o").replace(/ç/g, "c")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

const CATEGORIES = [
  { value: "gida", label: "Gıda Ürünleri" },
  { value: "bitki", label: "Tıbbi ve Aromatik Bitkiler" },
  { value: "fidan", label: "Fidan ve Tohum" },
];

const CAT_LABEL: Record<string, string> = {
  gida: "Gıda", bitki: "Tıbbi Bitkiler", fidan: "Fidan & Tohum",
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState<Product | null>(null);
  const [form, setForm] = useState<ProductForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [originalPreview, setOriginalPreview] = useState<string | null>(null);
  const [processedPreview, setProcessedPreview] = useState<string | null>(null);
  const [processedBlob, setProcessedBlob] = useState<Blob | null>(null);
  const [bgRemoving, setBgRemoving] = useState(false);
  const [bgError, setBgError] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const supabase = createClient();

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });
    setProducts(data ?? []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.category ?? "").toLowerCase().includes(search.toLowerCase())
  );

  function resetImageState() {
    setImageFile(null);
    setOriginalPreview(null);
    setProcessedPreview(null);
    setProcessedBlob(null);
    setBgRemoving(false);
    setBgError(null);
    setUploadingImage(false);
  }

  function closeModal() {
    setShowModal(false);
    resetImageState();
  }

  function openAdd() {
    setEditTarget(null);
    setForm(EMPTY_FORM);
    setFormError(null);
    resetImageState();
    setShowModal(true);
  }

  function openEdit(product: Product) {
    setEditTarget(product);
    setForm({
      name: product.name,
      slug: product.slug,
      description: product.description ?? "",
      price: product.price.toString(),
      compare_at_price: product.compare_at_price?.toString() ?? "",
      category: product.category ?? "gida",
      stock_quantity: product.stock_quantity.toString(),
      is_active: product.is_active,
      is_featured: product.is_featured,
      image_url: product.image_url ?? "",
    });
    setFormError(null);
    resetImageState();
    setShowModal(true);
  }

  async function runRemoveBackground(file: File) {
    setBgRemoving(true);
    setBgError(null);
    try {
      const body = new FormData();
      body.append("image_file", file);
      const res = await fetch("/api/admin/remove-bg", { method: "POST", body });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setBgError(err.error ?? "Arka plan kaldırılamadı.");
        return;
      }
      const blob = await res.blob();
      setProcessedBlob(blob);
      setProcessedPreview(URL.createObjectURL(blob));
    } catch {
      setBgError("Arka plan kaldırılamadı. Bağlantınızı kontrol edin.");
    } finally {
      setBgRemoving(false);
    }
  }

  function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setImageFile(null);
      setOriginalPreview(null);
      setBgError(
        `Desteklenmeyen görsel formatı (${file.type || "bilinmiyor"}). Lütfen JPEG, PNG veya WebP kullanın — iPhone HEIC fotoğraflarını önce JPEG'e dönüştürün.`
      );
      e.target.value = "";
      return;
    }

    setImageFile(file);
    setOriginalPreview(URL.createObjectURL(file));
    setProcessedPreview(null);
    setProcessedBlob(null);
    setBgError(null);
    runRemoveBackground(file);
  }

  async function approveProcessedImage() {
    if (!processedBlob) return;
    setUploadingImage(true);
    setBgError(null);

    const path = `${crypto.randomUUID()}.png`;
    const { error } = await supabase.storage
      .from("product-images")
      .upload(path, processedBlob, { contentType: "image/png", upsert: false });

    if (error) {
      setBgError(error.message);
      setUploadingImage(false);
      return;
    }

    const { data } = supabase.storage.from("product-images").getPublicUrl(path);
    setForm((f) => ({ ...f, image_url: data.publicUrl }));
    resetImageState();
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`"${name}" ürününü silmek istediğinize emin misiniz?`)) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) { alert(error.message); return; }
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setFormError(null);

    const payload = {
      name: form.name.trim(),
      slug: form.slug.trim() || slugify(form.name),
      description: form.description.trim() || null,
      price: parseFloat(form.price),
      compare_at_price: form.compare_at_price ? parseFloat(form.compare_at_price) : null,
      category: form.category,
      stock_quantity: parseInt(form.stock_quantity) || 0,
      is_active: form.is_active,
      is_featured: form.is_featured,
      image_url: form.image_url.trim() || null,
    };

    const { error } = editTarget
      ? await supabase.from("products").update(payload).eq("id", editTarget.id)
      : await supabase.from("products").insert(payload);

    if (error) {
      setFormError(error.message);
      setSaving(false);
      return;
    }

    closeModal();
    fetchProducts();
    setSaving(false);
  }

  async function toggleActive(product: Product) {
    await supabase
      .from("products")
      .update({ is_active: !product.is_active })
      .eq("id", product.id);
    setProducts((prev) =>
      prev.map((p) => (p.id === product.id ? { ...p, is_active: !p.is_active } : p))
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Ürünler</h1>
          <p className="text-sm text-gray-500">{products.length} ürün</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2 bg-primary-700 text-white text-sm font-medium rounded-xl hover:bg-primary-800 transition-colors cursor-pointer"
        >
          <span>+</span> Yeni Ürün
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4">
        <div className="relative max-w-sm">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Ürün ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-gray-200 bg-white focus:border-primary-400 focus:ring-2 focus:ring-primary-400/20 focus:outline-none transition-all"
          />
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
                <th className="px-5 py-3 text-left font-medium">Ürün Adı</th>
                <th className="px-5 py-3 text-left font-medium">Kategori</th>
                <th className="px-5 py-3 text-right font-medium">Fiyat</th>
                <th className="px-5 py-3 text-center font-medium">Stok</th>
                <th className="px-5 py-3 text-center font-medium">Durum</th>
                <th className="px-5 py-3 text-right font-medium">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-cream-100 rounded-lg flex items-center justify-center shrink-0 text-sm">
                        🌿
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{product.name}</p>
                        {product.is_featured && (
                          <span className="text-[10px] text-amber-600 font-medium">★ Öne Çıkan</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-500">
                    {CAT_LABEL[product.category ?? ""] ?? product.category}
                  </td>
                  <td className="px-5 py-4 text-sm font-semibold text-gray-900 text-right">
                    {formatPrice(product.price)}
                    {product.compare_at_price && (
                      <p className="text-xs text-gray-400 line-through">{formatPrice(product.compare_at_price)}</p>
                    )}
                  </td>
                  <td className="px-5 py-4 text-center">
                    <span className={`text-sm font-medium ${product.stock_quantity <= 10 ? "text-red-600" : "text-gray-700"}`}>
                      {product.stock_quantity}
                    </span>
                    {product.stock_quantity <= 10 && (
                      <p className="text-[10px] text-red-500">Düşük stok</p>
                    )}
                  </td>
                  <td className="px-5 py-4 text-center">
                    <button
                      onClick={() => toggleActive(product)}
                      className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                        product.is_active
                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                          : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                      }`}
                    >
                      {product.is_active ? "Aktif" : "Pasif"}
                    </button>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEdit(product)}
                        className="p-1.5 text-gray-400 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors cursor-pointer"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(product.id, product.name)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <p className="text-sm">Ürün bulunamadı.</p>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => closeModal()}
        >
          <div
            className="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-bold text-gray-900">
                {editTarget ? "Ürünü Düzenle" : "Yeni Ürün Ekle"}
              </h3>
              <button onClick={() => closeModal()} className="text-gray-400 hover:text-gray-600 cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Ürün Adı *</label>
                <input
                  required
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({
                    ...f,
                    name: e.target.value,
                    slug: f.slug || slugify(e.target.value),
                  }))}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-400/20 focus:outline-none"
                  placeholder="Doğal Çam Balı (850g)"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Slug (URL)</label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-400/20 focus:outline-none font-mono"
                  placeholder="dogal-cam-bali"
                />
              </div>

              {/* Price + Compare */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Fiyat (₺) *</label>
                  <input
                    required
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-400/20 focus:outline-none"
                    placeholder="150.00"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">İndirim Öncesi (₺)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.compare_at_price}
                    onChange={(e) => setForm((f) => ({ ...f, compare_at_price: e.target.value }))}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-400/20 focus:outline-none"
                    placeholder="200.00"
                  />
                </div>
              </div>

              {/* Category + Stock */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Kategori</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-400/20 focus:outline-none"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Stok Adedi</label>
                  <input
                    type="number"
                    min="0"
                    value={form.stock_quantity}
                    onChange={(e) => setForm((f) => ({ ...f, stock_quantity: e.target.value }))}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-400/20 focus:outline-none"
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Açıklama</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-400/20 focus:outline-none resize-none"
                  placeholder="Ürün açıklaması..."
                />
              </div>

              {/* Image Upload + Background Removal */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Ürün Görseli</label>

                {form.image_url && !originalPreview && (
                  <div className="mb-2 flex items-center gap-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={form.image_url}
                      alt="Mevcut görsel"
                      className="w-14 h-14 rounded-lg object-cover border border-gray-200"
                    />
                    <span className="text-xs text-gray-500">Mevcut görsel</span>
                  </div>
                )}

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="w-full text-xs text-gray-600 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-primary-50 file:text-primary-700 file:text-xs file:font-medium hover:file:bg-primary-100 cursor-pointer"
                />

                {(originalPreview || bgRemoving) && (
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-[10px] text-gray-400 mb-1">Orijinal</p>
                      {originalPreview && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={originalPreview}
                          alt="Orijinal"
                          className="w-full h-28 object-cover rounded-lg border border-gray-200"
                        />
                      )}
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 mb-1">Arka Planı Kaldırılmış</p>
                      <div className="w-full h-28 rounded-lg border border-gray-200 bg-gray-100 flex items-center justify-center overflow-hidden">
                        {bgRemoving ? (
                          <span className="text-xs text-gray-400">İşleniyor...</span>
                        ) : processedPreview ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={processedPreview}
                            alt="Arka planı kaldırılmış"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-xs text-gray-300">—</span>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {bgError && (
                  <p className="text-xs text-red-600 bg-red-50 rounded-xl px-3 py-2 mt-2">{bgError}</p>
                )}

                {processedPreview && !bgRemoving && (
                  <div className="flex gap-2 mt-2">
                    <button
                      type="button"
                      onClick={approveProcessedImage}
                      disabled={uploadingImage}
                      className="flex-1 py-2 bg-primary-700 text-white text-xs font-medium rounded-lg hover:bg-primary-800 disabled:opacity-50 cursor-pointer transition-colors"
                    >
                      {uploadingImage ? "Yükleniyor..." : "✓ Bu Görseli Onayla ve Kullan"}
                    </button>
                    <button
                      type="button"
                      onClick={resetImageState}
                      className="px-3 py-2 bg-gray-100 text-gray-600 text-xs font-medium rounded-lg hover:bg-gray-200 cursor-pointer transition-colors"
                    >
                      Vazgeç
                    </button>
                  </div>
                )}

                {bgError && imageFile && !bgRemoving && (
                  <button
                    type="button"
                    onClick={() => runRemoveBackground(imageFile)}
                    className="mt-2 text-xs text-primary-700 font-medium hover:text-primary-800 cursor-pointer"
                  >
                    Tekrar Dene
                  </button>
                )}

                <input
                  type="text"
                  value={form.image_url}
                  onChange={(e) => setForm((f) => ({ ...f, image_url: e.target.value }))}
                  className="w-full mt-2 px-3 py-2 text-sm rounded-xl border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-400/20 focus:outline-none"
                  placeholder="veya görsel URL'sini elle girin"
                />
              </div>

              {/* Toggles */}
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.is_active}
                    onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))}
                    className="rounded border-gray-300 text-primary-700"
                  />
                  <span className="text-xs text-gray-700">Aktif</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.is_featured}
                    onChange={(e) => setForm((f) => ({ ...f, is_featured: e.target.checked }))}
                    className="rounded border-gray-300 text-primary-700"
                  />
                  <span className="text-xs text-gray-700">Öne Çıkan</span>
                </label>
              </div>

              {formError && (
                <p className="text-xs text-red-600 bg-red-50 rounded-xl px-3 py-2">{formError}</p>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => closeModal()}
                  className="flex-1 py-2.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2.5 bg-primary-700 text-white text-sm font-medium rounded-xl hover:bg-primary-800 transition-colors cursor-pointer disabled:opacity-50"
                >
                  {saving ? "Kaydediliyor..." : editTarget ? "Güncelle" : "Ekle"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

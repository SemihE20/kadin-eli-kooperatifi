import type { NavItem } from "@/types";

// ==========================================
// Site Constants
// ==========================================

export const SITE_NAME = "Gözler Kadıneli Kooperatifi";
export const SITE_DESCRIPTION =
  "El emeği, göz nuru ürünler. Kadın ellerinden doğaya ve sofralarınıza doğal, sağlıklı ürünler.";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

// ==========================================
// WhatsApp
// ==========================================
export const WHATSAPP_NUMBER = "905XXXXXXXXX"; // Kooperatif WP numarası
export const WHATSAPP_BASE_URL = "https://wa.me";

// ==========================================
// Navigation
// ==========================================
export const NAV_ITEMS: NavItem[] = [
  { label: "Ana Sayfa", href: "/" },
  { label: "Ürünler", href: "/urunler" },
  { label: "Hakkımızda", href: "/hakkimizda" },
  { label: "İletişim", href: "/iletisim" },
];

// ==========================================
// Product Categories
// ==========================================
export const CATEGORIES = [
  {
    name: "Gıda Ürünleri",
    slug: "gida",
    description: "Doğal, katkısız, ev yapımı gıda ürünleri",
    icon: "🫙",
  },
  {
    name: "El İşi Ürünler",
    slug: "el-isi",
    description: "Geleneksel el sanatları ve el işi ürünler",
    icon: "🧶",
  },
  {
    name: "Doğal Ürünler",
    slug: "dogal-urunler",
    description: "Doğadan gelen saf ve doğal ürünler",
    icon: "🌿",
  },
  {
    name: "Hediyelik Ürünler",
    slug: "hediyelik",
    description: "Sevdiklerinize özel el yapımı hediyeler",
    icon: "🎁",
  },
];

// ==========================================
// Order & Payment
// ==========================================
export const PAYMENT_METHODS = [
  {
    id: "havale_eft" as const,
    label: "Havale / EFT",
    description: "Banka havalesi ile ödeme yapın",
    icon: "🏦",
  },
  {
    id: "kapida_odeme" as const,
    label: "Kapıda Ödeme",
    description: "Ürün tesliminde nakit veya kart ile ödeme",
    icon: "🚚",
  },
];

export const ORDER_STATUS_LABELS: Record<string, string> = {
  beklemede: "Beklemede",
  onaylandi: "Onaylandı",
  kargoda: "Kargoda",
  teslim_edildi: "Teslim Edildi",
  iptal: "İptal Edildi",
};

export const ORDER_STATUS_COLORS: Record<string, string> = {
  beklemede: "bg-amber-100 text-amber-800",
  onaylandi: "bg-blue-100 text-blue-800",
  kargoda: "bg-purple-100 text-purple-800",
  teslim_edildi: "bg-green-100 text-green-800",
  iptal: "bg-red-100 text-red-800",
};

// ==========================================
// Shipping
// ==========================================
export const FREE_SHIPPING_THRESHOLD = 500; // 500 TL üzeri ücretsiz kargo
export const SHIPPING_COST = 49.90; // Standart kargo ücreti

// ==========================================
// Bank Info (for Havale/EFT)
// ==========================================
export const BANK_INFO = {
  bankName: "Ziraat Bankası",
  accountHolder: "Gözler Kadıneli Kooperatifi",
  iban: "TR00 0000 0000 0000 0000 0000 00",
  branch: "Gözler Şubesi",
};

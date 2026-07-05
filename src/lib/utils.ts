// ==========================================
// Utility Functions
// ==========================================

import { WHATSAPP_BASE_URL, WHATSAPP_NUMBER, FREE_SHIPPING_THRESHOLD, SHIPPING_COST } from "./constants";

// ==========================================
// Class Name Utility
// ==========================================
type ClassValue = string | number | boolean | undefined | null | ClassValue[] | Record<string, boolean | undefined | null>;

export function cn(...inputs: ClassValue[]): string {
  const classes: string[] = [];
  for (const input of inputs) {
    if (!input) continue;
    if (typeof input === "string") {
      classes.push(input);
    } else if (typeof input === "number") {
      classes.push(String(input));
    } else if (Array.isArray(input)) {
      const inner = cn(...input);
      if (inner) classes.push(inner);
    } else if (typeof input === "object") {
      for (const [key, value] of Object.entries(input)) {
        if (value) classes.push(key);
      }
    }
  }
  return classes.filter(Boolean).join(" ");
}

// ==========================================
// Price Formatting
// ==========================================
export function formatPrice(price: number): string {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    minimumFractionDigits: 2,
  }).format(price);
}

// ==========================================
// Slug Utility
// ==========================================
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

// ==========================================
// Shipping Calculation
// ==========================================
export function calculateShipping(subtotal: number): number {
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
}

// ==========================================
// WhatsApp Link Generator
// ==========================================
export function generateWhatsAppLink(message: string): string {
  const encodedMessage = encodeURIComponent(message);
  return `${WHATSAPP_BASE_URL}/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
}

export function generateOrderWhatsAppMessage(
  orderNumber: string,
  items: { name: string; quantity: number; price: number }[],
  total: number
): string {
  const itemLines = items
    .map((item) => `• ${item.name} x${item.quantity} — ${formatPrice(item.price)}`)
    .join("\n");

  return `Merhaba! 🌿\n\nSipariş vermek istiyorum.\n\n📋 Sipariş No: ${orderNumber}\n\n${itemLines}\n\n💰 Toplam: ${formatPrice(total)}\n\nTeşekkürler!`;
}

// ==========================================
// Order Number Generator
// ==========================================
export function generateOrderNumber(): string {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const day = now.getDate().toString().padStart(2, "0");
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  return `GK${year}${month}${day}-${random}`;
}

// ==========================================
// Date Formatting
// ==========================================
export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat("tr-TR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(dateString));
}

export function formatDateTime(dateString: string): string {
  return new Intl.DateTimeFormat("tr-TR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateString));
}

// ==========================================
// Discount Calculation
// ==========================================
export function calculateDiscount(
  price: number,
  compareAtPrice: number | null
): number | null {
  if (!compareAtPrice || compareAtPrice <= price) return null;
  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
}

// ==========================================
// Truncate Text
// ==========================================
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
}

// ==========================================
// Get Primary Image
// ==========================================
export function getPrimaryImage(
  images?: { image_url: string; is_primary: boolean }[]
): string {
  if (!images || images.length === 0) return "/images/placeholder.jpg";
  const primary = images.find((img) => img.is_primary);
  return primary?.image_url || images[0].image_url;
}

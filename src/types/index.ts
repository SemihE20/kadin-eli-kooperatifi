// ==========================================
// Gözler Kadıneli Kooperatifi — TypeScript Types
// ==========================================

// --- Category ---
export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  sort_order: number;
  created_at: string;
}

// --- Product ---
export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  compare_at_price: number | null;
  category_id: string | null;
  stock_quantity: number;
  is_active: boolean;
  is_featured: boolean;
  weight: number | null;
  created_at: string;
  updated_at: string;
  // Joined
  category?: Category;
  images?: ProductImage[];
}

// --- Product Image ---
export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  alt_text: string | null;
  sort_order: number;
  is_primary: boolean;
}

// --- Cart ---
export interface CartItem {
  product: Product;
  quantity: number;
}

// --- Order ---
export type OrderStatus =
  | "beklemede"
  | "onaylandi"
  | "kargoda"
  | "teslim_edildi"
  | "iptal";

export type PaymentMethod = "havale_eft" | "kapida_odeme";

export interface ShippingAddress {
  full_name: string;
  phone: string;
  city: string;
  district: string;
  address: string;
  postal_code?: string;
}

export interface Order {
  id: string;
  order_number: string;
  user_id: string | null;
  status: OrderStatus;
  subtotal: number;
  shipping_cost: number;
  total: number;
  shipping_address: ShippingAddress;
  payment_method: PaymentMethod;
  notes: string | null;
  created_at: string;
  updated_at: string;
  // Joined
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  // Joined
  product?: Product;
}

// --- User Profile ---
export type UserRole = "user" | "admin";

export interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  address: ShippingAddress | null;
  role: UserRole;
  created_at: string;
}

// --- UI Helpers ---
export interface NavItem {
  label: string;
  href: string;
}

export interface HeroSlide {
  title: string;
  subtitle: string;
  cta: string;
  ctaHref: string;
  image?: string;
}

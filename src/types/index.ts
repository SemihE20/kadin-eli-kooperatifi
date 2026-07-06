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

// --- Product Category Type ---
export type ProductCategory = 'bitki' | 'gida' | 'fidan';

// --- Product ---
export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  compare_at_price: number | null;
  category_id: string | null;
  category: ProductCategory | null;
  stock_quantity: number;
  is_active: boolean;
  is_featured: boolean;
  is_seasonal: boolean;
  season_info: string | null;
  usage_info: string | null;
  storage_info: string | null;
  weight: number | null;
  image_url: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  // Joined
  category_rel?: Category;
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

export type PaymentMethod = "havale_eft" | "kapida_odeme" | "kredi_karti";

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
  payment_reference: string | null;
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
export type UserRole = "customer" | "admin";

export interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  address: ShippingAddress | null;
  role: UserRole;
  created_at: string;
}

// --- Review ---
export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  // Joined
  product?: Product;
  profile?: Profile;
}

// --- Newsletter ---
export interface NewsletterSubscriber {
  id: string;
  email: string;
  created_at: string;
}

// --- Blog Post ---
export interface Post {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  content: string;
  cover_image: string | null;
  category: string;
  author: string;
  read_time: number;
  is_published: boolean;
  published_at: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
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

import { createClient } from "@/lib/supabase/server";
import HeroBanner from "@/components/home/HeroBanner";
import CategoryShowcase from "@/components/home/CategoryShowcase";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import AboutPreview from "@/components/home/AboutPreview";
import WhatsAppCTA from "@/components/home/WhatsAppCTA";
import type { Category, Product } from "@/types";

export const revalidate = 60;

export default async function HomePage() {
  let categories: Category[] = [];
  let featuredProducts: Product[] = [];

  try {
    const supabase = await createClient();
    const [categoriesRes, productsRes] = await Promise.all([
      supabase.from("categories").select("*").order("sort_order", { ascending: true }),
      supabase
        .from("products")
        .select("*, category_rel:categories(id, name, slug, description, image_url, sort_order, created_at)")
        .eq("is_featured", true)
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(8),
    ]);
    categories = (categoriesRes.data ?? []) as Category[];
    featuredProducts = (productsRes.data ?? []) as Product[];
  } catch {
    // Supabase unreachable — sections render with empty state
  }

  return (
    <>
      <HeroBanner />
      <CategoryShowcase categories={categories} />
      <FeaturedProducts products={featuredProducts} />
      <AboutPreview />
      <WhatsAppCTA />
    </>
  );
}

import { createClient } from "@/lib/supabase/server";
import PageHeader from "@/components/layout/PageHeader";
import ProductsClient from "./_components/ProductsClient";
import type { Product } from "@/types";

export const revalidate = 60;

export default async function ProductsPage() {
  let products: Product[] = [];
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("products")
      .select("*, category_rel:categories(id, name, slug, description, image_url, sort_order, created_at)")
      .eq("is_active", true)
      .order("created_at", { ascending: false });
    products = (data ?? []) as Product[];
  } catch {
    // Supabase unreachable — show empty state
  }

  return (
    <>
      <PageHeader
        title="Ürünlerimiz"
        description="El emeği ile üretilen doğal ve sağlıklı ürünlerimizi keşfedin."
        breadcrumbs={[
          { label: "Ana Sayfa", href: "/" },
          { label: "Ürünler" },
        ]}
      />

      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ProductsClient products={products} />
        </div>
      </section>
    </>
  );
}

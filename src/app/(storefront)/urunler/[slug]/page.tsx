import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import PageHeader from "@/components/layout/PageHeader";
import Badge from "@/components/ui/Badge";
import ShareButtons from "@/components/ui/ShareButtons";
import ProductPurchase from "./_components/ProductPurchase";
import ProductTabs from "./_components/ProductTabs";
import { formatPrice, formatDate, calculateDiscount, isInSeasonNow } from "@/lib/utils";
import { SITE_URL } from "@/lib/constants";
import type { Product } from "@/types";

export const revalidate = 60;

interface ReviewRow {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  profile: { full_name: string | null } | null;
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let product: Product | null = null;
  let reviews: ReviewRow[] = [];

  try {
    const supabase = await createClient();
    const { data: productData } = await supabase
      .from("products")
      .select("*, category_rel:categories(id, name, slug, description, image_url, sort_order, created_at)")
      .eq("slug", slug)
      .eq("is_active", true)
      .single();
    product = productData as Product | null;

    if (product) {
      const { data: reviewsData } = await supabase
        .from("reviews")
        .select("id, rating, comment, created_at, profile:profiles(full_name)")
        .eq("product_id", product.id)
        .order("created_at", { ascending: false });
      reviews = (reviewsData ?? []) as unknown as ReviewRow[];
    }
  } catch {
    // Supabase unreachable
  }

  if (!product) notFound();

  const discount = calculateDiscount(product.price, product.compare_at_price);
  const isPlantingSeason = product.category === "fidan" && isInSeasonNow(product.season_info);
  const productUrl = `${SITE_URL}/urunler/${product.slug}`;

  return (
    <>
      <PageHeader
        title={product.name}
        breadcrumbs={[
          { label: "Ana Sayfa", href: "/" },
          { label: "Ürünler", href: "/urunler" },
          { label: product.name },
        ]}
      />

      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
            {/* Image */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-cream-100 border border-earth-200">
              <Image
                src={product.image_url || "/images/placeholder.jpg"}
                alt={product.name}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority
              />
              {discount && (
                <div className="absolute top-4 left-4">
                  <Badge variant="discount">%{discount} İndirim</Badge>
                </div>
              )}
              {isPlantingSeason ? (
                <div className="absolute top-4 right-4">
                  <Badge variant="success">🌱 Bu Ay Ekime Uygun</Badge>
                </div>
              ) : (
                product.is_seasonal && (
                  <div className="absolute top-4 right-4">
                    <Badge variant="warning">🌸 Mevsimlik</Badge>
                  </div>
                )
              )}
            </div>

            {/* Info */}
            <div>
              {product.category_rel && (
                <span className="inline-block text-xs font-medium text-primary-600 uppercase tracking-wider mb-2">
                  {product.category_rel.name}
                </span>
              )}

              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground mb-4">
                {product.name}
              </h2>

              {/* Price */}
              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl font-bold text-primary-700">
                  {formatPrice(product.price)}
                </span>
                {product.compare_at_price && product.compare_at_price > product.price && (
                  <span className="text-base text-muted line-through">
                    {formatPrice(product.compare_at_price)}
                  </span>
                )}
              </div>

              {/* Season Info */}
              {product.is_seasonal && product.season_info && (
                <div className="mb-4 p-3 bg-cream-100 rounded-xl border border-earth-200">
                  <p className="text-xs font-medium text-earth-700">
                    🗓️ Mevsim: <span className="font-bold">{product.season_info}</span>
                    {isPlantingSeason && (
                      <span className="ml-2 text-primary-700">— şu an ekim zamanı!</span>
                    )}
                  </p>
                </div>
              )}

              <ProductPurchase product={product} />

              <ProductTabs
                description={product.description}
                usage={product.usage_info}
                storage={product.storage_info}
              />

              {/* Share */}
              <div className="mt-8 pt-6 border-t border-earth-200">
                <p className="text-sm font-medium text-foreground mb-3">Bu ürünü paylaşın:</p>
                <ShareButtons url={productUrl} title={product.name} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-10 bg-cream-50 texture-paper">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="font-heading text-xl font-bold text-foreground mb-6">
            Müşteri Yorumları ({reviews.length})
          </h3>

          {reviews.length === 0 ? (
            <p className="text-sm text-muted">
              Bu ürün için henüz yorum yapılmamış.{" "}
              <Link href="/hesabim" className="text-primary-700 font-medium hover:underline">
                İlk yorumu siz yapın.
              </Link>
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {reviews.map((review) => (
                <div key={review.id} className="bg-card p-5 rounded-2xl border border-earth-200">
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${i < review.rating ? "text-amber-400" : "text-earth-200"}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  {review.comment && (
                    <p className="text-sm text-muted leading-relaxed mb-3">{review.comment}</p>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-foreground">
                      {review.profile?.full_name || "Müşteri"}
                    </span>
                    <span className="text-[11px] text-muted">{formatDate(review.created_at)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

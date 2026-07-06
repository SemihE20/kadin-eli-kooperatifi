import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import PageHeader from "@/components/layout/PageHeader";
import Button from "@/components/ui/Button";
import type { Post } from "@/types";

export const revalidate = 60;

const CATEGORY_ICONS: Record<string, string> = {
  Reçeteler: "🍳",
  Bahçıvanlık: "🌱",
  "Doğal Yaşam": "🌿",
};

function renderContent(content: string) {
  return content.split("\n\n").map((block, i) => {
    if (block.startsWith("**") && block.endsWith("**")) {
      return (
        <h3 key={i} className="font-heading text-base font-bold text-foreground mt-6 mb-2">
          {block.replace(/\*\*/g, "")}
        </h3>
      );
    }
    if (block.startsWith("- ") || block.includes("\n- ")) {
      return (
        <ul key={i} className="list-disc list-inside space-y-1 text-sm">
          {block.split("\n").map((item, j) => (
            <li key={j}>{item.replace(/^[-\d]+\.\s*/, "")}</li>
          ))}
        </ul>
      );
    }
    if (/^\d+\./.test(block)) {
      return (
        <ol key={i} className="list-decimal list-inside space-y-1 text-sm">
          {block.split("\n").map((item, j) => (
            <li key={j}>{item.replace(/^\d+\.\s*/, "")}</li>
          ))}
        </ol>
      );
    }
    return (
      <p key={i} className="text-sm leading-relaxed">
        {block}
      </p>
    );
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let post: Post | null = null;
  let relatedData: Pick<Post, "slug" | "title" | "category" | "cover_image">[] = [];
  try {
    const supabase = await createClient();
    const [postRes, relatedRes] = await Promise.all([
      supabase
        .from("posts")
        .select("*")
        .eq("slug", slug)
        .eq("is_published", true)
        .single(),
      supabase
        .from("posts")
        .select("slug, title, category, cover_image")
        .eq("is_published", true)
        .neq("slug", slug)
        .order("published_at", { ascending: false })
        .limit(2),
    ]);
    post = postRes.data as Post | null;
    relatedData = (relatedRes.data ?? []) as typeof relatedData;
  } catch {
    // Supabase unreachable
  }

  if (!post) notFound();

  const typedPost = post as Post;
  const related = relatedData;

  return (
    <>
      <PageHeader
        title={typedPost.title}
        breadcrumbs={[
          { label: "Ana Sayfa", href: "/" },
          { label: "Blog", href: "/blog" },
          { label: typedPost.category },
        ]}
      />

      <section className="py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Main Article */}
            <article className="lg:col-span-2">
              <div className="relative h-64 sm:h-80 rounded-2xl overflow-hidden bg-cream-100 mb-8 border border-earth-200">
                <Image
                  src={typedPost.cover_image ?? "/images/placeholder.jpg"}
                  alt={typedPost.title}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-xl text-xs font-medium text-primary-700">
                    {CATEGORY_ICONS[typedPost.category]} {typedPost.category}
                  </span>
                </div>
              </div>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-muted mb-6 pb-6 border-b border-earth-200">
                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center text-xs">✍️</div>
                  <span>{typedPost.author}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>
                    {new Date(typedPost.published_at ?? typedPost.created_at).toLocaleDateString("tr-TR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{typedPost.read_time} dk okuma</span>
                </div>
              </div>

              {/* Content */}
              <div className="prose prose-sm max-w-none text-muted leading-relaxed space-y-4">
                {renderContent(typedPost.content)}
              </div>

              {/* Share */}
              <div className="mt-10 pt-6 border-t border-earth-200">
                <p className="text-sm font-medium text-foreground mb-3">Bu yazıyı paylaşın:</p>
                <div className="flex gap-2">
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(typedPost.title + " - gozlerkooperatif.com/blog/" + typedPost.slug)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white text-xs font-medium rounded-xl hover:bg-green-600 transition-colors"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    WhatsApp
                  </a>
                </div>
              </div>
            </article>

            {/* Sidebar */}
            <aside className="lg:col-span-1 space-y-6">
              {related.length > 0 && (
                <div className="bg-card rounded-2xl border border-earth-200 p-5">
                  <h3 className="font-heading text-sm font-bold text-foreground mb-4">İlgili Yazılar</h3>
                  <div className="space-y-4">
                    {related.map((r) => (
                      <Link key={r.slug} href={`/blog/${r.slug}`} className="group block">
                        <div className="relative h-24 rounded-xl overflow-hidden bg-cream-100 mb-2">
                          <Image
                            src={r.cover_image ?? "/images/placeholder.jpg"}
                            alt={r.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <span className="text-xs font-medium text-primary-600">
                          {CATEGORY_ICONS[r.category]} {r.category}
                        </span>
                        <p className="text-sm font-medium text-foreground group-hover:text-primary-700 transition-colors line-clamp-2 mt-0.5">
                          {r.title}
                        </p>
                      </Link>
                    ))}
                  </div>
                  <Link
                    href="/blog"
                    className="block text-center text-xs text-primary-700 font-medium hover:underline mt-4"
                  >
                    Tüm Yazıları Gör →
                  </Link>
                </div>
              )}

              <div className="bg-primary-700 rounded-2xl p-5 text-white relative overflow-hidden">
                <div className="absolute inset-0 pattern-botanical opacity-20" />
                <div className="relative z-10">
                  <p className="text-sm font-bold mb-2">🌿 Ürünlerimizi Keşfedin</p>
                  <p className="text-xs text-primary-200 mb-4 leading-relaxed">
                    Yazılarımızda bahsettiğimiz doğal ürünlerin tamamını mağazamızda bulabilirsiniz.
                  </p>
                  <Link href="/urunler">
                    <Button size="sm" className="!bg-white !text-primary-700 hover:!bg-cream-50 w-full">
                      Mağazaya Git
                    </Button>
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}

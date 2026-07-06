import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import PageHeader from "@/components/layout/PageHeader";
import Button from "@/components/ui/Button";
import ShareButtons from "@/components/ui/ShareButtons";
import { SITE_URL } from "@/lib/constants";
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
                <ShareButtons url={`${SITE_URL}/blog/${typedPost.slug}`} title={typedPost.title} />
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

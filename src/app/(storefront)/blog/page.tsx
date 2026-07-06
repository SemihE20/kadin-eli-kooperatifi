import { createClient } from "@/lib/supabase/server";
import PageHeader from "@/components/layout/PageHeader";
import BlogList from "./_components/BlogList";
import type { Post } from "@/types";

export const revalidate = 60;

export default async function BlogPage() {
  let posts: Post[] = [];
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("posts")
      .select("id, slug, title, summary, category, author, read_time, cover_image, published_at, created_at")
      .eq("is_published", true)
      .order("published_at", { ascending: false });
    posts = (data ?? []) as Post[];
  } catch {
    // Supabase unreachable — show empty state
  }

  return (
    <>
      <PageHeader
        title="Blog"
        description="Reçeteler, bahçıvanlık ipuçları ve doğal yaşam hakkında yazılarımız."
        breadcrumbs={[
          { label: "Ana Sayfa", href: "/" },
          { label: "Blog" },
        ]}
      />
      <BlogList posts={posts} />
    </>
  );
}

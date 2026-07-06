"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Post } from "@/types";

const CATEGORY_FILTERS = ["Tümü", "Reçeteler", "Bahçıvanlık", "Doğal Yaşam"];

const CATEGORY_ICONS: Record<string, string> = {
  Reçeteler: "🍳",
  Bahçıvanlık: "🌱",
  "Doğal Yaşam": "🌿",
};

export default function BlogList({ posts }: { posts: Post[] }) {
  const [activeCategory, setActiveCategory] = useState("Tümü");

  const filtered = useMemo(
    () =>
      activeCategory === "Tümü"
        ? posts
        : posts.filter((p) => p.category === activeCategory),
    [activeCategory, posts]
  );

  return (
    <section className="py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORY_FILTERS.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 text-sm font-medium rounded-xl transition-all cursor-pointer ${
                activeCategory === cat
                  ? "bg-primary-700 text-white shadow-sm"
                  : "bg-card text-muted border border-earth-200 hover:text-foreground hover:border-earth-300"
              }`}
            >
              {cat !== "Tümü" && CATEGORY_ICONS[cat] + " "}
              {cat}
            </button>
          ))}
        </div>

        <p className="text-xs text-muted mb-6">{filtered.length} yazı bulundu</p>

        {filtered.length === 0 ? (
          <div className="text-center py-20 text-muted">
            <p className="text-sm">Bu kategoride henüz yazı yok.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group bg-card rounded-2xl border border-earth-200 overflow-hidden hover:shadow-card transition-all duration-300"
              >
                <div className="relative h-48 overflow-hidden bg-cream-100">
                  <Image
                    src={post.cover_image ?? "/images/placeholder.jpg"}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-xs font-medium text-primary-700">
                      {CATEGORY_ICONS[post.category]} {post.category}
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-center gap-3 text-xs text-muted mb-3">
                    <span>
                      {new Date(post.published_at ?? post.created_at).toLocaleDateString("tr-TR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                    <span>·</span>
                    <span>{post.read_time} dk okuma</span>
                  </div>

                  <h3 className="font-heading text-base font-bold text-foreground mb-2 line-clamp-2 group-hover:text-primary-700 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-sm text-muted line-clamp-2 leading-relaxed mb-4">
                    {post.summary}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted">{post.author}</span>
                    <span className="text-xs font-medium text-primary-700 group-hover:underline">
                      Devamını Oku →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

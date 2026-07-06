import Link from "next/link";
import { CATEGORIES } from "@/lib/constants";

export default function CategoryShowcase() {
  const categoryImages: Record<string, string> = {
    gida: "🫙",
    "el-isi": "🧶",
    "dogal-urunler": "🌿",
    hediyelik: "🎁",
  };

  const categoryGradients: Record<string, string> = {
    gida: "from-cream-100 to-cream-200 hover:from-cream-200 hover:to-cream-300",
    "el-isi": "from-earth-50 to-cream-100 hover:from-earth-100 hover:to-cream-200",
    "dogal-urunler": "from-primary-50 to-cream-50 hover:from-primary-100 hover:to-cream-100",
    hediyelik: "from-cream-50 to-earth-50 hover:from-cream-100 hover:to-earth-100",
  };

  return (
    <section className="py-20 texture-paper" id="categories">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="inline-block text-xs font-semibold text-primary-600 uppercase tracking-widest mb-2">
            Kategoriler
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground mb-3">
            Ne Arıyorsunuz?
          </h2>
          <p className="text-sm text-muted max-w-md mx-auto">
            El emeği ürünlerimizi kategorilere göre keşfedin
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {CATEGORIES.map((category) => (
            <Link
              key={category.slug}
              href={`/urunler?kategori=${category.slug}`}
              className={`
                group relative flex flex-col items-center justify-center
                p-8 sm:p-10 rounded-2xl border border-earth-200
                bg-gradient-to-br ${categoryGradients[category.slug] || "from-earth-50 to-cream-100"}
                transition-all duration-300
                hover:shadow-card hover:border-earth-300 hover:-translate-y-1
              `}
              id={`category-${category.slug}`}
            >
              {/* Icon */}
              <span className="text-4xl sm:text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {categoryImages[category.slug]}
              </span>

              {/* Name */}
              <h3 className="font-heading text-sm sm:text-base font-semibold text-foreground text-center mb-1">
                {category.name}
              </h3>

              {/* Description */}
              <p className="text-[11px] text-muted text-center leading-relaxed hidden sm:block">
                {category.description}
              </p>

              {/* Arrow */}
              <div className="mt-3 w-8 h-8 bg-white/70 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                <svg className="w-4 h-4 text-primary-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

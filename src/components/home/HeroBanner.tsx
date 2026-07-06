import Link from "next/link";

export default function HeroBanner() {
  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden" id="hero">
      {/* Background */}
      <div className="absolute inset-0 gradient-hero" />

      {/* Botanical Pattern Overlay */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 pattern-botanical" />
      </div>

      {/* Floating Decorative Elements — Organic shapes */}
      <div className="absolute top-20 right-[10%] w-72 h-72 bg-cream-400/8 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-32 left-[5%] w-96 h-96 bg-cream-300/6 rounded-full blur-3xl animate-float" style={{ animationDelay: "1.5s" }} />
      <div className="absolute top-1/2 right-[30%] w-40 h-40 bg-primary-400/5 rounded-full blur-2xl animate-sway" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-32">
        <div className="max-w-2xl">
          {/* Tag */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-sm border border-white/15 rounded-full mb-6 animate-fade-up">
            <span className="text-lg">🌿</span>
            <span className="text-xs font-medium text-cream-200/90 tracking-wide uppercase">
              Doğal • El Yapımı • Organik
            </span>
          </div>

          {/* Title */}
          <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] mb-6 animate-fade-up" style={{ animationDelay: "0.1s" }}>
            El Emeği,{" "}
            <span className="relative">
              <span className="relative z-10 heading-accent text-cream-300">Göz Nuru</span>
              <span className="absolute -bottom-1 left-0 right-0 h-3 bg-cream-400/20 rounded-full" style={{ transform: "rotate(-1deg)" }} />
            </span>{" "}
            Ürünler
          </h2>

          {/* Description */}
          <p className="text-base sm:text-lg text-cream-200/75 leading-relaxed mb-8 max-w-lg animate-fade-up" style={{ animationDelay: "0.2s" }}>
            Kadın ellerinden doğaya ve sofralarınıza... Gözler Kadıneli Kooperatifi&apos;nden 
            doğal, sağlıklı ve el yapımı ürünler.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-3 animate-fade-up" style={{ animationDelay: "0.3s" }}>
            <Link
              href="/urunler"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-cream-100 text-earth-800 text-sm font-semibold rounded-xl hover:bg-white hover:shadow-elevated transition-all duration-300 group"
            >
              Ürünleri Keşfet
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              href="/hakkimizda"
              className="inline-flex items-center gap-2 px-7 py-3.5 border-2 border-cream-300/25 text-cream-100 text-sm font-semibold rounded-xl hover:bg-white/10 backdrop-blur-sm transition-all duration-300"
            >
              Hikayemiz
            </Link>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-8 mt-12 pt-8 border-t border-cream-300/10 animate-fade-up" style={{ animationDelay: "0.4s" }}>
            <div>
              <p className="text-2xl font-heading font-bold text-white">150+</p>
              <p className="text-xs text-cream-300/60">El Yapımı Ürün</p>
            </div>
            <div className="w-px h-10 bg-cream-300/15" />
            <div>
              <p className="text-2xl font-heading font-bold text-white">50+</p>
              <p className="text-xs text-cream-300/60">Üretici Kadın</p>
            </div>
            <div className="w-px h-10 bg-cream-300/15" />
            <div>
              <p className="text-2xl font-heading font-bold text-white">%100</p>
              <p className="text-xs text-cream-300/60">Doğal İçerik</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 80"
          className="w-full h-[50px] sm:h-[80px] fill-background"
          preserveAspectRatio="none"
        >
          <path d="M0,40 C240,80 480,0 720,40 C960,80 1200,20 1440,50 L1440,80 L0,80 Z" />
        </svg>
      </div>
    </section>
  );
}

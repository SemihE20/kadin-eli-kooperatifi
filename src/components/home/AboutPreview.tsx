import Link from "next/link";
import Image from "next/image";

export default function AboutPreview() {
  return (
    <section className="py-20 bg-warmth texture-paper" id="about-preview">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image Side */}
          <div className="relative">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
              <div className="absolute inset-0 gradient-hero opacity-90 flex items-center justify-center">
                <div className="text-center text-white p-8">
                  <div className="relative w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden ring-4 ring-cream-300/20">
                    <Image
                      src="/logo.png"
                      alt="Gözler Kadıneli Kooperatifi"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <p className="text-3xl font-heading font-bold mb-2">Gözler</p>
                  <p className="text-sm text-cream-300 tracking-widest uppercase">Kadıneli Kooperatifi</p>
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-cream-300 rounded-2xl -z-10" />
            <div className="absolute -top-4 -left-4 w-16 h-16 bg-primary-100 rounded-xl -z-10" />
          </div>

          {/* Text Side */}
          <div>
            <span className="inline-block text-xs font-semibold text-primary-600 uppercase tracking-widest mb-2">
              Hikayemiz
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground mb-4">
              Kadın Ellerinden{" "}
              <span className="gradient-text heading-accent">Doğaya ve Sofralarınıza</span>
            </h2>
            <p className="text-sm text-muted leading-relaxed mb-4">
              Gözler Kadıneli Kooperatifi, Denizli Pamukkale Gözler Mahallesi&apos;nde
              kadınların el emeklerini değerlendirmek, ekonomik bağımsızlıklarını 
              güçlendirmek ve doğal üretimi desteklemek amacıyla kurulmuştur.
            </p>
            <p className="text-sm text-muted leading-relaxed mb-6">
              Kooperatifimizde üretilen tüm ürünler, geleneksel yöntemlerle ve 
              doğal malzemelerle hazırlanmaktadır. Her ürün, bir kadının el emeği 
              ve göz nurunun eseridir.
            </p>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {[
                { icon: "🌱", text: "Doğal Malzeme" },
                { icon: "👩‍🌾", text: "Kadın Üretici" },
                { icon: "🤝", text: "Adil Ticaret" },
                { icon: "♻️", text: "Sürdürülebilir" },
              ].map((feature) => (
                <div
                  key={feature.text}
                  className="flex items-center gap-2.5 p-3 bg-cream-100 rounded-xl border border-earth-200"
                >
                  <span className="text-lg">{feature.icon}</span>
                  <span className="text-xs font-medium text-foreground">
                    {feature.text}
                  </span>
                </div>
              ))}
            </div>

            <Link
              href="/hakkimizda"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-700 text-white text-sm font-semibold rounded-xl hover:bg-primary-800 transition-colors group"
            >
              Daha Fazla Bilgi
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Hakkımızda",
  description: "Gözler Kadıneli Kooperatifi hakkında bilgi. Misyonumuz, vizyonumuz ve hikayemiz.",
};

export default function AboutPage() {
  return (
    <>
      {/* Page Header */}
      <section className="pt-28 pb-10 gradient-hero relative">
        <div className="absolute inset-0 pattern-dots opacity-10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-xs text-primary-200 mb-4">
            <Link href="/" className="hover:text-white transition-colors">Ana Sayfa</Link>
            <span>/</span>
            <span className="text-white">Hakkımızda</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Hakkımızda</h1>
          <p className="text-sm text-primary-100/80 max-w-lg">
            Gözler Kadıneli Kooperatifi&apos;nin hikayesini keşfedin.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 40" className="w-full h-[30px] fill-background" preserveAspectRatio="none">
            <path d="M0,20 C480,40 960,0 1440,25 L1440,40 L0,40 Z" />
          </svg>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Story */}
          <div className="text-center mb-16">
            <div className="relative w-28 h-28 mx-auto mb-6 rounded-full overflow-hidden ring-4 ring-primary-100">
              <Image src="/logo.jpeg" alt="Gözler Kadıneli Kooperatifi" fill className="object-cover" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-4">Hikayemiz</h2>
            <p className="text-sm text-muted leading-relaxed max-w-2xl mx-auto mb-4">
              Gözler Kadıneli Kooperatifi, Bursa&apos;nın Mudanya ilçesine bağlı Gözler Mahallesi&apos;nde 
              kadınların el emeklerini değerlendirmek, ekonomik bağımsızlıklarını güçlendirmek ve 
              doğal üretimi desteklemek amacıyla kurulmuştur.
            </p>
            <p className="text-sm text-muted leading-relaxed max-w-2xl mx-auto">
              Kooperatifimiz, geleneksel üretim yöntemlerini modern dünyaya taşıyarak, hem 
              kadınlarımızın emeklerinin karşılığını almasını hem de tüketicilerin doğal, 
              katkısız ürünlere ulaşmasını sağlamaktadır.
            </p>
          </div>

          {/* Values */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-16">
            {[
              {
                icon: "🎯",
                title: "Misyonumuz",
                desc: "Kadınların ekonomik bağımsızlığını güçlendirmek, geleneksel üretim bilgisini yaşatmak ve doğal ürünleri tüketicilerle buluşturmak.",
              },
              {
                icon: "🔭",
                title: "Vizyonumuz",
                desc: "Türkiye'nin en güvenilir kadın kooperatifi markası olmak ve el yapımı ürünlerin değerini topluma aktarmak.",
              },
              {
                icon: "🌱",
                title: "Değerlerimiz",
                desc: "Doğallık, şeffaflık, dayanışma, sürdürülebilirlik ve kalite. Her ürünümüz bu değerlerle üretilir.",
              },
              {
                icon: "🤝",
                title: "Adil Ticaret",
                desc: "Üreticilerimize adil gelir sağlayarak, hem üretici hem de tüketici için değer yaratan bir model oluşturuyoruz.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="p-6 bg-white rounded-2xl border border-border hover:shadow-card transition-all duration-300"
              >
                <span className="text-3xl mb-3 block">{item.icon}</span>
                <h3 className="text-base font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="gradient-hero rounded-2xl p-8 sm:p-10 text-center">
            <h3 className="text-xl font-bold text-white mb-8">Rakamlarla Biz</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {[
                { value: "50+", label: "Üretici Kadın" },
                { value: "150+", label: "El Yapımı Ürün" },
                { value: "1000+", label: "Mutlu Müşteri" },
                { value: "4", label: "Ürün Kategorisi" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                  <p className="text-xs text-primary-200">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

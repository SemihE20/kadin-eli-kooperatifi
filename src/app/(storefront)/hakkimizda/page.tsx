import type { Metadata } from "next";
import Image from "next/image";
import PageHeader from "@/components/layout/PageHeader";

export const metadata: Metadata = {
  title: "Hakkımızda",
  description: "Gözler Kadıneli Kooperatifi hakkında bilgi. Misyonumuz, vizyonumuz ve hikayemiz.",
};

export default function AboutPage() {
  return (
    <>
      <PageHeader
        title="Hakkımızda"
        description="Gözler Kadıneli Kooperatifi'nin hikayesini keşfedin."
        breadcrumbs={[
          { label: "Ana Sayfa", href: "/" },
          { label: "Hakkımızda" },
        ]}
      />

      {/* Story */}
      <section className="py-16 texture-paper">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="relative w-28 h-28 mx-auto mb-6 rounded-full overflow-hidden ring-4 ring-earth-200">
              <Image src="/logo.png" alt="Gözler Kadıneli Kooperatifi" fill className="object-cover" />
            </div>
            <h2 className="font-heading text-2xl font-bold text-foreground mb-4">Hikayemiz</h2>
            <p className="text-sm text-muted leading-relaxed max-w-2xl mx-auto mb-4">
              Gözler Kadıneli Kooperatifi, Denizli&apos;nin Pamukkale ilçesine bağlı Gözler Mahallesi&apos;nde
              kadınların el emeklerini değerlendirmek, ekonomik bağımsızlıklarını güçlendirmek ve 
              doğal üretimi desteklemek amacıyla kurulmuştur.
            </p>
            <p className="text-sm text-muted leading-relaxed max-w-2xl mx-auto">
              Kooperatifimiz, geleneksel üretim yöntemlerini modern dünyaya taşıyarak, hem 
              kadınlarımızın emeklerinin karşılığını almasını hem de tüketicilerin doğal, 
              katkısız ürünlere ulaşmasını sağlamaktadır.
            </p>
          </div>
        </div>
      </section>

      {/* Kadın İstihdamı Vurgusu */}
      <section className="py-16 bg-cream-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block text-xs font-semibold text-primary-600 uppercase tracking-widest mb-2">
              Kadın İstihdamı
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground mb-3">
              Kadın Emeğiyle Güçlenen Toplum
            </h2>
            <p className="text-sm text-muted max-w-2xl mx-auto leading-relaxed">
              Kooperatifimiz, kırsal bölgedeki kadınlara ekonomik bağımsızlık kazandırarak 
              toplumsal dönüşüme katkıda bulunuyor.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
            {[
              {
                icon: "👩‍🌾",
                value: "50+",
                label: "Üretici Kadın",
                desc: "Kooperatifimizde aktif olarak üreten kadın sayısı",
              },
              {
                icon: "💪",
                value: "%100",
                label: "Kadın Yönetimi",
                desc: "Kooperatifin yönetim kurulunun tamamı kadınlardan oluşur",
              },
              {
                icon: "🌟",
                value: "7/24",
                label: "Destek",
                desc: "Üretici kadınlarımıza sürekli eğitim ve mentorluk desteği",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="text-center p-6 bg-card rounded-2xl border border-earth-200 hover:shadow-card transition-all"
              >
                <span className="text-3xl mb-3 block">{stat.icon}</span>
                <p className="text-2xl font-heading font-bold text-primary-700 mb-1">{stat.value}</p>
                <p className="text-sm font-semibold text-foreground mb-1">{stat.label}</p>
                <p className="text-xs text-muted">{stat.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-card rounded-2xl border border-earth-200 p-6 sm:p-8">
            <h3 className="font-heading text-lg font-bold text-foreground mb-4">
              🌿 Kadın Ellerinden Doğaya
            </h3>
            <div className="space-y-3 text-sm text-muted leading-relaxed">
              <p>
                Kırsal bölgelerde kadınlar, geleneksel bilgi ve becerilerin taşıyıcılarıdır. 
                Tıbbi bitki toplama, gıda üretimi ve fidan yetiştirme konusunda nesiller boyu 
                aktarılan bu bilgi birikimini korumak ve ekonomik değere dönüştürmek en büyük 
                amacımızdır.
              </p>
              <p>
                Her bir ürünümüz, bir kadının emeği, sabri ve sevgisiyle hazırlanmaktadır. 
                Kooperatifimiz sayesinde kadınlarımız hem aile ekonomisine katkıda bulunuyor 
                hem de toplum içinde güçlenen bireyler olarak var oluyorlar.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
                className="p-6 bg-card rounded-2xl border border-earth-200 hover:shadow-card transition-all duration-300"
              >
                <span className="text-3xl mb-3 block">{item.icon}</span>
                <h3 className="font-heading text-base font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="gradient-hero rounded-2xl p-8 sm:p-10 text-center relative overflow-hidden">
            <div className="absolute inset-0 pattern-botanical opacity-30" />
            <div className="relative z-10">
              <h3 className="font-heading text-xl font-bold text-white mb-8">Rakamlarla Biz</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                {[
                  { value: "50+", label: "Üretici Kadın" },
                  { value: "150+", label: "El Yapımı Ürün" },
                  { value: "1000+", label: "Mutlu Müşteri" },
                  { value: "3", label: "Ürün Kategorisi" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <p className="text-3xl font-heading font-bold text-white mb-1">{stat.value}</p>
                    <p className="text-xs text-cream-300/70">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

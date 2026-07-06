import type { Metadata } from "next";
import PageHeader from "@/components/layout/PageHeader";
import Button from "@/components/ui/Button";
import { generateWhatsAppLink } from "@/lib/utils";

export const metadata: Metadata = {
  title: "İletişim",
  description: "Gözler Kadıneli Kooperatifi ile iletişime geçin. Adres, telefon ve iletişim formu.",
};

export default function ContactPage() {
  const whatsappLink = generateWhatsAppLink(
    "Merhaba! Gözler Kadıneli Kooperatifi hakkında bilgi almak istiyorum."
  );

  return (
    <>
      <PageHeader
        title="İletişim"
        description="Sorularınız veya siparişleriniz için bize ulaşın."
        breadcrumbs={[
          { label: "Ana Sayfa", href: "/" },
          { label: "İletişim" },
        ]}
      />

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <h2 className="font-heading text-xl font-bold text-foreground mb-6">Bize Ulaşın</h2>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-4 p-4 bg-card rounded-2xl border border-earth-200">
                  <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-1">Adres</h3>
                    <p className="text-sm text-muted">Gözler Mahallesi, Mudanya / Bursa</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-card rounded-2xl border border-earth-200">
                  <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-1">Telefon</h3>
                    <p className="text-sm text-muted">+90 (224) 000 00 00</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-card rounded-2xl border border-earth-200">
                  <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-1">E-posta</h3>
                    <p className="text-sm text-muted">info@gozlerkooperatif.com</p>
                  </div>
                </div>

                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 p-4 bg-green-50 rounded-2xl border border-green-200 hover:bg-green-100 transition-colors group"
                >
                  <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-1 group-hover:text-green-700">WhatsApp</h3>
                    <p className="text-sm text-muted">Hemen yazın, en kısa sürede dönüş yapalım!</p>
                  </div>
                </a>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="font-heading text-xl font-bold text-foreground mb-6">Mesaj Gönderin</h2>
              <form className="space-y-4 p-6 bg-card rounded-2xl border border-earth-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="name" className="text-sm font-medium text-foreground">Ad Soyad</label>
                    <input
                      type="text"
                      id="name"
                      className="w-full px-4 py-2.5 rounded-xl border border-earth-200 text-sm bg-white placeholder:text-muted hover:border-primary-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-all"
                      placeholder="Adınız Soyadınız"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="email" className="text-sm font-medium text-foreground">E-posta</label>
                    <input
                      type="email"
                      id="email"
                      className="w-full px-4 py-2.5 rounded-xl border border-earth-200 text-sm bg-white placeholder:text-muted hover:border-primary-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-all"
                      placeholder="ornek@mail.com"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="subject" className="text-sm font-medium text-foreground">Konu</label>
                  <input
                    type="text"
                    id="subject"
                    className="w-full px-4 py-2.5 rounded-xl border border-earth-200 text-sm bg-white placeholder:text-muted hover:border-primary-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-all"
                    placeholder="Mesajınızın konusu"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="message" className="text-sm font-medium text-foreground">Mesajınız</label>
                  <textarea
                    id="message"
                    rows={5}
                    className="w-full px-4 py-2.5 rounded-xl border border-earth-200 text-sm bg-white placeholder:text-muted hover:border-primary-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-all resize-none"
                    placeholder="Mesajınızı buraya yazın..."
                  />
                </div>
                <Button type="submit" fullWidth size="lg">
                  Gönder
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

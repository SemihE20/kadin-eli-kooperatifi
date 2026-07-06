import Link from "next/link";
import Image from "next/image";
import {
  NAV_ITEMS,
  SITE_NAME,
  CONTACT_ADDRESS,
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_TEL,
  CONTACT_EMAIL,
} from "@/lib/constants";
import NewsletterForm from "./NewsletterForm";

export default function Footer() {
  return (
    <footer className="bg-earth-900 text-earth-200">
      {/* Wave Separator */}
      <div className="relative -mt-px">
        <svg
          viewBox="0 0 1440 60"
          className="w-full h-[40px] sm:h-[60px] fill-background"
          preserveAspectRatio="none"
        >
          <path d="M0,0 C360,60 1080,0 1440,40 L1440,0 L0,0 Z" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12 texture-linen">
        {/* Newsletter */}
        <div className="mb-10 pb-10 border-b border-earth-800 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h3 className="font-heading text-base font-bold text-cream-100 mb-1">
              Bültenimize Abone Olun
            </h3>
            <p className="text-xs text-earth-400">
              Yeni ürünler ve kampanyalardan ilk siz haberdar olun.
            </p>
          </div>
          <NewsletterForm />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-earth-700">
                <Image
                  src="/logo.png"
                  alt={SITE_NAME}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <p className="font-heading font-bold text-cream-100 text-sm">Gözler</p>
                <p className="text-[10px] text-earth-400 tracking-wide uppercase">
                  Kadıneli Kooperatifi
                </p>
              </div>
            </div>
            <p className="text-sm text-earth-400 leading-relaxed">
              El emeği, göz nuru ürünler. Kadın ellerinden doğaya ve
              sofralarınıza doğal, sağlıklı ürünler.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading text-sm font-semibold text-cream-100 mb-4 uppercase tracking-wider">
              Hızlı Bağlantılar
            </h3>
            <ul className="space-y-2.5">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-earth-400 hover:text-cream-200 transition-colors duration-200"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-heading text-sm font-semibold text-cream-100 mb-4 uppercase tracking-wider">
              Kategoriler
            </h3>
            <ul className="space-y-2.5">
              {[
                { label: "Tıbbi ve Aromatik Bitkiler", slug: "bitki" },
                { label: "Gıda Ürünleri", slug: "gida" },
                { label: "Fidan ve Tohum", slug: "fidan" },
              ].map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/urunler?kategori=${cat.slug}`}
                    className="text-sm text-earth-400 hover:text-cream-200 transition-colors duration-200"
                  >
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-heading text-sm font-semibold text-cream-100 mb-4 uppercase tracking-wider">
              İletişim
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5">
                <svg
                  className="w-4 h-4 mt-0.5 text-earth-500 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="text-sm text-earth-400">
                  {CONTACT_ADDRESS}
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <svg
                  className="w-4 h-4 mt-0.5 text-earth-500 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="text-sm text-earth-400 hover:text-cream-200 transition-colors"
                >
                  {CONTACT_EMAIL}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <svg
                  className="w-4 h-4 mt-0.5 text-earth-500 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <a
                  href={`tel:${CONTACT_PHONE_TEL}`}
                  className="text-sm text-earth-400 hover:text-cream-200 transition-colors"
                >
                  {CONTACT_PHONE_DISPLAY}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-earth-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-earth-500">
            © {new Date().getFullYear()} {SITE_NAME}. Tüm hakları saklıdır.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/hakkimizda"
              className="text-xs text-earth-500 hover:text-cream-200 transition-colors"
            >
              Gizlilik Politikası
            </Link>
            <Link
              href="/hakkimizda"
              className="text-xs text-earth-500 hover:text-cream-200 transition-colors"
            >
              Kullanım Koşulları
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

import type { Metadata } from "next";
import { DM_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sans",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const playfair = Playfair_Display({
  subsets: ["latin", "latin-ext"],
  variable: "--font-heading",
  display: "swap",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: {
    default: "Gözler Kadıneli Kooperatifi | El Emeği, Göz Nuru Ürünler",
    template: "%s | Gözler Kadıneli Kooperatifi",
  },
  description:
    "Kadın ellerinden doğaya ve sofralarınıza doğal, sağlıklı, el yapımı ürünler. Gıda, el işi, doğal ürünler ve hediyelik çeşitleri.",
  keywords: [
    "kooperatif",
    "kadın kooperatifi",
    "el yapımı",
    "doğal ürünler",
    "el işi",
    "organik gıda",
    "hediyelik",
    "gözler",
  ],
  authors: [{ name: "Gözler Kadıneli Kooperatifi" }],
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    siteName: "Gözler Kadıneli Kooperatifi",
    title: "Gözler Kadıneli Kooperatifi | El Emeği, Göz Nuru Ürünler",
    description:
      "Kadın ellerinden doğaya ve sofralarınıza doğal, sağlıklı, el yapımı ürünler.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={`${dmSans.variable} ${playfair.variable} h-full`}>
      <body className="min-h-full flex flex-col font-sans antialiased">
        {children}
      </body>
    </html>
  );
}

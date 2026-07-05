import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap",
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
    <html lang="tr" className={`${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col font-sans antialiased">
        {children}
      </body>
    </html>
  );
}

import HeroBanner from "@/components/home/HeroBanner";
import CategoryShowcase from "@/components/home/CategoryShowcase";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import AboutPreview from "@/components/home/AboutPreview";
import WhatsAppCTA from "@/components/home/WhatsAppCTA";

export default function HomePage() {
  return (
    <>
      <HeroBanner />
      <CategoryShowcase />
      <FeaturedProducts />
      <AboutPreview />
      <WhatsAppCTA />
    </>
  );
}

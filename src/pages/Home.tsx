import { HeroSection } from '@/components/HeroSection';
import { AboutSection } from '@/components/AboutSection';
import { FAQSection } from '@/components/FAQSection';
import { Footer } from '@/components/Footer';

export function Home() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <FAQSection />
      <Footer />
    </>
  );
}

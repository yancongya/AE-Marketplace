import { HeroSection } from '@/components/HeroSection';
import { AboutSection } from '@/components/AboutSection';
import { Footer } from '@/components/Footer';

export function Home() {
  return (
    <div className="animate-fade-in">
      <HeroSection />
      <AboutSection />
      <Footer />
    </div>
  );
}

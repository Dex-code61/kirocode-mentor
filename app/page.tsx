import { Navbar } from '@/components/layout/navbar';
import { BackgroundWrapper } from '@/components/layout/background-wrapper';
import { HeroSection } from '@/components/home/hero-section';
import { FeaturesSection } from '@/components/home/features-section';
import { HowItWorksSection } from '@/components/home/how-it-works-section';
import { CTASection } from '@/components/home/cta-section';
import { Footer } from '@/components/layout/footer';

export default function Home() {
  return (
    <BackgroundWrapper>
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <CTASection />
      <Footer />
    </BackgroundWrapper>
  );
}

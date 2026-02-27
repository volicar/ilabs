import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/sections/HeroSection';
import ServicesSection from '@/components/sections/ServicesSection';
import AboutSection from '@/components/sections/AboutSection';
import TestimonialsCarousel from '@/components/sections/TestimonialsCarousel';
import NeighborhoodsSection from '@/components/sections/NeighborhoodsSection'
import LocationSection from '@/components/sections/LocationSection';
import CTASection from '@/components/sections/CTASection';
import WhatsAppButton from '@/components/ui/WhatsAppButton';
import { testimonials, testimonialsConfig } from '@/lib/config';
import BannersDinamicos from '@/components/sections/BannersDinamicos';
import PromocoesDinamicas from '@/components/sections/PromocoesDinamicas';


export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-primary-50 to-slate-100">
      <Header />
      <BannersDinamicos />
      <main>
        <ServicesSection />
        <PromocoesDinamicas />
        <AboutSection />
        <TestimonialsCarousel 
        testimonials={testimonials}
        autoPlayInterval={testimonialsConfig.autoPlayInterval}
        />
        <NeighborhoodsSection /> 
        <LocationSection />
        <CTASection />
      </main>
      <Footer />
      
      {/* WhatsApp Floating Button */}
      <WhatsAppButton variant="floating" />
    </div>
  );
}

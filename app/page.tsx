import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/sections/HeroSection';
import ServicesSection from '@/components/sections/ServicesSection';
import AboutSection from '@/components/sections/AboutSection';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import LocationSection from '@/components/sections/LocationSection';
import CTASection from '@/components/sections/CTASection';
import WhatsAppButton from '@/components/ui/WhatsAppButton';


export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-primary-50 to-slate-100">
      <Header />
      <HeroSection />
      <main>
        <ServicesSection />
        <AboutSection />
        <TestimonialsSection />
        <LocationSection />
        <CTASection />
      </main>
      <Footer />
      
      {/* WhatsApp Floating Button */}
      <WhatsAppButton variant="floating" />
    </div>
  );
}

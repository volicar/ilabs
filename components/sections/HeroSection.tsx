import { Award } from 'lucide-react';
import { siteConfig } from '@/lib/config';
import WhatsAppButton from '@/components/ui/WhatsAppButton';

export default function HeroSection() {
  return (
    <section className="pt-32 pb-20 px-4 sm:px-6">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 animate-fadeInLeft">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold text-slate-900 leading-tight">
              Sua saúde é nossa
              <span className="block bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
                prioridade
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 leading-relaxed">
              Atendimento médico completo com profissionais especializados e tecnologia de ponta. 
              Agende sua consulta agora pelo WhatsApp!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <WhatsAppButton variant="primary" className="group text-base sm:text-lg">
                Agendar pelo WhatsApp
              </WhatsAppButton>
              <a 
                href="#services"
                className="bg-white text-slate-700 px-6 sm:px-8 py-4 rounded-full hover:shadow-lg transition-all border-2 border-slate-200 font-semibold text-center text-base sm:text-lg"
              >
                Conheça os Serviços
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-slate-200">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-primary-600">{siteConfig.stats.years}</div>
                <div className="text-xs sm:text-sm text-slate-600">Anos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-primary-600">{siteConfig.stats.patients}</div>
                <div className="text-xs sm:text-sm text-slate-600">Pacientes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-primary-600">{siteConfig.stats.satisfaction}</div>
                <div className="text-xs sm:text-sm text-slate-600">Satisfação</div>
              </div>
            </div>
          </div>

          <div className="relative animate-fadeInRight">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-400 to-primary-300 rounded-3xl rotate-3 opacity-20"></div>
            <div className="relative bg-gradient-to-br from-primary-100 to-primary-50 rounded-3xl p-6 sm:p-8 shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=800&h=1000&fit=crop"
                alt="Profissional de saúde"
                className="rounded-2xl w-full h-[400px] sm:h-[500px] object-cover shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

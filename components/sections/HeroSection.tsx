import HeroCarousel from "../ui/HeroCarousel";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import { siteConfig } from "@/lib/config";

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
              Atendimento laboratorial completo, profissionais especializados e
              tecnologia de ponta. Agende seus exames agora pelo WhatsApp!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <WhatsAppButton
                variant="primary"
                className="group text-base sm:text-lg"
              >
                Agendar pelo WhatsApp
              </WhatsAppButton>
              <a
                href="#services"
                className="bg-white text-slate-700 px-6 sm:px-8 py-4 rounded-full hover:shadow-lg transition-all border-2 border-slate-200 font-semibold text-center text-base sm:text-lg"
              >
                Conheça os Serviços
              </a>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-slate-200">
              <div className="text-center">
              </div>
              <div className="text-center"></div>
            </div>
          </div>

          {/* 👇 AQUI: só trocou a imagem pelo componente */}
          <div className="relative animate-fadeInRight">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-400 to-primary-300 rounded-3xl rotate-3 opacity-20"></div>
            <div className="relative bg-gradient-to-br from-primary-100 to-primary-50 rounded-3xl p-6 sm:p-8 shadow-2xl">
              <HeroCarousel />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

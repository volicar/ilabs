'use client';

import { useEffect, useState } from 'react';
import HeroCarousel from '../ui/HeroCarousel';
import WhatsAppButton from '@/components/ui/WhatsAppButton';
import { FileText } from 'lucide-react';
import type { HeroContent } from '@/lib/supabase/client';

const STATIC: HeroContent = {
  id: '',
  title_main: 'Sua saúde é nossa',
  title_highlight: 'prioridade',
  subtitle: 'Atendimento laboratorial completo, profissionais especializados e tecnologia de ponta. Agende seus exames agora pelo WhatsApp!',
  updated_at: '',
};

export default function HeroSection() {
  const [content, setContent] = useState<HeroContent>(STATIC);

  useEffect(() => {
    async function fetchContent() {
      try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        if (!supabaseUrl || !supabaseKey) return;

        const { createClient } = await import('@/lib/supabase/client');
        const supabase = createClient();
        const { data } = await supabase
          .from('hero_content')
          .select('*')
          .limit(1)
          .single();

        if (data) setContent(data);
      } catch {
        // mantém conteúdo estático
      }
    }
    fetchContent();
  }, []);

  return (
    <section className="pt-32 pb-20 px-4 sm:px-6">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 animate-fadeInLeft">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold text-slate-900 leading-tight">
              {content.title_main}
              <span className="block bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
                {content.title_highlight}
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 leading-relaxed">
              {content.subtitle}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <WhatsAppButton variant="primary" className="group text-base sm:text-lg">
                Agendar pelo WhatsApp
              </WhatsAppButton>
              <a
                href="#servicos"
                className="bg-white text-slate-700 px-6 sm:px-8 py-4 rounded-full hover:shadow-lg transition-all border-2 border-slate-200 font-semibold text-center text-base sm:text-lg"
              >
                Conheça os Serviços
              </a>
            </div>

            <div className="sm:hidden pt-2">
              <a
                href="https://portal.worklabweb.com.br/resultados-on-line/2317"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-primary-600 hover:bg-primary-700 text-white px-6 py-4 rounded-full font-bold text-center text-base transition-all shadow-lg hover:shadow-xl"
              >
                <FileText size={20} />
                Ver Meus Resultados
              </a>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-slate-200">
              <div className="text-center" />
              <div className="text-center" />
            </div>
          </div>

          <div className="relative animate-fadeInRight">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-400 to-primary-300 rounded-3xl rotate-3 opacity-20" />
            <div className="relative bg-gradient-to-br from-primary-100 to-primary-50 rounded-3xl p-6 sm:p-8 shadow-2xl">
              <HeroCarousel />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

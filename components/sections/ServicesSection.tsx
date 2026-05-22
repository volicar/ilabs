'use client';

import { useEffect, useState } from 'react';
import { services as staticServices } from '@/lib/config';
import ServiceCard from '@/components/ui/ServiceCard';
import type { Service } from '@/lib/supabase/client';

type CardService = { id: string | number; title: string; description: string; icon: string };

const STATIC: CardService[] = staticServices.map((s) => ({ ...s, id: s.id }));

export default function ServicesSection() {
  const [services, setServices] = useState<CardService[]>(STATIC);

  useEffect(() => {
    async function fetchServices() {
      try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        if (!supabaseUrl || !supabaseKey) return;

        const { createClient } = await import('@/lib/supabase/client');
        const supabase = createClient();
        const { data } = await supabase
          .from('services')
          .select('*')
          .eq('active', true)
          .order('order_index', { ascending: true });

        if (data && data.length > 0) setServices(data as Service[]);
      } catch {
        // mantém serviços estáticos
      }
    }
    fetchServices();
  }, []);

  return (
    <section id="servicos" className="py-20 px-4 sm:px-6 bg-white">
      <div className="container mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-semibold">
            Nossos Serviços
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-slate-900 mt-4 mb-4">
            Cuidado completo para você
          </h2>
          <p className="text-base sm:text-lg text-slate-600">
            Oferecemos diversos atendimentos de forma humanizada e acolhedora
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <ServiceCard
              key={String(service.id)}
              title={service.title}
              description={service.description}
              icon={service.icon}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

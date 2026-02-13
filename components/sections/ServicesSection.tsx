import { services } from '@/lib/config';
import ServiceCard from '@/components/ui/ServiceCard';

export default function ServicesSection() {
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
            Oferecemos especialidades médicas completas com atendimento humanizado
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <ServiceCard
              key={service.id}
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

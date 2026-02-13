import { MapPin } from 'lucide-react';
import WhatsAppButton from '@/components/ui/WhatsAppButton';

export default function NeighborhoodsSection() {
  const neighborhoods = [
    { name: 'Bonsucesso', isMain: true },
    { name: 'Campo Grande', isMain: false },
    { name: 'Bangu', isMain: false },
    { name: 'Madureira', isMain: false },
    { name: 'Tijuca', isMain: false },
    { name: 'Centro', isMain: false },
    { name: 'Taquara', isMain: false },
  ];

  return (
    <section id="bairros" className="py-20 px-4 sm:px-6 bg-white">
      <div className="container mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-semibold">
            Cobertura
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-sans font-bold text-slate-900 mt-4 mb-4">
            Atendemos em diversos bairros
          </h2>
          <p className="text-base sm:text-lg text-slate-600">
            Estamos prontos para atender você com qualidade e agilidade
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
          {neighborhoods.map((neighborhood, index) => (
            <div
              key={index}
              className={`relative p-6 rounded-2xl text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${
                neighborhood.isMain
                  ? 'bg-gradient-to-br from-primary-600 to-primary-500 text-white shadow-lg'
                  : 'bg-gradient-to-br from-slate-50 to-primary-50 border border-slate-200'
              }`}
            >
              <div className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center ${
                neighborhood.isMain ? 'bg-white/20' : 'bg-primary-100'
              }`}>
                <MapPin 
                  size={24} 
                  className={neighborhood.isMain ? 'text-white' : 'text-primary-600'}
                />
              </div>
              <h3 className={`font-bold text-base sm:text-lg ${
                neighborhood.isMain ? 'text-white' : 'text-slate-900'
              }`}>
                {neighborhood.name}
              </h3>
              {neighborhood.isMain && (
                <span className="inline-block mt-2 text-xs bg-white/20 px-3 py-1 rounded-full">
                  Unidade Principal
                </span>
              )}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center bg-gradient-to-br from-slate-50 to-primary-50 rounded-2xl p-8 sm:p-12">
          <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
            Precisa agendar em outro bairro?
          </h3>
          <p className="text-base sm:text-lg text-slate-600 mb-6 max-w-2xl mx-auto">
            Entre em contato conosco pelo WhatsApp e verifique a disponibilidade de atendimento na sua região
          </p>
          <WhatsAppButton 
            variant="primary" 
            className="px-8 sm:px-10 py-4 sm:py-5 text-base sm:text-lg"
          >
            Consultar Disponibilidade
          </WhatsAppButton>
        </div>
      </div>
    </section>
  );
}
import { MapPin, MessageCircle } from 'lucide-react';
import { createWhatsAppLink } from '@/lib/utils';

export default function NeighborhoodsSection() {
  const neighborhoods = [
    { name: 'Bonsucesso', isMain: true },
    { name: 'Bangu', isMain: false },
    { name: 'Campo Grande', isMain: false },
    { name: 'Centro', isMain: false },
    { name: 'Madureira', isMain: false },
    { name: 'Tijuca', isMain: false },
    { name: 'Taquara', isMain: false },
  ];

  return (
    <section id="bairros" className="py-12 px-4 sm:px-6 bg-slate-50">
      <div className="container mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-sans font-bold text-slate-900 mb-3">
            Atendemos em diversos bairros
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Clique no seu bairro para saber dias, horários e endereço
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto">
          {neighborhoods.map((neighborhood, index) => (
            <a
              key={index}
              href={createWhatsAppLink(`Gostaria de atendimento em ${neighborhood.name}`)}
              target="_blank"
              rel="noopener noreferrer"
              className={`group relative p-4 rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
                neighborhood.isMain
                  ? 'bg-gradient-to-br from-primary-600 to-primary-500 text-white shadow-md'
                  : 'bg-white border-2 border-slate-200 hover:border-primary-300'
              }`}
            >
              <div className="flex flex-col items-center text-center space-y-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  neighborhood.isMain ? 'bg-white/20' : 'bg-primary-100 group-hover:bg-primary-200'
                }`}>
                  <MapPin 
                    size={20} 
                    className={neighborhood.isMain ? 'text-white' : 'text-primary-600'}
                  />
                </div>
                
                <div>
                  <h3 className={`font-bold text-sm ${
                    neighborhood.isMain ? 'text-white' : 'text-slate-900'
                  }`}>
                    {neighborhood.name}
                  </h3>
                  {neighborhood.isMain && (
                    <span className="text-[10px] text-white/80">Principal</span>
                  )}
                </div>

                <div className={`flex items-center space-x-1 text-xs font-medium ${
                  neighborhood.isMain ? 'text-white/90' : 'text-primary-600'
                }`}>
                  <MessageCircle size={14} />
                  <span>Consultar</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
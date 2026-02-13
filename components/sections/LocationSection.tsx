import { MapPin, Clock, Phone } from 'lucide-react';
import { siteConfig } from '@/lib/config';
import WhatsAppButton from '@/components/ui/WhatsAppButton';

export default function LocationSection() {
  return (
    <section id="localizacao" className="py-20 px-4 sm:px-6 bg-white">
      <div className="container mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-semibold">
            Onde Estamos
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-slate-900 mt-4 mb-4">
            Venha nos visitar
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-slate-50 to-primary-50 rounded-2xl p-6 sm:p-8 space-y-6">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-6">Informações de Contato</h3>
            
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <MapPin className="text-primary-600" size={24} />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 mb-1 text-sm sm:text-base">Endereço</h4>
                <p className="text-sm sm:text-base text-slate-600">
                  {siteConfig.contact.address.street}<br />
                  {siteConfig.contact.address.neighborhood}, {siteConfig.contact.address.city} - {siteConfig.contact.address.state}<br />
                  CEP: {siteConfig.contact.address.zip}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Clock className="text-primary-600" size={24} />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 mb-1 text-sm sm:text-base">Horário de Funcionamento</h4>
                <p className="text-sm sm:text-base text-slate-600">
                  {siteConfig.hours.weekday}<br />
                  {siteConfig.hours.saturday}<br />
                  {siteConfig.hours.sunday}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Phone className="text-primary-600" size={24} />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 mb-1 text-sm sm:text-base">Telefone</h4>
                <p className="text-sm sm:text-base text-slate-600">{siteConfig.contact.phone}</p>
              </div>
            </div>

            <WhatsAppButton variant="primary" className="w-full mt-6 text-sm sm:text-base">
              Agendar pelo WhatsApp
            </WhatsAppButton>
          </div>

          <div className="rounded-2xl overflow-hidden shadow-xl h-[400px] sm:h-[500px]">
            <iframe
              src={siteConfig.mapsEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
}

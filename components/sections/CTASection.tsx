import WhatsAppButton from '@/components/ui/WhatsAppButton';

export default function CTASection() {
  return (
    <section className="py-20 px-4 sm:px-6 bg-gradient-to-br from-slate-900 via-primary-900 to-slate-900 text-white">
      <div className="container mx-auto text-center max-w-3xl">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold mb-6">
          Pronto para cuidar da sua saúde?
        </h2>
        <p className="text-lg sm:text-xl text-primary-100 mb-8">
          Agende seu exame pelo WhatsApp e seja atendido com excelência
        </p>
        <WhatsAppButton 
          variant="primary" 
          className="bg-white text-primary-600 hover:shadow-2xl px-8 sm:px-10 py-4 sm:py-5 text-base sm:text-lg"
        >
          Agendar Consulta Agora
        </WhatsAppButton>
      </div>
    </section>
  );
}

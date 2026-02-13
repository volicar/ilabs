import { CheckCircle } from "lucide-react";

export default function AboutSection() {
  const features = [
    {
      title: "Atendimento humanizado",
      description: "",
    },
    {
      title: "Resultados rápidos e seguros.",
      description: "",
    },
    {
      title: "Preços acessíveis",
      description: "",
    },
  ];

  return (
    <section
      id="sobre"
      className="py-20 px-4 sm:px-6 bg-gradient-to-br from-primary-600 to-primary-400 text-white"
    >
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="bg-white/20 text-white px-4 py-2 rounded-full text-sm font-semibold inline-block">
              Sobre Nós
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold">
              Tradição e inovação em saúde
            </h2>
            <p className="text-base sm:text-lg text-primary-50 leading-relaxed">
              O iLabs Laboratório nasceu para cuidar de pessoas. Mais do que
              resultados, entregamos confiança, acolhimento e a tranquilidade de
              estar em boas mãos.
            </p>
            <div className="space-y-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="text-white" size={16} />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1 text-sm sm:text-base">
                      {feature.title}
                    </h4>
                    <p className="text-sm sm:text-base text-primary-50">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-white/10 rounded-3xl -rotate-3"></div>
            <img
              src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&h=600&fit=crop"
              alt="Equipe médica"
              className="relative rounded-3xl shadow-2xl w-full h-[350px] sm:h-[400px] object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

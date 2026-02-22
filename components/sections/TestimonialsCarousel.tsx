'use client';

import { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  text: string;
  rating: number;
  photo?: string; // URL da foto (opcional)
  date?: string;  // Data da avaliação (opcional)
}

interface TestimonialsCarouselProps {
  testimonials: Testimonial[];
  autoPlayInterval?: number; // em milissegundos (padrão: 5000)
}

export default function TestimonialsCarousel({
  testimonials,
  autoPlayInterval = 5000,
}: TestimonialsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Auto-play
  useEffect(() => {
    if (!isHovered && testimonials.length > 1) {
      const interval = setInterval(nextSlide, autoPlayInterval);
      return () => clearInterval(interval);
    }
  }, [isHovered, testimonials.length, autoPlayInterval]);

  if (testimonials.length === 0) return null;

  return (
    <section
      id="testimonials"
      className="py-20 px-4 sm:px-6 bg-gradient-to-br from-slate-50 to-primary-50"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="container mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-semibold">
            Depoimentos
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-sans font-bold text-slate-900 mt-4 mb-4">
            O que nossos clientes dizem
          </h2>
          <p className="text-base sm:text-lg text-slate-600">
            Avaliações reais do Google
          </p>
        </div>

        {/* Carrossel */}
        <div className="relative max-w-4xl mx-auto">
          <div className="relative bg-white rounded-3xl shadow-2xl p-8 sm:p-12 min-h-[400px] sm:min-h-[350px]">
            {/* Ícone de aspas */}
            <div className="absolute top-6 left-6 text-primary-200">
              <Quote size={48} fill="currentColor" />
            </div>

            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className={`transition-opacity duration-500 ${
                  index === currentIndex ? 'opacity-100' : 'opacity-0 absolute inset-0 pointer-events-none'
                }`}
              >
                {/* Conteúdo do depoimento */}
                <div className="flex flex-col items-center text-center pt-8">
                  {/* Foto */}
                  {testimonial.photo ? (
                    <img
                      src={testimonial.photo}
                      alt={testimonial.name}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-primary-200 mb-6 shadow-lg"
                    />
                  ) : (
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-primary-500 to-primary-400 flex items-center justify-center text-white text-2xl sm:text-3xl font-bold mb-6 shadow-lg border-4 border-primary-200">
                      {testimonial.name.charAt(0)}
                    </div>
                  )}

                  {/* Estrelas */}
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={i < testimonial.rating ? 'text-yellow-400' : 'text-slate-300'}
                        size={24}
                        fill={i < testimonial.rating ? 'currentColor' : 'none'}
                      />
                    ))}
                  </div>

                  {/* Texto */}
                  <p className="text-slate-700 text-lg sm:text-xl leading-relaxed mb-6 max-w-2xl italic">
                    "{testimonial.text}"
                  </p>

                  {/* Nome e data */}
                  <div>
                    <h4 className="text-slate-900 font-bold text-lg sm:text-xl">
                      {testimonial.name}
                    </h4>
                    {testimonial.date && (
                      <p className="text-slate-500 text-sm mt-1">{testimonial.date}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Controles de navegação */}
            {testimonials.length > 1 && (
              <>
                <button
                  onClick={prevSlide}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white hover:bg-primary-100 text-primary-600 p-3 rounded-full shadow-lg transition-all hover:scale-110 z-10"
                  aria-label="Depoimento anterior"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white hover:bg-primary-100 text-primary-600 p-3 rounded-full shadow-lg transition-all hover:scale-110 z-10"
                  aria-label="Próximo depoimento"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}
          </div>

          {/* Indicadores */}
          {testimonials.length > 1 && (
            <div className="flex justify-center space-x-2 mt-6">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === currentIndex
                      ? 'bg-primary-600 w-8'
                      : 'bg-slate-300 w-2 hover:bg-slate-400'
                  }`}
                  aria-label={`Ir para depoimento ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Link para Google */}
        <div className="text-center mt-8">
          <a
            href="https://www.google.com/maps/search/?api=1&query=iLABS+Laboratorio+Bonsucesso"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-semibold text-sm sm:text-base"
          >
            <Star size={18} fill="currentColor" />
            <span>Ver todas as avaliações no Google</span>
          </a>
        </div>
      </div>
    </section>
  );
}
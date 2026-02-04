'use client';

import { useEffect, useState } from 'react';
import { heroSlides, heroCarouselConfig } from '@/lib/config';

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!heroCarouselConfig.autoPlayInterval) return;

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % heroSlides.length);
    }, heroCarouselConfig.autoPlayInterval);

    return () => clearInterval(interval);
  }, []);

  const prevSlide = () => {
    setCurrent((prev) =>
      prev === 0 ? heroSlides.length - 1 : prev - 1
    );
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % heroSlides.length);
  };

  const slide = heroSlides[current];

  return (
    <div className="relative rounded-3xl overflow-hidden shadow-2xl h-[400px] sm:h-[500px] group">

      {/* IMAGEM */}
      <img
        src={slide.image}
        alt={slide.alt}
        className="w-full h-full object-cover transition-opacity duration-700"
      />

      {/* OVERLAY TEXTO */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex flex-col justify-end p-6 sm:p-8">
        <h3 className="text-white text-2xl sm:text-3xl font-bold">
          {slide.title}
        </h3>
        <p className="text-white/90 text-sm sm:text-base">
          {slide.subtitle}
        </p>
      </div>

      {/* SETA ESQUERDA */}
      {heroCarouselConfig.showControls && (
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 
                     bg-white/80 hover:bg-white text-slate-800 
                     w-10 h-10 rounded-full shadow 
                     flex items-center justify-center
                     opacity-0 group-hover:opacity-100 transition"
        >
          ‹
        </button>
      )}

      {/* SETA DIREITA */}
      {heroCarouselConfig.showControls && (
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 
                     bg-white/80 hover:bg-white text-slate-800 
                     w-10 h-10 rounded-full shadow 
                     flex items-center justify-center
                     opacity-0 group-hover:opacity-100 transition"
        >
          ›
        </button>
      )}

      {/* INDICADORES */}
      {heroCarouselConfig.showIndicators && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {heroSlides.map((slide, index) => (
            <button
              key={slide.id}
              onClick={() => setCurrent(index)}
              className={`h-2 w-2 rounded-full transition ${
                index === current
                  ? 'bg-primary-500'
                  : 'bg-white/60'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

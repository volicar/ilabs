'use client';

import { useState, useEffect, useRef } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  text: string;
  rating: number;
  photo?: string;
  date?: string;
}

interface Props {
  testimonials: Testimonial[];
  autoPlayInterval?: number;
}

export default function TestimonialsCarousel({
  testimonials,
  autoPlayInterval = 5000,
}: Props) {
  const [currentIndex, setCurrentIndex] = useState(1);
  const [isHovered, setIsHovered] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(true);

  const startX = useRef<number | null>(null);
  const currentTranslate = useRef(0);

  if (!testimonials || testimonials.length === 0) return null;

  // 🔥 Loop infinito (clones)
  const slides = [
    testimonials[testimonials.length - 1],
    ...testimonials,
    testimonials[0],
  ];

  const nextSlide = () => setCurrentIndex((prev) => prev + 1);
  const prevSlide = () => setCurrentIndex((prev) => prev - 1);

  // 🔥 Reset invisível
  useEffect(() => {
    if (currentIndex === slides.length - 1) {
      setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(1);
      }, 700);
    }

    if (currentIndex === 0) {
      setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(slides.length - 2);
      }, 700);
    }
  }, [currentIndex, slides.length]);

  useEffect(() => {
    if (!isTransitioning) {
      requestAnimationFrame(() => setIsTransitioning(true));
    }
  }, [isTransitioning]);

  // 🔥 Autoplay
  useEffect(() => {
    if (!isHovered && testimonials.length > 1) {
      const interval = setInterval(nextSlide, autoPlayInterval);
      return () => clearInterval(interval);
    }
  }, [isHovered, autoPlayInterval, testimonials.length]);

  // 🔥 Drag / Swipe
  const handleStart = (clientX: number) => {
    startX.current = clientX;
  };

  const handleMove = (clientX: number) => {
    if (startX.current === null) return;
    currentTranslate.current = startX.current - clientX;
  };

  const handleEnd = () => {
    if (startX.current === null) return;

    if (currentTranslate.current > 50) nextSlide();
    if (currentTranslate.current < -50) prevSlide();

    startX.current = null;
    currentTranslate.current = 0;
  };

  return (
    <section
      id="depoimentos"
      className="py-20 px-4 sm:px-6 bg-gradient-to-br from-slate-50 to-primary-50"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="container mx-auto max-w-4xl">

        {/* Card Carousel */}
        <div
          className="relative bg-white rounded-3xl shadow-2xl p-8 sm:p-12 min-h-[380px] overflow-hidden"
          onMouseDown={(e) => handleStart(e.clientX)}
          onMouseMove={(e) => handleMove(e.clientX)}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onTouchStart={(e) => handleStart(e.touches[0].clientX)}
          onTouchMove={(e) => handleMove(e.touches[0].clientX)}
          onTouchEnd={handleEnd}
        >
          {/* Quote Icon */}
          <div className="absolute top-6 left-6 text-primary-200 z-10">
            <Quote size={48} fill="currentColor" />
          </div>

          {/* Slides Wrapper */}
          <div
            className={`flex ${
              isTransitioning
                ? 'transition-transform duration-[700ms] ease-in-out will-change-transform'
                : ''
            }`}
            style={{
              transform: `translateX(-${currentIndex * 100}%)`,
            }}
          >
            {slides.map((testimonial, index) => (
              <div
                key={index}
                className="w-full flex-shrink-0 flex flex-col items-center text-center pt-8"
              >
                {testimonial.photo ? (
                  <img
                    src={testimonial.photo}
                    alt={testimonial.name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-primary-200 mb-6 shadow-lg"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-500 to-primary-400 flex items-center justify-center text-white text-3xl font-bold mb-6 shadow-lg border-4 border-primary-200">
                    {testimonial.name.charAt(0)}
                  </div>
                )}

                {/* Stars */}
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={24}
                      className={
                        i < testimonial.rating
                          ? 'text-yellow-400'
                          : 'text-slate-300'
                      }
                      fill={i < testimonial.rating ? 'currentColor' : 'none'}
                    />
                  ))}
                </div>

                {/* Text */}
                <p className="text-slate-700 text-lg sm:text-xl leading-relaxed mb-6 max-w-2xl italic">
                  "{testimonial.text}"
                </p>

                {/* Name */}
                <h4 className="text-slate-900 font-bold text-lg sm:text-xl">
                  {testimonial.name}
                </h4>

                {testimonial.date && (
                  <p className="text-slate-500 text-sm mt-1">
                    {testimonial.date}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Arrows */}
          {testimonials.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 bg-white hover:bg-primary-100 text-primary-600 p-3 rounded-full shadow-lg transition hover:scale-110 z-20"
              >
                <ChevronLeft size={24} />
              </button>

              <button
                onClick={nextSlide}
                className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 bg-white hover:bg-primary-100 text-primary-600 p-3 rounded-full shadow-lg transition hover:scale-110 z-20"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}
        </div>

        {/* ⭐ Google Premium Badge */}
        <div className="text-center mt-12">
          <a
            href="https://www.google.com/maps/search/?api=1&query=iLABS+Laboratorio+Bonsucesso"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 bg-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl border border-slate-200 transition-all duration-300 hover:-translate-y-1 hover:border-primary-300"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-50 group-hover:bg-primary-100 transition">
              <Star
                size={16}
                className="text-primary-600"
                fill="currentColor"
              />
            </div>

            <span className="text-slate-700 font-semibold text-sm sm:text-base group-hover:text-primary-700 transition">
              Ver todas as avaliações no Google
            </span>
          </a>
        </div>

      </div>
    </section>
  );
}
'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { heroSlides, heroCarouselConfig } from '@/lib/config';

const swipeConfidenceThreshold = 100;
const swipePower = (offset: number, velocity: number) =>
  Math.abs(offset) * velocity;

export default function HeroCarousel() {
  const [[current, direction], setCurrent] = useState<[number, number]>([0, 0]);

  useEffect(() => {
    if (!heroCarouselConfig.autoPlayInterval) return;

    const interval = setInterval(() => {
      paginate(1);
    }, heroCarouselConfig.autoPlayInterval);

    return () => clearInterval(interval);
  }, [current]);

  const paginate = (newDirection: number) => {
    setCurrent(([prev]) => {
      const next = (prev + newDirection + heroSlides.length) % heroSlides.length;
      return [next, newDirection];
    });
  };

  const slide = heroSlides[current];

  return (
    <div className="relative rounded-3xl overflow-hidden shadow-2xl h-[400px] sm:h-[500px] group isolate">
      <AnimatePresence initial={false} custom={direction}>
        <motion.img
          key={slide.id}
          src={slide.image}
          alt={slide.alt}
          className="absolute inset-0 w-full h-full object-cover select-none"
          draggable={false}
          custom={direction}
          initial={{ x: direction > 0 ? '100%' : '-100%', opacity: 1 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: direction > 0 ? '-100%' : '100%', opacity: 1 }}
          transition={{
            x: { duration: 0.7, ease: 'easeInOut' },
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.6}
          onDragEnd={(_, { offset, velocity }) => {
            const swipe = swipePower(offset.x, velocity.x);

            if (swipe < -swipeConfidenceThreshold) {
              paginate(1);
            } else if (swipe > swipeConfidenceThreshold) {
              paginate(-1);
            }
          }}
        />
      </AnimatePresence>

      {/* OVERLAY */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex flex-col justify-end p-6 sm:p-8 pointer-events-none">
        <h3 className="text-white text-2xl sm:text-3xl font-bold">
          {slide.title}
        </h3>
        <p className="text-white/90 text-sm sm:text-base">
          {slide.subtitle}
        </p>
      </div>

      {/* SETAS */}
      {heroCarouselConfig.showControls && (
        <>
          <button
            onClick={() => paginate(-1)}
            className="absolute left-4 top-1/2 -translate-y-1/2 
                       bg-white/80 hover:bg-white w-10 h-10 rounded-full shadow
                       hidden sm:flex items-center justify-center z-10"
          >
            ‹
          </button>

          <button
            onClick={() => paginate(1)}
            className="absolute right-4 top-1/2 -translate-y-1/2 
                       bg-white/80 hover:bg-white w-10 h-10 rounded-full shadow
                       hidden sm:flex items-center justify-center z-10"
          >
            ›
          </button>
        </>
      )}

      {/* INDICADORES */}
      {heroCarouselConfig.showIndicators && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {heroSlides.map((slideItem, index) => (
            <button
              key={slideItem.id}
              onClick={() =>
                setCurrent([index, index > current ? 1 : -1])
              }
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
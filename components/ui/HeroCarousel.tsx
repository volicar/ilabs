'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { heroSlides as staticSlides, heroCarouselConfig } from '@/lib/config';

type Slide = {
  id: string | number;
  image_url?: string;
  image?: string;
  alt: string;
  title: string;
  subtitle: string;
  is_campaign?: boolean;
  campaign_label?: string;
  campaign_ends_at?: string | null;
};

const swipeConfidenceThreshold = 100;
const swipePower = (offset: number, velocity: number) =>
  Math.abs(offset) * velocity;

const STATIC: Slide[] = staticSlides.map((s) => ({ ...s, id: s.id }));

export default function HeroCarousel() {
  const [[current, direction], setCurrent] = useState<[number, number]>([0, 0]);
  const [slides, setSlides] = useState<Slide[]>(STATIC);

  useEffect(() => {
    async function fetchSlides() {
      try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        if (!supabaseUrl || !supabaseKey) return;

        const { createClient } = await import('@/lib/supabase/client');
        const supabase = createClient();

        const now = new Date().toISOString();

        const { data } = await supabase
          .from('hero_slides')
          .select('*')
          .eq('active', true)
          .or(`campaign_ends_at.is.null,campaign_ends_at.gte.${now}`)
          .order('order_index', { ascending: true });

        if (data && data.length > 0) {
          // Slides do Supabase primeiro, depois os estáticos
          setSlides([...data, ...STATIC]);
        }
        // Se não tiver nada no Supabase, mantém só os estáticos
      } catch {
        // fallback: mantém slides estáticos
      }
    }

    fetchSlides();
  }, []);

  useEffect(() => {
    if (!heroCarouselConfig.autoPlayInterval || slides.length === 0) return;
    const interval = setInterval(() => paginate(1), heroCarouselConfig.autoPlayInterval);
    return () => clearInterval(interval);
  }, [current, slides.length]);

  const paginate = (newDirection: number) => {
    setCurrent(([prev]) => {
      const next = (prev + newDirection + slides.length) % slides.length;
      return [next, newDirection];
    });
  };

  if (slides.length === 0) return null;

  const slide = slides[current];
  const imageUrl = slide.image_url ?? slide.image ?? '';
  const nextSlide = slides[(current + 1) % slides.length];
  const nextImageUrl = nextSlide === slide ? '' : (nextSlide.image_url ?? nextSlide.image ?? '');

  return (
    <div className="relative rounded-3xl overflow-hidden shadow-2xl h-[400px] sm:h-[500px] group isolate">
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={String(slide.id)}
          className="absolute inset-0"
          custom={direction}
          initial={{ x: direction > 0 ? '100%' : '-100%' }}
          animate={{ x: 0 }}
          exit={{ x: direction > 0 ? '-100%' : '100%' }}
          transition={{ x: { duration: 0.7, ease: 'easeInOut' } }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.6}
          onDragEnd={(_, { offset, velocity }) => {
            const swipe = swipePower(offset.x, velocity.x);
            if (swipe < -swipeConfidenceThreshold) paginate(1);
            else if (swipe > swipeConfidenceThreshold) paginate(-1);
          }}
        >
          <Image
            src={imageUrl}
            alt={slide.alt}
            fill
            priority={current === 0}
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover select-none pointer-events-none"
            draggable={false}
          />
        </motion.div>
      </AnimatePresence>

      {/* Pré-carrega o próximo slide para que ele não seja buscado durante a transição. */}
      {nextImageUrl && (
        <div aria-hidden className="absolute h-px w-px opacity-0 -z-10 overflow-hidden">
          <Image src={nextImageUrl} alt="" fill sizes="(max-width: 768px) 100vw, 50vw" />
        </div>
      )}

      {/* OVERLAY */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex flex-col justify-end p-6 sm:p-8 pointer-events-none">
        {slide.is_campaign && slide.campaign_label && (
          <span className="mb-2 inline-block w-fit bg-amber-400 text-amber-900 text-xs font-bold px-3 py-1 rounded-full">
            {slide.campaign_label}
          </span>
        )}
        <h3 className="text-white text-2xl sm:text-3xl font-bold">{slide.title}</h3>
        <p className="text-white/90 text-sm sm:text-base">{slide.subtitle}</p>
      </div>

      {/* SETAS */}
      {heroCarouselConfig.showControls && slides.length > 1 && (
        <>
          <button
            onClick={() => paginate(-1)}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white w-10 h-10 rounded-full shadow hidden sm:flex items-center justify-center z-10"
          >
            ‹
          </button>
          <button
            onClick={() => paginate(1)}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white w-10 h-10 rounded-full shadow hidden sm:flex items-center justify-center z-10"
          >
            ›
          </button>
        </>
      )}

      {/* INDICADORES */}
      {heroCarouselConfig.showIndicators && slides.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {slides.map((s, index) => (
            <button
              key={String(s.id)}
              onClick={() => setCurrent([index, index > current ? 1 : -1])}
              className={`h-2 w-2 rounded-full transition ${
                index === current ? 'bg-primary-500' : 'bg-white/60'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

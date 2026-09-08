'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
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
  const [paused, setPaused] = useState(false);
  const reduceMotion = useReducedMotion();
  // Trava a navegação enquanto uma transição está em andamento, senão
  // cliques repetidos empilham vários slides saindo ao mesmo tempo.
  const animating = useRef(false);

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

  const paginate = useCallback((newDirection: number) => {
    if (animating.current) return;
    animating.current = true;
    setCurrent(([prev]) => [(prev + newDirection + slides.length) % slides.length, newDirection]);
  }, [slides.length]);

  const goTo = useCallback((index: number) => {
    if (animating.current) return;
    setCurrent(([prev]) => {
      if (index === prev) return [prev, 0];
      animating.current = true;
      return [index, index > prev ? 1 : -1];
    });
  }, []);

  // Pausa quando a aba fica em segundo plano, senão o timer continua
  // rodando e a volta traz um salto acumulado.
  useEffect(() => {
    const onVisibility = () => setPaused(document.hidden);
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  useEffect(() => {
    if (paused || slides.length < 2) return;
    if (!heroCarouselConfig.autoPlayInterval) return;
    const timer = setTimeout(() => paginate(1), heroCarouselConfig.autoPlayInterval);
    return () => clearTimeout(timer);
  }, [current, slides.length, paused, paginate]);

  if (slides.length === 0) return null;

  const slide = slides[current];
  const imageUrl = slide.image_url ?? slide.image ?? '';
  const nextSlide = slides[(current + 1) % slides.length];
  const nextImageUrl = nextSlide === slide ? '' : (nextSlide.image_url ?? nextSlide.image ?? '');

  return (
    <div
      className="relative rounded-3xl overflow-hidden shadow-2xl h-[400px] sm:h-[500px] group isolate"
      role="region"
      aria-roledescription="carrossel"
      aria-label="Destaques do laboratório"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <AnimatePresence initial={false} custom={direction} onExitComplete={() => { animating.current = false; }}>
        <motion.div
          key={String(slide.id)}
          className="absolute inset-0"
          custom={direction}
          initial={reduceMotion ? { opacity: 0 } : { x: direction > 0 ? '100%' : '-100%' }}
          animate={reduceMotion ? { opacity: 1 } : { x: 0 }}
          exit={reduceMotion ? { opacity: 0 } : { x: direction > 0 ? '-100%' : '100%' }}
          transition={reduceMotion
            ? { opacity: { duration: 0.25 } }
            : { x: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } }}
          drag={reduceMotion ? false : 'x'}
          dragDirectionLock
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.18}
          dragMomentum={false}
          onDragEnd={(_, { offset, velocity }) => {
            const swipe = swipePower(offset.x, velocity.x);
            if (swipe < -swipeConfidenceThreshold) paginate(1);
            else if (swipe > swipeConfidenceThreshold) paginate(-1);
          }}
          aria-roledescription="slide"
          aria-label={`${current + 1} de ${slides.length}: ${slide.title}`}
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
            aria-label="Slide anterior"
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-slate-700 w-10 h-10 rounded-full shadow hidden sm:flex items-center justify-center z-10 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <ChevronLeft size={20} strokeWidth={2.25} />
          </button>
          <button
            onClick={() => paginate(1)}
            aria-label="Próximo slide"
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-slate-700 w-10 h-10 rounded-full shadow hidden sm:flex items-center justify-center z-10 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <ChevronRight size={20} strokeWidth={2.25} />
          </button>
        </>
      )}

      {/* INDICADORES */}
      {heroCarouselConfig.showIndicators && slides.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {slides.map((s, index) => (
            <button
              key={String(s.id)}
              onClick={() => goTo(index)}
              aria-label={`Ir para o slide ${index + 1}: ${s.title}`}
              aria-current={index === current}
              className={`h-2 rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                index === current ? 'w-6 bg-white' : 'w-2 bg-white/50 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

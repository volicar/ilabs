'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type CarouselProps<T> = {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  autoPlayInterval?: number;
  showControls?: boolean;
  showIndicators?: boolean;
  className?: string;
};

const swipeConfidenceThreshold = 100;
const swipePower = (offset: number, velocity: number) =>
  Math.abs(offset) * velocity;

export default function Carousel<T>({
  items,
  renderItem,
  autoPlayInterval,
  showControls = true,
  showIndicators = true,
  className = '',
}: CarouselProps<T>) {
  const [[current, direction], setCurrent] = useState<[number, number]>([0, 0]);

  const paginate = (newDirection: number) => {
    setCurrent(([prev]) => {
      const next = (prev + newDirection + items.length) % items.length;
      return [next, newDirection];
    });
  };

  useEffect(() => {
    if (!autoPlayInterval) return;

    const interval = setInterval(() => {
      paginate(1);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [current, autoPlayInterval]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={current}
          custom={direction}
          initial={{ x: direction > 0 ? 300 : -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: direction > 0 ? -300 : 300, opacity: 0 }}
          transition={{
            x: { type: 'spring', stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.8}
          onDragEnd={(_, { offset, velocity }) => {
            const swipe = swipePower(offset.x, velocity.x);

            if (swipe < -swipeConfidenceThreshold) paginate(1);
            if (swipe > swipeConfidenceThreshold) paginate(-1);
          }}
          className="absolute inset-0"
        >
          {renderItem(items[current])}
        </motion.div>
      </AnimatePresence>

      {/* CONTROLES */}
      {showControls && items.length > 1 && (
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
      {showIndicators && items.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {items.map((_, index) => (
            <button
              key={index}
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

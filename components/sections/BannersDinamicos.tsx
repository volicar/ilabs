'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Banner {
  id: string;
  titulo: string;
  subtitulo: string;
  imagem: string;
  link?: string;
  textoBotao?: string;
}

export default function BannersDinamicos() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    fetch('/api/cms/banners')
      .then(res => res.json())
      .then(setBanners);
  }, []);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  if (banners.length === 0) return null;

  const banner = banners[current];

  return (
    <section className="relative h-[600px] bg-gradient-to-br from-green-600 to-green-400">
      {banner.imagem && (
        <img
          src={banner.imagem}
          alt={banner.titulo}
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
      
      <div className="absolute inset-0 bg-black/40" />
      
      <div className="relative h-full max-w-7xl mx-auto px-4 flex items-center">
        <div className="max-w-2xl text-white">
          <h1 className="text-5xl font-bold mb-4">{banner.titulo}</h1>
          <p className="text-xl mb-8">{banner.subtitulo}</p>
          
          {banner.link && (
            <Link
              href={banner.link}
              className="inline-block px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition"
            >
              {banner.textoBotao || 'Saiba Mais'}
            </Link>
          )}
        </div>
      </div>

      {banners.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-3 h-3 rounded-full transition ${
                i === current ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}

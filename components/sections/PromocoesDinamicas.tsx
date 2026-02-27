'use client';

import { useEffect, useState } from 'react';

interface Promocao {
  id: string;
  titulo: string;
  descricao: string;
  imagem: string;
  precoOriginal: number;
  precoPromocional: number;
  desconto: number;
  destaque: boolean;
}

export default function PromocoesDinamicas() {
  const [promocoes, setPromocoes] = useState<Promocao[]>([]);

  useEffect(() => {
    fetch('/api/cms/promocoes')
      .then(res => res.json())
      .then(setPromocoes);
  }, []);

  if (promocoes.length === 0) return null;

  const handleWhatsApp = (titulo: string, preco: number) => {
    const message = `Olá! Tenho interesse na promoção: *${titulo}* - R$ ${preco.toFixed(2)}`;
    window.open(`https://wa.me/5511999999999?text=${encodeURIComponent(message)}`);
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Promoções Especiais</h2>
          <p className="text-xl text-gray-600">Aproveite nossas ofertas exclusivas</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {promocoes.map((promo) => (
            <div
              key={promo.id}
              className={`bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition ${
                promo.destaque ? 'ring-4 ring-yellow-400' : ''
              }`}
            >
              {promo.destaque && (
                <div className="bg-yellow-400 text-center py-2 font-bold">
                  ⭐ OFERTA ESPECIAL
                </div>
              )}

              <div className="relative h-48 bg-gradient-to-br from-green-100 to-green-50">
                <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full font-bold text-lg">
                  -{promo.desconto}%
                </div>
                {promo.imagem && (
                  <img
                    src={promo.imagem}
                    alt={promo.titulo}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              <div className="p-6">
                <h3 className="text-2xl font-bold mb-3">{promo.titulo}</h3>
                <p className="text-gray-600 mb-4">{promo.descricao}</p>

                <div className="mb-6">
                  <div className="text-gray-400 line-through text-sm">
                    De: R$ {promo.precoOriginal.toFixed(2)}
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-green-600">
                      R$ {promo.precoPromocional.toFixed(2)}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    Economia de R$ {(promo.precoOriginal - promo.precoPromocional).toFixed(2)}
                  </div>
                </div>

                <button
                  onClick={() => handleWhatsApp(promo.titulo, promo.precoPromocional)}
                  className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition"
                >
                  Agendar Agora
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

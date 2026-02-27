'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Promocao {
  id: string;
  titulo: string;
  descricao: string;
  imagem: string;
  precoOriginal: number;
  precoPromocional: number;
  desconto: number;
  dataInicio: string;
  dataFim: string;
  destaque: boolean;
  ativo: boolean;
}

export default function PromocoesPage() {
  const [promocoes, setPromocoes] = useState<Promocao[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Promocao | null>(null);

  useEffect(() => {
    loadPromocoes();
  }, []);

  const loadPromocoes = async () => {
    const res = await fetch('/api/cms/promocoes/all');
    const data = await res.json();
    setPromocoes(data);
  };

  const calcDesconto = (original: number, promocional: number) => {
    return Math.round(((original - promocional) / original) * 100);
  };

  const handleNew = () => {
    setEditing({
      id: '',
      titulo: '',
      descricao: '',
      imagem: '',
      precoOriginal: 0,
      precoPromocional: 0,
      desconto: 0,
      dataInicio: new Date().toISOString().split('T')[0],
      dataFim: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      destaque: false,
      ativo: true,
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!editing) return;
    
    const desconto = calcDesconto(editing.precoOriginal, editing.precoPromocional);
    const toSave = { ...editing, desconto };
    
    const method = editing.id ? 'PUT' : 'POST';
    await fetch('/api/cms/promocoes', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(toSave),
    });
    
    loadPromocoes();
    setShowForm(false);
    setEditing(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deletar esta promoção?')) return;
    await fetch(`/api/cms/promocoes?id=${id}`, { method: 'DELETE' });
    loadPromocoes();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-gray-600 hover:text-gray-900">
              ← Voltar
            </Link>
            <h1 className="text-2xl font-bold">Promoções</h1>
          </div>
          <button
            onClick={handleNew}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold"
          >
            + Nova Promoção
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {promocoes.map((promo) => (
            <div key={promo.id} className="bg-white rounded-xl shadow overflow-hidden">
              {promo.imagem && (
                <div className="relative h-48 bg-gray-100">
                  {promo.destaque && (
                    <div className="absolute top-2 left-2 bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                      ⭐ DESTAQUE
                    </div>
                  )}
                  <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    -{promo.desconto}%
                  </div>
                  <img
                    src={promo.imagem}
                    alt={promo.titulo}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="p-4">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-2 ${
                    promo.ativo ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {promo.ativo ? 'Ativa' : 'Inativa'}
                </span>

                <h3 className="text-lg font-bold mb-2">{promo.titulo}</h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{promo.descricao}</p>

                <div className="mb-4">
                  <div className="text-sm text-gray-400 line-through">
                    R$ {promo.precoOriginal.toFixed(2)}
                  </div>
                  <div className="text-2xl font-bold text-red-600">
                    R$ {promo.precoPromocional.toFixed(2)}
                  </div>
                  <div className="text-xs text-gray-600">
                    Economize R$ {(promo.precoOriginal - promo.precoPromocional).toFixed(2)}
                  </div>
                </div>

                <div className="text-xs text-gray-500 mb-4">
                  {promo.dataInicio} até {promo.dataFim}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditing(promo);
                      setShowForm(true);
                    }}
                    className="flex-1 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(promo.id)}
                    className="px-3 py-2 bg-red-50 text-red-700 rounded-lg text-sm"
                  >
                    Deletar
                  </button>
                </div>
              </div>
            </div>
          ))}

          {promocoes.length === 0 && (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-600 mb-4">Nenhuma promoção cadastrada</p>
              <button
                onClick={handleNew}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
              >
                Criar Primeira Promoção
              </button>
            </div>
          )}
        </div>
      </main>

      {showForm && editing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h2 className="text-2xl font-bold">
                {editing.id ? 'Editar Promoção' : 'Nova Promoção'}
              </h2>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Título *</label>
                <input
                  type="text"
                  value={editing.titulo}
                  onChange={(e) => setEditing({ ...editing, titulo: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Descrição *</label>
                <textarea
                  value={editing.descricao}
                  onChange={(e) => setEditing({ ...editing, descricao: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  rows={3}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Imagem (URL)</label>
                <input
                  type="text"
                  value={editing.imagem}
                  onChange={(e) => setEditing({ ...editing, imagem: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="/images/promocao.jpg"
                />
                {editing.imagem && (
                  <img
                    src={editing.imagem}
                    alt="Preview"
                    className="mt-2 w-full h-32 object-cover rounded-lg"
                  />
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Preço Original (R$) *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editing.precoOriginal}
                    onChange={(e) => setEditing({ ...editing, precoOriginal: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Preço Promocional (R$) *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editing.precoPromocional}
                    onChange={(e) => setEditing({ ...editing, precoPromocional: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  />
                </div>
              </div>

              {editing.precoOriginal > 0 && editing.precoPromocional > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                  <p className="text-sm text-red-700 mb-1">Desconto calculado:</p>
                  <p className="text-3xl font-bold text-red-600">
                    {calcDesconto(editing.precoOriginal, editing.precoPromocional)}%
                  </p>
                  <p className="text-sm text-red-600 mt-1">
                    Economia de R$ {(editing.precoOriginal - editing.precoPromocional).toFixed(2)}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Data Início *</label>
                  <input
                    type="date"
                    value={editing.dataInicio}
                    onChange={(e) => setEditing({ ...editing, dataInicio: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Data Fim *</label>
                  <input
                    type="date"
                    value={editing.dataFim}
                    onChange={(e) => setEditing({ ...editing, dataFim: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-6">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editing.ativo}
                    onChange={(e) => setEditing({ ...editing, ativo: e.target.checked })}
                    className="w-5 h-5"
                  />
                  <span className="text-sm font-medium">Promoção Ativa</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editing.destaque}
                    onChange={(e) => setEditing({ ...editing, destaque: e.target.checked })}
                    className="w-5 h-5"
                  />
                  <span className="text-sm font-medium">Destacar</span>
                </label>
              </div>
            </div>

            <div className="p-6 border-t flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditing(null);
                }}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

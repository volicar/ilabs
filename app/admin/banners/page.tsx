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
  ordem: number;
  ativo: boolean;
  dataInicio: string;
  dataFim: string;
}

export default function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Banner | null>(null);

  useEffect(() => {
    loadBanners();
  }, []);

  const loadBanners = async () => {
    const res = await fetch('/api/cms/banners/all');
    const data = await res.json();
    setBanners(data);
  };

  const handleNew = () => {
    setEditing({
      id: '',
      titulo: '',
      subtitulo: '',
      imagem: '',
      link: '',
      textoBotao: 'Saiba Mais',
      ordem: banners.length + 1,
      ativo: true,
      dataInicio: new Date().toISOString().split('T')[0],
      dataFim: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!editing) return;
    
    const method = editing.id ? 'PUT' : 'POST';
    await fetch('/api/cms/banners', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editing),
    });
    
    loadBanners();
    setShowForm(false);
    setEditing(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deletar este banner?')) return;
    await fetch(`/api/cms/banners?id=${id}`, { method: 'DELETE' });
    loadBanners();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-gray-600 hover:text-gray-900">
              ← Voltar
            </Link>
            <h1 className="text-2xl font-bold">Banners</h1>
          </div>
          <button
            onClick={handleNew}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold"
          >
            + Novo Banner
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="space-y-4">
          {banners.map((banner) => (
            <div key={banner.id} className="bg-white p-6 rounded-xl shadow">
              <div className="flex gap-4">
                {banner.imagem && (
                  <img
                    src={banner.imagem}
                    alt={banner.titulo}
                    className="w-32 h-20 object-cover rounded-lg"
                  />
                )}
                
                <div className="flex-1">
                  <h3 className="text-lg font-bold">{banner.titulo}</h3>
                  <p className="text-sm text-gray-600">{banner.subtitulo}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    {banner.dataInicio} até {banner.dataFim} • Ordem: {banner.ordem}
                  </p>
                  
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => {
                        setEditing(banner);
                        setShowForm(true);
                      }}
                      className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(banner.id)}
                      className="px-3 py-1 bg-red-50 text-red-700 rounded-lg text-sm"
                    >
                      Deletar
                    </button>
                    <span
                      className={`px-3 py-1 rounded-lg text-sm ${
                        banner.ativo ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {banner.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {banners.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">Nenhum banner cadastrado</p>
              <button
                onClick={handleNew}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
              >
                Criar Primeiro Banner
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
                {editing.id ? 'Editar Banner' : 'Novo Banner'}
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
                <label className="block text-sm font-medium mb-2">Subtítulo</label>
                <textarea
                  value={editing.subtitulo}
                  onChange={(e) => setEditing({ ...editing, subtitulo: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Imagem (URL) *</label>
                <input
                  type="text"
                  value={editing.imagem}
                  onChange={(e) => setEditing({ ...editing, imagem: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="/images/banner.jpg"
                  required
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
                  <label className="block text-sm font-medium mb-2">Link</label>
                  <input
                    type="text"
                    value={editing.link || ''}
                    onChange={(e) => setEditing({ ...editing, link: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Texto Botão</label>
                  <input
                    type="text"
                    value={editing.textoBotao || ''}
                    onChange={(e) => setEditing({ ...editing, textoBotao: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Ordem</label>
                  <input
                    type="number"
                    value={editing.ordem}
                    onChange={(e) => setEditing({ ...editing, ordem: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Data Início</label>
                  <input
                    type="date"
                    value={editing.dataInicio}
                    onChange={(e) => setEditing({ ...editing, dataInicio: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Data Fim</label>
                  <input
                    type="date"
                    value={editing.dataFim}
                    onChange={(e) => setEditing({ ...editing, dataFim: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={editing.ativo}
                  onChange={(e) => setEditing({ ...editing, ativo: e.target.checked })}
                  className="w-5 h-5"
                />
                <span className="text-sm font-medium">Banner Ativo</span>
              </label>
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
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
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

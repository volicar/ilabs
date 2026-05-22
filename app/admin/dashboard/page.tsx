'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClient, type HeroSlide } from '@/lib/supabase/client';

const STORAGE_BUCKET = 'banner-images';

export default function DashboardPage() {
  const router = useRouter();
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  const [form, setForm] = useState({
    title: '',
    subtitle: '',
    alt: '',
    is_campaign: false,
    campaign_label: '',
    campaign_ends_at: '',
    image_url: '',
    imageFile: null as File | null,
    imagePreview: '',
  });

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) { router.push('/admin'); return; }
      setUserEmail(data.user.email ?? '');
    });
    fetchSlides();
  }, []);

  async function fetchSlides() {
    setLoading(true);
    const { data } = await supabase
      .from('hero_slides')
      .select('*')
      .order('order_index', { ascending: true });
    setSlides(data ?? []);
    setLoading(false);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setForm((f) => ({
      ...f,
      imageFile: file,
      imagePreview: URL.createObjectURL(file),
      image_url: '',
    }));
  }

  async function uploadImage(file: File): Promise<string> {
    const ext = file.name.split('.').pop();
    const path = `slides/${Date.now()}.${ext}`;
    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(path, file, { upsert: true });
    if (error) throw error;

    const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
    return data.publicUrl;
  }

  async function handleAddSlide(e: React.FormEvent) {
    e.preventDefault();
    if (!form.imageFile && !form.image_url) {
      alert('Selecione uma imagem ou informe uma URL.');
      return;
    }

    setSaving(true);
    try {
      let imageUrl = form.image_url;

      if (form.imageFile) {
        setUploading(true);
        imageUrl = await uploadImage(form.imageFile);
        setUploading(false);
      }

      const nextOrder = slides.length > 0
        ? Math.max(...slides.map((s) => s.order_index)) + 1
        : 0;

      const { error } = await supabase.from('hero_slides').insert({
        image_url: imageUrl,
        alt: form.alt || form.title,
        title: form.title,
        subtitle: form.subtitle,
        order_index: nextOrder,
        active: true,
        is_campaign: form.is_campaign,
        campaign_label: form.is_campaign ? form.campaign_label : null,
        campaign_ends_at: form.is_campaign && form.campaign_ends_at
          ? form.campaign_ends_at
          : null,
      });

      if (error) throw error;

      setForm({
        title: '', subtitle: '', alt: '', is_campaign: false,
        campaign_label: '', campaign_ends_at: '', image_url: '',
        imageFile: null, imagePreview: '',
      });
      if (fileInputRef.current) fileInputRef.current.value = '';
      await fetchSlides();
    } catch (err: unknown) {
      alert('Erro ao salvar: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setSaving(false);
      setUploading(false);
    }
  }

  async function toggleActive(slide: HeroSlide) {
    await supabase
      .from('hero_slides')
      .update({ active: !slide.active })
      .eq('id', slide.id);
    await fetchSlides();
  }

  async function deleteSlide(id: string) {
    if (!confirm('Remover este slide?')) return;
    await supabase.from('hero_slides').delete().eq('id', id);
    await fetchSlides();
  }

  async function moveSlide(id: string, direction: 'up' | 'down') {
    const idx = slides.findIndex((s) => s.id === id);
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= slides.length) return;

    const a = slides[idx];
    const b = slides[swapIdx];

    await Promise.all([
      supabase.from('hero_slides').update({ order_index: b.order_index }).eq('id', a.id),
      supabase.from('hero_slides').update({ order_index: a.order_index }).eq('id', b.id),
    ]);
    await fetchSlides();
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push('/admin');
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h1 className="font-bold text-slate-900 leading-none">iLABS Admin</h1>
            <p className="text-xs text-slate-500">Gerenciar Banner Principal</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-500 hidden sm:block">{userEmail}</span>
          <button
            onClick={handleLogout}
            className="text-sm text-slate-600 hover:text-red-600 font-medium transition-colors"
          >
            Sair
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">

        {/* Adicionar novo slide */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-5">Adicionar Slide</h2>

          <form onSubmit={handleAddSlide} className="space-y-4">
            {/* Imagem */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Imagem (upload)
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full text-sm text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary-50 file:text-primary-700 file:font-medium hover:file:bg-primary-100 cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Ou URL da imagem
                </label>
                <input
                  type="url"
                  value={form.image_url}
                  onChange={(e) => setForm((f) => ({ ...f, image_url: e.target.value, imageFile: null, imagePreview: '' }))}
                  placeholder="https://..."
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                />
              </div>
            </div>

            {form.imagePreview && (
              <img src={form.imagePreview} alt="preview" className="h-40 w-full object-cover rounded-xl" />
            )}

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Título *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  required
                  placeholder="Ex: Exames com Precisão"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Subtítulo</label>
                <input
                  type="text"
                  value={form.subtitle}
                  onChange={(e) => setForm((f) => ({ ...f, subtitle: e.target.value }))}
                  placeholder="Ex: Resultados confiáveis e rápidos"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                />
              </div>
            </div>

            {/* Campanha */}
            <div className="flex items-center gap-3 pt-1">
              <input
                type="checkbox"
                id="is_campaign"
                checked={form.is_campaign}
                onChange={(e) => setForm((f) => ({ ...f, is_campaign: e.target.checked }))}
                className="w-4 h-4 rounded text-primary-500 focus:ring-primary-500"
              />
              <label htmlFor="is_campaign" className="text-sm font-medium text-slate-700">
                Este slide é uma campanha
              </label>
            </div>

            {form.is_campaign && (
              <div className="grid sm:grid-cols-2 gap-4 pl-7">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Label da campanha
                  </label>
                  <input
                    type="text"
                    value={form.campaign_label}
                    onChange={(e) => setForm((f) => ({ ...f, campaign_label: e.target.value }))}
                    placeholder="Ex: Campanha de Vacinação"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Válida até
                  </label>
                  <input
                    type="date"
                    value={form.campaign_ends_at}
                    onChange={(e) => setForm((f) => ({ ...f, campaign_ends_at: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                  />
                </div>
              </div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                disabled={saving}
                className="bg-primary-500 hover:bg-primary-600 disabled:bg-primary-300 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors text-sm"
              >
                {uploading ? 'Enviando imagem...' : saving ? 'Salvando...' : 'Adicionar Slide'}
              </button>
            </div>
          </form>
        </section>

        {/* Lista de slides */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-5">
            Slides Ativos
            <span className="ml-2 text-sm font-normal text-slate-400">({slides.length})</span>
          </h2>

          {loading ? (
            <div className="text-center py-12 text-slate-400">Carregando...</div>
          ) : slides.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              Nenhum slide cadastrado. Adicione o primeiro acima.
            </div>
          ) : (
            <div className="space-y-3">
              {slides.map((slide, idx) => (
                <SlideCard
                  key={slide.id}
                  slide={slide}
                  isFirst={idx === 0}
                  isLast={idx === slides.length - 1}
                  onToggle={() => toggleActive(slide)}
                  onDelete={() => deleteSlide(slide.id)}
                  onMoveUp={() => moveSlide(slide.id, 'up')}
                  onMoveDown={() => moveSlide(slide.id, 'down')}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function SlideCard({
  slide,
  isFirst,
  isLast,
  onToggle,
  onDelete,
  onMoveUp,
  onMoveDown,
}: {
  slide: HeroSlide;
  isFirst: boolean;
  isLast: boolean;
  onToggle: () => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}) {
  return (
    <div className={`flex items-start gap-4 p-4 rounded-xl border transition-colors ${
      slide.active ? 'border-slate-200 bg-white' : 'border-slate-100 bg-slate-50'
    }`}>
      {/* Thumb */}
      <div className="w-24 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-slate-100">
        <img
          src={slide.image_url}
          alt={slide.alt}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-slate-900 text-sm truncate">
            {slide.title}
          </span>
          {slide.is_campaign && (
            <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
              Campanha
              {slide.campaign_label && ` · ${slide.campaign_label}`}
            </span>
          )}
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
            slide.active
              ? 'bg-green-100 text-green-700'
              : 'bg-slate-100 text-slate-500'
          }`}>
            {slide.active ? 'Visível' : 'Oculto'}
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-0.5 truncate">{slide.subtitle}</p>
        {slide.campaign_ends_at && (
          <p className="text-xs text-amber-600 mt-0.5">
            Válido até {new Date(slide.campaign_ends_at).toLocaleDateString('pt-BR')}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 flex-shrink-0">
        <button
          onClick={onMoveUp}
          disabled={isFirst}
          title="Mover para cima"
          className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed text-slate-500"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </button>
        <button
          onClick={onMoveDown}
          disabled={isLast}
          title="Mover para baixo"
          className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed text-slate-500"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <button
          onClick={onToggle}
          title={slide.active ? 'Ocultar' : 'Mostrar'}
          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"
        >
          {slide.active ? (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
            </svg>
          )}
        </button>

        <button
          onClick={onDelete}
          title="Remover"
          className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
}

'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClient, type HeroSlide, type HeroContent, type Service } from '@/lib/supabase/client';
import {
  recordAction,
  getLastAction,
  clearAction,
  applyUndo,
  type CmsHistoryEntry,
  type CmsScope,
} from '@/lib/cms-history';
import { Pencil } from 'lucide-react';
import { SERVICE_ICONS, SERVICE_ICON_LABELS, resolveServiceIcon } from '@/lib/serviceIcons';

const STORAGE_BUCKET = 'banner-images';
type Tab = 'banner' | 'hero' | 'services';

export default function DashboardPage() {
  const router = useRouter();
  const supabase = createClient();
  const [tab, setTab] = useState<Tab>('banner');
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) { router.push('/admin'); return; }
      setUserEmail(data.user.email ?? '');
    });
  }, []);

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
            <p className="text-xs text-slate-500">Painel de gerenciamento</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-500 hidden sm:block">{userEmail}</span>
          <button
            onClick={() => router.push('/admin/guia')}
            className="text-sm text-slate-500 hover:text-primary-600 font-medium transition-colors flex items-center gap-1.5"
            title="Guia de uso"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="hidden sm:inline">Ajuda</span>
          </button>
          <button onClick={handleLogout} className="text-sm text-slate-600 hover:text-red-600 font-medium transition-colors">
            Sair
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-slate-200 px-6">
        <div className="max-w-5xl mx-auto flex gap-1">
          {([
            { key: 'banner', label: 'Banner' },
            { key: 'hero', label: 'Texto Principal' },
            { key: 'services', label: 'Serviços' },
          ] as { key: Tab; label: string }[]).map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                tab === key
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {tab === 'banner'   && <BannerTab supabase={supabase} />}
        {tab === 'hero'     && <HeroTab supabase={supabase} />}
        {tab === 'services' && <ServicesTab supabase={supabase} />}
      </main>
    </div>
  );
}

/* ─────────────── BANNER TAB ─────────────── */
function BannerTab({ supabase }: { supabase: ReturnType<typeof createClient> }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [historyVersion, setHistoryVersion] = useState(0);
  const [form, setForm] = useState({
    title: '', subtitle: '', alt: '', is_campaign: false,
    campaign_label: '', campaign_ends_at: '', image_url: '',
    imageFile: null as File | null, imagePreview: '',
  });

  useEffect(() => { fetchSlides(); }, []);

  async function fetchSlides() {
    setLoading(true);
    const { data } = await supabase.from('hero_slides').select('*').order('order_index', { ascending: true });
    setSlides(data ?? []);
    setLoading(false);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setForm((f) => ({ ...f, imageFile: file, imagePreview: URL.createObjectURL(file), image_url: '' }));
  }

  async function uploadImage(file: File): Promise<string> {
    const ext = file.name.split('.').pop();
    const path = `slides/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(path, file, { upsert: true });
    if (error) throw error;
    return supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path).data.publicUrl;
  }

  async function handleAddSlide(e: React.FormEvent) {
    e.preventDefault();
    if (!form.imageFile && !form.image_url) { alert('Selecione uma imagem ou informe uma URL.'); return; }
    setSaving(true);
    try {
      let imageUrl = form.image_url;
      if (form.imageFile) { setUploading(true); imageUrl = await uploadImage(form.imageFile); setUploading(false); }
      const nextOrder = slides.length > 0 ? Math.min(...slides.map((s) => s.order_index)) - 1 : 0;
      const { data: inserted, error } = await supabase.from('hero_slides').insert({
        image_url: imageUrl, alt: form.alt || form.title, title: form.title, subtitle: form.subtitle,
        order_index: nextOrder, active: true, is_campaign: form.is_campaign,
        campaign_label: form.is_campaign ? form.campaign_label : null,
        campaign_ends_at: form.is_campaign && form.campaign_ends_at ? form.campaign_ends_at : null,
      }).select().single();
      if (error) throw error;
      await recordAction(supabase, {
        scope: 'banner',
        action_type: 'insert',
        description: `Adicionou slide "${form.title}"`,
        payload: { kind: 'insert', table: 'hero_slides', inserted_id: inserted.id },
      });
      setForm({ title: '', subtitle: '', alt: '', is_campaign: false, campaign_label: '', campaign_ends_at: '', image_url: '', imageFile: null, imagePreview: '' });
      if (fileInputRef.current) fileInputRef.current.value = '';
      await fetchSlides();
      setHistoryVersion((v) => v + 1);
    } catch (err: unknown) {
      alert('Erro: ' + (err instanceof Error ? err.message : String(err)));
    } finally { setSaving(false); setUploading(false); }
  }

  async function toggleActive(slide: HeroSlide) {
    await recordAction(supabase, {
      scope: 'banner',
      action_type: 'update',
      description: slide.active ? `Ocultou slide "${slide.title}"` : `Reexibiu slide "${slide.title}"`,
      payload: { kind: 'update', table: 'hero_slides', id: slide.id, previous: { active: slide.active } },
    });
    await supabase.from('hero_slides').update({ active: !slide.active }).eq('id', slide.id);
    await fetchSlides();
    setHistoryVersion((v) => v + 1);
  }

  async function deleteSlide(id: string) {
    if (!confirm('Remover este slide?')) return;
    const slide = slides.find((s) => s.id === id);
    if (!slide) return;
    await supabase.from('hero_slides').delete().eq('id', id);
    await recordAction(supabase, {
      scope: 'banner',
      action_type: 'delete',
      description: `Removeu slide "${slide.title}"`,
      payload: { kind: 'delete', table: 'hero_slides', row: slide as unknown as Record<string, unknown> },
    });
    await fetchSlides();
    setHistoryVersion((v) => v + 1);
  }

  async function moveSlide(id: string, direction: 'up' | 'down') {
    const idx = slides.findIndex((s) => s.id === id);
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= slides.length) return;
    const a = slides[idx]; const b = slides[swapIdx];
    const swaps = [
      { id: a.id, order_index: a.order_index },
      { id: b.id, order_index: b.order_index },
    ];
    await Promise.all([
      supabase.from('hero_slides').update({ order_index: b.order_index }).eq('id', a.id),
      supabase.from('hero_slides').update({ order_index: a.order_index }).eq('id', b.id),
    ]);
    await recordAction(supabase, {
      scope: 'banner',
      action_type: 'reorder',
      description: `Moveu slide "${a.title}" para ${direction === 'up' ? 'cima' : 'baixo'}`,
      payload: { kind: 'reorder', table: 'hero_slides', swaps },
    });
    await fetchSlides();
    setHistoryVersion((v) => v + 1);
  }

  return (
    <div className="space-y-8">
      <UndoPanel
        supabase={supabase}
        scope="banner"
        version={historyVersion}
        onUndone={async () => { await fetchSlides(); setHistoryVersion((v) => v + 1); }}
      />
      <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-bold text-slate-900 mb-5">Adicionar Slide</h2>
        <form onSubmit={handleAddSlide} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Imagem (upload)</label>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange}
                className="w-full text-sm text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary-50 file:text-primary-700 file:font-medium hover:file:bg-primary-100 cursor-pointer" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Ou URL da imagem</label>
              <input type="url" value={form.image_url} onChange={(e) => setForm((f) => ({ ...f, image_url: e.target.value, imageFile: null, imagePreview: '' }))}
                placeholder="https://..." className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm" />
            </div>
          </div>
          {form.imagePreview && <img src={form.imagePreview} alt="preview" className="h-40 w-full object-cover rounded-xl" />}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Título *</label>
              <input type="text" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} required
                placeholder="Ex: Exames com Precisão" className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Subtítulo</label>
              <input type="text" value={form.subtitle} onChange={(e) => setForm((f) => ({ ...f, subtitle: e.target.value }))}
                placeholder="Ex: Resultados confiáveis e rápidos" className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm" />
            </div>
          </div>
          <div className="flex items-center gap-3 pt-1">
            <input type="checkbox" id="is_campaign" checked={form.is_campaign} onChange={(e) => setForm((f) => ({ ...f, is_campaign: e.target.checked }))} className="w-4 h-4 rounded text-primary-500" />
            <label htmlFor="is_campaign" className="text-sm font-medium text-slate-700">Este slide é uma campanha</label>
          </div>
          {form.is_campaign && (
            <div className="grid sm:grid-cols-2 gap-4 pl-7">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Label da campanha</label>
                <input type="text" value={form.campaign_label} onChange={(e) => setForm((f) => ({ ...f, campaign_label: e.target.value }))}
                  placeholder="Ex: Campanha de Vacinação" className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Válida até</label>
                <input type="date" value={form.campaign_ends_at} onChange={(e) => setForm((f) => ({ ...f, campaign_ends_at: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm" />
              </div>
            </div>
          )}
          <div className="pt-2">
            <button type="submit" disabled={saving}
              className="bg-primary-500 hover:bg-primary-600 disabled:bg-primary-300 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors text-sm">
              {uploading ? 'Enviando imagem...' : saving ? 'Salvando...' : 'Adicionar Slide'}
            </button>
          </div>
        </form>
      </section>

      <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-bold text-slate-900 mb-5">Slides Ativos <span className="text-sm font-normal text-slate-400">({slides.length})</span></h2>
        {loading ? <div className="text-center py-12 text-slate-400">Carregando...</div>
          : slides.length === 0 ? <div className="text-center py-12 text-slate-400">Nenhum slide cadastrado.</div>
          : (
            <div className="space-y-3">
              {slides.map((slide, idx) => (
                <SlideCard key={slide.id} slide={slide} isFirst={idx === 0} isLast={idx === slides.length - 1}
                  onToggle={() => toggleActive(slide)} onDelete={() => deleteSlide(slide.id)}
                  onMoveUp={() => moveSlide(slide.id, 'up')} onMoveDown={() => moveSlide(slide.id, 'down')} />
              ))}
            </div>
          )}
      </section>
    </div>
  );
}

/* ─────────────── HERO TAB ─────────────── */
function HeroTab({ supabase }: { supabase: ReturnType<typeof createClient> }) {
  const [form, setForm] = useState<Omit<HeroContent, 'updated_at'>>({ id: '', title_main: '', title_highlight: '', subtitle: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [historyVersion, setHistoryVersion] = useState(0);

  async function loadHero() {
    const { data } = await supabase.from('hero_content').select('*').limit(1).single();
    if (data) setForm(data);
  }

  useEffect(() => {
    loadHero().then(() => setLoading(false));
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const { data: previous } = await supabase.from('hero_content').select('*').eq('id', form.id).maybeSingle();
    await supabase.from('hero_content').upsert({ ...form, updated_at: new Date().toISOString() });
    if (previous) {
      await recordAction(supabase, {
        scope: 'hero',
        action_type: 'update',
        description: 'Atualizou texto principal',
        payload: {
          kind: 'update',
          table: 'hero_content',
          id: form.id,
          previous: {
            title_main: previous.title_main,
            title_highlight: previous.title_highlight,
            subtitle: previous.subtitle,
          },
        },
      });
      setHistoryVersion((v) => v + 1);
    }
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  if (loading) return <div className="text-center py-20 text-slate-400">Carregando...</div>;

  return (
    <div className="space-y-6 max-w-2xl">
      <UndoPanel
        supabase={supabase}
        scope="hero"
        version={historyVersion}
        onUndone={async () => { await loadHero(); setHistoryVersion((v) => v + 1); }}
      />
      <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      <h2 className="text-lg font-bold text-slate-900 mb-2">Texto Principal do Site</h2>
      <p className="text-sm text-slate-500 mb-6">Altera o título e subtítulo da seção principal (hero).</p>

      <form onSubmit={handleSave} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Título — linha 1</label>
          <input type="text" value={form.title_main} onChange={(e) => setForm((f) => ({ ...f, title_main: e.target.value }))} required
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm" />
          <p className="text-xs text-slate-400 mt-1">Texto em preto normal</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Título — palavra em destaque</label>
          <input type="text" value={form.title_highlight} onChange={(e) => setForm((f) => ({ ...f, title_highlight: e.target.value }))} required
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm" />
          <p className="text-xs text-slate-400 mt-1">Aparece abaixo, em verde degradê</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Subtítulo</label>
          <textarea value={form.subtitle} onChange={(e) => setForm((f) => ({ ...f, subtitle: e.target.value }))} required rows={3}
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm resize-none" />
        </div>

        {/* Preview */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
          <p className="text-xs text-slate-400 mb-2 font-medium uppercase tracking-wide">Preview</p>
          <p className="text-2xl font-bold text-slate-900 leading-tight">
            {form.title_main}
            <span className="block bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
              {form.title_highlight}
            </span>
          </p>
          <p className="text-sm text-slate-600 mt-2">{form.subtitle}</p>
        </div>

        <button type="submit" disabled={saving}
          className="bg-primary-500 hover:bg-primary-600 disabled:bg-primary-300 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors text-sm">
          {saving ? 'Salvando...' : saved ? 'Salvo!' : 'Salvar Alterações'}
        </button>
      </form>
      </section>
    </div>
  );
}

/* ─────────────── SERVICES TAB ─────────────── */
function ServicesTab({ supabase }: { supabase: ReturnType<typeof createClient> }) {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [historyVersion, setHistoryVersion] = useState(0);
  const [form, setForm] = useState({ title: '', description: '', icon: 'microscope' });
  const [editingIcon, setEditingIcon] = useState<string | null>(null);

  useEffect(() => { fetchServices(); }, []);

  async function fetchServices() {
    setLoading(true);
    const { data } = await supabase.from('services').select('*').order('order_index', { ascending: true });
    setServices(data ?? []);
    setLoading(false);
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const nextOrder = services.length > 0 ? Math.max(...services.map((s) => s.order_index)) + 1 : 0;
    const { data: inserted, error } = await supabase
      .from('services')
      .insert({ ...form, order_index: nextOrder, active: true })
      .select()
      .single();
    if (!error && inserted) {
      await recordAction(supabase, {
        scope: 'services',
        action_type: 'insert',
        description: `Adicionou serviço "${form.title}"`,
        payload: { kind: 'insert', table: 'services', inserted_id: inserted.id },
      });
    }
    setForm({ title: '', description: '', icon: 'microscope' });
    await fetchServices();
    setHistoryVersion((v) => v + 1);
    setSaving(false);
  }

  async function updateIcon(service: Service, icon: string) {
    if (icon === service.icon) { setEditingIcon(null); return; }
    await recordAction(supabase, {
      scope: 'services',
      action_type: 'update',
      description: `Alterou o ícone de "${service.title}"`,
      payload: { kind: 'update', table: 'services', id: service.id, previous: { icon: service.icon } },
    });
    await supabase.from('services').update({ icon }).eq('id', service.id);
    setEditingIcon(null);
    await fetchServices();
    setHistoryVersion((v) => v + 1);
  }

  async function toggleActive(service: Service) {
    await recordAction(supabase, {
      scope: 'services',
      action_type: 'update',
      description: service.active ? `Ocultou serviço "${service.title}"` : `Reexibiu serviço "${service.title}"`,
      payload: { kind: 'update', table: 'services', id: service.id, previous: { active: service.active } },
    });
    await supabase.from('services').update({ active: !service.active }).eq('id', service.id);
    await fetchServices();
    setHistoryVersion((v) => v + 1);
  }

  async function deleteService(id: string) {
    if (!confirm('Remover este serviço?')) return;
    const service = services.find((s) => s.id === id);
    if (!service) return;
    await supabase.from('services').delete().eq('id', id);
    await recordAction(supabase, {
      scope: 'services',
      action_type: 'delete',
      description: `Removeu serviço "${service.title}"`,
      payload: { kind: 'delete', table: 'services', row: service as unknown as Record<string, unknown> },
    });
    await fetchServices();
    setHistoryVersion((v) => v + 1);
  }

  async function moveService(id: string, direction: 'up' | 'down') {
    const idx = services.findIndex((s) => s.id === id);
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= services.length) return;
    const a = services[idx]; const b = services[swapIdx];
    const swaps = [
      { id: a.id, order_index: a.order_index },
      { id: b.id, order_index: b.order_index },
    ];
    await Promise.all([
      supabase.from('services').update({ order_index: b.order_index }).eq('id', a.id),
      supabase.from('services').update({ order_index: a.order_index }).eq('id', b.id),
    ]);
    await recordAction(supabase, {
      scope: 'services',
      action_type: 'reorder',
      description: `Moveu serviço "${a.title}" para ${direction === 'up' ? 'cima' : 'baixo'}`,
      payload: { kind: 'reorder', table: 'services', swaps },
    });
    await fetchServices();
    setHistoryVersion((v) => v + 1);
  }

  return (
    <div className="space-y-8">
      <UndoPanel
        supabase={supabase}
        scope="services"
        version={historyVersion}
        onUndone={async () => { await fetchServices(); setHistoryVersion((v) => v + 1); }}
      />
      <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-bold text-slate-900 mb-5">Adicionar Serviço</h2>
        <form onSubmit={handleAdd} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Nome do serviço *</label>
            <input type="text" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} required
              placeholder="Ex: Exame de Urina" className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Ícone</label>
            <IconPicker value={form.icon} onChange={(name) => setForm((f) => ({ ...f, icon: name }))} />
            <p className="text-xs text-slate-500 mt-2">
              Selecionado: <span className="font-medium text-slate-700">{SERVICE_ICON_LABELS[form.icon] ?? form.icon}</span>
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Descrição</label>
            <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={2}
              placeholder="Descreva brevemente o serviço..." className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm resize-none" />
          </div>
          <button type="submit" disabled={saving}
            className="bg-primary-500 hover:bg-primary-600 disabled:bg-primary-300 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors text-sm">
            {saving ? 'Salvando...' : 'Adicionar Serviço'}
          </button>
        </form>
      </section>

      <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-bold text-slate-900 mb-1">Serviços Cadastrados</h2>
        <p className="text-sm text-slate-400 mb-5">Quando vazio, o site exibe os serviços padrão do sistema.</p>

        {loading ? <div className="text-center py-12 text-slate-400">Carregando...</div>
          : services.length === 0 ? <div className="text-center py-12 text-slate-400">Nenhum serviço cadastrado. O site está usando os serviços padrão.</div>
          : (
            <div className="space-y-3">
              {services.map((service, idx) => (
                <div key={service.id} className={`rounded-xl border transition-colors ${service.active ? 'border-slate-200 bg-white' : 'border-slate-100 bg-slate-50'}`}>
                  <div className="flex items-center gap-4 p-4">
                    <button type="button" onClick={() => setEditingIcon(editingIcon === service.id ? null : service.id)}
                      title="Trocar ícone" aria-expanded={editingIcon === service.id}
                      className="group/icon relative flex-shrink-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
                      <ServiceIconPreview icon={service.icon} interactive />
                      <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white border border-slate-200 text-slate-500 flex items-center justify-center opacity-0 group-hover/icon:opacity-100 group-focus/icon:opacity-100 transition-opacity">
                        <Pencil size={11} strokeWidth={2} />
                      </span>
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-slate-900 text-sm">{service.title}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${service.active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                          {service.active ? 'Visível' : 'Oculto'}
                        </span>
                      </div>
                      {service.description && <p className="text-xs text-slate-500 mt-0.5 truncate">{service.description}</p>}
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button onClick={() => moveService(service.id, 'up')} disabled={idx === 0} title="Mover para cima"
                        className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-30 text-slate-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                      </button>
                      <button onClick={() => moveService(service.id, 'down')} disabled={idx === services.length - 1} title="Mover para baixo"
                        className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-30 text-slate-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                      </button>
                      <button onClick={() => toggleActive(service)} title={service.active ? 'Ocultar' : 'Mostrar'}
                        className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500">
                        {service.active
                          ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                          : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                        }
                      </button>
                      <button onClick={() => deleteService(service.id)} title="Remover"
                        className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </div>
                  {editingIcon === service.id && (
                    <div className="border-t border-slate-100 px-4 py-4">
                      <p className="text-xs font-medium text-slate-600 mb-2.5">
                        Ícone de <span className="text-slate-900">{service.title}</span>
                      </p>
                      <IconPicker value={service.icon} onChange={(name) => updateIcon(service, name)} />
                      <button type="button" onClick={() => setEditingIcon(null)}
                        className="mt-3 text-xs font-medium text-slate-500 hover:text-slate-700">
                        Cancelar
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
      </section>
    </div>
  );
}

/* ─────────────── UNDO PANEL ─────────────── */
function UndoPanel({ supabase, scope, version, onUndone }: {
  supabase: ReturnType<typeof createClient>;
  scope: CmsScope;
  version: number;
  onUndone: () => void | Promise<void>;
}) {
  const [entry, setEntry] = useState<CmsHistoryEntry | null>(null);
  const [undoing, setUndoing] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getLastAction(supabase, scope).then((e) => { if (!cancelled) setEntry(e); });
    return () => { cancelled = true; };
  }, [scope, version]);

  async function handleUndo() {
    if (!entry) return;
    if (!confirm(`Desfazer: ${entry.description}?`)) return;
    setUndoing(true);
    try {
      await applyUndo(supabase, entry);
      await clearAction(supabase, scope);
      setEntry(null);
      await onUndone();
    } catch (err: unknown) {
      alert('Não foi possível desfazer: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setUndoing(false);
    }
  }

  if (!entry) return null;

  const when = entry.created_at ? new Date(entry.created_at).toLocaleString('pt-BR') : '';

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center justify-between gap-4">
      <div className="flex items-start gap-3 min-w-0">
        <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
        </svg>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-amber-900">Última alteração</p>
          <p className="text-sm text-amber-800 truncate">{entry.description}</p>
          {when && <p className="text-xs text-amber-600 mt-0.5">{when}{entry.created_by ? ` · ${entry.created_by}` : ''}</p>}
        </div>
      </div>
      <button
        onClick={handleUndo}
        disabled={undoing}
        className="bg-amber-600 hover:bg-amber-700 disabled:bg-amber-300 text-white font-semibold px-4 py-2 rounded-xl transition-colors text-sm flex-shrink-0"
      >
        {undoing ? 'Desfazendo...' : 'Desfazer'}
      </button>
    </div>
  );
}

/* ─────────────── SLIDE CARD ─────────────── */
function SlideCard({ slide, isFirst, isLast, onToggle, onDelete, onMoveUp, onMoveDown }: {
  slide: HeroSlide; isFirst: boolean; isLast: boolean;
  onToggle: () => void; onDelete: () => void; onMoveUp: () => void; onMoveDown: () => void;
}) {
  return (
    <div className={`flex items-start gap-4 p-4 rounded-xl border transition-colors ${slide.active ? 'border-slate-200 bg-white' : 'border-slate-100 bg-slate-50'}`}>
      <div className="w-24 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-slate-100">
        <img src={slide.image_url} alt={slide.alt} className="w-full h-full object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-slate-900 text-sm truncate">{slide.title}</span>
          {slide.is_campaign && (
            <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
              Campanha{slide.campaign_label && ` · ${slide.campaign_label}`}
            </span>
          )}
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${slide.active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
            {slide.active ? 'Visível' : 'Oculto'}
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-0.5 truncate">{slide.subtitle}</p>
        {slide.campaign_ends_at && (
          <p className="text-xs text-amber-600 mt-0.5">Válido até {new Date(slide.campaign_ends_at).toLocaleDateString('pt-BR')}</p>
        )}
      </div>
      <div className="flex items-center gap-1 flex-shrink-0">
        <button onClick={onMoveUp} disabled={isFirst} className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-30 text-slate-500">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
        </button>
        <button onClick={onMoveDown} disabled={isLast} className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-30 text-slate-500">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
        </button>
        <button onClick={onToggle} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500">
          {slide.active
            ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
            : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
          }
        </button>
        <button onClick={onDelete} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
        </button>
      </div>
    </div>
  );
}

function IconPicker({ value, onChange }: { value: string; onChange: (name: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Ícone do serviço">
      {Object.entries(SERVICE_ICONS).map(([name, Icon]) => {
        const selected = value === name;
        const label = SERVICE_ICON_LABELS[name] ?? name;
        return (
          <button key={name} type="button" role="radio" aria-checked={selected} aria-label={label} title={label}
            onClick={() => onChange(name)}
            className={`w-11 h-11 rounded-xl border flex items-center justify-center transition-colors ${
              selected
                ? 'border-primary-500 bg-primary-50 text-primary-600 ring-2 ring-primary-200'
                : 'border-slate-200 text-slate-500 hover:bg-slate-50'
            }`}>
            <Icon size={20} strokeWidth={1.75} />
          </button>
        );
      })}
    </div>
  );
}

function ServiceIconPreview({ icon, interactive = false }: { icon: string; interactive?: boolean }) {
  const Icon = resolveServiceIcon(icon);
  if (!Icon) return <span className="text-3xl flex-shrink-0">{icon}</span>;
  return (
    <span className={`w-11 h-11 flex-shrink-0 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center transition-colors ${
      interactive ? 'group-hover/icon:bg-primary-600 group-hover/icon:text-white' : ''
    }`}>
      <Icon size={22} strokeWidth={1.75} />
    </span>
  );
}

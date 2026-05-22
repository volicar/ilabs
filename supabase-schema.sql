-- Execute este script no SQL Editor do Supabase

-- 1. Tabela de slides do banner principal
create table if not exists hero_slides (
  id               uuid default gen_random_uuid() primary key,
  image_url        text not null,
  alt              text not null default '',
  title            text not null,
  subtitle         text not null default '',
  order_index      integer not null default 0,
  active           boolean not null default true,
  is_campaign      boolean not null default false,
  campaign_label   text,
  campaign_ends_at timestamptz,
  created_at       timestamptz default now(),
  updated_at       timestamptz default now()
);

-- 2. Row Level Security
alter table hero_slides enable row level security;

-- Qualquer pessoa pode ler slides ativos (banner público)
create policy "Public read active slides"
  on hero_slides for select
  using (active = true);

-- Usuários autenticados (admins) podem fazer tudo
create policy "Admins full access"
  on hero_slides for all
  using (auth.role() = 'authenticated');

-- 3. Storage bucket para imagens do banner
insert into storage.buckets (id, name, public)
values ('banner-images', 'banner-images', true)
on conflict (id) do nothing;

-- Qualquer um pode ver as imagens (bucket público)
create policy "Public read banner images"
  on storage.objects for select
  using (bucket_id = 'banner-images');

-- Admins podem fazer upload
create policy "Admins upload banner images"
  on storage.objects for insert
  with check (bucket_id = 'banner-images' and auth.role() = 'authenticated');

-- Admins podem deletar
create policy "Admins delete banner images"
  on storage.objects for delete
  using (bucket_id = 'banner-images' and auth.role() = 'authenticated');

import { NextResponse } from 'next/server';
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';

const dataPath = join(process.cwd(), 'cms/data/banners.json');

async function readBanners() {
  try {
    const data = await readFile(dataPath, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writeBanners(banners: any[]) {
  await writeFile(dataPath, JSON.stringify(banners, null, 2));
}

// GET - Listar banners ativos
export async function GET() {
  const banners = await readBanners();
  const now = new Date();
  
  const active = banners.filter((b: any) => {
    if (!b.ativo) return false;
    const inicio = new Date(b.dataInicio);
    const fim = new Date(b.dataFim);
    return now >= inicio && now <= fim;
  });
  
  return NextResponse.json(active.sort((a: any, b: any) => a.ordem - b.ordem));
}

// POST - Criar banner
export async function POST(request: Request) {
  const banner = await request.json();
  const banners = await readBanners();
  
  banner.id = Date.now().toString();
  banners.push(banner);
  
  await writeBanners(banners);
  return NextResponse.json(banner);
}

// PUT - Atualizar banner
export async function PUT(request: Request) {
  const updated = await request.json();
  let banners = await readBanners();
  
  banners = banners.map((b: any) => b.id === updated.id ? updated : b);
  
  await writeBanners(banners);
  return NextResponse.json(updated);
}

// DELETE - Deletar banner
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  
  let banners = await readBanners();
  banners = banners.filter((b: any) => b.id !== id);
  
  await writeBanners(banners);
  return NextResponse.json({ success: true });
}

import { NextResponse } from 'next/server';
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';

const dataPath = join(process.cwd(), 'cms/data/promocoes.json');

async function readPromocoes() {
  try {
    const data = await readFile(dataPath, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writePromocoes(promocoes: any[]) {
  await writeFile(dataPath, JSON.stringify(promocoes, null, 2));
}

// GET - Listar promoções ativas
export async function GET() {
  const promocoes = await readPromocoes();
  const now = new Date();
  
  const active = promocoes.filter((p: any) => {
    if (!p.ativo) return false;
    const inicio = new Date(p.dataInicio);
    const fim = new Date(p.dataFim);
    return now >= inicio && now <= fim;
  });
  
  return NextResponse.json(active.sort((a: any, b: any) => {
    if (a.destaque && !b.destaque) return -1;
    if (!a.destaque && b.destaque) return 1;
    return 0;
  }));
}

// POST - Criar promoção
export async function POST(request: Request) {
  const promocao = await request.json();
  const promocoes = await readPromocoes();
  
  promocao.id = Date.now().toString();
  promocoes.push(promocao);
  
  await writePromocoes(promocoes);
  return NextResponse.json(promocao);
}

// PUT - Atualizar promoção
export async function PUT(request: Request) {
  const updated = await request.json();
  let promocoes = await readPromocoes();
  
  promocoes = promocoes.map((p: any) => p.id === updated.id ? updated : p);
  
  await writePromocoes(promocoes);
  return NextResponse.json(updated);
}

// DELETE - Deletar promoção
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  
  let promocoes = await readPromocoes();
  promocoes = promocoes.filter((p: any) => p.id !== id);
  
  await writePromocoes(promocoes);
  return NextResponse.json({ success: true });
}

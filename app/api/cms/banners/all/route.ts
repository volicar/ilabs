import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { isAuthenticated } from '@/lib/auth';

const dataPath = join(process.cwd(), 'cms/data/banners.json');

export async function GET() {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }
  
  try {
    const data = await readFile(dataPath, 'utf-8');
    const banners = JSON.parse(data);
    return NextResponse.json(banners.sort((a: any, b: any) => a.ordem - b.ordem));
  } catch {
    return NextResponse.json([]);
  }
}

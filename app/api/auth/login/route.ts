import { NextResponse } from 'next/server';
import { checkCredentials, setAuthCookie } from '@/lib/auth';

export async function POST(request: Request) {
  const { email, password } = await request.json();
  
  if (checkCredentials(email, password)) {
    await setAuthCookie();
    return NextResponse.json({ success: true });
  }
  
  return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 });
}

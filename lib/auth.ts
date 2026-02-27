import { cookies } from 'next/headers';

const ADMIN_EMAIL = 'admin@ilabs.com';
const ADMIN_PASSWORD = 'ilabs2025';

export function checkCredentials(email: string, password: string) {
  return email === ADMIN_EMAIL && password === ADMIN_PASSWORD;
}

export async function setAuthCookie() {
  cookies().set('admin-auth', 'true', { httpOnly: true, maxAge: 86400 });
}

export async function clearAuthCookie() {
  cookies().delete('admin-auth');
}

export async function isAuthenticated() {
  return cookies().get('admin-auth')?.value === 'true';
}


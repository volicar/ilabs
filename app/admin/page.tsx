import { redirect } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
import Link from 'next/link';

export default async function AdminPage() {
  const auth = await isAuthenticated();
  if (!auth) redirect('/admin/login');

  const handleLogout = async () => {
    'use server';
    const { clearAuthCookie } = await import('@/lib/auth');
    await clearAuthCookie();
    redirect('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">iLABS CMS</h1>
          <form action={handleLogout}>
            <button className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition">
              Sair
            </button>
          </form>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-8">Bem-vindo! 👋</h2>

        <div className="grid md:grid-cols-2 gap-6">
          <Link
            href="/admin/banners"
            className="bg-white p-8 rounded-2xl shadow hover:shadow-lg transition"
          >
            <div className="text-4xl mb-4">🖼️</div>
            <h3 className="text-2xl font-bold mb-2">Banners</h3>
            <p className="text-gray-600">Gerenciar banners do site</p>
          </Link>

          <Link
            href="/admin/promocoes"
            className="bg-white p-8 rounded-2xl shadow hover:shadow-lg transition"
          >
            <div className="text-4xl mb-4">🏷️</div>
            <h3 className="text-2xl font-bold mb-2">Promoções</h3>
            <p className="text-gray-600">Criar e editar promoções</p>
          </Link>
        </div>
      </main>
    </div>
  );
}

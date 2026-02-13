import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { siteConfig } from '@/lib/config';

// Fonte única para todo o site - moderna e clean como iLABS
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: `${siteConfig.name} - ${siteConfig.description}`,
  description: `Laboratório de análises clínicas em ${siteConfig.contact.address.city}. Exames laboratoriais com qualidade e precisão. Resultados rápidos e confiáveis!`,
  keywords: 'laboratório, exames laboratoriais, análises clínicas, exames de sangue, check-up, hemograma, urina, fezes, exames de imagem, coleta domiciliar, rio de janeiro, bonsucesso',
  authors: [{ name: siteConfig.name }],
  openGraph: {
    title: `${siteConfig.name} - ${siteConfig.description}`,
    description: 'Laboratório de análises clínicas com exames precisos e resultados rápidos!',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🧬</text></svg>" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
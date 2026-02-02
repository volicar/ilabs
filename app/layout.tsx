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
  description: `Clínica médica completa em ${siteConfig.contact.address.city}. Atendimento especializado com mais de 16 anos de experiência. Agende sua consulta pelo WhatsApp!`,
  keywords: 'clínica médica, clínica geral, pediatria, cardiologia, dermatologia, ortopedia, check-up, são paulo, atendimento médico',
  authors: [{ name: siteConfig.name }],
  openGraph: {
    title: `${siteConfig.name} - ${siteConfig.description}`,
    description: 'Atendimento médico de excelência. Agende pelo WhatsApp!',
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
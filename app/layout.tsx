import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { siteConfig } from '@/lib/config';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: `${siteConfig.name} - Laboratório de Análises Clínicas em ${siteConfig.contact.address.neighborhood}`,
  description: `Laboratório de análises clínicas em ${siteConfig.contact.address.city}. Exames laboratoriais com qualidade, precisão e resultados rápidos. Coleta domiciliar disponível. Atendemos em Bonsucesso, Campo Grande, Bangu, Madureira, Tijuca, Centro e Taquara.`,
  
  keywords: [
    'laboratório rio de janeiro',
    'exames laboratoriais bonsucesso',
    'análises clínicas',
    'exames de sangue',
    'hemograma',
    'laboratório bonsucesso',
    'laboratório campo grande',
    'laboratório bangu',
    'laboratório madureira',
    'laboratório tijuca',
    'coleta domiciliar',
    'check-up',
    'exames de urina',
    'iLABS',
    'laboratório rio de janeiro zona norte',
  ].join(', '),
  
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  
  // Open Graph (Facebook, WhatsApp)
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://www.ilabslaboratorio.com.br', // ← MUDE PARA SEU DOMÍNIO
    siteName: siteConfig.name,
    title: `${siteConfig.name} - Laboratório de Análises Clínicas`,
    description: 'Exames laboratoriais com qualidade e precisão. Resultados rápidos e confiáveis.',
    images: [
      {
        url: '/images/og-image.jpg', // ← Adicione uma imagem 1200x630px
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} - Laboratório`,
      },
    ],
  },
  
  // Twitter
  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.name} - Laboratório de Análises Clínicas`,
    description: 'Exames laboratoriais com qualidade e precisão',
    images: ['/images/og-image.jpg'],
  },
  
 // Verificação
verification: {
  google: 'V79RLPSTXl9Yc4B8MtnpocBK-aKAEMxXbSNI4QjtDs4',
},

// Dados estruturados
other: {
  'google-site-verification': 'V79RLPSTXl9Yc4B8MtnpocBK-aKAEMxXbSNI4QjtDs4',
},

  // Canonical URL
  alternates: {
    canonical: 'https://www.ilabslaboratorio.com.br', // ← MUDE PARA SEU DOMÍNIO
  },

  // Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
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
        
        {/* Schema.org - Dados Estruturados */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'MedicalBusiness',
              name: siteConfig.name,
              image: 'https://www.ilabslaboratorio.com.br/images/logo.jpg',
              '@id': 'https://www.ilabslaboratorio.com.br',
              url: 'https://www.ilabslaboratorio.com.br',
              telephone: siteConfig.contact.phone,
              address: {
                '@type': 'PostalAddress',
                streetAddress: siteConfig.contact.address.street,
                addressLocality: siteConfig.contact.address.city,
                addressRegion: siteConfig.contact.address.state,
                postalCode: siteConfig.contact.address.zip,
                addressCountry: 'BR',
              },
              geo: {
                '@type': 'GeoCoordinates',
                latitude: -22.861409, // ← Coordenadas do laboratório
                longitude: -43.254784,
              },
              openingHoursSpecification: [
                {
                  '@type': 'OpeningHoursSpecification',
                  dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                  opens: '07:00',
                  closes: '19:00',
                },
                {
                  '@type': 'OpeningHoursSpecification',
                  dayOfWeek: 'Saturday',
                  opens: '08:00',
                  closes: '13:00',
                },
              ],
              priceRange: '$$',
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: '4.8',
                reviewCount: '150',
              },
            }),
          }}
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
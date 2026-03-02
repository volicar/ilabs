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

  icons: {
    icon: '/images/logo-ilabs.png',
    shortcut: '/images/logo-ilabs.png',
    apple: '/images/logo-ilabs.png',
  },

  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://ilabslaboratorio.com.br',
    siteName: siteConfig.name,
    title: `${siteConfig.name} - Laboratório de Análises Clínicas`,
    description:
      'Exames laboratoriais com qualidade e precisão. Resultados rápidos e confiáveis.',
    images: [
      {
        url: '/images/og-image-labs-completa.png',
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} - Laboratório`,
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.name} - Laboratório de Análises Clínicas`,
    description: 'Exames laboratoriais com qualidade e precisão',
    images: ['/images/og-image-ilabs-verde.png'],
  },

  verification: {
    google: 'V79RLPSTXl9Yc4B8MtnpocBK-aKAEMxXbSNI4QjtDs4',
  },

  other: {
    'google-site-verification':
      'V79RLPSTXl9Yc4B8MtnpocBK-aKAEMxXbSNI4QjtDs4',
  },

  alternates: {
    canonical: 'https://ilabslaboratorio.com.br',
  },

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
        <meta
          name="google-site-verification"
          content="V79RLPSTXl9Yc4B8MtnpocBK-aKAEMxXbSNI4QjtDs4"
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'MedicalBusiness',
              name: siteConfig.name,
              image:
                'https://ilabslaboratorio.com.br/images/logo-ilabs-transparente.png',
              '@id': 'https://ilabslaboratorio.com.br',
              url: 'https://ilabslaboratorio.com.br',
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
                latitude: -22.861409,
                longitude: -43.254784,
              },
              openingHoursSpecification: [
                {
                  '@type': 'OpeningHoursSpecification',
                  dayOfWeek: [
                    'Monday',
                    'Tuesday',
                    'Wednesday',
                    'Thursday',
                    'Friday',
                  ],
                  opens: '07:00',
                  closes: '17:00',
                },
                {
                  '@type': 'OpeningHoursSpecification',
                  dayOfWeek: 'Saturday',
                  opens: '07:00',
                  closes: '12:00',
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
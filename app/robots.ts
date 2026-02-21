import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://www.ilabslaboratorio.com.br'; // ← MUDE PARA SEU DOMÍNIO

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/_next/', '/admin/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
// components/layout/Footer.tsx - VERSÃO ATUALIZADA COM LOGO
import { Instagram } from 'lucide-react';
import { siteConfig } from '@/lib/config';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12 px-4 sm:px-6">
      <div className="container mx-auto text-center">
        {/* Logo */}
        <div className="flex items-center justify-center mb-4">
          <Image
            src="/images/logo-ilabs-transparente.png"
            alt="iLABS Laboratório"
            width={150}
            height={70}
            className="object-contain brightness-0 invert"
          />
        </div>
        
        <p className="mb-6 text-sm sm:text-base">{siteConfig.description}</p>
        
        {/* Instagram */}
        {siteConfig.social.instagram && (
          <div className="mb-6">
            <a
              href={`https://instagram.com/${siteConfig.social.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 text-slate-300 hover:text-primary-400 transition-colors"
            >
              <Instagram size={24} />
              <span>@{siteConfig.social.instagram}</span>
            </a>
          </div>
        )}

        <div className="border-t border-slate-700 pt-6">
          <p className="text-xs sm:text-sm text-slate-400">
            © {new Date().getFullYear()} {siteConfig.name}. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
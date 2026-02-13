'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, Heart } from 'lucide-react';
import { siteConfig } from '@/lib/config';
import WhatsAppButton from '@/components/ui/WhatsAppButton';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { label: 'Serviços', href: '#servicos' },
    { label: 'Sobre', href: '#sobre' },
    { label: 'Depoimentos', href: '#depoimentos' },
    { label: 'Bairros', href: '#bairros' },
    { label: 'Localização', href: '#localizacao' },
    {
      label: 'Resultados',
      href: 'https://portal.worklabweb.com.br/resultados-on-line/2317',
      external: true,
    },
  ];

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <nav className="container mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-400 rounded-lg flex items-center justify-center">
              <Heart className="text-white" size={20} fill="white" />
            </div>
            <span className="text-xl sm:text-2xl font-display font-bold bg-gradient-to-r from-primary-700 to-primary-500 bg-clip-text text-transparent">
              {siteConfig.name}
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) =>
              item.external ? (
                <a
                  key={item.href}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-700 hover:text-primary-600 transition-colors font-medium"
                >
                  {item.label}
                </a>
              ) : (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-slate-700 hover:text-primary-600 transition-colors font-medium"
                >
                  {item.label}
                </a>
              )
            )}

            <WhatsAppButton variant="primary" className="px-6 py-2.5 text-base">
              Agendar
            </WhatsAppButton>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-slate-700 hover:text-primary-600 transition-colors"
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-xl mt-2 rounded-b-2xl animate-fadeIn">
            <div className="flex flex-col space-y-4 p-6">
              {menuItems.map((item) =>
                item.external ? (
                  <a
                    key={item.href}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-slate-700 hover:text-primary-600 transition-colors font-medium"
                  >
                    {item.label}
                  </a>
                ) : (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="text-slate-700 hover:text-primary-600 transition-colors font-medium"
                  >
                    {item.label}
                  </a>
                )
              )}

              <WhatsAppButton variant="primary" className="w-full">
                Agendar Consulta
              </WhatsAppButton>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

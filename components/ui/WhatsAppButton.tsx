import { MessageCircle, ChevronRight } from 'lucide-react';
import { createWhatsAppLink } from '@/lib/utils';

interface WhatsAppButtonProps {
  service?: string;
  variant?: 'primary' | 'secondary' | 'floating';
  children?: React.ReactNode;
  className?: string;
}

export default function WhatsAppButton({ 
  service, 
  variant = 'primary',
  children,
  className = ''
}: WhatsAppButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center space-x-2 font-semibold transition-all duration-300';
  
  const variants = {
    primary: 'bg-gradient-to-r from-primary-600 to-primary-400 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full hover:shadow-2xl hover:scale-105',
    secondary: 'text-primary-600 hover:text-primary-600',
    floating: 'fixed bottom-6 right-6 w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full shadow-2xl hover:scale-110 z-50 animate-bounce',
  };

  const iconSizes = {
    primary: 20,
    secondary: 18,
    floating: 28,
  };

  return (
    <a
      href={createWhatsAppLink(service)}
      target="_blank"
      rel="noopener noreferrer"
      className={`${baseClasses} ${variants[variant]} ${className}`}
      aria-label={service ? `Agendar ${service}` : 'Fale conosco no WhatsApp'}
    >
      <MessageCircle size={iconSizes[variant]} />
      {children && <span>{children}</span>}
      {variant === 'primary' && <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />}
    </a>
  );
}

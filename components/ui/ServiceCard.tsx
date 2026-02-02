import { ChevronRight } from 'lucide-react';
import { createWhatsAppLink } from '@/lib/utils';

interface ServiceCardProps {
  title: string;
  description: string;
  icon: string;
  index?: number;
}

export default function ServiceCard({ title, description, icon, index = 0 }: ServiceCardProps) {
  return (
    <div 
      className="group bg-gradient-to-br from-slate-50 to-primary-50 p-6 sm:p-8 rounded-2xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-slate-100"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="text-4xl sm:text-5xl mb-4">{icon}</div>
      <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-3">{title}</h3>
      <p className="text-sm sm:text-base text-slate-600 mb-6">{description}</p>
      <a 
        href={createWhatsAppLink(title)}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center space-x-2 text-primary-600 font-semibold group-hover:text-primary-600 transition-colors text-sm sm:text-base"
      >
        <span>Agendar agora</span>
        <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
      </a>
    </div>
  );
}

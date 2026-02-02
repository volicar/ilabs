import { siteConfig } from './config';

export const createWhatsAppLink = (service?: string): string => {
  const message = service 
    ? `Olá! Gostaria de agendar: ${service}`
    : 'Olá! Gostaria de agendar uma consulta.';
  
  return `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(message)}`;
};

export const formatPhone = (phone: string): string => {
  return phone.replace(/\D/g, '');
};

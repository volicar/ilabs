// Configuração central do site
export const siteConfig = {
  name: 'iLABS LABORATÓRIO',
  description: 'Sua saúde é nossa prioridade',
  whatsapp: '5521967664756', 
  
  contact: {
    phone: '(21)96766-4756',
    email: 'contato@clinicavidaplena.com.br',
    address: {
      street: 'Rua Cardoso de Morais 224',
      neighborhood: 'Bonsucesso',
      city: 'Rio de Janeiro',
      state: 'RJ',
      zip: '21032-025',
    },
  },

  hours: {
    weekday: 'Segunda a Sexta: 7h às 19h',
    saturday: 'Sábado: 8h às 13h',
    sunday: 'Domingo e Feriados: Fechado',
  },

  stats: {
    years: '16+',
    patients: '25k+',
    satisfaction: '98%',
  },

  social: {
    facebook: '',
    instagram: 'ilabslaboratorio',
    linkedin: '',
  },

  // URL do Google Maps Embed
  mapsEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d7352.814534964087!2d-43.254784!3d-22.861409!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x997c00818c7a11%3A0x158e723337cee641!2sCondom%C3%ADnio%20Vila%20Bonsucesso%20-%20Rua%20Cardoso%20de%20Morais%20-%20Bonsucesso%2C%20Rio%20de%20Janeiro%20-%20RJ%2C%2021032-000!5e0!3m2!1spt-BR!2sbr!4v1770009666914!5m2!1spt-BR!2sbrhttps://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4609.870222017115!2d-43.25735892374452!3d-22.861403936252504!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x997c0081a3d0db%3A0x4862f5196590aada!2sCondom%C3%ADnio%20Vila%20Bonsucesso%20-%20Rua%20Cardoso%20de%20Morais%2C%20224%20-%20Bonsucesso%2C%20Rio%20de%20Janeiro%20-%20RJ%2C%2021032-025!5e1!3m2!1spt-BR!2sbr!4v1770000623266!5m2!1spt-BR!2sbr',

  results: {
    patient: '',
    doctor: '',
  },
};


export const services = [
  {
    id: 1,
    title: 'Clínica Geral',
    description: 'Atendimento completo para toda a família com profissionais experientes.',
    icon: '👨‍⚕️',
  },
  {
    id: 2,
    title: 'Pediatria',
    description: 'Cuidado especializado para a saúde e desenvolvimento do seu filho.',
    icon: '👶',
  },
  {
    id: 3,
    title: 'Cardiologia',
    description: 'Prevenção e tratamento de doenças cardiovasculares com tecnologia avançada.',
    icon: '❤️',
  },
  {
    id: 4,
    title: 'Dermatologia',
    description: 'Tratamentos estéticos e clínicos para saúde da sua pele.',
    icon: '✨',
  },
  {
    id: 5,
    title: 'Ortopedia',
    description: 'Diagnóstico e tratamento de problemas ósseos e articulares.',
    icon: '🦴',
  },
  {
    id: 6,
    title: 'Check-up Executivo',
    description: 'Avaliação completa da saúde com resultados rápidos e precisos.',
    icon: '📊',
  },
];

export const testimonials = [
  {
    id: 1,
    name: 'Maria Silva',
    text: 'Excelente atendimento! A equipe é muito atenciosa e os médicos são extremamente competentes.',
    rating: 5,
  },
  {
    id: 2,
    name: 'João Santos',
    text: 'Ambiente agradável e moderno. O agendamento pelo WhatsApp facilita muito!',
    rating: 5,
  },
  {
    id: 3,
    name: 'Ana Oliveira',
    text: 'Melhor clínica da região. Sempre sou muito bem atendida e os resultados são rápidos.',
    rating: 5,
  },
];

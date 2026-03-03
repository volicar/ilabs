// Configuração central do site
export const siteConfig = {
  name: 'iLABS LABORATÓRIO',
  description: 'Sua saúde é nossa prioridade',
  whatsapp: '5521967664756', 
  
  contact: {
    phone: '(21) 3437-8274',
    email: 'contato@clinicavidaplena.com.br',
    address: {
      street: 'Rua Cardoso de Morais 224',
      neighborhood: 'Bonsucesso',
      city: 'Rio de Janeiro',
      state: 'RJ',
      zip: '21032-000',
    },
  },

  hours: {
    weekday: 'Segunda a Sexta: 7h às 17h',
    saturday: 'Sábado: 7h às 12h',
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
    title: 'Exames Laboratoriais',
    description: 'Hemograma completo, Glicose, Lipidograma, Hormônios em geral, exames de urina, fezes, análise de preventivo, biópsias e muitos outros exames.',
    icon: '👨‍⚕️',
  },
  {
    id: 2,
    title: 'Coleta Domiciliar',
    description: 'Realize seus exames no conforto da sua casa.',
    icon: '💉🏠',
  },
  {
    id: 3,
    title: 'Teste de Paternidade',
    description: 'Resultados seguros e precisos em até 10 dias úteis.',
    icon: '🧬',
  },
  {
    id: 4,
    title: 'Sexagem Fetal',
    description: 'Descubra o sexo do seu bebê a partir de 8 semanas de gestação.',
    icon: '👶',
  },
  {
    id: 5,
    title: 'Toxicológico para Detran, Concursos e CLT',
    description: 'Exame realizado para identificar o uso de drogas nos últimos 90 dias.',
    icon: '🔬',
  },
  {
    id: 6,
    title: 'Vacinação',
    description: 'Excelência em imunização, previna-se contra diversos tipos de doenças.',
    icon: '💉',
  },
];


export const bannerSlides = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1920&h=600&fit=crop',
    alt: 'Banner 1 - Laboratório moderno',
    title: 'Exames com Qualidade',
    subtitle: 'Tecnologia de ponta para resultados precisos',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=1920&h=600&fit=crop',
    alt: 'Banner 2 - Equipe profissional',
    title: 'Equipe Especializada',
    subtitle: 'Profissionais experientes ao seu dispor',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=1920&h=600&fit=crop',
    alt: 'Banner 3 - Atendimento',
    title: 'Atendimento Rápido',
    subtitle: 'Agende seu exame pelo WhatsApp',
  },
];

// CONFIGURAÇÕES DO CARROSSEL
export const carouselConfig = {
  autoPlayInterval: 5000,    // Tempo em milissegundos (5000 = 5 segundos)
  showControls: true,        // Mostrar setas de navegação
  showIndicators: true,      // Mostrar bolinhas indicadoras
};

// HERO SECTION CONFIG
export const heroSlides = [
  {
    id: 1,
    image: '/images/banner/doctor-performing.jpg',
    alt: 'Profissional de saúde',
    title: 'Exames com Precisão',
    subtitle: 'Resultados confiáveis e rápidos',
  },
  {
    id: 2,
    image: '/images/banner/gynecologist-ultrasound.jpg',
    alt: 'Equipe especializada',
    title: 'Equipe Especializada',
    subtitle: 'Cuidado humano e profissional',
  },
  {
    id: 3,
    image: '/images/banner/blood-sample.jpg',
    alt: 'Atendimento humanizado',
    title: 'Atendimento Ágil',
    subtitle: 'Agende seus exames pelo WhatsApp',
  },
];

export const heroCarouselConfig = {
  autoPlayInterval: 4500,
  showControls: true,
  showIndicators: true,
};


export const testimonials = [
  {
    id: 1,
    name: 'Fabia Fernanda',
    text: 'Fui muito bem atendida pelas recepcionistas Thais, Millena e Wanessa que são maravilhosas. E as enfermeiras Grazi e a Gabi que me ajudaram a me  distrair durante o exame, pq tenho muita sensibilidade e acabo desmaiando, mas dessa vez deu tudo certo. Equipe maravilhosa.',
    rating: 5,
    photo: 'https://lh3.googleusercontent.com/a-/ALV-UjVxq1OAIAI-gemjkJHhZkIK8lebScY3c6htSmRgZ-5V1cEANDOy=s400-c',
    date: 'Fevereiro 2026',
  },
    {
    id: 2,
    name: 'Matheus Almeida',
    text: 'Fui muito bem atendido',
    rating: 5,
    photo: 'https://lh3.googleusercontent.com/a-/ALV-UjVr4AuNP9bxjUMVjIn170dzjqLazTseyA4KO2AY4_kCHwivG45K9Q=s400-c',
    date: 'Fevereiro 2026',
  },
  {
    id: 3,
    name: 'Simone Dantas',
    text: 'Fui muito bem atendida, as meninas da recepção são muito educadas, muito gentis. A coletora Gabriele foi muito simpática e a mão super leve. Recomendo demais o laboratório.',
    rating: 5,
    photo: 'https://lh3.googleusercontent.com/a-/ALV-UjUpMg3X_1LKt82XHqc_LOwiit7bj5f4l3L1B2Azw56UB_iOxGA=s400-c',
    date: 'Janeiro 2026',
  },
  {
    id: 4,
    name: 'Edson Marques',
    text: 'Excelente atendimento, super recomendado',
    rating: 5,
    photo: 'https://lh3.googleusercontent.com/a-/ALV-UjUx1UlkH3O4qFwyZ9wkpN4WWbGmnJw-bjx-fiG5zwuPmpRkVvN4=s400-c',
    date: 'Fevereiro 2026',
  },
    {
    id: 5,
    name: 'Mariana Matias',
    text: 'Segunda vez que faço meus exames nesse lugar e nas 2 vezes tive um ótimo atendimento e resultados rápidos. Super recomendo',
    rating: 5,
    photo: 'https://lh3.googleusercontent.com/a-/ALV-UjXF0WdfzzBjguouk-sllC_F7WNvW7re8IuCaGucyeZckvKxwQ4=s400-c',
    date: 'Janeiro 2026',
  },
];

// Configuração do carrossel
export const testimonialsConfig = {
  autoPlayInterval: 6000, // 6 segundos por depoimento
};


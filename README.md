# 🏥 Clínica Vida Plena - Versão Componentizada

Site profissional para clínica médica com **arquitetura componentizada**, seguindo as melhores práticas de desenvolvimento React/Next.js.

## 📁 Estrutura do Projeto

```
clinica-componentizado/
├── app/
│   ├── page.tsx              # Página principal (orquestra os componentes)
│   ├── layout.tsx            # Layout global + fontes
│   └── globals.css           # Estilos globais + animações
├── components/
│   ├── layout/               # Componentes de layout
│   │   ├── Header.tsx        # Cabeçalho com menu
│   │   └── Footer.tsx        # Rodapé
│   ├── sections/             # Seções da página
│   │   ├── HeroSection.tsx   # Seção principal
│   │   ├── ServicesSection.tsx
│   │   ├── AboutSection.tsx
│   │   ├── TestimonialsSection.tsx
│   │   ├── LocationSection.tsx
│   │   └── CTASection.tsx
│   └── ui/                   # Componentes reutilizáveis
│       ├── WhatsAppButton.tsx # Botão WhatsApp (3 variantes)
│       ├── ServiceCard.tsx    # Card de serviço
│       └── TestimonialCard.tsx # Card de depoimento
├── lib/
│   ├── config.ts             # ⚙️ CONFIGURAÇÃO CENTRAL
│   └── utils.ts              # Funções utilitárias
├── public/                   # Arquivos estáticos
└── [arquivos de configuração]
```

## ✨ Vantagens da Componentização

### 1. **Configuração Centralizada**
Todos os dados do site em **um único arquivo**: `lib/config.ts`

```typescript
export const siteConfig = {
  name: 'Clínica Vida Plena',
  whatsapp: '5511999887766', // ← Mude só aqui!
  contact: { /* ... */ },
  hours: { /* ... */ },
  // ...
};
```

### 2. **Componentes Reutilizáveis**
- **WhatsAppButton**: Usa em qualquer lugar com 3 variantes
- **ServiceCard**: Adicione serviços facilmente
- **TestimonialCard**: Gerencia depoimentos

### 3. **Fácil Manutenção**
- Cada componente em seu próprio arquivo
- Fácil de encontrar e modificar
- Menos código duplicado

### 4. **Escalável**
- Adicione novas seções facilmente
- Crie novas páginas reutilizando componentes
- Expanda sem quebrar o existente

## 🚀 Como Usar

### Instalação

```bash
npm install
npm run dev
```

## ⚙️ Configuração Rápida

### 1️⃣ Edite `lib/config.ts` (PRINCIPAL)

```typescript
export const siteConfig = {
  name: 'Clínica Vida Plena',        // ← Nome da clínica
  whatsapp: '5511999887766',         // ← Número WhatsApp
  
  contact: {
    phone: '(11) 9998-8776',         // ← Telefone
    address: {
      street: 'Av. Paulista, 1578',  // ← Endereço
      // ...
    },
  },
  
  hours: {
    weekday: 'Segunda a Sexta: 7h às 19h', // ← Horários
    // ...
  },
  
  mapsEmbedUrl: 'https://...',       // ← Google Maps
};

// Adicione ou remova serviços
export const services = [
  {
    id: 1,
    title: 'Clínica Geral',
    description: '...',
    icon: '👨‍⚕️',
  },
  // ...
];

// Adicione ou remova depoimentos
export const testimonials = [ /* ... */ ];
```

### 2️⃣ Personalize Componentes (Opcional)

**Mudar cores do botão WhatsApp:**
```typescript
// components/ui/WhatsAppButton.tsx
const variants = {
  primary: 'bg-gradient-to-r from-green-600 to-emerald-500 ...', // ← Nova cor
};
```

**Adicionar nova seção:**
```typescript
// components/sections/NovaSecao.tsx
export default function NovaSecao() {
  return <section>...</section>;
}

// app/page.tsx
import NovaSecao from '@/components/sections/NovaSecao';

export default function Home() {
  return (
    <>
      <HeroSection />
      <NovaSecao />  {/* ← Adicione aqui */}
      {/* ... */}
    </>
  );
}
```

## 🎨 Customização Avançada

### Variantes do Botão WhatsApp

```tsx
// Botão principal (gradiente azul)
<WhatsAppButton variant="primary">
  Agendar Consulta
</WhatsAppButton>

// Link simples (sem fundo)
<WhatsAppButton variant="secondary">
  Fale Conosco
</WhatsAppButton>

// Botão flutuante (verde, canto da tela)
<WhatsAppButton variant="floating" />

// Com serviço específico
<WhatsAppButton service="Cardiologia" variant="primary">
  Agendar Cardiologia
</WhatsAppButton>
```

### Cards Personalizados

```tsx
// Adicionar serviço
// Em lib/config.ts
export const services = [
  // ... existentes
  {
    id: 7,
    title: 'Ginecologia',
    description: 'Saúde integral da mulher',
    icon: '🌸',
  },
];
```

## 📦 Componentes Disponíveis

### Layout
- **Header**: Menu responsivo com WhatsApp
- **Footer**: Rodapé com informações

### Seções
- **HeroSection**: Banner principal com CTA
- **ServicesSection**: Grid de serviços
- **AboutSection**: Sobre a clínica
- **TestimonialsSection**: Depoimentos
- **LocationSection**: Mapa + contato
- **CTASection**: Chamada para ação final

### UI Components
- **WhatsAppButton**: Botão multi-variante
- **ServiceCard**: Card de serviço com link
- **TestimonialCard**: Card de depoimento com estrelas

## 🔧 Estrutura de Dados

### Tipo Service
```typescript
{
  id: number;
  title: string;
  description: string;
  icon: string; // Emoji
}
```

### Tipo Testimonial
```typescript
{
  id: number;
  name: string;
  text: string;
  rating: number; // 1-5
}
```

## 🚀 Deploy na Vercel

```bash
# Opção 1: GitHub
git init
git add .
git commit -m "Initial commit"
git push

# Na Vercel: conecte o repo

# Opção 2: Deploy direto
vercel
```

## 📝 Boas Práticas Implementadas

✅ **Separação de responsabilidades**
- Dados em `lib/config.ts`
- Lógica em `lib/utils.ts`
- UI em `components/`

✅ **TypeScript**
- Props tipadas
- Autocompletar no editor
- Menos bugs

✅ **Componentes puros**
- Reutilizáveis
- Testáveis
- Documentados

✅ **Responsividade**
- Mobile-first
- Breakpoints Tailwind
- Touch-friendly

✅ **Performance**
- Next.js App Router
- Lazy loading de imagens
- CSS otimizado

## 🆚 Diferenças vs Versão Anterior

| Aspecto | Antes | Agora |
|---------|-------|-------|
| Estrutura | Tudo em 1 arquivo | Componentizado |
| Configuração | Espalhada | Centralizada |
| Reutilização | Difícil | Fácil |
| Manutenção | Complexa | Simples |
| Escalabilidade | Limitada | Alta |

## 💡 Exemplos de Uso

### Adicionar novo depoimento

```typescript
// lib/config.ts
export const testimonials = [
  // ... existentes
  {
    id: 4,
    name: 'Pedro Costa',
    text: 'Ótima experiência!',
    rating: 5,
  },
];
```

### Mudar horário de funcionamento

```typescript
// lib/config.ts
export const siteConfig = {
  // ...
  hours: {
    weekday: 'Segunda a Sexta: 8h às 20h', // ← Mudou aqui
    saturday: 'Sábado: 9h às 14h',
    sunday: 'Fechado',
  },
};
```

### Adicionar rede social

```typescript
// lib/config.ts
export const siteConfig = {
  // ...
  social: {
    instagram: '@clinicavidaplena',
    facebook: 'clinicavidaplena',
  },
};

// components/layout/Footer.tsx
// Adicione links para redes sociais
```

## 🎯 Próximos Passos

Após personalizar:
1. ✅ Configure `lib/config.ts`
2. ✅ Teste localmente (`npm run dev`)
3. ✅ Faça deploy na Vercel
4. ✅ Configure domínio
5. ✅ Apresente ao cliente!

## 📞 Manutenção

Para fazer manutenção mensal:
- **Dados**: Edite `lib/config.ts`
- **Componentes**: Modifique em `components/`
- **Estilos**: Ajuste em `app/globals.css` ou `tailwind.config.js`

## 🔥 Melhorias Futuras

Sugestões de features adicionais:
- [ ] Blog integrado
- [ ] Sistema de agendamento
- [ ] Área do paciente
- [ ] Chat ao vivo
- [ ] Multi-idioma
- [ ] Analytics dashboard

---

**Desenvolvido com ❤️ e boas práticas de código**

## 📚 Recursos

- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [Lucide Icons](https://lucide.dev)

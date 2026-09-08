import {
  Baby,
  Dna,
  FlaskConical,
  HeartPulse,
  Home,
  Microscope,
  ShieldCheck,
  Stethoscope,
  Syringe,
  TestTube,
  type LucideIcon,
} from 'lucide-react';

// Ícones disponíveis para os cards de serviço.
// A chave é o nome usado no CMS (campo `icon` da tabela `services`).
export const SERVICE_ICONS: Record<string, LucideIcon> = {
  stethoscope: Stethoscope,
  'test-tube': TestTube,
  'flask-conical': FlaskConical,
  microscope: Microscope,
  dna: Dna,
  baby: Baby,
  syringe: Syringe,
  home: Home,
  'heart-pulse': HeartPulse,
  'shield-check': ShieldCheck,
};

// Rótulos exibidos no CMS para quem escolhe o ícone.
export const SERVICE_ICON_LABELS: Record<string, string> = {
  stethoscope: 'Consulta / atendimento',
  'test-tube': 'Exame laboratorial',
  'flask-conical': 'Análise clínica',
  microscope: 'Toxicológico / microscopia',
  dna: 'Exame genético / DNA',
  baby: 'Gestação / bebê',
  syringe: 'Vacinação / coleta',
  home: 'Atendimento domiciliar',
  'heart-pulse': 'Check-up / cardiológico',
  'shield-check': 'Prevenção / segurança',
};

// Compatibilidade: serviços antigos gravados com emoji continuam funcionando.
const EMOJI_TO_ICON: Record<string, string> = {
  '👨‍⚕️': 'stethoscope',
  '💉🏠': 'home',
  '🧬': 'dna',
  '👶': 'baby',
  '🔬': 'microscope',
  '💉': 'syringe',
  '🧪': 'test-tube',
  '⚗️': 'flask-conical',
  '❤️': 'heart-pulse',
  '🛡️': 'shield-check',
};

export function resolveServiceIcon(icon: string): LucideIcon | null {
  if (!icon) return null;
  const key = icon.trim();
  return SERVICE_ICONS[key.toLowerCase()] ?? SERVICE_ICONS[EMOJI_TO_ICON[key]] ?? null;
}

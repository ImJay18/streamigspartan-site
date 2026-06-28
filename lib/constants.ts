export const SPARTAN_COLORS = {
  bg:       '#050505',
  purple:   '#8B5CF6',
  magenta:  '#D946EF',
  white:    '#FFFFFF',
  gray:     '#A1A1AA',
  card:     '#0F0F0F',
  border:   '#1A1A2E',
} as const

export const NAV_LINKS = [
  { label: 'Inicio',             href: '#inicio' },
  { label: 'Catálogo',           href: '#plataformas' },
  { label: 'Combos',             href: '#combos' },
  { label: 'Tutoriales',         href: '#como-funciona' },
  { label: 'Preguntas frecuentes', href: '#faq' },
] as const

export const WHATSAPP_NUMBER = '3207685459'

export const WHATSAPP_MESSAGES = {
  general:  '¡Hola! Me interesa conocer más sobre los planes de Streaming Spartan.',
  platform: (name: string) => `¡Hola! Quiero información sobre los planes de ${name}.`,
  combo:    (name: string) => `¡Hola! Quiero adquirir el ${name} de Streaming Spartan.`,
} as const

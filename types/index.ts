export type LeadStatus = 'new' | 'contacted' | 'quoted' | 'sold' | 'lost'

export type LeadSource = 'landing' | 'instagram' | 'referral' | 'whatsapp' | 'manual' | 'meta_lead_ad'

export type UserRole = 'admin' | 'agent'

export interface Lead {
  id: string
  name: string
  email: string
  phone: string | null
  source: string
  status: LeadStatus
  assigned_to: string | null
  notes: string | null
  utm_source: string | null
  utm_medium: string | null
  utm_campaign: string | null
  meta_leadgen_id: string | null
  created_at: string
  updated_at: string
}

export interface LeadStatusHistory {
  id: string
  lead_id: string
  from_status: string | null
  to_status: string
  changed_by: string | null
  changed_at: string
}

export type PaymentMethod = 'stripe' | 'mercadopago' | 'transferencia' | 'efectivo'
export type PaymentStatus = 'pending' | 'paid' | 'refunded'

export interface Order {
  id: string
  lead_id: string | null
  buyer_name: string
  buyer_email: string
  amount_usd: number
  payment_method: PaymentMethod
  payment_status: PaymentStatus
  stripe_session_id: string | null
  notes: string | null
  created_at: string
}

export interface BuyerProfile {
  id: string
  user_id: string | null
  order_id: string | null
  name: string | null
  email: string | null
  onboarding_completed: boolean
  checklist_items: Record<string, unknown>
  created_at: string
}

export interface DashboardUser {
  id: string
  user_id: string
  name: string | null
  email: string | null
  role: UserRole
  created_at: string
}

export type HeroBgType = 'color' | 'image' | 'video'

export interface LandingSettings {
  id: string
  hero_title: string
  hero_tagline: string
  hero_price: string
  hero_bg_type: HeroBgType
  hero_bg_url: string | null
  primary_color: string
  secondary_color: string
  updated_at: string
}

export interface LandingFeature {
  id: string
  emoji: string
  title: string
  description: string
  sort_order: number
  created_at: string
}

export const DEFAULT_SETTINGS: LandingSettings = {
  id: '',
  hero_title: 'El Eclipse del Dragón',
  hero_tagline: 'El 6 de febrero de 2027, la Cabeza del Dragón estará sobre Esquel. Solo Pueblo Carao tiene un dragón de hierro esperando este momento.',
  hero_price: '$300 USD',
  hero_bg_type: 'color',
  hero_bg_url: null,
  primary_color: '#7c3aed',
  secondary_color: '#d97706',
  updated_at: '',
}

export const DEFAULT_FEATURES: LandingFeature[] = [
  { id: '1', emoji: '✉️', title: 'Preparación mensual', description: 'Cuatro entregas de contenido antes del evento: el mito del dragón celeste, la física del eclipse anular, la historia de Carao y las instrucciones para el día. Llegás sabiendo qué va a pasar y por qué importa.', sort_order: 0, created_at: '' },
  { id: '2', emoji: '🎁', title: 'Kit del asistente', description: 'Al llegar recibís el mapa del evento, el mito impreso, los tiempos exactos del eclipse, y un espacio en blanco para escribir lo que viste. Algo para guardar.', sort_order: 1, created_at: '' },
  { id: '3', emoji: '🍳', title: 'Desayuno · Galletas Eclipse', description: 'Mesa buffet antes del anillo. Incluye las Galletas Eclipse de edición limitada, elaboradas especialmente para este evento.', sort_order: 2, created_at: '' },
  { id: '4', emoji: '🎤', title: 'Presentación de 20 minutos', description: 'Antes de la cobertura parcial, una presentación que activa el relato: no es una clase de astronomía, es parte de la narrativa del evento.', sort_order: 3, created_at: '' },
  { id: '5', emoji: '🌑', title: 'Los 7 minutos del anillo', description: 'El silencio acordado. La sombra del dragón de hierro iluminada desde el cielo. El cambio de luz, el frío repentino, el comportamiento de los animales. Todo anticipado, todo cargado de sentido.', sort_order: 4, created_at: '' },
  { id: '6', emoji: '🎉', title: 'Sol Fest · Celebración', description: 'Después del anillo, la fiesta abre: música en vivo, gastronomía en restaurante, fotografía, arte y yoga. El evento no termina con el eclipse.', sort_order: 5, created_at: '' },
  { id: '7', emoji: '📬', title: 'Pieza de cierre', description: '48 horas después recibís un texto que devuelve la experiencia con las palabras que no tuviste en el momento. No es un agradecimiento.', sort_order: 6, created_at: '' },
  { id: '8', emoji: '📷', title: 'Archivo de memoria', description: 'Selección fotográfica digital con criterio narrativo. No es contenido de redes: es el racconto de lo que viviste.', sort_order: 7, created_at: '' },
]

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
  hero_title: 'Eclipse en Pueblo Carao · 2027',
  hero_tagline: 'Una noche que el universo preparó millones de años',
  hero_price: '$300 USD',
  hero_bg_type: 'color',
  hero_bg_url: null,
  primary_color: '#7c3aed',
  secondary_color: '#d97706',
  updated_at: '',
}

export const DEFAULT_FEATURES: LandingFeature[] = [
  { id: '1', emoji: '🍷', title: 'Picnic gourmet', description: 'Selección de quesos, chacinados patagónicos, pan artesanal y vinos de bodega local bajo las estrellas.', sort_order: 0, created_at: '' },
  { id: '2', emoji: '🔭', title: 'Guía de astroturismo', description: 'Acompañamiento experto durante el eclipse: historia, ciencia y mitología del cielo patagónico.', sort_order: 1, created_at: '' },
  { id: '3', emoji: '📱', title: 'App digital exclusiva', description: 'Realidad aumentada para identificar constelaciones y mapa interactivo del eclipse en tiempo real.', sort_order: 2, created_at: '' },
  { id: '4', emoji: '📜', title: 'Certificado de experiencia', description: 'Documento oficial que acredita tu presencia en uno de los eventos astronómicos más raros del siglo.', sort_order: 3, created_at: '' },
]

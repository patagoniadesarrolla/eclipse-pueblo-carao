export type LeadStatus = 'new' | 'contacted' | 'quoted' | 'sold' | 'lost'

export type LeadSource = 'landing' | 'instagram' | 'referral' | 'whatsapp' | 'manual'

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
  created_at: string
  updated_at: string
}

export interface DashboardUser {
  id: string
  user_id: string
  name: string | null
  email: string | null
  role: UserRole
  created_at: string
}

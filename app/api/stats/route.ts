import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export const runtime = 'nodejs'

/* ── Helpers ─────────────────────────────────────────────────────────────── */

function periodStart(period: string): Date {
  const d = new Date()
  if (period === '7d')  d.setDate(d.getDate() - 7)
  else if (period === '30d') d.setDate(d.getDate() - 30)
  else if (period === '90d') d.setDate(d.getDate() - 90)
  else return new Date('2000-01-01')
  return d
}

function timeAgo(ts: string): string {
  const mins = Math.floor((Date.now() - new Date(ts).getTime()) / 60000)
  if (mins < 60) return `hace ${mins} min`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `hace ${hours} hora${hours > 1 ? 's' : ''}`
  const days = Math.floor(hours / 24)
  return `hace ${days} día${days > 1 ? 's' : ''}`
}

function weekLabel(d: Date): string {
  return d.toLocaleDateString('es-AR', { day: '2-digit', month: 'short' })
}

/* ── Status meta ─────────────────────────────────────────────────────────── */

const STATUS_LABELS: Record<string, string> = {
  new: 'Nuevo', contacted: 'Contactado', quoted: 'Cotizado', sold: 'Vendido', lost: 'Perdido',
}
const STATUS_COLORS: Record<string, string> = {
  new: '#6b7280', contacted: '#3b82f6', quoted: '#f59e0b', sold: '#10b981', lost: '#ef4444',
}

/* ── Route ───────────────────────────────────────────────────────────────── */

export async function GET(req: NextRequest) {
  const period = req.nextUrl.searchParams.get('period') ?? '30d'

  const now = new Date()
  const pStart  = periodStart(period)
  const pDays   = period === '7d' ? 7 : period === '30d' ? 30 : period === '90d' ? 90 : null
  const prevStart = pDays
    ? new Date(now.getTime() - pDays * 2 * 86400000)
    : new Date('2000-01-01')

  const weeks8Start = new Date(now.getTime() - 56 * 86400000)

  // ── Parallel queries ───────────────────────────────────────────────────
  const [
    { data: allLeads },
    { data: leadsChart },
    { data: allOrders },
    { data: historyRaw },
    { data: recentOrdersRaw },
    { data: recentLeadsRaw },
  ] = await Promise.all([
    supabaseAdmin.from('leads').select('id, status, source, created_at'),
    supabaseAdmin.from('leads').select('id, source, created_at').gte('created_at', weeks8Start.toISOString()),
    supabaseAdmin.from('orders').select('id, amount_usd, payment_status, buyer_name, created_at').order('created_at', { ascending: false }),
    supabaseAdmin.from('lead_status_history').select('id, from_status, to_status, changed_at, leads(name)').order('changed_at', { ascending: false }).limit(10),
    supabaseAdmin.from('orders').select('id, buyer_name, amount_usd, created_at').order('created_at', { ascending: false }).limit(5),
    supabaseAdmin.from('leads').select('id, name, created_at').order('created_at', { ascending: false }).limit(5),
  ])

  const leads  = allLeads ?? []
  const orders = allOrders ?? []

  // ── Period filters ─────────────────────────────────────────────────────
  const inP    = (d: string) => new Date(d) >= pStart
  const inPrev = (d: string) => new Date(d) >= prevStart && new Date(d) < pStart

  const pLeads     = leads.filter(l => inP(l.created_at))
  const prevLeads  = leads.filter(l => inPrev(l.created_at))
  const paidOrders = orders.filter(o => o.payment_status === 'paid')
  const pPaid      = paidOrders.filter(o => inP(o.created_at))
  const prevPaid   = paidOrders.filter(o => inPrev(o.created_at))

  const w7Start   = new Date(now.getTime() - 7  * 86400000)
  const w14Start  = new Date(now.getTime() - 14 * 86400000)
  const thisWeek  = leads.filter(l => new Date(l.created_at) >= w7Start)
  const prevWeek  = leads.filter(l => new Date(l.created_at) >= w14Start && new Date(l.created_at) < w7Start)

  // ── Cards ──────────────────────────────────────────────────────────────
  const soldP     = pLeads.filter(l => l.status === 'sold').length
  const soldPrev  = prevLeads.filter(l => l.status === 'sold').length
  const conv      = pLeads.length  ? +(soldP   / pLeads.length  * 100).toFixed(1) : 0
  const prevConv  = prevLeads.length ? +(soldPrev / prevLeads.length * 100).toFixed(1) : 0
  const revenue   = pPaid.reduce((s, o)    => s + Number(o.amount_usd), 0)
  const prevRev   = prevPaid.reduce((s, o) => s + Number(o.amount_usd), 0)

  const cards = {
    totalLeads:           pLeads.length,
    totalLeadsChange:     pLeads.length - prevLeads.length,
    leadsThisWeek:        thisWeek.length,
    leadsThisWeekChange:  thisWeek.length - prevWeek.length,
    conversionRate:       conv,
    conversionRateChange: +(conv - prevConv).toFixed(1),
    totalRevenue:         revenue,
    totalRevenueChange:   revenue - prevRev,
  }

  // ── 8-week buckets ─────────────────────────────────────────────────────
  const buckets = Array.from({ length: 8 }, (_, i) => {
    const bStart = new Date(now.getTime() - (8 - i) * 7 * 86400000)
    const bEnd   = new Date(now.getTime() - (7 - i) * 7 * 86400000)
    return { start: bStart, end: bEnd, label: weekLabel(bStart) }
  })

  const leadsByWeek = buckets.map(({ start, end, label }) => {
    const wl = (leadsChart ?? []).filter(l => { const d = new Date(l.created_at); return d >= start && d < end })
    return {
      week:         label,
      landing:      wl.filter(l => l.source === 'landing').length,
      meta_lead_ad: wl.filter(l => l.source === 'meta_lead_ad').length,
      otro:         wl.filter(l => l.source !== 'landing' && l.source !== 'meta_lead_ad').length,
    }
  })

  const revenueByWeek = buckets.map(({ start, end, label }) => ({
    week:    label,
    revenue: paidOrders
      .filter(o => { const d = new Date(o.created_at); return d >= start && d < end })
      .reduce((s, o) => s + Number(o.amount_usd), 0),
  }))

  // ── Pipeline ───────────────────────────────────────────────────────────
  const pipeline = ['new', 'contacted', 'quoted', 'sold', 'lost'].map(status => ({
    status,
    label: STATUS_LABELS[status],
    color: STATUS_COLORS[status],
    count: leads.filter(l => l.status === status).length,
  }))

  // ── Source conversion ─────────────────────────────────────────────────
  const SOURCES = [
    { key: 'landing', label: 'Landing' },
    { key: 'meta_lead_ad', label: 'Meta Ads' },
    { key: 'manual', label: 'Manual' },
  ]
  const sourceConversion = SOURCES.map(({ key, label }) => {
    const sl   = pLeads.filter(l => l.source === key)
    const sold = sl.filter(l => l.status === 'sold').length
    return { source: key, label, leads: sl.length, sold, rate: sl.length ? +(sold / sl.length * 100).toFixed(1) : 0 }
  })

  // ── Recent activity ────────────────────────────────────────────────────
  type HistRow = { id: string; from_status: string | null; to_status: string; changed_at: string; leads?: { name: string } | { name: string }[] | null }
  type OrdRow  = { id: string; buyer_name: string; amount_usd: number; created_at: string }
  type LdRow   = { id: string; name: string; created_at: string }

  const histEvents = ((historyRaw ?? []) as HistRow[]).map(h => ({
    type: 'status_change' as const,
    description: (() => {
      const leadName = Array.isArray(h.leads) ? h.leads[0]?.name : (h.leads as { name: string } | null)?.name
      return h.from_status
        ? `${leadName ?? 'Lead'} pasó de ${STATUS_LABELS[h.from_status] ?? h.from_status} a ${STATUS_LABELS[h.to_status] ?? h.to_status}`
        : `${leadName ?? 'Lead'} ingresó como ${STATUS_LABELS[h.to_status] ?? h.to_status}`
    })(),
    ts:  h.changed_at,
    ago: timeAgo(h.changed_at),
  }))
  const ordEvents = ((recentOrdersRaw ?? []) as OrdRow[]).map(o => ({
    type: 'new_order' as const,
    description: `Nueva orden · ${o.buyer_name} · $${o.amount_usd} USD`,
    ts:  o.created_at,
    ago: timeAgo(o.created_at),
  }))
  const ldEvents = ((recentLeadsRaw ?? []) as LdRow[]).map(l => ({
    type: 'new_lead' as const,
    description: `Nuevo lead · ${l.name}`,
    ts:  l.created_at,
    ago: timeAgo(l.created_at),
  }))

  const recentActivity = [...histEvents, ...ordEvents, ...ldEvents]
    .sort((a, b) => new Date(b.ts).getTime() - new Date(a.ts).getTime())
    .slice(0, 10)

  return NextResponse.json({ cards, leadsByWeek, pipeline, revenueByWeek, sourceConversion, recentActivity })
}

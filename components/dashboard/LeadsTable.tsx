'use client'

import { useState, useEffect, useRef } from 'react'
import { Lead, LeadStatus, LeadStatusHistory } from '@/types'
import { createClient } from '@/lib/supabase'

/* ─── Status ─────────────────────────────────────────────────────────────── */

const STATUS: Record<LeadStatus, { label: string; color: string; bg: string }> = {
  new:       { label: 'Nuevo',      color: '#60a5fa', bg: 'rgba(59,130,246,0.12)'  },
  contacted: { label: 'Contactado', color: '#fbbf24', bg: 'rgba(234,179,8,0.12)'   },
  quoted:    { label: 'Cotizado',   color: '#fb923c', bg: 'rgba(249,115,22,0.12)'  },
  sold:      { label: 'Vendido',    color: '#4ade80', bg: 'rgba(34,197,94,0.12)'   },
  lost:      { label: 'Perdido',    color: '#f87171', bg: 'rgba(239,68,68,0.12)'   },
}
const STATUS_KEYS = Object.keys(STATUS) as LeadStatus[]

function StatusBadge({ status }: { status: LeadStatus }) {
  const s = STATUS[status]
  return (
    <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-semibold"
      style={{ color: s.color, background: s.bg }}>
      {s.label}
    </span>
  )
}

/* ─── Source badges ───────────────────────────────────────────────────────── */

const META_ICON = (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.5 6.75c.414 0 .75.336.75.75v5c0 .414-.336.75-.75.75s-.75-.336-.75-.75v-5c0-.414.336-.75.75-.75zm-9 0c.414 0 .75.336.75.75v5c0 .414-.336.75-.75.75s-.75-.336-.75-.75v-5c0-.414.336-.75.75-.75zm4.5 1.5c.414 0 .75.336.75.75v2c0 .414-.336.75-.75.75s-.75-.336-.75-.75v-2c0-.414.336-.75.75-.75z"/>
  </svg>
)

function SourceBadge({ source }: { source: string }) {
  if (source === 'meta_lead_ad') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
        style={{ color: '#60a5fa', background: 'rgba(59,130,246,0.15)' }}>
        {META_ICON} Meta Ads
      </span>
    )
  }
  if (source === 'manual') {
    return (
      <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-semibold border"
        style={{ color: '#9ca3af', borderColor: 'rgba(156,163,175,0.3)', background: 'transparent' }}>
        Manual
      </span>
    )
  }
  return (
    <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-semibold"
      style={{ color: '#9ca3af', background: 'rgba(156,163,175,0.1)' }}>
      {source === 'landing' ? 'Landing' : source}
    </span>
  )
}

/* ─── StatusSelect ────────────────────────────────────────────────────────── */

function StatusSelect({ leadId, current, fromStatus, onSuccess }: {
  leadId: string
  current: LeadStatus
  fromStatus: LeadStatus
  onSuccess: () => void
}) {
  const [loading, setLoading] = useState(false)

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const next = e.target.value as LeadStatus
    if (next === current) return
    setLoading(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    await Promise.all([
      supabase.from('leads').update({ status: next }).eq('id', leadId),
      supabase.from('lead_status_history').insert({
        lead_id:    leadId,
        from_status: fromStatus,
        to_status:   next,
        changed_by:  user?.id ?? null,
      }),
    ])
    setLoading(false)
    onSuccess()
  }

  return (
    <select value={current} onChange={handleChange} disabled={loading}
      className="text-xs bg-gray-800 border border-gray-700 text-gray-300 rounded-md px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-violet-500 disabled:opacity-40 cursor-pointer">
      {STATUS_KEYS.map((s) => (
        <option key={s} value={s}>{STATUS[s].label}</option>
      ))}
    </select>
  )
}

/* ─── Lead detail panel ───────────────────────────────────────────────────── */

function LeadDetail({ lead, onClose, onRefresh }: {
  lead: Lead
  onClose: () => void
  onRefresh: () => void
}) {
  const [notes, setNotes]       = useState(lead.notes ?? '')
  const [history, setHistory]   = useState<LeadStatusHistory[]>([])
  const [saving, setSaving]     = useState(false)
  const saveTimer               = useRef<ReturnType<typeof setTimeout> | null>(null)
  const supabase                = createClient()

  useEffect(() => {
    supabase
      .from('lead_status_history')
      .select('*')
      .eq('lead_id', lead.id)
      .order('changed_at', { ascending: false })
      .then(({ data }) => setHistory(data ?? []))
  }, [lead.id])

  const handleNotes = (val: string) => {
    setNotes(val)
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(async () => {
      setSaving(true)
      await supabase.from('leads').update({ notes: val }).eq('id', lead.id)
      setSaving(false)
      onRefresh()
    }, 1200)
  }

  const fmt = (d: string) =>
    new Date(d).toLocaleString('es-AR', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' })

  return (
    <div className="fixed inset-0 z-50 flex justify-end" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-md bg-gray-950 border-l border-gray-800 h-full overflow-y-auto flex flex-col"
        style={{ boxShadow: '-8px 0 40px rgba(0,0,0,0.6)' }}>

        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b border-gray-800 sticky top-0 bg-gray-950 z-10">
          <div>
            <h2 className="text-white font-semibold text-lg leading-tight">{lead.name}</h2>
            <p className="text-gray-500 text-sm mt-0.5">{lead.email}</p>
          </div>
          <button onClick={onClose}
            className="text-gray-500 hover:text-white text-2xl leading-none ml-4 mt-0.5 transition-colors">
            ×
          </button>
        </div>

        <div className="flex-1 p-5 space-y-6">
          {/* Datos principales */}
          <section>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Datos</h3>
            <div className="space-y-2">
              {lead.phone && (
                <Row label="Teléfono" value={lead.phone} />
              )}
              <div className="flex items-center justify-between py-1.5">
                <span className="text-gray-500 text-sm">Fuente</span>
                <SourceBadge source={lead.source} />
              </div>
              <div className="flex items-center justify-between py-1.5">
                <span className="text-gray-500 text-sm">Estado</span>
                <StatusBadge status={lead.status} />
              </div>
              <Row label="Registro" value={fmt(lead.created_at)} />
            </div>
          </section>

          {/* UTMs */}
          {(lead.utm_source || lead.utm_medium || lead.utm_campaign) && (
            <section>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">UTM Tracking</h3>
              <div className="space-y-2">
                {lead.utm_source   && <Row label="utm_source"   value={lead.utm_source} />}
                {lead.utm_medium   && <Row label="utm_medium"   value={lead.utm_medium} />}
                {lead.utm_campaign && <Row label="utm_campaign" value={lead.utm_campaign} />}
              </div>
            </section>
          )}

          {/* Notas */}
          <section>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Notas</h3>
              {saving && <span className="text-xs text-gray-600">Guardando…</span>}
            </div>
            <textarea
              value={notes}
              onChange={(e) => handleNotes(e.target.value)}
              rows={4}
              placeholder="Agregar notas sobre este lead…"
              className="w-full bg-gray-900 border border-gray-800 rounded-lg px-3 py-2.5 text-sm text-gray-300 placeholder-gray-700 focus:outline-none focus:ring-1 focus:ring-violet-500 resize-none"
            />
          </section>

          {/* Historial */}
          <section>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Historial de estado</h3>
            {history.length === 0 ? (
              <p className="text-gray-700 text-sm">Sin cambios registrados.</p>
            ) : (
              <ol className="relative border-l border-gray-800 space-y-4 ml-2">
                {history.map((h) => (
                  <li key={h.id} className="ml-4">
                    <div className="absolute -left-1.5 w-3 h-3 rounded-full bg-gray-800 border border-gray-700" />
                    <p className="text-sm text-gray-300">
                      <span style={{ color: STATUS[h.from_status as LeadStatus]?.color ?? '#9ca3af' }}>
                        {STATUS[h.from_status as LeadStatus]?.label ?? h.from_status ?? '—'}
                      </span>
                      {' → '}
                      <span style={{ color: STATUS[h.to_status as LeadStatus]?.color ?? '#9ca3af' }}>
                        {STATUS[h.to_status as LeadStatus]?.label ?? h.to_status}
                      </span>
                    </p>
                    <p className="text-xs text-gray-600 mt-0.5">{fmt(h.changed_at)}</p>
                  </li>
                ))}
              </ol>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-gray-500 text-sm">{label}</span>
      <span className="text-gray-300 text-sm text-right max-w-[60%] truncate">{value}</span>
    </div>
  )
}

/* ─── Table ───────────────────────────────────────────────────────────────── */

function formatFecha(str: string) {
  return new Date(str).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: '2-digit' })
}

interface Props {
  leads: Lead[]
  loading: boolean
  onRefresh: () => void
}

export default function LeadsTable({ leads, loading, onRefresh }: Props) {
  const [selected, setSelected] = useState<Lead | null>(null)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex items-center gap-3 text-gray-400">
          <div className="w-5 h-5 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
          Cargando leads...
        </div>
      </div>
    )
  }

  if (leads.length === 0) {
    return (
      <div className="text-center py-20 rounded-xl border border-dashed border-gray-800">
        <p className="text-gray-400 text-lg font-medium mb-1">Sin leads</p>
        <p className="text-gray-600 text-sm">
          Agregá el primero con el botón de arriba o esperá consultas de la landing.
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="rounded-xl border border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800" style={{ background: 'rgba(255,255,255,0.02)' }}>
                {['Nombre', 'Email', 'Teléfono', 'Fuente', 'Estado', 'Fecha', 'Acción'].map((col) => (
                  <th key={col}
                    className={`text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3 ${
                      col === 'Teléfono' || col === 'Fuente' ? 'hidden md:table-cell' : ''
                    } ${col === 'Fecha' ? 'hidden lg:table-cell' : ''}`}>
                    {col}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-800/40">
              {leads.map((lead) => (
                <tr key={lead.id}
                  className="bg-gray-900 hover:bg-gray-800/40 transition-colors cursor-pointer"
                  onClick={() => setSelected(lead)}>
                  <td className="px-4 py-3">
                    <span className="text-white font-medium">{lead.name}</span>
                  </td>
                  <td className="px-4 py-3">
                    <a href={`mailto:${lead.email}`}
                      className="text-gray-300 hover:text-white transition-colors"
                      onClick={(e) => e.stopPropagation()}>
                      {lead.email}
                    </a>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="text-gray-400">{lead.phone ?? '—'}</span>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <SourceBadge source={lead.source} />
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={lead.status} />
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className="text-gray-500 text-xs">{formatFecha(lead.created_at)}</span>
                  </td>
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <StatusSelect
                      leadId={lead.id}
                      current={lead.status}
                      fromStatus={lead.status}
                      onSuccess={onRefresh}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <LeadDetail
          lead={selected}
          onClose={() => setSelected(null)}
          onRefresh={() => {
            onRefresh()
            // Actualizar el lead seleccionado con datos frescos
            setSelected(null)
          }}
        />
      )}
    </>
  )
}

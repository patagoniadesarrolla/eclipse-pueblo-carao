'use client'

import { useState } from 'react'
import { Lead, LeadStatus } from '@/types'
import { createClient } from '@/lib/supabase'

const STATUS: Record<LeadStatus, { label: string; color: string; bg: string }> = {
  new:       { label: 'Nuevo',      color: '#60a5fa', bg: 'rgba(59,130,246,0.12)'  },
  contacted: { label: 'Contactado', color: '#fbbf24', bg: 'rgba(234,179,8,0.12)'   },
  quoted:    { label: 'Cotizado',   color: '#fb923c', bg: 'rgba(249,115,22,0.12)'  },
  sold:      { label: 'Vendido',    color: '#4ade80', bg: 'rgba(34,197,94,0.12)'   },
  lost:      { label: 'Perdido',    color: '#f87171', bg: 'rgba(239,68,68,0.12)'   },
}

const STATUS_KEYS = Object.keys(STATUS) as LeadStatus[]

function Badge({ status }: { status: LeadStatus }) {
  const s = STATUS[status]
  return (
    <span
      className="inline-flex px-2.5 py-1 rounded-full text-xs font-semibold"
      style={{ color: s.color, background: s.bg }}
    >
      {s.label}
    </span>
  )
}

function StatusSelect({
  leadId,
  current,
  onSuccess,
}: {
  leadId: string
  current: LeadStatus
  onSuccess: () => void
}) {
  const [loading, setLoading] = useState(false)

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const next = e.target.value as LeadStatus
    if (next === current) return
    setLoading(true)
    const supabase = createClient()
    await supabase.from('leads').update({ status: next }).eq('id', leadId)
    setLoading(false)
    onSuccess()
  }

  return (
    <select
      value={current}
      onChange={handleChange}
      disabled={loading}
      className="text-xs bg-gray-800 border border-gray-700 text-gray-300 rounded-md px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-violet-500 disabled:opacity-40 cursor-pointer"
    >
      {STATUS_KEYS.map((s) => (
        <option key={s} value={s}>
          {STATUS[s].label}
        </option>
      ))}
    </select>
  )
}

function formatFecha(str: string) {
  return new Date(str).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  })
}

interface Props {
  leads: Lead[]
  loading: boolean
  onRefresh: () => void
}

export default function LeadsTable({ leads, loading, onRefresh }: Props) {
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
    <div className="rounded-xl border border-gray-800 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr
              className="border-b border-gray-800"
              style={{ background: 'rgba(255,255,255,0.02)' }}
            >
              {['Nombre', 'Email', 'Teléfono', 'Fuente', 'Estado', 'Fecha', 'Acción'].map(
                (col) => (
                  <th
                    key={col}
                    className={`text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3 ${
                      col === 'Teléfono' || col === 'Fuente' ? 'hidden md:table-cell' : ''
                    } ${col === 'Fecha' ? 'hidden lg:table-cell' : ''}`}
                  >
                    {col}
                  </th>
                )
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-800/40">
            {leads.map((lead) => (
              <tr
                key={lead.id}
                className="bg-gray-900 hover:bg-gray-800/40 transition-colors"
              >
                <td className="px-4 py-3">
                  <span className="text-white font-medium">{lead.name}</span>
                </td>
                <td className="px-4 py-3">
                  <a
                    href={`mailto:${lead.email}`}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    {lead.email}
                  </a>
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <span className="text-gray-400">{lead.phone ?? '—'}</span>
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <span className="text-gray-400 capitalize">{lead.source}</span>
                </td>
                <td className="px-4 py-3">
                  <Badge status={lead.status} />
                </td>
                <td className="px-4 py-3 hidden lg:table-cell">
                  <span className="text-gray-500 text-xs">{formatFecha(lead.created_at)}</span>
                </td>
                <td className="px-4 py-3">
                  <StatusSelect
                    leadId={lead.id}
                    current={lead.status}
                    onSuccess={onRefresh}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

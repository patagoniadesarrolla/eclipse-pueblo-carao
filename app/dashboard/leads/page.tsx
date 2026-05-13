'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase'
import { Lead, LeadStatus, LeadSource } from '@/types'
import LeadsTable from '@/components/dashboard/LeadsTable'
import AddLeadModal from '@/components/dashboard/AddLeadModal'

const ESTADOS: Array<{ value: LeadStatus | 'all'; label: string }> = [
  { value: 'all',       label: 'Todos'      },
  { value: 'new',       label: 'Nuevo'      },
  { value: 'contacted', label: 'Contactado' },
  { value: 'quoted',    label: 'Cotizado'   },
  { value: 'sold',      label: 'Vendido'    },
  { value: 'lost',      label: 'Perdido'    },
]

const FUENTES: Array<{ value: LeadSource | 'all'; label: string }> = [
  { value: 'all',          label: 'Todas'     },
  { value: 'landing',      label: 'Landing'   },
  { value: 'meta_lead_ad', label: 'Meta Ads'  },
  { value: 'manual',       label: 'Manual'    },
]

const POR_PAGINA = 10

export default function LeadsPage() {
  const [leads, setLeads]             = useState<Lead[]>([])
  const [loading, setLoading]         = useState(true)
  const [filtroEstado, setFiltroEstado] = useState<LeadStatus | 'all'>('all')
  const [filtroFuente, setFiltroFuente] = useState<LeadSource | 'all'>('all')
  const [pagina, setPagina]           = useState(1)
  const [total, setTotal]             = useState(0)
  const [modalAbierto, setModalAbierto] = useState(false)

  const fetchLeads = useCallback(async () => {
    setLoading(true)
    const supabase = createClient()

    let query = supabase
      .from('leads')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })

    if (filtroEstado !== 'all') query = query.eq('status', filtroEstado)
    if (filtroFuente !== 'all') query = query.eq('source', filtroFuente)

    const desde = (pagina - 1) * POR_PAGINA
    query = query.range(desde, desde + POR_PAGINA - 1)

    const { data, count, error } = await query
    if (!error) {
      setLeads(data ?? [])
      setTotal(count ?? 0)
    }
    setLoading(false)
  }, [filtroEstado, filtroFuente, pagina])

  useEffect(() => { fetchLeads() }, [fetchLeads])

  useEffect(() => { setPagina(1) }, [filtroEstado, filtroFuente])

  const totalPaginas = Math.ceil(total / POR_PAGINA)
  const desde        = Math.min((pagina - 1) * POR_PAGINA + 1, total)
  const hasta        = Math.min(pagina * POR_PAGINA, total)

  const filterBtn = (active: boolean) =>
    `px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-150 ${
      active
        ? 'bg-violet-600 text-white shadow-md shadow-violet-900/30'
        : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
    }`

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Leads</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {total} {total === 1 ? 'prospecto' : 'prospectos'} en total
          </p>
        </div>
        <button
          onClick={() => setModalAbierto(true)}
          className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold rounded-lg transition-colors"
        >
          <span>+</span> Agregar lead
        </button>
      </div>

      {/* Filtros */}
      <div className="space-y-2 mb-5">
        <div className="flex gap-2 flex-wrap items-center">
          <span className="text-xs text-gray-600 uppercase tracking-wider w-14">Estado</span>
          {ESTADOS.map(({ value, label }) => (
            <button key={value} onClick={() => setFiltroEstado(value)}
              className={filterBtn(filtroEstado === value)}>
              {label}
            </button>
          ))}
        </div>
        <div className="flex gap-2 flex-wrap items-center">
          <span className="text-xs text-gray-600 uppercase tracking-wider w-14">Fuente</span>
          {FUENTES.map(({ value, label }) => (
            <button key={value} onClick={() => setFiltroFuente(value)}
              className={filterBtn(filtroFuente === value)}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Tabla */}
      <LeadsTable leads={leads} loading={loading} onRefresh={fetchLeads} />

      {/* Paginación */}
      {!loading && totalPaginas > 1 && (
        <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-800">
          <p className="text-sm text-gray-500">
            Mostrando {desde}–{hasta} de {total} leads
          </p>
          <div className="flex items-center gap-2">
            <button onClick={() => setPagina((p) => Math.max(1, p - 1))}
              disabled={pagina === 1}
              className="px-3 py-1.5 text-sm bg-gray-800 text-gray-300 rounded-lg disabled:opacity-30 hover:bg-gray-700 transition-colors">
              ← Anterior
            </button>
            <span className="text-sm text-gray-500 px-2">{pagina} / {totalPaginas}</span>
            <button onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))}
              disabled={pagina === totalPaginas}
              className="px-3 py-1.5 text-sm bg-gray-800 text-gray-300 rounded-lg disabled:opacity-30 hover:bg-gray-700 transition-colors">
              Siguiente →
            </button>
          </div>
        </div>
      )}

      <AddLeadModal
        isOpen={modalAbierto}
        onClose={() => setModalAbierto(false)}
        onSuccess={() => { setModalAbierto(false); fetchLeads() }}
      />
    </div>
  )
}

'use client'

import { useState, useCallback } from 'react'
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  useDraggable,
} from '@dnd-kit/core'
import { createClient } from '@/lib/supabase'
import { Lead, LeadStatus, LeadSource } from '@/types'
import PaymentModal from './PaymentModal'

/* ── Constantes ──────────────────────────────────────────────────────────── */

const COLUMNS: Array<{ status: LeadStatus; label: string; color: string }> = [
  { status: 'new',       label: 'Nuevo',      color: '#6b7280' },
  { status: 'contacted', label: 'Contactado', color: '#3b82f6' },
  { status: 'quoted',    label: 'Cotizado',   color: '#f59e0b' },
  { status: 'sold',      label: 'Vendido',    color: '#10b981' },
  { status: 'lost',      label: 'Perdido',    color: '#ef4444' },
]

const SOURCE_LABELS: Record<LeadSource | string, string> = {
  landing:      'Landing',
  meta_lead_ad: 'Meta Ads',
  manual:       'Manual',
  instagram:    'Instagram',
  referral:     'Referido',
  whatsapp:     'WhatsApp',
}

/* ── Sub-componentes ────────────────────────────────────────────────────── */

function SourceBadge({ source }: { source: string }) {
  const isMeta = source === 'meta_lead_ad'
  return (
    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wide ${
      isMeta
        ? 'bg-blue-500/15 text-blue-400 border border-blue-500/25'
        : 'bg-gray-700/60 text-gray-400 border border-gray-600/40'
    }`}>
      {SOURCE_LABELS[source] ?? source}
    </span>
  )
}

function LeadCard({
  lead,
  onPayment,
  dragHandleProps = {},
  isDragging = false,
}: {
  lead: Lead
  onPayment?: (lead: Lead) => void
  dragHandleProps?: Record<string, unknown>
  isDragging?: boolean
}) {
  return (
    <div
      className={`rounded-xl border p-3 cursor-grab active:cursor-grabbing transition-all duration-150 ${
        isDragging
          ? 'opacity-50 border-violet-500/40 bg-gray-800'
          : 'border-gray-700/60 bg-gray-800/80 hover:border-gray-600 hover:bg-gray-800'
      }`}
      {...dragHandleProps}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <p className="text-white text-sm font-semibold leading-tight">{lead.name}</p>
        <SourceBadge source={lead.source} />
      </div>
      <p className="text-gray-400 text-xs mb-1 truncate">{lead.email}</p>
      {lead.phone && <p className="text-gray-500 text-xs mb-2">{lead.phone}</p>}
      <p className="text-gray-600 text-[10px]">
        {new Date(lead.created_at).toLocaleDateString('es-AR', { day: '2-digit', month: 'short' })}
      </p>
      {lead.status === 'sold' && onPayment && (
        <button
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => { e.stopPropagation(); onPayment(lead) }}
          className="mt-2.5 w-full text-xs font-semibold py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/35 text-emerald-400 border border-emerald-500/25 transition-colors"
        >
          Registrar pago
        </button>
      )}
    </div>
  )
}

function DraggableCard({ lead, onPayment }: { lead: Lead; onPayment: (l: Lead) => void }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: lead.id,
    data: { lead },
  })

  return (
    <div ref={setNodeRef}>
      <LeadCard
        lead={lead}
        onPayment={onPayment}
        dragHandleProps={{ ...attributes, ...listeners }}
        isDragging={isDragging}
      />
    </div>
  )
}

function DroppableColumn({
  status,
  label,
  color,
  leads,
  onPayment,
}: {
  status: LeadStatus
  label: string
  color: string
  leads: Lead[]
  onPayment: (l: Lead) => void
}) {
  const { setNodeRef, isOver } = useDroppable({ id: status })

  return (
    <div className="flex flex-col min-w-[220px] w-[220px] flex-shrink-0">
      {/* Header columna */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: color }} />
        <span className="text-sm font-semibold text-gray-300 uppercase tracking-wide">{label}</span>
        <span className="ml-auto text-xs font-bold text-gray-500 bg-gray-800 px-2 py-0.5 rounded-full">
          {leads.length}
        </span>
      </div>

      {/* Cards */}
      <div
        ref={setNodeRef}
        className={`flex flex-col gap-2.5 min-h-[120px] rounded-xl p-2 transition-colors duration-150 ${
          isOver ? 'bg-violet-500/8 ring-1 ring-violet-500/30' : 'bg-gray-900/40'
        }`}
      >
        {leads.map((lead) => (
          <DraggableCard key={lead.id} lead={lead} onPayment={onPayment} />
        ))}
        {leads.length === 0 && (
          <p className="text-center text-gray-700 text-xs py-6">Sin leads</p>
        )}
      </div>
    </div>
  )
}

/* ── Componente principal ─────────────────────────────────────────────── */

interface Props {
  initialLeads: Lead[]
}

export default function KanbanBoard({ initialLeads }: Props) {
  const [leads, setLeads] = useState<Lead[]>(initialLeads)
  const [dragging, setDragging] = useState<Lead | null>(null)
  const [paymentLead, setPaymentLead] = useState<Lead | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  )

  const columnLeads = useCallback(
    (status: LeadStatus) => leads.filter((l) => l.status === status),
    [leads]
  )

  const handleDragStart = ({ active }: DragStartEvent) => {
    const lead = leads.find((l) => l.id === active.id)
    setDragging(lead ?? null)
  }

  const handleDragEnd = async ({ active, over }: DragEndEvent) => {
    setDragging(null)
    if (!over) return

    const lead = leads.find((l) => l.id === active.id)
    const newStatus = over.id as LeadStatus

    if (!lead || lead.status === newStatus) return

    const prevStatus = lead.status

    // Optimistic update
    setLeads((prev) =>
      prev.map((l) => (l.id === lead.id ? { ...l, status: newStatus } : l))
    )

    const supabase = createClient()

    const [, histRes] = await Promise.all([
      supabase.from('leads').update({ status: newStatus, updated_at: new Date().toISOString() }).eq('id', lead.id),
      supabase.from('lead_status_history').insert({
        lead_id: lead.id,
        from_status: prevStatus,
        to_status: newStatus,
        changed_at: new Date().toISOString(),
      }),
    ])

    if (histRes.error) {
      // Revertir si falla
      setLeads((prev) =>
        prev.map((l) => (l.id === lead.id ? { ...l, status: prevStatus } : l))
      )
    }
  }

  return (
    <>
      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4" style={{ minHeight: 'calc(100vh - 160px)' }}>
          {COLUMNS.map(({ status, label, color }) => (
            <DroppableColumn
              key={status}
              status={status}
              label={label}
              color={color}
              leads={columnLeads(status)}
              onPayment={setPaymentLead}
            />
          ))}
        </div>

        <DragOverlay>
          {dragging && <LeadCard lead={dragging} />}
        </DragOverlay>
      </DndContext>

      {paymentLead && (
        <PaymentModal
          lead={paymentLead}
          onClose={() => setPaymentLead(null)}
          onSuccess={() => setPaymentLead(null)}
        />
      )}
    </>
  )
}

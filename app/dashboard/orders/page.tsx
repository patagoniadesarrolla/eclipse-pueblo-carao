'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase'
import { Order, PaymentMethod, PaymentStatus } from '@/types'

/* ── Tipos extendidos ──────────────────────────────────────────────────── */

interface OrderWithLead extends Order {
  leads?: { name: string; email: string; phone: string | null; source: string } | null
}

/* ── Helpers ────────────────────────────────────────────────────────────── */

const STATUS_BADGE: Record<PaymentStatus, { label: string; cls: string }> = {
  paid:     { label: 'Pagado',      cls: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25' },
  pending:  { label: 'Pendiente',   cls: 'bg-yellow-500/15  text-yellow-400  border-yellow-500/25'  },
  refunded: { label: 'Reembolsado', cls: 'bg-red-500/15     text-red-400     border-red-500/25'     },
}

const METHOD_LABEL: Record<PaymentMethod | string, string> = {
  stripe:        'Stripe',
  mercadopago:   'MercadoPago',
  transferencia: 'Transferencia',
  efectivo:      'Efectivo',
}

const METODOS_FILTER: Array<{ value: PaymentMethod | 'all'; label: string }> = [
  { value: 'all',          label: 'Todos'         },
  { value: 'stripe',        label: 'Stripe'        },
  { value: 'mercadopago',   label: 'MercadoPago'   },
  { value: 'transferencia', label: 'Transferencia' },
  { value: 'efectivo',      label: 'Efectivo'      },
]

const STATUS_FILTER: Array<{ value: PaymentStatus | 'all'; label: string }> = [
  { value: 'all',     label: 'Todos'      },
  { value: 'paid',    label: 'Pagado'     },
  { value: 'pending', label: 'Pendiente'  },
  { value: 'refunded', label: 'Reembolsado' },
]

/* ── Modal detalle ──────────────────────────────────────────────────────── */

function OrderDetailModal({ order, onClose }: { order: OrderWithLead; onClose: () => void }) {
  const badge = STATUS_BADGE[order.payment_status] ?? STATUS_BADGE.pending
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-white font-bold text-lg">Detalle de orden</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white text-xl leading-none">×</button>
        </div>

        <div className="space-y-1">
          {[
            ['Comprador', order.buyer_name],
            ['Email', order.buyer_email],
            ['Monto', `$${order.amount_usd} USD`],
            ['Método', METHOD_LABEL[order.payment_method] ?? order.payment_method],
            ['Fecha', new Date(order.created_at).toLocaleString('es-AR')],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between py-2.5 border-b border-gray-800 text-sm">
              <span className="text-gray-500">{k}</span>
              <span className="text-white">{v}</span>
            </div>
          ))}
          <div className="flex justify-between py-2.5 border-b border-gray-800 text-sm">
            <span className="text-gray-500">Estado</span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${badge.cls}`}>{badge.label}</span>
          </div>
          {order.stripe_session_id && (
            <div className="flex justify-between py-2.5 border-b border-gray-800 text-sm">
              <span className="text-gray-500">Stripe ID</span>
              <span className="text-gray-400 text-xs font-mono truncate max-w-[180px]">{order.stripe_session_id}</span>
            </div>
          )}
          {order.notes && (
            <div className="pt-2.5 text-sm">
              <p className="text-gray-500 mb-1">Notas</p>
              <p className="text-gray-300">{order.notes}</p>
            </div>
          )}
        </div>

        {order.leads && (
          <div className="mt-5 pt-4 border-t border-gray-800">
            <p className="text-xs text-gray-600 uppercase tracking-wider font-bold mb-2">Lead asociado</p>
            <p className="text-white text-sm font-semibold">{order.leads.name}</p>
            <p className="text-gray-400 text-xs">{order.leads.email}</p>
            {order.leads.phone && <p className="text-gray-500 text-xs">{order.leads.phone}</p>}
          </div>
        )}
      </div>
    </div>
  )
}

/* ── Página ─────────────────────────────────────────────────────────────── */

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderWithLead[]>([])
  const [loading, setLoading] = useState(true)
  const [filtroMetodo, setFiltroMetodo] = useState<PaymentMethod | 'all'>('all')
  const [filtroEstado, setFiltroEstado] = useState<PaymentStatus | 'all'>('all')
  const [selected, setSelected] = useState<OrderWithLead | null>(null)

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    const supabase = createClient()
    let query = supabase
      .from('orders')
      .select('*, leads(name, email, phone, source)')
      .order('created_at', { ascending: false })

    if (filtroMetodo !== 'all') query = query.eq('payment_method', filtroMetodo)
    if (filtroEstado !== 'all') query = query.eq('payment_status', filtroEstado)

    const { data } = await query
    setOrders((data as OrderWithLead[]) ?? [])
    setLoading(false)
  }, [filtroMetodo, filtroEstado])

  useEffect(() => { fetchOrders() }, [fetchOrders])

  const totalPagado = orders
    .filter((o) => o.payment_status === 'paid')
    .reduce((sum, o) => sum + Number(o.amount_usd), 0)

  const filterBtn = (active: boolean) =>
    `px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-150 ${
      active
        ? 'bg-violet-600 text-white shadow-md shadow-violet-900/30'
        : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
    }`

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Órdenes</h1>
        <p className="text-gray-500 text-sm mt-0.5">{orders.length} órdenes registradas</p>
      </div>

      {/* Filtros */}
      <div className="space-y-2 mb-5">
        <div className="flex gap-2 flex-wrap items-center">
          <span className="text-xs text-gray-600 uppercase tracking-wider w-14">Estado</span>
          {STATUS_FILTER.map(({ value, label }) => (
            <button key={value} onClick={() => setFiltroEstado(value)} className={filterBtn(filtroEstado === value)}>
              {label}
            </button>
          ))}
        </div>
        <div className="flex gap-2 flex-wrap items-center">
          <span className="text-xs text-gray-600 uppercase tracking-wider w-14">Método</span>
          {METODOS_FILTER.map(({ value, label }) => (
            <button key={value} onClick={() => setFiltroMetodo(value)} className={filterBtn(filtroMetodo === value)}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Tabla */}
      <div className="rounded-xl border border-gray-800 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800 bg-gray-900/60">
              {['Comprador', 'Email', 'Monto', 'Método', 'Estado', 'Fecha'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs text-gray-500 font-semibold uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/60">
            {loading ? (
              <tr><td colSpan={6} className="text-center py-12 text-gray-600">Cargando…</td></tr>
            ) : orders.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-12 text-gray-600">Sin órdenes</td></tr>
            ) : orders.map((order) => {
              const badge = STATUS_BADGE[order.payment_status] ?? STATUS_BADGE.pending
              return (
                <tr
                  key={order.id}
                  className="hover:bg-gray-800/40 cursor-pointer transition-colors"
                  onClick={() => setSelected(order)}
                >
                  <td className="px-4 py-3 text-white font-medium">{order.buyer_name}</td>
                  <td className="px-4 py-3 text-gray-400">{order.buyer_email}</td>
                  <td className="px-4 py-3 text-white font-semibold">${order.amount_usd}</td>
                  <td className="px-4 py-3 text-gray-400">{METHOD_LABEL[order.payment_method] ?? order.payment_method}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full border ${badge.cls}`}>
                      {badge.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {new Date(order.created_at).toLocaleDateString('es-AR')}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Total */}
      {!loading && orders.length > 0 && (
        <div className="mt-4 flex justify-end">
          <div className="px-5 py-3 rounded-xl bg-gray-900 border border-gray-800 text-right">
            <p className="text-xs text-gray-500 mb-0.5">Total cobrado (pagado)</p>
            <p className="text-2xl font-bold text-emerald-400">${totalPagado.toLocaleString('es-AR')} USD</p>
          </div>
        </div>
      )}

      {selected && <OrderDetailModal order={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}

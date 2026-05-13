'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { Lead, Order, PaymentMethod } from '@/types'

interface Props {
  lead: Lead
  onClose: () => void
  onSuccess: () => void
}

const METODOS: Array<{ value: PaymentMethod; label: string }> = [
  { value: 'stripe',        label: 'Stripe (tarjeta)' },
  { value: 'mercadopago',   label: 'MercadoPago' },
  { value: 'transferencia', label: 'Transferencia' },
  { value: 'efectivo',      label: 'Efectivo' },
]

export default function PaymentModal({ lead, onClose, onSuccess }: Props) {
  const [existingOrder, setExistingOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [copyLabel, setCopyLabel] = useState('Copiar link')

  const [form, setForm] = useState({
    amount_usd: '300',
    payment_method: 'stripe' as PaymentMethod,
    notes: '',
  })

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('orders')
      .select('*')
      .eq('lead_id', lead.id)
      .single()
      .then(({ data }) => {
        setExistingOrder(data ?? null)
        setLoading(false)
      })
  }, [lead.id])

  const handleManualPay = async () => {
    setSaving(true)
    const supabase = createClient()
    await supabase.from('orders').insert({
      lead_id: lead.id,
      buyer_name: lead.name,
      buyer_email: lead.email,
      amount_usd: parseFloat(form.amount_usd),
      payment_method: form.payment_method,
      payment_status: 'paid',
      notes: form.notes || null,
    })
    setSaving(false)
    onSuccess()
  }

  const handleStripeLink = async () => {
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lead_id: lead.id, lead_email: lead.email, lead_name: lead.name }),
    })
    const { url } = await res.json()
    if (url) {
      await navigator.clipboard.writeText(url)
      setCopyLabel('¡Copiado!')
      setTimeout(() => setCopyLabel('Copiar link'), 2500)
    }
  }

  const statusLabel: Record<string, { text: string; color: string }> = {
    paid:     { text: 'Pagado',      color: 'text-emerald-400' },
    pending:  { text: 'Pendiente',   color: 'text-yellow-400'  },
    refunded: { text: 'Reembolsado', color: 'text-red-400'     },
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div
        className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-white font-bold text-lg">Registrar pago</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white text-xl leading-none">×</button>
        </div>

        <div className="mb-4 px-4 py-3 rounded-xl bg-gray-800/60 border border-gray-700">
          <p className="text-white font-semibold text-sm">{lead.name}</p>
          <p className="text-gray-400 text-xs mt-0.5">{lead.email}</p>
        </div>

        {loading ? (
          <p className="text-gray-500 text-sm text-center py-6">Verificando órdenes existentes…</p>
        ) : existingOrder ? (
          <div className="space-y-3">
            <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-2">Orden existente</p>
            <div className="rounded-xl border border-gray-700 divide-y divide-gray-800">
              {[
                ['Monto', `$${existingOrder.amount_usd} USD`],
                ['Método', existingOrder.payment_method],
                ['Estado', existingOrder.payment_status],
                ['Fecha', new Date(existingOrder.created_at).toLocaleDateString('es-AR')],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between px-4 py-2.5 text-sm">
                  <span className="text-gray-500">{k}</span>
                  <span className={statusLabel[v]?.color ?? 'text-white'}>{statusLabel[v]?.text ?? v}</span>
                </div>
              ))}
            </div>
            {existingOrder.notes && (
              <p className="text-xs text-gray-400 px-1">{existingOrder.notes}</p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="text-xs text-gray-400 font-medium block mb-1">Monto (USD)</label>
              <input
                type="number"
                value={form.amount_usd}
                onChange={(e) => setForm({ ...form, amount_usd: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <label className="text-xs text-gray-400 font-medium block mb-1">Método de pago</label>
              <div className="grid grid-cols-2 gap-2">
                {METODOS.map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => setForm({ ...form, payment_method: value })}
                    className={`px-3 py-2 rounded-lg text-sm font-medium border transition-all ${
                      form.payment_method === value
                        ? 'bg-violet-600/20 border-violet-500/60 text-violet-300'
                        : 'bg-gray-800 border-gray-700 text-gray-400 hover:text-white'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-400 font-medium block mb-1">Notas (opcional)</label>
              <textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                rows={2}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm resize-none focus:outline-none focus:border-violet-500"
              />
            </div>

            <div className="flex gap-2 pt-1">
              <button
                onClick={handleManualPay}
                disabled={saving}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-sm font-semibold rounded-lg transition-colors"
              >
                {saving ? 'Guardando…' : 'Confirmar pago'}
              </button>
              <button
                onClick={handleStripeLink}
                className="flex-1 py-2.5 bg-gray-700 hover:bg-gray-600 text-white text-sm font-semibold rounded-lg transition-colors"
                title="Generar link de pago Stripe y copiar al portapapeles"
              >
                {copyLabel}
              </button>
            </div>
            <p className="text-xs text-gray-600 text-center -mt-1">
              "Copiar link" genera un checkout de Stripe y lo copia al portapapeles
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

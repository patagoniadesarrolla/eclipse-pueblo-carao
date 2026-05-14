'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase'

interface OrderRow {
  id: string
  buyer_name: string
  buyer_email: string
  amount_usd: number
  payment_method: string
  payment_status: string
  created_at: string
  buyer_profiles: Array<{ id: string; user_id: string; onboarding_completed: boolean }> | null
}

function statusBadge(status: string) {
  if (status === 'paid')     return <span className="text-xs font-bold px-2 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">Pagado</span>
  if (status === 'refunded') return <span className="text-xs font-bold px-2 py-1 rounded-full bg-red-500/15 text-red-400 border border-red-500/25">Revertido</span>
  return <span className="text-xs font-bold px-2 py-1 rounded-full bg-gray-700/60 text-gray-500 border border-gray-600/40">{status}</span>
}

export default function BuyersPage() {
  const [orders, setOrders] = useState<OrderRow[]>([])
  const [loading, setLoading] = useState(true)
  const [working, setWorking] = useState<string | null>(null)
  const [lastPassword, setLastPassword] = useState<{ name: string; email: string; pwd: string } | null>(null)

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    const supabase = createClient()
    const { data } = await supabase
      .from('orders')
      .select('*, buyer_profiles(id, user_id, onboarding_completed)')
      .order('created_at', { ascending: false })
    setOrders((data as OrderRow[]) ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchOrders() }, [fetchOrders])

  const handleEnable = async (order: OrderRow) => {
    if (!confirm(`¿Habilitar acceso a /mi-experiencia para ${order.buyer_name}?\nSe le enviará un email con contraseña temporal.`)) return
    setWorking(order.id)
    const res = await fetch('/api/dashboard/buyers/enable', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order_id: order.id }),
    })
    const data = await res.json()
    if (res.ok) {
      setLastPassword({ name: order.buyer_name, email: order.buyer_email, pwd: data.temp_password })
      fetchOrders()
    } else {
      alert(data.error ?? 'Error al habilitar acceso')
    }
    setWorking(null)
  }

  const handleRevoke = async (order: OrderRow) => {
    if (!confirm(`¿Revertir acceso de ${order.buyer_name}?\nSe eliminará su cuenta y la orden quedará como "Revertido".`)) return
    setWorking(order.id)
    const res = await fetch('/api/dashboard/buyers/revoke', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order_id: order.id }),
    })
    const data = await res.json()
    if (res.ok) {
      fetchOrders()
    } else {
      alert(data.error ?? 'Error al revertir acceso')
    }
    setWorking(null)
  }

  const activeCount = orders.filter(o => o.buyer_profiles && o.buyer_profiles.length > 0).length

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Compradores</h1>
        <p className="text-gray-500 text-sm mt-0.5">
          {activeCount} con acceso activo · {orders.length} órdenes totales
        </p>
      </div>

      {/* Password toast */}
      {lastPassword && (
        <div className="mb-5 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-start justify-between gap-4">
          <div>
            <p className="text-emerald-400 text-sm font-semibold mb-1">
              Acceso habilitado para {lastPassword.name}
            </p>
            <p className="text-gray-400 text-xs">
              Email: <span className="text-white font-mono">{lastPassword.email}</span>
              {' · '}
              Contraseña temporal: <span className="text-white font-mono font-bold">{lastPassword.pwd}</span>
            </p>
            <p className="text-gray-600 text-xs mt-1">Se envió el email de bienvenida automáticamente.</p>
          </div>
          <button onClick={() => setLastPassword(null)} className="text-gray-500 hover:text-white text-xl leading-none flex-shrink-0">×</button>
        </div>
      )}

      <div className="rounded-xl border border-gray-800 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800 bg-gray-900/60">
              {['Nombre', 'Email', 'Monto', 'Método', 'Estado pago', 'Acceso', 'Acciones'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs text-gray-500 font-semibold uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/60">
            {loading ? (
              <tr><td colSpan={7} className="text-center py-12 text-gray-600">Cargando…</td></tr>
            ) : orders.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-12 text-gray-600">Sin órdenes aún</td></tr>
            ) : orders.map((order) => {
              const hasAccess = order.buyer_profiles && order.buyer_profiles.length > 0
              const profile   = hasAccess ? order.buyer_profiles![0] : null
              const isWorking = working === order.id

              return (
                <tr key={order.id} className="hover:bg-gray-800/40 transition-colors">
                  <td className="px-4 py-3 text-white font-medium">{order.buyer_name}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{order.buyer_email}</td>
                  <td className="px-4 py-3 text-gray-300">USD ${order.amount_usd}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs capitalize">{order.payment_method}</td>
                  <td className="px-4 py-3">{statusBadge(order.payment_status)}</td>
                  <td className="px-4 py-3">
                    {hasAccess ? (
                      <div>
                        <span className="text-xs font-bold px-2 py-1 rounded-full bg-violet-500/15 text-violet-400 border border-violet-500/25">
                          Activo
                        </span>
                        {profile?.onboarding_completed && (
                          <span className="ml-1.5 text-xs text-emerald-500">· onboarding ✓</span>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs font-bold px-2 py-1 rounded-full bg-gray-700/60 text-gray-500 border border-gray-600/40">
                        Sin acceso
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      {!hasAccess && order.payment_status !== 'refunded' && (
                        <button
                          onClick={() => handleEnable(order)}
                          disabled={isWorking}
                          className="text-xs px-3 py-1.5 rounded-lg bg-violet-600/20 hover:bg-violet-600/40 text-violet-400 border border-violet-500/30 transition-colors disabled:opacity-40"
                        >
                          {isWorking ? '…' : 'Habilitar acceso'}
                        </button>
                      )}
                      {hasAccess && (
                        <button
                          onClick={() => handleRevoke(order)}
                          disabled={isWorking}
                          className="text-xs px-3 py-1.5 rounded-lg bg-red-600/10 hover:bg-red-600/25 text-red-400 border border-red-500/25 transition-colors disabled:opacity-40"
                        >
                          {isWorking ? '…' : 'Revertir acceso'}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

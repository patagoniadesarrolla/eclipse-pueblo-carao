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

interface CredentialToast {
  name: string
  email: string
  pwd: string
  emailSent: boolean
  label: string
  magicLink?: string | null
  debug?: { email_confirmed: boolean; link_error?: string | null } | null
}

function statusBadge(status: string) {
  if (status === 'paid')     return <span className="text-xs font-bold px-2 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">Pagado</span>
  if (status === 'refunded') return <span className="text-xs font-bold px-2 py-1 rounded-full bg-red-500/15 text-red-400 border border-red-500/25">Revertido</span>
  return <span className="text-xs font-bold px-2 py-1 rounded-full bg-gray-700/60 text-gray-500 border border-gray-600/40">{status}</span>
}

export default function BuyersPage() {
  const [orders, setOrders]       = useState<OrderRow[]>([])
  const [loading, setLoading]     = useState(true)
  const [working, setWorking]     = useState<string | null>(null)
  const [toast, setToast]         = useState<CredentialToast | null>(null)
  const [copied, setCopied]       = useState(false)

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

  const showToast = (t: CredentialToast) => { setToast(t); setCopied(false) }

  const copyCredentials = () => {
    if (!toast) return
    navigator.clipboard.writeText(`Email: ${toast.email}\nContraseña: ${toast.pwd}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleEnable = async (order: OrderRow) => {
    if (!confirm(`¿Habilitar acceso a /mi-experiencia para ${order.buyer_name}?`)) return
    setWorking(order.id)
    const res  = await fetch('/api/dashboard/buyers/enable', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order_id: order.id }),
    })
    const data = await res.json()
    if (res.ok) {
      showToast({ name: order.buyer_name, email: order.buyer_email, pwd: data.temp_password, emailSent: data.email_sent, label: 'Acceso habilitado', debug: data.debug })
      fetchOrders()
    } else {
      alert(data.error ?? 'Error al habilitar acceso')
    }
    setWorking(null)
  }

  const handleResetPassword = async (order: OrderRow) => {
    setWorking(order.id + '_reset')
    const res  = await fetch('/api/dashboard/buyers/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order_id: order.id }),
    })
    const data = await res.json()
    if (res.ok) {
      showToast({ name: data.name, email: data.email, pwd: data.temp_password, emailSent: false, label: 'Contraseña restablecida', magicLink: data.magic_link, debug: data.debug })
    } else {
      alert(data.error ?? 'Error al resetear contraseña')
    }
    setWorking(null)
  }

  const handleRevoke = async (order: OrderRow) => {
    if (!confirm(`¿Revertir acceso de ${order.buyer_name}?\nSe eliminará su cuenta y la orden quedará como "Revertido".`)) return
    setWorking(order.id)
    const res  = await fetch('/api/dashboard/buyers/revoke', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order_id: order.id }),
    })
    const data = await res.json()
    if (!res.ok) alert(data.error ?? 'Error al revertir acceso')
    fetchOrders()
    setWorking(null)
  }

  const handleDelete = async (order: OrderRow) => {
    if (!confirm(`¿Eliminar completamente a ${order.buyer_name}?\nSe borrará la orden, el acceso y el usuario. El lead vuelve a "Contactado".`)) return
    setWorking(order.id)
    const res  = await fetch(`/api/dashboard/buyers/${order.id}`, { method: 'DELETE' })
    const data = await res.json()
    if (!res.ok) alert(data.error ?? 'Error al eliminar')
    fetchOrders()
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

      {/* Credential toast */}
      {toast && (
        <div className="mb-5 p-4 rounded-xl bg-violet-500/10 border border-violet-500/30">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-violet-300 text-sm font-semibold mb-2">{toast.label} — {toast.name}</p>
              <div className="bg-gray-950 border border-gray-800 rounded-lg p-3 font-mono text-sm space-y-1">
                <div className="flex gap-2">
                  <span className="text-gray-500 w-24 flex-shrink-0">Email</span>
                  <span className="text-white">{toast.email}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-gray-500 w-24 flex-shrink-0">Contraseña</span>
                  <span className="text-yellow-300 font-bold tracking-wider">{toast.pwd}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 mt-2 flex-wrap">
                <button
                  onClick={copyCredentials}
                  className="text-xs px-3 py-1.5 rounded-lg bg-violet-600/20 hover:bg-violet-600/40 text-violet-400 border border-violet-500/30 transition-colors"
                >
                  {copied ? '¡Copiado!' : 'Copiar credenciales'}
                </button>
                {toast.magicLink && (
                  <a
                    href={toast.magicLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-400 border border-emerald-500/30 transition-colors"
                  >
                    Entrar como este usuario →
                  </a>
                )}
                {toast.emailSent
                  ? <span className="text-xs text-emerald-500">✓ Email enviado</span>
                  : <span className="text-xs text-gray-600">Sin email (Resend no configurado)</span>
                }
                {toast.debug && (
                  <span className={`text-xs ${toast.debug.email_confirmed ? 'text-emerald-500' : 'text-red-400'}`}>
                    {toast.debug.email_confirmed ? '✓ Email confirmado en Auth' : '✗ Email NO confirmado — esto bloquea el login'}
                  </span>
                )}
              </div>
            </div>
            <button onClick={() => setToast(null)} className="text-gray-500 hover:text-white text-xl leading-none flex-shrink-0">×</button>
          </div>
        </div>
      )}

      <div className="rounded-xl border border-gray-800 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800 bg-gray-900/60">
              {['Nombre', 'Email', 'Monto', 'Método', 'Estado', 'Acceso', 'Acciones'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs text-gray-500 font-semibold uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/60">
            {loading ? (
              <tr><td colSpan={7} className="text-center py-12 text-gray-600">Cargando…</td></tr>
            ) : orders.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-12 text-gray-600">Sin órdenes aún</td></tr>
            ) : orders.map((order) => {
              const hasAccess  = order.buyer_profiles && order.buyer_profiles.length > 0
              const profile    = hasAccess ? order.buyer_profiles![0] : null
              const isWorking  = working === order.id || working === order.id + '_reset'

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
                        <span className="text-xs font-bold px-2 py-1 rounded-full bg-violet-500/15 text-violet-400 border border-violet-500/25">Activo</span>
                        {profile?.onboarding_completed && (
                          <span className="ml-1.5 text-xs text-emerald-500">· onboarding ✓</span>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs font-bold px-2 py-1 rounded-full bg-gray-700/60 text-gray-500 border border-gray-600/40">Sin acceso</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5 flex-wrap">
                      {!hasAccess && order.payment_status !== 'refunded' && (
                        <button onClick={() => handleEnable(order)} disabled={isWorking}
                          className="text-xs px-2.5 py-1.5 rounded-lg bg-violet-600/20 hover:bg-violet-600/40 text-violet-400 border border-violet-500/30 transition-colors disabled:opacity-40">
                          {isWorking ? '…' : 'Habilitar'}
                        </button>
                      )}
                      {hasAccess && (
                        <>
                          <button onClick={() => handleResetPassword(order)} disabled={isWorking}
                            className="text-xs px-2.5 py-1.5 rounded-lg bg-blue-600/10 hover:bg-blue-600/25 text-blue-400 border border-blue-500/25 transition-colors disabled:opacity-40">
                            {working === order.id + '_reset' ? '…' : 'Nueva clave'}
                          </button>
                          <button onClick={() => handleRevoke(order)} disabled={isWorking}
                            className="text-xs px-2.5 py-1.5 rounded-lg bg-orange-600/10 hover:bg-orange-600/25 text-orange-400 border border-orange-500/25 transition-colors disabled:opacity-40">
                            {isWorking ? '…' : 'Revertir'}
                          </button>
                        </>
                      )}
                      <button onClick={() => handleDelete(order)} disabled={isWorking}
                        className="text-xs px-2.5 py-1.5 rounded-lg bg-red-600/10 hover:bg-red-600/25 text-red-400 border border-red-500/25 transition-colors disabled:opacity-40">
                        {isWorking ? '…' : 'Eliminar'}
                      </button>
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

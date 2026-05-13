'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { BuyerProfile } from '@/types'

interface BuyerWithOrder extends BuyerProfile {
  orders?: { created_at: string; amount_usd: number } | null
}

export default function BuyersPage() {
  const [buyers, setBuyers] = useState<BuyerWithOrder[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('buyer_profiles')
      .select('*, orders(created_at, amount_usd)')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setBuyers((data as BuyerWithOrder[]) ?? [])
        setLoading(false)
      })
  }, [])

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Compradores</h1>
        <p className="text-gray-500 text-sm mt-0.5">{buyers.length} compradores con acceso creado</p>
      </div>

      <div className="rounded-xl border border-gray-800 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800 bg-gray-900/60">
              {['Nombre', 'Email', 'Fecha de compra', 'Onboarding', 'Acceso'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs text-gray-500 font-semibold uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/60">
            {loading ? (
              <tr><td colSpan={5} className="text-center py-12 text-gray-600">Cargando…</td></tr>
            ) : buyers.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-12 text-gray-600">Sin compradores aún</td></tr>
            ) : buyers.map((buyer) => (
              <tr key={buyer.id} className="hover:bg-gray-800/40 transition-colors">
                <td className="px-4 py-3 text-white font-medium">{buyer.name ?? '—'}</td>
                <td className="px-4 py-3 text-gray-400">{buyer.email ?? '—'}</td>
                <td className="px-4 py-3 text-gray-500 text-xs">
                  {buyer.orders?.created_at
                    ? new Date(buyer.orders.created_at).toLocaleDateString('es-AR')
                    : new Date(buyer.created_at).toLocaleDateString('es-AR')}
                </td>
                <td className="px-4 py-3">
                  {buyer.onboarding_completed ? (
                    <span className="text-xs font-bold px-2 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
                      Completado
                    </span>
                  ) : (
                    <span className="text-xs font-bold px-2 py-1 rounded-full bg-gray-700/60 text-gray-500 border border-gray-600/40">
                      Pendiente
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <button
                    disabled
                    className="text-xs px-3 py-1.5 rounded-lg bg-gray-800 text-gray-600 border border-gray-700 cursor-not-allowed"
                    title="Disponible en Prompt 5"
                  >
                    Reenviar acceso
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

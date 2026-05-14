'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import dynamic from 'next/dynamic'

const QRCode = dynamic(() => import('qrcode.react').then(m => ({ default: m.QRCodeSVG })), { ssr: false })

interface OrderData {
  id: string
  buyer_name: string
  buyer_email: string
  amount_usd: number
  payment_method: string
  created_at: string
}

interface ProfileData {
  name: string | null
  email: string | null
}

export default function ReservaPage() {
  const [order, setOrder]     = useState<OrderData | null>(null)
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return
      const [{ data: prof }, { data: ord }] = await Promise.all([
        supabase.from('buyer_profiles').select('name, email, order_id').eq('user_id', user.id).single(),
        supabase.from('buyer_profiles').select('order_id').eq('user_id', user.id).single(),
      ])
      setProfile(prof)
      if (ord?.order_id) {
        const { data: o } = await supabase.from('orders').select('*').eq('id', ord.order_id).single()
        setOrder(o)
      }
      setLoading(false)
    })
  }, [])

  const handleDownload = async () => {
    if (!order) return
    setDownloading(true)
    const res = await fetch(`/api/buyer/voucher?order_id=${order.id}`)
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `voucher-eclipse-${order.id.slice(0, 8)}.pdf`
    a.click()
    URL.revokeObjectURL(url)
    setDownloading(false)
  }

  const qrValue = order ? `https://pueblocarao.com/check/${order.id}` : ''

  return (
    <div className="px-6 py-10 max-w-2xl mx-auto">
      <div className="mb-10">
        <p className="text-xs font-bold uppercase tracking-[0.2em] mb-3" style={{ color: '#dc2626' }}>
          Tu compra
        </p>
        <h1 className="text-4xl font-bold text-white">Tu reserva</h1>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => (
            <div key={i} className="h-14 rounded-2xl animate-pulse" style={{ background: 'rgba(255,255,255,0.05)' }} />
          ))}
        </div>
      ) : !order ? (
        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
          No encontramos datos de tu compra. Escribinos a hola@pueblocarao.com
        </p>
      ) : (
        <>
          {/* Datos de compra */}
          <div className="rounded-2xl overflow-hidden mb-6" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
            {[
              ['Nombre',           profile?.name ?? order.buyer_name],
              ['Email',            profile?.email ?? order.buyer_email],
              ['Fecha de compra',  new Date(order.created_at).toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' })],
              ['Monto pagado',     `USD $${order.amount_usd}`],
              ['Método de pago',   order.payment_method],
              ['N° de orden',      order.id.slice(0, 8).toUpperCase()],
            ].map(([label, value], i, arr) => (
              <div
                key={label}
                className="flex justify-between items-center px-5 py-3.5"
                style={{
                  background: i % 2 === 0 ? 'rgba(255,255,255,0.03)' : 'transparent',
                  borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                }}
              >
                <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'rgba(255,255,255,0.35)' }}>
                  {label}
                </span>
                <span className="text-sm font-semibold text-white">{value}</span>
              </div>
            ))}
          </div>

          {/* QR */}
          <div className="flex flex-col items-center p-8 rounded-2xl mb-6" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="p-4 rounded-xl bg-white mb-4">
              <QRCode value={qrValue} size={140} bgColor="#ffffff" fgColor="#050508" level="M" />
            </div>
            <p className="text-xs text-center" style={{ color: 'rgba(255,255,255,0.3)' }}>
              Presentá este código en la entrada del evento
            </p>
            <p className="text-xs font-mono mt-1" style={{ color: 'rgba(255,255,255,0.2)' }}>
              {order.id.slice(0, 8).toUpperCase()}
            </p>
          </div>

          {/* Descargar PDF */}
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="w-full py-3.5 rounded-2xl text-white font-bold text-sm uppercase tracking-widest transition-all disabled:opacity-50"
            style={{ background: 'rgba(124,58,237,0.2)', border: '1px solid rgba(124,58,237,0.4)' }}
          >
            {downloading ? 'Generando PDF…' : '⬇ Descargar mi voucher'}
          </button>
        </>
      )}
    </div>
  )
}

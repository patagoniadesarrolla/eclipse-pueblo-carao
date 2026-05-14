'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'

interface Notification {
  id: string
  title: string
  body: string
  created_at: string
  read: boolean
}

function timeAgo(ts: string): string {
  const mins = Math.floor((Date.now() - new Date(ts).getTime()) / 60000)
  if (mins < 60) return `hace ${mins} min`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `hace ${hours} hora${hours > 1 ? 's' : ''}`
  return `hace ${Math.floor(hours / 24)} día${Math.floor(hours / 24) > 1 ? 's' : ''}`
}

export default function NotificacionesPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/buyer/notifications')
      .then(r => r.json())
      .then(data => { setNotifications(data.notifications ?? []); setLoading(false) })

    // Marcar todas como leídas
    fetch('/api/buyer/notifications/read', { method: 'POST' })
  }, [])

  return (
    <div className="px-6 py-10 max-w-2xl mx-auto">
      <div className="mb-10">
        <p className="text-xs font-bold uppercase tracking-[0.2em] mb-3" style={{ color: '#dc2626' }}>
          Avisos del equipo
        </p>
        <h1 className="text-4xl font-bold text-white">Notificaciones</h1>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => (
            <div key={i} className="h-20 rounded-2xl animate-pulse" style={{ background: 'rgba(255,255,255,0.05)' }} />
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-4xl mb-4">🔔</p>
          <p className="text-white font-semibold mb-1">Sin notificaciones</p>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.35)' }}>
            Los avisos del equipo van a aparecer acá
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n.id}
              className="p-5 rounded-2xl transition-all"
              style={{
                background: n.read ? 'rgba(255,255,255,0.03)' : 'rgba(124,58,237,0.07)',
                border: `1px solid ${n.read ? 'rgba(255,255,255,0.07)' : 'rgba(124,58,237,0.2)'}`,
              }}
            >
              {!n.read && (
                <span className="inline-block w-2 h-2 rounded-full bg-violet-400 mb-2" />
              )}
              <p className="text-white font-bold text-sm mb-1">{n.title}</p>
              <p className="text-sm leading-relaxed mb-2" style={{ color: 'rgba(255,255,255,0.55)' }}>{n.body}</p>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>{timeAgo(n.created_at)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

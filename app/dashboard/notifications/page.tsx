'use client'

import { useState, useEffect } from 'react'

interface NotificationRecord {
  id: string
  title: string
  body: string
  created_at: string
}

export default function NotificationsPage() {
  const [title, setTitle]       = useState('')
  const [body, setBody]         = useState('')
  const [sending, setSending]   = useState(false)
  const [success, setSuccess]   = useState(false)
  const [error, setError]       = useState<string | null>(null)
  const [history, setHistory]   = useState<NotificationRecord[]>([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    fetchHistory()
  }, [])

  async function fetchHistory() {
    setLoading(true)
    const res = await fetch('/api/dashboard/notifications')
    const data = await res.json()
    setHistory(data.notifications ?? [])
    setLoading(false)
  }

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim() || !body.trim()) return
    setSending(true)
    setError(null)
    setSuccess(false)

    const res = await fetch('/api/dashboard/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: title.trim(), body: body.trim() }),
    })

    if (res.ok) {
      setSuccess(true)
      setTitle('')
      setBody('')
      fetchHistory()
    } else {
      const d = await res.json()
      setError(d.error ?? 'Error al enviar')
    }
    setSending(false)
  }

  function timeAgo(ts: string): string {
    const mins = Math.floor((Date.now() - new Date(ts).getTime()) / 60000)
    if (mins < 60) return `hace ${mins} min`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `hace ${hours}h`
    return `hace ${Math.floor(hours / 24)}d`
  }

  return (
    <div className="p-6 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">Notificaciones</h1>
        <p className="text-gray-400 text-sm">Enviar avisos a todos los compradores</p>
      </div>

      {/* Form */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-8">
        <h2 className="text-sm font-semibold text-white uppercase tracking-wide mb-5">Nueva notificación</h2>
        <form onSubmit={handleSend} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">
              Título <span className="text-gray-600">({title.length}/60)</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value.slice(0, 60))}
              placeholder="Ej: Actualización sobre el evento"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-violet-500 transition-colors"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">
              Mensaje <span className="text-gray-600">({body.length}/300)</span>
            </label>
            <textarea
              value={body}
              onChange={e => setBody(e.target.value.slice(0, 300))}
              placeholder="Escribí el mensaje para los compradores…"
              rows={4}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-violet-500 transition-colors resize-none"
              required
            />
          </div>

          {error && (
            <p className="text-sm text-red-400">{error}</p>
          )}
          {success && (
            <p className="text-sm text-green-400">Notificación enviada a todos los compradores.</p>
          )}

          <div className="flex items-center justify-between pt-1">
            <p className="text-xs text-gray-600">Se enviará a todos los compradores con acceso al portal</p>
            <button
              type="submit"
              disabled={sending || !title.trim() || !body.trim()}
              className="px-5 py-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-colors"
            >
              {sending ? 'Enviando…' : 'Enviar a todos'}
            </button>
          </div>
        </form>
      </div>

      {/* History */}
      <div>
        <h2 className="text-sm font-semibold text-white uppercase tracking-wide mb-4">Historial</h2>
        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 rounded-xl animate-pulse bg-gray-900" />
            ))}
          </div>
        ) : history.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-gray-800 rounded-xl">
            <p className="text-gray-600 text-sm">Todavía no hay notificaciones enviadas</p>
          </div>
        ) : (
          <div className="border border-gray-800 rounded-xl overflow-hidden">
            {history.map((n, i) => (
              <div
                key={n.id}
                className="px-5 py-4 flex gap-4 items-start"
                style={{ borderBottom: i < history.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}
              >
                <span className="text-lg mt-0.5">🔔</span>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-semibold mb-0.5">{n.title}</p>
                  <p className="text-gray-500 text-xs leading-relaxed truncate">{n.body}</p>
                </div>
                <span className="text-xs text-gray-600 flex-shrink-0 mt-0.5">{timeAgo(n.created_at)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

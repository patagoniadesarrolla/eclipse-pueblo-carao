'use client'

import { useState } from 'react'
import { readStoredUTMs } from './UTMCapture'
import { useT } from '@/lib/i18n'

interface Props {
  isOpen: boolean
  onClose: () => void
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 16px',
  borderRadius: '10px',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  color: '#fff',
  fontSize: '15px',
  outline: 'none',
}

export default function ReservationModal({ isOpen, onClose }: Props) {
  const [form, setForm] = useState({ name: '', email: '', phone: '' })
  const [loading, setLoading] = useState(false)
  const [enviado, setEnviado] = useState(false)
  const [error, setError] = useState('')
  const t = useT<typeof import('@/messages/es.json')['modal']>('modal')

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, source: 'landing', ...readStoredUTMs() }),
      })

      if (!res.ok) throw new Error('Error en el servidor')

      setEnviado(true)
    } catch {
      setError(t.error)
    } finally {
      setLoading(false)
    }
  }

  const handleBackdrop = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
      setTimeout(() => setEnviado(false), 300)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.88)' }}
      onClick={handleBackdrop}
    >
      <div
        className="w-full max-w-md relative"
        style={{
          background: '#0d0d1a',
          border: '1px solid rgba(124,58,237,0.3)',
          borderRadius: '20px',
          boxShadow: '0 0 80px rgba(124,58,237,0.15)',
          padding: '36px',
        }}
      >
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 leading-none text-2xl transition-opacity hover:opacity-60"
          style={{ color: 'rgba(255,255,255,0.3)' }}
          aria-label="Cerrar"
        >
          ×
        </button>

        {enviado ? (
          <div className="text-center py-8">
            <div className="text-6xl mb-5">🌒</div>
            <h3 className="text-2xl font-bold text-white mb-3">
              {t.success_title}
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.55)' }}>
              {t.success_body}
            </p>
            <button
              onClick={onClose}
              className="mt-8 text-sm underline underline-offset-4 transition-opacity hover:opacity-60"
              style={{ color: 'rgba(255,255,255,0.35)' }}
            >
              {t.close}
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-white mb-1">
              {t.title}
            </h2>
            <p className="mb-7 text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>
              {t.subtitle}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  className="block text-sm font-medium mb-1.5"
                  style={{ color: 'rgba(255,255,255,0.7)' }}
                >
                  {t.name_label}
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  style={inputStyle}
                  placeholder={t.name_placeholder}
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium mb-1.5"
                  style={{ color: 'rgba(255,255,255,0.7)' }}
                >
                  {t.email_label}
                </label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  style={inputStyle}
                  placeholder={t.email_placeholder}
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium mb-1.5"
                  style={{ color: 'rgba(255,255,255,0.7)' }}
                >
                  {t.phone_label}
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  style={inputStyle}
                  placeholder={t.phone_placeholder}
                />
              </div>

              {error && (
                <p className="text-sm" style={{ color: '#f87171' }}>
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl font-semibold text-white transition-all duration-200 disabled:opacity-50 hover:opacity-90"
                style={{
                  background: 'linear-gradient(135deg, #7c3aed, #5b21b6)',
                  marginTop: '8px',
                }}
              >
                {loading ? t.submitting : t.submit}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

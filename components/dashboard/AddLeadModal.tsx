'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'

const FUENTES = [
  { value: 'manual',    label: 'Manual' },
  { value: 'landing',   label: 'Landing' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'whatsapp',  label: 'WhatsApp' },
  { value: 'referral',  label: 'Referido' },
]

interface Props {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function AddLeadModal({ isOpen, onClose, onSuccess }: Props) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    source: 'manual',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen) return null

  const set = (field: string, value: string) =>
    setForm((f) => ({ ...f, [field]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error } = await supabase.from('leads').insert({
      name:   form.name.trim(),
      email:  form.email.trim().toLowerCase(),
      phone:  form.phone.trim() || null,
      source: form.source,
    })

    if (error) {
      setError('Error al guardar el lead. Por favor intentá de nuevo.')
      setLoading(false)
      return
    }

    setForm({ name: '', email: '', phone: '', source: 'manual' })
    onSuccess()
  }

  const inputClass =
    'w-full px-3 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent text-sm transition-all'

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="w-full max-w-md bg-gray-950 rounded-2xl border border-gray-800 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-800">
          <h2 className="text-lg font-bold text-white">Agregar lead manual</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white transition-colors text-2xl leading-none"
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Nombre completo *
            </label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              className={inputClass}
              placeholder="Nombre del prospecto"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Email *
            </label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => set('email', e.target.value)}
              className={inputClass}
              placeholder="email@ejemplo.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Teléfono / WhatsApp
            </label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => set('phone', e.target.value)}
              className={inputClass}
              placeholder="+54 9 11 1234 5678"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Fuente
            </label>
            <select
              value={form.source}
              onChange={(e) => set('source', e.target.value)}
              className={inputClass}
            >
              {FUENTES.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <p className="text-sm text-red-400 py-2 px-3 rounded-lg bg-red-400/10 border border-red-400/20">
              {error}
            </p>
          )}

          {/* Botones */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm font-medium rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 px-4 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white text-sm font-semibold rounded-lg transition-colors"
            >
              {loading ? 'Guardando...' : 'Agregar lead'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { LandingSettings } from '@/types'
import { hexToRgba } from '@/lib/colors'

interface Props {
  settings: LandingSettings
}

export default function ColorsEditor({ settings }: Props) {
  const [primary, setPrimary] = useState(settings.primary_color)
  const [secondary, setSecondary] = useState(settings.secondary_color)
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSave = async () => {
    setLoading(true)
    setError('')
    setSaved(false)
    const supabase = createClient()

    const { error } = await supabase
      .from('landing_settings')
      .update({ primary_color: primary, secondary_color: secondary })
      .eq('id', settings.id)

    if (error) {
      setError('Error al guardar. Intentá de nuevo.')
    } else {
      setSaved(true)
      router.refresh()
      setTimeout(() => setSaved(false), 3000)
    }
    setLoading(false)
  }

  return (
    <div className="space-y-8">
      {/* Color primario */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-4">
          Color primario
          <span className="text-gray-500 font-normal ml-2">(botones, acentos, halo)</span>
        </label>
        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="color"
              value={primary}
              onChange={e => setPrimary(e.target.value)}
              className="w-14 h-14 rounded-xl cursor-pointer border-0 bg-transparent"
              style={{ padding: '2px' }}
            />
          </div>
          <div className="flex-1">
            <input
              type="text"
              value={primary}
              onChange={e => {
                const v = e.target.value
                if (/^#[0-9a-fA-F]{0,6}$/.test(v)) setPrimary(v)
              }}
              className="w-full px-3 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              placeholder="#7c3aed"
              maxLength={7}
            />
          </div>
        </div>

        {/* Preview primario */}
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            className="px-5 py-2.5 rounded-full text-sm font-semibold text-white"
            style={{ background: primary, boxShadow: `0 0 20px ${hexToRgba(primary, 0.4)}` }}
          >
            Reservar mi lugar
          </button>
          <div
            className="px-4 py-2 rounded-lg text-sm text-white"
            style={{ background: hexToRgba(primary, 0.15), border: `1px solid ${hexToRgba(primary, 0.4)}` }}
          >
            Badge activo
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800" />

      {/* Color secundario */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-4">
          Color secundario
          <span className="text-gray-500 font-normal ml-2">(etiquetas, fechas, precios)</span>
        </label>
        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="color"
              value={secondary}
              onChange={e => setSecondary(e.target.value)}
              className="w-14 h-14 rounded-xl cursor-pointer border-0 bg-transparent"
              style={{ padding: '2px' }}
            />
          </div>
          <div className="flex-1">
            <input
              type="text"
              value={secondary}
              onChange={e => {
                const v = e.target.value
                if (/^#[0-9a-fA-F]{0,6}$/.test(v)) setSecondary(v)
              }}
              className="w-full px-3 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              placeholder="#d97706"
              maxLength={7}
            />
          </div>
        </div>

        {/* Preview secundario */}
        <div className="mt-4 flex flex-wrap gap-3 items-center">
          <span
            className="text-xs font-semibold tracking-widest uppercase"
            style={{ color: secondary }}
          >
            Patagonia Argentina · 2027
          </span>
          <span className="text-2xl font-bold" style={{ color: secondary }}>
            $300 USD
          </span>
        </div>
      </div>

      {/* Preview combinado */}
      <div
        className="rounded-2xl p-6 relative overflow-hidden"
        style={{ background: '#050508', border: `1px solid ${hexToRgba(primary, 0.2)}` }}
      >
        <p className="text-xs uppercase tracking-widest font-semibold mb-2" style={{ color: secondary }}>
          Preview combinado
        </p>
        <h3 className="text-2xl font-bold text-white mb-1">Eclipse en Pueblo Carao</h3>
        <p className="text-gray-400 text-sm mb-4">Una noche que el universo preparó millones de años</p>
        <button
          className="px-6 py-2.5 rounded-full text-sm font-semibold text-white"
          style={{ background: `linear-gradient(135deg, ${primary}, ${hexToRgba(primary, 0.7)})` }}
        >
          Reservar mi lugar
        </button>
        <div
          className="absolute top-0 right-0 w-32 h-32 rounded-full pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${hexToRgba(primary, 0.15)}, transparent)`,
            filter: 'blur(20px)',
            transform: 'translate(30%, -30%)',
          }}
        />
      </div>

      {error && (
        <p className="text-sm text-red-400 py-2 px-3 rounded-lg bg-red-400/10 border border-red-400/20">
          {error}
        </p>
      )}

      <button
        onClick={handleSave}
        disabled={loading}
        className="w-full py-3 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white font-semibold rounded-xl transition-colors"
      >
        {loading ? 'Guardando...' : saved ? '✓ Guardado' : 'Guardar colores'}
      </button>
    </div>
  )
}

'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { LandingSettings, HeroBgType } from '@/types'

interface Props {
  settings: LandingSettings
}

const BG_TYPES: { value: HeroBgType; label: string; desc: string }[] = [
  { value: 'color',  label: 'Gradiente',  desc: 'Fondo oscuro con estrellas CSS' },
  { value: 'image',  label: 'Imagen',     desc: 'JPG, PNG o WebP de fondo' },
  { value: 'video',  label: 'Video',      desc: 'MP4 o WebM en loop' },
]

const inputClass = 'w-full px-3 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm'
const labelClass = 'block text-sm font-medium text-gray-300 mb-1.5'

export default function HeroEditor({ settings }: Props) {
  const [form, setForm] = useState({
    hero_title:   settings.hero_title,
    hero_tagline: settings.hero_tagline,
    hero_price:   settings.hero_price,
    hero_bg_type: settings.hero_bg_type,
    hero_bg_url:  settings.hero_bg_url ?? '',
  })
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const set = (key: string, value: string) => setForm(f => ({ ...f, [key]: value }))

  const handleFileUpload = async (file: File) => {
    setUploading(true)
    setError('')
    try {
      const supabase = createClient()
      const ext = file.name.split('.').pop()
      const path = `hero-${Date.now()}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from('landing-media')
        .upload(path, file, { upsert: true })

      if (uploadError) throw uploadError

      const { data } = supabase.storage.from('landing-media').getPublicUrl(path)
      set('hero_bg_url', data.publicUrl)
    } catch {
      setError('Error al subir el archivo. Verificá que el bucket "landing-media" exista y sea público.')
    } finally {
      setUploading(false)
    }
  }

  const handleSave = async () => {
    setLoading(true)
    setError('')
    setSaved(false)
    const supabase = createClient()

    const { error } = await supabase
      .from('landing_settings')
      .update({
        hero_title:   form.hero_title,
        hero_tagline: form.hero_tagline,
        hero_price:   form.hero_price,
        hero_bg_type: form.hero_bg_type,
        hero_bg_url:  form.hero_bg_url || null,
      })
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
    <div className="space-y-6">
      {/* Título */}
      <div>
        <label className={labelClass}>Título principal</label>
        <input
          type="text"
          value={form.hero_title}
          onChange={e => set('hero_title', e.target.value)}
          className={inputClass}
          placeholder="Eclipse en Pueblo Carao · 2027"
        />
      </div>

      {/* Tagline */}
      <div>
        <label className={labelClass}>Tagline</label>
        <textarea
          value={form.hero_tagline}
          onChange={e => set('hero_tagline', e.target.value)}
          className={inputClass + ' resize-none'}
          rows={2}
          placeholder="Una noche que el universo preparó millones de años"
        />
      </div>

      {/* Precio */}
      <div>
        <label className={labelClass}>Precio</label>
        <input
          type="text"
          value={form.hero_price}
          onChange={e => set('hero_price', e.target.value)}
          className={inputClass}
          placeholder="$300 USD"
        />
      </div>

      {/* Tipo de fondo */}
      <div>
        <label className={labelClass}>Fondo del hero</label>
        <div className="grid grid-cols-3 gap-3">
          {BG_TYPES.map(({ value, label, desc }) => (
            <button
              key={value}
              onClick={() => set('hero_bg_type', value)}
              className={`p-4 rounded-xl border text-left transition-all ${
                form.hero_bg_type === value
                  ? 'border-violet-500 bg-violet-600/15'
                  : 'border-gray-700 bg-gray-800/50 hover:border-gray-500'
              }`}
            >
              <p className={`text-sm font-semibold mb-0.5 ${form.hero_bg_type === value ? 'text-violet-300' : 'text-white'}`}>
                {label}
              </p>
              <p className="text-xs text-gray-500">{desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Upload de imagen o video */}
      {(form.hero_bg_type === 'image' || form.hero_bg_type === 'video') && (
        <div>
          <label className={labelClass}>
            {form.hero_bg_type === 'image' ? 'Imagen de fondo' : 'Video de fondo'}
          </label>

          <div
            className="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors hover:border-violet-500/50"
            style={{ borderColor: 'rgba(255,255,255,0.1)' }}
            onClick={() => fileRef.current?.click()}
          >
            {form.hero_bg_url ? (
              form.hero_bg_type === 'image' ? (
                <div className="space-y-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={form.hero_bg_url} alt="Hero bg" className="max-h-40 mx-auto rounded-lg object-cover" />
                  <p className="text-xs text-gray-500">Clic para cambiar</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <video src={form.hero_bg_url} className="max-h-40 mx-auto rounded-lg" controls />
                  <p className="text-xs text-gray-500">Clic para cambiar</p>
                </div>
              )
            ) : (
              <div>
                <p className="text-4xl mb-3">{form.hero_bg_type === 'image' ? '🖼️' : '🎬'}</p>
                <p className="text-gray-300 text-sm font-medium mb-1">
                  {uploading ? 'Subiendo...' : `Subir ${form.hero_bg_type === 'image' ? 'imagen' : 'video'}`}
                </p>
                <p className="text-gray-600 text-xs">
                  {form.hero_bg_type === 'image' ? 'JPG, PNG, WebP · Recomendado: 1920×1080' : 'MP4, WebM · Máx 50MB'}
                </p>
              </div>
            )}
          </div>

          <input
            ref={fileRef}
            type="file"
            accept={form.hero_bg_type === 'image' ? 'image/*' : 'video/*'}
            className="hidden"
            onChange={e => {
              const file = e.target.files?.[0]
              if (file) handleFileUpload(file)
            }}
          />

          {form.hero_bg_url && (
            <button
              onClick={() => set('hero_bg_url', '')}
              className="mt-2 text-xs text-red-400 hover:text-red-300 transition-colors"
            >
              × Quitar {form.hero_bg_type === 'image' ? 'imagen' : 'video'}
            </button>
          )}
        </div>
      )}

      {error && (
        <p className="text-sm text-red-400 py-2 px-3 rounded-lg bg-red-400/10 border border-red-400/20">
          {error}
        </p>
      )}

      <button
        onClick={handleSave}
        disabled={loading || uploading}
        className="w-full py-3 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white font-semibold rounded-xl transition-colors"
      >
        {loading ? 'Guardando...' : saved ? '✓ Guardado' : 'Guardar cambios'}
      </button>
    </div>
  )
}

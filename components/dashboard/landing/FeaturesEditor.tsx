'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { LandingFeature } from '@/types'

interface Props {
  features: LandingFeature[]
}

const EMPTY_FORM = { emoji: '', title: '', description: '' }
const inputClass = 'w-full px-3 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm'

export default function FeaturesEditor({ features: initialFeatures }: Props) {
  const [features, setFeatures] = useState<LandingFeature[]>(initialFeatures)
  const [editing, setEditing] = useState<string | null>(null)
  const [editForm, setEditForm] = useState(EMPTY_FORM)
  const [adding, setAdding] = useState(false)
  const [addForm, setAddForm] = useState(EMPTY_FORM)
  const [loading, setLoading] = useState<string | null>(null)

  const setEdit = (field: string, value: string) => setEditForm(f => ({ ...f, [field]: value }))
  const setAdd  = (field: string, value: string) => setAddForm(f => ({ ...f, [field]: value }))

  const startEdit = (feature: LandingFeature) => {
    setEditing(feature.id)
    setEditForm({ emoji: feature.emoji, title: feature.title, description: feature.description })
  }

  const saveEdit = async (id: string) => {
    setLoading(id)
    const supabase = createClient()
    const { error } = await supabase
      .from('landing_features')
      .update({ emoji: editForm.emoji, title: editForm.title, description: editForm.description })
      .eq('id', id)

    if (!error) {
      setFeatures(fs => fs.map(f => f.id === id ? { ...f, ...editForm } : f))
      setEditing(null)
    }
    setLoading(null)
  }

  const deleteFeature = async (id: string) => {
    if (!confirm('¿Eliminar esta feature?')) return
    setLoading(id)
    const supabase = createClient()
    const { error } = await supabase.from('landing_features').delete().eq('id', id)
    if (!error) setFeatures(fs => fs.filter(f => f.id !== id))
    setLoading(null)
  }

  const move = async (id: string, direction: 'up' | 'down') => {
    const index = features.findIndex(f => f.id === id)
    const swapIdx = direction === 'up' ? index - 1 : index + 1
    if (swapIdx < 0 || swapIdx >= features.length) return

    const next = [...features]
    const tempOrder = next[index].sort_order
    next[index] = { ...next[index], sort_order: next[swapIdx].sort_order }
    next[swapIdx] = { ...next[swapIdx], sort_order: tempOrder }
    ;[next[index], next[swapIdx]] = [next[swapIdx], next[index]]
    setFeatures(next)

    const supabase = createClient()
    await Promise.all([
      supabase.from('landing_features').update({ sort_order: next[index].sort_order }).eq('id', next[index].id),
      supabase.from('landing_features').update({ sort_order: next[swapIdx].sort_order }).eq('id', next[swapIdx].id),
    ])
  }

  const addFeature = async () => {
    if (!addForm.title.trim() || !addForm.description.trim()) return
    setLoading('new')
    const supabase = createClient()
    const maxOrder = features.reduce((max, f) => Math.max(max, f.sort_order), -1)

    const { data, error } = await supabase
      .from('landing_features')
      .insert({
        emoji: addForm.emoji || '⭐',
        title: addForm.title.trim(),
        description: addForm.description.trim(),
        sort_order: maxOrder + 1,
      })
      .select()
      .single()

    if (!error && data) {
      setFeatures(fs => [...fs, data])
      setAddForm(EMPTY_FORM)
      setAdding(false)
    }
    setLoading(null)
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-white font-semibold">Carrusel de features</p>
          <p className="text-gray-500 text-xs mt-0.5">{features.length} cards · se muestran en orden</p>
        </div>
        <button
          onClick={() => { setAdding(true); setEditing(null) }}
          className="px-3 py-1.5 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          + Agregar
        </button>
      </div>

      {/* Lista de features */}
      {features.map((feature, index) => (
        <div
          key={feature.id}
          className="rounded-xl border border-gray-800 overflow-hidden"
          style={{ background: 'rgba(255,255,255,0.02)' }}
        >
          {editing === feature.id ? (
            /* Modo edición */
            <div className="p-4 space-y-3">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={editForm.emoji}
                  onChange={e => setEdit('emoji', e.target.value)}
                  className={inputClass + ' w-20 text-center text-2xl'}
                  placeholder="⭐"
                  maxLength={4}
                />
                <input
                  type="text"
                  value={editForm.title}
                  onChange={e => setEdit('title', e.target.value)}
                  className={inputClass + ' flex-1'}
                  placeholder="Título"
                />
              </div>
              <textarea
                value={editForm.description}
                onChange={e => setEdit('description', e.target.value)}
                className={inputClass + ' resize-none'}
                rows={3}
                placeholder="Descripción de la feature..."
              />
              <div className="flex gap-2">
                <button
                  onClick={() => saveEdit(feature.id)}
                  disabled={loading === feature.id}
                  className="flex-1 py-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  {loading === feature.id ? 'Guardando...' : 'Guardar'}
                </button>
                <button
                  onClick={() => setEditing(null)}
                  className="flex-1 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm rounded-lg transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            /* Modo vista */
            <div className="flex items-center gap-4 p-4">
              <span className="text-2xl">{feature.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">{feature.title}</p>
                <p className="text-gray-500 text-xs truncate">{feature.description}</p>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  onClick={() => move(feature.id, 'up')}
                  disabled={index === 0}
                  className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-white disabled:opacity-20 rounded transition-colors text-xs"
                  title="Subir"
                >
                  ↑
                </button>
                <button
                  onClick={() => move(feature.id, 'down')}
                  disabled={index === features.length - 1}
                  className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-white disabled:opacity-20 rounded transition-colors text-xs"
                  title="Bajar"
                >
                  ↓
                </button>
                <button
                  onClick={() => startEdit(feature)}
                  className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-white rounded transition-colors text-xs"
                  title="Editar"
                >
                  ✏️
                </button>
                <button
                  onClick={() => deleteFeature(feature.id)}
                  disabled={loading === feature.id}
                  className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-red-400 disabled:opacity-20 rounded transition-colors text-xs"
                  title="Eliminar"
                >
                  🗑️
                </button>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Form agregar nueva feature */}
      {adding && (
        <div
          className="rounded-xl border border-violet-500/30 p-4 space-y-3"
          style={{ background: 'rgba(124,58,237,0.05)' }}
        >
          <p className="text-sm font-medium text-violet-300">Nueva feature</p>
          <div className="flex gap-3">
            <input
              type="text"
              value={addForm.emoji}
              onChange={e => setAdd('emoji', e.target.value)}
              className={inputClass + ' w-20 text-center text-2xl'}
              placeholder="⭐"
              maxLength={4}
            />
            <input
              type="text"
              value={addForm.title}
              onChange={e => setAdd('title', e.target.value)}
              className={inputClass + ' flex-1'}
              placeholder="Título *"
            />
          </div>
          <textarea
            value={addForm.description}
            onChange={e => setAdd('description', e.target.value)}
            className={inputClass + ' resize-none'}
            rows={3}
            placeholder="Descripción de la feature... *"
          />
          <div className="flex gap-2">
            <button
              onClick={addFeature}
              disabled={loading === 'new' || !addForm.title.trim()}
              className="flex-1 py-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
            >
              {loading === 'new' ? 'Guardando...' : 'Agregar feature'}
            </button>
            <button
              onClick={() => { setAdding(false); setAddForm(EMPTY_FORM) }}
              className="flex-1 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm rounded-lg transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {features.length === 0 && !adding && (
        <div className="text-center py-12 border border-dashed border-gray-800 rounded-xl">
          <p className="text-gray-500 text-sm">No hay features. Agregá la primera.</p>
        </div>
      )}
    </div>
  )
}

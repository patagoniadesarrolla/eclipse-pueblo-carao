'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'

/* ── Checklist ───────────────────────────────────────────────────────────── */

const CHECKLIST_ITEMS = [
  { key: 'ropa_abrigo',   label: 'Ropa de abrigo',         desc: 'Capa base, polar, campera cortaviento'          },
  { key: 'calzado',       label: 'Calzado cómodo',          desc: 'Para caminar en campo durante horas'            },
  { key: 'linterna',      label: 'Linterna de luz roja',    desc: 'No arruina la adaptación nocturna'              },
  { key: 'binoculares',   label: 'Binoculares',             desc: 'Opcional pero muy recomendado'                  },
  { key: 'manta',         label: 'Manta o silla plegable',  desc: 'Para los momentos de espera en el campo'       },
  { key: 'termo',         label: 'Termo con bebida caliente', desc: 'El frío llega rápido con la sombra'           },
  { key: 'camara',        label: 'Cámara con modo nocturno', desc: 'O teléfono con buena cámara'                  },
  { key: 'identificacion', label: 'Identificación personal', desc: 'DNI o pasaporte'                              },
  { key: 'botiquin',      label: 'Botiquín básico',          desc: 'Analgésicos, curitas, repelente'               },
  { key: 'snacks',        label: 'Snacks para el camino',    desc: 'La comida principal está incluida'             },
]

const MENU = [
  {
    curso: 'Entrada',
    plato: 'Provoleta a las brasas con chimichurri patagónico',
    desc: 'Queso de campo fundido con hierbas andinas recogidas en la cordillera.',
  },
  {
    curso: 'Principal',
    plato: 'Cordero al asador lento con papas andinas',
    desc: 'Cordero patagónico entero cocinado durante 8 horas, acompañado de papas nativas y ensalada de hojas frescas.',
  },
  {
    curso: 'Postre',
    plato: 'Torta Negra y calafate con crema helada',
    desc: 'Pastel galés tradicional elaborado según receta colonial, con frutos de calafate silvestre y crema de la zona.',
  },
]

const LLEGADA = [
  {
    desde: 'Desde Esquel',
    distancia: '80 km',
    tiempo: '1 hora aprox.',
    instrucciones: 'Tomar la RN40 dirección sur hasta el cruce de El Maitén. Seguir indicaciones hacia Lago Puelo por la RP15. Pueblo Carao está señalizado a la entrada del valle. Camino ripio compactado apto para cualquier vehículo.',
  },
  {
    desde: 'Desde Lago Puelo',
    distancia: '12 km',
    tiempo: '15 minutos aprox.',
    instrucciones: 'Cruzar el puente sobre el Río Puelo dirección norte. Continuar por la RP15 unos 10 km. El acceso a Pueblo Carao está señalizado en el km 12 a mano derecha. Camino de tierra con buena visibilidad.',
  },
]

export default function PreparatePage() {
  const [checklist, setChecklist] = useState<Record<string, boolean>>({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      supabase.from('buyer_profiles').select('checklist_items').eq('user_id', user.id).single()
        .then(({ data }) => {
          setChecklist((data?.checklist_items ?? {}) as Record<string, boolean>)
        })
    })
  }, [])

  const toggle = async (key: string) => {
    const next = { ...checklist, [key]: !checklist[key] }
    setChecklist(next)
    setSaving(true)
    await fetch('/api/buyer/checklist', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ checklist_items: next }),
    })
    setSaving(false)
  }

  const checked = Object.values(checklist).filter(Boolean).length
  const pct = Math.round((checked / CHECKLIST_ITEMS.length) * 100)

  return (
    <div className="px-6 py-10 max-w-2xl mx-auto">

      {/* Header */}
      <div className="mb-10">
        <p className="text-xs font-bold uppercase tracking-[0.2em] mb-3" style={{ color: '#dc2626' }}>
          Tu preparación
        </p>
        <h1 className="text-4xl font-bold text-white leading-tight">Preparate</h1>
      </div>

      {/* Checklist */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-bold text-lg uppercase tracking-wide">Checklist</h2>
          <span className="text-xs font-bold" style={{ color: '#a78bfa' }}>
            {saving ? 'Guardando…' : `${checked} / ${CHECKLIST_ITEMS.length}`}
          </span>
        </div>

        {/* Barra progreso */}
        <div className="h-1.5 rounded-full mb-5 overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{ width: `${pct}%`, background: 'linear-gradient(to right, #7c3aed, #a78bfa)' }}
          />
        </div>

        <div className="space-y-2">
          {CHECKLIST_ITEMS.map(({ key, label, desc }) => {
            const done = !!checklist[key]
            return (
              <button
                key={key}
                onClick={() => toggle(key)}
                className="w-full flex items-center gap-4 p-4 rounded-xl text-left transition-all duration-150"
                style={{
                  background: done ? 'rgba(124,58,237,0.1)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${done ? 'rgba(124,58,237,0.3)' : 'rgba(255,255,255,0.07)'}`,
                }}
              >
                <div
                  className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 transition-all"
                  style={{
                    background: done ? '#7c3aed' : 'rgba(255,255,255,0.06)',
                    border: `1.5px solid ${done ? '#7c3aed' : 'rgba(255,255,255,0.15)'}`,
                  }}
                >
                  {done && <span className="text-white text-xs font-bold">✓</span>}
                </div>
                <div>
                  <p className={`text-sm font-semibold ${done ? 'line-through' : ''}`}
                    style={{ color: done ? 'rgba(255,255,255,0.4)' : 'white' }}>
                    {label}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>{desc}</p>
                </div>
              </button>
            )
          })}
        </div>
      </section>

      {/* Menú del picnic */}
      <section className="mb-12">
        <h2 className="text-white font-bold text-lg uppercase tracking-wide mb-5">El picnic gourmet</h2>
        <div className="space-y-3">
          {MENU.map(({ curso, plato, desc }) => (
            <div
              key={curso}
              className="p-5 rounded-2xl"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#dc2626' }}>{curso}</p>
              <p className="text-white font-semibold text-sm mb-1">{plato}</p>
              <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>{desc}</p>
            </div>
          ))}
        </div>
        <p className="text-xs mt-3" style={{ color: 'rgba(255,255,255,0.25)' }}>
          Incluye bebidas sin alcohol, café y té de hierbas patagónicas
        </p>
      </section>

      {/* Cómo llegar */}
      <section>
        <h2 className="text-white font-bold text-lg uppercase tracking-wide mb-5">Cómo llegar</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {LLEGADA.map(({ desde, distancia, tiempo, instrucciones }) => (
            <div
              key={desde}
              className="p-5 rounded-2xl"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <p className="text-white font-bold text-sm mb-1">{desde}</p>
              <div className="flex gap-3 mb-3">
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(124,58,237,0.15)', color: '#a78bfa', border: '1px solid rgba(124,58,237,0.2)' }}>
                  {distancia}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)' }}>
                  {tiempo}
                </span>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>{instrucciones}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

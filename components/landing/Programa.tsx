'use client'

import { useState } from 'react'
import { useScrollReveal } from '@/lib/useScrollReveal'

/* ── Fase ANTES ──────────────────────────────────────────────────────────── */
const ANTES = [
  {
    icon: '✉',
    title: 'Mail de bienvenida',
    desc: 'Al confirmar tu lugar recibís el primer texto: el mito del dragón celeste, el tono del evento, el comienzo de algo diferente.',
  },
  {
    icon: '📖',
    title: '4 entregas de contenido',
    desc: 'Cada mes una pieza distinta: el dragón y los nodos lunares, la física del eclipse anular, la historia de Carao y sus raíces galesas, las instrucciones para el día.',
  },
  {
    icon: '🗺',
    title: 'Brief del evento',
    desc: 'Llegás sabiendo qué va a pasar en el cielo y en la tierra, qué vas a sentir en el cuerpo, y por qué este lugar es el único donde tiene sentido estar.',
  },
]

/* ── Fase EL DÍA ─────────────────────────────────────────────────────────── */
const DIA = [
  { time: '9:00',  title: 'Bienvenida',      desc: 'Recepción individual · Kit del asistente: mapa, mito, tiempos del eclipse y espacio en blanco para lo que veás.',                  highlight: false },
  { time: '9:30',  title: 'Desayuno',         desc: 'Mesa buffet con las Galletas Eclipse de edición limitada, especialmente elaboradas para el evento.',                               highlight: false },
  { time: '10:15', title: 'Presentación',     desc: '20 minutos que activan el relato antes de la cobertura parcial. No es una clase de astronomía: es parte de la narrativa.',        highlight: false },
  { time: '11:52', title: 'El anillo de fuego', desc: '7 minutos. El silencio acordado. La sombra del dragón de hierro iluminada desde el cielo. El frío repentino. El cielo cambia.', highlight: true  },
  { time: '12:10', title: 'Sol Fest',          desc: 'Celebración después del anillo: música en vivo, gastronomía, fotografía, arte y yoga. El evento abre.',                          highlight: false },
]

/* ── Fase DESPUÉS ────────────────────────────────────────────────────────── */
const DESPUES = [
  {
    icon: '📬',
    title: 'Pieza de cierre',
    desc: 'A las 48 horas: no es un agradecimiento. Es un texto que devuelve la experiencia con las palabras que no se tuvieron en el momento.',
  },
  {
    icon: '📷',
    title: 'Archivo de memoria',
    desc: 'Selección fotográfica digital con criterio narrativo. No es contenido de redes: es el racconto de lo que viviste.',
  },
]

/* ── Componentes ──────────────────────────────────────────────────────────── */

function BeforeAfterItem({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  const { ref, visible } = useScrollReveal(0.15)
  return (
    <div ref={ref} className={`reveal ${visible ? 'in-view' : ''} flex gap-4 mb-6 last:mb-0`}>
      <div className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-lg"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
        {icon}
      </div>
      <div>
        <h4 className="font-bold text-white text-sm mb-1 uppercase tracking-wide">{title}</h4>
        <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>{desc}</p>
      </div>
    </div>
  )
}

function DayItem({ item, delay }: { item: typeof DIA[0]; delay: string }) {
  const { ref, visible } = useScrollReveal(0.15)
  return (
    <div ref={ref} className={`reveal ${delay} ${visible ? 'in-view' : ''} flex gap-5 mb-6 last:mb-0`}>
      <div className="hidden sm:flex flex-col items-end pt-1 flex-shrink-0" style={{ minWidth: '52px' }}>
        <span className="text-sm font-bold tabular-nums" style={{ color: item.highlight ? '#dc2626' : 'rgba(124,58,237,0.8)' }}>
          {item.time}
        </span>
        <span className="text-[10px] uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.2)' }}>hs</span>
      </div>
      <div className="hidden sm:flex flex-col items-center pt-2">
        <div className="w-2.5 h-2.5 rounded-full flex-shrink-0"
          style={{
            background: item.highlight ? '#dc2626' : 'rgba(124,58,237,0.7)',
            boxShadow: item.highlight ? '0 0 10px rgba(220,38,38,0.7)' : '0 0 8px rgba(124,58,237,0.4)',
          }} />
      </div>
      <div className="flex-1 rounded-xl px-5 py-4"
        style={{
          background: item.highlight ? 'rgba(220,38,38,0.07)' : 'rgba(255,255,255,0.025)',
          border: `1px solid ${item.highlight ? 'rgba(220,38,38,0.3)' : 'rgba(255,255,255,0.06)'}`,
        }}>
        <span className="sm:hidden text-xs font-bold mb-1 block" style={{ color: item.highlight ? '#dc2626' : 'rgba(124,58,237,0.8)' }}>
          {item.time} hs
        </span>
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-bold text-white uppercase tracking-wide text-sm">{item.title}</h3>
          {item.highlight && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider"
              style={{ background: 'rgba(220,38,38,0.2)', color: '#dc2626', border: '1px solid rgba(220,38,38,0.35)' }}>
              7 min
            </span>
          )}
        </div>
        <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>{item.desc}</p>
      </div>
    </div>
  )
}

/* ── Tabs ──────────────────────────────────────────────────────────────────── */

const FASES = ['Antes', 'El día', 'Después'] as const
type Fase = typeof FASES[number]

export default function Programa() {
  const [fase, setFase] = useState<Fase>('El día')
  const { ref, visible } = useScrollReveal()

  return (
    <section id="programa" className="py-24 px-6" style={{ background: 'var(--c-bg-alt)' }}>
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div ref={ref} className="text-center mb-10">
          <p className={`reveal text-xs font-bold tracking-[0.3em] uppercase mb-4 ${visible ? 'in-view' : ''}`}
            style={{ color: '#dc2626' }}>
            La experiencia completa
          </p>
          <h2 className={`reveal reveal-d1 text-3xl md:text-5xl font-bold text-white uppercase tracking-tight ${visible ? 'in-view' : ''}`}>
            Tres actos
          </h2>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-2 mb-10">
          {FASES.map((f) => (
            <button key={f} onClick={() => setFase(f)}
              className="px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200"
              style={{
                background: fase === f ? '#dc2626' : 'rgba(255,255,255,0.05)',
                color:      fase === f ? '#fff'    : 'rgba(255,255,255,0.45)',
                border:     fase === f ? '1px solid #dc2626' : '1px solid rgba(255,255,255,0.08)',
              }}>
              {f}
            </button>
          ))}
        </div>

        {/* Contenido */}
        {fase === 'Antes' && (
          <div>
            <p className="text-sm text-center mb-8" style={{ color: 'rgba(255,255,255,0.4)' }}>
              La experiencia empieza el día que confirmás tu lugar, no el 6 de febrero.
            </p>
            {ANTES.map((item) => <BeforeAfterItem key={item.title} {...item} />)}
          </div>
        )}

        {fase === 'El día' && (
          <div className="relative">
            {/* Línea vertical */}
            <div className="absolute left-[64px] top-2 bottom-2 w-px hidden sm:block"
              style={{ background: 'linear-gradient(to bottom, transparent, rgba(124,58,237,0.4) 10%, rgba(124,58,237,0.4) 90%, transparent)' }} />
            {DIA.map((item, i) => (
              <DayItem key={i} item={item} delay={`reveal-d${Math.min(i + 1, 4)}`} />
            ))}
          </div>
        )}

        {fase === 'Después' && (
          <div>
            <p className="text-sm text-center mb-8" style={{ color: 'rgba(255,255,255,0.4)' }}>
              La mayoría de los eventos mueren cuando termina la última copa. Esto no.
            </p>
            {DESPUES.map((item) => <BeforeAfterItem key={item.title} {...item} />)}
          </div>
        )}

      </div>
    </section>
  )
}

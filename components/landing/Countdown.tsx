'use client'

import { useState, useEffect } from 'react'

// Eclipse total: 22 de julio de 2027, 20:00hs ART (UTC-3)
const TARGET = new Date('2027-07-22T20:00:00-03:00')

interface Tiempo {
  dias: number
  horas: number
  minutos: number
  segundos: number
}

function calcularTiempo(): Tiempo {
  const diff = TARGET.getTime() - Date.now()
  if (diff <= 0) return { dias: 0, horas: 0, minutos: 0, segundos: 0 }
  return {
    dias: Math.floor(diff / (1000 * 60 * 60 * 24)),
    horas: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutos: Math.floor((diff / (1000 * 60)) % 60),
    segundos: Math.floor((diff / 1000) % 60),
  }
}

function Unidad({ valor, label }: { valor: number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className="w-full py-6 px-3 rounded-2xl flex items-center justify-center"
        style={{
          background: 'rgba(124,58,237,0.08)',
          border: '1px solid rgba(124,58,237,0.25)',
        }}
      >
        <span
          className="text-4xl md:text-6xl font-bold text-white tabular-nums"
          style={{ fontVariantNumeric: 'tabular-nums' }}
        >
          {String(valor).padStart(2, '0')}
        </span>
      </div>
      <span
        className="text-xs uppercase tracking-widest font-medium"
        style={{ color: 'rgba(255,255,255,0.35)' }}
      >
        {label}
      </span>
    </div>
  )
}

export default function Countdown() {
  const [tiempo, setTiempo] = useState<Tiempo>(calcularTiempo())

  useEffect(() => {
    const interval = setInterval(() => setTiempo(calcularTiempo()), 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="py-20 px-6" style={{ background: '#050508' }}>
      <div className="max-w-3xl mx-auto text-center">
        <p
          className="text-xs font-semibold tracking-widest uppercase mb-10"
          style={{ color: '#d97706', letterSpacing: '0.25em' }}
        >
          El eclipse comienza en...
        </p>

        <div className="grid grid-cols-4 gap-3 md:gap-6">
          <Unidad valor={tiempo.dias} label="Días" />
          <Unidad valor={tiempo.horas} label="Horas" />
          <Unidad valor={tiempo.minutos} label="Min" />
          <Unidad valor={tiempo.segundos} label="Seg" />
        </div>

        <p className="mt-8 text-sm" style={{ color: 'rgba(255,255,255,0.3)' }}>
          22 de julio de 2027 · 20:00 hs · Lago Puelo, Patagonia
        </p>
      </div>
    </section>
  )
}

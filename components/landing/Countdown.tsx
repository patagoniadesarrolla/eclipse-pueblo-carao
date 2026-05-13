'use client'

import { useState, useEffect } from 'react'
import { useScrollReveal } from '@/lib/useScrollReveal'

const TARGET = new Date('2027-02-06T11:52:00-03:00')

interface Tiempo { dias: number; horas: number; minutos: number; segundos: number }

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

function Unidad({ valor, label, delay }: { valor: number; label: string; delay: string }) {
  return (
    <div className={`reveal ${delay} flex flex-col items-center gap-3`}>
      <div className="w-full py-6 px-3 rounded-2xl flex items-center justify-center"
        style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.25)' }}>
        <span className="text-4xl md:text-6xl font-bold text-white tabular-nums"
          style={{ fontVariantNumeric: 'tabular-nums' }}>
          {String(valor).padStart(2, '0')}
        </span>
      </div>
      <span className="text-xs uppercase tracking-widest font-bold" style={{ color: 'rgba(255,255,255,0.35)' }}>
        {label}
      </span>
    </div>
  )
}

export default function Countdown() {
  const [tiempo, setTiempo] = useState<Tiempo>(calcularTiempo())
  const { ref, visible } = useScrollReveal()

  useEffect(() => {
    const interval = setInterval(() => setTiempo(calcularTiempo()), 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="py-20 px-6" style={{ background: '#050508' }}>
      <div ref={ref} className="max-w-3xl mx-auto text-center">
        <p className={`reveal text-xs font-bold tracking-[0.3em] uppercase mb-3 ${visible ? 'in-view' : ''}`}
          style={{ color: '#dc2626' }}>
          El anillo de fuego comienza en
        </p>
        <p className={`reveal reveal-d1 text-xs tracking-widest uppercase mb-10 ${visible ? 'in-view' : ''}`}
          style={{ color: 'rgba(255,255,255,0.25)' }}>
          6 Feb 2027 · 11:52 hs · Pueblo Carao, Esquel
        </p>

        <div className={`grid grid-cols-4 gap-3 md:gap-6 ${visible ? 'in-view' : ''}`}>
          <Unidad valor={tiempo.dias}     label="Días"    delay="reveal-d1" />
          <Unidad valor={tiempo.horas}    label="Horas"   delay="reveal-d2" />
          <Unidad valor={tiempo.minutos}  label="Min"     delay="reveal-d3" />
          <Unidad valor={tiempo.segundos} label="Seg"     delay="reveal-d4" />
        </div>
      </div>
    </section>
  )
}

'use client'

import { useState, useEffect } from 'react'

// Feb 6 2027 11:52:00 — consistente con el programa del evento
const EVENT_DATE = new Date('2027-02-06T11:52:00-03:00')

function pad(n: number) { return String(n).padStart(2, '0') }

export default function BuyerCountdown() {
  const [diff, setDiff] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, past: false })

  useEffect(() => {
    const tick = () => {
      const ms = EVENT_DATE.getTime() - Date.now()
      if (ms <= 0) { setDiff({ days: 0, hours: 0, minutes: 0, seconds: 0, past: true }); return }
      const days    = Math.floor(ms / 86400000)
      const hours   = Math.floor((ms % 86400000) / 3600000)
      const minutes = Math.floor((ms % 3600000)  / 60000)
      const seconds = Math.floor((ms % 60000)    / 1000)
      setDiff({ days, hours, minutes, seconds, past: false })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  if (diff.past) return (
    <p className="text-center text-white/60 text-lg">El eclipse ya ocurrió. Gracias por estar ahí.</p>
  )

  const units = [
    { label: 'días',     value: diff.days    },
    { label: 'horas',    value: diff.hours   },
    { label: 'minutos',  value: diff.minutes },
    { label: 'segundos', value: diff.seconds },
  ]

  return (
    <div className="flex justify-center gap-3 md:gap-6">
      {units.map(({ label, value }) => (
        <div key={label} className="flex flex-col items-center">
          <div
            className="w-16 md:w-20 h-16 md:h-20 rounded-2xl flex items-center justify-center text-2xl md:text-3xl font-bold text-white tabular-nums"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            {pad(value)}
          </div>
          <span className="text-xs mt-1.5" style={{ color: 'rgba(255,255,255,0.35)' }}>{label}</span>
        </div>
      ))}
    </div>
  )
}

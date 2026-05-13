'use client'

import { useScrollReveal } from '@/lib/useScrollReveal'

const SCHEDULE = [
  {
    time: '9:00',
    title: 'Bienvenida',
    desc: 'Desayuno buffet · Entrega de mapas y merchandising del evento',
    highlight: false,
  },
  {
    time: '10:00',
    title: 'Presentación',
    desc: 'Historia del dragón y el eclipse — la cita de hierro con el sol',
    highlight: false,
  },
  {
    time: '11:52',
    title: 'Eclipse Anular',
    desc: '7 minutos de anillo de fuego. El dragón de hierro, iluminado desde el cielo.',
    highlight: true,
  },
  {
    time: '13:00',
    title: 'Sol Fest',
    desc: 'Fiesta de cierre · Música en vivo, gastronomía, fotografía, arte y yoga',
    highlight: false,
  },
]

function ScheduleItem({ item, delay }: { item: typeof SCHEDULE[0]; delay: string }) {
  const { ref, visible } = useScrollReveal(0.2)
  return (
    <div ref={ref} className={`reveal ${delay} ${visible ? 'in-view' : ''} flex gap-6 mb-8 last:mb-0`}>
      {/* Hora */}
      <div className="hidden sm:flex flex-col items-end pt-1 flex-shrink-0" style={{ minWidth: '60px' }}>
        <span className="text-base font-bold tabular-nums"
          style={{ color: item.highlight ? '#dc2626' : 'rgba(124,58,237,0.8)' }}>
          {item.time}
        </span>
        <span className="text-[10px] uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.25)' }}>hs</span>
      </div>

      {/* Dot */}
      <div className="hidden sm:flex flex-col items-center pt-2">
        <div className="w-2.5 h-2.5 rounded-full flex-shrink-0"
          style={{
            background: item.highlight ? '#dc2626' : 'rgba(124,58,237,0.8)',
            boxShadow: item.highlight ? '0 0 10px rgba(220,38,38,0.6)' : '0 0 8px rgba(124,58,237,0.4)',
          }} />
      </div>

      {/* Contenido */}
      <div className="flex-1 rounded-xl px-5 py-4"
        style={{
          background: item.highlight ? 'rgba(220,38,38,0.07)' : 'rgba(255,255,255,0.025)',
          border: `1px solid ${item.highlight ? 'rgba(220,38,38,0.3)' : 'rgba(255,255,255,0.07)'}`,
        }}>
        <span className="sm:hidden text-xs font-bold mb-1 block"
          style={{ color: item.highlight ? '#dc2626' : 'rgba(124,58,237,0.8)' }}>
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

export default function Programa() {
  const { ref, visible } = useScrollReveal()

  return (
    <section className="py-24 px-6" style={{ background: '#07070f' }}>
      <div className="max-w-2xl mx-auto">
        <div ref={ref} className="text-center mb-14">
          <p className={`reveal text-xs font-bold tracking-[0.3em] uppercase mb-4 ${visible ? 'in-view' : ''}`}
            style={{ color: '#dc2626' }}>
            El día del eclipse
          </p>
          <h2 className={`reveal reveal-d1 text-3xl md:text-5xl font-bold text-white uppercase tracking-tight ${visible ? 'in-view' : ''}`}>
            Programa
          </h2>
        </div>

        <div className="relative">
          {/* Línea vertical */}
          <div className="absolute left-[72px] top-2 bottom-2 w-px hidden sm:block"
            style={{ background: 'linear-gradient(to bottom, transparent, rgba(124,58,237,0.4) 10%, rgba(124,58,237,0.4) 90%, transparent)' }} />

          {SCHEDULE.map((item, i) => (
            <ScheduleItem
              key={i}
              item={item}
              delay={`reveal-d${Math.min(i + 1, 4)}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

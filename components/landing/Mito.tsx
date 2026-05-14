'use client'

import { useScrollReveal } from '@/lib/useScrollReveal'
import { useT } from '@/lib/i18n'

export default function Mito() {
  const { ref, visible } = useScrollReveal()
  const t = useT<typeof import('@/messages/es.json')['mito']>('mito')

  return (
    <section id="mito" className="py-28 px-6 relative overflow-hidden" style={{ background: '#050508' }}>

      {/* Glow decorativo */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden="true">
        <div style={{
          width: '800px', height: '400px', borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(220,38,38,0.06) 0%, transparent 65%)',
          filter: 'blur(60px)',
        }} />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">

        {/* Header */}
        <div ref={ref} className="text-center mb-16">
          <p className={`reveal text-xs font-bold tracking-[0.3em] uppercase mb-4 ${visible ? 'in-view' : ''}`}
            style={{ color: '#dc2626' }}>
            {t.eyebrow}
          </p>
          <h2 className={`reveal reveal-d1 text-3xl md:text-5xl font-bold text-white uppercase tracking-tight mb-6 ${visible ? 'in-view' : ''}`}>
            {t.title.split('\n').map((line, i) => (
              <span key={i}>{line}{i === 0 && <br className="hidden md:block" />}</span>
            ))}
          </h2>
          <p className={`reveal reveal-d2 text-base md:text-lg max-w-2xl mx-auto leading-relaxed ${visible ? 'in-view' : ''}`}
            style={{ color: 'rgba(255,255,255,0.55)' }}>
            {t.body}
          </p>
        </div>

        {/* Cita */}
        <blockquote className="text-center mb-16 px-4">
          <p className="text-xl md:text-2xl font-bold italic leading-relaxed"
            style={{ color: 'rgba(255,255,255,0.85)' }}>
            {t.quote}
          </p>
        </blockquote>

        {/* Cards de datos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {t.datos.map(({ label, value, desc }, i) => {
            const { ref: r, visible: v } = useScrollReveal(0.15)
            return (
              <div key={label} ref={r}
                className={`reveal reveal-d${i + 1} rounded-2xl p-6 ${v ? 'in-view' : ''}`}
                style={{ background: 'rgba(220,38,38,0.04)', border: '1px solid rgba(220,38,38,0.18)' }}>
                <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: '#dc2626' }}>{label}</p>
                <p className="text-xl font-bold text-white mb-3">{value}</p>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>{desc}</p>
              </div>
            )
          })}
        </div>

        {/* Remate */}
        <div className="mt-16 text-center">
          <div className="inline-flex flex-col items-center gap-3 px-8 py-6 rounded-2xl"
            style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>{t.closing_pre}</p>
            <p className="text-lg md:text-xl font-bold text-white leading-snug text-center">{t.closing_main}</p>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>{t.closing_post}</p>
          </div>
        </div>

      </div>
    </section>
  )
}

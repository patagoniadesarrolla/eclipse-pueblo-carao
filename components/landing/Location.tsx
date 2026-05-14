'use client'

import { LandingSettings } from '@/types'
import { hexToRgba } from '@/lib/colors'
import { useT } from '@/lib/i18n'

export default function Location({ settings }: { settings: LandingSettings }) {
  const primary = settings.primary_color
  const secondary = settings.secondary_color
  const t = useT<typeof import('@/messages/es.json')['location']>('location')

  const statColors = ['#dc2626', primary, secondary, '#dc2626']

  return (
    <section id="location" className="py-24 px-6 relative overflow-hidden" style={{ background: 'var(--c-bg-alt)' }}>
      <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true"
        style={{
          width: '500px', height: '500px',
          background: `radial-gradient(circle, ${hexToRgba(secondary, 0.07)} 0%, transparent 65%)`,
          filter: 'blur(80px)',
        }} />

      <div className="max-w-5xl mx-auto relative z-10">

        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-xs font-bold tracking-[0.3em] uppercase mb-4" style={{ color: secondary }}>
            {t.eyebrow}
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-5 leading-tight uppercase tracking-tight">
            {t.title_1}<br />
            <span style={{ color: primary }}>{t.title_2}</span>
          </h2>
          <p className="text-base md:text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
            {t.subtitle}
          </p>
        </div>

        {/* Historia en tres bloques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-14">
          {t.historia.map(({ label, text }) => (
            <div key={label} className="rounded-2xl p-6"
              style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: secondary }}>
                {label}
              </p>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>{text}</p>
            </div>
          ))}
        </div>

        {/* Datos clave */}
        <div className="rounded-3xl p-8 md:p-10"
          style={{
            background: `linear-gradient(145deg, ${hexToRgba(primary, 0.08)}, ${hexToRgba(secondary, 0.04)})`,
            border: `1px solid ${hexToRgba(primary, 0.15)}`,
          }}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {t.stats.map(({ value, label }, i) => (
              <div key={label}>
                <p className="text-3xl md:text-4xl font-bold mb-1 uppercase" style={{ color: statColors[i] }}>{value}</p>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{label}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}

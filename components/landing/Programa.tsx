'use client'

import { useState } from 'react'
import { useScrollReveal } from '@/lib/useScrollReveal'
import { useT } from '@/lib/i18n'

type FaseKey = 'before' | 'day' | 'after'

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

function DayItem({ item, delay }: { item: { time: string; title: string; desc: string; highlight: boolean }; delay: string }) {
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

export default function Programa() {
  const [faseKey, setFaseKey] = useState<FaseKey>('day')
  const { ref, visible } = useScrollReveal()
  const t = useT<typeof import('@/messages/es.json')['programa']>('programa')

  const tabs: { key: FaseKey; label: string }[] = [
    { key: 'before', label: t.tab_before },
    { key: 'day',    label: t.tab_day },
    { key: 'after',  label: t.tab_after },
  ]

  return (
    <section id="programa" className="py-24 px-6" style={{ background: 'var(--c-bg-alt)' }}>
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div ref={ref} className="text-center mb-10">
          <p className={`reveal text-xs font-bold tracking-[0.3em] uppercase mb-4 ${visible ? 'in-view' : ''}`}
            style={{ color: '#dc2626' }}>
            {t.eyebrow}
          </p>
          <h2 className={`reveal reveal-d1 text-3xl md:text-5xl font-bold text-white uppercase tracking-tight ${visible ? 'in-view' : ''}`}>
            {t.title}
          </h2>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-2 mb-10">
          {tabs.map(({ key, label }) => (
            <button key={key} onClick={() => setFaseKey(key)}
              className="px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200"
              style={{
                background: faseKey === key ? '#dc2626' : 'rgba(255,255,255,0.05)',
                color:      faseKey === key ? '#fff'    : 'rgba(255,255,255,0.45)',
                border:     faseKey === key ? '1px solid #dc2626' : '1px solid rgba(255,255,255,0.08)',
              }}>
              {label}
            </button>
          ))}
        </div>

        {/* Contenido */}
        {faseKey === 'before' && (
          <div>
            <p className="text-sm text-center mb-8" style={{ color: 'rgba(255,255,255,0.4)' }}>
              {t.before_intro}
            </p>
            {t.before_items.map((item) => <BeforeAfterItem key={item.title} {...item} />)}
          </div>
        )}

        {faseKey === 'day' && (
          <div className="relative">
            <div className="absolute left-[64px] top-2 bottom-2 w-px hidden sm:block"
              style={{ background: 'linear-gradient(to bottom, transparent, rgba(124,58,237,0.4) 10%, rgba(124,58,237,0.4) 90%, transparent)' }} />
            {t.day_items.map((item, i) => (
              <DayItem key={i} item={item} delay={`reveal-d${Math.min(i + 1, 4)}`} />
            ))}
          </div>
        )}

        {faseKey === 'after' && (
          <div>
            <p className="text-sm text-center mb-8" style={{ color: 'rgba(255,255,255,0.4)' }}>
              {t.after_intro}
            </p>
            {t.after_items.map((item) => <BeforeAfterItem key={item.title} {...item} />)}
          </div>
        )}

      </div>
    </section>
  )
}

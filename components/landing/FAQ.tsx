'use client'

import { useState } from 'react'
import { useScrollReveal } from '@/lib/useScrollReveal'
import { useT } from '@/lib/i18n'

export default function FAQ() {
  const [abierto, setAbierto] = useState<number | null>(null)
  const { ref, visible } = useScrollReveal()
  const t = useT<typeof import('@/messages/es.json')['faq']>('faq')

  return (
    <section id="faq" className="py-24 px-6" style={{ background: 'var(--c-bg)' }}>
      <div className="max-w-3xl mx-auto">
        <div ref={ref} className="text-center mb-16">
          <p className={`reveal text-xs font-bold tracking-[0.3em] uppercase mb-4 ${visible ? 'in-view' : ''}`}
            style={{ color: '#dc2626' }}>
            {t.eyebrow}
          </p>
          <h2 className={`reveal reveal-d1 text-3xl md:text-5xl font-bold text-white uppercase tracking-tight ${visible ? 'in-view' : ''}`}>
            {t.title}
          </h2>
        </div>

        <div className="space-y-3">
          {t.items.map((faq, index) => (
            <div
              key={index}
              className="rounded-xl overflow-hidden"
              style={{
                background: 'rgba(255,255,255,0.02)',
                border: `1px solid ${abierto === index ? 'rgba(124,58,237,0.35)' : 'rgba(255,255,255,0.07)'}`,
                transition: 'border-color 0.2s',
              }}
            >
              <button
                onClick={() => setAbierto(abierto === index ? null : index)}
                className="w-full text-left px-6 py-5 flex items-start justify-between gap-6"
              >
                <span className="text-white font-medium leading-snug">{faq.q}</span>
                <span className="flex-shrink-0 text-2xl font-light leading-none mt-0.5 transition-transform duration-200"
                  style={{ color: '#7c3aed', transform: abierto === index ? 'rotate(45deg)' : 'none' }}>
                  +
                </span>
              </button>

              {abierto === index && (
                <div className="px-6 pb-6 leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

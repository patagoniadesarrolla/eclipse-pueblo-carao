'use client'

import { useState, useRef } from 'react'
import { LandingFeature, LandingSettings } from '@/types'
import { hexToRgba } from '@/lib/colors'
import { useScrollReveal } from '@/lib/useScrollReveal'

interface Props {
  features: LandingFeature[]
  settings: LandingSettings
}

export default function Includes({ features, settings }: Props) {
  const [active, setActive] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)
  const { primary_color: primary, secondary_color: secondary } = settings
  const { ref, visible } = useScrollReveal()

  const scrollToCard = (index: number) => {
    setActive(index)
    const container = scrollRef.current
    if (!container) return
    const card = container.children[index] as HTMLElement
    if (card) card.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
  }

  return (
    <section className="py-24 overflow-hidden" style={{ background: '#050508' }}>
      <div ref={ref} className="text-center mb-14 px-6">
        <p className={`reveal text-xs font-bold tracking-[0.3em] uppercase mb-4 ${visible ? 'in-view' : ''}`}
          style={{ color: secondary }}>
          La experiencia
        </p>
        <h2 className={`reveal reveal-d1 text-3xl md:text-5xl font-bold text-white uppercase tracking-tight ${visible ? 'in-view' : ''}`}>
          ¿Qué incluye?
        </h2>
      </div>

      {/* Carrusel */}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto gap-5 pb-6"
        style={{
          scrollSnapType: 'x mandatory',
          scrollBehavior: 'smooth',
          WebkitOverflowScrolling: 'touch',
          paddingLeft: 'max(24px, calc(50vw - 200px))',
          paddingRight: 'max(24px, calc(50vw - 200px))',
          msOverflowStyle: 'none',
          scrollbarWidth: 'none',
        }}
      >
        {features.map((feature, index) => {
          const isActive = active === index
          return (
            <div
              key={feature.id}
              onClick={() => scrollToCard(index)}
              className="flex-shrink-0 rounded-2xl p-8 cursor-pointer relative overflow-hidden"
              style={{
                width: '300px',
                scrollSnapAlign: 'center',
                background: isActive
                  ? `linear-gradient(145deg, ${hexToRgba(primary, 0.22)}, ${hexToRgba(secondary, 0.1)})`
                  : 'rgba(255,255,255,0.025)',
                border: `1px solid ${isActive ? hexToRgba(primary, 0.45) : 'rgba(255,255,255,0.07)'}`,
                transform: isActive ? 'scale(1.03)' : 'scale(0.95)',
                transition: 'all 0.35s ease',
              }}
            >
              <div className="absolute inset-x-0 top-0 h-24 pointer-events-none"
                style={{ background: `linear-gradient(to bottom, ${hexToRgba(primary, isActive ? 0.15 : 0.04)}, transparent)` }} />

              <div className="relative z-10">
                <div className="text-5xl mb-5">{feature.emoji}</div>
                <h3 className="text-xl font-bold text-white mb-3 uppercase tracking-wide">{feature.title}</h3>
                <p className="leading-relaxed text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
                  {feature.description}
                </p>
              </div>

              <div className="absolute bottom-4 right-5 text-xs font-bold"
                style={{ color: hexToRgba(primary, isActive ? 0.7 : 0.2) }}>
                0{index + 1}
              </div>
            </div>
          )
        })}
      </div>

      {/* Dots */}
      <div className="flex justify-center items-center gap-2 mt-6">
        {features.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollToCard(index)}
            className="rounded-full transition-all duration-300"
            style={{
              width: active === index ? '28px' : '8px',
              height: '8px',
              background: active === index ? primary : 'rgba(255,255,255,0.2)',
            }}
            aria-label={`Feature ${index + 1}`}
          />
        ))}
      </div>

      {/* Flechas */}
      <div className="flex justify-center gap-3 mt-5">
        <button
          onClick={() => scrollToCard(Math.max(0, active - 1))}
          disabled={active === 0}
          className="w-10 h-10 rounded-full flex items-center justify-center transition-all disabled:opacity-20"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
        >←</button>
        <button
          onClick={() => scrollToCard(Math.min(features.length - 1, active + 1))}
          disabled={active === features.length - 1}
          className="w-10 h-10 rounded-full flex items-center justify-center transition-all disabled:opacity-20"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
        >→</button>
      </div>
    </section>
  )
}

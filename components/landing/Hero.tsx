'use client'

import { useState } from 'react'
import { LandingSettings } from '@/types'
import { hexToRgba } from '@/lib/colors'
import ReservationModal from './ReservationModal'

interface Props {
  settings: LandingSettings
}

function HeroBackground({ settings }: { settings: LandingSettings }) {
  if (settings.hero_bg_type === 'image' && settings.hero_bg_url) {
    return (
      <>
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${settings.hero_bg_url})` }}
        />
        <div className="absolute inset-0" style={{ background: 'rgba(5,5,8,0.72)' }} />
      </>
    )
  }

  if (settings.hero_bg_type === 'video' && settings.hero_bg_url) {
    return (
      <>
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src={settings.hero_bg_url}
          autoPlay
          muted
          loop
          playsInline
        />
        <div className="absolute inset-0" style={{ background: 'rgba(5,5,8,0.68)' }} />
      </>
    )
  }

  return <div className="stars-layer" />
}

export default function Hero({ settings }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { primary_color: primary, secondary_color: secondary } = settings

  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ background: 'var(--c-bg)' }}
    >
      <HeroBackground settings={settings} />

      {/* Halo de color dinámico */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden="true">
        <div style={{
          width: '600px', height: '600px', borderRadius: '50%',
          background: `radial-gradient(circle, ${hexToRgba(primary, 0.12)} 0%, ${hexToRgba(secondary, 0.06)} 45%, transparent 70%)`,
          filter: 'blur(60px)',
        }} />
      </div>

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">

        {/* Eyebrow — fecha y lugar */}
        <div className="hero-enter flex items-center justify-center gap-3 mb-6">
          <div className="h-px w-8" style={{ background: '#dc2626' }} />
          <p className="text-xs font-bold tracking-[0.3em] uppercase" style={{ color: secondary }}>
            Patagonia Argentina
          </p>
          <div className="h-px w-8" style={{ background: '#dc2626' }} />
        </div>

        {/* Badge de fecha */}
        <div className="hero-enter-d1 inline-flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase"
          style={{ background: 'rgba(220,38,38,0.12)', border: '1px solid rgba(220,38,38,0.35)', color: '#dc2626' }}>
          6 FEB 2027
        </div>

        {/* Título principal */}
        <h1 className="hero-enter-d2 text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-4 leading-none tracking-tight uppercase">
          {settings.hero_title}
        </h1>

        {/* Tagline */}
        <p className="hero-enter-d3 text-lg md:text-xl mb-4 max-w-2xl mx-auto leading-relaxed"
          style={{ color: 'rgba(255,255,255,0.6)' }}>
          {settings.hero_tagline}
        </p>

        {/* Frase del dragón */}
        <p className="hero-enter-d3 text-sm md:text-base font-bold tracking-widest uppercase mb-10"
          style={{ color: '#dc2626' }}>
          Cuando el sol se apague, el dragón despertará
        </p>

        <div className="hero-enter-d4 flex flex-col items-center gap-5">
          <div className="text-center">
            <p className="text-5xl font-bold text-white">{settings.hero_price}</p>
            <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
              por persona · experiencia completa
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-10 py-4 text-base md:text-lg font-bold rounded-full text-white uppercase tracking-widest transition-all duration-300 hover:scale-105"
            style={{
              background: `linear-gradient(135deg, ${primary} 0%, ${hexToRgba(primary, 0.7)} 100%)`,
              boxShadow: `0 0 40px ${hexToRgba(primary, 0.45)}`,
              letterSpacing: '0.15em',
            }}
          >
            Reservar mi lugar
          </button>

          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>
            Cupos limitados · Sin cargo por consulta
          </p>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, transparent, #050508)' }} />

      <ReservationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  )
}

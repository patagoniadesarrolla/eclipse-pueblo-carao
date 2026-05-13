'use client'

import { useState } from 'react'
import ReservationModal from './ReservationModal'

export default function Hero() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ background: '#050508' }}
    >
      {/* Campo de estrellas */}
      <div className="stars-layer" />

      {/* Halo del eclipse */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        aria-hidden="true"
      >
        <div
          style={{
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(124,58,237,0.12) 0%, rgba(217,119,6,0.06) 45%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
      </div>

      {/* Contenido */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <p
          className="text-xs md:text-sm font-semibold tracking-widest uppercase mb-8"
          style={{ color: '#d97706', letterSpacing: '0.25em' }}
        >
          Patagonia Argentina · 22 de julio de 2027
        </p>

        <h1
          className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-none tracking-tight"
        >
          Eclipse en
          <br />
          <span style={{ color: '#7c3aed' }}>Pueblo Carao</span>
          <span className="text-white"> · 2027</span>
        </h1>

        <p
          className="text-xl md:text-2xl mb-12 max-w-2xl mx-auto leading-relaxed"
          style={{ color: 'rgba(255,255,255,0.65)' }}
        >
          Una noche que el universo preparó millones de años
        </p>

        <div className="flex flex-col items-center gap-6">
          <div className="text-center">
            <p className="text-5xl font-bold text-white">$300 USD</p>
            <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
              por persona · experiencia completa
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-10 py-4 text-base md:text-lg font-semibold rounded-full text-white transition-all duration-300 hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)',
              boxShadow: '0 0 40px rgba(124,58,237,0.45)',
            }}
          >
            Reservar mi lugar
          </button>

          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>
            Cupos limitados · Sin cargo por consulta
          </p>
        </div>
      </div>

      {/* Gradiente inferior de transición */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, transparent, #050508)',
        }}
      />

      <ReservationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  )
}

'use client'

import { useEffect, useState } from 'react'

const SECTIONS = [
  { id: 'hero',      label: 'Inicio'           },
  { id: 'countdown', label: 'Cuenta regresiva' },
  { id: 'mito',      label: 'El mito'          },
  { id: 'programa',  label: 'Programa'         },
  { id: 'includes',  label: '¿Qué incluye?'   },
  { id: 'location',  label: 'El lugar'         },
  { id: 'faq',       label: 'FAQ'              },
]

export default function FloatingNav() {
  const [active, setActive]   = useState('hero')
  const [hovered, setHovered] = useState<string | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 120)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const observers: IntersectionObserver[] = []
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (!el) return
      const obs = new IntersectionObserver(
        ([e]) => { if (e.isIntersecting) setActive(id) },
        { threshold: 0.3, rootMargin: '-10% 0px -60% 0px' }
      )
      obs.observe(el)
      observers.push(obs)
    })
    return () => observers.forEach(o => o.disconnect())
  }, [])

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <div
      style={{
        position: 'fixed',
        right: '18px',
        top: '50%',
        transform: `translateY(-50%) ${visible ? 'scale(1)' : 'scale(0.7)'}`,
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.4s ease, transform 0.4s ease',
        zIndex: 50,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 0,
        pointerEvents: visible ? 'auto' : 'none',
      }}
    >
      {/* Cápsula de fondo */}
      <div style={{
        position: 'absolute',
        inset: '-12px -8px',
        borderRadius: '999px',
        background: 'var(--c-nav-bg)',
        border: '1px solid var(--c-nav-bd)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }} />

      {/* Puntos de sección */}
      {SECTIONS.map((section, i) => {
        const isActive  = active === section.id
        const isHovered = hovered === section.id

        return (
          <div key={section.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
            {/* Label */}
            <div style={{
              position: 'absolute',
              right: '28px',
              top: '50%',
              transform: 'translateY(-50%)',
              pointerEvents: 'none',
              opacity: isHovered ? 1 : 0,
              transition: 'opacity 0.2s ease',
              whiteSpace: 'nowrap',
              background: 'var(--c-nav-bg)',
              border: `1px solid ${isActive ? 'rgba(124,58,237,0.5)' : 'var(--c-border)'}`,
              borderRadius: '6px',
              padding: '4px 10px',
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.05em',
              color: isActive ? '#a78bfa' : 'var(--c-text-2)',
              backdropFilter: 'blur(8px)',
            }}>
              {section.label}
            </div>

            {/* Punto */}
            <button
              onClick={() => scrollTo(section.id)}
              onMouseEnter={() => setHovered(section.id)}
              onMouseLeave={() => setHovered(null)}
              style={{
                width:  isActive ? '14px' : '8px',
                height: isActive ? '14px' : '8px',
                borderRadius: '50%',
                border: isActive
                  ? '2px solid #7c3aed'
                  : '1.5px solid var(--c-border)',
                background: isActive ? '#7c3aed' : 'var(--c-card)',
                boxShadow: isActive
                  ? '0 0 0 4px rgba(124,58,237,0.2), 0 0 12px rgba(124,58,237,0.6)'
                  : 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                position: 'relative',
                zIndex: 2,
                padding: 0,
                animation: isActive ? 'navPulse 2s ease-in-out infinite' : 'none',
                margin: '5px 0',
              }}
              aria-label={section.label}
            />

            {/* Línea conectora */}
            {i < SECTIONS.length - 1 && (
              <div style={{
                width: '1px',
                height: '18px',
                background: isActive || active === SECTIONS[i + 1].id
                  ? 'linear-gradient(to bottom, rgba(124,58,237,0.7), rgba(124,58,237,0.3))'
                  : 'var(--c-border)',
                transition: 'background 0.4s ease',
              }} />
            )}
          </div>
        )
      })}

      <style>{`
        @keyframes navPulse {
          0%, 100% { box-shadow: 0 0 0 4px rgba(124,58,237,0.2), 0 0 12px rgba(124,58,237,0.6); }
          50%       { box-shadow: 0 0 0 7px rgba(124,58,237,0.1), 0 0 20px rgba(124,58,237,0.8); }
        }
      `}</style>
    </div>
  )
}

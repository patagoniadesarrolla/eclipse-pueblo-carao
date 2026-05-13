'use client'

import { useEffect, useState, useRef } from 'react'

const ECLIPSE_DATE = new Date('2027-02-06T11:52:00-03:00')

function useCountdown(target: Date) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    function update() {
      const now = new Date()
      const diff = target.getTime() - now.getTime()
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        return
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)
      setTimeLeft({ days, hours, minutes, seconds })
    }
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [target])

  return timeLeft
}

const programa = [
  {
    time: '9:00',
    title: 'BIENVENIDA',
    desc: 'Desayuno buffet, entrega de mapas y merchandising del evento',
    highlight: false,
  },
  {
    time: '10:00',
    title: 'PRESENTACIÓN',
    desc: 'Historia del dragón y el eclipse — cómo nació esta cita de hierro con el sol',
    highlight: false,
  },
  {
    time: '11:52',
    title: 'ECLIPSE ANULAR',
    desc: '7 minutos de anillo de fuego. El dragón de hierro, iluminado desde el cielo.',
    highlight: true,
  },
  {
    time: '13:00',
    title: 'SOL FEST',
    desc: 'Fiesta de cierre: música en vivo, gastronomía patagónica, fotografía, arte y yoga',
    highlight: false,
  },
]

const incluye = [
  { icon: '🍳', title: 'Desayuno Buffet', desc: 'Bienvenida con desayuno patagónico completo' },
  { icon: '🔭', title: 'Guía Astronómica', desc: 'Expertos en astronomía guían la experiencia' },
  { icon: '🗺️', title: 'Kit del Evento', desc: 'Mapas, lentes solares certificados y merchandising' },
  { icon: '🎸', title: 'Sol Fest', desc: 'Música, gastronomía, arte y yoga en la tarde' },
]

export default function ProposalA() {
  const { days, hours, minutes, seconds } = useCountdown(ECLIPSE_DATE)
  const ctaRef = useRef<HTMLDivElement>(null)

  function scrollToCTA() {
    ctaRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <main
      style={{ fontFamily: 'var(--font-body, Inter, sans-serif)', background: '#07080d', color: '#fff', overflowX: 'hidden' }}
    >
      {/* ─── HERO ─────────────────────────────────────────────────── */}
      <section
        style={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', background: '#07080d' }}
      >
        {/* Starfield layer 1 */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: `
            radial-gradient(circle, rgba(255,255,255,0.95) 1px, transparent 1px),
            radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px),
            radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px),
            radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px),
            radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px),
            radial-gradient(circle, rgba(255,255,255,0.7) 1px, transparent 1px),
            radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px),
            radial-gradient(circle, rgba(200,220,255,0.9) 1px, transparent 1px)
          `,
          backgroundSize: '320px 320px, 180px 180px, 440px 440px, 260px 260px, 390px 390px, 150px 150px, 500px 500px, 280px 280px',
          backgroundPosition: '17px 43px, 73px 115px, 140px 57px, 230px 193px, 307px 77px, 55px 200px, 410px 130px, 190px 320px',
        }} />
        {/* Starfield layer 2 — twinkling */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: `
            radial-gradient(circle, rgba(255,255,255,0.85) 1px, transparent 1px),
            radial-gradient(circle, rgba(255,255,255,0.45) 1px, transparent 1px),
            radial-gradient(circle, rgba(200,210,255,0.7) 1px, transparent 1px),
            radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px),
            radial-gradient(circle, rgba(255,255,255,0.35) 1px, transparent 1px),
            radial-gradient(circle, rgba(180,200,255,0.8) 1px, transparent 1px)
          `,
          backgroundSize: '470px 470px, 210px 210px, 360px 360px, 290px 290px, 530px 530px, 170px 170px',
          backgroundPosition: '380px 90px, 120px 340px, 60px 180px, 490px 260px, 240px 420px, 330px 50px',
          animation: 'twinkleA 5s ease-in-out infinite',
        }} />
        {/* Subtle blue nebula glow at top */}
        <div style={{
          position: 'absolute', top: '-10%', left: '50%', transform: 'translateX(-50%)',
          width: '80vw', height: '50vh',
          background: 'radial-gradient(ellipse at center, rgba(29,78,216,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* Eclipse circle */}
        <div style={{ position: 'relative', marginBottom: '2rem', zIndex: 10 }}>
          <div style={{
            width: 120, height: 120,
            borderRadius: '50%',
            background: '#07080d',
            boxShadow: '0 0 0 8px #1a0a02, 0 0 0 12px #c2410c, 0 0 0 18px rgba(220,38,38,0.6), 0 0 40px 20px rgba(220,38,38,0.3), 0 0 80px 40px rgba(220,38,38,0.1)',
            animation: 'eclipsePulse 3s ease-in-out infinite',
            position: 'relative',
            zIndex: 10,
          }} />
        </div>

        {/* Date badge */}
        <div style={{ zIndex: 10, marginBottom: '1rem' }}>
          <span style={{
            display: 'inline-block',
            background: '#1d4ed8',
            color: '#fff',
            fontFamily: 'var(--font-display, Bebas Neue, sans-serif)',
            fontSize: '1.1rem',
            letterSpacing: '0.25em',
            padding: '6px 20px',
            clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)',
          }}>
            6 FEB 2027
          </span>
        </div>

        {/* Main headline */}
        <div style={{ zIndex: 10, textAlign: 'center', lineHeight: 0.9, padding: '0 1rem' }}>
          <div style={{
            fontFamily: 'var(--font-display, Bebas Neue, sans-serif)',
            fontSize: 'clamp(5rem, 20vw, 18rem)',
            letterSpacing: '-0.02em',
            color: '#ffffff',
            textShadow: '0 0 80px rgba(29,78,216,0.4)',
          }}>
            ECLIPSE
          </div>
          <div style={{
            fontFamily: 'var(--font-display, Bebas Neue, sans-serif)',
            fontSize: 'clamp(1.4rem, 4.5vw, 4rem)',
            letterSpacing: '0.35em',
            color: 'rgba(255,255,255,0.55)',
          }}>
            EN PUEBLO CARAO
          </div>
          <div style={{
            marginTop: '1.2rem',
            fontFamily: 'var(--font-display, Bebas Neue, sans-serif)',
            fontSize: 'clamp(1.2rem, 3.5vw, 2.8rem)',
            letterSpacing: '0.2em',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem',
          }}>
            <span style={{ color: '#1d4ed8' }}>UN ECLIPSE</span>
            <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.7em' }}>Y</span>
            <span style={{ color: '#dc2626' }}>UN DRAGÓN</span>
          </div>
        </div>

        {/* CTA */}
        <div style={{ zIndex: 10, marginTop: '2.5rem' }}>
          <button
            onClick={scrollToCTA}
            style={{
              background: '#dc2626',
              color: '#fff',
              fontFamily: 'var(--font-display, Bebas Neue, sans-serif)',
              fontSize: '1.3rem',
              letterSpacing: '0.2em',
              padding: '14px 48px',
              border: 'none',
              cursor: 'pointer',
              clipPath: 'polygon(12px 0%, 100% 0%, calc(100% - 12px) 100%, 0% 100%)',
              transition: 'background 0.2s, box-shadow 0.2s',
              boxShadow: '0 0 30px rgba(220,38,38,0.4)',
            }}
            onMouseEnter={e => { (e.target as HTMLButtonElement).style.background = '#b91c1c'; (e.target as HTMLButtonElement).style.boxShadow = '0 0 50px rgba(220,38,38,0.7)' }}
            onMouseLeave={e => { (e.target as HTMLButtonElement).style.background = '#dc2626'; (e.target as HTMLButtonElement).style.boxShadow = '0 0 30px rgba(220,38,38,0.4)' }}
          >
            RESERVAR MI LUGAR
          </button>
        </div>

        {/* Subtle location note */}
        <div style={{ zIndex: 10, marginTop: '1.5rem', opacity: 0.4, fontSize: '0.75rem', letterSpacing: '0.3em', textTransform: 'uppercase' }}>
          Esquel · Patagonia · Argentina
        </div>

        {/* Bottom gradient fade */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '200px',
          background: 'linear-gradient(to bottom, transparent, #07080d)',
          pointerEvents: 'none',
        }} />

        <style>{`
          @keyframes eclipsePulse {
            0%, 100% { box-shadow: 0 0 0 8px #1a0a02, 0 0 0 12px #c2410c, 0 0 0 18px rgba(220,38,38,0.6), 0 0 40px 20px rgba(220,38,38,0.3), 0 0 80px 40px rgba(220,38,38,0.1); }
            50% { box-shadow: 0 0 0 8px #1a0a02, 0 0 0 14px #dc2626, 0 0 0 22px rgba(220,38,38,0.8), 0 0 60px 30px rgba(220,38,38,0.4), 0 0 100px 60px rgba(220,38,38,0.15); }
          }
          @keyframes twinkleA {
            0%, 100% { opacity: 0.5; }
            50% { opacity: 1; }
          }
        `}</style>
      </section>

      {/* ─── QUOTE SECTION ────────────────────────────────────────── */}
      <section style={{
        background: '#07080d',
        padding: '6rem 1.5rem',
        textAlign: 'center',
        borderTop: '1px solid rgba(29,78,216,0.2)',
        borderBottom: '1px solid rgba(29,78,216,0.2)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          width: '600px', height: '600px',
          background: 'radial-gradient(ellipse at center, rgba(29,78,216,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{ position: 'relative', maxWidth: '900px', margin: '0 auto' }}>
          <div style={{
            fontFamily: 'var(--font-display, Bebas Neue, sans-serif)',
            fontSize: 'clamp(2rem, 6vw, 5rem)',
            lineHeight: 1.05,
            color: '#ffffff',
            marginBottom: '2.5rem',
            letterSpacing: '0.04em',
          }}>
            "CUANDO EL SOL SE APAGUE,
            <br />
            <span style={{ color: '#dc2626' }}>EL DRAGÓN DESPERTARÁ..."</span>
          </div>
          <div style={{ width: '60px', height: '3px', background: '#1d4ed8', margin: '0 auto 2.5rem' }} />
          <p style={{
            fontSize: '1.1rem',
            lineHeight: 1.8,
            color: 'rgba(255,255,255,0.55)',
            maxWidth: '680px',
            margin: '0 auto',
          }}>
            Esquel va a estar en el corredor de un eclipse anular de sol. Habrá muchos
            lugares desde donde verlo — pero solo uno tiene un dragón de hierro con historia
            propia, esperando exactamente este momento. En Pueblo Carao, la Aldea de Montaña,
            el cielo y la tierra se encontrarán por primera vez en mucho tiempo.
          </p>
        </div>
      </section>

      {/* ─── COUNTDOWN ────────────────────────────────────────────── */}
      <section style={{ background: '#07080d', padding: '5rem 1.5rem' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{
            fontFamily: 'var(--font-display, Bebas Neue, sans-serif)',
            fontSize: 'clamp(1.2rem, 3vw, 2rem)',
            letterSpacing: '0.4em',
            color: 'rgba(255,255,255,0.35)',
            marginBottom: '3rem',
          }}>
            FALTA
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '1rem',
          }}>
            {[
              { value: days, label: 'DÍAS' },
              { value: hours, label: 'HORAS' },
              { value: minutes, label: 'MINUTOS' },
              { value: seconds, label: 'SEGUNDOS' },
            ].map(({ value, label }) => (
              <div key={label} style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(29,78,216,0.4)',
                padding: '1.5rem 0.5rem',
                position: 'relative',
                boxShadow: '0 0 20px rgba(29,78,216,0.1), inset 0 0 20px rgba(29,78,216,0.04)',
              }}>
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
                  background: 'linear-gradient(to right, transparent, #1d4ed8, transparent)',
                }} />
                <div style={{
                  fontFamily: 'var(--font-display, Bebas Neue, sans-serif)',
                  fontSize: 'clamp(2.5rem, 8vw, 5rem)',
                  color: '#fff',
                  lineHeight: 1,
                }}>
                  {String(value).padStart(2, '0')}
                </div>
                <div style={{
                  fontFamily: 'var(--font-display, Bebas Neue, sans-serif)',
                  fontSize: '0.75rem',
                  letterSpacing: '0.3em',
                  color: 'rgba(29,78,216,0.9)',
                  marginTop: '0.5rem',
                }}>
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PROGRAMA DEL DÍA ─────────────────────────────────────── */}
      <section style={{ background: '#07080d', padding: '5rem 1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <div style={{
            fontFamily: 'var(--font-display, Bebas Neue, sans-serif)',
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            letterSpacing: '0.15em',
            textAlign: 'center',
            color: '#fff',
            marginBottom: '3.5rem',
          }}>
            PROGRAMA DEL DÍA
          </div>

          <div style={{ position: 'relative' }}>
            {/* Vertical line */}
            <div style={{
              position: 'absolute', left: '90px', top: 0, bottom: 0, width: '1px',
              background: 'linear-gradient(to bottom, transparent, rgba(29,78,216,0.5) 10%, rgba(29,78,216,0.5) 90%, transparent)',
            }} />

            {programa.map((item, i) => (
              <div key={i} style={{
                display: 'flex', gap: '2rem', marginBottom: '2.5rem', position: 'relative',
              }}>
                {/* Time */}
                <div style={{
                  minWidth: '80px', textAlign: 'right', paddingTop: '4px',
                  fontFamily: 'var(--font-display, Bebas Neue, sans-serif)',
                  fontSize: '1.6rem',
                  color: item.highlight ? '#dc2626' : '#1d4ed8',
                  letterSpacing: '0.05em',
                  flexShrink: 0,
                }}>
                  {item.time}
                </div>

                {/* Dot on line */}
                <div style={{
                  position: 'relative', width: '1px', flexShrink: 0,
                }}>
                  <div style={{
                    position: 'absolute', left: '50%', top: '10px', transform: 'translateX(-50%)',
                    width: item.highlight ? '14px' : '8px',
                    height: item.highlight ? '14px' : '8px',
                    borderRadius: '50%',
                    background: item.highlight ? '#dc2626' : '#1d4ed8',
                    boxShadow: item.highlight ? '0 0 12px rgba(220,38,38,0.8)' : '0 0 8px rgba(29,78,216,0.6)',
                    marginLeft: '-1px',
                  }} />
                </div>

                {/* Content */}
                <div style={{
                  flex: 1,
                  background: item.highlight ? 'rgba(220,38,38,0.06)' : 'transparent',
                  border: item.highlight ? '1px solid rgba(220,38,38,0.3)' : '1px solid transparent',
                  padding: item.highlight ? '1rem 1.2rem' : '0 0 0 0',
                  position: 'relative',
                }}>
                  {item.highlight && (
                    <div style={{
                      position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
                      background: 'linear-gradient(to right, #dc2626, transparent)',
                    }} />
                  )}
                  <div style={{
                    fontFamily: 'var(--font-display, Bebas Neue, sans-serif)',
                    fontSize: '1.3rem',
                    letterSpacing: '0.15em',
                    color: item.highlight ? '#fff' : 'rgba(255,255,255,0.85)',
                    marginBottom: '0.3rem',
                  }}>
                    {item.title}
                    {item.highlight && (
                      <span style={{ marginLeft: '0.8rem', color: '#dc2626', fontSize: '0.85em' }}>
                        7 MIN
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 }}>
                    {item.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── QUÉ INCLUYE ──────────────────────────────────────────── */}
      <section style={{ background: '#07080d', padding: '5rem 1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{
            fontFamily: 'var(--font-display, Bebas Neue, sans-serif)',
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            letterSpacing: '0.15em',
            textAlign: 'center',
            color: '#fff',
            marginBottom: '0.5rem',
          }}>
            QUÉ INCLUYE
          </div>
          <div style={{
            textAlign: 'center', color: 'rgba(255,255,255,0.35)', fontSize: '0.85rem',
            letterSpacing: '0.25em', marginBottom: '3rem',
          }}>
            EXPERIENCIA COMPLETA · $300 USD POR PERSONA
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.2rem',
          }}>
            {incluye.map((item, i) => (
              <div key={i} style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.08)',
                padding: '2rem 1.5rem',
                textAlign: 'center',
                transition: 'border-color 0.2s, box-shadow 0.2s',
                cursor: 'default',
                position: 'relative',
                overflow: 'hidden',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLDivElement
                el.style.borderColor = 'rgba(29,78,216,0.5)'
                el.style.boxShadow = '0 0 30px rgba(29,78,216,0.1)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLDivElement
                el.style.borderColor = 'rgba(255,255,255,0.08)'
                el.style.boxShadow = 'none'
              }}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{item.icon}</div>
                <div style={{
                  fontFamily: 'var(--font-display, Bebas Neue, sans-serif)',
                  fontSize: '1.2rem',
                  letterSpacing: '0.1em',
                  color: '#fff',
                  marginBottom: '0.5rem',
                }}>
                  {item.title}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.5 }}>
                  {item.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── UBICACIÓN ────────────────────────────────────────────── */}
      <section style={{
        background: 'linear-gradient(180deg, #07080d 0%, #0a0b14 50%, #07080d 100%)',
        padding: '6rem 1.5rem',
        textAlign: 'center',
        borderTop: '1px solid rgba(255,255,255,0.05)',
      }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <div style={{
            fontFamily: 'var(--font-display, Bebas Neue, sans-serif)',
            fontSize: 'clamp(3rem, 10vw, 7rem)',
            letterSpacing: '0.08em',
            color: '#fff',
            lineHeight: 0.95,
            marginBottom: '0.8rem',
            textShadow: '0 0 60px rgba(29,78,216,0.3)',
          }}>
            PUEBLO<br />CARAO
          </div>
          <div style={{
            fontFamily: 'var(--font-display, Bebas Neue, sans-serif)',
            fontSize: '1.1rem',
            letterSpacing: '0.4em',
            color: '#1d4ed8',
            marginBottom: '2rem',
          }}>
            ALDEA DE MONTAÑA · ESQUEL, PATAGONIA
          </div>
          <div style={{
            display: 'inline-flex', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'center',
          }}>
            {['Rodeado de naturaleza', 'A pasos del bosque', 'Corredor del eclipse anular'].map((tag) => (
              <span key={tag} style={{
                border: '1px solid rgba(29,78,216,0.4)',
                padding: '6px 16px',
                fontSize: '0.75rem',
                letterSpacing: '0.2em',
                color: 'rgba(255,255,255,0.5)',
                textTransform: 'uppercase',
              }}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA FINAL ────────────────────────────────────────────── */}
      <section
        ref={ctaRef}
        id="reservar"
        style={{
          background: '#07080d',
          padding: '7rem 1.5rem',
          textAlign: 'center',
          borderTop: '1px solid rgba(220,38,38,0.2)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
          width: '500px', height: '500px',
          background: 'radial-gradient(ellipse at center, rgba(220,38,38,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{ position: 'relative', maxWidth: '700px', margin: '0 auto' }}>
          <div style={{
            fontFamily: 'var(--font-display, Bebas Neue, sans-serif)',
            fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
            letterSpacing: '0.4em',
            color: 'rgba(255,255,255,0.3)',
            marginBottom: '1rem',
          }}>
            6 DE FEBRERO DE 2027 · ESQUEL, PATAGONIA
          </div>
          <div style={{
            fontFamily: 'var(--font-display, Bebas Neue, sans-serif)',
            fontSize: 'clamp(3rem, 10vw, 6rem)',
            letterSpacing: '0.06em',
            color: '#fff',
            lineHeight: 0.95,
            marginBottom: '1rem',
          }}>
            RESERVAR<br />AHORA
          </div>
          <div style={{
            fontFamily: 'var(--font-display, Bebas Neue, sans-serif)',
            fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
            color: '#dc2626',
            letterSpacing: '0.1em',
            marginBottom: '2.5rem',
          }}>
            $300 USD <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.7em' }}>/ PERSONA</span>
          </div>

          <button
            style={{
              background: '#dc2626',
              color: '#fff',
              fontFamily: 'var(--font-display, Bebas Neue, sans-serif)',
              fontSize: '1.4rem',
              letterSpacing: '0.2em',
              padding: '16px 60px',
              border: 'none',
              cursor: 'pointer',
              clipPath: 'polygon(12px 0%, 100% 0%, calc(100% - 12px) 100%, 0% 100%)',
              boxShadow: '0 0 40px rgba(220,38,38,0.4)',
              transition: 'background 0.2s, box-shadow 0.2s',
              marginBottom: '3rem',
              display: 'block',
              margin: '0 auto 3rem',
            }}
            onMouseEnter={e => { (e.target as HTMLButtonElement).style.background = '#b91c1c'; (e.target as HTMLButtonElement).style.boxShadow = '0 0 60px rgba(220,38,38,0.7)' }}
            onMouseLeave={e => { (e.target as HTMLButtonElement).style.background = '#dc2626'; (e.target as HTMLButtonElement).style.boxShadow = '0 0 40px rgba(220,38,38,0.4)' }}
          >
            RESERVAR MI LUGAR
          </button>

          {/* Partners */}
          <div style={{
            borderTop: '1px solid rgba(255,255,255,0.06)',
            paddingTop: '2rem',
          }}>
            <div style={{ fontSize: '0.7rem', letterSpacing: '0.3em', color: 'rgba(255,255,255,0.2)', marginBottom: '1rem', textTransform: 'uppercase' }}>
              Con el apoyo de
            </div>
            <div style={{
              display: 'flex', gap: '2rem', justifyContent: 'center', alignItems: 'center',
              flexWrap: 'wrap',
            }}>
              {['Pueblo Carao', 'Reina Mora', 'Trama'].map((p, i) => (
                <span key={p} style={{
                  fontFamily: 'var(--font-display, Bebas Neue, sans-serif)',
                  fontSize: '1.1rem',
                  letterSpacing: '0.15em',
                  color: 'rgba(255,255,255,0.25)',
                  display: 'flex', alignItems: 'center', gap: '2rem',
                }}>
                  {p}
                  {i < 2 && <span style={{ color: 'rgba(255,255,255,0.1)', fontSize: '1.5em' }}>·</span>}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer style={{
        background: '#07080d',
        borderTop: '1px solid rgba(255,255,255,0.04)',
        padding: '1.5rem',
        textAlign: 'center',
        fontSize: '0.7rem',
        color: 'rgba(255,255,255,0.18)',
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
      }}>
        PUEBLO CARAO · ALDEA DE MONTAÑA · ESQUEL, PATAGONIA, ARGENTINA
      </footer>
    </main>
  )
}

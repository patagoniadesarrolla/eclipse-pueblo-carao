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
    title: 'Bienvenida',
    desc: 'Desayuno buffet y entrega de mapas y merchandising',
    icon: '☕',
    highlight: false,
  },
  {
    time: '10:00',
    title: 'Presentación',
    desc: 'Historia del dragón y el eclipse',
    icon: '📖',
    highlight: false,
  },
  {
    time: '11:52',
    title: 'Eclipse Anular',
    desc: '7 minutos de anillo de fuego sobre el dragón de hierro',
    icon: '◎',
    highlight: true,
  },
  {
    time: '13:00',
    title: 'Sol Fest',
    desc: 'Música, gastronomía, fotografía, arte y yoga',
    icon: '🎸',
    highlight: false,
  },
]

const incluye = [
  { icon: '🍳', title: 'Desayuno Buffet', desc: 'Bienvenida con desayuno patagónico completo y productos locales' },
  { icon: '🔭', title: 'Guía Astronómica', desc: 'Expertos en astronomía guían la experiencia del eclipse' },
  { icon: '🗺️', title: 'Kit del Evento', desc: 'Mapas, lentes solares certificados y merchandising exclusivo' },
  { icon: '🎸', title: 'Sol Fest', desc: 'Fiesta de cierre con música en vivo, gastronomía y arte' },
]

export default function ProposalB() {
  const { days, hours, minutes, seconds } = useCountdown(ECLIPSE_DATE)
  const ctaRef = useRef<HTMLDivElement>(null)

  function scrollToCTA() {
    ctaRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <main style={{ fontFamily: 'var(--font-body, Inter, sans-serif)', background: '#0a2463', color: '#fff', overflowX: 'hidden' }}>

      {/* ─── HERO ─────────────────────────────────────────────────── */}
      <section style={{
        position: 'relative',
        minHeight: '100vh',
        background: 'linear-gradient(160deg, #1a4a8a 0%, #0a2463 35%, #061540 70%, #03102e 100%)',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
      }}>
        {/* Atmospheric light rays */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: `
            radial-gradient(ellipse 60% 80% at 75% 40%, rgba(194,84,10,0.12) 0%, transparent 60%),
            radial-gradient(ellipse 40% 60% at 75% 40%, rgba(234,148,50,0.08) 0%, transparent 50%)
          `,
        }} />

        {/* Scattered light particles (small dots, not stars — more like dust motes in sunlight) */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: `
            radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px),
            radial-gradient(circle, rgba(194,84,10,0.4) 1px, transparent 1px),
            radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px),
            radial-gradient(circle, rgba(100,180,255,0.5) 1px, transparent 1px),
            radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)
          `,
          backgroundSize: '280px 280px, 430px 430px, 190px 190px, 360px 360px, 510px 510px',
          backgroundPosition: '23px 51px, 88px 140px, 170px 74px, 310px 220px, 60px 290px',
        }} />

        {/* Content — two columns on desktop */}
        <div style={{
          position: 'relative', zIndex: 10,
          width: '100%', maxWidth: '1200px', margin: '0 auto',
          padding: '5rem 2rem',
          display: 'grid',
          gridTemplateColumns: 'minmax(0,1.1fr) minmax(0,0.9fr)',
          gap: '4rem',
          alignItems: 'center',
        }}
        className="hero-grid"
        >
          {/* Left: text */}
          <div>
            {/* Small label */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              marginBottom: '1.5rem',
            }}>
              <div style={{ width: '32px', height: '2px', background: '#c2540a' }} />
              <span style={{
                fontFamily: 'var(--font-display, Bebas Neue, sans-serif)',
                fontSize: '1rem',
                letterSpacing: '0.4em',
                color: '#c2540a',
              }}>
                VIVÍ EL
              </span>
            </div>

            {/* Massive headline */}
            <div style={{
              fontFamily: 'var(--font-display, Bebas Neue, sans-serif)',
              fontSize: 'clamp(5rem, 15vw, 13rem)',
              lineHeight: 0.88,
              letterSpacing: '-0.01em',
              color: '#ffffff',
              marginBottom: '0.5rem',
            }}>
              ECLIPSE
            </div>

            <div style={{
              fontFamily: 'var(--font-display, Bebas Neue, sans-serif)',
              fontSize: 'clamp(1.2rem, 3.5vw, 3rem)',
              letterSpacing: '0.3em',
              color: 'rgba(255,255,255,0.5)',
              marginBottom: '2rem',
            }}>
              EN PUEBLO CARAO
            </div>

            {/* Date badge — outlined style */}
            <div style={{
              display: 'inline-block',
              border: '1px solid rgba(194,84,10,0.7)',
              padding: '8px 20px',
              marginBottom: '2rem',
              position: 'relative',
            }}>
              <div style={{
                position: 'absolute', top: '-1px', left: '-1px', right: '-1px',
                height: '2px', background: 'linear-gradient(to right, #c2540a, transparent)',
              }} />
              <span style={{
                fontFamily: 'var(--font-display, Bebas Neue, sans-serif)',
                fontSize: '1rem',
                letterSpacing: '0.3em',
                color: '#c2540a',
              }}>
                6 DE FEBRERO — 2027
              </span>
            </div>

            <p style={{
              fontSize: '1rem',
              color: 'rgba(255,255,255,0.55)',
              lineHeight: 1.7,
              maxWidth: '480px',
              marginBottom: '2.5rem',
            }}>
              Esquel estará en el corredor del eclipse anular de sol.
              Hay muchos lugares para verlo. Solo uno tiene un dragón de hierro
              esperando exactamente este momento.
            </p>

            <button
              onClick={scrollToCTA}
              style={{
                background: '#c2540a',
                color: '#fff',
                fontFamily: 'var(--font-display, Bebas Neue, sans-serif)',
                fontSize: '1.2rem',
                letterSpacing: '0.2em',
                padding: '14px 44px',
                border: 'none',
                cursor: 'pointer',
                transition: 'background 0.2s, transform 0.15s',
                borderRadius: '2px',
              }}
              onMouseEnter={e => { const el = e.currentTarget; el.style.background = '#a3430a'; el.style.transform = 'translateY(-2px)' }}
              onMouseLeave={e => { const el = e.currentTarget; el.style.background = '#c2540a'; el.style.transform = 'translateY(0)' }}
            >
              RESERVAR MI LUGAR →
            </button>

            <div style={{ marginTop: '1.5rem', fontSize: '0.85rem', color: 'rgba(255,255,255,0.35)' }}>
              Desde $300 USD por persona · Cupos limitados
            </div>
          </div>

          {/* Right: Eclipse graphic */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ position: 'relative', width: '320px', height: '320px' }}>
              {/* Outer atmospheric glow rings */}
              <div style={{
                position: 'absolute', inset: '-60px',
                borderRadius: '50%',
                background: 'radial-gradient(ellipse at center, rgba(194,84,10,0.2) 30%, rgba(194,84,10,0.05) 55%, transparent 70%)',
                animation: 'glowPulseB 4s ease-in-out infinite',
              }} />
              {/* Corona ring */}
              <div style={{
                position: 'absolute', inset: '-20px',
                borderRadius: '50%',
                border: '2px solid rgba(194,84,10,0.3)',
                boxShadow: '0 0 0 6px rgba(194,84,10,0.1), 0 0 60px rgba(194,84,10,0.15)',
              }} />
              {/* Main eclipse circle */}
              <div style={{
                width: '100%', height: '100%',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #0d1f4a 0%, #061232 60%, #03102e 100%)',
                border: '6px solid #c2540a',
                boxShadow: '0 0 0 2px rgba(194,84,10,0.2), 0 0 40px rgba(194,84,10,0.25), inset 0 0 60px rgba(10,36,99,0.5)',
                position: 'relative',
                overflow: 'hidden',
              }}>
                {/* Inner gradient to mimic sun silhouette */}
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'radial-gradient(ellipse at 45% 40%, rgba(194,84,10,0.08) 0%, transparent 60%)',
                }} />
                {/* Center text */}
                <div style={{
                  position: 'absolute', inset: 0,
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                  textAlign: 'center',
                }}>
                  <div style={{
                    fontFamily: 'var(--font-display, Bebas Neue, sans-serif)',
                    fontSize: '3.5rem',
                    color: '#c2540a',
                    lineHeight: 1,
                    letterSpacing: '0.05em',
                  }}>
                    11:52
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-display, Bebas Neue, sans-serif)',
                    fontSize: '0.75rem',
                    letterSpacing: '0.3em',
                    color: 'rgba(255,255,255,0.4)',
                    marginTop: '0.3rem',
                  }}>
                    ANILLO DE FUEGO
                  </div>
                  <div style={{
                    width: '40px', height: '1px',
                    background: 'rgba(194,84,10,0.5)',
                    margin: '0.8rem auto',
                  }} />
                  <div style={{
                    fontFamily: 'var(--font-display, Bebas Neue, sans-serif)',
                    fontSize: '0.65rem',
                    letterSpacing: '0.25em',
                    color: 'rgba(255,255,255,0.25)',
                  }}>
                    7 MINUTOS
                  </div>
                </div>
              </div>
              {/* Decorative tick marks around ring */}
              {[0, 60, 120, 180, 240, 300].map((deg) => (
                <div key={deg} style={{
                  position: 'absolute', top: '50%', left: '50%',
                  width: '2px', height: '14px',
                  background: 'rgba(194,84,10,0.4)',
                  transformOrigin: '50% 0',
                  transform: `rotate(${deg}deg) translateX(-50%) translateY(-180px)`,
                }} />
              ))}
            </div>
          </div>
        </div>

        {/* Bottom mountain silhouette */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '120px', pointerEvents: 'none',
          background: 'linear-gradient(to top, #0a2463, transparent)',
        }}>
          <svg viewBox="0 0 1440 120" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none"
            style={{ position: 'absolute', bottom: 0, width: '100%', height: '100%' }}>
            <path d="M0,120 L0,80 L120,40 L240,65 L360,20 L480,55 L600,30 L720,70 L840,25 L960,60 L1080,35 L1200,70 L1320,45 L1440,80 L1440,120 Z"
              fill="rgba(10,36,99,0.6)" />
            <path d="M0,120 L0,95 L180,55 L360,80 L540,50 L720,90 L900,55 L1080,85 L1260,60 L1440,90 L1440,120 Z"
              fill="rgba(6,21,64,0.7)" />
          </svg>
        </div>

        <style>{`
          @keyframes glowPulseB {
            0%, 100% { transform: scale(1); opacity: 0.7; }
            50% { transform: scale(1.05); opacity: 1; }
          }
          @media (max-width: 768px) {
            .hero-grid {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
      </section>

      {/* ─── STORY SECTION ────────────────────────────────────────── */}
      <section style={{
        background: 'linear-gradient(180deg, #0a2463 0%, #0d2d75 100%)',
        padding: '6rem 2rem',
        borderTop: '1px solid rgba(194,84,10,0.15)',
      }}>
        <div style={{
          maxWidth: '1100px', margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '5rem',
          alignItems: 'start',
        }}
        className="story-grid"
        >
          {/* Left: big quote */}
          <div>
            <div style={{
              fontFamily: 'var(--font-display, Bebas Neue, sans-serif)',
              fontSize: 'clamp(2.2rem, 5vw, 4rem)',
              lineHeight: 1.05,
              color: '#fff',
              letterSpacing: '0.04em',
            }}>
              "CUANDO EL SOL SE APAGUE,
            </div>
            <div style={{
              fontFamily: 'var(--font-display, Bebas Neue, sans-serif)',
              fontSize: 'clamp(2.2rem, 5vw, 4rem)',
              lineHeight: 1.05,
              color: '#c2540a',
              letterSpacing: '0.04em',
              marginBottom: '2rem',
            }}>
              EL DRAGÓN DESPERTARÁ..."
            </div>
            <div style={{ width: '48px', height: '3px', background: '#c2540a', marginBottom: '2rem' }} />
            <div style={{
              fontFamily: 'var(--font-display, Bebas Neue, sans-serif)',
              fontSize: '0.85rem',
              letterSpacing: '0.3em',
              color: 'rgba(255,255,255,0.35)',
            }}>
              PUEBLO CARAO · ALDEA DE MONTAÑA
            </div>
          </div>

          {/* Right: story text */}
          <div>
            <p style={{
              fontSize: '1.05rem',
              lineHeight: 1.85,
              color: 'rgba(255,255,255,0.65)',
              marginBottom: '1.5rem',
            }}>
              Esquel va a estar en el corredor de un eclipse anular de sol. Habrá muchos
              lugares desde donde verlo — pero solo uno tiene un dragón de hierro con
              historia propia, esperando exactamente este momento.
            </p>
            <p style={{
              fontSize: '1.05rem',
              lineHeight: 1.85,
              color: 'rgba(255,255,255,0.65)',
              marginBottom: '2rem',
            }}>
              En Pueblo Carao, la Aldea de Montaña en el corazón de la Patagonia,
              la escultura de hierro y el cielo se encontrarán por primera vez en mucho
              tiempo. Un evento único, una cita que llevaba años anunciada sin saberlo.
            </p>
            <div style={{
              display: 'flex', gap: '2.5rem', flexWrap: 'wrap',
            }}>
              {[['1', 'Dragón de hierro'], ['7', 'minutos de anillo'], ['2027', 'el año del eclipse']].map(([num, label]) => (
                <div key={label}>
                  <div style={{
                    fontFamily: 'var(--font-display, Bebas Neue, sans-serif)',
                    fontSize: '2.5rem',
                    color: '#c2540a',
                    lineHeight: 1,
                  }}>{num}</div>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em' }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <style>{`
          @media (max-width: 768px) {
            .story-grid { grid-template-columns: 1fr !important; gap: 2.5rem !important; }
          }
        `}</style>
      </section>

      {/* ─── COUNTDOWN ────────────────────────────────────────────── */}
      <section style={{
        background: '#0a2463',
        padding: '5rem 2rem',
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{ maxWidth: '860px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{
            fontFamily: 'var(--font-display, Bebas Neue, sans-serif)',
            fontSize: 'clamp(1.2rem, 3vw, 1.8rem)',
            letterSpacing: '0.5em',
            color: '#c2540a',
            marginBottom: '3rem',
          }}>
            CUENTA REGRESIVA
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
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(194,84,10,0.35)',
                padding: '1.5rem 0.5rem',
                borderRadius: '4px',
                position: 'relative',
                overflow: 'hidden',
              }}>
                {/* Warm gradient top accent */}
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
                  background: 'linear-gradient(to right, #c2540a, rgba(194,84,10,0.2))',
                }} />
                <div style={{
                  fontFamily: 'var(--font-display, Bebas Neue, sans-serif)',
                  fontSize: 'clamp(2.5rem, 8vw, 5rem)',
                  color: '#ffffff',
                  lineHeight: 1,
                }}>
                  {String(value).padStart(2, '0')}
                </div>
                <div style={{
                  fontFamily: 'var(--font-display, Bebas Neue, sans-serif)',
                  fontSize: '0.75rem',
                  letterSpacing: '0.3em',
                  color: 'rgba(194,84,10,0.8)',
                  marginTop: '0.5rem',
                }}>
                  {label}
                </div>
              </div>
            ))}
          </div>
          <div style={{
            marginTop: '2rem',
            fontSize: '0.8rem',
            color: 'rgba(255,255,255,0.25)',
            letterSpacing: '0.2em',
          }}>
            6 FEBRERO 2027 · 11:52 HS · ESQUEL, PATAGONIA
          </div>
        </div>
      </section>

      {/* ─── PROGRAMA ─────────────────────────────────────────────── */}
      <section style={{
        background: 'linear-gradient(180deg, #0a2463 0%, #0d2d75 100%)',
        padding: '5rem 2rem',
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
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

          {/* Horizontal timeline (cards) */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '0',
            position: 'relative',
          }}
          className="timeline-grid"
          >
            {/* Connecting line */}
            <div style={{
              position: 'absolute', top: '48px', left: '12.5%', right: '12.5%', height: '1px',
              background: 'linear-gradient(to right, transparent, rgba(194,84,10,0.4) 15%, rgba(194,84,10,0.4) 85%, transparent)',
            }} />

            {programa.map((item, i) => (
              <div key={i} style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                padding: '0 1rem',
                position: 'relative',
              }}>
                {/* Icon/dot node */}
                <div style={{
                  width: item.highlight ? '56px' : '40px',
                  height: item.highlight ? '56px' : '40px',
                  borderRadius: '50%',
                  background: item.highlight
                    ? 'linear-gradient(135deg, #c2540a, #8a3500)'
                    : 'rgba(10,36,99,1)',
                  border: item.highlight
                    ? '2px solid #c2540a'
                    : '1px solid rgba(194,84,10,0.35)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: item.highlight ? '1.4rem' : '1.1rem',
                  marginBottom: '1.2rem',
                  flexShrink: 0,
                  zIndex: 2,
                  boxShadow: item.highlight ? '0 0 20px rgba(194,84,10,0.4)' : 'none',
                  transition: 'transform 0.2s',
                }}>
                  {item.icon}
                </div>

                {/* Card */}
                <div style={{
                  background: item.highlight
                    ? 'linear-gradient(160deg, rgba(194,84,10,0.15), rgba(194,84,10,0.05))'
                    : 'rgba(255,255,255,0.04)',
                  border: item.highlight
                    ? '1px solid rgba(194,84,10,0.5)'
                    : '1px solid rgba(255,255,255,0.08)',
                  padding: '1.2rem',
                  borderRadius: '4px',
                  width: '100%',
                  textAlign: 'center',
                }}>
                  <div style={{
                    fontFamily: 'var(--font-display, Bebas Neue, sans-serif)',
                    fontSize: '1.6rem',
                    color: item.highlight ? '#c2540a' : 'rgba(255,255,255,0.5)',
                    letterSpacing: '0.05em',
                    marginBottom: '0.2rem',
                  }}>
                    {item.time} hs
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-display, Bebas Neue, sans-serif)',
                    fontSize: '1rem',
                    letterSpacing: '0.1em',
                    color: '#fff',
                    marginBottom: '0.5rem',
                  }}>
                    {item.title}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.5 }}>
                    {item.desc}
                  </div>
                  {item.highlight && (
                    <div style={{
                      marginTop: '0.8rem',
                      display: 'inline-block',
                      background: 'rgba(194,84,10,0.2)',
                      border: '1px solid rgba(194,84,10,0.4)',
                      padding: '3px 10px',
                      fontSize: '0.65rem',
                      letterSpacing: '0.2em',
                      color: '#c2540a',
                    }}>
                      7 MINUTOS
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        <style>{`
          @media (max-width: 768px) {
            .timeline-grid { grid-template-columns: 1fr 1fr !important; }
          }
          @media (max-width: 480px) {
            .timeline-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </section>

      {/* ─── QUÉ INCLUYE ──────────────────────────────────────────── */}
      <section style={{
        background: '#0a2463',
        padding: '5rem 2rem',
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.5rem',
            marginBottom: '0.5rem',
          }}>
            <div style={{ height: '1px', flex: 1, background: 'rgba(194,84,10,0.3)' }} />
            <div style={{
              fontFamily: 'var(--font-display, Bebas Neue, sans-serif)',
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              letterSpacing: '0.15em',
              color: '#fff',
            }}>
              QUÉ INCLUYE
            </div>
            <div style={{ height: '1px', flex: 1, background: 'rgba(194,84,10,0.3)' }} />
          </div>
          <div style={{
            textAlign: 'center', marginBottom: '3rem',
            fontFamily: 'var(--font-display, Bebas Neue, sans-serif)',
            fontSize: '1rem',
            letterSpacing: '0.35em',
            color: '#c2540a',
          }}>
            $300 USD · EXPERIENCIA COMPLETA
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
            gap: '1.5rem',
          }}>
            {incluye.map((item, i) => (
              <div key={i} style={{
                background: 'linear-gradient(160deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))',
                border: '1px solid rgba(194,84,10,0.25)',
                borderTop: '3px solid #c2540a',
                padding: '2rem 1.5rem',
                borderRadius: '2px',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={e => { const el = e.currentTarget; el.style.transform = 'translateY(-4px)'; el.style.boxShadow = '0 12px 40px rgba(0,0,0,0.3)' }}
              onMouseLeave={e => { const el = e.currentTarget; el.style.transform = 'translateY(0)'; el.style.boxShadow = 'none' }}
              >
                <div style={{ fontSize: '2.2rem', marginBottom: '1rem' }}>{item.icon}</div>
                <div style={{
                  fontFamily: 'var(--font-display, Bebas Neue, sans-serif)',
                  fontSize: '1.2rem',
                  letterSpacing: '0.1em',
                  color: '#fff',
                  marginBottom: '0.5rem',
                }}>
                  {item.title}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 }}>
                  {item.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── UBICACIÓN ────────────────────────────────────────────── */}
      <section style={{
        background: 'linear-gradient(180deg, #0a2463 0%, #061540 100%)',
        padding: '6rem 2rem',
        textAlign: 'center',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Mountain silhouette via clip-path */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '160px',
          background: 'rgba(6,21,64,0.8)',
          clipPath: 'polygon(0% 100%, 0% 60%, 5% 55%, 10% 42%, 15% 38%, 20% 50%, 25% 45%, 30% 30%, 35% 22%, 40% 35%, 45% 28%, 50% 15%, 55% 28%, 60% 22%, 65% 35%, 70% 30%, 75% 45%, 80% 38%, 85% 50%, 90% 42%, 95% 55%, 100% 60%, 100% 100%)',
          pointerEvents: 'none',
        }} />
        {/* Snow caps layer */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '160px',
          background: 'rgba(255,255,255,0.04)',
          clipPath: 'polygon(30% 100%, 33% 28%, 35% 24%, 36% 26%, 37% 22%, 38% 20%, 40% 28%, 41% 26%, 43% 24%, 45% 30%, 46% 26%, 48% 25%, 49% 22%, 50% 20%, 51% 22%, 52% 20%, 53% 22%, 55% 26%, 56% 30%, 60% 100%)',
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', maxWidth: '600px', margin: '0 auto', paddingBottom: '120px' }}>
          <div style={{
            display: 'inline-block',
            border: '1px solid rgba(194,84,10,0.3)',
            padding: '4px 16px',
            marginBottom: '1.5rem',
          }}>
            <span style={{
              fontFamily: 'var(--font-display, Bebas Neue, sans-serif)',
              fontSize: '0.75rem',
              letterSpacing: '0.4em',
              color: '#c2540a',
            }}>
              PATAGONIA ARGENTINA
            </span>
          </div>
          <div style={{
            fontFamily: 'var(--font-display, Bebas Neue, sans-serif)',
            fontSize: 'clamp(3.5rem, 12vw, 8rem)',
            lineHeight: 0.9,
            letterSpacing: '0.05em',
            color: '#fff',
            marginBottom: '1rem',
            textShadow: '0 4px 40px rgba(10,36,99,0.8)',
          }}>
            PUEBLO<br />CARAO
          </div>
          <div style={{
            fontFamily: 'var(--font-display, Bebas Neue, sans-serif)',
            fontSize: '1rem',
            letterSpacing: '0.4em',
            color: 'rgba(255,255,255,0.4)',
            marginBottom: '2rem',
          }}>
            ALDEA DE MONTAÑA · ESQUEL
          </div>
          <div style={{
            display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap',
          }}>
            {['Bosque patagónico', 'Corredor del eclipse', 'Aldea de montaña'].map((tag) => (
              <span key={tag} style={{
                background: 'rgba(194,84,10,0.1)',
                border: '1px solid rgba(194,84,10,0.3)',
                padding: '5px 14px',
                fontSize: '0.75rem',
                letterSpacing: '0.15em',
                color: 'rgba(194,84,10,0.8)',
                borderRadius: '2px',
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
          background: 'linear-gradient(160deg, #1a4a8a 0%, #0a2463 50%, #061540 100%)',
          padding: '7rem 2rem',
          textAlign: 'center',
          borderTop: '1px solid rgba(194,84,10,0.2)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Warm glow behind CTA */}
        <div style={{
          position: 'absolute', bottom: '-20%', left: '50%', transform: 'translateX(-50%)',
          width: '600px', height: '400px',
          background: 'radial-gradient(ellipse at center, rgba(194,84,10,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', maxWidth: '680px', margin: '0 auto' }}>
          {/* Pre-heading */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.6rem',
            marginBottom: '1.5rem',
          }}>
            <div style={{ width: '24px', height: '1px', background: '#c2540a' }} />
            <span style={{
              fontFamily: 'var(--font-display, Bebas Neue, sans-serif)',
              fontSize: '0.9rem',
              letterSpacing: '0.4em',
              color: '#c2540a',
            }}>
              CUPOS LIMITADOS
            </span>
            <div style={{ width: '24px', height: '1px', background: '#c2540a' }} />
          </div>

          <div style={{
            fontFamily: 'var(--font-display, Bebas Neue, sans-serif)',
            fontSize: 'clamp(3rem, 10vw, 6.5rem)',
            lineHeight: 0.9,
            color: '#fff',
            marginBottom: '1.2rem',
            letterSpacing: '0.02em',
          }}>
            RESERVÁ<br />TU LUGAR
          </div>

          <div style={{
            fontSize: '1.1rem',
            color: 'rgba(255,255,255,0.55)',
            marginBottom: '0.5rem',
          }}>
            6 de febrero de 2027 · Pueblo Carao, Esquel
          </div>
          <div style={{
            fontFamily: 'var(--font-display, Bebas Neue, sans-serif)',
            fontSize: '2.2rem',
            color: '#c2540a',
            letterSpacing: '0.05em',
            marginBottom: '3rem',
          }}>
            $300 USD <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.65em', letterSpacing: '0.1em' }}>por persona</span>
          </div>

          <button
            style={{
              background: 'linear-gradient(135deg, #c2540a, #a3430a)',
              color: '#fff',
              fontFamily: 'var(--font-display, Bebas Neue, sans-serif)',
              fontSize: '1.3rem',
              letterSpacing: '0.2em',
              padding: '16px 60px',
              border: 'none',
              cursor: 'pointer',
              borderRadius: '2px',
              transition: 'opacity 0.2s, transform 0.15s',
              boxShadow: '0 8px 32px rgba(194,84,10,0.35)',
              display: 'block',
              margin: '0 auto 1rem',
            }}
            onMouseEnter={e => { const el = e.currentTarget; el.style.opacity = '0.9'; el.style.transform = 'translateY(-3px)' }}
            onMouseLeave={e => { const el = e.currentTarget; el.style.opacity = '1'; el.style.transform = 'translateY(0)' }}
          >
            RESERVAR AHORA
          </button>

          <div style={{
            fontSize: '0.8rem',
            color: 'rgba(255,255,255,0.3)',
            marginBottom: '4rem',
            letterSpacing: '0.1em',
          }}>
            Experiencia todo incluido · Cupos limitados
          </div>

          {/* Partners */}
          <div style={{
            borderTop: '1px solid rgba(255,255,255,0.08)',
            paddingTop: '2.5rem',
          }}>
            <div style={{
              fontSize: '0.7rem', letterSpacing: '0.3em',
              color: 'rgba(255,255,255,0.2)',
              marginBottom: '1.2rem',
              textTransform: 'uppercase',
            }}>
              Con el apoyo de
            </div>
            <div style={{
              display: 'flex', gap: '0', justifyContent: 'center', alignItems: 'center',
              flexWrap: 'wrap',
            }}>
              {['Pueblo Carao', 'Reina Mora', 'Trama'].map((p, i, arr) => (
                <span key={p} style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{
                    fontFamily: 'var(--font-display, Bebas Neue, sans-serif)',
                    fontSize: '1rem',
                    letterSpacing: '0.15em',
                    color: 'rgba(255,255,255,0.3)',
                    padding: '0 1rem',
                  }}>
                    {p}
                  </span>
                  {i < arr.length - 1 && (
                    <span style={{ color: 'rgba(194,84,10,0.3)', fontSize: '1.2rem' }}>·</span>
                  )}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer style={{
        background: '#03102e',
        borderTop: '1px solid rgba(194,84,10,0.1)',
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

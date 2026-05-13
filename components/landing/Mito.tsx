'use client'

import { useScrollReveal } from '@/lib/useScrollReveal'

const DATOS = [
  {
    label: 'Caput Draconis',
    value: 'Cabeza del Dragón',
    desc: 'El nodo lunar norte — el único punto del cielo donde el dragón puede devorar el Sol. El 6 de febrero de 2027 estará sobre Esquel.',
  },
  {
    label: 'Mes dracónico',
    value: '27,21 días',
    desc: 'El ciclo que mide el tiempo entre cada paso de la Luna por el mismo nodo. La astronomía moderna conservó el nombre del mito.',
  },
  {
    label: 'Ciclo de Saros',
    value: '18 años · 11 días',
    desc: 'El ciclo que permite predecir eclipses con precisión milimétrica. Se calcula combinando el mes dracónico con otros dos ciclos lunares.',
  },
]

export default function Mito() {
  const { ref, visible } = useScrollReveal()

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
            Por qué aquí · Por qué ahora
          </p>
          <h2 className={`reveal reveal-d1 text-3xl md:text-5xl font-bold text-white uppercase tracking-tight mb-6 ${visible ? 'in-view' : ''}`}>
            El mito del dragón<br className="hidden md:block" /> no es decorativo
          </h2>
          <p className={`reveal reveal-d2 text-base md:text-lg max-w-2xl mx-auto leading-relaxed ${visible ? 'in-view' : ''}`}
            style={{ color: 'rgba(255,255,255,0.55)' }}>
            Desde Babilonia, la India, el mundo árabe y la Europa medieval, los astrónomos llamaron a los nodos lunares{' '}
            <em style={{ color: 'rgba(255,255,255,0.8)', fontStyle: 'normal', fontWeight: 600 }}>Caput Draconis</em> y{' '}
            <em style={{ color: 'rgba(255,255,255,0.8)', fontStyle: 'normal', fontWeight: 600 }}>Cauda Draconis</em>
            {' '}—Cabeza y Cola del Dragón—. Los eclipses solo ocurren en esos puntos, porque son la única intersección entre la órbita del Sol y la de la Luna. Cuando ambos astros se alinean cerca de esos nodos, el dragón los devora.
          </p>
        </div>

        {/* Cita */}
        <blockquote className="text-center mb-16 px-4">
          <p className="text-xl md:text-2xl font-bold italic leading-relaxed"
            style={{ color: 'rgba(255,255,255,0.85)' }}>
            "La astronomía moderna cambió el mito por la geometría,<br className="hidden md:block" />
            pero conservó el nombre."
          </p>
        </blockquote>

        {/* Cards de datos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {DATOS.map(({ label, value, desc }, i) => {
            const { ref: r, visible: v } = useScrollReveal(0.15)
            return (
              <div key={label} ref={r}
                className={`reveal reveal-d${i + 1} rounded-2xl p-6 ${v ? 'in-view' : ''}`}
                style={{
                  background: 'rgba(220,38,38,0.04)',
                  border: '1px solid rgba(220,38,38,0.18)',
                }}>
                <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: '#dc2626' }}>
                  {label}
                </p>
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
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>
              El 6 de febrero de 2027, al mediodía
            </p>
            <p className="text-lg md:text-xl font-bold text-white leading-snug text-center">
              La Cabeza del Dragón estará sobre el cielo de Esquel.
            </p>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>
              Y en Pueblo Carao hay un dragón de hierro esperando exactamente este momento.
            </p>
          </div>
        </div>

      </div>
    </section>
  )
}

import { LandingSettings } from '@/types'
import { hexToRgba } from '@/lib/colors'

const HISTORIA = [
  {
    label: 'Raíces galesas',
    text: 'A finales del siglo XIX, colonos galeses llegaron a la Patagonia buscando preservar su lengua y cultura. Fundaron Esquel y los valles del Chubut. Pueblo Carao es heredero directo de esa historia: un lugar construido a mano, con identidad propia, en el mismo suelo que eligieron.',
  },
  {
    label: 'El dragón de hierro',
    text: 'En la tradición galesa, el dragón rojo es el símbolo nacional — el Y Ddraig Goch de la bandera. En Pueblo Carao hay una escultura de hierro que lleva años en pie. No fue construida para el eclipse. Pero el eclipse la encuentra exactamente donde tiene que estar.',
  },
  {
    label: 'El corredor del eclipse',
    text: 'El 6 de febrero de 2027, el corredor del eclipse anular pasa sobre Esquel. Habrá muchos lugares para ver el anillo. Solo uno tiene un dragón galés de hierro, con historia de siglos, debajo de la Cabeza del Dragón celeste.',
  },
]

export default function Location({ settings }: { settings: LandingSettings }) {
  const primary = settings.primary_color
  const secondary = settings.secondary_color

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
            El lugar
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-5 leading-tight uppercase tracking-tight">
            Pueblo Carao,<br />
            <span style={{ color: primary }}>Esquel</span>
          </h2>
          <p className="text-base md:text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Una aldea de montaña en la Patagonia argentina con raíces galesas, un dragón de hierro y el eclipse anular de 2027 pasando directamente sobre ella.
          </p>
        </div>

        {/* Historia en tres bloques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-14">
          {HISTORIA.map(({ label, text }) => (
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
            {[
              { value: '6 FEB', label: '2027 · día del eclipse', color: '#dc2626' },
              { value: '7 min', label: 'de anillo de fuego', color: primary },
              { value: '40', label: 'personas máximo', color: secondary },
              { value: '1', label: 'dragón de hierro', color: '#dc2626' },
            ].map(({ value, label, color }) => (
              <div key={label}>
                <p className="text-3xl md:text-4xl font-bold mb-1 uppercase" style={{ color }}>{value}</p>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{label}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}

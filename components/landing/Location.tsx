import { LandingSettings } from '@/types'
import { hexToRgba } from '@/lib/colors'

export default function Location({ settings }: { settings: LandingSettings }) {
  const primary = settings.primary_color
  const secondary = settings.secondary_color

  return (
    <section className="py-24 px-6 relative overflow-hidden" style={{ background: '#050508' }}>
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none"
        aria-hidden="true"
        style={{
          width: '500px',
          height: '500px',
          background: `radial-gradient(circle, ${hexToRgba(secondary, 0.07)} 0%, transparent 65%)`,
          filter: 'blur(80px)',
        }}
      />

      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase mb-5" style={{ color: secondary, letterSpacing: '0.25em' }}>
              El lugar
            </p>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 leading-tight">
              Pueblo Carao,<br />
              <span style={{ color: primary }}>Lago Puelo</span>
            </h2>
            <div className="space-y-5 leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
              <p>Anidado entre bosques de arrayanes y cipreses, a orillas del Lago Puelo en el noroeste patagónico, Pueblo Carao es uno de los sitios con menor contaminación lumínica de toda Argentina.</p>
              <p>Sus cielos despejados más de 300 noches al año, combinados con una altitud que elimina la neblina costera, lo convierten en el escenario perfecto para presenciar el eclipse total de 2027.</p>
              <p>El silencio de la montaña, el reflejo plateado del lago y la inmensidad del universo sobre tu cabeza: una experiencia que no se puede describir, solo vivir.</p>
            </div>
          </div>

          <div
            className="rounded-3xl p-10 flex flex-col items-center text-center"
            style={{
              background: `linear-gradient(145deg, ${hexToRgba(primary, 0.12)}, ${hexToRgba(secondary, 0.06)})`,
              border: `1px solid ${hexToRgba(primary, 0.18)}`,
            }}
          >
            <div className="text-7xl mb-5">🏔️</div>
            <p className="text-2xl font-bold text-white mb-1">Lago Puelo</p>
            <p className="text-sm mb-8" style={{ color: 'rgba(255,255,255,0.4)' }}>Chubut · Patagonia Argentina</p>

            <div className="grid grid-cols-2 gap-6 w-full">
              {[
                { value: '800m', label: 'sobre el nivel del mar', color: secondary },
                { value: '300+', label: 'noches estrelladas/año', color: primary },
                { value: '40', label: 'personas máximo', color: secondary },
                { value: '180+', label: 'años sin eclipse aquí', color: primary },
              ].map(({ value, label, color }) => (
                <div key={label} className="rounded-xl p-4" style={{ background: 'rgba(0,0,0,0.25)' }}>
                  <p className="text-3xl font-bold mb-1" style={{ color }}>{value}</p>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

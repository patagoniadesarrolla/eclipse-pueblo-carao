import { LandingSettings } from '@/types'
import { hexToRgba } from '@/lib/colors'

export default function Location({ settings }: { settings: LandingSettings }) {
  const primary = settings.primary_color
  const secondary = settings.secondary_color

  return (
    <section className="py-24 px-6 relative overflow-hidden" style={{ background: 'var(--c-bg-alt)' }}>
      <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true"
        style={{
          width: '500px', height: '500px',
          background: `radial-gradient(circle, ${hexToRgba(secondary, 0.07)} 0%, transparent 65%)`,
          filter: 'blur(80px)',
        }} />

      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-xs font-bold tracking-[0.3em] uppercase mb-5" style={{ color: secondary }}>
              El lugar
            </p>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 leading-tight uppercase tracking-tight">
              Pueblo Carao,<br />
              <span style={{ color: primary }}>Esquel</span>
            </h2>
            <div className="space-y-5 leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
              <p>
                Pueblo Carao es una aldea de montaña en las afueras de Esquel, Patagonia. Un lugar único donde vive el dragón de hierro — la escultura que lleva años esperando exactamente este momento.
              </p>
              <p>
                El 6 de febrero de 2027, Esquel estará en el corredor del eclipse anular de sol. Habrá muchos lugares para verlo. Solo uno tiene un dragón de hierro con historia propia.
              </p>
              <p className="font-semibold uppercase tracking-wide text-sm" style={{ color: '#dc2626' }}>
                Cuando el sol se apague, el dragón despertará.
              </p>
            </div>
          </div>

          <div className="rounded-3xl p-10 flex flex-col items-center text-center"
            style={{
              background: `linear-gradient(145deg, ${hexToRgba(primary, 0.12)}, ${hexToRgba(secondary, 0.06)})`,
              border: `1px solid ${hexToRgba(primary, 0.18)}`,
            }}>
            <div className="text-7xl mb-5">🐉</div>
            <p className="text-2xl font-bold text-white mb-1 uppercase tracking-wide">Pueblo Carao</p>
            <p className="text-sm mb-8" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Aldea de Montaña · Esquel, Chubut
            </p>

            <div className="grid grid-cols-2 gap-6 w-full">
              {[
                { value: '6 FEB', label: '2027 · día del eclipse', color: '#dc2626' },
                { value: '7 min', label: 'de anillo de fuego', color: primary },
                { value: '40', label: 'personas máximo', color: secondary },
                { value: '1', label: 'dragón de hierro', color: '#dc2626' },
              ].map(({ value, label, color }) => (
                <div key={label} className="rounded-xl p-4" style={{ background: 'rgba(0,0,0,0.25)' }}>
                  <p className="text-2xl font-bold mb-1 uppercase" style={{ color }}>{value}</p>
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

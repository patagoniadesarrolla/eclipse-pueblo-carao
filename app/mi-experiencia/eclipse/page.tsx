export const dynamic = 'force-dynamic'

const TIMELINE = [
  { time: '11:30', label: 'Primer contacto',   desc: 'La Luna comienza a cubrir el disco solar. Empieza la fase parcial.' },
  { time: '11:50', label: 'Segundo contacto',  desc: 'El anillo de fuego es completo. Comienza la anularidad.' },
  { time: '11:52', label: 'Máximo eclipse',    desc: '7 minutos del anillo de fuego en su punto más centrado.', highlight: true },
  { time: '11:59', label: 'Tercer contacto',   desc: 'El anillo se rompe. La Luna continúa su tránsito.' },
  { time: '12:20', label: 'Cuarto contacto',   desc: 'La Luna abandona el disco solar. El eclipse concluye.' },
]

const GALLERY_IMAGES = [
  'patagonia+night+sky',
  'eclipse+solar+ring',
  'patagonia+mountains+stars',
  'solar+eclipse+corona',
  'patagonia+landscape+night',
  'eclipse+ring+of+fire',
]

export default function EclipsePage() {
  return (
    <div className="px-6 py-10 max-w-2xl mx-auto">

      {/* Header */}
      <div className="mb-12">
        <p className="text-xs font-bold uppercase tracking-[0.2em] mb-3" style={{ color: '#dc2626' }}>
          El fenómeno
        </p>
        <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
          El eclipse anular del dragón
        </h1>
        <p className="text-base md:text-lg leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
          Un eclipse anular ocurre cuando la Luna pasa exactamente delante del Sol, pero su distancia a la Tierra
          en ese momento hace que su disco aparente sea ligeramente menor que el del Sol. El resultado es que
          el Sol no queda completamente tapado: se forma un anillo de luz —el "anillo de fuego"— que rodea
          la silueta oscura de la Luna.
        </p>
        <p className="mt-4 text-base md:text-lg leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
          A diferencia del eclipse total, en el anular la luz no desaparece del todo. Pero el cielo
          cambia de tonalidad, la temperatura baja abruptamente, los animales se comportan como si
          anocheciera. Y el anillo en el cielo es uno de los objetos más extraños que un ojo humano
          puede ver en condiciones naturales.
        </p>
      </div>

      {/* Dato destacado */}
      <div className="mb-12 p-8 rounded-2xl text-center" style={{ background: 'rgba(220,38,38,0.07)', border: '1px solid rgba(220,38,38,0.2)' }}>
        <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#dc2626' }}>Anularidad</p>
        <p className="text-4xl md:text-5xl font-bold text-white mb-2">7 minutos</p>
        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>de anillo de fuego sobre Esquel el 6 de febrero de 2027</p>
      </div>

      {/* Timeline */}
      <div className="mb-12">
        <h2 className="text-white font-bold text-lg uppercase tracking-wide mb-6">El momento exacto</h2>
        <div className="space-y-1">
          {TIMELINE.map(({ time, label, desc, highlight }) => (
            <div
              key={time}
              className="flex gap-4 p-4 rounded-xl"
              style={{
                background: highlight ? 'rgba(220,38,38,0.07)' : 'rgba(255,255,255,0.025)',
                border: `1px solid ${highlight ? 'rgba(220,38,38,0.25)' : 'rgba(255,255,255,0.06)'}`,
              }}
            >
              <span
                className="font-bold tabular-nums text-sm flex-shrink-0 pt-0.5 font-mono"
                style={{ color: highlight ? '#dc2626' : 'rgba(124,58,237,0.7)', minWidth: '44px' }}
              >
                {time}
              </span>
              <div>
                <p className={`font-bold text-sm mb-0.5 ${highlight ? 'text-white' : 'text-white/80'}`}>{label}</p>
                <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pueblo Carao */}
      <div className="mb-12">
        <h2 className="text-white font-bold text-lg uppercase tracking-wide mb-4">Pueblo Carao · Esquel</h2>
        <p className="text-base leading-relaxed mb-4" style={{ color: 'rgba(255,255,255,0.6)' }}>
          Esquel está en el corazón de la Patagonia andina, a 850 metros sobre el nivel del mar.
          Los cielos del Chubut tienen una transparencia y oscuridad excepcionales: baja humedad,
          poca contaminación lumínica, y noches de visibilidad astronómica clase 2 en la escala Bortle.
          El 6 de febrero cae en el verano patagónico: probabilidad estadística de cielo despejado superior al 80%.
        </p>
        <p className="text-base leading-relaxed mb-6" style={{ color: 'rgba(255,255,255,0.6)' }}>
          Pueblo Carao es una aldea de montaña con raíces galesas en las afueras de Esquel. Fue fundada
          por colonos que llegaron a fines del siglo XIX buscando preservar su lengua y cultura.
          El dragón rojo —Y Ddraig Goch— es el símbolo nacional de Gales. En Pueblo Carao, hay uno de hierro.
        </p>
        {/* Google Maps embed */}
        <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d50000!2d-71.3187!3d-42.9063!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x961b4462a79f5cd7%3A0x30e7d2e75e44f030!2sEsquel%2C%20Chubut!5e0!3m2!1ses!2sar!4v1620000000000"
            width="100%"
            height="280"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Ubicación Pueblo Carao, Esquel"
          />
        </div>
      </div>

      {/* Galería */}
      <div className="mb-4">
        <h2 className="text-white font-bold text-lg uppercase tracking-wide mb-2">Galería</h2>
        <p className="text-xs mb-5" style={{ color: 'rgba(255,255,255,0.3)' }}>
          Fotos del lugar y ediciones anteriores
        </p>
        <div className="grid grid-cols-3 gap-2">
          {GALLERY_IMAGES.map((query, i) => (
            <div
              key={i}
              className="aspect-square rounded-xl overflow-hidden"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <img
                src={`https://source.unsplash.com/300x300/?${query}&sig=${i}`}
                alt={query.replace(/\+/g, ' ')}
                className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

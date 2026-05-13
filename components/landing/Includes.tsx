const items = [
  {
    emoji: '🍷',
    titulo: 'Picnic gourmet',
    descripcion:
      'Tabla de quesos y chacinados patagónicos, pan artesanal, postre de temporada y dos copas de vino de bodega local bajo las estrellas.',
  },
  {
    emoji: '🔭',
    titulo: 'Guía de astroturismo',
    descripcion:
      'Acompañamiento experto durante todo el eclipse: historia, ciencia y mitología del cielo patagónico en el evento más esperado del siglo.',
  },
  {
    emoji: '📱',
    titulo: 'App digital exclusiva',
    descripcion:
      'Realidad aumentada para identificar constelaciones, mapa interactivo del recorrido del eclipse y galería de fotos del evento en tiempo real.',
  },
  {
    emoji: '📜',
    titulo: 'Certificado de experiencia',
    descripcion:
      'Documento oficial impreso y digital que acredita tu presencia en uno de los eventos astronómicos más extraordinarios de los últimos 180 años en la región.',
  },
]

export default function Includes() {
  return (
    <section className="py-24 px-6" style={{ background: '#07070f' }}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <p
            className="text-xs font-semibold tracking-widest uppercase mb-5"
            style={{ color: '#d97706', letterSpacing: '0.25em' }}
          >
            La experiencia
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-white">
            ¿Qué incluye?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {items.map((item) => (
            <div
              key={item.titulo}
              className="p-8 rounded-2xl transition-all duration-300 hover:scale-[1.01]"
              style={{
                background: 'rgba(255,255,255,0.025)',
                border: '1px solid rgba(255,255,255,0.07)',
              }}
            >
              <div className="text-4xl mb-5">{item.emoji}</div>
              <h3 className="text-xl font-semibold text-white mb-3">
                {item.titulo}
              </h3>
              <p className="leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
                {item.descripcion}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

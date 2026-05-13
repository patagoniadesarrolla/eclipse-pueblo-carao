'use client'

import { useState } from 'react'
import { useScrollReveal } from '@/lib/useScrollReveal'

const faqs = [
  {
    pregunta: '¿Qué pasa si el clima no acompaña el día del eclipse?',
    respuesta:
      'Pueblo Carao está ubicado estratégicamente en una zona de baja nubosidad de Esquel. Ante condiciones adversas, tenemos planes de contingencia con ubicaciones alternativas cercanas. La experiencia completa y el acompañamiento experto están garantizados independientemente del clima.',
  },
  {
    pregunta: '¿Cómo llego a Pueblo Carao?',
    respuesta:
      'Esquel tiene aeropuerto propio (EQS - Aeropuerto Tehuelches) con vuelos directos desde Buenos Aires. También podés llegar en auto desde Bariloche en aproximadamente 4 horas. Al confirmar tu reserva te enviamos una guía detallada con todas las opciones de acceso.',
  },
  {
    pregunta: '¿Qué incluye exactamente el precio de $300 USD?',
    respuesta:
      'Incluye: desayuno buffet de bienvenida, presentación y guía durante todo el evento, acceso al punto de observación del eclipse, kit del evento (mapas + lentes solares certificados + merchandising exclusivo), y la fiesta de cierre Sol Fest con música, gastronomía, fotografía, arte y yoga. No incluye transporte ni alojamiento.',
  },
  {
    pregunta: '¿Cuántas personas habrá en el evento?',
    respuesta:
      'Para preservar la experiencia y garantizar atención personalizada, el evento está limitado a 40 personas. Cada guía atiende un máximo de 10 personas.',
  },
  {
    pregunta: '¿Cuál es la política de cancelación?',
    respuesta:
      'Podés cancelar sin cargo hasta 60 días antes del evento (7 de diciembre de 2026). Entre 60 y 30 días antes: reembolso del 50%. Con menos de 30 días: sin reembolso, pero podés transferir tu lugar a otra persona. En caso de cancelación por fuerza mayor, reembolsamos el 100%.',
  },
]

export default function FAQ() {
  const [abierto, setAbierto] = useState<number | null>(null)
  const { ref, visible } = useScrollReveal()

  return (
    <section className="py-24 px-6" style={{ background: 'var(--c-bg)' }}>
      <div className="max-w-3xl mx-auto">
        <div ref={ref} className="text-center mb-16">
          <p className={`reveal text-xs font-bold tracking-[0.3em] uppercase mb-4 ${visible ? 'in-view' : ''}`}
            style={{ color: '#dc2626' }}>
            Preguntas frecuentes
          </p>
          <h2 className={`reveal reveal-d1 text-3xl md:text-5xl font-bold text-white uppercase tracking-tight ${visible ? 'in-view' : ''}`}>
            FAQ
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="rounded-xl overflow-hidden"
              style={{
                background: 'rgba(255,255,255,0.02)',
                border: `1px solid ${abierto === index ? 'rgba(124,58,237,0.35)' : 'rgba(255,255,255,0.07)'}`,
                transition: 'border-color 0.2s',
              }}
            >
              <button
                onClick={() => setAbierto(abierto === index ? null : index)}
                className="w-full text-left px-6 py-5 flex items-start justify-between gap-6"
              >
                <span className="text-white font-medium leading-snug">{faq.pregunta}</span>
                <span className="flex-shrink-0 text-2xl font-light leading-none mt-0.5 transition-transform duration-200"
                  style={{ color: '#7c3aed', transform: abierto === index ? 'rotate(45deg)' : 'none' }}>
                  +
                </span>
              </button>

              {abierto === index && (
                <div className="px-6 pb-6 leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
                  {faq.respuesta}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

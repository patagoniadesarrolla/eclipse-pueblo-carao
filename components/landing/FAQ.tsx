'use client'

import { useState } from 'react'

const faqs = [
  {
    pregunta: '¿Qué pasa si el clima no acompaña el día del eclipse?',
    respuesta:
      'Pueblo Carao tiene más de 300 noches despejadas al año y está ubicado estratégicamente para minimizar la cobertura de nubes. Ante condiciones adversas, tenemos planes de contingencia con ubicaciones alternativas a menos de 50 km. La experiencia gourmet y el acompañamiento experto están garantizados independientemente del clima.',
  },
  {
    pregunta: '¿Cómo llego a Pueblo Carao?',
    respuesta:
      'El acceso más cómodo es volar al aeropuerto de Bariloche (BRC), a aproximadamente 2 horas en auto. También se puede llegar desde El Bolsón en 45 minutos. Al confirmar tu reserva, te enviamos una guía detallada con todas las opciones de acceso y traslado.',
  },
  {
    pregunta: '¿Qué incluye exactamente el precio de $300 USD?',
    respuesta:
      'Incluye: picnic gourmet completo (tabla de quesos y chacinados, pan artesanal, postre y 2 copas de vino de bodega local), guía de astroturismo durante toda la noche del eclipse, acceso a la app digital exclusiva con realidad aumentada, certificado de experiencia impreso y digital, y seguro de responsabilidad civil. No incluye transporte ni alojamiento.',
  },
  {
    pregunta: '¿Cuántas personas habrá en el evento?',
    respuesta:
      'Para preservar la experiencia premium y garantizar atención personalizada, el evento está limitado a 40 personas. Cada guía atiende un máximo de 10 personas, asegurando tiempo de calidad con cada participante.',
  },
  {
    pregunta: '¿Cuál es la política de cancelación?',
    respuesta:
      'Podés cancelar sin cargo hasta 60 días antes del evento (22 de mayo de 2027). Entre 60 y 30 días antes: reembolso del 50%. Con menos de 30 días: sin reembolso, pero podés transferir tu lugar a otra persona con previo aviso. En caso de cancelación por fuerza mayor, reembolsamos el 100%.',
  },
]

export default function FAQ() {
  const [abierto, setAbierto] = useState<number | null>(null)

  return (
    <section className="py-24 px-6" style={{ background: '#07070f' }}>
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <p
            className="text-xs font-semibold tracking-widest uppercase mb-5"
            style={{ color: '#d97706', letterSpacing: '0.25em' }}
          >
            Preguntas frecuentes
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-white">FAQ</h2>
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
                <span className="text-white font-medium leading-snug">
                  {faq.pregunta}
                </span>
                <span
                  className="flex-shrink-0 text-2xl font-light leading-none mt-0.5 transition-transform duration-200"
                  style={{
                    color: '#7c3aed',
                    transform: abierto === index ? 'rotate(45deg)' : 'none',
                  }}
                >
                  +
                </span>
              </button>

              {abierto === index && (
                <div
                  className="px-6 pb-6 leading-relaxed"
                  style={{ color: 'rgba(255,255,255,0.55)' }}
                >
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

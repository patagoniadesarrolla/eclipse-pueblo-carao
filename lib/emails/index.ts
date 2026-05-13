import { bienvenidaEmail } from './bienvenida'
import { preparacion30dEmail } from './preparacion-30d'
import { preparacion7dEmail } from './preparacion-7d'
import { diaEventoEmail } from './dia-del-evento'
import { postEventoEmail } from './post-evento'

/* ── Metadata para el dashboard ──────────────────────────────────────────── */

export const EMAIL_TEMPLATES = [
  {
    key: 'bienvenida',
    name: 'Bienvenida',
    description: 'Confirmación de compra + credenciales de acceso a Mi Experiencia.',
    trigger: 'Automático · Al confirmar pago en Stripe',
    emoji: '🎉',
  },
  {
    key: 'preparacion_30d',
    name: 'Preparación · 30 días',
    description: 'Recordatorio del evento y link a la checklist de preparación.',
    trigger: 'Manual o programado · 30 días antes',
    emoji: '📖',
  },
  {
    key: 'preparacion_7d',
    name: 'Preparación · 7 días',
    description: 'Instrucciones finales: hora, punto de encuentro, qué llevar.',
    trigger: 'Manual o programado · 7 días antes',
    emoji: '🗺️',
  },
  {
    key: 'dia_evento',
    name: 'Día del evento',
    description: 'Recordatorio del día: horarios, contacto del guía, items esenciales.',
    trigger: 'Manual o programado · Día del evento',
    emoji: '🌑',
  },
  {
    key: 'post_evento',
    name: 'Post-evento',
    description: 'Agradecimiento, link a galería de fotos e invitación a dejar reseña.',
    trigger: 'Manual o programado · 48 hs después',
    emoji: '📷',
  },
] as const

export type TemplateKey = typeof EMAIL_TEMPLATES[number]['key']

/* ── Defaults compartidos ─────────────────────────────────────────────────── */

const DEFAULTS = {
  fecha_evento: '6 de febrero de 2027',
  hora_encuentro: '9:00 hs',
  punto_encuentro: 'Pueblo Carao, Esquel — acceso principal',
  contacto_emergencia: '+54 9 294 XXX-XXXX',
  checklist_url: `${process.env.NEXT_PUBLIC_APP_URL ?? 'https://eclipsepuebloca rao.com'}/mi-experiencia`,
  galeria_url: `${process.env.NEXT_PUBLIC_APP_URL ?? 'https://eclipsepuebloca rao.com'}/mi-experiencia/galeria`,
  review_url: `${process.env.NEXT_PUBLIC_APP_URL ?? 'https://eclipsepuebloca rao.com'}/resena`,
  url_app: `${process.env.NEXT_PUBLIC_APP_URL ?? 'https://eclipsepuebloca rao.com'}/mi-experiencia`,
}

/* ── Render por key ────────────────────────────────────────────────────────── */

export function renderTemplate(
  key: string,
  overrides: { nombre?: string; email?: string } = {}
): { subject: string; html: string } | null {
  const nombre = overrides.nombre ?? 'Viajero'
  const email  = overrides.email  ?? 'comprador@ejemplo.com'

  switch (key) {
    case 'bienvenida':
      return bienvenidaEmail({ nombre, email, password_temporal: 'Ej4mplo', ...DEFAULTS })

    case 'preparacion_30d':
      return preparacion30dEmail({ nombre, ...DEFAULTS })

    case 'preparacion_7d':
      return preparacion7dEmail({ nombre, ...DEFAULTS })

    case 'dia_evento':
      return diaEventoEmail({ nombre, ...DEFAULTS })

    case 'post_evento':
      return postEventoEmail({ nombre, ...DEFAULTS })

    default:
      return null
  }
}

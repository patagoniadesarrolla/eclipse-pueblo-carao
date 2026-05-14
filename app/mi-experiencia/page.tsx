import { createServerSupabaseClient } from '@/lib/supabase-server'
import BuyerCountdown from '@/components/buyer/BuyerCountdown'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

const NAV_CARDS = [
  { href: '/mi-experiencia/eclipse',       icon: '🌑', label: 'El eclipse',    desc: 'El fenómeno, el lugar, la historia' },
  { href: '/mi-experiencia/preparate',     icon: '🎒', label: 'Preparate',     desc: 'Checklist, menú y cómo llegar'      },
  { href: '/mi-experiencia/reserva',       icon: '🎫', label: 'Tu reserva',    desc: 'Datos de compra y voucher'          },
  { href: '/mi-experiencia/notificaciones', icon: '🔔', label: 'Notificaciones', desc: 'Avisos y novedades del evento'     },
]

export default async function BuyerHomePage() {
  const supabase = createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('buyer_profiles')
    .select('name, checklist_items, onboarding_completed')
    .eq('user_id', user!.id)
    .single()

  const checklist = (profile?.checklist_items ?? {}) as Record<string, boolean>
  const TOTAL_ITEMS = 10
  const checked = Object.values(checklist).filter(Boolean).length
  const progressPct = Math.round((checked / TOTAL_ITEMS) * 100)

  // Notificaciones no leídas
  const { count: unread } = await supabase
    .from('notifications')
    .select('id', { count: 'exact', head: true })
    .not('id', 'in', supabase.from('notification_reads').select('notification_id').eq('user_id', user!.id))

  const nombre = profile?.name?.split(' ')[0] ?? 'Viajero'

  return (
    <div className="px-6 py-10 max-w-2xl mx-auto">

      {/* Saludo */}
      <div className="mb-10">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] mb-2" style={{ color: '#dc2626' }}>
          Bienvenid@
        </p>
        <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
          Hola, {nombre}.
        </h1>
        <p className="mt-2 text-lg" style={{ color: 'rgba(255,255,255,0.45)' }}>
          Tu lugar en el eclipse está confirmado.
        </p>
      </div>

      {/* Countdown */}
      <div className="mb-10 p-6 rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
        <p className="text-xs font-bold uppercase tracking-widest text-center mb-5" style={{ color: 'rgba(255,255,255,0.3)' }}>
          Faltan
        </p>
        <BuyerCountdown />
        <p className="text-center text-xs mt-4 font-semibold uppercase tracking-widest" style={{ color: '#dc2626' }}>
          6 de febrero · 2027 · 11:52 hs
        </p>
      </div>

      {/* Progreso */}
      <div className="mb-8 p-5 rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="flex justify-between items-center mb-2">
          <p className="text-xs font-bold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Preparación
          </p>
          <p className="text-xs font-bold" style={{ color: '#a78bfa' }}>
            {checked} de {TOTAL_ITEMS} ítems listos
          </p>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${progressPct}%`, background: 'linear-gradient(to right, #7c3aed, #a78bfa)' }}
          />
        </div>
      </div>

      {/* Nav cards */}
      <div className="grid grid-cols-2 gap-3">
        {NAV_CARDS.map(({ href, icon, label, desc }) => (
          <Link
            key={href}
            href={href}
            className="relative rounded-2xl p-5 transition-all duration-200 hover:scale-[1.02]"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <span className="text-2xl block mb-3">{icon}</span>
            <p className="text-white font-bold text-sm mb-0.5">{label}</p>
            <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.35)' }}>{desc}</p>
            {href.includes('notificaciones') && (unread ?? 0) > 0 && (
              <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
                {(unread ?? 0) > 9 ? '9+' : unread}
              </span>
            )}
          </Link>
        ))}
      </div>
    </div>
  )
}

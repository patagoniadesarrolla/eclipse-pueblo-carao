'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

interface NavItem {
  href: string
  label: string
  icon: string
}

const NAV: NavItem[] = [
  { href: '/mi-experiencia',              label: 'Inicio',        icon: '🌒' },
  { href: '/mi-experiencia/eclipse',      label: 'El eclipse',    icon: '☀️' },
  { href: '/mi-experiencia/preparate',    label: 'Preparate',     icon: '🎒' },
  { href: '/mi-experiencia/reserva',      label: 'Mi reserva',    icon: '🎫' },
  { href: '/mi-experiencia/notificaciones', label: 'Avisos',      icon: '🔔' },
]

export default function BuyerNav({ unreadCount = 0 }: { unreadCount?: number }) {
  const pathname = usePathname()
  const router   = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/mi-experiencia/login')
    router.refresh()
  }

  const isActive = (href: string) =>
    href === '/mi-experiencia' ? pathname === href : pathname.startsWith(href)

  return (
    <>
      {/* ── Desktop sidebar ─────────────────────────────────────────────── */}
      <aside
        className="hidden md:flex flex-col w-20 flex-shrink-0 py-6 items-center gap-1"
        style={{ borderRight: '1px solid rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(12px)', position: 'relative', zIndex: 10 }}
      >
        <div className="mb-6 text-2xl">🌒</div>
        {NAV.map(({ href, label, icon }) => (
          <Link
            key={href}
            href={href}
            title={label}
            className="relative flex flex-col items-center gap-1 w-14 py-3 rounded-xl transition-all duration-150"
            style={{
              background: isActive(href) ? 'rgba(124,58,237,0.15)' : 'transparent',
              border: isActive(href) ? '1px solid rgba(124,58,237,0.3)' : '1px solid transparent',
            }}
          >
            <span className="text-lg leading-none">{icon}</span>
            <span className="text-[9px] font-semibold uppercase tracking-wide"
              style={{ color: isActive(href) ? '#a78bfa' : 'rgba(255,255,255,0.3)' }}>
              {label}
            </span>
            {href.includes('notificaciones') && unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </Link>
        ))}
        <div className="mt-auto">
          <button
            onClick={handleLogout}
            title="Salir"
            className="flex flex-col items-center gap-1 w-14 py-3 rounded-xl transition-all"
            style={{ color: 'rgba(255,255,255,0.2)' }}
          >
            <span className="text-lg">🚪</span>
            <span className="text-[9px] font-semibold uppercase tracking-wide">Salir</span>
          </button>
        </div>
      </aside>

      {/* ── Mobile bottom bar ────────────────────────────────────────────── */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 flex z-50"
        style={{ background: 'rgba(5,5,8,0.95)', backdropFilter: 'blur(16px)', borderTop: '1px solid rgba(255,255,255,0.06)', paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        {NAV.map(({ href, label, icon }) => (
          <Link
            key={href}
            href={href}
            className="relative flex-1 flex flex-col items-center py-3 gap-0.5 transition-all"
          >
            <span className="text-xl leading-none">{icon}</span>
            <span className="text-[9px] font-semibold uppercase tracking-wide"
              style={{ color: isActive(href) ? '#a78bfa' : 'rgba(255,255,255,0.3)' }}>
              {label}
            </span>
            {href.includes('notificaciones') && unreadCount > 0 && (
              <span className="absolute top-1.5 right-1/4 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </Link>
        ))}
      </nav>
    </>
  )
}

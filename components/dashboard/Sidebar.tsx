'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'

interface NavItem {
  label: string
  href: string
  emoji: string
  disabled?: boolean
  badge?: string
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Leads', href: '/dashboard/leads', emoji: '👥' },
  { label: 'Órdenes', href: '#', emoji: '📋', disabled: true, badge: 'Próximamente' },
  { label: 'Compradores', href: '#', emoji: '🛒', disabled: true },
  { label: 'Estadísticas', href: '#', emoji: '📊', disabled: true },
  { label: 'Emails', href: '#', emoji: '📧', disabled: true },
  { label: 'Notificaciones', href: '#', emoji: '🔔', disabled: true },
  { label: 'Equipo', href: '#', emoji: '👤', disabled: true },
]

function NavContent({
  userEmail,
  onLogout,
}: {
  userEmail: string
  onLogout: () => void
}) {
  const pathname = usePathname()

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-gray-800/60">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🌒</span>
          <div>
            <p className="text-white font-bold text-sm leading-tight">Eclipse Carao</p>
            <p className="text-gray-500 text-xs">Administración</p>
          </div>
        </div>
      </div>

      {/* Navegación */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href

          if (item.disabled) {
            return (
              <div
                key={item.label}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-not-allowed select-none"
                title="Próximamente disponible"
              >
                <span className="text-base opacity-30">{item.emoji}</span>
                <span className="text-gray-600 text-sm flex-1">{item.label}</span>
                {item.badge && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-gray-800 text-gray-500">
                    {item.badge}
                  </span>
                )}
              </div>
            )
          }

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 ${
                isActive
                  ? 'bg-violet-600/15 border border-violet-500/25 text-violet-300'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/60 border border-transparent'
              }`}
            >
              <span className="text-base">{item.emoji}</span>
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Usuario + logout */}
      <div className="px-3 py-4 border-t border-gray-800/60 space-y-1">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-7 h-7 rounded-full bg-violet-600/20 border border-violet-500/20 flex items-center justify-center flex-shrink-0">
            <span className="text-xs text-violet-400">
              {userEmail.charAt(0).toUpperCase()}
            </span>
          </div>
          <p className="text-gray-400 text-xs truncate flex-1">{userEmail}</p>
        </div>
        <button
          onClick={onLogout}
          className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-lg text-gray-500 hover:text-white hover:bg-gray-800/60 transition-all text-sm"
        >
          <span className="text-base">🚪</span>
          Cerrar sesión
        </button>
      </div>
    </div>
  )
}

export default function Sidebar({ userEmail }: { userEmail: string }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/dashboard/login')
    router.refresh()
  }

  return (
    <>
      {/* Botón hamburguesa mobile */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg border border-gray-700 bg-gray-900 text-white"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Abrir menú"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M2 4h14M2 9h14M2 14h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </button>

      {/* Overlay mobile */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/60"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar mobile */}
      <div
        className={`md:hidden fixed left-0 top-0 bottom-0 z-40 w-64 bg-gray-950 border-r border-gray-800 transition-transform duration-200 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <NavContent userEmail={userEmail} onLogout={handleLogout} />
      </div>

      {/* Sidebar desktop */}
      <aside className="hidden md:flex flex-col w-60 bg-gray-950 border-r border-gray-800 flex-shrink-0">
        <NavContent userEmail={userEmail} onLogout={handleLogout} />
      </aside>
    </>
  )
}

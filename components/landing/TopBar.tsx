'use client'

import { useTheme } from '@/lib/ThemeContext'
import { useLanguage, useT, type Locale } from '@/lib/i18n'

export default function TopBar() {
  const { theme, toggle } = useTheme()
  const { locale, setLocale, locales, labels } = useLanguage()
  const t = useT<typeof import('@/messages/es.json')['topbar']>('topbar')
  const isLight = theme === 'light'

  return (
    <div style={{ position: 'fixed', top: 0, right: 0, zIndex: 50, padding: '12px 20px', display: 'flex', gap: '8px', alignItems: 'center' }}>

      {/* Selector de idioma */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        borderRadius: '8px',
        border: '1px solid var(--c-nav-bd)',
        background: 'var(--c-nav-bg)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        overflow: 'hidden',
      }}>
        {locales.map((l) => (
          <button
            key={l}
            onClick={() => setLocale(l as Locale)}
            style={{
              padding: '6px 10px',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.08em',
              cursor: 'pointer',
              border: 'none',
              background: locale === l ? 'rgba(124,58,237,0.25)' : 'transparent',
              color: locale === l ? '#a78bfa' : 'var(--c-text-2)',
              transition: 'all 0.15s ease',
            }}
          >
            {labels[l as Locale]}
          </button>
        ))}
      </div>

      {/* Toggle de tema */}
      <button
        onClick={toggle}
        title={isLight ? t.dark : t.light}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 14px',
          borderRadius: '8px',
          border: '1px solid var(--c-nav-bd)',
          background: 'var(--c-nav-bg)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          cursor: 'pointer',
          fontSize: '12px',
          fontWeight: 600,
          letterSpacing: '0.05em',
          color: 'var(--c-text-2)',
          transition: 'all 0.2s ease',
        }}
      >
        {isLight ? t.dark : t.light}
      </button>
    </div>
  )
}

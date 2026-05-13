'use client'

import { useTheme } from '@/lib/ThemeContext'

export default function TopBar() {
  const { theme, toggle } = useTheme()
  const isLight = theme === 'light'

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      right: 0,
      zIndex: 50,
      padding: '12px 20px',
    }}>
      <button
        onClick={toggle}
        title={isLight ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro'}
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
        onMouseEnter={e => {
          (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(124,58,237,0.5)'
          ;(e.currentTarget as HTMLButtonElement).style.color = 'var(--c-text)'
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--c-nav-bd)'
          ;(e.currentTarget as HTMLButtonElement).style.color = 'var(--c-text-2)'
        }}
      >
        {isLight ? 'Oscuro' : 'Claro'}
      </button>
    </div>
  )
}

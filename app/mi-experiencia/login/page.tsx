'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export default function BuyerLoginPage() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const [resetSent, setResetSent] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error: err } = await supabase.auth.signInWithPassword({ email, password })
    if (err) {
      setError('Email o contraseña incorrectos.')
      setLoading(false)
    } else {
      router.push('/mi-experiencia')
      router.refresh()
    }
  }

  const handleReset = async () => {
    if (!email) { setError('Ingresá tu email primero.'); return }
    const supabase = createClient()
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/mi-experiencia/reset`,
    })
    setResetSent(true)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ background: '#050508' }}>
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="text-4xl mb-3">🌒</div>
          <p className="text-white font-bold text-sm uppercase tracking-[0.2em]">Eclipse · Pueblo Carao</p>
          <p className="text-xs mt-1 font-semibold" style={{ color: '#dc2626', letterSpacing: '0.15em' }}>6 DE FEBRERO · 2027</p>
        </div>

        {/* Form */}
        {resetSent ? (
          <div className="text-center p-6 rounded-2xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <p className="text-2xl mb-3">📬</p>
            <p className="text-white font-semibold mb-2">Revisá tu email</p>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Te enviamos un link para restablecer tu contraseña.
            </p>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider block mb-1.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-xl px-4 py-3 text-white text-sm focus:outline-none"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                placeholder="tu@email.com"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider block mb-1.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-xl px-4 py-3 text-white text-sm focus:outline-none"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                placeholder="••••••••"
              />
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-white font-bold text-sm uppercase tracking-widest transition-all disabled:opacity-50"
              style={{ background: '#7c3aed' }}
            >
              {loading ? 'Ingresando…' : 'Ingresar'}
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="w-full text-center text-xs transition-colors"
              style={{ color: 'rgba(255,255,255,0.3)' }}
            >
              ¿Olvidaste tu contraseña?
            </button>
          </form>
        )}

        <p className="text-center text-xs mt-8" style={{ color: 'rgba(255,255,255,0.2)' }}>
          Tu acceso fue enviado al email con el que compraste tu lugar
        </p>
      </div>
    </div>
  )
}
